import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

interface PropertyFilters {
  property_type?: string;
  min_square_footage?: number;
  max_square_footage?: number;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  location_state?: string;
  location_city?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: PropertyFilters = {
      property_type: req.query.property_type as string | undefined,
      min_square_footage: req.query.min_square_footage ? Number(req.query.min_square_footage) : undefined,
      max_square_footage: req.query.max_square_footage ? Number(req.query.max_square_footage) : undefined,
      min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
      max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
      min_bedrooms: req.query.min_bedrooms ? Number(req.query.min_bedrooms) : undefined,
      max_bedrooms: req.query.max_bedrooms ? Number(req.query.max_bedrooms) : undefined,
      min_bathrooms: req.query.min_bathrooms ? Number(req.query.min_bathrooms) : undefined,
      max_bathrooms: req.query.max_bathrooms ? Number(req.query.max_bathrooms) : undefined,
      location_state: req.query.location_state as string | undefined,
      location_city: req.query.location_city as string | undefined,
      sort_by: (req.query.sort_by as string) || 'created_at',
      sort_order: (req.query.sort_order as 'asc' | 'desc') || 'desc',
      limit: req.query.limit ? Math.min(Number(req.query.limit), 100) : 20,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    };

    const allowedSortColumns = ['price', 'square_footage', 'bedrooms', 'bathrooms', 'created_at', 'name'];
    if (!allowedSortColumns.includes(filters.sort_by!)) {
      filters.sort_by = 'created_at';
    }

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.property_type) {
      conditions.push(`property_type = $${paramIndex++}`);
      params.push(filters.property_type);
    }
    if (filters.min_square_footage !== undefined) {
      conditions.push(`square_footage >= $${paramIndex++}`);
      params.push(filters.min_square_footage);
    }
    if (filters.max_square_footage !== undefined) {
      conditions.push(`square_footage <= $${paramIndex++}`);
      params.push(filters.max_square_footage);
    }
    if (filters.min_price !== undefined) {
      conditions.push(`price >= $${paramIndex++}`);
      params.push(filters.min_price);
    }
    if (filters.max_price !== undefined) {
      conditions.push(`price <= $${paramIndex++}`);
      params.push(filters.max_price);
    }
    if (filters.min_bedrooms !== undefined) {
      conditions.push(`bedrooms >= $${paramIndex++}`);
      params.push(filters.min_bedrooms);
    }
    if (filters.max_bedrooms !== undefined) {
      conditions.push(`bedrooms <= $${paramIndex++}`);
      params.push(filters.max_bedrooms);
    }
    if (filters.min_bathrooms !== undefined) {
      conditions.push(`bathrooms >= $${paramIndex++}`);
      params.push(filters.min_bathrooms);
    }
    if (filters.max_bathrooms !== undefined) {
      conditions.push(`bathrooms <= $${paramIndex++}`);
      params.push(filters.max_bathrooms);
    }
    if (filters.location_state) {
      conditions.push(`location_state = $${paramIndex++}`);
      params.push(filters.location_state.toUpperCase());
    }
    if (filters.location_city) {
      conditions.push(`location_city ILIKE $${paramIndex++}`);
      params.push(`%${filters.location_city}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM properties ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataQuery = `
      SELECT id, name, property_type, square_footage, bedrooms, bathrooms,
             price, location_city, location_state, location_zip, amenities
      FROM properties
      ${whereClause}
      ORDER BY ${filters.sort_by} ${filters.sort_order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(filters.limit, filters.offset);

    const dataResult = await query(dataQuery, params);

    res.json({
      data: dataResult.rows,
      pagination: {
        total,
        limit: filters.limit,
        offset: filters.offset,
        returned: dataResult.rows.length,
      },
    });
  } catch (err) {
    console.error('Property search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
