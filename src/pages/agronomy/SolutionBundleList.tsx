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
import { Plus, Pencil, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '@/hooks/useAdmin';

const CROPS = ['maize', 'soybean', 'sunflower', 'sorghum', 'dry_beans', 'vegetables'];

export default function SolutionBundleList() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { isAdmin } = useAdmin();

  const emptyForm = { bundle_name: '', crop: '', target_context: '', agronomic_objective: '', notes: '', estimated_area_ha: '', is_active: true };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('agro_solution_bundles').select('*, agro_solution_bundle_items(count)').order('bundle_name');
    setBundles((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({
      bundle_name: b.bundle_name, crop: b.crop, target_context: b.target_context || '',
      agronomic_objective: b.agronomic_objective || '', notes: b.notes || '',
      estimated_area_ha: b.estimated_area_ha?.toString() || '', is_active: b.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      bundle_name: form.bundle_name, crop: form.crop, target_context: form.target_context || null,
      agronomic_objective: form.agronomic_objective || null, notes: form.notes || null,
      estimated_area_ha: form.estimated_area_ha ? parseFloat(form.estimated_area_ha) : null,
      is_active: form.is_active,
    };
    if (editing) {
      const { error } = await supabase.from('agro_solution_bundles').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Bundle updated');
    } else {
      const { error } = await supabase.from('agro_solution_bundles').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Bundle created');
    }
    setDialogOpen(false); resetForm(); load();
  };

  const filtered = bundles.filter(b => `${b.bundle_name} ${b.crop}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <DataPageShell title="Solution Bundles" description="Pre-defined grouped product recommendations for common scenarios"
      searchValue={search} onSearchChange={setSearch} loading={loading}
      action={isAdmin ? (
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Bundle</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Solution Bundle</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <div><Label>Bundle Name</Label><Input value={form.bundle_name} onChange={e => setForm(f => ({ ...f, bundle_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Crop</Label><Select value={form.crop} onValueChange={v => setForm(f => ({ ...f, crop: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{CROPS.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Area (ha)</Label><Input type="number" value={form.estimated_area_ha} onChange={e => setForm(f => ({ ...f, estimated_area_ha: e.target.value }))} /></div>
              </div>
              <div><Label>Target Context</Label><Input value={form.target_context} onChange={e => setForm(f => ({ ...f, target_context: e.target.value }))} placeholder="e.g. dryland_grain" /></div>
              <div><Label>Agronomic Objective</Label><Textarea value={form.agronomic_objective} onChange={e => setForm(f => ({ ...f, agronomic_objective: e.target.value }))} rows={2} /></div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
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
            <TableHead>Bundle</TableHead><TableHead>Crop</TableHead><TableHead>Context</TableHead>
            <TableHead>Objective</TableHead><TableHead>Area (ha)</TableHead><TableHead>Items</TableHead>
            <TableHead>Status</TableHead>{isAdmin && <TableHead className="w-10" />}
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <EmptyState message="No solution bundles found" colSpan={8} /> : filtered.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" />{b.bundle_name}</div></TableCell>
                <TableCell className="capitalize">{b.crop.replace('_', ' ')}</TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">{b.target_context?.replace('_', ' ') || '—'}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{b.agronomic_objective || '—'}</TableCell>
                <TableCell>{b.estimated_area_ha || '—'}</TableCell>
                <TableCell><Badge variant="outline">{b.agro_solution_bundle_items?.[0]?.count || 0}</Badge></TableCell>
                <TableCell><Badge variant={b.is_active ? 'default' : 'secondary'}>{b.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                {isAdmin && <TableCell><Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
