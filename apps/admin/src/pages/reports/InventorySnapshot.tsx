import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Warehouse, Package, AlertTriangle, ArrowLeftRight } from 'lucide-react';

export default function InventorySnapshot() {
  const [loading, setLoading] = useState(true);
  const [depotSummary, setDepotSummary] = useState<{ name: string; skus: number; totalQty: number; value: number }[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentMovements, setRecentMovements] = useState<any[]>([]);
  const [totals, setTotals] = useState({ totalValue: 0, totalSKUs: 0, lowStockCount: 0 });

  useEffect(() => {
    async function load() {
      const [{ data: inventory }, { data: movements }] = await Promise.all([
        supabase.from('depot_inventory')
          .select('quantity_on_hand, quantity_reserved, quantity_available, unit_cost, reorder_point, depot_id, depots(name), products(name), product_pack_sizes(name)')
          .limit(2000),
        supabase.from('stock_movements')
          .select('id, movement_type, quantity, created_at, products(name), depots(name)')
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      const inv = inventory || [];

      // Depot summary
      const depotMap: Record<string, { skus: number; totalQty: number; value: number }> = {};
      inv.forEach((r: any) => {
        const name = r.depots?.name || 'Unknown';
        if (!depotMap[name]) depotMap[name] = { skus: 0, totalQty: 0, value: 0 };
        depotMap[name].skus++;
        depotMap[name].totalQty += Number(r.quantity_on_hand) || 0;
        depotMap[name].value += (Number(r.quantity_on_hand) || 0) * (Number(r.unit_cost) || 0);
      });
      setDepotSummary(
        Object.entries(depotMap)
          .map(([name, v]) => ({ name, ...v }))
          .sort((a, b) => b.value - a.value)
      );

      // Low stock
      const lowStockItems = inv.filter((r: any) => {
        const qty = Number(r.quantity_available) || 0;
        const reorder = Number(r.reorder_point) || 0;
        return reorder > 0 && qty <= reorder && qty >= 0;
      }).map((r: any) => ({
        product: r.products?.name || '—',
        packSize: r.product_pack_sizes?.name || '—',
        depot: r.depots?.name || '—',
        available: r.quantity_available,
        reorderPoint: r.reorder_point,
      })).slice(0, 20);
      setLowStock(lowStockItems);

      // Totals
      const totalValue = inv.reduce((s: number, r: any) => s + (Number(r.quantity_on_hand) || 0) * (Number(r.unit_cost) || 0), 0);
      setTotals({ totalValue, totalSKUs: inv.length, lowStockCount: lowStockItems.length });

      setRecentMovements(movements || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Inventory Snapshot</h1></div>
      <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Snapshot</h1>
        <p className="text-sm text-muted-foreground mt-1">Current stock levels and movement analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Package className="h-3.5 w-3.5" />Total Inventory Value</div>
            <p className="text-2xl font-bold"><CurrencyDisplay amount={totals.totalValue} /></p>
            <p className="text-xs text-muted-foreground">{totals.totalSKUs} SKU lines</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><AlertTriangle className="h-3.5 w-3.5" />Low Stock Alerts</div>
            <p className="text-2xl font-bold text-amber-600">{totals.lowStockCount}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Warehouse className="h-3.5 w-3.5" />Depots</div>
            <p className="text-2xl font-bold">{depotSummary.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Warehouse className="h-4 w-4" />Stock Value by Depot</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Depot</TableHead>
                <TableHead className="text-right">SKUs</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right pr-6">Value</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {depotSummary.map(d => (
                  <TableRow key={d.name}>
                    <TableCell className="pl-6 font-medium">{d.name}</TableCell>
                    <TableCell className="text-right">{d.skus}</TableCell>
                    <TableCell className="text-right">{d.totalQty.toLocaleString()}</TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={d.value} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Low Stock Items</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Product</TableHead>
                <TableHead>Depot</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right pr-6">Reorder</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {lowStock.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6 font-medium max-w-[140px] truncate">{item.product}</TableCell>
                    <TableCell className="text-sm">{item.depot}</TableCell>
                    <TableCell className="text-right text-amber-600 font-medium">{item.available}</TableCell>
                    <TableCell className="text-right pr-6">{item.reorderPoint}</TableCell>
                  </TableRow>
                ))}
                {lowStock.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No low stock alerts</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ArrowLeftRight className="h-4 w-4" />Recent Stock Movements</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Depot</TableHead>
              <TableHead className="text-right pr-6">Qty</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {recentMovements.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell className="pl-6 text-sm">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] capitalize">{(m.movement_type || '').replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm max-w-[160px] truncate">{m.products?.name || '—'}</TableCell>
                  <TableCell className="text-sm">{m.depots?.name || '—'}</TableCell>
                  <TableCell className="text-right pr-6 font-mono">{m.quantity}</TableCell>
                </TableRow>
              ))}
              {recentMovements.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No recent movements</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
