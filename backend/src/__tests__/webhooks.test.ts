import request from 'supertest';
import crypto from 'crypto';
import app from '../index';
import { config } from '../config';
import { pool } from './setup';

afterAll(async () => {
  await pool.query('DELETE FROM webhook_events');
});

function signPayload(payload: object): { timestamp: string; signature: string } {
  const timestamp = Math.floor(Date.now() / 1000);
  const body = JSON.stringify(payload);
  const signedContent = `${timestamp}.${body}`;
  const signature = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(signedContent)
    .digest('hex');
  return { timestamp: String(timestamp), signature: `sha256=${signature}` } as any;
}

const validPayload = {
  object: 'whatsapp_business_account',
  entry: [{
    id: '123456789',
    changes: [{
      value: {
        metadata: { display_phone_number: '15551234567', phone_number_id: '987654321' },
        contacts: [{ profile: { name: 'John Doe' }, wa_id: '15559876543' }],
        messages: [{
          from: '15559876543',
          id: 'wamid.ABC123',
          timestamp: '1710000000',
          type: 'text',
          text: { body: 'Test message' },
        }],
      },
      field: 'messages',
    }],
  }],
};

describe('Webhook Routes', () => {
  describe('GET /api/webhooks (Verification Handshake)', () => {
    it('verifies with correct token', async () => {
      const res = await request(app)
        .get('/api/webhooks')
        .query({ 'hub.mode': 'subscribe', 'hub.verify_token': config.webhookVerifyToken, 'hub.challenge': 'challenge_123' });

      expect(res.status).toBe(200);
      expect(res.text).toBe('challenge_123');
    });

    it('rejects with wrong token', async () => {
      const res = await request(app)
        .get('/api/webhooks')
        .query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'wrong', 'hub.challenge': 'challenge_123' });

      expect(res.status).toBe(403);
    });

    it('rejects without mode', async () => {
      const res = await request(app)
        .get('/api/webhooks')
        .query({ 'hub.verify_token': config.webhookVerifyToken, 'hub.challenge': 'challenge_123' });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/webhooks (Event Ingestion)', () => {
    it('ingests a valid webhook event with signature', async () => {
      const { timestamp, signature } = signPayload(validPayload);

      const res = await request(app)
        .post('/api/webhooks')
        .set('Authorization', `Bearer ${config.webhookVerifyToken}`)
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(validPayload);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });

    it('rejects without authorization', async () => {
      const { timestamp, signature } = signPayload(validPayload);

      const res = await request(app)
        .post('/api/webhooks')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(validPayload);

      expect(res.status).toBe(401);
    });

    it('rejects without signature', async () => {
      const res = await request(app)
        .post('/api/webhooks')
        .set('Authorization', `Bearer ${config.webhookVerifyToken}`)
        .send(validPayload);

      expect(res.status).toBe(401);
    });

    it('rejects invalid signature', async () => {
      const payload = validPayload;
      const timestamp = Math.floor(Date.now() / 1000);

      const res = await request(app)
        .post('/api/webhooks')
        .set('Authorization', `Bearer ${config.webhookVerifyToken}`)
        .set('x-webhook-signature', 'sha256=invalid')
        .set('x-webhook-timestamp', String(timestamp))
        .send(payload);

      expect(res.status).toBe(401);
    });

    it('rejects invalid payload structure', async () => {
      const payload = { object: 'invalid' };
      const { timestamp, signature } = signPayload(payload);

      const res = await request(app)
        .post('/api/webhooks')
        .set('Authorization', `Bearer ${config.webhookVerifyToken}`)
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(payload);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/webhooks/events', () => {
    it('returns stored webhook events', async () => {
      const res = await request(app).get('/api/webhooks/events');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
