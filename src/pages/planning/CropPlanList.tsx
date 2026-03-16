import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CROPS = ['Maize', 'Soybean', 'Sunflower', 'Sorghum', 'Dry Beans', 'Vegetables'];
const STATUS_COLORS: Record<string, string> = { draft: 'secondary', active: 'default', completed: 'outline' };

export default function CropPlanList() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ farm_id: '', field_id: '', season_id: '', crop: '', variety: '', area_hectares: '', irrigation_type: 'dryland', notes: '' });

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['crop_plans'],
    queryFn: async () => {
      const { data, error } = await supabase.from('crop_plans').select('*, farms(farm_name), fields(field_name), farm_seasons(season_name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: farms = [] } = useQuery({
    queryKey: ['farms_select'],
    queryFn: async () => { const { data } = await supabase.from('farms').select('id, farm_name'); return data || []; },
  });

  const { data: fields = [] } = useQuery({
    queryKey: ['fields_select', form.farm_id],
    queryFn: async () => {
      if (!form.farm_id) return [];
      const { data } = await supabase.from('fields').select('id, field_name, area_hectares').eq('farm_id', form.farm_id);
      return data || [];
    },
    enabled: !!form.farm_id,
  });

  const { data: seasons = [] } = useQuery({
    queryKey: ['farm_seasons_select'],
    queryFn: async () => { const { data } = await supabase.from('farm_seasons').select('id, season_name'); return data || []; },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('crop_plans').insert({
        farm_id: form.farm_id,
        field_id: form.field_id || null,
        season_id: form.season_id,
        crop: form.crop,
        variety: form.variety || null,
        area_hectares: form.area_hectares ? parseFloat(form.area_hectares) : null,
        irrigation_type: form.irrigation_type,
        notes: form.notes || null,
        created_by: user?.id,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop_plans'] });
      setOpen(false);
      toast.success('Crop plan created');
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Crop Plans" description="Plan what to grow on each field per season">
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />New Crop Plan</Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Area (ha)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : plans.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No crop plans yet</TableCell></TableRow>
              ) : plans.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.crop}{p.variety ? ` (${p.variety})` : ''}</TableCell>
                  <TableCell>{(p.farms as any)?.farm_name || '—'}</TableCell>
                  <TableCell>{(p.fields as any)?.field_name || '—'}</TableCell>
                  <TableCell>{(p.farm_seasons as any)?.season_name || '—'}</TableCell>
                  <TableCell>{p.area_hectares ?? '—'}</TableCell>
                  <TableCell className="capitalize">{p.irrigation_type}</TableCell>
                  <TableCell><Badge variant={STATUS_COLORS[p.status] as any || 'secondary'} className="capitalize">{p.status}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/planning/crop-plans/${p.id}`)}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Crop Plan</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label>Farm</Label>
              <Select value={form.farm_id} onValueChange={v => setForm(f => ({ ...f, farm_id: v, field_id: '' }))}>
                <SelectTrigger><SelectValue placeholder="Select farm" /></SelectTrigger>
                <SelectContent>{farms.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.farm_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {form.farm_id && (
              <div>
                <Label>Field (optional)</Label>
                <Select value={form.field_id} onValueChange={v => {
                  const field = fields.find((f: any) => f.id === v);
                  setForm(f => ({ ...f, field_id: v, area_hectares: field?.area_hectares?.toString() || f.area_hectares }));
                }}>
                  <SelectTrigger><SelectValue placeholder="All fields" /></SelectTrigger>
                  <SelectContent>{fields.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.field_name} ({f.area_hectares} ha)</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Season</Label>
              <Select value={form.season_id} onValueChange={v => setForm(f => ({ ...f, season_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                <SelectContent>{seasons.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.season_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Crop</Label>
              <Select value={form.crop} onValueChange={v => setForm(f => ({ ...f, crop: v }))}>
                <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>{CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Variety / Hybrid</Label><Input value={form.variety} onChange={e => setForm(f => ({ ...f, variety: e.target.value }))} /></div>
              <div><Label>Area (ha)</Label><Input type="number" value={form.area_hectares} onChange={e => setForm(f => ({ ...f, area_hectares: e.target.value }))} /></div>
            </div>
            <div>
              <Label>Irrigation</Label>
              <Select value={form.irrigation_type} onValueChange={v => setForm(f => ({ ...f, irrigation_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dryland">Dryland</SelectItem>
                  <SelectItem value="irrigated">Irrigated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.farm_id || !form.season_id || !form.crop}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
