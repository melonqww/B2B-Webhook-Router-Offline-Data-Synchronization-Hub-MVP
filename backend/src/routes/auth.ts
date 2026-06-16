import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { query } from '../db';
import { config } from '../config';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(255),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn } as SignOptions);
}

async function generateRefreshToken(userId: string): Promise<string> {
  const raw = crypto.randomBytes(64).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const expiresAt = new Date(Date.now() + config.jwt.refreshExpiresDays * 86400_000);

  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, hash, expiresAt]
  );

  return raw;
}

function setRefreshCookie(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: config.jwt.refreshExpiresDays * 86400_000,
  });
}

router.post('/register', validate(registerSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, passwordHash, name, 'viewer']
    );

    const user = result.rows[0];
    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(user.id);

    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await query(
      'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];
    if (!user.is_active) {
      res.status(403).json({ error: 'Account disabled' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(user.id);

    setRefreshCookie(res, refreshToken);
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = req.cookies?.refresh_token;
    if (!raw) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }

    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    const result = await query(
      `SELECT rt.id, rt.user_id, u.email, u.role, u.is_active
       FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.expires_at > NOW()`,
      [hash]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const row = result.rows[0];
    if (!row.is_active) {
      await query('DELETE FROM refresh_tokens WHERE user_id = $1', [row.user_id]);
      res.status(403).json({ error: 'Account disabled' });
      return;
    }

    await query('DELETE FROM refresh_tokens WHERE id = $1', [row.id]);

    const payload: TokenPayload = { userId: row.user_id, email: row.email, role: row.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(row.user_id);

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = req.cookies?.refresh_token;
    if (raw) {
      const hash = crypto.createHash('sha256').update(raw).digest('hex');
      await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [hash]);
    }
    res.clearCookie('refresh_token', { path: '/api/auth' });
    res.json({ status: 'logged_out' });
  } catch {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  const tokenUser = (req as any).user as TokenPayload;
  const result = await query(
    'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
    [tokenUser.userId]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: result.rows[0] });
});

export default router;
