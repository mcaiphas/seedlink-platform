import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, FileText, ShoppingCart, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';

const DEFAULT_STAGES = [
  'Land Preparation', 'Planting', 'Basal Fertilization', 'Top Dressing',
  'Weed Control', 'Pest Control', 'Disease Control', 'Harvest Preparation',
];

const CATEGORIES = ['seed', 'basal_fertilizer', 'top_dressing', 'lime', 'herbicide', 'fungicide', 'insecticide', 'adjuvant', 'inoculant', 'seed_treatment', 'other'];

export default function CropPlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [stageDialog, setStageDialog] = useState(false);
  const [actDialog, setActDialog] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [stageForm, setStageForm] = useState({ stage_name: '', recommended_timing: '', description: '' });
  const [actForm, setActForm] = useState({
    stage_id: '', product_id: '', activity_description: '', product_category: 'seed',
    application_rate: '', application_rate_unit: 'kg/ha', unit_price: '', notes: '',
  });

  const { data: plan, isLoading } = useQuery({
    queryKey: ['crop_plan', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('crop_plans')
        .select('*, farms(farm_name), fields(field_name, area_hectares), farm_seasons(season_name)')
        .eq('id', id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: stages = [] } = useQuery({
    queryKey: ['production_stages', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('production_stages')
        .select('*').eq('crop_plan_id', id!).order('stage_order');
      if (error) throw error;
      return data;
    },
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['program_activities', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('program_activities')
        .select('*, production_stages(stage_name)').eq('crop_plan_id', id!).order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products_select'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('id, product_name, buying_price, selling_price').limit(500);
      return data || [];
    },
  });

  const area = plan?.area_hectares || (plan?.fields as any)?.area_hectares || 0;

  const budget = useMemo(() => {
    let total = 0;
    const byCategory: Record<string, number> = {};
    const byStage: Record<string, number> = {};
    activities.forEach((a: any) => {
      const qty = a.application_rate && area ? a.application_rate * area : (a.total_quantity || 0);
      const lineTotal = a.line_total || (qty * (a.unit_price || 0));
      total += lineTotal;
      const cat = a.product_category || 'other';
      byCategory[cat] = (byCategory[cat] || 0) + lineTotal;
      const stage = (a.production_stages as any)?.stage_name || 'Unassigned';
      byStage[stage] = (byStage[stage] || 0) + lineTotal;
    });
    return { total, byCategory, byStage, costPerHa: area > 0 ? total / area : 0 };
  }, [activities, area]);

  const createStage = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('production_stages').insert({
        crop_plan_id: id,
        stage_name: stageForm.stage_name,
        stage_order: stages.length,
        recommended_timing: stageForm.recommended_timing || null,
        description: stageForm.description || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production_stages', id] });
      setStageDialog(false);
      setStageForm({ stage_name: '', recommended_timing: '', description: '' });
      toast.success('Stage added');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const createActivity = useMutation({
    mutationFn: async () => {
      const rate = actForm.application_rate ? parseFloat(actForm.application_rate) : null;
      const totalQty = rate && area ? rate * area : null;
      const price = actForm.unit_price ? parseFloat(actForm.unit_price) : null;
      const lineTotal = totalQty && price ? totalQty * price : null;
      const { error } = await supabase.from('program_activities').insert({
        crop_plan_id: id,
        stage_id: actForm.stage_id || null,
        product_id: actForm.product_id || null,
        activity_description: actForm.activity_description,
        product_category: actForm.product_category,
        application_rate: rate,
        application_rate_unit: actForm.application_rate_unit,
        total_quantity: totalQty,
        unit_price: price,
        line_total: lineTotal,
        notes: actForm.notes || null,
        sort_order: activities.length,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program_activities', id] });
      setActDialog(false);
      toast.success('Activity added');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const seedDefaultStages = useMutation({
    mutationFn: async () => {
      const inserts = DEFAULT_STAGES.map((s, i) => ({
        crop_plan_id: id,
        stage_name: s,
        stage_order: i,
      }));
      const { error } = await supabase.from('production_stages').insert(inserts as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production_stages', id] });
      toast.success('Default stages added');
    },
  });

  const handleExport = () => {
    const headers = ['Stage', 'Activity', 'Category', 'Rate', 'Unit', 'Qty', 'Unit Price', 'Total'];
    const rows = activities.map((a: any) => [
      (a.production_stages as any)?.stage_name || '',
      a.activity_description,
      a.product_category || '',
      String(a.application_rate || ''),
      a.application_rate_unit || '',
      String(a.total_quantity || ''),
      String(a.unit_price || ''),
      String(a.line_total || ''),
    ]);
    exportToCsv(`crop-plan-${plan?.crop}`, headers, rows);
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading…</div>;
  if (!plan) return <div className="p-8 text-muted-foreground">Plan not found</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${plan.crop}${plan.variety ? ` – ${plan.variety}` : ''}`}
        description={`${(plan.farms as any)?.farm_name || ''} · ${(plan.fields as any)?.field_name || 'All fields'} · ${(plan.farm_seasons as any)?.season_name || ''} · ${area} ha`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            <Button variant="outline" onClick={() => toast.info('Convert to quote coming soon')}><FileText className="h-4 w-4 mr-2" />Convert to Quote</Button>
            <Button variant="outline" onClick={() => toast.info('Add to cart coming soon')}><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart</Button>
          </div>
        }
      />

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Input Cost</p><p className="text-2xl font-bold">R {budget.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Cost per Hectare</p><p className="text-2xl font-bold">R {budget.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Area</p><p className="text-2xl font-bold">{area} ha</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Activities</p><p className="text-2xl font-bold">{activities.length}</p></CardContent></Card>
      </div>

      {/* Budget by Category */}
      {Object.keys(budget.byCategory).length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Cost by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(budget.byCategory).map(([cat, val]) => (
                <Badge key={cat} variant="outline" className="text-sm py-1 px-3 capitalize">
                  {cat.replace(/_/g, ' ')}: R {(val as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Stages */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Production Stages</CardTitle>
            <CardDescription>Operational stages of production</CardDescription>
          </div>
          <div className="flex gap-2">
            {stages.length === 0 && (
              <Button size="sm" variant="outline" onClick={() => seedDefaultStages.mutate()}>Add Default Stages</Button>
            )}
            <Button size="sm" onClick={() => setStageDialog(true)}><Plus className="h-4 w-4 mr-1" />Add Stage</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Stage</TableHead><TableHead>Timing</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
            <TableBody>
              {stages.map((s: any, i: number) => (
                <TableRow key={s.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{s.stage_name}</TableCell>
                  <TableCell>{s.recommended_timing || '—'}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{s.description || '—'}</TableCell>
                </TableRow>
              ))}
              {stages.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No stages yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Program Activities */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Program Activities & Inputs</CardTitle>
            <CardDescription>Products and input requirements per stage</CardDescription>
          </div>
          <Button size="sm" onClick={() => setActDialog(true)}><Plus className="h-4 w-4 mr-1" />Add Activity</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Qty ({area} ha)</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((a: any) => {
                const qty = a.application_rate && area ? a.application_rate * area : (a.total_quantity || 0);
                const total = a.line_total || (qty * (a.unit_price || 0));
                return (
                  <TableRow key={a.id}>
                    <TableCell>{(a.production_stages as any)?.stage_name || '—'}</TableCell>
                    <TableCell className="font-medium">{a.activity_description}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-xs">{(a.product_category || '').replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell className="text-right">{a.application_rate ? `${a.application_rate} ${a.application_rate_unit}` : '—'}</TableCell>
                    <TableCell className="text-right">{qty ? qty.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}</TableCell>
                    <TableCell className="text-right">{a.unit_price ? `R ${a.unit_price}` : '—'}</TableCell>
                    <TableCell className="text-right font-medium">{total ? `R ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}</TableCell>
                  </TableRow>
                );
              })}
              {activities.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">No activities yet</TableCell></TableRow>}
              {activities.length > 0 && (
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={6} className="text-right">Total</TableCell>
                  <TableCell className="text-right">R {budget.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stage Dialog */}
      <Dialog open={stageDialog} onOpenChange={setStageDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Production Stage</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Stage Name</Label><Input value={stageForm.stage_name} onChange={e => setStageForm(f => ({ ...f, stage_name: e.target.value }))} placeholder="e.g. Planting" /></div>
            <div><Label>Recommended Timing</Label><Input value={stageForm.recommended_timing} onChange={e => setStageForm(f => ({ ...f, recommended_timing: e.target.value }))} placeholder="e.g. October Week 2" /></div>
            <div><Label>Description</Label><Textarea value={stageForm.description} onChange={e => setStageForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStageDialog(false)}>Cancel</Button>
            <Button onClick={() => createStage.mutate()} disabled={!stageForm.stage_name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={actDialog} onOpenChange={setActDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Program Activity</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label>Stage</Label>
              <Select value={actForm.stage_id} onValueChange={v => setActForm(f => ({ ...f, stage_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>{stages.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.stage_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Activity Description</Label><Input value={actForm.activity_description} onChange={e => setActForm(f => ({ ...f, activity_description: e.target.value }))} placeholder="e.g. Maize seed planting" /></div>
            <div>
              <Label>Category</Label>
              <Select value={actForm.product_category} onValueChange={v => setActForm(f => ({ ...f, product_category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product (optional)</Label>
              <Select value={actForm.product_id} onValueChange={v => {
                const prod = products.find((p: any) => p.id === v);
                setActForm(f => ({ ...f, product_id: v, unit_price: prod?.selling_price?.toString() || f.unit_price, activity_description: f.activity_description || prod?.product_name || '' }));
              }}>
                <SelectTrigger><SelectValue placeholder="Link to product" /></SelectTrigger>
                <SelectContent>{products.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.product_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Application Rate</Label><Input type="number" value={actForm.application_rate} onChange={e => setActForm(f => ({ ...f, application_rate: e.target.value }))} placeholder="e.g. 200" /></div>
              <div>
                <Label>Unit</Label>
                <Select value={actForm.application_rate_unit} onValueChange={v => setActForm(f => ({ ...f, application_rate_unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg/ha">kg/ha</SelectItem>
                    <SelectItem value="L/ha">L/ha</SelectItem>
                    <SelectItem value="seeds/ha">seeds/ha</SelectItem>
                    <SelectItem value="bags/ha">bags/ha</SelectItem>
                    <SelectItem value="units/ha">units/ha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Unit Price (R)</Label><Input type="number" value={actForm.unit_price} onChange={e => setActForm(f => ({ ...f, unit_price: e.target.value }))} /></div>
            <div><Label>Notes</Label><Textarea value={actForm.notes} onChange={e => setActForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActDialog(false)}>Cancel</Button>
            <Button onClick={() => createActivity.mutate()} disabled={!actForm.activity_description}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
