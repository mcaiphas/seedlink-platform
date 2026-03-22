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
import { logAudit } from '@/lib/audit';
import { FileText, Plus, Trash2 } from 'lucide-react';

interface LineItem { description: string; quantity: number; unit_price: number; line_total: number; }

export default function CustomerCreditNoteList() {
  const [notes, setNotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', invoice_id: '', reason_code: 'returned_goods', notes: '' });
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0, line_total: 0 }]);

  useEffect(() => {
    Promise.all([
      supabase.from('customer_credit_notes').select('*, customers(customer_name)').order('created_at', { ascending: false }),
      supabase.from('customers').select('id, customer_name').eq('is_active', true).order('customer_name'),
      supabase.from('customer_invoices').select('id, invoice_number, customer_id').in('status', ['issued', 'partially_paid', 'paid']),
    ]).then(([{ data: cn }, { data: c }, { data: inv }]) => {
      setNotes(cn || []);
      setCustomers(c || []);
      setCustomerInvoices(inv || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    notes.filter(n => !search || (n.credit_note_number || '').toLowerCase().includes(search.toLowerCase()) || (n.customers?.customer_name || '').toLowerCase().includes(search.toLowerCase())),
  [notes, search]);

  function updateLineItem(idx: number, field: string, value: any) {
    setLineItems(prev => {
      const next = [...prev];
      const item = { ...next[idx], [field]: value };
      if (['quantity', 'unit_price'].includes(field)) item.line_total = item.quantity * item.unit_price;
      next[idx] = item;
      return next;
    });
  }

  async function handleCreate() {
    if (!formData.customer_id) { toast({ title: 'Select a customer', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const subtotal = lineItems.reduce((s, i) => s + i.line_total, 0);
      const { data: { user } } = await supabase.auth.getUser();
      const { data: numData } = await supabase.rpc('generate_ccn_number');
      const ccnNumber = numData || `CCN-${Date.now()}`;

      const { data: newCn } = await supabase.from('customer_credit_notes').insert({
        credit_note_number: ccnNumber, customer_id: formData.customer_id,
        invoice_id: formData.invoice_id || null, reason_code: formData.reason_code,
        notes: formData.notes || null, subtotal_amount: subtotal, total_amount: subtotal,
        status: 'draft', created_by: user?.id || null,
      } as any).select('*, customers(customer_name)').single();

      if (newCn) {
        await supabase.from('customer_credit_note_items').insert(lineItems.map(i => ({
          credit_note_id: newCn.id, description: i.description, quantity: i.quantity, unit_price: i.unit_price, line_total: i.line_total,
        })) as any);
        setNotes(prev => [newCn, ...prev]);
        logAudit({ action: 'create', entity_type: 'customer_credit_note', entity_id: newCn.id });
      }
      toast({ title: 'Credit note created' });
      setShowCreate(false);
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setSaving(false);
  }

  async function issueNote(id: string) {
    await supabase.from('customer_credit_notes').update({ status: 'issued', updated_at: new Date().toISOString() } as any).eq('id', id);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, status: 'issued' } : n));
    logAudit({ action: 'issue', entity_type: 'customer_credit_note', entity_id: id });
    toast({ title: 'Credit note issued' });
  }

  const subtotal = lineItems.reduce((s, i) => s + i.line_total, 0);
  const filteredInvoices = customerInvoices.filter(i => i.customer_id === formData.customer_id);

  return (
    <PageShell title="Customer Credit Notes" subtitle="Manage credits, returns, and adjustments" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search credit notes..."
      actions={<Button onClick={() => { setFormData({ customer_id: '', invoice_id: '', reason_code: 'returned_goods', notes: '' }); setLineItems([{ description: '', quantity: 1, unit_price: 0, line_total: 0 }]); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" />New Credit Note</Button>}>
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No credit notes" description="Create credit notes for returns or adjustments." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">CN #</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead>
              <TableHead>Date</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(cn => (
                <TableRow key={cn.id}>
                  <TableCell className="pl-6 font-medium">{cn.credit_note_number}</TableCell>
                  <TableCell>{cn.customers?.customer_name || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={cn.status} /></TableCell>
                  <TableCell><DateDisplay date={cn.issue_date} /></TableCell>
                  <TableCell className="capitalize text-xs">{(cn.reason_code || '').replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={cn.total_amount} currency={cn.currency_code} /></TableCell>
                  <TableCell className="text-right pr-6">
                    {cn.status === 'draft' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => issueNote(cn.id)}>Issue</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Customer Credit Note</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Customer *</Label>
                <Select value={formData.customer_id} onValueChange={v => setFormData(p => ({ ...p, customer_id: v, invoice_id: '' }))}>
                  <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Reference Invoice</Label>
                <Select value={formData.invoice_id} onValueChange={v => setFormData(p => ({ ...p, invoice_id: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>{filteredInvoices.map(i => <SelectItem key={i.id} value={i.id}>{i.invoice_number}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Reason</Label>
                <Select value={formData.reason_code} onValueChange={v => setFormData(p => ({ ...p, reason_code: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="returned_goods">Returned Goods</SelectItem>
                    <SelectItem value="pricing_correction">Pricing Correction</SelectItem>
                    <SelectItem value="order_cancellation">Order Cancellation</SelectItem>
                    <SelectItem value="refund">Customer Refund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" /></div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Line Items</h4>
                <Button size="sm" variant="outline" onClick={() => setLineItems(p => [...p, { description: '', quantity: 1, unit_price: 0, line_total: 0 }])}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
              {lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end mb-2">
                  <div className="col-span-5">{idx === 0 && <Label className="text-xs">Description</Label>}<Input value={item.description} onChange={e => updateLineItem(idx, 'description', e.target.value)} className="bg-card" /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Qty</Label>}<Input type="number" value={item.quantity} onChange={e => updateLineItem(idx, 'quantity', Number(e.target.value))} className="bg-card" /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Unit Price</Label>}<Input type="number" value={item.unit_price} onChange={e => updateLineItem(idx, 'unit_price', Number(e.target.value))} className="bg-card" /></div>
                  <div className="col-span-2">{idx === 0 && <Label className="text-xs">Total</Label>}<div className="h-10 flex items-center px-3 rounded-md border bg-muted text-sm font-medium"><CurrencyDisplay amount={item.line_total} /></div></div>
                  <div className="col-span-1"><Button size="icon" variant="ghost" className="h-10 w-10 text-destructive" onClick={() => setLineItems(p => p.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button></div>
                </div>
              ))}
            </div>
            <div className="flex justify-end"><div className="text-right text-sm font-semibold">Total: <CurrencyDisplay amount={subtotal} /></div></div>
          </div>
          <DialogFooter><Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Create Credit Note'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
