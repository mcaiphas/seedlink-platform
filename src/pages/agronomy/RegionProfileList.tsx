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

interface RegionProfile {
  id: string;
  country: string;
  province: string;
  production_zone: string;
  rainfall_class: string | null;
  dominant_soil_patterns: string[] | null;
  common_crops: string[] | null;
  preferred_planting_windows: string | null;
  agronomic_notes: string | null;
  risk_notes: string | null;
  is_active: boolean;
}

export default function RegionProfileList() {
  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RegionProfile | null>(null);
  const { isAdmin } = useAdmin();

  const [form, setForm] = useState({
    country: 'South Africa', province: '', production_zone: '',
    rainfall_class: '', dominant_soil_patterns: '', common_crops: '',
    preferred_planting_windows: '', agronomic_notes: '', risk_notes: '', is_active: true,
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('agro_region_profiles').select('*').order('province');
    setRegions((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ country: 'South Africa', province: '', production_zone: '', rainfall_class: '', dominant_soil_patterns: '', common_crops: '', preferred_planting_windows: '', agronomic_notes: '', risk_notes: '', is_active: true });
    setEditing(null);
  };

  const openEdit = (r: RegionProfile) => {
    setEditing(r);
    setForm({
      country: r.country, province: r.province, production_zone: r.production_zone,
      rainfall_class: r.rainfall_class || '', dominant_soil_patterns: (r.dominant_soil_patterns || []).join(', '),
      common_crops: (r.common_crops || []).join(', '), preferred_planting_windows: r.preferred_planting_windows || '',
      agronomic_notes: r.agronomic_notes || '', risk_notes: r.risk_notes || '', is_active: r.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      country: form.country, province: form.province, production_zone: form.production_zone,
      rainfall_class: form.rainfall_class || null,
      dominant_soil_patterns: form.dominant_soil_patterns ? form.dominant_soil_patterns.split(',').map(s => s.trim()).filter(Boolean) : null,
      common_crops: form.common_crops ? form.common_crops.split(',').map(s => s.trim()).filter(Boolean) : null,
      preferred_planting_windows: form.preferred_planting_windows || null,
      agronomic_notes: form.agronomic_notes || null, risk_notes: form.risk_notes || null, is_active: form.is_active,
    };
    if (editing) {
      const { error } = await supabase.from('agro_region_profiles').update(payload as any).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Region profile updated');
    } else {
      const { error } = await supabase.from('agro_region_profiles').insert(payload as any);
      if (error) { toast.error(error.message); return; }
      toast.success('Region profile created');
    }
    setDialogOpen(false); resetForm(); load();
  };

  const filtered = regions.filter(r =>
    `${r.province} ${r.production_zone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DataPageShell
      title="Region Profiles"
      description="Geographic production contexts for agronomic recommendations"
      searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search regions..."
      loading={loading}
      action={isAdmin ? (
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Region</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Region Profile</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Country</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
                <div><Label>Province</Label><Input value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} /></div>
              </div>
              <div><Label>Production Zone</Label><Input value={form.production_zone} onChange={e => setForm(f => ({ ...f, production_zone: e.target.value }))} /></div>
              <div><Label>Rainfall Class</Label>
                <Select value={form.rainfall_class} onValueChange={v => setForm(f => ({ ...f, rainfall_class: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Dominant Soil Patterns (comma-separated)</Label><Input value={form.dominant_soil_patterns} onChange={e => setForm(f => ({ ...f, dominant_soil_patterns: e.target.value }))} /></div>
              <div><Label>Common Crops (comma-separated)</Label><Input value={form.common_crops} onChange={e => setForm(f => ({ ...f, common_crops: e.target.value }))} /></div>
              <div><Label>Planting Windows</Label><Input value={form.preferred_planting_windows} onChange={e => setForm(f => ({ ...f, preferred_planting_windows: e.target.value }))} /></div>
              <div><Label>Agronomic Notes</Label><Textarea value={form.agronomic_notes} onChange={e => setForm(f => ({ ...f, agronomic_notes: e.target.value }))} rows={2} /></div>
              <div><Label>Risk Notes</Label><Textarea value={form.risk_notes} onChange={e => setForm(f => ({ ...f, risk_notes: e.target.value }))} rows={2} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : undefined}
    >
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Province</TableHead>
              <TableHead>Production Zone</TableHead>
              <TableHead>Rainfall</TableHead>
              <TableHead>Common Crops</TableHead>
              <TableHead>Planting Window</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? <EmptyState message="No region profiles found" colSpan={7} /> : filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.province}</TableCell>
                <TableCell>{r.production_zone}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{r.rainfall_class || '—'}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{(r.common_crops || []).join(', ') || '—'}</TableCell>
                <TableCell className="text-sm">{r.preferred_planting_windows || '—'}</TableCell>
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
