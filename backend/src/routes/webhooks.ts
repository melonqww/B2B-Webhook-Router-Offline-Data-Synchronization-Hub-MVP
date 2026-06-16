import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { config } from '../config';
import { webhookAuth } from '../middleware/auth';
import { verifyWebhookSignature } from '../middleware/webhookSignature';
import { validate } from '../middleware/validate';
import { webhookLimiter } from '../middleware/rateLimit';

const router = Router();

const whatsappPayloadSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(z.object({
    id: z.string(),
    changes: z.array(z.object({
      value: z.object({
        messaging_product: z.string().optional(),
        metadata: z.object({
          display_phone_number: z.string().optional(),
          phone_number_id: z.string().optional(),
        }).optional(),
        contacts: z.array(z.object({
          profile: z.object({ name: z.string() }).optional(),
          wa_id: z.string().optional(),
        })).optional(),
        messages: z.array(z.object({
          from: z.string(),
          id: z.string(),
          timestamp: z.string(),
          type: z.string(),
          text: z.object({ body: z.string() }).optional(),
          interactive: z.object({
            type: z.string(),
            button_reply: z.object({ id: z.string(), title: z.string() }).optional(),
            nfm_reply: z.object({ response_json: z.string() }).optional(),
          }).optional(),
        })).optional(),
      }).optional(),
      field: z.string().optional(),
    })),
  })),
});

router.get('/', webhookLimiter, (req: Request, res: Response): void => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`Webhook handshake: mode=${mode}, token=${token}`);

  if (mode === 'subscribe' && token === config.webhookVerifyToken) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
    return;
  }

  res.status(403).send('Verification failed');
});

router.post('/',
  webhookLimiter,
  webhookAuth,
  verifyWebhookSignature,
  validate(whatsappPayloadSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = req.body;

      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          const value = change.value || {};
          const messages = value.messages || [];

          for (const msg of messages) {
            const messageType = msg.type || 'unknown';
            let messageBody: string | null = null;

            if (msg.text) {
              messageBody = msg.text.body;
            } else if (msg.interactive?.button_reply) {
              messageBody = msg.interactive.button_reply.title;
            } else if (msg.interactive?.nfm_reply) {
              messageBody = msg.interactive.nfm_reply.response_json;
            }

            const contactName = value.contacts?.[0]?.profile?.name || 'Unknown';
            const waId = msg.from || value.contacts?.[0]?.wa_id || 'unknown';

            await query(
              `INSERT INTO webhook_events (source, event_type, payload)
               VALUES ($1, $2, $3)`,
              ['whatsapp', `message.${messageType}`, JSON.stringify({
                wa_id: waId,
                contact_name: contactName,
                message_id: msg.id,
                message_type: messageType,
                message_body: messageBody,
                timestamp: msg.timestamp,
                phone_number_id: value.metadata?.phone_number_id,
                display_phone_number: value.metadata?.display_phone_number,
                entry_id: entry.id,
              })]
            );

            console.log(`Webhook processed: ${waId} -> ${messageType}: ${messageBody?.substring(0, 100)}`);
          }
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('Webhook processing error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/events', async (_req: Request, res: Response): Promise<void> => {
  const result = await query(
    'SELECT id, source, event_type, payload, created_at FROM webhook_events ORDER BY created_at DESC LIMIT 50'
  );
  res.json(result.rows);
});

export default router;
