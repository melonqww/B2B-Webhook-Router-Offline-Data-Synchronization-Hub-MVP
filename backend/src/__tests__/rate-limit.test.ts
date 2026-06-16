import request from 'supertest';
import app from '../index';

describe('Rate Limiting', () => {
  it('allows requests under the limit', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);

    const res2 = await request(app).get('/api/health');
    expect(res2.status).toBe(200);
  });
});
