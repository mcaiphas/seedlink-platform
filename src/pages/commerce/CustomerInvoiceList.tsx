import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { generateDocNumber } from '@/lib/document-numbers';
import { logAudit } from '@/lib/audit';
import { FileText, Plus, Trash2, DollarSign } from 'lucide-react';
import { ProductLineItemSelect, ProductOption } from '@/components/commerce/ProductLineItemSelect';

interface LineItem {
  product_id?: string; description: string; quantity: number; unit_price: number; weight_kg: number; line_total: number;
}

export default function CustomerInvoiceList() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  // Create invoice form
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', payment_terms: 'net_30', due_date: '', notes: '', tax_rate: 15 });
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0, weight_kg: 0, line_total: 0 }]);
  const [saving, setSaving] = useState(false);

  // Payment recording
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: 0, payment_method: 'bank_transfer', payment_reference: '', notes: '' });
  const [paymentInvoice, setPaymentInvoice] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('customer_invoices').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, customer_name, customer_code').eq('is_active', true).order('customer_name').limit(500),
    ]).then(([{ data: inv }, { data: c }]) => {
      setInvoices(inv || []);
      setCustomers(c || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    invoices.filter(inv => {
      if (search && !(inv.invoice_number || '').toLowerCase().includes(search.toLowerCase()) &&
          !(inv.customers?.customer_name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      return true;
    }), [invoices, search, statusFilter]);

  async function openDetail(inv: any) {
    setDetail(inv);
    const { data } = await supabase.from('customer_invoice_items').select('*').eq('customer_invoice_id', inv.id);
    setItems(data || []);
  }

  function updateLineItem(idx: number, field: string, value: any) {
    setLineItems(prev => {
      const next = [...prev];
      const item = { ...next[idx], [field]: value };
      if (['quantity', 'unit_price'].includes(field)) {
        item.line_total = item.quantity * item.unit_price;
      }
      next[idx] = item;
      return next;
    });
  }

  function handleProductSelect(idx: number, product: ProductOption | null) {
    if (!product) return;
    setLineItems(prev => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        product_id: product.id,
        description: product.name + (product.sku ? ` (${product.sku})` : ''),
        unit_price: product.default_selling_price || next[idx].unit_price,
        line_total: next[idx].quantity * (product.default_selling_price || next[idx].unit_price),
      };
      return next;
    });
  }

  async function handleCreateInvoice() {
    if (!formData.customer_id) { toast({ title: 'Select a customer', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const subtotal = lineItems.reduce((s, i) => s + i.line_total, 0);
      const tax = subtotal * (formData.tax_rate / 100);
      const total = subtotal + tax;
      const { data: { user } } = await supabase.auth.getUser();
      const invoiceNumber = await generateDocNumber('ci');

      const { data: newInv } = await supabase.from('customer_invoices').insert({
        invoice_number: invoiceNumber, customer_id: formData.customer_id,
        due_date: formData.due_date || null, payment_terms: formData.payment_terms,
        notes: formData.notes || null, tax_rate: formData.tax_rate,
        subtotal_amount: subtotal, tax_amount: tax, total_amount: total,
        sales_rep_id: user?.id || null, status: 'draft',
      }).select('*, customers(customer_name)').single();

      if (newInv) {
        await supabase.from('customer_invoice_items').insert(lineItems.map(i => ({
          customer_invoice_id: newInv.id, description: i.description,
          product_id: i.product_id || null,
          quantity: i.quantity, unit_price: i.unit_price, line_total: i.line_total,
        })));
        setInvoices(prev => [newInv, ...prev]);
        logAudit({ action: 'create', entity_type: 'customer_invoice', entity_id: newInv.id });
      }
      toast({ title: 'Invoice created' });
      setShowCreate(false);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
    setSaving(false);
  }

  async function issueInvoice(id: string) {
    await supabase.from('customer_invoices').update({ status: 'issued', updated_at: new Date().toISOString() }).eq('id', id);
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'issued' } : i));
    logAudit({ action: 'issue', entity_type: 'customer_invoice', entity_id: id });
    toast({ title: 'Invoice issued' });
  }

  function openPaymentDialog(inv: any) {
    setPaymentInvoice(inv);
    const outstanding = Number(inv.total_amount) - Number(inv.paid_amount || 0);
    setPaymentData({ amount: outstanding, payment_method: 'bank_transfer', payment_reference: '', notes: '' });
    setShowPayment(true);
  }

  async function recordPayment() {
    if (!paymentInvoice || paymentData.amount <= 0) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('payments').insert({
        order_id: paymentInvoice.order_id || null,
        customer_id: paymentInvoice.customer_id || null,
        customer_invoice_id: paymentInvoice.id,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        payment_reference: paymentData.payment_reference || null,
        payment_status: 'paid',
        allocated_amount: paymentData.amount,
        currency_code: paymentInvoice.currency_code,
        created_by: user?.id || null,
        notes: paymentData.notes || null,
      } as any);

      const newPaid = Number(paymentInvoice.paid_amount || 0) + paymentData.amount;
      const totalAmt = Number(paymentInvoice.total_amount);
      const newStatus = newPaid >= totalAmt ? 'paid' : 'partially_paid';

      await supabase.from('customer_invoices').update({
        paid_amount: newPaid, status: newStatus, updated_at: new Date().toISOString(),
      }).eq('id', paymentInvoice.id);

      setInvoices(prev => prev.map(i => i.id === paymentInvoice.id ? { ...i, paid_amount: newPaid, status: newStatus } : i));
      logAudit({ action: 'record_payment', entity_type: 'customer_invoice', entity_id: paymentInvoice.id, new_values: { amount: paymentData.amount } });
      toast({ title: 'Payment recorded' });
      setShowPayment(false);
    } catch {
      toast({ title: 'Error recording payment', variant: 'destructive' });
    }
    setSaving(false);
  }

  const subtotal = lineItems.reduce((s, i) => s + i.line_total, 0);
  const tax = subtotal * (formData.tax_rate / 100);
  const total = subtotal + tax;

  return (
    <PageShell title="Customer Invoices" subtitle="Invoice management, payment recording, and tracking" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..."
      actions={<Button onClick={() => { setFormData({ customer_id: '', payment_terms: 'net_30', due_date: '', notes: '', tax_rate: 15 }); setLineItems([{ description: '', quantity: 1, unit_price: 0, weight_kg: 0, line_total: 0 }]); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" />New Invoice</Button>}
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices" description="Create or generate customer invoices." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6 font-medium cursor-pointer" onClick={() => openDetail(inv)}>{inv.invoice_number}</TableCell>
                  <TableCell>{inv.customers?.customer_name || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                  <TableCell><DateDisplay date={inv.invoice_date} /></TableCell>
                  <TableCell><DateDisplay date={inv.due_date} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={inv.total_amount} currency={inv.currency_code} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={inv.paid_amount} currency={inv.currency_code} /></TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {inv.status === 'draft' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => issueInvoice(inv.id)}>Issue</Button>
                      )}
                      {['issued', 'partially_paid', 'overdue'].includes(inv.status) && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openPaymentDialog(inv)}>
                          <DollarSign className="h-3 w-3 mr-1" />Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Invoice {detail?.invoice_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Customer</p><span className="font-medium">{detail.customers?.customer_name || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.invoice_date} /></div>
                <div><p className="text-xs text-muted-foreground">Due</p><DateDisplay date={detail.due_date} /></div>
              </div>
              <Separator />
              <Table>
                <TableHeader><TableRow><TableHead>Description</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {items.map(it => (
                    <TableRow key={it.id}>
                      <TableCell>{it.description || '—'}</TableCell>
                      <TableCell className="text-right">{it.quantity}</TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={it.unit_price} /></TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={it.line_total} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <div className="space-y-1 text-right text-sm w-64">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detail.subtotal_amount} /></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detail.tax_amount} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold"><span>Total</span><CurrencyDisplay amount={detail.total_amount} /></div>
                  <div className="flex justify-between text-emerald-600"><span>Paid</span><CurrencyDisplay amount={detail.paid_amount} /></div>
                  <div className="flex justify-between font-semibold"><span>Outstanding</span><CurrencyDisplay amount={Number(detail.total_amount) - Number(detail.paid_amount || 0)} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Customer Invoice</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <Label>Customer *</Label>
                <Select value={formData.customer_id} onValueChange={v => setFormData(p => ({ ...p, customer_id: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Select value={formData.payment_terms} onValueChange={v => setFormData(p => ({ ...p, payment_terms: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="net_7">7 Days</SelectItem>
                    <SelectItem value="net_14">14 Days</SelectItem>
                    <SelectItem value="net_30">30 Days</SelectItem>
                    <SelectItem value="net_60">60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Due Date</Label><Input type="date" value={formData.due_date} onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))} className="bg-card" /></div>
              <div><Label>Tax Rate (%)</Label><Input type="number" value={formData.tax_rate} onChange={e => setFormData(p => ({ ...p, tax_rate: Number(e.target.value) }))} className="bg-card" /></div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Line Items</h4>
                <Button size="sm" variant="outline" onClick={() => setLineItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0, weight_kg: 0, line_total: 0 }])}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
              {lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end mb-2">
                  <div className="col-span-3">{idx === 0 && <Label className="text-xs">Product</Label>}<ProductLineItemSelect value={item.product_id || null} onSelect={p => handleProductSelect(idx, p)} /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Description</Label>}<Input value={item.description} onChange={e => updateLineItem(idx, 'description', e.target.value)} className="bg-card" /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Qty</Label>}<Input type="number" value={item.quantity} onChange={e => updateLineItem(idx, 'quantity', Number(e.target.value))} className="bg-card" /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Unit Price</Label>}<Input type="number" value={item.unit_price} onChange={e => updateLineItem(idx, 'unit_price', Number(e.target.value))} className="bg-card" /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Total</Label>}<div className="h-10 flex items-center px-3 rounded-md border bg-muted text-sm font-medium"><CurrencyDisplay amount={item.line_total} /></div></div>
                  <div className="col-span-1"><Button size="icon" variant="ghost" className="h-10 w-10 text-destructive" onClick={() => setLineItems(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button></div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <div className="space-y-1 text-right text-sm w-64">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={subtotal} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax ({formData.tax_rate}%)</span><CurrencyDisplay amount={tax} /></div>
                <Separator className="my-1" />
                <div className="flex justify-between font-semibold text-base"><span>Total</span><CurrencyDisplay amount={total} /></div>
              </div>
            </div>
            <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreateInvoice} disabled={saving}>{saving ? 'Saving...' : 'Create Invoice'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Payment — {paymentInvoice?.invoice_number}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Invoice Total</span><CurrencyDisplay amount={paymentInvoice?.total_amount} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Already Paid</span><CurrencyDisplay amount={paymentInvoice?.paid_amount} /></div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold"><span>Outstanding</span><CurrencyDisplay amount={Number(paymentInvoice?.total_amount || 0) - Number(paymentInvoice?.paid_amount || 0)} /></div>
            </div>
            <div><Label>Payment Amount *</Label><Input type="number" value={paymentData.amount} onChange={e => setPaymentData(p => ({ ...p, amount: Number(e.target.value) }))} className="bg-card" /></div>
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentData.payment_method} onValueChange={v => setPaymentData(p => ({ ...p, payment_method: v }))}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                  <SelectItem value="eft">EFT</SelectItem>
                  <SelectItem value="online_gateway">Online Gateway</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Reference Number</Label><Input value={paymentData.payment_reference} onChange={e => setPaymentData(p => ({ ...p, payment_reference: e.target.value }))} className="bg-card" /></div>
            <div><Label>Notes</Label><Textarea value={paymentData.notes} onChange={e => setPaymentData(p => ({ ...p, notes: e.target.value }))} className="bg-card" rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayment(false)}>Cancel</Button>
            <Button onClick={recordPayment} disabled={saving}>{saving ? 'Recording...' : 'Record Payment'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
