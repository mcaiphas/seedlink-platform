import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCsv } from '@/lib/csv-export';

export default function InputBudgetList() {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['crop_plans_budget'],
    queryFn: async () => {
      const { data, error } = await supabase.from('crop_plans')
        .select('id, crop, variety, area_hectares, status, farms(farm_name), fields(field_name, area_hectares), farm_seasons(season_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: allActivities = [] } = useQuery({
    queryKey: ['all_program_activities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('program_activities')
        .select('crop_plan_id, line_total, product_category, application_rate, unit_price, total_quantity');
      if (error) throw error;
      return data || [];
    },
  });

  const planBudgets = plans.map((p: any) => {
    const acts = allActivities.filter((a: any) => a.crop_plan_id === p.id);
    const total = acts.reduce((s: number, a: any) => s + (a.line_total || 0), 0);
    const area = p.area_hectares || (p.fields as any)?.area_hectares || 0;
    const seed = acts.filter((a: any) => a.product_category === 'seed').reduce((s: number, a: any) => s + (a.line_total || 0), 0);
    const fert = acts.filter((a: any) => ['basal_fertilizer', 'top_dressing', 'lime'].includes(a.product_category)).reduce((s: number, a: any) => s + (a.line_total || 0), 0);
    const chem = acts.filter((a: any) => ['herbicide', 'fungicide', 'insecticide', 'adjuvant'].includes(a.product_category)).reduce((s: number, a: any) => s + (a.line_total || 0), 0);
    return { ...p, total, area, costPerHa: area > 0 ? total / area : 0, seed, fert, chem, actCount: acts.length };
  });

  const grandTotal = planBudgets.reduce((s, p) => s + p.total, 0);

  const handleExport = () => {
    const headers = ['Farm', 'Crop', 'Season', 'Area (ha)', 'Seed Cost', 'Fertilizer Cost', 'Chemical Cost', 'Total', 'Cost/ha'];
    const rows = planBudgets.map(p => [
      (p.farms as any)?.farm_name || '', p.crop, (p.farm_seasons as any)?.season_name || '',
      String(p.area), String(p.seed), String(p.fert), String(p.chem), String(p.total), String(p.costPerHa.toFixed(2)),
    ]);
    exportToCsv('input-budgets', headers, rows);
  };

  const fmt = (v: number) => `R ${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Input Budgets" description="Aggregated input cost budgets across all crop plans" action={
        <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Plans</p><p className="text-2xl font-bold">{plans.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Grand Total Budget</p><p className="text-2xl font-bold">{fmt(grandTotal)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Hectares</p><p className="text-2xl font-bold">{planBudgets.reduce((s, p) => s + p.area, 0).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Season</TableHead>
                <TableHead className="text-right">Area (ha)</TableHead>
                <TableHead className="text-right">Seed</TableHead>
                <TableHead className="text-right">Fertilizer</TableHead>
                <TableHead className="text-right">Chemicals</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Cost/ha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : planBudgets.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No budgets yet. Create crop plans and add activities.</TableCell></TableRow>
              ) : planBudgets.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{(p.farms as any)?.farm_name || '—'}</TableCell>
                  <TableCell className="font-medium">{p.crop}{p.variety ? ` (${p.variety})` : ''}</TableCell>
                  <TableCell>{(p.farm_seasons as any)?.season_name || '—'}</TableCell>
                  <TableCell className="text-right">{p.area}</TableCell>
                  <TableCell className="text-right">{fmt(p.seed)}</TableCell>
                  <TableCell className="text-right">{fmt(p.fert)}</TableCell>
                  <TableCell className="text-right">{fmt(p.chem)}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(p.total)}</TableCell>
                  <TableCell className="text-right">{fmt(p.costPerHa)}</TableCell>
                </TableRow>
              ))}
              {planBudgets.length > 0 && (
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={7} className="text-right">Grand Total</TableCell>
                  <TableCell className="text-right">{fmt(grandTotal)}</TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
