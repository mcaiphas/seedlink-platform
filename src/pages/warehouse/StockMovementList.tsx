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
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Plus, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 25;

const MOVEMENT_TYPES = [
  { value: 'goods_received', label: 'Goods Received' },
  { value: 'stock_issue', label: 'Stock Issue' },
  { value: 'transfer_out', label: 'Transfer Out' },
  { value: 'transfer_in', label: 'Transfer In' },
  { value: 'adjustment_in', label: 'Adjustment Increase' },
  { value: 'adjustment_out', label: 'Adjustment Decrease' },
  { value: 'customer_dispatch', label: 'Customer Dispatch' },
  { value: 'customer_return', label: 'Customer Return' },
  { value: 'supplier_return', label: 'Supplier Return' },
  { value: 'damaged', label: 'Damaged Stock' },
  { value: 'expired', label: 'Expired Write-off' },
  { value: 'count_variance', label: 'Count Variance' },
  { value: 'opening_balance', label: 'Opening Balance' },
];

export default function StockMovementList() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [depotFilter, setDepotFilter] = useState('all');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    movement_type: '', product_id: '', pack_size_id: '', depot_id: '',
    quantity: '', weight_equivalent_kg: '', reference_number: '', reason_code: '', notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    const [movRes, depRes, prodRes, psRes] = await Promise.all([
      supabase.from('stock_movements').select('*, products(name), product_pack_sizes(name, estimated_weight_kg), depots(name)').order('created_at', { ascending: false }).limit(500),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
      supabase.from('products').select('id, name').eq('is_active', true).order('name').limit(500),
      supabase.from('product_pack_sizes').select('id, name, estimated_weight_kg').eq('is_active', true).order('sort_order'),
    ]);
    setMovements(movRes.data || []);
    setDepots(depRes.data || []);
    setProducts(prodRes.data || []);
    setPackSizes(psRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = movements;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m =>
        (m.reference_number || '').toLowerCase().includes(s) ||
        ((m as any).products?.name || '').toLowerCase().includes(s) ||
        ((m as any).product_pack_sizes?.name || '').toLowerCase().includes(s) ||
        (m.movement_type || '').toLowerCase().includes(s)
      );
    }
    if (typeFilter !== 'all') result = result.filter(m => m.movement_type === typeFilter);
    if (depotFilter !== 'all') result = result.filter(m => m.depot_id === depotFilter);
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [movements, search, typeFilter, depotFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleExport = () => {
    exportToCsv('stock-movements',
      ['Date', 'Type', 'Product', 'Pack Size', 'Depot', 'Qty', 'Weight (kg)', 'Reference', 'Reason', 'Status'],
      filtered.map(m => [
        new Date(m.created_at).toISOString(),
        m.movement_type,
        (m as any).products?.name || '',
        (m as any).product_pack_sizes?.name || '',
        (m as any).depots?.name || '',
        m.quantity,
        m.weight_equivalent_kg || '',
        m.reference_number || '',
        m.reason_code || '',
        m.status,
      ])
    );
  };

  const handleCreate = async () => {
    if (!form.movement_type || !form.product_id || !form.depot_id || !form.quantity) {
      toast.error('Movement type, product, depot and quantity are required');
      return;
    }
    setSaving(true);
    const qty = parseFloat(form.quantity) || 0;
    const weightKg = parseFloat(form.weight_equivalent_kg) || null;
    const ps = packSizes.find(p => p.id === form.pack_size_id);
    const totalWeight = weightKg || (ps?.estimated_weight_kg ? ps.estimated_weight_kg * qty : null);

    const { error } = await supabase.from('stock_movements').insert({
      movement_type: form.movement_type,
      product_id: form.product_id,
      pack_size_id: form.pack_size_id || null,
      depot_id: form.depot_id,
      quantity: qty,
      weight_equivalent_kg: totalWeight,
      reference_number: form.reference_number || null,
      reason_code: form.reason_code || null,
      notes: form.notes || null,
      created_by: user?.id,
      status: 'completed',
    });

    if (error) { toast.error(error.message); setSaving(false); return; }

    // Update depot_inventory
    const isIncrease = ['goods_received', 'transfer_in', 'adjustment_in', 'customer_return', 'opening_balance', 'count_variance'].includes(form.movement_type);
    const { data: inv } = await supabase.from('depot_inventory')
      .select('id, quantity_on_hand')
      .eq('product_id', form.product_id)
      .eq('depot_id', form.depot_id)
      .maybeSingle();

    if (inv) {
      const newQty = isIncrease ? inv.quantity_on_hand + qty : Math.max(0, inv.quantity_on_hand - qty);
      await supabase.from('depot_inventory').update({
        quantity_on_hand: newQty,
        last_movement_at: new Date().toISOString(),
      }).eq('id', inv.id);
    } else if (isIncrease) {
      await supabase.from('depot_inventory').insert({
        product_id: form.product_id,
        pack_size_id: form.pack_size_id || null,
        depot_id: form.depot_id,
        quantity_on_hand: qty,
        weight_equivalent_kg: totalWeight,
        last_movement_at: new Date().toISOString(),
      });
    }

    toast.success('Movement recorded and inventory updated');
    setSaving(false);
    setCreateOpen(false);
    setForm({ movement_type: '', product_id: '', pack_size_id: '', depot_id: '', quantity: '', weight_equivalent_kg: '', reference_number: '', reason_code: '', notes: '' });
    fetchData();
  };

  return (
    <AdminPage>
      <DataPageShell
        title="Stock Movements"
        description={`${filtered.length} movement${filtered.length !== 1 ? 's' : ''} · Central inventory transaction ledger`}
        loading={loading}
        searchValue={search}
        onSearchChange={v => { setSearch(v); setPage(0); }}
        searchPlaceholder="Search movements..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" />Record Movement</Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {MOVEMENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={depotFilter} onValueChange={v => { setDepotFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="All Depots" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depots</SelectItem>
              {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4"><ArrowLeftRight className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold">No stock movements</h3>
            <p className="text-sm text-muted-foreground mt-1">Stock movements will be recorded as inventory changes.</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    { label: 'Date/Time', key: 'created_at', sortable: true },
                    { label: 'Type', key: 'movement_type', sortable: true },
                    { label: 'Product', key: 'product_name' },
                    { label: 'Pack Size', key: 'pack_size' },
                    { label: 'Depot', key: 'depot' },
                    { label: 'Qty', key: 'quantity', sortable: true },
                    { label: 'Weight (kg)', key: 'weight_equivalent_kg' },
                    { label: 'Reference', key: 'reference_number' },
                    { label: 'Reason', key: 'reason_code' },
                    { label: 'Status', key: 'status' },
                  ].map(col => (
                    <TableHead key={col.key} className={col.sortable ? 'cursor-pointer select-none' : ''} onClick={col.sortable ? () => toggleSort(col.key) : undefined}>
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && <ArrowUpDown className={`h-3 w-3 ${sortKey === col.key ? 'text-primary' : 'text-muted-foreground/40'}`} />}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(m => (
                  <TableRow key={m.id}>
                    <TableCell><DateDisplay date={m.created_at} showTime /></TableCell>
                    <TableCell><StatusBadge type="movement" value={m.movement_type} /></TableCell>
                    <TableCell className="font-medium">{(m as any).products?.name || '—'}</TableCell>
                    <TableCell>{(m as any).product_pack_sizes?.name || '—'}</TableCell>
                    <TableCell>{(m as any).depots?.name || '—'}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{m.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">{m.weight_equivalent_kg ? `${Number(m.weight_equivalent_kg).toFixed(1)}` : '—'}</TableCell>
                    <TableCell className="font-mono text-xs">{m.reference_number || '—'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{m.reason_code?.replace(/_/g, ' ') || '—'}</Badge></TableCell>
                    <TableCell><StatusBadge type="document" value={m.status} /></TableCell>
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

      {/* Create Movement Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Record Stock Movement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Movement Type *</Label>
              <Select value={form.movement_type} onValueChange={v => setForm(f => ({ ...f, movement_type: v }))}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{MOVEMENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Product *</Label>
              <Select value={form.product_id} onValueChange={v => setForm(f => ({ ...f, product_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Pack Size</Label>
                <Select value={form.pack_size_id} onValueChange={v => setForm(f => ({ ...f, pack_size_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{packSizes.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Depot *</Label>
                <Select value={form.depot_id} onValueChange={v => setForm(f => ({ ...f, depot_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Quantity *</Label><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" value={form.weight_equivalent_kg} onChange={e => setForm(f => ({ ...f, weight_equivalent_kg: e.target.value }))} placeholder="Auto-calc if blank" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Reference #</Label><Input value={form.reference_number} onChange={e => setForm(f => ({ ...f, reference_number: e.target.value }))} /></div>
              <div className="space-y-1.5">
                <Label>Reason Code</Label>
                <Select value={form.reason_code} onValueChange={v => setForm(f => ({ ...f, reason_code: v }))}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    {['damage', 'expiry', 'shrinkage', 'found_stock', 'counting_error', 'system_correction', 'sample', 'internal_use', 'repacking', 'other'].map(r => (
                      <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Record Movement'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
