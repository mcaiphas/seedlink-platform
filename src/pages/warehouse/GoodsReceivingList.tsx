import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell } from '@/components/DataPageShell';
import { StatusBadge, DateDisplay, CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Download, ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 20;

const SOURCE_TYPES = [
  { value: 'supplier_delivery', label: 'Supplier Delivery' },
  { value: 'customer_return', label: 'Customer Return' },
  { value: 'internal_return', label: 'Internal Return' },
  { value: 'opening_stock', label: 'Opening Stock' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

export default function GoodsReceivingList() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    source_type: 'supplier_delivery', supplier_id: '', depot_id: '', product_id: '', pack_size_id: '',
    quantity: '', unit_cost: '', weight_equivalent_kg: '', batch_number: '', expiry_date: '', notes: '',
  });

  const [detail, setDetail] = useState<any>(null);
  const [detailItems, setDetailItems] = useState<any[]>([]);
  const [postConfirm, setPostConfirm] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const [grRes, depRes, prodRes, psRes, supRes] = await Promise.all([
      supabase.from('goods_receipts').select('*, depots(name)').order('created_at', { ascending: false }).limit(300),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
      supabase.from('products').select('id, name').eq('is_active', true).order('name').limit(500),
      supabase.from('product_pack_sizes').select('id, name, estimated_weight_kg').eq('is_active', true).order('sort_order'),
      supabase.from('suppliers').select('id, supplier_name').order('supplier_name'),
    ]);
    setReceipts(grRes.data || []);
    setDepots(depRes.data || []);
    setProducts(prodRes.data || []);
    setPackSizes(psRes.data || []);
    setSuppliers(supRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = receipts;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => (r.receipt_number || '').toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    return result;
  }, [receipts, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const supplierMap = useMemo(() => Object.fromEntries(suppliers.map(s => [s.id, s.supplier_name])), [suppliers]);

  const openDetail = async (gr: any) => {
    setDetail(gr);
    const { data } = await supabase.from('goods_receipt_items').select('*, products(name), product_pack_sizes(name)').eq('goods_receipt_id', gr.id);
    setDetailItems(data || []);
  };

  const handleCreate = async () => {
    if (!form.depot_id || !form.product_id || !form.quantity) {
      toast.error('Depot, product and quantity are required'); return;
    }
    setSaving(true);
    const { data: grNum } = await supabase.rpc('generate_gr_number');
    const receiptNumber = grNum || `GR-${Date.now()}`;

    const qty = parseFloat(form.quantity) || 0;
    const ps = packSizes.find(p => p.id === form.pack_size_id);
    const weightKg = parseFloat(form.weight_equivalent_kg) || (ps?.estimated_weight_kg ? ps.estimated_weight_kg * qty : null);

    const { data: gr, error } = await supabase.from('goods_receipts').insert({
      receipt_number: receiptNumber,
      source_type: form.source_type,
      supplier_id: form.supplier_id || null,
      depot_id: form.depot_id,
      received_by: user?.id,
      status: 'received',
      notes: form.notes || null,
    }).select().single();

    if (error || !gr) { toast.error(error?.message || 'Failed'); setSaving(false); return; }

    await supabase.from('goods_receipt_items').insert({
      goods_receipt_id: gr.id,
      product_id: form.product_id,
      pack_size_id: form.pack_size_id || null,
      quantity_received: qty,
      unit_cost: parseFloat(form.unit_cost) || null,
      weight_equivalent_kg: weightKg,
      batch_number: form.batch_number || null,
      expiry_date: form.expiry_date || null,
    });

    // Update inventory immediately
    const { data: inv } = await supabase.from('depot_inventory')
      .select('id, quantity_on_hand')
      .eq('product_id', form.product_id)
      .eq('depot_id', form.depot_id)
      .maybeSingle();

    if (inv) {
      await supabase.from('depot_inventory').update({
        quantity_on_hand: inv.quantity_on_hand + qty,
        last_movement_at: new Date().toISOString(),
      }).eq('id', inv.id);
    } else {
      await supabase.from('depot_inventory').insert({
        product_id: form.product_id,
        pack_size_id: form.pack_size_id || null,
        depot_id: form.depot_id,
        quantity_on_hand: qty,
        weight_equivalent_kg: weightKg,
        last_movement_at: new Date().toISOString(),
      });
    }

    // Create movement record
    await supabase.from('stock_movements').insert({
      movement_type: 'goods_received',
      product_id: form.product_id,
      pack_size_id: form.pack_size_id || null,
      depot_id: form.depot_id,
      quantity: qty,
      weight_equivalent_kg: weightKg,
      unit_cost: parseFloat(form.unit_cost) || null,
      reference_type: 'goods_receipt',
      reference_id: gr.id,
      reference_number: receiptNumber,
      created_by: user?.id,
      status: 'completed',
    });

    toast.success(`Receipt ${receiptNumber} — ${qty} units received and inventory updated`);
    setSaving(false);
    setCreateOpen(false);
    setForm({ source_type: 'supplier_delivery', supplier_id: '', depot_id: '', product_id: '', pack_size_id: '', quantity: '', unit_cost: '', weight_equivalent_kg: '', batch_number: '', expiry_date: '', notes: '' });
    fetchData();
  };

  return (
    <AdminPage>
      <DataPageShell title="Goods Receiving" description="Receive stock into depots from suppliers, returns or internal operations"
        loading={loading} searchValue={search} onSearchChange={v => { setSearch(v); setPage(0); }} searchPlaceholder="Search receipts..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportToCsv('goods-receipts', ['Receipt #', 'Source', 'Depot', 'Status', 'Date'], filtered.map(r => [r.receipt_number, r.source_type, (r as any).depots?.name, r.status, r.receipt_date]))}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" />Receive Stock</Button>
          </div>
        }>
        <div className="flex gap-2 mb-2">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4"><PackageCheck className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold">No goods receipts</h3>
            <p className="text-sm text-muted-foreground mt-1">Receive stock into depots to begin.</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Depot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(r => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(r)}>
                    <TableCell className="font-medium font-mono">{r.receipt_number}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{r.source_type?.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell>{supplierMap[r.supplier_id] || '—'}</TableCell>
                    <TableCell>{(r as any).depots?.name || '—'}</TableCell>
                    <TableCell><StatusBadge type="document" value={r.status} /></TableCell>
                    <TableCell><DateDisplay date={r.receipt_date} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </DataPageShell>

      {/* Create Receipt */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Receive Stock</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Source Type</Label>
                <Select value={form.source_type} onValueChange={v => setForm(f => ({ ...f, source_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SOURCE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Supplier</Label>
                <Select value={form.supplier_id} onValueChange={v => setForm(f => ({ ...f, supplier_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Destination Depot *</Label>
              <Select value={form.depot_id} onValueChange={v => setForm(f => ({ ...f, depot_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Product *</Label>
                <Select value={form.product_id} onValueChange={v => setForm(f => ({ ...f, product_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Pack Size</Label>
                <Select value={form.pack_size_id} onValueChange={v => setForm(f => ({ ...f, pack_size_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{packSizes.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Quantity *</Label><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Unit Cost</Label><Input type="number" value={form.unit_cost} onChange={e => setForm(f => ({ ...f, unit_cost: e.target.value }))} placeholder="Optional" /></div>
              <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" value={form.weight_equivalent_kg} onChange={e => setForm(f => ({ ...f, weight_equivalent_kg: e.target.value }))} placeholder="Auto" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Batch/Lot #</Label><Input value={form.batch_number} onChange={e => setForm(f => ({ ...f, batch_number: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Expiry Date</Label><Input type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Receiving...' : 'Receive & Update Stock'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Receipt {detail?.receipt_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Source</p><Badge variant="outline" className="capitalize">{detail.source_type?.replace(/_/g, ' ')}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Supplier</p><span>{supplierMap[detail.supplier_id] || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.receipt_date} /></div>
              </div>
              {detail.notes && <p className="text-sm text-muted-foreground border rounded-lg p-3">{detail.notes}</p>}
              <Separator />
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Product</TableHead><TableHead>Pack Size</TableHead>
                  <TableHead className="text-right">Qty Received</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                  <TableHead>Batch</TableHead><TableHead>Expiry</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {detailItems.map(it => (
                    <TableRow key={it.id}>
                      <TableCell className="font-medium">{(it as any).products?.name || '—'}</TableCell>
                      <TableCell>{(it as any).product_pack_sizes?.name || '—'}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{it.quantity_received}</TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={it.unit_cost} /></TableCell>
                      <TableCell className="text-right tabular-nums">{it.weight_equivalent_kg ? `${Number(it.weight_equivalent_kg).toFixed(1)}` : '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{it.batch_number || '—'}</TableCell>
                      <TableCell><DateDisplay date={it.expiry_date} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
