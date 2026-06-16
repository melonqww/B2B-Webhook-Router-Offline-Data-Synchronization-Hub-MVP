import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

export const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' },
});

export const webhookLimiter = rateLimit({
  windowMs: config.rateLimit.webhook.windowMs,
  max: config.rateLimit.webhook.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many webhook requests' },
});

export const syncLimiter = rateLimit({
  windowMs: config.rateLimit.sync.windowMs,
  max: config.rateLimit.sync.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sync requests' },
});
