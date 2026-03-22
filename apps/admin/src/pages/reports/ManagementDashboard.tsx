import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import {
  DollarSign, Building2, FileSpreadsheet, Warehouse, Package,
  TrendingDown, Users, AlertTriangle, Clock,
} from 'lucide-react';

export default function ManagementDashboard() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('depot_inventory').select('quantity_on_hand, unit_cost, depot_id, depots(name), products(name), product_pack_sizes(name, estimated_weight_kg), last_movement_at').limit(1000),
      supabase.from('purchase_orders').select('id, status, total_amount, created_at').limit(500),
      supabase.from('suppliers').select('id, supplier_name, is_active').limit(500),
      supabase.from('stock_movements').select('id, movement_type, quantity, created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('approval_requests').select('id, request_type, approval_status, value_impact, requested_at').eq('approval_status', 'pending').limit(50),
    ]).then(([invRes, poRes, supRes, mvRes, apRes]) => {
      setInventory(invRes.data || []);
      setPos(poRes.data || []);
      setSuppliers(supRes.data || []);
      setMovements(mvRes.data || []);
      setApprovals(apRes.data || []);
      setLoading(false);
    });
  }, []);

  const totalInventoryValue = inventory.reduce((s, r) => s + (r.quantity_on_hand || 0) * (r.unit_cost || 0), 0);

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const monthStr = thisMonth.toISOString();
  const monthlySpend = pos.filter(p => p.created_at >= monthStr && !['cancelled', 'draft'].includes(p.status))
    .reduce((s, p) => s + (p.total_amount || 0), 0);

  const activeSuppliers = suppliers.filter(s => s.is_active).length;
  const openPOs = pos.filter(p => !['cancelled', 'received', 'fully_received', 'draft'].includes(p.status)).length;
  const pendingApprovals = approvals.length;

  // Stock value by depot
  const depotValues: Record<string, { value: number; count: number }> = {};
  inventory.forEach(r => {
    const name = (r as any).depots?.name || 'Unknown';
    if (!depotValues[name]) depotValues[name] = { value: 0, count: 0 };
    depotValues[name].value += (r.quantity_on_hand || 0) * (r.unit_cost || 0);
    depotValues[name].count += 1;
  });
  const sortedDepots = Object.entries(depotValues).sort((a, b) => b[1].value - a[1].value);
  const maxDepotVal = sortedDepots[0]?.[1].value || 1;

  // Slow-moving: no movement in last 90 days
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();
  const slowMoving = inventory.filter(r => {
    const val = (r.quantity_on_hand || 0) * (r.unit_cost || 0);
    return val > 0 && (!r.last_movement_at || r.last_movement_at < ninetyDaysAgo);
  });
  const slowMovingValue = slowMoving.reduce((s, r) => s + (r.quantity_on_hand || 0) * (r.unit_cost || 0), 0);

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">High-level system performance and financial overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="cursor-pointer" onClick={() => navigate('/reports/valuation')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><DollarSign className="h-3.5 w-3.5" />Inventory Value</div>
              <p className="text-xl font-bold"><CurrencyDisplay amount={totalInventoryValue} /></p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><TrendingDown className="h-3.5 w-3.5" />Monthly Spend</div>
              <p className="text-xl font-bold"><CurrencyDisplay amount={monthlySpend} /></p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Users className="h-3.5 w-3.5" />Active Suppliers</div>
              <p className="text-3xl font-bold">{activeSuppliers}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => navigate('/purchase-orders')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><FileSpreadsheet className="h-3.5 w-3.5" />Open POs</div>
              <p className="text-3xl font-bold">{openPOs}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => navigate('/approvals')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Clock className="h-3.5 w-3.5" />Pending Approvals</div>
              <p className="text-3xl font-bold text-amber-600">{pendingApprovals}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => navigate('/reports/slow-moving')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><AlertTriangle className="h-3.5 w-3.5" />Slow-Moving Value</div>
              <p className="text-xl font-bold text-amber-600"><CurrencyDisplay amount={slowMovingValue} /></p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Stock Value by Depot</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sortedDepots.map(([name, data]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{data.count} SKUs</span>
                      <CurrencyDisplay amount={data.value} className="text-xs" />
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(data.value / maxDepotVal) * 100}%` }} /></div>
                </div>
              ))}
              {sortedDepots.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No depot data</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Pending Approvals</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="pl-6">Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">Value</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {approvals.slice(0, 6).map(a => (
                    <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/approvals')}>
                      <TableCell className="pl-6"><Badge variant="outline" className="text-xs capitalize">{a.request_type.replace(/_/g, ' ')}</Badge></TableCell>
                      <TableCell className="text-xs tabular-nums">{new Date(a.requested_at).toLocaleDateString('en-ZA')}</TableCell>
                      <TableCell className="text-right pr-6"><CurrencyDisplay amount={a.value_impact} className="text-xs" /></TableCell>
                    </TableRow>
                  ))}
                  {approvals.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No pending approvals</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Top inventory items */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Top 20 Highest Value Inventory Items</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Product</TableHead>
                <TableHead>Pack Size</TableHead>
                <TableHead>Depot</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right pr-6">Total Value</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {inventory.sort((a, b) => ((b.quantity_on_hand || 0) * (b.unit_cost || 0)) - ((a.quantity_on_hand || 0) * (a.unit_cost || 0))).slice(0, 20).map((r, i) => (
                  <TableRow key={r.id || i}>
                    <TableCell className="pl-6 font-medium">{(r as any).products?.name || '—'}</TableCell>
                    <TableCell>{(r as any).product_pack_sizes?.name || '—'}</TableCell>
                    <TableCell>{(r as any).depots?.name || '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.quantity_on_hand}</TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={r.unit_cost} /></TableCell>
                    <TableCell className="text-right pr-6 font-medium"><CurrencyDisplay amount={(r.quantity_on_hand || 0) * (r.unit_cost || 0)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
