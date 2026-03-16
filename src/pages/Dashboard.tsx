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
  ShoppingCart, FileText, CreditCard, AlertTriangle, Package,
  DollarSign, Clock, ArrowRight, Receipt, TrendingUp, TrendingDown,
  Wallet, Send,
} from 'lucide-react';

interface DashboardData {
  openOrders: number;
  pendingApprovals: number;
  pendingPayments: number;
  invoicesToday: number;
  abandonedCarts: number;
  pendingSupplierInvoices: number;
  stockMovements7d: number;
  receivablesTotal: number;
  payablesTotal: number;
  recentOrders: any[];
  recentInvoices: any[];
  recentDeliveryLogs: any[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [
        { count: openOrders },
        { count: pendingApprovals },
        { count: pendingPayments },
        { count: invoicesToday },
        { count: abandonedCarts },
        { count: pendingSI },
        { count: stockMvmt },
        { data: arData },
        { data: apData },
        { data: orders },
        { data: invoices },
        { data: logs },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).not('fulfillment_status', 'in', '("fulfilled","cancelled")'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
        supabase.from('customer_invoices').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('carts').select('*', { count: 'exact', head: true }).eq('status', 'abandoned'),
        supabase.from('supplier_invoices').select('*', { count: 'exact', head: true }).in('status', ['draft', 'pending']),
        supabase.from('stock_movements').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('customer_invoices').select('total_amount').in('status', ['posted', 'sent']),
        supabase.from('supplier_invoices').select('total_amount').in('status', ['posted', 'approved']),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('customer_invoices').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('document_delivery_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const receivablesTotal = (arData || []).reduce((s, r) => s + (r.total_amount || 0), 0);
      const payablesTotal = (apData || []).reduce((s, r) => s + (r.total_amount || 0), 0);

      setData({
        openOrders: openOrders || 0,
        pendingApprovals: pendingApprovals || 0,
        pendingPayments: pendingPayments || 0,
        invoicesToday: invoicesToday || 0,
        abandonedCarts: abandonedCarts || 0,
        pendingSupplierInvoices: pendingSI || 0,
        stockMovements7d: stockMvmt || 0,
        receivablesTotal,
        payablesTotal,
        recentOrders: orders || [],
        recentInvoices: invoices || [],
        recentDeliveryLogs: logs || [],
      });
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commerce Operations</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time operational overview</p>
      </div>

      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Orders" value={data!.openOrders} icon={ShoppingCart} />
        <KpiCard label="Pending Approvals" value={data!.pendingApprovals} icon={Clock} />
        <KpiCard label="Pending Payments" value={data!.pendingPayments} icon={CreditCard} />
        <KpiCard label="Invoices Today" value={data!.invoicesToday} icon={FileText} />
      </div>

      {/* Secondary KPIs — Finance */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Accounts Receivable"
          value={`R ${data!.receivablesTotal.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`}
          icon={TrendingUp}
        />
        <KpiCard
          label="Accounts Payable"
          value={`R ${data!.payablesTotal.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`}
          icon={TrendingDown}
        />
        <KpiCard label="Abandoned Carts" value={data!.abandonedCarts} icon={AlertTriangle} />
        <KpiCard label="Stock Movements (7d)" value={data!.stockMovements7d} icon={Package} />
      </div>

      {/* Activity Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-xs gap-1">
              View all <ArrowRight className="h-3 w-3" />
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
                {data!.recentOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No orders yet</TableCell></TableRow>
                ) : data!.recentOrders.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                    <TableCell className="pl-6 font-medium text-sm">{o.order_number || o.id.slice(0, 8)}</TableCell>
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
        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Customer Invoices</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/customer-invoices')} className="text-xs gap-1">
              View all <ArrowRight className="h-3 w-3" />
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
                {data!.recentInvoices.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No invoices yet</TableCell></TableRow>
                ) : data!.recentInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="pl-6 font-medium text-sm">{inv.invoice_number}</TableCell>
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
      <Card className="shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Document Delivery Logs</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/document-delivery-logs')} className="text-xs gap-1">
            View all <ArrowRight className="h-3 w-3" />
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
              {data!.recentDeliveryLogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No delivery logs yet</TableCell></TableRow>
              ) : data!.recentDeliveryLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-6 font-medium capitalize text-sm">{log.document_type?.replace(/_/g, ' ')}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{log.delivery_channel}</Badge></TableCell>
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
