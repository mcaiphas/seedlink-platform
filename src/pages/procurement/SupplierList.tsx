import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Building2, Mail, Phone } from 'lucide-react';

interface SupForm {
  supplier_name: string; supplier_code: string; contact_name: string; email: string; phone: string;
  payment_terms: string; tax_number: string; currency_code: string; is_active: boolean;
}
const empty: SupForm = { supplier_name: '', supplier_code: '', contact_name: '', email: '', phone: '', payment_terms: '', tax_number: '', currency_code: 'ZAR', is_active: true };

export default function SupplierList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QueryStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SupForm>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: d, error } = await supabase.from('suppliers').select('*').order('supplier_name');
    if (error) { const c = classifyError(error); setStatus(c.status); setErrorMsg(c.message); setData([]); }
    else { setStatus(d?.length ? 'success' : 'empty'); setData(d || []); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(r => !search || r.supplier_name?.toLowerCase().includes(search.toLowerCase()) || r.supplier_code?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditId(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({ supplier_name: r.supplier_name, supplier_code: r.supplier_code, contact_name: r.contact_name || '', email: r.email || '', phone: r.phone || '', payment_terms: r.payment_terms || '', tax_number: r.tax_number || '', currency_code: r.currency_code, is_active: r.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.supplier_name.trim() || !form.supplier_code.trim()) { toast({ title: 'Name and code required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload: any = { supplier_name: form.supplier_name.trim(), supplier_code: form.supplier_code.trim(), contact_name: form.contact_name || null, email: form.email || null, phone: form.phone || null, payment_terms: form.payment_terms || null, tax_number: form.tax_number || null, currency_code: form.currency_code, is_active: form.is_active };
    const { error } = editId ? await supabase.from('suppliers').update(payload).eq('id', editId) : await supabase.from('suppliers').insert(payload);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    toast({ title: editId ? 'Supplier updated' : 'Supplier created' }); setSaving(false); setDialogOpen(false); load();
  };

  return (
    <AdminPage>
      <DataPageShell title="Suppliers" description={`${filtered.length} suppliers`} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search suppliers..." action={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Supplier</Button>}>
        {status !== 'success' && status !== 'loading' && status !== 'empty' && <QueryStatusBanner status={status} message={errorMsg || undefined} tableName="suppliers" />}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="group">
                  <TableCell className="font-medium">{r.supplier_name}</TableCell>
                  <TableCell><span className="font-mono text-xs text-muted-foreground">{r.supplier_code}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.contact_name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.email || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.payment_terms || '—'}</TableCell>
                  <TableCell><Badge variant="outline">{r.currency_code}</Badge></TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <EmptyState message="No suppliers found" colSpan={8} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>{editId ? 'Edit Supplier' : 'New Supplier'}</DialogTitle><DialogDescription>Manage supplier details, contact information, and payment terms.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Supplier Name <span className="text-destructive">*</span></Label><Input value={form.supplier_name} onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Supplier Code <span className="text-destructive">*</span></Label><Input value={form.supplier_code} onChange={e => setForm(f => ({ ...f, supplier_code: e.target.value.toUpperCase() }))} className="font-mono" /></div>
              <div className="space-y-2"><Label>Contact Name</Label><Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tax Number</Label><Input value={form.tax_number} onChange={e => setForm(f => ({ ...f, tax_number: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Payment Terms</Label><Input value={form.payment_terms} onChange={e => setForm(f => ({ ...f, payment_terms: e.target.value }))} placeholder="e.g. Net 30" /></div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={form.currency_code} onValueChange={v => setForm(f => ({ ...f, currency_code: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">ZAR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"><Label>Active</Label><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
