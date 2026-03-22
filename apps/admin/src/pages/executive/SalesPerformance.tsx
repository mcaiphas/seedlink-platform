import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142 76% 36%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

export default function SalesPerformance() {
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const year = new Date().getFullYear();
      const startOfYear = `${year}-01-01`;

      const [invoicesRes, ordersRes] = await Promise.all([
        supabase.from("customer_invoices").select("total_amount, invoice_date, customer_id, customers(company_name)").gte("invoice_date", startOfYear),
        supabase.from("orders").select("id").gte("created_at", startOfYear),
      ]);

      const invoices = invoicesRes.data || [];
      setTotalRevenue(invoices.reduce((s, i) => s + (i.total_amount || 0), 0));
      setOrderCount((ordersRes.data || []).length);

      // Top customers
      const custMap = new Map<string, { name: string; total: number }>();
      invoices.forEach((inv) => {
        const cid = inv.customer_id || "unknown";
        const name = (inv.customers as any)?.company_name || "Unknown";
        const cur = custMap.get(cid) || { name, total: 0 };
        cur.total += inv.total_amount || 0;
        custMap.set(cid, cur);
      });
      const sorted = [...custMap.values()].sort((a, b) => b.total - a.total).slice(0, 5);
      setTopCustomers(sorted.map((c) => ({ name: c.name.substring(0, 20), revenue: Math.round(c.total) })));

      // Monthly revenue
      const months: any[] = [];
      for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1);
        const label = d.toLocaleString("default", { month: "short" });
        const rev = invoices
          .filter((inv) => { const id = new Date(inv.invoice_date); return id.getMonth() === m; })
          .reduce((s, inv) => s + (inv.total_amount || 0), 0);
        months.push({ name: label, revenue: Math.round(rev) });
      }
      setMonthlyData(months);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Sales Performance" description="Revenue analytics and sales trends" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>YTD Revenue</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">R {loading ? "…" : (totalRevenue / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Orders</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{loading ? "…" : orderCount}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Avg Order Value</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">R {loading || orderCount === 0 ? "…" : (totalRevenue / orderCount).toFixed(0)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }} className="h-[280px] w-full">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `R${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Top Customers by Revenue</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }} className="h-[280px] w-full">
              <BarChart data={topCustomers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis type="number" className="text-xs" tickFormatter={(v) => `R${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" className="text-xs" width={120} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
