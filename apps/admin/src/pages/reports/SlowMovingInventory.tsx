import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { exportToCsv } from '@/lib/csv-export';
import { toast } from 'sonner';
import { Download, Search, AlertTriangle, Package, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export default function SlowMovingInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [depotFilter, setDepotFilter] = useState('all');
  const [daysFilter, setDaysFilter] = useState('90');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from('depot_inventory').select('*, products(name, sku), product_pack_sizes(name, estimated_weight_kg), depots(name)').limit(1000),
      supabase.from('depots').select('id, name').eq('is_active', true).order('name'),
    ]).then(([invRes, depotRes]) => {
      setInventory(invRes.data || []);
      setDepots(depotRes.data || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const days = parseInt(daysFilter);
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    let result = inventory.filter(r => {
      if ((r.quantity_on_hand || 0) <= 0) return false;
      return !r.last_movement_at || r.last_movement_at < cutoff;
    }).map(r => ({
      ...r,
      product_name: (r as any).products?.name || '—',
      sku: (r as any).products?.sku || '',
      pack_name: (r as any).product_pack_sizes?.name || '—',
      depot_name: (r as any).depots?.name || '—',
      weight_kg: (r as any).product_pack_sizes?.estimated_weight_kg || 0,
      total_value: (r.quantity_on_hand || 0) * (r.unit_cost || 0),
    }));

    if (depotFilter !== 'all') result = result.filter(r => r.depot_id === depotFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => r.product_name.toLowerCase().includes(s) || r.depot_name.toLowerCase().includes(s));
    }
    return result.sort((a, b) => b.total_value - a.total_value);
  }, [inventory, depotFilter, daysFilter, search]);

  const totalValue = filtered.reduce((s, r) => s + r.total_value, 0);
  const totalItems = filtered.length;
  const totalQty = filtered.reduce((s, r) => s + (r.quantity_on_hand || 0), 0);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleExport = () => {
    exportToCsv('slow-moving-inventory', ['Product', 'SKU', 'Pack Size', 'Depot', 'On Hand', 'Unit Cost', 'Total Value', 'Last Movement'],
      filtered.map(r => [r.product_name, r.sku, r.pack_name, r.depot_name, r.quantity_on_hand, r.unit_cost?.toFixed(2) || '0', r.total_value.toFixed(2), r.last_movement_at || 'Never']));
    toast.success('Report exported');
  };

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 rounded-xl" /></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Slow-Moving Inventory</h1>
            <p className="text-sm text-muted-foreground mt-1">Products with no stock movement for {daysFilter}+ days</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><AlertTriangle className="h-4 w-4" />Slow Items</div><p className="text-3xl font-bold text-amber-600">{totalItems}</p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><DollarSign className="h-4 w-4" />Value at Risk</div><p className="text-2xl font-bold"><CurrencyDisplay amount={totalValue} /></p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Package className="h-4 w-4" />Total Quantity</div><p className="text-3xl font-bold">{totalQty.toLocaleString()}</p></CardContent></Card>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search products…" className="h-8 pl-8 text-sm" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          </div>
          <Select value={depotFilter} onValueChange={v => { setDepotFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="All Depots" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depots</SelectItem>
              {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={daysFilter} onValueChange={v => { setDaysFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30+ days</SelectItem>
              <SelectItem value="60">60+ days</SelectItem>
              <SelectItem value="90">90+ days</SelectItem>
              <SelectItem value="180">180+ days</SelectItem>
              <SelectItem value="365">365+ days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Pack Size</TableHead>
                <TableHead>Depot</TableHead>
                <TableHead className="text-right">On Hand</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead>Last Movement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.product_name}</TableCell>
                  <TableCell>{r.pack_name}</TableCell>
                  <TableCell>{r.depot_name}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.quantity_on_hand}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={r.unit_cost} /></TableCell>
                  <TableCell className="text-right font-medium"><CurrencyDisplay amount={r.total_value} /></TableCell>
                  <TableCell>
                    {r.last_movement_at ? <DateDisplay date={r.last_movement_at} /> : <Badge variant="outline" className="text-xs">Never</Badge>}
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No slow-moving inventory found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages} · {filtered.length} items</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
