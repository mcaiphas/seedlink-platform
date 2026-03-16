import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Building2, Mail, Phone, Search, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SupForm {
  supplier_name: string; supplier_code: string; contact_name: string; email: string; phone: string;
  payment_terms: string; tax_number: string; currency_code: string; is_active: boolean;
}
const empty: SupForm = { supplier_name: '', supplier_code: '', contact_name: '', email: '', phone: '', payment_terms: '', tax_number: '', currency_code: 'ZAR', is_active: true };

export default function SupplierList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SupForm>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: d, error } = await supabase.from('suppliers').select('*').order('supplier_name');
    if (error) { toast({ title: 'Error loading suppliers', description: error.message, variant: 'destructive' }); }
    setData(d || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => data.filter(r => {
    const matchSearch = !search || r.supplier_name?.toLowerCase().includes(search.toLowerCase()) || r.supplier_code?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' && r.is_active) || (statusFilter === 'inactive' && !r.is_active);
    return matchSearch && matchStatus;
  }), [data, search, statusFilter]);

  const stats = useMemo(() => ({
    total: data.length,
    active: data.filter(r => r.is_active).length,
    inactive: data.filter(r => !r.is_active).length,
  }), [data]);

  const openNew = () => { setEditId(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({ supplier_name: r.supplier_name, supplier_code: r.supplier_code, contact_name: r.contact_name || '', email: r.email || '', phone: r.phone || '', payment_terms: r.payment_terms || '', tax_number: r.tax_number || '', currency_code: r.currency_code, is_active: r.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.supplier_name.trim() || !form.supplier_code.trim()) { toast({ title: 'Name and code required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload: any = { supplier_name: form.supplier_name.trim(), supplier_code: form.supplier_code.trim().toUpperCase(), contact_name: form.contact_name || null, email: form.email || null, phone: form.phone || null, payment_terms: form.payment_terms || null, tax_number: form.tax_number || null, currency_code: form.currency_code, is_active: form.is_active };
    const { error } = editId ? await supabase.from('suppliers').update(payload).eq('id', editId) : await supabase.from('suppliers').insert(payload);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    toast({ title: editId ? 'Supplier updated' : 'Supplier created' }); setSaving(false); setDialogOpen(false); load();
  };

  return (
    <div className="space-y-6">
      <DataPageShell
        title="Suppliers"
        description="Manage your supplier network"
        action={<Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" />Add Supplier</Button>}
      >
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Suppliers', value: stats.total, color: 'text-foreground' },
            { label: 'Active', value: stats.active, color: 'text-primary' },
            { label: 'Inactive', value: stats.inactive, color: 'text-muted-foreground' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, code, or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Payment Terms</TableHead>
                <TableHead className="font-semibold">Currency</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="group cursor-pointer hover:bg-muted/20" onClick={() => openEdit(r)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{r.supplier_name}</p>
                        {r.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{r.supplier_code}</span></TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{r.contact_name || '—'}</p>
                      {r.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.payment_terms || '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="font-mono text-xs">{r.currency_code}</Badge></TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'} className="text-xs">{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); openEdit(r); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && !loading && <EmptyState message="No suppliers found" colSpan={7} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{editId ? 'Edit Supplier' : 'New Supplier'}</DialogTitle>
            <DialogDescription>Manage supplier details, contact information, and payment terms.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Identity</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Supplier Name <span className="text-destructive">*</span></Label><Input value={form.supplier_name} onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))} placeholder="e.g. Agri Seeds SA" /></div>
                <div className="space-y-1.5"><Label>Supplier Code <span className="text-destructive">*</span></Label><Input value={form.supplier_code} onChange={e => setForm(f => ({ ...f, supplier_code: e.target.value.toUpperCase() }))} className="font-mono" placeholder="e.g. AGRISA" /></div>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Contact Name</Label><Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Tax Number</Label><Input value={form.tax_number} onChange={e => setForm(f => ({ ...f, tax_number: e.target.value }))} /></div>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Terms</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Payment Terms</Label><Input value={form.payment_terms} onChange={e => setForm(f => ({ ...f, payment_terms: e.target.value }))} placeholder="e.g. Net 30" /></div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={form.currency_code} onValueChange={v => setForm(f => ({ ...f, currency_code: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZAR">ZAR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div>
                <Label>Active Supplier</Label>
                <p className="text-xs text-muted-foreground">Inactive suppliers won't appear in selection lists</p>
              </div>
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Supplier' : 'Create Supplier'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
