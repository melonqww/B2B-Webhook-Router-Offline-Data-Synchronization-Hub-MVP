import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config';

export function verifyWebhookSignature(req: Request, res: Response, next: NextFunction): void {
  const signature = req.headers['x-webhook-signature'] as string;
  if (!signature) {
    res.status(401).json({ error: 'Missing x-webhook-signature header' });
    return;
  }

  const timestamp = req.headers['x-webhook-timestamp'] as string;
  if (!timestamp) {
    res.status(401).json({ error: 'Missing x-webhook-timestamp header' });
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300) {
    res.status(401).json({ error: 'Webhook timestamp expired or invalid' });
    return;
  }

  const payload = JSON.stringify(req.body);
  const signedContent = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(signedContent)
    .digest('hex');

  const received = signature.startsWith('sha256=') ? signature.slice(7) : signature;

  if (!crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expectedSignature))) {
    res.status(401).json({ error: 'Invalid webhook signature' });
    return;
  }

  next();
}
