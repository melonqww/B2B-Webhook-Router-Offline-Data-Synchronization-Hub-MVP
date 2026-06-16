import { PropertySearch } from '@/components/PropertySearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property Search</h1>
        <p className="text-muted-foreground">
          Custom SQL filter builder · Numeric range queries · Pagination & sort
        </p>
      </div>

      <Card className="border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4" />
            SQL Filter — WHERE square_footage BETWEEN ? AND ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="rounded bg-muted p-3 text-xs overflow-x-auto">
{`SELECT id, name, property_type, square_footage, bedrooms, bathrooms,
       price, location_city, location_state
FROM properties
WHERE property_type = $1
  AND square_footage BETWEEN $2 AND $3
  AND price BETWEEN $4 AND $5
  AND bedrooms >= $6
  AND location_state = $7
ORDER BY price DESC
LIMIT 20 OFFSET 0;`}
          </pre>
        </CardContent>
      </Card>

      <PropertySearch />
    </div>
  );
}
