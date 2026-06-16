import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { pool } from './index';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function migrate() {
  const migrationsDir = path.resolve(__dirname, '../../../database/migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    console.log(`  ✓ ${file} applied`);
  }

  const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@b2bhub.com']);
  if (adminCheck.rows.length === 0) {
    const hash = await hashPassword('Admin123!');
    await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
      ['admin@b2bhub.com', hash, 'Admin User', 'admin']
    );
    console.log('  ✓ Admin user seeded (admin@b2bhub.com / Admin123!)');

    const managerHash = await hashPassword('Manager123!');
    await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
      ['manager@b2bhub.com', managerHash, 'Manager User', 'manager']
    );
    console.log('  ✓ Manager user seeded (manager@b2bhub.com / Manager123!)');
  }

  await pool.end();
  console.log('All migrations complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
