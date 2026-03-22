import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, FileText, CreditCard, AlertTriangle, Package,
  Clock, ArrowRight, TrendingUp, TrendingDown, Zap,
  Plus, BarChart3,
} from 'lucide-react';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */
function KpiCard({ label, value, icon: Icon, trend, onClick }: {
  label: string;
  value: string | number;
  icon: any;
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
}) {
  return (
    <Card
      className={`border shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-primary' : 'text-destructive'}`}>
                {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value}
              </div>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Action Button                                                */
/* ------------------------------------------------------------------ */
function QuickAction({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="gap-2 h-9 text-xs" onClick={onClick}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Data                                                     */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Dashboard Component                                                */
/* ------------------------------------------------------------------ */
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
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
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
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Commerce operations overview</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[104px] rounded-xl" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const d = data!;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time commerce operations overview
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <QuickAction label="New Order" icon={Plus} onClick={() => navigate('/orders')} />
          <QuickAction label="New Product" icon={Plus} onClick={() => navigate('/products/new')} />
          <QuickAction label="New PO" icon={Plus} onClick={() => navigate('/purchase-orders/new')} />
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Orders" value={d.openOrders} icon={ShoppingCart} onClick={() => navigate('/orders')} />
        <KpiCard label="Pending Approvals" value={d.pendingApprovals} icon={Clock} onClick={() => navigate('/orders')} />
        <KpiCard label="Pending Payments" value={d.pendingPayments} icon={CreditCard} onClick={() => navigate('/payments')} />
        <KpiCard label="Invoices Today" value={d.invoicesToday} icon={FileText} onClick={() => navigate('/customer-invoices')} />
      </div>

      {/* Financial KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Receivables"
          value={`R ${d.receivablesTotal.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`}
          icon={TrendingUp}
        />
        <KpiCard
          label="Payables"
          value={`R ${d.payablesTotal.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`}
          icon={TrendingDown}
        />
        <KpiCard label="Abandoned Carts" value={d.abandonedCarts} icon={AlertTriangle} onClick={() => navigate('/abandoned-carts')} />
        <KpiCard label="Stock Moves (7d)" value={d.stockMovements7d} icon={Package} onClick={() => navigate('/stock-movements')} />
      </div>

      {/* Activity Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <CardTitle className="text-sm font-semibold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 text-xs">Order</TableHead>
                  <TableHead className="text-xs">Source</TableHead>
                  <TableHead className="text-xs">Payment</TableHead>
                  <TableHead className="text-right pr-5 text-xs">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.recentOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10 text-sm">No orders yet</TableCell></TableRow>
                ) : d.recentOrders.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                    <TableCell className="pl-5 font-medium text-sm">{o.order_number || o.id.slice(0, 8)}</TableCell>
                    <TableCell><StatusBadge type="order_source" value={o.order_source} /></TableCell>
                    <TableCell><StatusBadge type="payment" value={o.payment_status} /></TableCell>
                    <TableCell className="text-right pr-5"><CurrencyDisplay amount={o.total_amount} currency={o.currency_code} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <CardTitle className="text-sm font-semibold">Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/customer-invoices')} className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 text-xs">Invoice</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-right pr-5 text-xs">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.recentInvoices.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10 text-sm">No invoices yet</TableCell></TableRow>
                ) : d.recentInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="pl-5 font-medium text-sm">{inv.invoice_number}</TableCell>
                    <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground"><DateDisplay date={inv.invoice_date} /></TableCell>
                    <TableCell className="text-right pr-5"><CurrencyDisplay amount={inv.total_amount} currency={inv.currency_code} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Logs */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
          <CardTitle className="text-sm font-semibold">Document Delivery Logs</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/document-delivery-logs')} className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5 text-xs">Document</TableHead>
                <TableHead className="text-xs">Channel</TableHead>
                <TableHead className="text-xs">Recipient</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="pr-5 text-xs">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.recentDeliveryLogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">No delivery logs yet</TableCell></TableRow>
              ) : d.recentDeliveryLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-5 font-medium capitalize text-sm">{log.document_type?.replace(/_/g, ' ')}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{log.delivery_channel}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.recipient_email || log.recipient_phone || '—'}</TableCell>
                  <TableCell><StatusBadge type="delivery" value={log.delivery_status} /></TableCell>
                  <TableCell className="pr-5 text-sm text-muted-foreground"><DateDisplay date={log.sent_at} showTime /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
