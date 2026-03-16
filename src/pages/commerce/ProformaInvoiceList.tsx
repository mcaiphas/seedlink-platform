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
import { toast } from '@/hooks/use-toast';
import { generateDocNumber } from '@/lib/document-numbers';
import { logAudit } from '@/lib/audit';
import { FileText, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ProductLineItemSelect, ProductOption } from '@/components/commerce/ProductLineItemSelect';

interface LineItem {
  product_id?: string; description: string; quantity: number; unit_price: number;
  discount_percent: number; weight_kg: number; line_total: number;
}

function calcTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const tax = subtotal * (taxRate / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export default function ProformaInvoiceList() {
  const [proformas, setProformas] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', payment_terms: 'net_30', due_date: '', notes: '', tax_rate: 15 });
  const [items, setItems] = useState<LineItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('proforma_invoices').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, customer_name, customer_code').eq('is_active', true).order('customer_name').limit(500),
    ]).then(([{ data: p }, { data: c }]) => {
      setProformas(p || []);
      setCustomers(c || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    proformas.filter(p => {
      if (search && !(p.proforma_number || '').toLowerCase().includes(search.toLowerCase()) &&
          !(p.customers?.customer_name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    }), [proformas, search, statusFilter]);

  function openNew() {
    setFormData({ customer_id: '', payment_terms: 'net_30', due_date: '', notes: '', tax_rate: 15 });
    setItems([{ description: '', quantity: 1, unit_price: 0, discount_percent: 0, weight_kg: 0, line_total: 0 }]);
    setShowForm(true);
  }

  function updateItem(idx: number, field: string, value: any) {
    setItems(prev => {
      const next = [...prev];
      const item = { ...next[idx], [field]: value };
      if (['quantity', 'unit_price', 'discount_percent'].includes(field)) {
        item.line_total = item.quantity * item.unit_price * (1 - item.discount_percent / 100);
      }
      next[idx] = item;
      return next;
    });
  }

  function handleProductSelect(idx: number, product: ProductOption | null) {
    if (!product) return;
    setItems(prev => {
      const next = [...prev];
      const item = { ...next[idx] };
      item.product_id = product.id;
      item.description = product.name + (product.sku ? ` (${product.sku})` : '');
      item.unit_price = product.default_selling_price || item.unit_price;
      item.line_total = item.quantity * item.unit_price * (1 - item.discount_percent / 100);
      next[idx] = item;
      return next;
    });
  }

  async function handleSave() {
    if (!formData.customer_id) { toast({ title: 'Select a customer', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const { subtotal, tax, total } = calcTotals(items, formData.tax_rate);
      const { data: { user } } = await supabase.auth.getUser();
      const proformaNumber = await generateDocNumber('pi');

      const { data: newProforma } = await supabase.from('proforma_invoices').insert({
        proforma_number: proformaNumber, customer_id: formData.customer_id,
        payment_terms: formData.payment_terms, due_date: formData.due_date || null,
        notes: formData.notes || null, tax_rate: formData.tax_rate,
        subtotal_amount: subtotal, tax_amount: tax, total_amount: total,
        created_by: user?.id || null,
      }).select().single();

      if (newProforma) {
        await supabase.from('proforma_invoice_items').insert(items.map((item, idx) => ({
          proforma_invoice_id: newProforma.id, description: item.description, quantity: item.quantity,
          unit_price: item.unit_price, discount_percent: item.discount_percent,
          weight_kg: item.weight_kg, line_total: item.line_total, sort_order: idx,
          product_id: item.product_id || null,
        })));
        logAudit({ action: 'create', entity_type: 'proforma_invoice', entity_id: newProforma.id });
      }
      toast({ title: 'Proforma invoice created' });
      setShowForm(false);
      const { data: refreshed } = await supabase.from('proforma_invoices').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200);
      setProformas(refreshed || []);
    } catch {
      toast({ title: 'Error saving', variant: 'destructive' });
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('proforma_invoices').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    logAudit({ action: 'status_change', entity_type: 'proforma_invoice', entity_id: id, new_values: { status } });
    setProformas(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast({ title: `Proforma ${status}` });
  }

  async function convertToOrder(proforma: any) {
    try {
      const { data: lineItems } = await supabase.from('proforma_invoice_items').select('*').eq('proforma_invoice_id', proforma.id);
      const orderNumber = await generateDocNumber('ci');
      const { data: { user } } = await supabase.auth.getUser();

      const { data: order } = await supabase.from('orders').insert({
        order_number: orderNumber, customer_id: proforma.customer_id,
        order_source: 'manual', payment_terms: proforma.payment_terms,
        subtotal_amount: proforma.subtotal_amount, tax_amount: proforma.tax_amount,
        total_amount: proforma.total_amount, currency_code: proforma.currency_code,
        status: 'pending', payment_status: 'unpaid', fulfillment_status: 'unfulfilled',
        user_id: user?.id,
      }).select().single();

      if (order && lineItems) {
        await supabase.from('order_items').insert(lineItems.map(i => ({
          order_id: order.id, product_id: i.product_id, description: i.description,
          quantity: i.quantity, unit_price: i.unit_price, line_total: i.line_total, product_name: i.description,
        })));
      }

      await supabase.from('proforma_invoices').update({ status: 'converted', converted_order_id: order?.id, updated_at: new Date().toISOString() }).eq('id', proforma.id);
      logAudit({ action: 'convert_to_order', entity_type: 'proforma_invoice', entity_id: proforma.id });
      setProformas(prev => prev.map(p => p.id === proforma.id ? { ...p, status: 'converted' } : p));
      toast({ title: 'Converted to order' });
    } catch {
      toast({ title: 'Conversion failed', variant: 'destructive' });
    }
  }

  const { subtotal, tax, total } = calcTotals(items, formData.tax_rate);

  return (
    <PageShell title="Proforma Invoices" subtitle="Pre-payment invoices for customers" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search proformas..."
      actions={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Proforma</Button>}
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No proforma invoices" description="Create a proforma invoice for pre-payment."
          action={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Proforma</Button>} />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Proforma #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6 font-medium">{p.proforma_number}</TableCell>
                  <TableCell>{p.customers?.customer_name || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={p.status} /></TableCell>
                  <TableCell><DateDisplay date={p.issue_date} /></TableCell>
                  <TableCell><DateDisplay date={p.due_date} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={p.total_amount} currency={p.currency_code} /></TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {p.status === 'draft' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(p.id, 'sent')}>Send</Button>
                      )}
                      {p.status === 'sent' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(p.id, 'paid')}>Mark Paid</Button>
                      )}
                      {(p.status === 'paid' || p.status === 'sent') && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => convertToOrder(p)}>
                          <ArrowRight className="h-3 w-3 mr-1" />Order
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Proforma Invoice</DialogTitle></DialogHeader>
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
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={formData.due_date} onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))} className="bg-card" />
              </div>
              <div>
                <Label>Tax Rate (%)</Label>
                <Input type="number" value={formData.tax_rate} onChange={e => setFormData(p => ({ ...p, tax_rate: Number(e.target.value) }))} className="bg-card" />
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Line Items</h4>
                <Button size="sm" variant="outline" onClick={() => setItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0, discount_percent: 0, weight_kg: 0, line_total: 0 }])}>
                  <Plus className="h-3 w-3 mr-1" />Add Line
                </Button>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end mb-2">
                  <div className="col-span-4">
                    {idx === 0 && <Label className="text-xs">Description</Label>}
                    <Input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="bg-card" />
                  </div>
                  <div className="col-span-1">
                    {idx === 0 && <Label className="text-xs">Qty</Label>}
                    <Input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="bg-card" />
                  </div>
                  <div className="col-span-2">
                    {idx === 0 && <Label className="text-xs">Unit Price</Label>}
                    <Input type="number" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', Number(e.target.value))} className="bg-card" />
                  </div>
                  <div className="col-span-1">
                    {idx === 0 && <Label className="text-xs">Disc %</Label>}
                    <Input type="number" value={item.discount_percent} onChange={e => updateItem(idx, 'discount_percent', Number(e.target.value))} className="bg-card" />
                  </div>
                  <div className="col-span-1">
                    {idx === 0 && <Label className="text-xs">Kg</Label>}
                    <Input type="number" value={item.weight_kg} onChange={e => updateItem(idx, 'weight_kg', Number(e.target.value))} className="bg-card" />
                  </div>
                  <div className="col-span-2">
                    {idx === 0 && <Label className="text-xs">Total</Label>}
                    <div className="h-10 flex items-center px-3 rounded-md border bg-muted text-sm font-medium">
                      <CurrencyDisplay amount={item.line_total} />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-destructive" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Proforma'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
