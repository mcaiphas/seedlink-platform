import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';

export default function SalesAnalytics() {
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; orders: number; revenue: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; qty: number; revenue: number }[]>([]);
  const [customerStats, setCustomerStats] = useState({ total: 0, active: 0, newThisMonth: 0 });
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    async function load() {
      const [{ data: orders }, { data: orderItems }, { data: customers }] = await Promise.all([
        supabase.from('orders').select('id,status,total_amount,created_at').order('created_at', { ascending: false }).limit(1000),
        supabase.from('order_items').select('id,product_name,quantity,unit_price,line_total').limit(2000),
        supabase.from('customers').select('id,is_active,created_at').limit(5000),
      ]);

      // Monthly revenue
      const monthMap: Record<string, { orders: number; revenue: number }> = {};
      (orders || []).forEach((o: any) => {
        if (['cancelled', 'draft'].includes(o.status)) return;
        const month = (o.created_at || '').slice(0, 7);
        if (!monthMap[month]) monthMap[month] = { orders: 0, revenue: 0 };
        monthMap[month].orders++;
        monthMap[month].revenue += Number(o.total_amount) || 0;
      });
      const sorted = Object.entries(monthMap).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12);
      setMonthlyRevenue(sorted.map(([month, v]) => ({ month, ...v })).reverse());

      // Top products
      const prodMap: Record<string, { qty: number; revenue: number }> = {};
      (orderItems || []).forEach((item: any) => {
        const name = item.product_name || 'Unknown';
        if (!prodMap[name]) prodMap[name] = { qty: 0, revenue: 0 };
        prodMap[name].qty += Number(item.quantity) || 0;
        prodMap[name].revenue += Number(item.line_total) || Number(item.quantity || 0) * Number(item.unit_price || 0);
      });
      setTopProducts(
        Object.entries(prodMap)
          .map(([name, v]) => ({ name, ...v }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10)
      );

      // Customer stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const allCustomers = customers || [];
      setCustomerStats({
        total: allCustomers.length,
        active: allCustomers.filter((c: any) => c.is_active).length,
        newThisMonth: allCustomers.filter((c: any) => c.created_at >= monthStart).length,
      });

      // Order stats
      const allOrders = orders || [];
      setOrderStats({
        total: allOrders.length,
        pending: allOrders.filter((o: any) => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
        completed: allOrders.filter((o: any) => ['delivered', 'completed'].includes(o.status)).length,
      });

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1></div>
      <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Revenue, order trends, and customer insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><BarChart3 className="h-3.5 w-3.5" />Total Orders</div>
            <p className="text-2xl font-bold">{orderStats.total}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><TrendingUp className="h-3.5 w-3.5" />Pending</div>
            <p className="text-2xl font-bold text-amber-600">{orderStats.pending}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Users className="h-3.5 w-3.5" />Customers</div>
            <p className="text-2xl font-bold">{customerStats.total}</p>
            <p className="text-xs text-muted-foreground">{customerStats.newThisMonth} new this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Package className="h-3.5 w-3.5" />Completed</div>
            <p className="text-2xl font-bold text-emerald-600">{orderStats.completed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm">Monthly Revenue (Last 12 Months)</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Month</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right pr-6">Revenue</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {monthlyRevenue.map(m => (
                  <TableRow key={m.month}>
                    <TableCell className="pl-6 font-medium">{m.month}</TableCell>
                    <TableCell className="text-right">{m.orders}</TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={m.revenue} /></TableCell>
                  </TableRow>
                ))}
                {monthlyRevenue.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No order data</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm">Top 10 Products by Revenue</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Product</TableHead>
                <TableHead className="text-right">Qty Sold</TableHead>
                <TableHead className="text-right pr-6">Revenue</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {topProducts.map(p => (
                  <TableRow key={p.name}>
                    <TableCell className="pl-6 font-medium max-w-[180px] truncate">{p.name}</TableCell>
                    <TableCell className="text-right">{p.qty}</TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={p.revenue} /></TableCell>
                  </TableRow>
                ))}
                {topProducts.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No product data</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
