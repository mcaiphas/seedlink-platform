import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Box } from 'lucide-react';

interface Props {
  packSizes: any[];
}

export function PackSizesTab({ packSizes }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pack Sizes</CardTitle>
        <CardDescription>
          Global pack size catalog. Manage pack sizes from <strong>Commerce → Pack Sizes</strong>. Assign to variants via the Variants tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {packSizes.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Box className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No pack sizes defined yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create pack sizes in the Pack Sizes admin page</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {packSizes.map(ps => (
              <div key={ps.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                <Box className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{ps.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {ps.quantity_value && <span>{ps.quantity_value} {ps.quantity_unit || ''}</span>}
                    {ps.seed_count && <span>· {ps.seed_count.toLocaleString()} seeds</span>}
                    {ps.estimated_weight_kg && <span>· ~{ps.estimated_weight_kg} kg</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={ps.pack_type === 'count' ? 'default' : 'secondary'} className="capitalize text-xs">{ps.pack_type}</Badge>
                  {ps.is_bulk && <Badge variant="outline" className="text-xs">Bulk</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
