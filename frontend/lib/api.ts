const API_BASE = '/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface Property {
  id: string;
  name: string;
  property_type: string;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location_city: string;
  location_state: string;
  location_zip: string;
  amenities: string[];
}

export interface PropertySearchParams {
  property_type?: string;
  min_square_footage?: number;
  max_square_footage?: number;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  location_state?: string;
  location_city?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PropertySearchResult {
  data: Property[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    returned: number;
  };
}

export function buildSearchParams(params: PropertySearchParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  return search.toString();
}
