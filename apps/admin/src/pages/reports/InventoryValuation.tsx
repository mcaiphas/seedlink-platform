import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { exportToCsv } from '@/lib/csv-export';
import { toast } from 'sonner';
import { Download, Search, Warehouse, Package, DollarSign, Boxes, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export default function InventoryValuation() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [depotFilter, setDepotFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from('depot_inventory').select('*, products(name, sku, category_id, categories:category_id(name)), product_pack_sizes(name, estimated_weight_kg), depots(name, depot_code)').order('created_at', { ascending: false }).limit(1000),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
    ]).then(([invRes, depotRes]) => {
      setInventory(invRes.data || []);
      setDepots(depotRes.data || []);
      setLoading(false);
    });
  }, []);

  const enriched = useMemo(() => inventory.map(r => ({
    ...r,
    product_name: (r as any).products?.name || '—',
    category_name: (r as any).products?.categories?.name || 'Uncategorized',
    pack_name: (r as any).product_pack_sizes?.name || '—',
    depot_name: (r as any).depots?.name || '—',
    depot_code: (r as any).depots?.depot_code || '',
    weight_kg: (r as any).product_pack_sizes?.estimated_weight_kg || 0,
    total_value: (r.quantity_on_hand || 0) * (r.unit_cost || 0),
    reserved_value: (r.quantity_reserved || 0) * (r.unit_cost || 0),
  })), [inventory]);

  const filtered = useMemo(() => {
    let result = enriched;
    if (depotFilter !== 'all') result = result.filter(r => r.depot_id === depotFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => r.product_name.toLowerCase().includes(s) || r.depot_name.toLowerCase().includes(s) || r.pack_name.toLowerCase().includes(s));
    }
    return result.sort((a, b) => b.total_value - a.total_value);
  }, [enriched, depotFilter, search]);

  const totalValue = filtered.reduce((s, r) => s + r.total_value, 0);
  const reservedValue = filtered.reduce((s, r) => s + r.reserved_value, 0);
  const totalSkus = filtered.length;
  const totalWeight = filtered.reduce((s, r) => s + (r.quantity_on_hand || 0) * r.weight_kg, 0);

  // Value by depot
  const valueByDepot: Record<string, number> = {};
  enriched.forEach(r => { valueByDepot[r.depot_name] = (valueByDepot[r.depot_name] || 0) + r.total_value; });
  const depotValues = Object.entries(valueByDepot).sort((a, b) => b[1] - a[1]);
  const maxDepotValue = depotValues[0]?.[1] || 1;

  // Value by category
  const valueByCat: Record<string, number> = {};
  enriched.forEach(r => { valueByCat[r.category_name] = (valueByCat[r.category_name] || 0) + r.total_value; });
  const catValues = Object.entries(valueByCat).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCatValue = catValues[0]?.[1] || 1;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleExport = () => {
    exportToCsv('inventory-valuation', ['Product', 'Pack Size', 'Depot', 'Category', 'On Hand', 'Unit Cost', 'Total Value', 'Weight (kg)'],
      filtered.map(r => [r.product_name, r.pack_name, r.depot_name, r.category_name, r.quantity_on_hand, r.unit_cost?.toFixed(2) || '0', r.total_value.toFixed(2), (r.quantity_on_hand * r.weight_kg).toFixed(1)]));
    toast.success('Valuation exported');
  };

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Valuation</h1>
            <p className="text-sm text-muted-foreground mt-1">Stock value across all depots at unit cost</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><DollarSign className="h-4 w-4" />Total Inventory Value</div><p className="text-2xl font-bold"><CurrencyDisplay amount={totalValue} /></p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Package className="h-4 w-4" />Reserved Value</div><p className="text-2xl font-bold"><CurrencyDisplay amount={reservedValue} /></p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Boxes className="h-4 w-4" />Total SKUs</div><p className="text-3xl font-bold">{totalSkus}</p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Warehouse className="h-4 w-4" />Total Weight</div><p className="text-2xl font-bold">{totalWeight.toLocaleString('en-ZA', { maximumFractionDigits: 0 })} kg</p></CardContent></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Value by Depot</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {depotValues.map(([name, val]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">{name}</span><CurrencyDisplay amount={val} className="text-xs" /></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(val / maxDepotValue) * 100}%` }} /></div>
                </div>
              ))}
              {depotValues.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No data</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Value by Category</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {catValues.map(([name, val]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">{name}</span><CurrencyDisplay amount={val} className="text-xs" /></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${(val / maxCatValue) * 100}%` }} /></div>
                </div>
              ))}
              {catValues.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No data</p>}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search products…" className="h-8 pl-8 text-sm" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          </div>
          <Select value={depotFilter} onValueChange={v => { setDepotFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue placeholder="All Depots" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depots</SelectItem>
              {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
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
                <TableHead>Category</TableHead>
                <TableHead className="text-right">On Hand</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Weight (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.product_name}</TableCell>
                  <TableCell>{r.pack_name}</TableCell>
                  <TableCell>{r.depot_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{r.category_name}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{r.quantity_on_hand}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={r.unit_cost} /></TableCell>
                  <TableCell className="text-right font-medium"><CurrencyDisplay amount={r.total_value} /></TableCell>
                  <TableCell className="text-right tabular-nums">{(r.quantity_on_hand * r.weight_kg).toFixed(1)}</TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No inventory records</TableCell></TableRow>}
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
