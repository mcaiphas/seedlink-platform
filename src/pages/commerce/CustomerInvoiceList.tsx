import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDocNumber } from '@/lib/document-numbers';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Filter, FileText, Trash2, Eye, ArrowDownRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' }, sent: { label: 'Sent', variant: 'outline' },
  paid: { label: 'Paid', variant: 'default' }, overdue: { label: 'Overdue', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};
interface CILine { variant_id: string | null; description: string; quantity: number; quantity_uom: string; unit_price: number; line_total: number; }

export default function CustomerInvoiceList() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCI, setSelectedCI] = useState<any>(null);
  const [ciDetailLines, setCiDetailLines] = useState<any[]>([]);
  const [ciMovements, setCiMovements] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [depotId, setDepotId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [ciLines, setCiLines] = useState<CILine[]>([{ variant_id: null, description: '', quantity: 1, quantity_uom: 'unit', unit_price: 0, line_total: 0 }]);

  const load = async () => { setLoading(true); const { data: d } = await supabase.from('customer_invoices').select('*, depots(name)').order('created_at', { ascending: false }); setData(d || []); setLoading(false); };
  useEffect(() => {
    load();
    supabase.from('product_variants').select('id, variant_name, sku, selling_price, products(name)').eq('is_active', true).order('variant_name').then(r => setVariants(r.data || []));
    supabase.from('depots').select('id, name').eq('is_active', true).order('name').then(r => setDepots(r.data || []));
  }, []);

  const updateLine = (idx: number, field: keyof CILine, value: any) => {
    setCiLines(prev => prev.map((l, i) => {
      if (i !== idx) return l;
      const updated = { ...l, [field]: value };
      if (field === 'variant_id' && value) { const v = variants.find(vr => vr.id === value); if (v) { updated.description = `${v.products?.name || ''} - ${v.variant_name}`; updated.unit_price = Number(v.selling_price || 0); } }
      if (field === 'quantity' || field === 'unit_price') updated.line_total = Number(updated.quantity) * Number(updated.unit_price);
      return updated;
    }));
  };

  const openDetail = async (ci: any) => {
    setSelectedCI(ci);
    setDetailOpen(true);
    const [linesRes, movRes] = await Promise.all([
      supabase.from('customer_invoice_items').select('*, product_variants(variant_name, sku)').eq('customer_invoice_id', ci.id),
      supabase.from('stock_movements').select('*, product_variants(variant_name, sku), depots(name)').eq('reference_type', 'customer_invoice').eq('reference_id', ci.id),
    ]);
    setCiDetailLines(linesRes.data || []);
    setCiMovements(movRes.data || []);
  };

  const handleCreate = async () => {
    const validLines = ciLines.filter(l => l.description.trim());
    if (!validLines.length) { toast({ title: 'Add at least one line', variant: 'destructive' }); return; }
    setSaving(true);
    const invNumber = await generateDocNumber('ci');
    const subtotal = validLines.reduce((s, l) => s + l.line_total, 0);
    const tax = subtotal * 0.15;
    const { data: ci, error } = await supabase.from('customer_invoices').insert({ invoice_number: invNumber, customer_id: null, order_id: null, depot_id: depotId || null, invoice_date: invoiceDate, due_date: dueDate || null, currency_code: 'ZAR', subtotal_amount: subtotal, tax_amount: tax, total_amount: subtotal + tax, status: 'draft', notes: notes || null, created_by: user?.id || null }).select('id').single();
    if (error || !ci) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setSaving(false); return; }
    await supabase.from('customer_invoice_items').insert(validLines.map(l => ({ customer_invoice_id: ci.id, variant_id: l.variant_id, description: l.description, quantity: l.quantity, quantity_uom: l.quantity_uom, unit_price: l.unit_price, line_total: l.line_total })));
    toast({ title: `Invoice ${invNumber} created` }); setSaving(false); setDialogOpen(false); load();
  };

  const filtered = useMemo(() => data.filter(r => { const ms = !search || r.invoice_number?.toLowerCase().includes(search.toLowerCase()); const mst = statusFilter === 'all' || r.status === statusFilter; return ms && mst; }), [data, search, statusFilter]);
  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);
  const receivable = useMemo(() => data.filter(r => r.status !== 'paid' && r.status !== 'cancelled').reduce((s, r) => s + Number(r.total_amount || 0), 0), [data]);

  return (
    <div className="space-y-6">
      <DataPageShell title="Customer Invoices" description="Manage invoices and accounts receivable"
        action={<Button onClick={() => { setDialogOpen(true); setCiLines([{ variant_id: null, description: '', quantity: 1, quantity_uom: 'unit', unit_price: 0, line_total: 0 }]); setNotes(''); setDepotId(''); }} className="gap-2"><Plus className="h-4 w-4" />New Invoice</Button>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Invoices', value: data.length },
            { label: 'Draft', value: data.filter(r => r.status === 'draft').length },
            { label: 'Paid', value: data.filter(r => r.status === 'paid').length },
            { label: 'Receivable', value: fmt(receivable), highlight: true },
          ].map(s => (
            <Card key={s.label}><CardContent className="pt-5 pb-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className={`text-2xl font-bold mt-1 ${(s as any).highlight ? 'text-primary' : ''}`}>{s.value}</p></CardContent></Card>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search invoice number..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Invoice #</TableHead><TableHead className="font-semibold">Depot</TableHead><TableHead className="font-semibold">Date</TableHead><TableHead className="font-semibold">Due</TableHead><TableHead className="font-semibold text-right">Total</TableHead><TableHead className="font-semibold">Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
            <TableBody>{filtered.map(r => { const st = STATUS_MAP[r.status] || { label: r.status, variant: 'outline' as const }; return (
              <TableRow key={r.id} className="group hover:bg-muted/20">
                <TableCell><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.invoice_number}</span></div></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.depots?.name || '—'}</TableCell>
                <TableCell className="text-sm">{r.invoice_date}</TableCell><TableCell className="text-sm text-muted-foreground">{r.due_date || '—'}</TableCell>
                <TableCell className="text-right font-mono font-medium">{fmt(Number(r.total_amount || 0))}</TableCell><TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openDetail(r)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>); })}{filtered.length === 0 && !loading && <EmptyState message="No customer invoices found" colSpan={7} />}</TableBody></Table>
        </div>
      </DataPageShell>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Customer Invoice</DialogTitle><DialogDescription>Create an invoice with line items from product variants.</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5"><Label>Invoice Date</Label><Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Depot (stock source)</Label><Select value={depotId} onValueChange={setDepotId}><SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger><SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <Separator />
            <div className="flex items-center justify-between"><p className="text-sm font-semibold">Line Items</p><Button size="sm" variant="outline" onClick={() => setCiLines(prev => [...prev, { variant_id: null, description: '', quantity: 1, quantity_uom: 'unit', unit_price: 0, line_total: 0 }])} className="gap-2"><Plus className="h-3.5 w-3.5" />Add Line</Button></div>
            <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="w-[220px] font-semibold">Variant</TableHead><TableHead className="font-semibold">Description</TableHead><TableHead className="w-[80px] font-semibold">Qty</TableHead><TableHead className="w-[100px] font-semibold">Price</TableHead><TableHead className="w-[100px] font-semibold text-right">Total</TableHead><TableHead className="w-8" /></TableRow></TableHeader>
              <TableBody>{ciLines.map((line, idx) => (<TableRow key={idx}>
                <TableCell><Select value={line.variant_id || ''} onValueChange={v => updateLine(idx, 'variant_id', v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{variants.map(v => <SelectItem key={v.id} value={v.id}><span className="font-mono text-xs">{v.sku}</span> — {v.variant_name}</SelectItem>)}</SelectContent></Select></TableCell>
                <TableCell><Input value={line.description} onChange={e => updateLine(idx, 'description', e.target.value)} className="h-8 text-sm" /></TableCell>
                <TableCell><Input type="number" min={0} value={line.quantity} onChange={e => updateLine(idx, 'quantity', Number(e.target.value))} className="h-8 text-sm" /></TableCell>
                <TableCell><Input type="number" step={0.01} value={line.unit_price} onChange={e => updateLine(idx, 'unit_price', Number(e.target.value))} className="h-8 text-sm font-mono" /></TableCell>
                <TableCell className="text-right font-mono text-sm">{fmt(line.line_total)}</TableCell>
                <TableCell>{ciLines.length > 1 && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setCiLines(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button>}</TableCell>
              </TableRow>))}</TableBody></Table></div>
            <div className="text-right space-y-1"><p className="text-sm">Subtotal: <span className="font-mono font-medium">{fmt(ciLines.reduce((s, l) => s + l.line_total, 0))}</span></p><p className="text-sm">VAT (15%): <span className="font-mono font-medium">{fmt(ciLines.reduce((s, l) => s + l.line_total, 0) * 0.15)}</span></p><p className="font-semibold">Total: <span className="font-mono">{fmt(ciLines.reduce((s, l) => s + l.line_total, 0) * 1.15)}</span></p></div>
            <div className="rounded-lg border bg-amber-500/5 border-amber-500/20 p-3 flex items-center gap-2 text-sm"><AlertCircle className="h-4 w-4 text-amber-600" /><span>Stock will be reduced when this invoice is confirmed or fulfilled.</span></div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Invoice'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary" />Customer Invoice — {selectedCI?.invoice_number}</DialogTitle>
            <DialogDescription>Invoice details and stock deduction status.</DialogDescription>
          </DialogHeader>
          {selectedCI && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Invoice Date', value: selectedCI.invoice_date },
                  { label: 'Due Date', value: selectedCI.due_date || '—' },
                  { label: 'Depot', value: selectedCI.depots?.name || '—' },
                  { label: 'Status', value: null, badge: selectedCI.status },
                  { label: 'Subtotal', value: fmt(Number(selectedCI.subtotal_amount || 0)) },
                  { label: 'Total', value: fmt(Number(selectedCI.total_amount || 0)) },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    {f.badge ? <Badge variant={(STATUS_MAP[f.badge]?.variant || 'outline') as any} className="text-xs mt-1">{STATUS_MAP[f.badge]?.label || f.badge}</Badge> : <p className="font-medium text-sm mt-0.5">{f.value}</p>}
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Line Items ({ciDetailLines.length})</p>
                <div className="rounded-lg border overflow-hidden">
                  <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Description</TableHead><TableHead className="font-semibold w-[80px] text-right">Qty</TableHead><TableHead className="font-semibold w-[100px] text-right">Price</TableHead><TableHead className="font-semibold w-[100px] text-right">Total</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {ciDetailLines.map(l => (
                        <TableRow key={l.id}>
                          <TableCell><p className="text-sm">{l.description}</p>{l.product_variants?.sku && <p className="text-xs font-mono text-muted-foreground">{l.product_variants.sku}</p>}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{Number(l.quantity)}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Number(l.unit_price))}</TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">{fmt(Number(l.line_total))}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/20 font-semibold"><TableCell colSpan={3} className="text-right">Total</TableCell><TableCell className="text-right font-mono">{fmt(Number(selectedCI.total_amount || 0))}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2"><ArrowDownRight className="h-4 w-4 text-destructive" />Stock Deductions ({ciMovements.length})</p>
                {ciMovements.length > 0 ? (
                  <div className="rounded-lg border overflow-hidden">
                    <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Variant</TableHead><TableHead className="font-semibold">Depot</TableHead><TableHead className="font-semibold text-right">Qty</TableHead><TableHead className="font-semibold">Type</TableHead></TableRow></TableHeader>
                      <TableBody>{ciMovements.map(m => (
                        <TableRow key={m.id}>
                          <TableCell className="text-sm font-medium">{m.product_variants?.variant_name || '—'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.depots?.name || '—'}</TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium text-destructive">-{Number(m.quantity)}</TableCell>
                          <TableCell><Badge variant="secondary" className="text-xs gap-1"><ArrowDownRight className="h-3 w-3" />{m.movement_type}</Badge></TableCell>
                        </TableRow>
                      ))}</TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No stock deductions recorded yet. Stock will be reduced upon fulfillment.</div>
                )}
              </div>

              {selectedCI.notes && <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm">{selectedCI.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
