import { pool } from '../db';
import fs from 'fs';
import path from 'path';

async function setupTestDB() {
  const migrationsDir = path.resolve(__dirname, '../../../database/migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
  }

  const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['test@b2bhub.com']);
  if (adminCheck.rows.length === 0) {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('TestPass123!', 12);
    await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
      ['test@b2bhub.com', hash, 'Test User', 'admin']
    );
  }

  const managerCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['manager@b2bhub.com']);
  if (managerCheck.rows.length === 0) {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('Manager123!', 12);
    await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
      ['manager@b2bhub.com', hash, 'Manager User', 'manager']
    );
  }
}

setupTestDB().catch((err) => {
  console.error('Test DB setup failed:', err);
  process.exit(1);
});

export { pool };
