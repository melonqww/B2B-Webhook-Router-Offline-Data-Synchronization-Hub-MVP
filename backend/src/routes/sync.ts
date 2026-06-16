import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { validate } from '../middleware/validate';

const router = Router();

const ledgerEntrySchema = z.object({
  client_id: z.string().min(1),
  amount: z.number().positive().multipleOf(0.01),
  currency: z.string().length(3).default('USD'),
  description: z.string().max(500).optional(),
  client_created_at: z.string().datetime(),
});

const batchSyncSchema = z.object({
  entries: z.array(ledgerEntrySchema).min(1).max(100),
});

router.post('/sync', validate(batchSyncSchema), async (req: Request, res: Response): Promise<void> => {
  const client = (await import('../db')).pool;

  try {
    await client.query('BEGIN');

    const { entries } = req.body;
    const synced: string[] = [];

    for (const entry of entries) {
      const result = await client.query(
        `INSERT INTO ledger_entries (client_id, amount, currency, description, status, synced_at, client_created_at)
         VALUES ($1, $2, $3, $4, 'synced', NOW(), $5)
         RETURNING id`,
        [entry.client_id, entry.amount, entry.currency, entry.description || null, entry.client_created_at]
      );
      synced.push(result.rows[0].id);
    }

    await client.query('COMMIT');

    res.status(201).json({
      status: 'synced',
      count: synced.length,
      ids: synced,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

router.get('/ledger', async (_req: Request, res: Response): Promise<void> => {
  const result = await query(
    'SELECT id, client_id, amount, currency, description, status, synced_at, client_created_at, created_at FROM ledger_entries ORDER BY created_at DESC LIMIT 100'
  );
  res.json(result.rows);
});

export default router;
