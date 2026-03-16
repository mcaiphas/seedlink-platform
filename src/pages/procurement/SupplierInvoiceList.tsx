import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDocNumber } from '@/lib/document-numbers';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Filter, Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' }, submitted: { label: 'Submitted', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' }, paid: { label: 'Paid', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

interface SILine { purchase_order_item_id: string | null; goods_receipt_item_id: string | null; product_id: string | null; variant_id: string | null; description: string; quantity: number; quantity_uom: string; unit_price: number; tax_amount: number; line_total: number; }

export default function SupplierInvoiceList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
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
    const { data: items } = await supabase.from('purchase_order_items').select('*').eq('purchase_order_id', purchaseOrderId);
    if (items) setSiLines(items.map(i => ({ purchase_order_item_id: i.id, goods_receipt_item_id: null, product_id: null, variant_id: i.variant_id, description: i.product_description, quantity: Number(i.quantity), quantity_uom: i.quantity_uom, unit_price: Number(i.unit_price), tax_amount: Number(i.line_total) * 0.15, line_total: Number(i.line_total) })));
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

  return (
    <div className="space-y-6">
      <DataPageShell title="Supplier Invoices" description="Manage and match supplier invoices to procurement"
        action={<Button onClick={() => { setDialogOpen(true); setSupplierId(''); setPoId(''); setSiLines([]); setNotes(''); }} className="gap-2"><Plus className="h-4 w-4" />New Invoice</Button>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Total', value: data.length }, { label: 'Draft', value: data.filter(r => r.status === 'draft').length }, { label: 'Approved', value: data.filter(r => r.status === 'approved').length }, { label: 'Total Value', value: fmt(data.reduce((s, r) => s + Number(r.total_amount || 0), 0)) }].map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search invoice or supplier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent></Select>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Invoice #</TableHead><TableHead className="font-semibold">Supplier</TableHead><TableHead className="font-semibold">PO Ref</TableHead><TableHead className="font-semibold">Date</TableHead><TableHead className="font-semibold">Due</TableHead><TableHead className="font-semibold text-right">Total</TableHead><TableHead className="font-semibold">Status</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(r => { const st = STATUS_MAP[r.status] || { label: r.status, variant: 'outline' as const }; return (
              <TableRow key={r.id} className="hover:bg-muted/20">
                <TableCell><div className="flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.supplier_invoice_number}</span></div></TableCell>
                <TableCell className="font-medium">{r.suppliers?.supplier_name || '—'}</TableCell><TableCell className="font-mono text-sm text-muted-foreground">{r.purchase_orders?.po_number || '—'}</TableCell>
                <TableCell className="text-sm">{r.invoice_date}</TableCell><TableCell className="text-sm text-muted-foreground">{r.due_date || '—'}</TableCell>
                <TableCell className="text-right font-mono font-medium">{fmt(Number(r.total_amount || 0))}</TableCell><TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
              </TableRow>); })}{filtered.length === 0 && !loading && <EmptyState message="No supplier invoices found" colSpan={7} />}</TableBody></Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Supplier Invoice</DialogTitle><DialogDescription>Create an invoice and optionally match it to a purchase order.</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Supplier <span className="text-destructive">*</span></Label><Select value={supplierId} onValueChange={setSupplierId}><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Match to PO</Label><Select value={poId} onValueChange={loadPOLines}><SelectTrigger><SelectValue placeholder="Optional — select PO" /></SelectTrigger><SelectContent>{purchaseOrders.filter(po => !supplierId || po.supplier_id === supplierId).map(po => <SelectItem key={po.id} value={po.id}>{po.po_number}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Invoice Date</Label><Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            </div>
            {siLines.length > 0 && <>
              <Separator />
              <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Description</TableHead><TableHead className="w-[80px] font-semibold">Qty</TableHead><TableHead className="w-[100px] font-semibold">Unit Price</TableHead><TableHead className="w-[100px] font-semibold">Tax</TableHead><TableHead className="w-[100px] font-semibold text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>{siLines.map((l, idx) => (<TableRow key={idx}><TableCell className="text-sm">{l.description}</TableCell><TableCell><Input type="number" value={l.quantity} onChange={e => setSiLines(prev => prev.map((sl, i) => i === idx ? { ...sl, quantity: Number(e.target.value), line_total: Number(e.target.value) * sl.unit_price } : sl))} className="h-8 text-sm" /></TableCell><TableCell><Input type="number" step={0.01} value={l.unit_price} onChange={e => setSiLines(prev => prev.map((sl, i) => i === idx ? { ...sl, unit_price: Number(e.target.value), line_total: sl.quantity * Number(e.target.value) } : sl))} className="h-8 text-sm font-mono" /></TableCell><TableCell className="font-mono text-sm">{fmt(l.tax_amount)}</TableCell><TableCell className="text-right font-mono text-sm font-medium">{fmt(l.line_total)}</TableCell></TableRow>))}</TableBody></Table></div>
              <div className="text-right space-y-1"><p className="text-sm text-muted-foreground">Subtotal: <span className="font-mono font-medium text-foreground">{fmt(siLines.reduce((s, l) => s + l.line_total, 0))}</span></p><p className="text-sm text-muted-foreground">Tax: <span className="font-mono font-medium text-foreground">{fmt(siLines.reduce((s, l) => s + l.tax_amount, 0))}</span></p><p className="font-semibold">Total: <span className="font-mono">{fmt(siLines.reduce((s, l) => s + l.line_total + l.tax_amount, 0))}</span></p></div>
            </>}
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Invoice'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
