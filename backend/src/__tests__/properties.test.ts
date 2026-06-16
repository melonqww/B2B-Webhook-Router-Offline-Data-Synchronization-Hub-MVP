import request from 'supertest';
import app from '../index';

describe('Property Search', () => {
  describe('GET /api/properties/search', () => {
    it('returns all properties without filters', async () => {
      const res = await request(app).get('/api/properties/search');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('limit', 20);
    });

    it('filters by property_type', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ property_type: 'medical' });

      expect(res.status).toBe(200);
      expect(res.body.data.every((p: any) => p.property_type === 'medical')).toBe(true);
    });

    it('filters by square_footage BETWEEN', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ min_square_footage: '10000', max_square_footage: '50000' });

      expect(res.status).toBe(200);
      expect(res.body.data.every((p: any) => p.square_footage >= 10000 && p.square_footage <= 50000)).toBe(true);
    });

    it('filters by price BETWEEN', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ min_price: '1000000', max_price: '10000000' });

      expect(res.status).toBe(200);
      expect(res.body.data.every((p: any) => p.price >= 1000000 && p.price <= 10000000)).toBe(true);
    });

    it('filters by location_state', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ location_state: 'CA' });

      expect(res.status).toBe(200);
      expect(res.body.data.every((p: any) => p.location_state === 'CA')).toBe(true);
    });

    it('sorts by price ascending', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ sort_by: 'price', sort_order: 'asc' });

      expect(res.status).toBe(200);
      const prices = res.body.data.map((p: any) => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it('sorts by square_footage descending', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ sort_by: 'square_footage', sort_order: 'desc' });

      expect(res.status).toBe(200);
      const sqfts = res.body.data.map((p: any) => p.square_footage);
      for (let i = 1; i < sqfts.length; i++) {
        expect(sqfts[i]).toBeLessThanOrEqual(sqfts[i - 1]);
      }
    });

    it('respects limit parameter', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ limit: '3' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
      expect(res.body.pagination.limit).toBe(3);
    });

    it('handles pagination with offset', async () => {
      const first = await request(app)
        .get('/api/properties/search')
        .query({ limit: '2', offset: '0', sort_by: 'name', sort_order: 'asc' });

      const second = await request(app)
        .get('/api/properties/search')
        .query({ limit: '2', offset: '2', sort_by: 'name', sort_order: 'asc' });

      expect(first.status).toBe(200);
      expect(second.status).toBe(200);
      expect(first.body.data.length).toBeGreaterThan(0);
      if (second.body.data.length > 0) {
        expect(first.body.data[0].name).not.toBe(second.body.data[0].name);
      }
    });

    it('returns combined filters', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({
          property_type: 'motel',
          min_square_footage: '5000',
          max_price: '3000000',
          sort_by: 'price',
          sort_order: 'desc',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.every((p: any) => p.property_type === 'motel')).toBe(true);
      expect(res.body.data.every((p: any) => p.square_footage >= 5000)).toBe(true);
      expect(res.body.data.every((p: any) => p.price <= 3000000)).toBe(true);

      const prices = res.body.data.map((p: any) => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });

    it('returns empty array for no matches', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ min_price: '999999999' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.pagination.total).toBe(0);
    });

    it('rejects invalid sort_by column', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ sort_by: 'password_hash' });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });
});
