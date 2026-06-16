import request from 'supertest';
import app from '../index';
import { pool } from './setup';

const testUser = {
  email: `test_${Date.now()}@example.com`,
  password: 'StrongPass123!',
  name: 'Test User',
};

let accessToken = '';

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('role', 'viewer');
      expect(res.body.user).not.toHaveProperty('password_hash');

      accessToken = res.body.accessToken;
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });

    it('rejects duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });

    it('rejects invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-email', password: 'StrongPass123!', name: 'Test' });

      expect(res.status).toBe(400);
    });

    it('rejects short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new@example.com', password: '123', name: 'Test' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('role', 'viewer');

      accessToken = res.body.accessToken;
    });

    it('rejects wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrong' });

      expect(res.status).toBe(401);
    });

    it('rejects non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'noone@example.com', password: 'StrongPass123!' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('rejects without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
    });

    it('rejects invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('refreshes token with valid cookie', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      const cookies = loginRes.headers['set-cookie'];
      const cookie = Array.isArray(cookies) ? cookies[0] : cookies;

      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie || '');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('rejects without cookie', async () => {
      const res = await request(app).post('/api/auth/refresh');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('logs out successfully', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'logged_out');
    });
  });
});
