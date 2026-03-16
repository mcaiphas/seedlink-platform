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

interface LineItem {
  id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  weight_kg: number;
  line_total: number;
}

function calcTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const tax = subtotal * (taxRate / 100);
  return { subtotal, tax, total: subtotal + tax };
}

function calcLineTotal(qty: number, price: number, disc: number) {
  return qty * price * (1 - disc / 100);
}

export default function QuoteList() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editQuote, setEditQuote] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '', payment_terms: 'net_30', delivery_terms: '', expiry_date: '', notes: '', tax_rate: 15,
  });
  const [items, setItems] = useState<LineItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('quotes').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, customer_name, customer_code').eq('is_active', true).order('customer_name').limit(500),
    ]).then(([{ data: q }, { data: c }]) => {
      setQuotes(q || []);
      setCustomers(c || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    quotes.filter(q => {
      if (search && !(q.quote_number || '').toLowerCase().includes(search.toLowerCase()) &&
          !(q.customers?.customer_name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && q.status !== statusFilter) return false;
      return true;
    }), [quotes, search, statusFilter]);

  function openNew() {
    setEditQuote(null);
    setFormData({ customer_id: '', payment_terms: 'net_30', delivery_terms: '', expiry_date: '', notes: '', tax_rate: 15 });
    setItems([{ description: '', quantity: 1, unit_price: 0, discount_percent: 0, weight_kg: 0, line_total: 0 }]);
    setShowForm(true);
  }

  async function openEdit(q: any) {
    setEditQuote(q);
    setFormData({
      customer_id: q.customer_id || '', payment_terms: q.payment_terms || 'net_30',
      delivery_terms: q.delivery_terms || '', expiry_date: q.expiry_date || '',
      notes: q.notes || '', tax_rate: q.tax_rate || 15,
    });
    const { data } = await supabase.from('quote_items').select('*').eq('quote_id', q.id).order('sort_order');
    setItems((data || []).map(i => ({
      id: i.id, product_id: i.product_id, description: i.description || '',
      quantity: Number(i.quantity), unit_price: Number(i.unit_price),
      discount_percent: Number(i.discount_percent || 0), weight_kg: Number(i.weight_kg || 0),
      line_total: Number(i.line_total),
    })));
    setShowForm(true);
  }

  function updateItem(idx: number, field: string, value: any) {
    setItems(prev => {
      const next = [...prev];
      const item = { ...next[idx], [field]: value };
      if (['quantity', 'unit_price', 'discount_percent'].includes(field)) {
        item.line_total = calcLineTotal(
          field === 'quantity' ? value : item.quantity,
          field === 'unit_price' ? value : item.unit_price,
          field === 'discount_percent' ? value : item.discount_percent,
        );
      }
      next[idx] = item;
      return next;
    });
  }

  function addItem() {
    setItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0, discount_percent: 0, weight_kg: 0, line_total: 0 }]);
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!formData.customer_id) { toast({ title: 'Select a customer', variant: 'destructive' }); return; }
    if (items.length === 0) { toast({ title: 'Add at least one line item', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const { subtotal, tax, total } = calcTotals(items, formData.tax_rate);
      const { data: { user } } = await supabase.auth.getUser();

      if (editQuote) {
        await supabase.from('quotes').update({
          customer_id: formData.customer_id, payment_terms: formData.payment_terms,
          delivery_terms: formData.delivery_terms || null, expiry_date: formData.expiry_date || null,
          notes: formData.notes || null, tax_rate: formData.tax_rate,
          subtotal_amount: subtotal, tax_amount: tax, total_amount: total, updated_at: new Date().toISOString(),
        }).eq('id', editQuote.id);
        await supabase.from('quote_items').delete().eq('quote_id', editQuote.id);
        await supabase.from('quote_items').insert(items.map((item, idx) => ({
          quote_id: editQuote.id, description: item.description, quantity: item.quantity,
          unit_price: item.unit_price, discount_percent: item.discount_percent,
          weight_kg: item.weight_kg, line_total: item.line_total, sort_order: idx,
          product_id: item.product_id || null,
        })));
        logAudit({ action: 'update', entity_type: 'quote', entity_id: editQuote.id });
        toast({ title: 'Quote updated' });
      } else {
        const quoteNumber = await generateDocNumber('qt');
        const { data: newQuote } = await supabase.from('quotes').insert({
          quote_number: quoteNumber, customer_id: formData.customer_id,
          payment_terms: formData.payment_terms, delivery_terms: formData.delivery_terms || null,
          expiry_date: formData.expiry_date || null, notes: formData.notes || null,
          tax_rate: formData.tax_rate, subtotal_amount: subtotal, tax_amount: tax, total_amount: total,
          created_by: user?.id || null, status: 'draft',
        }).select().single();
        if (newQuote) {
          await supabase.from('quote_items').insert(items.map((item, idx) => ({
            quote_id: newQuote.id, description: item.description, quantity: item.quantity,
            unit_price: item.unit_price, discount_percent: item.discount_percent,
            weight_kg: item.weight_kg, line_total: item.line_total, sort_order: idx,
            product_id: item.product_id || null,
          })));
          logAudit({ action: 'create', entity_type: 'quote', entity_id: newQuote.id });
        }
        toast({ title: 'Quote created' });
      }

      setShowForm(false);
      const { data: refreshed } = await supabase.from('quotes').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200);
      setQuotes(refreshed || []);
    } catch {
      toast({ title: 'Error saving quote', variant: 'destructive' });
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('quotes').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    logAudit({ action: 'status_change', entity_type: 'quote', entity_id: id, new_values: { status } });
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    toast({ title: `Quote ${status}` });
  }

  async function convertToOrder(quote: any) {
    try {
      const { data: orderItems } = await supabase.from('quote_items').select('*').eq('quote_id', quote.id);
      const orderNumber = await generateDocNumber('ci');
      const { data: { user } } = await supabase.auth.getUser();

      const { data: order } = await supabase.from('orders').insert({
        order_number: orderNumber, customer_id: quote.customer_id, quote_id: quote.id,
        order_source: 'manual', payment_terms: quote.payment_terms, delivery_terms: quote.delivery_terms,
        subtotal_amount: quote.subtotal_amount, tax_amount: quote.tax_amount,
        total_amount: quote.total_amount, currency_code: quote.currency_code,
        status: 'pending', payment_status: 'unpaid', fulfillment_status: 'unfulfilled',
        user_id: user?.id, sales_rep_id: quote.sales_rep_id,
      }).select().single();

      if (order && orderItems) {
        await supabase.from('order_items').insert(orderItems.map(i => ({
          order_id: order.id, product_id: i.product_id, description: i.description,
          quantity: i.quantity, unit_price: i.unit_price, line_total: i.line_total,
          product_name: i.description,
        })));
      }

      await supabase.from('quotes').update({ status: 'converted', updated_at: new Date().toISOString() }).eq('id', quote.id);
      logAudit({ action: 'convert_to_order', entity_type: 'quote', entity_id: quote.id });
      setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'converted' } : q));
      toast({ title: 'Quote converted to order' });
    } catch {
      toast({ title: 'Conversion failed', variant: 'destructive' });
    }
  }

  const { subtotal, tax, total } = calcTotals(items, formData.tax_rate);

  return (
    <PageShell title="Quotes" subtitle="Prepare and manage customer quotations" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search quotes..."
      actions={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Quote</Button>}
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No quotes" description="Create your first quote to get started."
          action={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Quote</Button>} />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Quote #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(q => (
                <TableRow key={q.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6 font-medium cursor-pointer" onClick={() => openEdit(q)}>{q.quote_number}</TableCell>
                  <TableCell>{q.customers?.customer_name || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={q.status} /></TableCell>
                  <TableCell><DateDisplay date={q.quote_date} /></TableCell>
                  <TableCell><DateDisplay date={q.expiry_date} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={q.total_amount} currency={q.currency_code} /></TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {q.status === 'draft' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(q.id, 'sent')}>Send</Button>
                      )}
                      {(q.status === 'sent' || q.status === 'accepted') && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => convertToOrder(q)}>
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

      {/* Quote Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editQuote ? `Edit ${editQuote.quote_number}` : 'New Quote'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <Label>Customer *</Label>
                <Select value={formData.customer_id} onValueChange={v => setFormData(p => ({ ...p, customer_id: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name} ({c.customer_code})</SelectItem>)}
                  </SelectContent>
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
                <Label>Expiry Date</Label>
                <Input type="date" value={formData.expiry_date} onChange={e => setFormData(p => ({ ...p, expiry_date: e.target.value }))} className="bg-card" />
              </div>
              <div>
                <Label>Tax Rate (%)</Label>
                <Input type="number" value={formData.tax_rate} onChange={e => setFormData(p => ({ ...p, tax_rate: Number(e.target.value) }))} className="bg-card" />
              </div>
              <div className="sm:col-span-2">
                <Label>Delivery Terms</Label>
                <Input value={formData.delivery_terms} onChange={e => setFormData(p => ({ ...p, delivery_terms: e.target.value }))} className="bg-card" placeholder="e.g. Ex Works, FOB" />
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Line Items</h4>
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add Line</Button>
              </div>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      {idx === 0 && <Label className="text-xs">Description</Label>}
                      <Input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="bg-card" placeholder="Product / service" />
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
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-destructive" onClick={() => removeItem(idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <div className="space-y-1 text-right text-sm w-64">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={subtotal} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax ({formData.tax_rate}%)</span><CurrencyDisplay amount={tax} /></div>
                <Separator className="my-1" />
                <div className="flex justify-between font-semibold text-base"><span>Total</span><CurrencyDisplay amount={total} /></div>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editQuote ? 'Update Quote' : 'Create Quote'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
