import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, Eye, Plus, Filter } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  authorized: { label: 'Authorized', variant: 'outline' },
  paid: { label: 'Paid', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'outline' },
  partially_refunded: { label: 'Partial Refund', variant: 'secondary' },
};

export default function PaymentList() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // Create form
  const [payMethod, setPayMethod] = useState('eft');
  const [payAmount, setPayAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payOrderId, setPayOrderId] = useState('');
  const [payInvoiceId, setPayInvoiceId] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('payments').select('*, orders(order_number), customer_invoices(invoice_number)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = async (payment: any) => {
    setSelected(payment);
    setDetailOpen(true);
    const { data: allocs } = await supabase.from('payment_allocations').select('*, customer_invoices(invoice_number, total_amount, currency_code)').eq('payment_id', payment.id);
    setAllocations(allocs || []);
  };

  const openCreate = async () => {
    setCreateOpen(true);
    const [o, i] = await Promise.all([
      supabase.from('orders').select('id, order_number, total_amount').in('payment_status', ['pending', 'partially_paid']).order('created_at', { ascending: false }).limit(50),
      supabase.from('customer_invoices').select('id, invoice_number, total_amount').in('status', ['sent', 'overdue']).order('created_at', { ascending: false }).limit(50),
    ]);
    setOrders(o.data || []);
    setInvoices(i.data || []);
  };

  const handleCreate = async () => {
    if (!payAmount || Number(payAmount) <= 0) { toast({ title: 'Enter a valid amount', variant: 'destructive' }); return; }
    setSaving(true);
    const payNum = `PAY-${Date.now().toString().slice(-8)}`;
    const { data: pay, error } = await supabase.from('payments').insert({
      payment_number: payNum, payment_method: payMethod, amount: Number(payAmount),
      currency_code: 'ZAR', payment_status: 'paid', paid_at: new Date().toISOString(),
      payment_reference: payRef || null, notes: payNotes || null, created_by: user?.id,
      order_id: payOrderId || null, customer_invoice_id: payInvoiceId || null,
    }).select().single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    // Auto-allocate to invoice
    if (pay && payInvoiceId) {
      await supabase.from('payment_allocations').insert({
        payment_id: pay.id, customer_invoice_id: payInvoiceId, allocated_amount: Number(payAmount),
      });
    }
    // Update order payment status
    if (payOrderId) {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', payOrderId);
    }
    // Update invoice status
    if (payInvoiceId) {
      await supabase.from('customer_invoices').update({ status: 'paid' }).eq('id', payInvoiceId);
    }
    toast({ title: 'Payment recorded', description: payNum });
    setSaving(false);
    setCreateOpen(false);
    setPayAmount(''); setPayRef(''); setPayNotes(''); setPayOrderId(''); setPayInvoiceId('');
    load();
  };

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        r.payment_number.toLowerCase().includes(s) ||
        (r.payment_reference || '').toLowerCase().includes(s)
      );
    }
    if (methodFilter !== 'all') result = result.filter(r => r.payment_method === methodFilter);
    if (statusFilter !== 'all') result = result.filter(r => r.payment_status === statusFilter);
    return result;
  }, [data, search, methodFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: data.length,
    totalReceived: data.filter(d => d.payment_status === 'paid').reduce((s, d) => s + Number(d.amount), 0),
    pending: data.filter(d => d.payment_status === 'pending').length,
  }), [data]);

  return (
    <DataPageShell title="Payments" description={`${filtered.length} payments`} loading={loading}
      searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by payment # or reference..."
      action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Record Payment</Button>}>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Total Payments</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Total Received</p><p className="text-2xl font-bold text-green-600">ZAR {stats.totalReceived.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></CardContent></Card>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="eft">EFT</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit_account">Credit Account</SelectItem>
            <SelectItem value="wallet">Wallet</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment #</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => openDetail(row)}>
                <TableCell><span className="font-mono font-medium text-primary">{row.payment_number}</span></TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{row.payment_method}</Badge></TableCell>
                <TableCell><Badge variant={STATUS_MAP[row.payment_status]?.variant || 'outline'}>{STATUS_MAP[row.payment_status]?.label || row.payment_status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.payment_reference || '—'}</TableCell>
                <TableCell className="font-mono text-xs">{(row.orders as any)?.order_number || '—'}</TableCell>
                <TableCell className="font-mono text-xs">{(row.customer_invoices as any)?.invoice_number || '—'}</TableCell>
                <TableCell className="text-right font-medium">{row.currency_code} {Number(row.amount).toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.paid_at ? new Date(row.paid_at).toLocaleDateString() : new Date(row.created_at).toLocaleDateString()}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <EmptyState message="No payments found" colSpan={9} />}
          </TableBody>
        </Table>
      </div>

      {/* Detail */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> {selected?.payment_number}</DialogTitle>
            <DialogDescription>Payment details and allocations</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Amount</p><p className="text-lg font-bold text-primary">{selected.currency_code} {Number(selected.amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge variant={STATUS_MAP[selected.payment_status]?.variant || 'outline'}>{STATUS_MAP[selected.payment_status]?.label || selected.payment_status}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Method</p><p className="font-medium capitalize">{selected.payment_method}</p></div>
                <div><p className="text-xs text-muted-foreground">Provider</p><p className="text-sm">{selected.payment_provider || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Reference</p><p className="text-sm">{selected.payment_reference || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Provider TX ID</p><p className="text-sm font-mono">{selected.provider_transaction_id || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Paid At</p><p className="text-sm">{selected.paid_at ? new Date(selected.paid_at).toLocaleString() : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Order</p><p className="text-sm font-mono">{(selected.orders as any)?.order_number || '—'}</p></div>
              </div>
              {selected.notes && <div className="bg-muted/50 rounded p-3 text-sm">{selected.notes}</div>}
              {allocations.length > 0 && (
                <>
                  <Separator />
                  <h4 className="font-semibold">Allocations ({allocations.length})</h4>
                  {allocations.map(a => (
                    <div key={a.id} className="flex items-center justify-between bg-muted/50 rounded p-3">
                      <span className="font-mono text-sm">{(a.customer_invoices as any)?.invoice_number || '—'}</span>
                      <span className="font-medium">{selected.currency_code} {Number(a.allocated_amount).toFixed(2)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Record a customer payment against an order or invoice</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Method</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="eft">EFT</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_account">Credit Account</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount (ZAR)</Label>
                <Input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Payment Reference</Label>
              <Input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Bank reference, tx id..." />
            </div>
            <div>
              <Label>Order (optional)</Label>
              <Select value={payOrderId} onValueChange={setPayOrderId}>
                <SelectTrigger><SelectValue placeholder="Select order..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {orders.map(o => <SelectItem key={o.id} value={o.id}>{o.order_number || o.id.slice(0, 8)} — ZAR {Number(o.total_amount || 0).toFixed(2)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Invoice (optional)</Label>
              <Select value={payInvoiceId} onValueChange={setPayInvoiceId}>
                <SelectTrigger><SelectValue placeholder="Select invoice..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {invoices.map(i => <SelectItem key={i.id} value={i.id}>{i.invoice_number} — ZAR {Number(i.total_amount).toFixed(2)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={payNotes} onChange={e => setPayNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
