import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '@/hooks/useAdmin';

const CROPS = ['maize', 'soybean', 'sunflower', 'sorghum', 'dry_beans', 'vegetables'];
const CATEGORIES = ['seed', 'basal_fertilizer', 'top_dressing', 'herbicide', 'fungicide', 'insecticide', 'adjuvant', 'inoculant', 'seed_treatment', 'lime', 'other'];

export default function AdvisoryRuleList() {
  const [rules, setRules] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [soils, setSoils] = useState<any[]>([]);
  const [systems, setSystems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { isAdmin } = useAdmin();

  const emptyForm = {
    rule_name: '', crop: '', region_profile_id: '', soil_profile_id: '', farming_system_id: '',
    season: '', product_category: '', product_id: '', application_rate_per_ha: '',
    application_rate_unit: '', priority: '0', rationale: '', notes: '', is_active: true,
  };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [r, reg, soil, sys, prod] = await Promise.all([
      supabase.from('agro_advisory_rules').select('*').order('crop').order('priority', { ascending: false }),
      supabase.from('agro_region_profiles').select('id, production_zone').eq('is_active', true),
      supabase.from('agro_soil_profiles').select('id, profile_name').eq('is_active', true),
      supabase.from('agro_farming_systems').select('id, system_name').eq('is_active', true),
      supabase.from('products').select('id, name').eq('is_active', true).order('name').limit(200),
    ]);
    setRules((r.data as any[]) || []);
    setRegions(reg.data || []);
    setSoils(soil.data || []);
    setSystems(sys.data || []);
    setProducts(prod.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); };

  const openEdit = (r: any) => {
    setEditing(r);
    setForm({
      rule_name: r.rule_name, crop: r.crop, region_profile_id: r.region_profile_id || '',
      soil_profile_id: r.soil_profile_id || '', farming_system_id: r.farming_system_id || '',
      season: r.season || '', product_category: r.product_category, product_id: r.product_id || '',
      application_rate_per_ha: r.application_rate_per_ha?.toString() || '',
      application_rate_unit: r.application_rate_unit || '', priority: r.priority?.toString() || '0',
      rationale: r.rationale || '', notes: r.notes || '', is_active: r.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      rule_name: form.rule_name, crop: form.crop, product_category: form.product_category,
      region_profile_id: form.region_profile_id || null, soil_profile_id: form.soil_profile_id || null,
      farming_system_id: form.farming_system_id || null, season: form.season || null,
      product_id: form.product_id || null, application_rate_per_ha: form.application_rate_per_ha ? parseFloat(form.application_rate_per_ha) : null,
      application_rate_unit: form.application_rate_unit || null, priority: parseInt(form.priority) || 0,
      rationale: form.rationale || null, notes: form.notes || null, is_active: form.is_active,
    };
    if (editing) {
      const { error } = await supabase.from('agro_advisory_rules').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Rule updated');
    } else {
      const { error } = await supabase.from('agro_advisory_rules').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Rule created');
    }
    setDialogOpen(false); resetForm(); load();
  };

  const filtered = rules.filter(r => {
    if (cropFilter && r.crop !== cropFilter) return false;
    return `${r.rule_name} ${r.product_category}`.toLowerCase().includes(search.toLowerCase());
  });

  const regionName = (id: string | null) => regions.find(r => r.id === id)?.production_zone || '—';
  const soilName = (id: string | null) => soils.find(s => s.id === id)?.profile_name || '—';

  return (
    <DataPageShell title="Advisory Rules" description="Configurable recommendation rules linking crops, regions, soils and products"
      searchValue={search} onSearchChange={setSearch} loading={loading}
      action={
        <div className="flex items-center gap-2">
          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="All crops" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All crops</SelectItem>
              {CROPS.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Rule</Button></DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Advisory Rule</DialogTitle></DialogHeader>
                <div className="grid gap-3 py-2">
                  <div><Label>Rule Name</Label><Input value={form.rule_name} onChange={e => setForm(f => ({ ...f, rule_name: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Crop</Label><Select value={form.crop} onValueChange={v => setForm(f => ({ ...f, crop: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{CROPS.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Product Category</Label><Select value={form.product_category} onValueChange={v => setForm(f => ({ ...f, product_category: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <div><Label>Region Profile</Label><Select value={form.region_profile_id} onValueChange={v => setForm(f => ({ ...f, region_profile_id: v }))}><SelectTrigger><SelectValue placeholder="Any region" /></SelectTrigger><SelectContent><SelectItem value="">Any</SelectItem>{regions.map(r => <SelectItem key={r.id} value={r.id}>{r.production_zone}</SelectItem>)}</SelectContent></Select></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Soil Profile</Label><Select value={form.soil_profile_id} onValueChange={v => setForm(f => ({ ...f, soil_profile_id: v }))}><SelectTrigger><SelectValue placeholder="Any soil" /></SelectTrigger><SelectContent><SelectItem value="">Any</SelectItem>{soils.map(s => <SelectItem key={s.id} value={s.id}>{s.profile_name}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Farming System</Label><Select value={form.farming_system_id} onValueChange={v => setForm(f => ({ ...f, farming_system_id: v }))}><SelectTrigger><SelectValue placeholder="Any system" /></SelectTrigger><SelectContent><SelectItem value="">Any</SelectItem>{systems.map(s => <SelectItem key={s.id} value={s.id}>{s.system_name}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <div><Label>Product</Label><Select value={form.product_id} onValueChange={v => setForm(f => ({ ...f, product_id: v }))}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="">None</SelectItem>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><Label>Rate/ha</Label><Input type="number" value={form.application_rate_per_ha} onChange={e => setForm(f => ({ ...f, application_rate_per_ha: e.target.value }))} /></div>
                    <div><Label>Unit</Label><Input value={form.application_rate_unit} onChange={e => setForm(f => ({ ...f, application_rate_unit: e.target.value }))} placeholder="kg, L, bags" /></div>
                    <div><Label>Priority</Label><Input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} /></div>
                  </div>
                  <div><Label>Season</Label><Input value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))} placeholder="e.g. Oct-Nov" /></div>
                  <div><Label>Rationale</Label><Textarea value={form.rationale} onChange={e => setForm(f => ({ ...f, rationale: e.target.value }))} rows={2} /></div>
                  <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
                  <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
                  <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      }
    >
      <div className="rounded-lg border">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Rule</TableHead><TableHead>Crop</TableHead><TableHead>Category</TableHead>
            <TableHead>Region</TableHead><TableHead>Soil</TableHead><TableHead>Rate/ha</TableHead>
            <TableHead>Status</TableHead>{isAdmin && <TableHead className="w-10" />}
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <EmptyState message="No advisory rules found" colSpan={8} /> : filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.rule_name}</TableCell>
                <TableCell className="capitalize">{r.crop.replace('_', ' ')}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{r.product_category.replace('_', ' ')}</Badge></TableCell>
                <TableCell className="text-sm">{regionName(r.region_profile_id)}</TableCell>
                <TableCell className="text-sm">{soilName(r.soil_profile_id)}</TableCell>
                <TableCell className="text-sm">{r.application_rate_per_ha ? `${r.application_rate_per_ha} ${r.application_rate_unit || ''}` : '—'}</TableCell>
                <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                {isAdmin && <TableCell><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
