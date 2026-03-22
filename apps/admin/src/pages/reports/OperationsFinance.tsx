import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign, TrendingUp, Package, ArrowDownToLine, ArrowUpFromLine,
  FileSpreadsheet, ArrowLeftRight, Warehouse,
} from 'lucide-react';

export default function OperationsFinance() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthStr = thisMonth.toISOString();

    Promise.all([
      supabase.from('depot_inventory').select('quantity_on_hand, quantity_reserved, unit_cost').limit(1000),
      supabase.from('purchase_orders').select('id, status, total_amount, created_at').limit(500),
      supabase.from('stock_movements').select('movement_type, quantity, weight_equivalent_kg, created_at').gte('created_at', monthStr).limit(1000),
      supabase.from('stock_transfers').select('id, status, created_at').limit(200),
    ]).then(([invRes, poRes, mvRes, trRes]) => {
      setInventory(invRes.data || []);
      setPos(poRes.data || []);
      setMovements(mvRes.data || []);
      setTransfers(trRes.data || []);
      setLoading(false);
    });
  }, []);

  const totalInventoryValue = inventory.reduce((s, r) => s + (r.quantity_on_hand || 0) * (r.unit_cost || 0), 0);
  const totalProcurementSpend = pos.filter(p => !['cancelled', 'draft'].includes(p.status)).reduce((s, p) => s + (p.total_amount || 0), 0);
  const openPOValue = pos.filter(p => !['cancelled', 'received', 'fully_received', 'draft'].includes(p.status)).reduce((s, p) => s + (p.total_amount || 0), 0);
  const pendingTransfers = transfers.filter(t => ['pending', 'approved', 'in_transit'].includes(t.status)).length;

  const receivedThisMonth = movements.filter(m => ['goods_received', 'purchase_receipt'].includes(m.movement_type)).reduce((s, m) => s + (m.quantity || 0), 0);
  const issuedThisMonth = movements.filter(m => ['stock_issue', 'sales_issue', 'customer_dispatch'].includes(m.movement_type)).reduce((s, m) => s + (m.quantity || 0), 0);

  // Monthly procurement spend (last 6 months)
  const monthlySpend: { month: string; amount: number }[] = useMemo(() => {
    const months: Record<string, number> = {};
    pos.filter(p => p.status !== 'cancelled').forEach(p => {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + (p.total_amount || 0);
    });
    return Object.entries(months).sort().slice(-6).map(([month, amount]) => ({ month, amount }));
  }, [pos]);
  const maxMonthSpend = Math.max(...monthlySpend.map(m => m.amount), 1);

  // Top purchased products from PO items would need join - use PO supplier spend instead
  const poByStatus: Record<string, number> = {};
  pos.forEach(p => { poByStatus[p.status] = (poByStatus[p.status] || 0) + 1; });

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Finance</h1>
          <p className="text-sm text-muted-foreground mt-1">Financial overview of inventory and procurement operations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><DollarSign className="h-3.5 w-3.5" />Inventory Value</div><p className="text-xl font-bold"><CurrencyDisplay amount={totalInventoryValue} /></p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><TrendingUp className="h-3.5 w-3.5" />Procurement Spend</div><p className="text-xl font-bold"><CurrencyDisplay amount={totalProcurementSpend} /></p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><ArrowDownToLine className="h-3.5 w-3.5" />Received (Month)</div><p className="text-2xl font-bold">{receivedThisMonth.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><ArrowUpFromLine className="h-3.5 w-3.5" />Issued (Month)</div><p className="text-2xl font-bold">{issuedThisMonth.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><FileSpreadsheet className="h-3.5 w-3.5" />Open PO Value</div><p className="text-xl font-bold"><CurrencyDisplay amount={openPOValue} /></p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><ArrowLeftRight className="h-3.5 w-3.5" />Pending Transfers</div><p className="text-2xl font-bold">{pendingTransfers}</p></CardContent></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Monthly Procurement Spend</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {monthlySpend.map(m => (
                <div key={m.month} className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">{m.month}</span><CurrencyDisplay amount={m.amount} className="text-xs" /></div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(m.amount / maxMonthSpend) * 100}%` }} /></div>
                </div>
              ))}
              {monthlySpend.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No spend data</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Purchase Orders by Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(poByStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs capitalize">{status.replace(/_/g, ' ')}</Badge>
                    <span className="text-sm font-bold tabular-nums">{count}</span>
                  </div>
                ))}
                {Object.keys(poByStatus).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No POs</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPage>
  );
}
