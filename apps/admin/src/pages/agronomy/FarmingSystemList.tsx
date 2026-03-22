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
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '@/hooks/useAdmin';

export default function FarmingSystemList() {
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { isAdmin } = useAdmin();
  const [form, setForm] = useState({ system_name: '', system_code: '', description: '', is_active: true });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('agro_farming_systems').select('*').order('system_name');
    setSystems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ system_name: '', system_code: '', description: '', is_active: true }); setEditing(null); };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ system_name: s.system_name, system_code: s.system_code, description: s.description || '', is_active: s.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, description: form.description || null };
    if (editing) {
      const { error } = await supabase.from('agro_farming_systems').update(payload as any).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await supabase.from('agro_farming_systems').insert(payload as any);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setDialogOpen(false); resetForm(); load();
  };

  return (
    <DataPageShell title="Farming Systems" description="Production system contexts for advisory recommendations" loading={loading}
      action={isAdmin ? (
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add System</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Farming System</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <div><Label>System Name</Label><Input value={form.system_name} onChange={e => setForm(f => ({ ...f, system_name: e.target.value }))} /></div>
              <div><Label>System Code</Label><Input value={form.system_code} onChange={e => setForm(f => ({ ...f, system_code: e.target.value }))} placeholder="e.g. dryland_grain" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
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
            <TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead>
            {isAdmin && <TableHead className="w-10" />}
          </TableRow></TableHeader>
          <TableBody>
            {systems.length === 0 ? <EmptyState message="No farming systems" colSpan={5} /> : systems.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.system_name}</TableCell>
                <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{s.system_code}</code></TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.description || '—'}</TableCell>
                <TableCell><Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                {isAdmin && <TableCell><Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
