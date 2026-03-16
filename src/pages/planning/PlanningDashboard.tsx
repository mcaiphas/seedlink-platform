import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tractor, MapPin, Sprout, DollarSign } from 'lucide-react';

export default function PlanningDashboard() {
  const { data: farms = [] } = useQuery({
    queryKey: ['farms_count'],
    queryFn: async () => { const { data } = await supabase.from('farms').select('id'); return data || []; },
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['crop_plans_dashboard'],
    queryFn: async () => {
      const { data } = await supabase.from('crop_plans').select('id, crop, area_hectares, status, farm_id');
      return data || [];
    },
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['program_activities_dashboard'],
    queryFn: async () => {
      const { data } = await supabase.from('program_activities').select('line_total, product_category');
      return data || [];
    },
  });

  const totalHa = plans.reduce((s: number, p: any) => s + (p.area_hectares || 0), 0);
  const totalCost = activities.reduce((s: number, a: any) => s + (a.line_total || 0), 0);
  const cropCounts: Record<string, number> = {};
  plans.forEach((p: any) => { cropCounts[p.crop] = (cropCounts[p.crop] || 0) + 1; });
  const categoryCosts: Record<string, number> = {};
  activities.forEach((a: any) => {
    const cat = a.product_category || 'other';
    categoryCosts[cat] = (categoryCosts[cat] || 0) + (a.line_total || 0);
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Farm Planning Dashboard" description="Overview of seasonal farm plans and input budgets" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Tractor className="h-5 w-5 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Farms</p><p className="text-2xl font-bold">{farms.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Hectares Planned</p><p className="text-2xl font-bold">{totalHa.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Sprout className="h-5 w-5 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Crop Plans</p><p className="text-2xl font-bold">{plans.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Est. Input Cost</p><p className="text-2xl font-bold">R {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Plans by Crop</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(cropCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">No crop plans yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(cropCounts).sort((a, b) => b[1] - a[1]).map(([crop, count]) => (
                  <div key={crop} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{crop}</span>
                    <Badge variant="secondary">{count} plan{count !== 1 ? 's' : ''}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Budget by Category</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(categoryCosts).length === 0 ? (
              <p className="text-sm text-muted-foreground">No budget data yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(categoryCosts).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([cat, val]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{cat.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium">R {(val as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
