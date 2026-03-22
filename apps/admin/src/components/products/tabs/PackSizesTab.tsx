import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Box, Scale, Hash } from 'lucide-react';

interface Props {
  packSizes: any[];
}

export function PackSizesTab({ packSizes }: Props) {
  const countBased = packSizes.filter(ps => ps.pack_type === 'count');
  const weightBased = packSizes.filter(ps => ps.pack_type !== 'count');

  const renderPackCard = (ps: any) => (
    <div key={ps.id} className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:bg-muted/20 transition-colors group">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${ps.pack_type === 'count' ? 'bg-accent/10' : 'bg-primary/10'}`}>
        {ps.pack_type === 'count' ? <Hash className="h-4 w-4 text-accent-foreground" /> : <Scale className="h-4 w-4 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{ps.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {ps.quantity_value && <span>{ps.quantity_value} {ps.quantity_unit || ''}</span>}
          {ps.seed_count && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="font-medium text-foreground">{ps.seed_count.toLocaleString()} seeds</span>
            </>
          )}
          {ps.estimated_weight_kg && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span>~{ps.estimated_weight_kg} kg</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Badge variant={ps.pack_type === 'count' ? 'default' : 'secondary'} className="capitalize text-[10px] px-2">{ps.pack_type}</Badge>
        {ps.is_bulk && <Badge variant="outline" className="text-[10px] px-2 border-accent/40 text-accent-foreground">Bulk</Badge>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Box className="h-5 w-5 text-primary" />Pack Sizes</CardTitle>
          <CardDescription>
            Global pack size catalog. Manage from <strong>Commerce → Pack Sizes</strong>. Assign to variants via the Variants tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {packSizes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Box className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No pack sizes defined yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create pack sizes in the Pack Sizes admin page</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Weight-based */}
              {weightBased.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Scale className="h-3 w-3" /> Weight-Based ({weightBased.length})
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {weightBased.map(renderPackCard)}
                  </div>
                </div>
              )}

              {/* Count-based (K packs) */}
              {countBased.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Hash className="h-3 w-3" /> Seed Count Packs – K = 1,000 seeds ({countBased.length})
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {countBased.map(renderPackCard)}
                  </div>
                </div>
              )}

              {/* Mixed display if no clear separation */}
              {weightBased.length === 0 && countBased.length === 0 && (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {packSizes.map(renderPackCard)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
