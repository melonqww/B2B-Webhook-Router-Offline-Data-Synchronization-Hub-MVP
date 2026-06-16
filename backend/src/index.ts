import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { globalLimiter } from './middleware/rateLimit';
import webhookRoutes from './routes/webhooks';
import syncRoutes from './routes/sync';
import propertyRoutes from './routes/properties';
import authRoutes from './routes/auth';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(globalLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api', syncRoutes);
app.use('/api/properties', propertyRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`⚡ B2B Automation Hub backend running on http://localhost:${config.port}`);
    console.log(`   Health: http://localhost:${config.port}/api/health`);
    console.log(`   Auth: POST http://localhost:${config.port}/api/auth/login`);
    console.log(`   Webhooks: POST/GET http://localhost:${config.port}/api/webhooks`);
    console.log(`   Sync: POST http://localhost:${config.port}/api/sync`);
    console.log(`   Properties: GET http://localhost:${config.port}/api/properties/search`);
  });
}

export default app;
