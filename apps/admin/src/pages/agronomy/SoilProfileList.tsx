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

interface SoilProfile {
  id: string;
  profile_name: string;
  texture_class: string;
  drainage: string | null;
  water_holding: string | null;
  leaching_risk: string | null;
  nutrient_holding: string | null;
  agronomic_notes: string | null;
  is_active: boolean;
}

const LEVELS = ['low', 'medium', 'high'];
const DRAINAGE = ['good', 'moderate', 'poor'];
const TEXTURES = ['sandy', 'sandy_loam', 'loam', 'clay_loam', 'heavy_clay'];

export default function SoilProfileList() {
  const [profiles, setProfiles] = useState<SoilProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SoilProfile | null>(null);
  const { isAdmin } = useAdmin();

  const [form, setForm] = useState({
    profile_name: '', texture_class: '', drainage: '', water_holding: '',
    leaching_risk: '', nutrient_holding: '', agronomic_notes: '', is_active: true,
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('agro_soil_profiles').select('*').order('profile_name');
    setProfiles((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ profile_name: '', texture_class: '', drainage: '', water_holding: '', leaching_risk: '', nutrient_holding: '', agronomic_notes: '', is_active: true }); setEditing(null); };

  const openEdit = (p: SoilProfile) => {
    setEditing(p);
    setForm({ profile_name: p.profile_name, texture_class: p.texture_class, drainage: p.drainage || '', water_holding: p.water_holding || '', leaching_risk: p.leaching_risk || '', nutrient_holding: p.nutrient_holding || '', agronomic_notes: p.agronomic_notes || '', is_active: p.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, drainage: form.drainage || null, water_holding: form.water_holding || null, leaching_risk: form.leaching_risk || null, nutrient_holding: form.nutrient_holding || null, agronomic_notes: form.agronomic_notes || null };
    if (editing) {
      const { error } = await supabase.from('agro_soil_profiles').update(payload as any).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Soil profile updated');
    } else {
      const { error } = await supabase.from('agro_soil_profiles').insert(payload as any);
      if (error) { toast.error(error.message); return; }
      toast.success('Soil profile created');
    }
    setDialogOpen(false); resetForm(); load();
  };

  const filtered = profiles.filter(p => p.profile_name.toLowerCase().includes(search.toLowerCase()));

  const levelBadge = (val: string | null) => {
    if (!val) return '—';
    const colors: Record<string, string> = { low: 'bg-emerald-100 text-emerald-800', medium: 'bg-amber-100 text-amber-800', high: 'bg-red-100 text-red-800' };
    return <Badge variant="outline" className={`capitalize ${colors[val] || ''}`}>{val}</Badge>;
  };

  return (
    <DataPageShell title="Soil Profiles" description="Soil characteristics influencing product recommendations" searchValue={search} onSearchChange={setSearch} loading={loading}
      action={isAdmin ? (
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Soil Profile</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Soil Profile</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <div><Label>Profile Name</Label><Input value={form.profile_name} onChange={e => setForm(f => ({ ...f, profile_name: e.target.value }))} /></div>
              <div><Label>Texture Class</Label>
                <Select value={form.texture_class} onValueChange={v => setForm(f => ({ ...f, texture_class: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{TEXTURES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Drainage</Label><Select value={form.drainage} onValueChange={v => setForm(f => ({ ...f, drainage: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{DRAINAGE.map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Water Holding</Label><Select value={form.water_holding} onValueChange={v => setForm(f => ({ ...f, water_holding: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Leaching Risk</Label><Select value={form.leaching_risk} onValueChange={v => setForm(f => ({ ...f, leaching_risk: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Nutrient Holding</Label><Select value={form.nutrient_holding} onValueChange={v => setForm(f => ({ ...f, nutrient_holding: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div><Label>Agronomic Notes</Label><Textarea value={form.agronomic_notes} onChange={e => setForm(f => ({ ...f, agronomic_notes: e.target.value }))} rows={2} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : undefined}
    >
      <div className="rounded-lg border">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Texture</TableHead><TableHead>Drainage</TableHead>
            <TableHead>Water Holding</TableHead><TableHead>Leaching Risk</TableHead><TableHead>Nutrient Holding</TableHead>
            <TableHead>Status</TableHead>{isAdmin && <TableHead className="w-10" />}
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <EmptyState message="No soil profiles found" colSpan={8} /> : filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.profile_name}</TableCell>
                <TableCell className="capitalize">{p.texture_class.replace('_', ' ')}</TableCell>
                <TableCell className="capitalize">{p.drainage || '—'}</TableCell>
                <TableCell>{levelBadge(p.water_holding)}</TableCell>
                <TableCell>{levelBadge(p.leaching_risk)}</TableCell>
                <TableCell>{levelBadge(p.nutrient_holding)}</TableCell>
                <TableCell><Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                {isAdmin && <TableCell><Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
