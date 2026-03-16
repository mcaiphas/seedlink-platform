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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Plus, Eye, CheckCircle, XCircle, FileText, Truck,
  CreditCard, ArrowUpDown, Search, Filter,
} from 'lucide-react';

const APPROVAL_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  not_required: { label: 'Not Required', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};
const PAYMENT_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  authorized: { label: 'Authorized', variant: 'outline' },
  paid: { label: 'Paid', variant: 'default' },
  partially_paid: { label: 'Partial', variant: 'secondary' },
  failed: { label: 'Failed', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};
const FULFILLMENT_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  reserved: { label: 'Reserved', variant: 'secondary' },
  ready: { label: 'Ready', variant: 'secondary' },
  fulfilled: { label: 'Fulfilled', variant: 'default' },
  partially_fulfilled: { label: 'Partial', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};
const SOURCE_MAP: Record<string, string> = {
  online_store: 'Online Store', customer_service: 'Customer Service',
  abandoned_cart_recovery: 'Cart Recovery', marketplace: 'Marketplace', manual: 'Manual',
};

export default function OrderList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderPayments, setOrderPayments] = useState<any[]>([]);
  const [orderInvoices, setOrderInvoices] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create order form state
  const [newSource, setNewSource] = useState('customer_service');
  const [newNotes, setNewNotes] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [orderLines, setOrderLines] = useState<{ product_id: string; product_name: string; quantity: number; unit_price: number; sku: string }[]>([]);

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (createOpen && products.length === 0) {
      supabase.from('product_variants').select('id, variant_name, sku, selling_price, products(name)').eq('is_active', true).order('variant_name').then(r => setProducts(r.data || []));
    }
  }, [createOpen]);

  const openDetail = async (order: any) => {
    setSelected(order);
    setDetailOpen(true);
    const [items, payments, invoices] = await Promise.all([
      supabase.from('order_items').select('*').eq('order_id', order.id),
      supabase.from('payments').select('*').eq('order_id', order.id).order('created_at', { ascending: false }),
      supabase.from('customer_invoices').select('*').eq('order_id', order.id).order('created_at', { ascending: false }),
    ]);
    setOrderItems(items.data || []);
    setOrderPayments(payments.data || []);
    setOrderInvoices(invoices.data || []);
  };

  const approveOrder = async () => {
    if (!selected) return;
    const { error } = await supabase.from('orders').update({
      approval_status: 'approved', approved_by: user?.id, approved_at: new Date().toISOString(),
    }).eq('id', selected.id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Order approved' });
    load();
    setSelected({ ...selected, approval_status: 'approved' });
  };

  const rejectOrder = async () => {
    if (!selected) return;
    await supabase.from('orders').update({ approval_status: 'rejected' }).eq('id', selected.id);
    toast({ title: 'Order rejected' });
    load();
    setSelected({ ...selected, approval_status: 'rejected' });
  };

  const generateInvoice = async () => {
    if (!selected) return;
    setSaving(true);
    const { data: numData } = await supabase.rpc('generate_ci_number');
    const invNum = numData || `INV-${Date.now()}`;
    const { data: inv, error } = await supabase.from('customer_invoices').insert({
      invoice_number: invNum, customer_id: selected.user_id, order_id: selected.id,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      currency_code: selected.currency_code, subtotal_amount: selected.subtotal_amount,
      tax_amount: selected.tax_amount, total_amount: selected.total_amount || 0,
      status: 'sent', notes: `Auto-generated from Order ${selected.order_number || selected.id.slice(0, 8)}`,
    }).select().single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    // Copy order items to invoice items
    if (inv && orderItems.length > 0) {
      const invoiceItems = orderItems.map(oi => ({
        customer_invoice_id: inv.id, order_item_id: oi.id,
        description: oi.product_name, quantity: oi.quantity,
        unit_price: oi.unit_price, line_total: oi.line_total,
      }));
      await supabase.from('customer_invoice_items').insert(invoiceItems);
    }
    // Mark order invoice_generated
    await supabase.from('orders').update({ invoice_generated: true }).eq('id', selected.id);
    // Log document delivery
    if (inv) {
      await supabase.from('document_delivery_logs').insert({
        document_type: 'customer_invoice', document_id: inv.id,
        delivery_channel: 'email', delivery_status: 'queued',
        subject: `Invoice ${invNum}`, created_by: user?.id,
      });
    }
    toast({ title: 'Invoice generated', description: `${invNum} created successfully` });
    setSaving(false);
    load();
    openDetail(selected);
  };

  const updateFulfillment = async (status: string) => {
    if (!selected) return;
    await supabase.from('orders').update({ fulfillment_status: status }).eq('id', selected.id);
    toast({ title: 'Fulfillment updated', description: `Status set to ${status}` });
    load();
    setSelected({ ...selected, fulfillment_status: status });
  };

  const handleCreateOrder = async () => {
    if (orderLines.length === 0) { toast({ title: 'Add at least one item', variant: 'destructive' }); return; }
    setSaving(true);
    const subtotal = orderLines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const total = subtotal + tax;
    const { data: ord, error } = await supabase.from('orders').insert({
      order_source: newSource, user_id: user?.id,
      subtotal_amount: subtotal, tax_amount: tax, total_amount: total,
      currency_code: 'ZAR', payment_status: 'pending', fulfillment_status: 'draft',
      approval_status: newSource === 'online_store' ? 'not_required' : 'pending',
      notes: newNotes || null, invoice_generated: false,
    }).select().single();
    if (error || !ord) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setSaving(false); return; }
    const items = orderLines.map(l => ({
      order_id: ord.id, product_name: l.product_name, quantity: l.quantity,
      unit_price: l.unit_price, line_total: l.quantity * l.unit_price,
      sku: l.sku, product_id: l.product_id || null,
    }));
    await supabase.from('order_items').insert(items);
    toast({ title: 'Order created' });
    setSaving(false);
    setCreateOpen(false);
    setOrderLines([]);
    setNewNotes('');
    load();
  };

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        (r.order_number || '').toLowerCase().includes(s) ||
        ((r.profiles as any)?.full_name || '').toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') result = result.filter(r => r.payment_status === statusFilter);
    if (sourceFilter !== 'all') result = result.filter(r => r.order_source === sourceFilter);
    return result;
  }, [data, search, statusFilter, sourceFilter]);

  const stats = useMemo(() => ({
    total: data.length,
    paid: data.filter(d => d.payment_status === 'paid').length,
    pending: data.filter(d => d.payment_status === 'pending').length,
    totalValue: data.reduce((s, d) => s + Number(d.total_amount || 0), 0),
  }), [data]);

  return (
    <DataPageShell title="Orders" description={`${filtered.length} orders`} loading={loading}
      searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search orders..."
      action={<Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Order</Button>}>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Total Orders</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Paid</p><p className="text-2xl font-bold text-green-600">{stats.paid}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Total Value</p><p className="text-2xl font-bold">ZAR {stats.totalValue.toFixed(2)}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="online_store">Online Store</SelectItem>
            <SelectItem value="customer_service">Customer Service</SelectItem>
            <SelectItem value="abandoned_cart_recovery">Cart Recovery</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Fulfillment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => openDetail(row)}>
                <TableCell><span className="font-mono font-medium text-primary">{row.order_number || row.id?.slice(0, 8)}</span></TableCell>
                <TableCell>{(row.profiles as any)?.full_name || '—'}</TableCell>
                <TableCell><span className="text-xs">{SOURCE_MAP[row.order_source] || row.order_source || '—'}</span></TableCell>
                <TableCell><Badge variant={APPROVAL_MAP[row.approval_status]?.variant || 'outline'}>{APPROVAL_MAP[row.approval_status]?.label || row.approval_status || '—'}</Badge></TableCell>
                <TableCell><Badge variant={PAYMENT_MAP[row.payment_status]?.variant || 'outline'}>{PAYMENT_MAP[row.payment_status]?.label || row.payment_status}</Badge></TableCell>
                <TableCell><Badge variant={FULFILLMENT_MAP[row.fulfillment_status]?.variant || 'outline'}>{FULFILLMENT_MAP[row.fulfillment_status]?.label || row.fulfillment_status}</Badge></TableCell>
                <TableCell className="text-right font-medium">{row.currency_code} {Number(row.total_amount || 0).toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <EmptyState message="No orders found" colSpan={9} />}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order {selected?.order_number || selected?.id?.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>Order details and workflow actions</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {/* Status row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Approval:</span><Badge variant={APPROVAL_MAP[selected.approval_status]?.variant || 'outline'}>{APPROVAL_MAP[selected.approval_status]?.label || '—'}</Badge></div>
                <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Payment:</span><Badge variant={PAYMENT_MAP[selected.payment_status]?.variant || 'outline'}>{PAYMENT_MAP[selected.payment_status]?.label || selected.payment_status}</Badge></div>
                <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Fulfillment:</span><Badge variant={FULFILLMENT_MAP[selected.fulfillment_status]?.variant || 'outline'}>{FULFILLMENT_MAP[selected.fulfillment_status]?.label || selected.fulfillment_status}</Badge></div>
                <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Source:</span><span className="text-sm">{SOURCE_MAP[selected.order_source] || selected.order_source || '—'}</span></div>
                {selected.invoice_generated && <Badge variant="default"><FileText className="h-3 w-3 mr-1" />Invoice Generated</Badge>}
              </div>

              <Separator />

              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><p className="text-xs text-muted-foreground">Subtotal</p><p className="font-medium">{selected.currency_code} {Number(selected.subtotal_amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Tax</p><p className="font-medium">{selected.currency_code} {Number(selected.tax_amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Discount</p><p className="font-medium">{selected.currency_code} {Number(selected.discount_amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold text-primary">{selected.currency_code} {Number(selected.total_amount || 0).toFixed(2)}</p></div>
              </div>

              {selected.notes && <div className="text-sm bg-muted/50 rounded-md p-3"><span className="font-medium">Notes:</span> {selected.notes}</div>}

              <Separator />

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Order Items ({orderItems.length})</h4>
                <div className="rounded border overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Product</TableHead><TableHead>SKU</TableHead>
                      <TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {orderItems.map(oi => (
                        <TableRow key={oi.id}>
                          <TableCell className="font-medium">{oi.product_name}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">{oi.sku || '—'}</TableCell>
                          <TableCell className="text-right">{oi.quantity}</TableCell>
                          <TableCell className="text-right">{Number(oi.unit_price).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">{Number(oi.line_total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      {orderItems.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No items</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Payments */}
              {orderPayments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Payments ({orderPayments.length})</h4>
                  <div className="space-y-2">
                    {orderPayments.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-muted/50 rounded p-3">
                        <div>
                          <span className="font-mono text-sm font-medium">{p.payment_number}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{p.payment_method}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={PAYMENT_MAP[p.payment_status]?.variant || 'outline'}>{PAYMENT_MAP[p.payment_status]?.label || p.payment_status}</Badge>
                          <span className="font-medium">{p.currency_code} {Number(p.amount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {orderInvoices.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Invoices ({orderInvoices.length})</h4>
                  <div className="space-y-2">
                    {orderInvoices.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between bg-muted/50 rounded p-3">
                        <span className="font-mono text-sm font-medium text-primary">{inv.invoice_number}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>{inv.status}</Badge>
                          <span className="font-medium">{inv.currency_code} {Number(inv.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Workflow actions */}
              <div className="flex flex-wrap gap-2">
                {selected.approval_status === 'pending' && (
                  <>
                    <Button onClick={approveOrder} className="gap-1"><CheckCircle className="h-4 w-4" /> Approve</Button>
                    <Button variant="destructive" onClick={rejectOrder} className="gap-1"><XCircle className="h-4 w-4" /> Reject</Button>
                  </>
                )}
                {!selected.invoice_generated && (selected.approval_status === 'approved' || selected.approval_status === 'not_required') && selected.payment_status === 'paid' && (
                  <Button onClick={generateInvoice} disabled={saving} className="gap-1"><FileText className="h-4 w-4" /> Generate Invoice</Button>
                )}
                {!selected.invoice_generated && (selected.approval_status === 'approved' || selected.approval_status === 'not_required') && selected.payment_status !== 'paid' && (
                  <Button variant="outline" onClick={generateInvoice} disabled={saving} className="gap-1"><FileText className="h-4 w-4" /> Generate Invoice (Manual)</Button>
                )}
                {selected.fulfillment_status === 'draft' && (
                  <Button variant="outline" onClick={() => updateFulfillment('reserved')} className="gap-1"><Truck className="h-4 w-4" /> Reserve Stock</Button>
                )}
                {selected.fulfillment_status === 'reserved' && (
                  <Button variant="outline" onClick={() => updateFulfillment('ready')} className="gap-1"><Truck className="h-4 w-4" /> Mark Ready</Button>
                )}
                {selected.fulfillment_status === 'ready' && (
                  <Button onClick={() => updateFulfillment('fulfilled')} className="gap-1"><Truck className="h-4 w-4" /> Fulfill</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>Create a new order manually or for a customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order Source</Label>
                <Select value={newSource} onValueChange={setNewSource}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_service">Customer Service</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="online_store">Online Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Order notes..." />
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Order Items</Label>
                <Button variant="outline" size="sm" onClick={() => setOrderLines([...orderLines, { product_id: '', product_name: '', quantity: 1, unit_price: 0, sku: '' }])}>
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              {orderLines.map((line, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-end">
                  <div className="col-span-5">
                    <Select value={line.product_id} onValueChange={v => {
                      const p = products.find(x => x.id === v);
                      const lines = [...orderLines];
                      lines[i] = { ...lines[i], product_id: v, product_name: p ? `${(p.products as any)?.name || ''} - ${p.variant_name}` : '', unit_price: p?.selling_price || 0, sku: p?.sku || '' };
                      setOrderLines(lines);
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{(p.products as any)?.name} – {p.variant_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input type="number" min={1} value={line.quantity} onChange={e => { const lines = [...orderLines]; lines[i] = { ...lines[i], quantity: Number(e.target.value) }; setOrderLines(lines); }} />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" step="0.01" value={line.unit_price} onChange={e => { const lines = [...orderLines]; lines[i] = { ...lines[i], unit_price: Number(e.target.value) }; setOrderLines(lines); }} />
                  </div>
                  <div className="col-span-2 text-right font-medium text-sm pt-2">
                    {(line.quantity * line.unit_price).toFixed(2)}
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="icon" onClick={() => setOrderLines(orderLines.filter((_, j) => j !== i))}>
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {orderLines.length > 0 && (
                <div className="text-right font-semibold mt-2">
                  Subtotal: ZAR {orderLines.reduce((s, l) => s + l.quantity * l.unit_price, 0).toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrder} disabled={saving || orderLines.length === 0}>Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
