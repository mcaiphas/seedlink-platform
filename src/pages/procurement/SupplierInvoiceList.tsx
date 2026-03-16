import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDocNumber } from '@/lib/document-numbers';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export default function SupplierInvoiceList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QueryStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [form, setForm] = useState({ supplier_invoice_number: '', supplier_id: '', purchase_order_id: '', invoice_date: new Date().toISOString().split('T')[0], due_date: '', total_amount: '0', currency_code: 'ZAR', status: 'pending', notes: '' });

  const load = async () => {
    setLoading(true);
    const [invR, sR, poR] = await Promise.all([
      supabase.from('supplier_invoices').select('*, suppliers(supplier_name), purchase_orders(po_number)').order('created_at', { ascending: false }).limit(500),
      supabase.from('suppliers').select('id, supplier_name').order('supplier_name'),
      supabase.from('purchase_orders').select('id, po_number').order('created_at', { ascending: false }).limit(200),
    ]);
    if (invR.error) { const c = classifyError(invR.error); setStatus(c.status); setErrorMsg(c.message); setData([]); }
    else { setStatus(invR.data?.length ? 'success' : 'empty'); setData(invR.data || []); }
    setSuppliers(sR.data || []); setPos(poR.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(r => !search || r.supplier_invoice_number?.toLowerCase().includes(search.toLowerCase()));

  const openNew = async () => {
    const num = await generateDocNumber('si');
    setForm({ supplier_invoice_number: num, supplier_id: '', purchase_order_id: '', invoice_date: new Date().toISOString().split('T')[0], due_date: '', total_amount: '0', currency_code: 'ZAR', status: 'pending', notes: '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.supplier_invoice_number || !form.supplier_id) { toast({ title: 'Invoice number and supplier required', variant: 'destructive' }); return; }
    setSaving(true);
    const total = parseFloat(form.total_amount) || 0;
    const payload: any = { supplier_invoice_number: form.supplier_invoice_number, supplier_id: form.supplier_id, purchase_order_id: form.purchase_order_id || null, invoice_date: form.invoice_date, due_date: form.due_date || null, total_amount: total, subtotal_amount: total, tax_amount: 0, currency_code: form.currency_code, status: form.status, notes: form.notes || null };
    const { error } = await supabase.from('supplier_invoices').insert(payload);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    toast({ title: 'Supplier invoice created' }); setSaving(false); setDialogOpen(false); load();
  };

  const statusColor = (s: string) => s === 'paid' ? 'default' : s === 'approved' ? 'default' : 'secondary';

  return (
    <AdminPage>
      <DataPageShell title="Supplier Invoices" description={`${filtered.length} invoices`} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..." action={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />New Invoice</Button>}>
        {status !== 'success' && status !== 'loading' && status !== 'empty' && <QueryStatusBanner status={status} message={errorMsg || undefined} tableName="supplier_invoices" />}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Invoice #</TableHead><TableHead>Supplier</TableHead><TableHead>PO #</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Due</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell><span className="font-medium font-mono text-primary">{r.supplier_invoice_number}</span></TableCell>
                  <TableCell>{(r.suppliers as any)?.supplier_name || '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{(r.purchase_orders as any)?.po_number || '—'}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{r.currency_code} {Number(r.total_amount || 0).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={statusColor(r.status) as any} className="capitalize">{r.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-muted-foreground">{r.due_date ? new Date(r.due_date).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <EmptyState message="No invoices found" colSpan={7} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Supplier Invoice</DialogTitle><DialogDescription>Capture a supplier invoice and link to a purchase order.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Invoice Number <span className="text-destructive">*</span></Label><Input value={form.supplier_invoice_number} onChange={e => setForm(f => ({ ...f, supplier_invoice_number: e.target.value }))} className="font-mono" /></div>
              <div className="space-y-2"><Label>Supplier <span className="text-destructive">*</span></Label>
                <Select value={form.supplier_id} onValueChange={v => setForm(f => ({ ...f, supplier_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Purchase Order</Label>
                <Select value={form.purchase_order_id || '__none'} onValueChange={v => setForm(f => ({ ...f, purchase_order_id: v === '__none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to PO" /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">None</SelectItem>{pos.map(p => <SelectItem key={p.id} value={p.id}>{p.po_number}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Total Amount</Label><Input type="number" step="0.01" value={form.total_amount} onChange={e => setForm(f => ({ ...f, total_amount: e.target.value }))} className="tabular-nums" /></div>
              <div className="space-y-2"><Label>Invoice Date</Label><Input type="date" value={form.invoice_date} onChange={e => setForm(f => ({ ...f, invoice_date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="disputed">Disputed</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Invoice'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
