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

export default function CustomerInvoiceList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QueryStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({ invoice_number: '', customer_id: '', order_id: '', invoice_date: new Date().toISOString().split('T')[0], due_date: '', total_amount: '0', currency_code: 'ZAR', status: 'draft', notes: '' });

  const load = async () => {
    setLoading(true);
    const [invR, ordR] = await Promise.all([
      supabase.from('customer_invoices').select('*, profiles(full_name), orders(order_number)').order('created_at', { ascending: false }).limit(500),
      supabase.from('orders').select('id, order_number').order('created_at', { ascending: false }).limit(200),
    ]);
    if (invR.error) { const c = classifyError(invR.error); setStatus(c.status); setErrorMsg(c.message); setData([]); }
    else { setStatus(invR.data?.length ? 'success' : 'empty'); setData(invR.data || []); }
    setOrders(ordR.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(r => !search || r.invoice_number?.toLowerCase().includes(search.toLowerCase()));

  const openNew = async () => {
    const num = await generateDocNumber('ci');
    setForm({ invoice_number: num, customer_id: '', order_id: '', invoice_date: new Date().toISOString().split('T')[0], due_date: '', total_amount: '0', currency_code: 'ZAR', status: 'draft', notes: '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.invoice_number) { toast({ title: 'Invoice number required', variant: 'destructive' }); return; }
    setSaving(true);
    const total = parseFloat(form.total_amount) || 0;
    const payload: any = { invoice_number: form.invoice_number, customer_id: form.customer_id || null, order_id: form.order_id || null, invoice_date: form.invoice_date, due_date: form.due_date || null, total_amount: total, subtotal_amount: total, tax_amount: 0, currency_code: form.currency_code, status: form.status, notes: form.notes || null };
    const { error } = await supabase.from('customer_invoices').insert(payload);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    toast({ title: 'Customer invoice created' }); setSaving(false); setDialogOpen(false); load();
  };

  const statusColor = (s: string) => s === 'paid' ? 'default' : s === 'sent' ? 'default' : 'secondary';

  return (
    <AdminPage>
      <DataPageShell title="Customer Invoices" description={`${filtered.length} invoices`} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..." action={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />New Invoice</Button>}>
        {status !== 'success' && status !== 'loading' && status !== 'empty' && <QueryStatusBanner status={status} message={errorMsg || undefined} tableName="customer_invoices" />}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Invoice #</TableHead><TableHead>Customer</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Due</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell><span className="font-medium font-mono text-primary">{r.invoice_number}</span></TableCell>
                  <TableCell>{(r.profiles as any)?.full_name || '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{(r.orders as any)?.order_number || '—'}</TableCell>
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
          <DialogHeader><DialogTitle>New Customer Invoice</DialogTitle><DialogDescription>Create a manual invoice or link to an existing order.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Invoice Number</Label><Input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} className="font-mono" /></div>
              <div className="space-y-2"><Label>Order (optional)</Label>
                <Select value={form.order_id || '__none'} onValueChange={v => setForm(f => ({ ...f, order_id: v === '__none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to order" /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">None</SelectItem>{orders.map(o => <SelectItem key={o.id} value={o.id}>{o.order_number}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Total Amount</Label><Input type="number" step="0.01" value={form.total_amount} onChange={e => setForm(f => ({ ...f, total_amount: e.target.value }))} className="tabular-nums" /></div>
              <div className="space-y-2"><Label>Currency</Label>
                <Select value={form.currency_code} onValueChange={v => setForm(f => ({ ...f, currency_code: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="ZAR">ZAR</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.invoice_date} onChange={e => setForm(f => ({ ...f, invoice_date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent>
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
