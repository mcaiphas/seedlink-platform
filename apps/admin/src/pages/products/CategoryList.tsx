import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Tags, ArrowUpDown } from 'lucide-react';

interface CategoryForm {
  name: string; slug: string; code: string; sku_prefix: string; description: string; sort_order: string; is_active: boolean;
}
const empty: CategoryForm = { name: '', slug: '', code: '', sku_prefix: '', description: '', sort_order: '0', is_active: true };

export default function CategoryList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QueryStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: d, error } = await supabase.from('product_categories').select('*').order('sort_order');
    if (error) { const c = classifyError(error); setStatus(c.status); setErrorMsg(c.message); setData([]); }
    else { setStatus(d?.length ? 'success' : 'empty'); setData(d || []); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.name?.toLowerCase().includes(s) || r.code?.toLowerCase().includes(s) || r.sku_prefix?.toLowerCase().includes(s);
  });

  const openNew = () => { setEditId(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({ name: r.name, slug: r.slug || '', code: r.code || '', sku_prefix: r.sku_prefix || '', description: r.description || '', sort_order: String(r.sort_order ?? 0), is_active: r.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: 'Name required', variant: 'destructive' }); return; }
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload: any = { name: form.name.trim(), slug, code: form.code || null, sku_prefix: form.sku_prefix || null, description: form.description || null, sort_order: parseInt(form.sort_order) || 0, is_active: form.is_active };
    if (editId) {
      const { error } = await supabase.from('product_categories').update(payload).eq('id', editId);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('product_categories').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    }
    toast({ title: editId ? 'Category updated' : 'Category created' });
    setSaving(false); setDialogOpen(false); load();
  };

  return (
    <AdminPage>
      <DataPageShell title="Product Categories" description={`${filtered.length} categories`} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search categories..." action={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Category</Button>}>
        {status !== 'success' && status !== 'loading' && status !== 'empty' && <QueryStatusBanner status={status} message={errorMsg || undefined} tableName="product_categories" />}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU Prefix</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="group">
                  <TableCell className="tabular-nums text-muted-foreground">{r.sort_order}</TableCell>
                  <TableCell><span className="font-medium">{r.name}</span></TableCell>
                  <TableCell>{r.sku_prefix ? <Badge variant="outline" className="font-mono text-xs">{r.sku_prefix}</Badge> : <span className="text-muted-foreground/40">—</span>}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.code || '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.slug}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <EmptyState message="No categories found" colSpan={7} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>Categories define the top-level product classification and SKU prefix.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Name <span className="text-destructive">*</span></Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Seeds" /></div>
              <div className="space-y-2"><Label>SKU Prefix</Label><Input value={form.sku_prefix} onChange={e => setForm(f => ({ ...f, sku_prefix: e.target.value.toUpperCase() }))} placeholder="e.g. SD" className="font-mono" /></div>
              <div className="space-y-2"><Label>Code</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="Optional code" /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Auto-generated from name" className="font-mono text-sm" /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"><Label>Active</Label><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
