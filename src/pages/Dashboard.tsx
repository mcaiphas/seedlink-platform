import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KpiCard } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, FileText, CreditCard, AlertTriangle, Package, Truck,
  DollarSign, TrendingUp, Clock, CheckCircle, ArrowRight, Receipt,
  Users, BarChart3, Mail,
} from 'lucide-react';

interface Counts {
  openOrders: number;
  pendingApprovals: number;
  pendingPayments: number;
  invoicesToday: number;
  abandonedCarts: number;
  recentSupplierInvoices: number;
  stockMovements: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentDeliveryLogs, setRecentDeliveryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: openOrders },
        { count: pendingApprovals },
        { count: pendingPayments },
        { count: invoicesToday },
        { count: abandonedCarts },
        { count: recentSI },
        { count: stockMvmt },
        { data: orders },
        { data: invoices },
        { data: logs },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).not('fulfillment_status', 'in', '("fulfilled","cancelled")'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
        supabase.from('customer_invoices').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('carts').select('*', { count: 'exact', head: true }).eq('status', 'abandoned'),
        supabase.from('supplier_invoices').select('*', { count: 'exact', head: true }).in('status', ['draft', 'pending']),
        supabase.from('stock_movements').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('customer_invoices').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('document_delivery_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setCounts({
        openOrders: openOrders || 0,
        pendingApprovals: pendingApprovals || 0,
        pendingPayments: pendingPayments || 0,
        invoicesToday: invoicesToday || 0,
        abandonedCarts: abandonedCarts || 0,
        recentSupplierInvoices: recentSI || 0,
        stockMovements: stockMvmt || 0,
      });
      setRecentOrders(orders || []);
      setRecentInvoices(invoices || []);
      setRecentDeliveryLogs(logs || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commerce Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">Seedlink Operations Dashboard</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commerce Operations</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time operational overview for Seedlink</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Orders" value={counts?.openOrders ?? 0} icon={ShoppingCart} />
        <KpiCard label="Pending Approvals" value={counts?.pendingApprovals ?? 0} icon={Clock} />
        <KpiCard label="Pending Payments" value={counts?.pendingPayments ?? 0} icon={CreditCard} />
        <KpiCard label="Invoices Today" value={counts?.invoicesToday ?? 0} icon={FileText} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Abandoned Carts" value={counts?.abandonedCarts ?? 0} icon={AlertTriangle} />
        <KpiCard label="Pending Supplier Invoices" value={counts?.recentSupplierInvoices ?? 0} icon={Receipt} />
        <KpiCard label="Stock Movements (7d)" value={counts?.stockMovements ?? 0} icon={Package} />
      </div>

      {/* Activity Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-xs">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right pr-6">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No orders yet</TableCell></TableRow>
                ) : recentOrders.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                    <TableCell className="pl-6 font-medium">{o.order_number || o.id.slice(0, 8)}</TableCell>
                    <TableCell><StatusBadge type="order_source" value={o.order_source} /></TableCell>
                    <TableCell><StatusBadge type="payment" value={o.payment_status} /></TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={o.total_amount} currency={o.currency_code} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Customer Invoices</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/customer-invoices')} className="text-xs">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Invoice #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No invoices yet</TableCell></TableRow>
                ) : recentInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="pl-6 font-medium">{inv.invoice_number}</TableCell>
                    <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                    <TableCell><DateDisplay date={inv.invoice_date} /></TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={inv.total_amount} currency={inv.currency_code} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Logs */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Recent Document Delivery Logs</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/document-delivery-logs')} className="text-xs">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Document</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeliveryLogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No delivery logs yet</TableCell></TableRow>
              ) : recentDeliveryLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-6 font-medium capitalize">{log.document_type?.replace(/_/g, ' ')}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{log.delivery_channel}</Badge></TableCell>
                  <TableCell className="text-sm">{log.recipient_email || log.recipient_phone || '—'}</TableCell>
                  <TableCell><StatusBadge type="delivery" value={log.delivery_status} /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={log.sent_at} showTime /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
