import request from 'supertest';
import app from '../index';
import { pool } from './setup';

afterAll(async () => {
  await pool.query('DELETE FROM ledger_entries');
});

const validEntry = {
  client_id: 'test_client_001',
  amount: 1500.00,
  currency: 'USD',
  description: 'Test ledger entry',
  client_created_at: new Date().toISOString(),
};

describe('Sync Routes', () => {
  describe('POST /api/sync', () => {
    it('syncs a single entry', async () => {
      const res = await request(app)
        .post('/api/sync')
        .send({ entries: [validEntry] });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'synced');
      expect(res.body).toHaveProperty('count', 1);
      expect(res.body.ids).toHaveLength(1);
    });

    it('syncs multiple entries', async () => {
      const entries = [
        validEntry,
        { ...validEntry, client_id: 'test_client_002', amount: 2500.00 },
        { ...validEntry, client_id: 'test_client_003', amount: 3500.00 },
      ];

      const res = await request(app)
        .post('/api/sync')
        .send({ entries });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('count', 3);
      expect(res.body.ids).toHaveLength(3);
    });

    it('rejects empty entries array', async () => {
      const res = await request(app)
        .post('/api/sync')
        .send({ entries: [] });

      expect(res.status).toBe(400);
    });

    it('rejects entry with negative amount', async () => {
      const res = await request(app)
        .post('/api/sync')
        .send({ entries: [{ ...validEntry, amount: -100 }] });

      expect(res.status).toBe(400);
    });

    it('rejects entry without required fields', async () => {
      const res = await request(app)
        .post('/api/sync')
        .send({ entries: [{ amount: 100 }] });

      expect(res.status).toBe(400);
    });

    it('rejects entry with missing client_id', async () => {
      const res = await request(app)
        .post('/api/sync')
        .send({ entries: [{ amount: 100, client_created_at: new Date().toISOString() }] });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/ledger', () => {
    it('returns synced entries', async () => {
      const res = await request(app).get('/api/ledger');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('client_id');
      expect(res.body[0]).toHaveProperty('amount');
      expect(res.body[0]).toHaveProperty('status', 'synced');
    });
  });
});
