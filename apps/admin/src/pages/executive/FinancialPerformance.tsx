import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";

export default function FinancialPerformance() {
  const [kpis, setKpis] = useState({ revenue: 0, cogs: 0, grossMargin: 0, receivables: 0, payables: 0 });
  const [glData, setGlData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [revenueRes, cogsRes, arRes, apRes] = await Promise.all([
        supabase.from("journal_entry_lines").select("credit_amount, gl_accounts!inner(account_code)").like("gl_accounts.account_code", "4%"),
        supabase.from("journal_entry_lines").select("debit_amount, gl_accounts!inner(account_code)").like("gl_accounts.account_code", "5%"),
        supabase.from("customer_invoices").select("total_amount").eq("status", "posted"),
        supabase.from("supplier_invoices").select("total_amount").eq("status", "posted"),
      ]);

      const revenue = (revenueRes.data || []).reduce((s, l) => s + (l.credit_amount || 0), 0);
      const cogs = (cogsRes.data || []).reduce((s, l) => s + (l.debit_amount || 0), 0);
      const receivables = (arRes.data || []).reduce((s, i) => s + (i.total_amount || 0), 0);
      const payables = (apRes.data || []).reduce((s, i) => s + (i.total_amount || 0), 0);

      setKpis({ revenue, cogs, grossMargin: revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0, receivables, payables });

      setGlData([
        { name: "Revenue", amount: Math.round(revenue) },
        { name: "COGS", amount: Math.round(cogs) },
        { name: "Gross Profit", amount: Math.round(revenue - cogs) },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Financial Performance" description="Revenue, margins, and balance summary" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Revenue", value: `R ${(kpis.revenue / 1000).toFixed(0)}K`, onClick: () => navigate("/profit-and-loss") },
          { label: "COGS", value: `R ${(kpis.cogs / 1000).toFixed(0)}K` },
          { label: "Gross Margin", value: `${kpis.grossMargin.toFixed(1)}%` },
          { label: "Receivables", value: `R ${(kpis.receivables / 1000).toFixed(0)}K`, onClick: () => navigate("/debtors") },
          { label: "Payables", value: `R ${(kpis.payables / 1000).toFixed(0)}K`, onClick: () => navigate("/creditors") },
        ].map((k) => (
          <Card key={k.label} className={k.onClick ? "cursor-pointer hover:border-primary/40 transition-colors" : ""} onClick={k.onClick}>
            <CardHeader className="pb-2"><CardDescription className="text-xs">{k.label}</CardDescription></CardHeader>
            <CardContent><p className="text-xl font-bold">{loading ? "…" : k.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Profit Overview</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ amount: { label: "Amount", color: "hsl(var(--primary))" } }} className="h-[260px] w-full">
            <BarChart data={glData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `R${(v / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
