import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/b2b_hub',
  testDatabaseUrl: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/b2b_hub_test',
  webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN || 'supersecret_token_123',
  webhookSecret: process.env.WEBHOOK_SECRET || 'whsec_your_webhook_secret_here',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-production-abc123',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-production-xyz789',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
    refreshExpiresDays: 7,
  },
  rateLimit: {
    global: { windowMs: 60_000, max: 100 },
    auth: { windowMs: 60_000, max: 10 },
    webhook: { windowMs: 60_000, max: 30 },
    sync: { windowMs: 60_000, max: 60 },
  },
};
