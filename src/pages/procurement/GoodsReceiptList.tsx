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
import { Plus, Search, PackageCheck, Truck, Eye, ArrowUpRight, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface GRLine {
  purchase_order_item_id: string | null;
  variant_id: string | null;
  batch_number: string;
  quantity_received: number;
  quantity_uom: string;
  unit_cost: number;
  expiry_date: string;
  product_description?: string;
  ordered_qty?: number;
}

export default function GoodsReceiptList() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedGR, setSelectedGR] = useState<any>(null);
  const [grDetail, setGrDetail] = useState<any[]>([]);
  const [grMovements, setGrMovements] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedPO, setSelectedPO] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [grLines, setGrLines] = useState<GRLine[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [poDetails, setPoDetails] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('goods_receipts').select('*, purchase_orders(po_number), suppliers(supplier_name), depots(name)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };
  const loadPOs = async () => {
    const { data: pos } = await supabase.from('purchase_orders').select('id, po_number, supplier_id, depot_id, suppliers(supplier_name), depots(name)').in('status', ['approved', 'submitted']).order('created_at', { ascending: false });
    setPurchaseOrders(pos || []);
  };
  useEffect(() => { load(); loadPOs(); }, []);

  const loadPOLines = async (poId: string) => {
    setSelectedPO(poId);
    const po = purchaseOrders.find(p => p.id === poId);
    setPoDetails(po);
    const { data: items } = await supabase.from('purchase_order_items').select('*').eq('purchase_order_id', poId);
    if (items) {
      setGrLines(items.map(i => ({
        purchase_order_item_id: i.id, variant_id: i.variant_id, batch_number: '',
        quantity_received: Number(i.quantity), quantity_uom: i.quantity_uom,
        unit_cost: Number(i.unit_price), expiry_date: '',
        product_description: i.product_description, ordered_qty: Number(i.quantity),
      })));
    }
  };

  const openDetail = async (gr: any) => {
    setSelectedGR(gr);
    setDetailOpen(true);
    const [itemsRes, movRes] = await Promise.all([
      supabase.from('goods_receipt_items').select('*, product_variants(variant_name, sku)').eq('goods_receipt_id', gr.id),
      supabase.from('stock_movements').select('*, product_variants(variant_name, sku), depots(name)').eq('reference_type', 'goods_receipt').eq('reference_id', gr.id),
    ]);
    setGrDetail(itemsRes.data || []);
    setGrMovements(movRes.data || []);
  };

  const handleCreate = async () => {
    if (!selectedPO || grLines.length === 0) { toast({ title: 'Select PO and review lines', variant: 'destructive' }); return; }
    setSaving(true);
    const grNumber = await generateDocNumber('gr');
    const po = purchaseOrders.find(p => p.id === selectedPO);
    const { data: gr, error: grErr } = await supabase.from('goods_receipts').insert({
      receipt_number: grNumber, purchase_order_id: selectedPO,
      supplier_id: po?.supplier_id || null, depot_id: po?.depot_id || null,
      received_by: user?.id || null, receipt_date: receiptDate,
      status: 'received', notes: notes || null,
    }).select('id').single();
    if (grErr || !gr) { toast({ title: 'Error', description: grErr?.message, variant: 'destructive' }); setSaving(false); return; }

    const linePayloads = grLines.filter(l => l.quantity_received > 0).map(l => ({
      goods_receipt_id: gr.id, purchase_order_item_id: l.purchase_order_item_id,
      variant_id: l.variant_id, batch_number: l.batch_number || null,
      quantity_received: l.quantity_received, quantity_uom: l.quantity_uom,
      unit_cost: l.unit_cost, expiry_date: l.expiry_date || null,
    }));
    if (linePayloads.length) {
      await supabase.from('goods_receipt_items').insert(linePayloads);
      const movements = linePayloads.filter(l => l.variant_id).map(l => ({
        variant_id: l.variant_id!, depot_id: po?.depot_id || null,
        movement_type: 'receipt', quantity: l.quantity_received,
        quantity_uom: l.quantity_uom, unit_cost: l.unit_cost,
        reference_type: 'goods_receipt', reference_id: gr.id,
        notes: `GR ${grNumber}`, created_by: user?.id || null,
      }));
      if (movements.length) await supabase.from('stock_movements').insert(movements);
    }
    toast({ title: `Goods receipt ${grNumber} created`, description: `${linePayloads.length} item(s) received. Stock movements created.` });
    setSaving(false); setDialogOpen(false); setSelectedPO(''); setGrLines([]); setNotes(''); load();
  };

  const filtered = useMemo(() => data.filter(r => !search || r.receipt_number?.toLowerCase().includes(search.toLowerCase()) || r.purchase_orders?.po_number?.toLowerCase().includes(search.toLowerCase())), [data, search]);
  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);

  return (
    <div className="space-y-6">
      <DataPageShell title="Goods Receipts" description="Receive goods against purchase orders"
        action={<Button onClick={() => { setDialogOpen(true); setSelectedPO(''); setGrLines([]); setNotes(''); }} className="gap-2"><Plus className="h-4 w-4" />Receive Goods</Button>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Receipts', value: data.length },
            { label: 'Received', value: data.filter(r => r.status === 'received').length },
            { label: 'This Month', value: data.filter(r => new Date(r.receipt_date).getMonth() === new Date().getMonth()).length },
            { label: 'Linked to PO', value: data.filter(r => r.purchase_order_id).length },
          ].map(s => (
            <Card key={s.label}><CardContent className="pt-5 pb-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></CardContent></Card>
          ))}
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search receipt or PO number..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader><TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Receipt #</TableHead><TableHead className="font-semibold">Purchase Order</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead><TableHead className="font-semibold">Depot</TableHead>
              <TableHead className="font-semibold">Date</TableHead><TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="group hover:bg-muted/20">
                  <TableCell><div className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.receipt_number}</span></div></TableCell>
                  <TableCell className="font-mono text-sm">{r.purchase_orders?.po_number || '—'}</TableCell>
                  <TableCell>{r.suppliers?.supplier_name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.depots?.name || '—'}</TableCell>
                  <TableCell className="text-sm">{r.receipt_date}</TableCell>
                  <TableCell><Badge variant="default" className="text-xs">{r.status}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openDetail(r)}><Eye className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && !loading && <EmptyState message="No goods receipts found" colSpan={7} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Receive Goods</DialogTitle><DialogDescription>Select a purchase order and confirm received quantities.</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Purchase Order <span className="text-destructive">*</span></Label>
                <Select value={selectedPO} onValueChange={loadPOLines}><SelectTrigger><SelectValue placeholder="Select PO" /></SelectTrigger>
                  <SelectContent>{purchaseOrders.map(po => <SelectItem key={po.id} value={po.id}>{po.po_number} — {po.suppliers?.supplier_name}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label>Receipt Date</Label><Input type="date" value={receiptDate} onChange={e => setReceiptDate(e.target.value)} /></div>
            </div>
            {poDetails && <div className="flex gap-4 text-sm">
              <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Supplier</p><p className="font-medium">{poDetails.suppliers?.supplier_name}</p></div>
              <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Depot</p><p className="font-medium">{poDetails.depots?.name || 'Not set'}</p></div>
            </div>}
            {grLines.length > 0 && <div className="rounded-lg border overflow-hidden">
              <Table><TableHeader><TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Item</TableHead><TableHead className="w-[80px] font-semibold">Ordered</TableHead>
                <TableHead className="w-[90px] font-semibold">Receive</TableHead><TableHead className="w-[100px] font-semibold">Batch #</TableHead>
                <TableHead className="w-[100px] font-semibold">Unit Cost</TableHead><TableHead className="w-[110px] font-semibold">Expiry</TableHead>
              </TableRow></TableHeader>
              <TableBody>{grLines.map((line, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-sm">{line.product_description}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{line.ordered_qty}</TableCell>
                  <TableCell><Input type="number" min={0} value={line.quantity_received} onChange={e => setGrLines(prev => prev.map((l, i) => i === idx ? { ...l, quantity_received: Number(e.target.value) } : l))} className="h-8 text-sm" /></TableCell>
                  <TableCell><Input value={line.batch_number} onChange={e => setGrLines(prev => prev.map((l, i) => i === idx ? { ...l, batch_number: e.target.value } : l))} className="h-8 text-sm" placeholder="Optional" /></TableCell>
                  <TableCell><Input type="number" step={0.01} value={line.unit_cost} onChange={e => setGrLines(prev => prev.map((l, i) => i === idx ? { ...l, unit_cost: Number(e.target.value) } : l))} className="h-8 text-sm font-mono" /></TableCell>
                  <TableCell><Input type="date" value={line.expiry_date} onChange={e => setGrLines(prev => prev.map((l, i) => i === idx ? { ...l, expiry_date: e.target.value } : l))} className="h-8 text-sm" /></TableCell>
                </TableRow>
              ))}</TableBody></Table>
            </div>}
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
            {grLines.length > 0 && <div className="rounded-lg border bg-primary/5 border-primary/20 p-3 flex items-center gap-2 text-sm"><ArrowUpRight className="h-4 w-4 text-primary" /><span className="text-primary font-medium">Stock movements will be created automatically for {grLines.filter(l => l.quantity_received > 0 && l.variant_id).length} variant(s).</span></div>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving || !selectedPO}>{saving ? 'Processing...' : 'Confirm Receipt'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3"><PackageCheck className="h-5 w-5 text-primary" />Goods Receipt — {selectedGR?.receipt_number}</DialogTitle>
            <DialogDescription>Received items and resulting stock movements.</DialogDescription>
          </DialogHeader>
          {selectedGR && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Purchase Order', value: selectedGR.purchase_orders?.po_number || '—' },
                  { label: 'Supplier', value: selectedGR.suppliers?.supplier_name || '—' },
                  { label: 'Depot', value: selectedGR.depots?.name || '—' },
                  { label: 'Receipt Date', value: selectedGR.receipt_date },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-medium text-sm mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Received Items ({grDetail.length})</p>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader><TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Variant</TableHead>
                      <TableHead className="font-semibold w-[80px] text-right">Received</TableHead>
                      <TableHead className="font-semibold w-[80px]">Batch</TableHead>
                      <TableHead className="font-semibold w-[100px] text-right">Unit Cost</TableHead>
                      <TableHead className="font-semibold w-[100px]">Expiry</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {grDetail.map(l => (
                        <TableRow key={l.id}>
                          <TableCell><p className="text-sm font-medium">{l.product_variants?.variant_name || '—'}</p>{l.product_variants?.sku && <p className="text-xs font-mono text-muted-foreground">{l.product_variants.sku}</p>}</TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium text-primary">+{Number(l.quantity_received)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{l.batch_number || '—'}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Number(l.unit_cost || 0))}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{l.expiry_date || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-primary" />Stock Movements Created ({grMovements.length})</p>
                {grMovements.length > 0 ? (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader><TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Variant</TableHead>
                        <TableHead className="font-semibold">Depot</TableHead>
                        <TableHead className="font-semibold text-right">Qty</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {grMovements.map(m => (
                          <TableRow key={m.id}>
                            <TableCell className="text-sm font-medium">{m.product_variants?.variant_name || '—'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{m.depots?.name || '—'}</TableCell>
                            <TableCell className="text-right font-mono text-sm font-medium text-primary">+{Number(m.quantity)}</TableCell>
                            <TableCell><Badge variant="default" className="text-xs gap-1"><ArrowUpRight className="h-3 w-3" />receipt</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No stock movements linked to this receipt</div>
                )}
              </div>

              {selectedGR.notes && <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm">{selectedGR.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
