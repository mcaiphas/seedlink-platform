import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell } from '@/components/DataPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Download, ArrowUpDown, ChevronLeft, ChevronRight, Plus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { logAudit } from '@/lib/audit';

const PAGE_SIZE = 20;

export default function StockOverview() {
  const [data, setData] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [depotFilter, setDepotFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ product_id: '', pack_size_id: '', depot_id: '', quantity_on_hand: '', reorder_level: '', sku: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [invRes, depotRes, psRes, prodRes] = await Promise.all([
      supabase.from('depot_inventory').select('*, products(name, sku), product_pack_sizes(name, pack_type, seed_count, estimated_weight_kg), depots(name, depot_code)').order('created_at', { ascending: false }).limit(500),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
      supabase.from('product_pack_sizes').select('id, name').eq('is_active', true).order('sort_order'),
      supabase.from('products').select('id, name, sku').eq('is_active', true).order('name').limit(500),
    ]);
    setData(invRes.data || []);
    setDepots(depotRes.data || []);
    setPackSizes(psRes.data || []);
    setProducts(prodRes.data || []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        ((r as any).products?.name || '').toLowerCase().includes(s) ||
        (r.sku || '').toLowerCase().includes(s) ||
        ((r as any).product_pack_sizes?.name || '').toLowerCase().includes(s) ||
        ((r as any).depots?.name || '').toLowerCase().includes(s)
      );
    }
    if (depotFilter !== 'all') result = result.filter(r => r.depot_id === depotFilter);
    if (statusFilter === 'low') result = result.filter(r => r.quantity_on_hand <= (r.reorder_level || 0) && r.quantity_on_hand > 0);
    if (statusFilter === 'out') result = result.filter(r => r.quantity_on_hand <= 0);
    if (statusFilter === 'ok') result = result.filter(r => r.quantity_on_hand > (r.reorder_level || 0));
    result = [...result].sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === 'product_name') { av = (a as any).products?.name || ''; bv = (b as any).products?.name || ''; }
      else if (sortKey === 'depot_name') { av = (a as any).depots?.name || ''; bv = (b as any).depots?.name || ''; }
      else { av = a[sortKey] ?? ''; bv = b[sortKey] ?? ''; }
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [data, search, depotFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getStockStatus = (row: any) => {
    if (row.quantity_on_hand <= 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (row.reorder_level && row.quantity_on_hand <= row.reorder_level) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const handleExport = () => {
    exportToCsv('stock-overview', ['Product', 'Pack Size', 'SKU', 'Depot', 'On Hand', 'Reserved', 'Available', 'Reorder', 'Weight (kg)', 'Status'],
      filtered.map(r => {
        const s = getStockStatus(r);
        return [(r as any).products?.name || '', (r as any).product_pack_sizes?.name || '', r.sku || '', (r as any).depots?.name || '', r.quantity_on_hand, r.quantity_reserved, r.quantity_available, r.reorder_level || '', r.weight_equivalent_kg || '', s.label];
      }));
  };

  const handleAddRecord = async () => {
    if (!adjustForm.product_id || !adjustForm.depot_id) { toast.error('Product and Depot are required'); return; }
    setSaving(true);
    const payload: any = {
      product_id: adjustForm.product_id,
      pack_size_id: adjustForm.pack_size_id || null,
      depot_id: adjustForm.depot_id,
      quantity_on_hand: parseFloat(adjustForm.quantity_on_hand) || 0,
      reorder_level: parseFloat(adjustForm.reorder_level) || 0,
      sku: adjustForm.sku || null,
    };
    const { error } = await supabase.from('depot_inventory').insert(payload);
    if (error) { toast.error(error.message); setSaving(false); return; }
    logAudit({ action: 'create', entity_type: 'depot_inventory', new_values: payload });
    toast.success('Stock record created');
    setSaving(false);
    setAdjustOpen(false);
    setAdjustForm({ product_id: '', pack_size_id: '', depot_id: '', quantity_on_hand: '', reorder_level: '', sku: '' });
    fetchData();
  };

  const lowStockCount = data.filter(r => r.quantity_on_hand > 0 && r.reorder_level && r.quantity_on_hand <= r.reorder_level).length;
  const outOfStockCount = data.filter(r => r.quantity_on_hand <= 0).length;

  return (
    <AdminPage>
      <DataPageShell title="Stock Overview" description={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} · Tracked by Product + Pack Size + Depot`}
        loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search stock..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={() => setAdjustOpen(true)}><Plus className="h-4 w-4 mr-1" />Add Record</Button>
          </div>
        }>

        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="flex gap-3 mb-3">
            {lowStockCount > 0 && <Badge variant="secondary" className="gap-1"><AlertTriangle className="h-3 w-3" />{lowStockCount} low stock</Badge>}
            {outOfStockCount > 0 && <Badge variant="destructive" className="gap-1">{outOfStockCount} out of stock</Badge>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Select value={depotFilter} onValueChange={setDepotFilter}>
            <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue placeholder="All Depots" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depots</SelectItem>
              {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ok">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: 'Product', key: 'product_name', sortable: true },
                  { label: 'Pack Size', key: 'pack_size' },
                  { label: 'SKU', key: 'sku', sortable: true },
                  { label: 'Depot', key: 'depot_name', sortable: true },
                  { label: 'On Hand', key: 'quantity_on_hand', sortable: true },
                  { label: 'Reserved', key: 'quantity_reserved' },
                  { label: 'Available', key: 'quantity_available', sortable: true },
                  { label: 'Reorder', key: 'reorder_level' },
                  { label: 'Weight', key: 'weight_equivalent_kg' },
                  { label: 'Status', key: '_status' },
                ].map(col => (
                  <TableHead key={col.key} className={col.sortable ? 'cursor-pointer select-none' : ''}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <ArrowUpDown className={`h-3 w-3 ${sortKey === col.key ? 'text-primary' : 'text-muted-foreground/40'}`} />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(row => {
                const status = getStockStatus(row);
                return (
                  <TableRow key={row.id}>
                    <td className="p-4 font-medium">{(row as any).products?.name || '—'}</td>
                    <td className="p-4">{(row as any).product_pack_sizes?.name || '—'}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{row.sku || '—'}</td>
                    <td className="p-4">{(row as any).depots?.name || '—'}</td>
                    <td className="p-4 text-right tabular-nums">{row.quantity_on_hand}</td>
                    <td className="p-4 text-right tabular-nums">{row.quantity_reserved}</td>
                    <td className="p-4 text-right tabular-nums font-medium">{row.quantity_available}</td>
                    <td className="p-4 text-right tabular-nums text-muted-foreground">{row.reorder_level || '—'}</td>
                    <td className="p-4 text-right tabular-nums">{row.weight_equivalent_kg ? `${row.weight_equivalent_kg} kg` : '—'}</td>
                    <td className="p-4"><Badge variant={status.variant}>{status.label}</Badge></td>
                  </TableRow>
                );
              })}
              {paged.length === 0 && <TableRow><td colSpan={10} className="p-8 text-center text-muted-foreground">No stock records found</td></TableRow>}
            </TableBody>
          </Table>
        </div>

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

      {/* Add Stock Record Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Stock Record</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product *</Label>
              <Select value={adjustForm.product_id} onValueChange={v => setAdjustForm(f => ({ ...f, product_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Pack Size</Label>
              <Select value={adjustForm.pack_size_id} onValueChange={v => setAdjustForm(f => ({ ...f, pack_size_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select pack size" /></SelectTrigger>
                <SelectContent>{packSizes.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Depot *</Label>
              <Select value={adjustForm.depot_id} onValueChange={v => setAdjustForm(f => ({ ...f, depot_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name} ({d.depot_code})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Quantity On Hand</Label><Input type="number" value={adjustForm.quantity_on_hand} onChange={e => setAdjustForm(f => ({ ...f, quantity_on_hand: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Reorder Level</Label><Input type="number" value={adjustForm.reorder_level} onChange={e => setAdjustForm(f => ({ ...f, reorder_level: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label>SKU</Label><Input value={adjustForm.sku} onChange={e => setAdjustForm(f => ({ ...f, sku: e.target.value }))} placeholder="Optional" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRecord} disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
