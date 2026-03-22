import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function CustomerIntelligence() {
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [custRes, invoicesRes, overdueRes] = await Promise.all([
        supabase.from("customers").select("id, company_name", { count: "exact" }),
        supabase.from("customer_invoices").select("customer_id, total_amount, customers(company_name)"),
        supabase.from("customer_invoices").select("id", { count: "exact" }).eq("status", "posted").lt("due_date", new Date().toISOString().split("T")[0]),
      ]);

      setTotalCustomers(custRes.count || 0);
      setOverdueCount(overdueRes.count || 0);

      const map = new Map<string, { name: string; id: string; revenue: number; orders: number }>();
      (invoicesRes.data || []).forEach((inv) => {
        const cid = inv.customer_id || "";
        const name = (inv.customers as any)?.company_name || "Unknown";
        const cur = map.get(cid) || { name, id: cid, revenue: 0, orders: 0 };
        cur.revenue += inv.total_amount || 0;
        cur.orders += 1;
        map.set(cid, cur);
      });
      setTopCustomers([...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Customer Intelligence" description="Customer revenue, behavior, and risk analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>Total Customers</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{loading ? "…" : totalCustomers}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Overdue Invoices</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">{loading ? "…" : overdueCount}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Avg Revenue/Customer</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">R {loading || totalCustomers === 0 ? "…" : Math.round(topCustomers.reduce((s, c) => s + c.revenue, 0) / totalCustomers).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Customers by Revenue</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead className="text-right">Invoices</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Loading…</TableCell></TableRow> :
                topCustomers.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/customers/${c.id}`)}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right">{c.orders}</TableCell>
                    <TableCell className="text-right">R {c.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
