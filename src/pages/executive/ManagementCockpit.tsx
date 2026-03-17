import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, DollarSign, Package, ShoppingCart, Truck, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

interface KPI {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: any;
}

export default function ManagementCockpit() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const [invoicesRes, ordersRes, deliveriesRes, inventoryRes, prevInvoicesRes] = await Promise.all([
        supabase.from("customer_invoices").select("total_amount, invoice_date").gte("invoice_date", startOfMonth) as any,
        supabase.from("orders").select("id, order_status").in("order_status", ["pending", "confirmed", "processing"]),
        supabase.from("logistics_delivery_requests").select("id, status").in("status", ["dispatched", "in_transit"]),
        supabase.from("depot_inventory").select("quantity_on_hand, unit_cost"),
        supabase.from("customer_invoices").select("total_amount").gte("invoice_date", startOfPrevMonth).lte("invoice_date", endOfPrevMonth),
      ]);

      const monthRevenue = (invoicesRes.data || []).reduce((s, i) => s + (i.total_amount || 0), 0);
      const prevRevenue = (prevInvoicesRes.data || []).reduce((s, i) => s + (i.total_amount || 0), 0);
      const revenueChange = prevRevenue > 0 ? (((monthRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : "—";
      const inventoryValue = (inventoryRes.data || []).reduce((s: number, i: any) => s + (i.quantity_on_hand || 0) * (i.unit_cost || 0), 0);

      setKpis([
        { label: "Revenue This Month", value: `R ${(monthRevenue / 1000).toFixed(0)}K`, change: `${revenueChange}%`, trend: monthRevenue >= prevRevenue ? "up" : "down", icon: DollarSign },
        { label: "Orders In Progress", value: String((ordersRes.data || []).length), icon: ShoppingCart, trend: "neutral" },
        { label: "Deliveries Active", value: String((deliveriesRes.data || []).length), icon: Truck, trend: "neutral" },
        { label: "Inventory Value", value: `R ${(inventoryValue / 1000).toFixed(0)}K`, icon: Package, trend: "neutral" },
      ]);

      // Build monthly revenue chart (last 6 months)
      const months: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        months.push({ month: d.toLocaleString("default", { month: "short" }), start: d.toISOString(), end: end.toISOString() });
      }
      const { data: allInvoices } = await supabase.from("customer_invoices").select("total_amount, invoice_date").gte("invoice_date", months[0].start);
      const chartData = months.map((m) => {
        const total = (allInvoices || []).filter((inv) => inv.invoice_date >= m.start && inv.invoice_date <= m.end).reduce((s, inv) => s + (inv.total_amount || 0), 0);
        return { name: m.month, revenue: Math.round(total) };
      });
      setRevenueData(chartData);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Management Cockpit" description="Executive overview of all Seedlink operations" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">{kpi.label}</CardDescription>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{loading ? "…" : kpi.value}</div>
              {kpi.change && (
                <p className={`text-xs flex items-center gap-1 mt-1 ${kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                  {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : kpi.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                  {kpi.change} vs prev month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground">Loading…</div>
          ) : (
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }} className="h-[260px] w-full">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `R${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
