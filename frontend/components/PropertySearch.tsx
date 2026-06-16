'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { apiFetch, buildSearchParams, PropertySearchResult, type Property } from '@/lib/api';
import { Search, SlidersHorizontal, Building2, DollarSign, Ruler, MapPin } from 'lucide-react';

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'medical', label: 'Medical' },
  { value: 'residential', label: 'Residential' },
  { value: 'motel', label: 'Motel' },
  { value: 'commercial', label: 'Commercial' },
];

const sortOptions = [
  { value: 'created_at', label: 'Date' },
  { value: 'price', label: 'Price' },
  { value: 'square_footage', label: 'Sq. Footage' },
  { value: 'bedrooms', label: 'Bedrooms' },
  { value: 'bathrooms', label: 'Bathrooms' },
  { value: 'name', label: 'Name' },
];

export function PropertySearch() {
  const [result, setResult] = useState<PropertySearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    property_type: '',
    min_square_footage: '',
    max_square_footage: '',
    min_price: '',
    max_price: '',
    min_bedrooms: '',
    max_bedrooms: '',
    location_state: '',
    sort_by: 'created_at',
    sort_order: 'desc' as 'asc' | 'desc',
  });

  const search = useCallback(async (offset = 0) => {
    setLoading(true);
    try {
      const params = {
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
        limit: 20,
        offset,
      };
      const qs = buildSearchParams(params as any);
      const data = await apiFetch<PropertySearchResult>(`/properties/search?${qs}`);
      setResult(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Type</label>
              <Select value={filters.property_type} onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}>
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Min Sq Ft</label>
              <Input
                type="number"
                value={filters.min_square_footage}
                onChange={(e) => setFilters({ ...filters, min_square_footage: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Max Sq Ft</label>
              <Input
                type="number"
                value={filters.max_square_footage}
                onChange={(e) => setFilters({ ...filters, max_square_footage: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Min Price ($)</label>
              <Input
                type="number"
                value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Max Price ($)</label>
              <Input
                type="number"
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Min Bedrooms</label>
              <Input
                type="number"
                value={filters.min_bedrooms}
                onChange={(e) => setFilters({ ...filters, min_bedrooms: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">State</label>
              <Input
                value={filters.location_state}
                onChange={(e) => setFilters({ ...filters, location_state: e.target.value })}
                placeholder="e.g. CA"
                maxLength={2}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Sort by</label>
              <Select value={filters.sort_by} onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}>
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={() => search()} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({
                  property_type: '',
                  min_square_footage: '',
                  max_square_footage: '',
                  min_price: '',
                  max_price: '',
                  min_bedrooms: '',
                  max_bedrooms: '',
                  location_state: '',
                  sort_by: 'created_at',
                  sort_order: 'desc',
                });
                search();
              }}
            >
              Reset
            </Button>
            {result && (
              <span className="text-sm text-muted-foreground">
                {result.pagination.total} properties found
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Searching...
              </div>
            </div>
          ) : result && result.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1"><Ruler className="h-3 w-3" /> Sq Ft</div>
                  </TableHead>
                  <TableHead>Beds/Baths</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Price</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</div>
                  </TableHead>
                  <TableHead>Amenities</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.map((p: Property) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.property_type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {p.square_footage?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {p.bedrooms ?? '-'}bd / {p.bathrooms ?? '-'}ba
                    </TableCell>
                    <TableCell className="font-mono">
                      ${p.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {p.location_city}, {p.location_state}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.amenities?.slice(0, 2).map((a: string) => (
                          <Badge key={a} variant="outline" className="text-[10px]">
                            {a}
                          </Badge>
                        ))}
                        {p.amenities?.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{p.amenities.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Building2 className="h-8 w-8 mb-2" />
              <p className="text-sm">No properties match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && result.pagination.total > result.pagination.limit && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={result.pagination.offset === 0}
            onClick={() => search(result.pagination.offset - result.pagination.limit)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {Math.floor(result.pagination.offset / result.pagination.limit) + 1} of{' '}
            {Math.ceil(result.pagination.total / result.pagination.limit)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={result.pagination.offset + result.pagination.limit >= result.pagination.total}
            onClick={() => search(result.pagination.offset + result.pagination.limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
