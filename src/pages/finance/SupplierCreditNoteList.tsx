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

export default function SupplierCreditNoteList() {
  const [notes, setNotes] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ supplier_id: '', supplier_invoice_id: '', reason_code: 'pricing_adjustment', notes: '' });
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0, line_total: 0 }]);

  useEffect(() => {
    Promise.all([
      supabase.from('supplier_credit_notes').select('*, suppliers(supplier_name)').order('created_at', { ascending: false }),
      supabase.from('suppliers').select('id, supplier_name').eq('is_active', true).order('supplier_name'),
    ]).then(([{ data: cn }, { data: s }]) => {
      setNotes(cn || []);
      setSuppliers(s || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    notes.filter(n => !search || (n.credit_note_number || '').toLowerCase().includes(search.toLowerCase()) || (n.suppliers?.supplier_name || '').toLowerCase().includes(search.toLowerCase())),
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
    if (!formData.supplier_id) { toast({ title: 'Select a supplier', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const subtotal = lineItems.reduce((s, i) => s + i.line_total, 0);
      const { data: { user } } = await supabase.auth.getUser();
      const { data: numData } = await supabase.rpc('generate_scn_number');
      const scnNumber = numData || `SCN-${Date.now()}`;

      const { data: newCn } = await supabase.from('supplier_credit_notes').insert({
        credit_note_number: scnNumber, supplier_id: formData.supplier_id,
        supplier_invoice_id: formData.supplier_invoice_id || null, reason_code: formData.reason_code,
        notes: formData.notes || null, subtotal_amount: subtotal, total_amount: subtotal,
        status: 'draft', created_by: user?.id || null,
      } as any).select('*, suppliers(supplier_name)').single();

      if (newCn) {
        await supabase.from('supplier_credit_note_items').insert(lineItems.map(i => ({
          credit_note_id: newCn.id, description: i.description, quantity: i.quantity, unit_price: i.unit_price, line_total: i.line_total,
        })) as any);
        setNotes(prev => [newCn, ...prev]);
        logAudit({ action: 'create', entity_type: 'supplier_credit_note', entity_id: newCn.id });
      }
      toast({ title: 'Credit note created' });
      setShowCreate(false);
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setSaving(false);
  }

  async function issueNote(id: string) {
    await supabase.from('supplier_credit_notes').update({ status: 'issued', updated_at: new Date().toISOString() } as any).eq('id', id);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, status: 'issued' } : n));
    logAudit({ action: 'issue', entity_type: 'supplier_credit_note', entity_id: id });
    toast({ title: 'Credit note issued' });
  }

  const subtotal = lineItems.reduce((s, i) => s + i.line_total, 0);

  return (
    <PageShell title="Supplier Credit Notes" subtitle="Manage supplier credits, rebates, and adjustments" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search credit notes..."
      actions={<Button onClick={() => { setFormData({ supplier_id: '', supplier_invoice_id: '', reason_code: 'pricing_adjustment', notes: '' }); setLineItems([{ description: '', quantity: 1, unit_price: 0, line_total: 0 }]); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" />New Credit Note</Button>}>
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No credit notes" description="Create supplier credit notes for adjustments." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">CN #</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead>
              <TableHead>Date</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(cn => (
                <TableRow key={cn.id}>
                  <TableCell className="pl-6 font-medium">{cn.credit_note_number}</TableCell>
                  <TableCell>{cn.suppliers?.supplier_name || '—'}</TableCell>
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
          <DialogHeader><DialogTitle>New Supplier Credit Note</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Supplier *</Label>
                <Select value={formData.supplier_id} onValueChange={v => setFormData(p => ({ ...p, supplier_id: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Reason</Label>
                <Select value={formData.reason_code} onValueChange={v => setFormData(p => ({ ...p, reason_code: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="returned_goods">Returned Goods</SelectItem>
                    <SelectItem value="pricing_adjustment">Pricing Adjustment</SelectItem>
                    <SelectItem value="rebate">Rebate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2"><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" /></div>
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
