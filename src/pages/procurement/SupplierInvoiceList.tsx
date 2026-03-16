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
import { Plus, Search, Filter, Receipt, Eye, FileText, PackageCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' }, submitted: { label: 'Submitted', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' }, paid: { label: 'Paid', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

interface SILine { purchase_order_item_id: string | null; goods_receipt_item_id: string | null; product_id: string | null; variant_id: string | null; description: string; quantity: number; quantity_uom: string; unit_price: number; tax_amount: number; line_total: number; po_qty?: number; gr_qty?: number; }

export default function SupplierInvoiceList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSI, setSelectedSI] = useState<any>(null);
  const [siDetailLines, setSiDetailLines] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [poId, setPoId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [siLines, setSiLines] = useState<SILine[]>([]);

  const load = async () => { setLoading(true); const { data: d } = await supabase.from('supplier_invoices').select('*, suppliers(supplier_name), purchase_orders(po_number)').order('created_at', { ascending: false }); setData(d || []); setLoading(false); };
  useEffect(() => { load(); supabase.from('suppliers').select('id, supplier_name, supplier_code').eq('is_active', true).order('supplier_name').then(r => setSuppliers(r.data || [])); supabase.from('purchase_orders').select('id, po_number, supplier_id').order('created_at', { ascending: false }).then(r => setPurchaseOrders(r.data || [])); }, []);

  const loadPOLines = async (purchaseOrderId: string) => {
    setPoId(purchaseOrderId);
    const po = purchaseOrders.find(p => p.id === purchaseOrderId);
    if (po) setSupplierId(po.supplier_id);
    const [poItemsRes, grItemsRes] = await Promise.all([
      supabase.from('purchase_order_items').select('*').eq('purchase_order_id', purchaseOrderId),
      supabase.from('goods_receipt_items').select('*, goods_receipts!inner(purchase_order_id)').eq('goods_receipts.purchase_order_id', purchaseOrderId),
    ]);
    const poItems = poItemsRes.data || [];
    const grItems = grItemsRes.data || [];
    setSiLines(poItems.map(i => {
      const grQty = grItems.filter(g => g.purchase_order_item_id === i.id).reduce((s, g) => s + Number(g.quantity_received || 0), 0);
      return { purchase_order_item_id: i.id, goods_receipt_item_id: null, product_id: null, variant_id: i.variant_id, description: i.product_description, quantity: Number(i.quantity), quantity_uom: i.quantity_uom, unit_price: Number(i.unit_price), tax_amount: Number(i.line_total) * 0.15, line_total: Number(i.line_total), po_qty: Number(i.quantity), gr_qty: grQty };
    }));
  };

  const openDetail = async (si: any) => {
    setSelectedSI(si);
    setDetailOpen(true);
    const { data: lines } = await supabase.from('supplier_invoice_items').select('*, product_variants(variant_name, sku)').eq('supplier_invoice_id', si.id);
    setSiDetailLines(lines || []);
  };

  const handleCreate = async () => {
    if (!supplierId) { toast({ title: 'Select a supplier', variant: 'destructive' }); return; }
    setSaving(true);
    const siNumber = await generateDocNumber('si');
    const subtotal = siLines.reduce((s, l) => s + l.line_total, 0);
    const taxTotal = siLines.reduce((s, l) => s + l.tax_amount, 0);
    const { data: si, error } = await supabase.from('supplier_invoices').insert({ supplier_invoice_number: siNumber, supplier_id: supplierId, purchase_order_id: poId || null, invoice_date: invoiceDate, due_date: dueDate || null, currency_code: 'ZAR', subtotal_amount: subtotal, tax_amount: taxTotal, total_amount: subtotal + taxTotal, status: 'draft', notes: notes || null }).select('id').single();
    if (error || !si) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setSaving(false); return; }
    if (siLines.length) await supabase.from('supplier_invoice_items').insert(siLines.map(l => ({ supplier_invoice_id: si.id, purchase_order_item_id: l.purchase_order_item_id, goods_receipt_item_id: l.goods_receipt_item_id, product_id: l.product_id, variant_id: l.variant_id, description: l.description, quantity: l.quantity, quantity_uom: l.quantity_uom, unit_price: l.unit_price, tax_amount: l.tax_amount, line_total: l.line_total })));
    toast({ title: `Supplier invoice ${siNumber} created` }); setSaving(false); setDialogOpen(false); load();
  };

  const filtered = useMemo(() => data.filter(r => { const ms = !search || r.supplier_invoice_number?.toLowerCase().includes(search.toLowerCase()) || r.suppliers?.supplier_name?.toLowerCase().includes(search.toLowerCase()); const mst = statusFilter === 'all' || r.status === statusFilter; return ms && mst; }), [data, search, statusFilter]);
  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);
  const payable = useMemo(() => data.filter(r => r.status !== 'paid' && r.status !== 'cancelled').reduce((s, r) => s + Number(r.total_amount || 0), 0), [data]);

  return (
    <div className="space-y-6">
      <DataPageShell title="Supplier Invoices" description="Manage and match supplier invoices to procurement"
        action={<Button onClick={() => { setDialogOpen(true); setSupplierId(''); setPoId(''); setSiLines([]); setNotes(''); }} className="gap-2"><Plus className="h-4 w-4" />New Invoice</Button>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Invoices', value: data.length },
            { label: 'Draft', value: data.filter(r => r.status === 'draft').length },
            { label: 'Approved', value: data.filter(r => r.status === 'approved').length },
            { label: 'Payable', value: fmt(payable), highlight: true },
          ].map(s => (
            <Card key={s.label}><CardContent className="pt-5 pb-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className={`text-2xl font-bold mt-1 ${(s as any).highlight ? 'text-destructive' : ''}`}>{s.value}</p></CardContent></Card>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search invoice or supplier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Invoice #</TableHead><TableHead className="font-semibold">Supplier</TableHead><TableHead className="font-semibold">PO Ref</TableHead><TableHead className="font-semibold">Date</TableHead><TableHead className="font-semibold">Due</TableHead><TableHead className="font-semibold text-right">Total</TableHead><TableHead className="font-semibold">Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
            <TableBody>{filtered.map(r => { const st = STATUS_MAP[r.status] || { label: r.status, variant: 'outline' as const }; return (
              <TableRow key={r.id} className="group hover:bg-muted/20">
                <TableCell><div className="flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.supplier_invoice_number}</span></div></TableCell>
                <TableCell className="font-medium">{r.suppliers?.supplier_name || '—'}</TableCell>
                <TableCell>{r.purchase_orders?.po_number ? <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{r.purchase_orders.po_number}</span> : <span className="text-muted-foreground text-sm">—</span>}</TableCell>
                <TableCell className="text-sm">{r.invoice_date}</TableCell><TableCell className="text-sm text-muted-foreground">{r.due_date || '—'}</TableCell>
                <TableCell className="text-right font-mono font-medium">{fmt(Number(r.total_amount || 0))}</TableCell><TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openDetail(r)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>); })}{filtered.length === 0 && !loading && <EmptyState message="No supplier invoices found" colSpan={8} />}</TableBody></Table>
        </div>
      </DataPageShell>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Supplier Invoice</DialogTitle><DialogDescription>Create an invoice and optionally match it to a purchase order for three-way matching.</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Supplier <span className="text-destructive">*</span></Label><Select value={supplierId} onValueChange={setSupplierId}><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Match to PO</Label><Select value={poId} onValueChange={loadPOLines}><SelectTrigger><SelectValue placeholder="Optional — select PO" /></SelectTrigger><SelectContent>{purchaseOrders.filter(po => !supplierId || po.supplier_id === supplierId).map(po => <SelectItem key={po.id} value={po.id}>{po.po_number}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Invoice Date</Label><Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            </div>
            {siLines.length > 0 && <>
              <Separator />
              <div className="rounded-lg border overflow-hidden">
                <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Description</TableHead><TableHead className="w-[70px] font-semibold text-right">PO Qty</TableHead><TableHead className="w-[70px] font-semibold text-right">GR Qty</TableHead><TableHead className="w-[80px] font-semibold text-right">Inv Qty</TableHead><TableHead className="w-[100px] font-semibold text-right">Price</TableHead><TableHead className="w-[60px] font-semibold text-center">Match</TableHead><TableHead className="w-[100px] font-semibold text-right">Total</TableHead></TableRow></TableHeader>
                  <TableBody>{siLines.map((l, idx) => {
                    const matched = l.po_qty !== undefined && l.gr_qty !== undefined && l.quantity === l.po_qty && l.gr_qty >= l.po_qty;
                    const hasVariance = l.po_qty !== undefined && l.gr_qty !== undefined && (l.quantity !== l.po_qty || l.gr_qty < l.po_qty);
                    return (
                    <TableRow key={idx}>
                      <TableCell className="text-sm">{l.description}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">{l.po_qty ?? '—'}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">{l.gr_qty ?? '—'}</TableCell>
                      <TableCell><Input type="number" value={l.quantity} onChange={e => setSiLines(prev => prev.map((sl, i) => i === idx ? { ...sl, quantity: Number(e.target.value), line_total: Number(e.target.value) * sl.unit_price } : sl))} className="h-8 text-sm text-right" /></TableCell>
                      <TableCell><Input type="number" step={0.01} value={l.unit_price} onChange={e => setSiLines(prev => prev.map((sl, i) => i === idx ? { ...sl, unit_price: Number(e.target.value), line_total: sl.quantity * Number(e.target.value) } : sl))} className="h-8 text-sm font-mono text-right" /></TableCell>
                      <TableCell className="text-center">{matched ? <CheckCircle2 className="h-4 w-4 text-primary mx-auto" /> : hasVariance ? <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">{fmt(l.line_total)}</TableCell>
                    </TableRow>);
                  })}</TableBody></Table>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Subtotal: <span className="font-mono font-medium text-foreground">{fmt(siLines.reduce((s, l) => s + l.line_total, 0))}</span></p>
                <p className="text-sm text-muted-foreground">Tax: <span className="font-mono font-medium text-foreground">{fmt(siLines.reduce((s, l) => s + l.tax_amount, 0))}</span></p>
                <p className="font-semibold">Total: <span className="font-mono">{fmt(siLines.reduce((s, l) => s + l.line_total + l.tax_amount, 0))}</span></p>
              </div>
            </>}
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Invoice'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3"><Receipt className="h-5 w-5 text-primary" />Supplier Invoice — {selectedSI?.supplier_invoice_number}</DialogTitle>
            <DialogDescription>Invoice details and PO matching status.</DialogDescription>
          </DialogHeader>
          {selectedSI && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Supplier', value: selectedSI.suppliers?.supplier_name || '—' },
                  { label: 'PO Reference', value: selectedSI.purchase_orders?.po_number || 'Not matched' },
                  { label: 'Invoice Date', value: selectedSI.invoice_date },
                  { label: 'Due Date', value: selectedSI.due_date || '—' },
                  { label: 'Status', value: null, badge: selectedSI.status },
                  { label: 'Total', value: fmt(Number(selectedSI.total_amount || 0)) },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    {f.badge ? <Badge variant={(STATUS_MAP[f.badge]?.variant || 'outline') as any} className="text-xs mt-1">{STATUS_MAP[f.badge]?.label || f.badge}</Badge> : <p className="font-medium text-sm mt-0.5">{f.value}</p>}
                  </div>
                ))}
              </div>
              <div className="rounded-lg border overflow-hidden">
                <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Description</TableHead><TableHead className="font-semibold w-[80px] text-right">Qty</TableHead><TableHead className="font-semibold w-[100px] text-right">Unit Price</TableHead><TableHead className="font-semibold w-[100px] text-right">Total</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {siDetailLines.map(l => (
                      <TableRow key={l.id}>
                        <TableCell><p className="text-sm">{l.description}</p>{l.product_variants?.sku && <p className="text-xs font-mono text-muted-foreground">{l.product_variants.sku}</p>}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{Number(l.quantity)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{fmt(Number(l.unit_price))}</TableCell>
                        <TableCell className="text-right font-mono text-sm font-medium">{fmt(Number(l.line_total))}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/20 font-semibold"><TableCell colSpan={3} className="text-right">Total</TableCell><TableCell className="text-right font-mono">{fmt(Number(selectedSI.total_amount || 0))}</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>
              {selectedSI.notes && <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm">{selectedSI.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
