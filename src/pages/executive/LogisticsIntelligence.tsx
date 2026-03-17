import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function LogisticsIntelligence() {
  const [kpis, setKpis] = useState({ total: 0, delivered: 0, inTransit: 0, failed: 0, totalCost: 0, totalWeight: 0 });
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from("logistics_delivery_requests").select("status, total_weight_kg, estimated_cost");
      const items = data || [];
      const delivered = items.filter((d) => d.status === "delivered").length;
      const failed = items.filter((d) => d.status === "delivery_failed").length;
      const inTransit = items.filter((d) => d.status === "in_transit" || d.status === "dispatched").length;
      const totalCost = items.reduce((s, d) => s + (d.estimated_cost || 0), 0);
      const totalWeight = items.reduce((s, d) => s + (d.total_weight_kg || 0), 0);
      setKpis({ total: items.length, delivered, inTransit, failed, totalCost, totalWeight });

      const statusMap: Record<string, number> = {};
      items.forEach((d) => { statusMap[d.status] = (statusMap[d.status] || 0) + 1; });
      setStatusData(Object.entries(statusMap).map(([name, count]) => ({ name: name.replace(/_/g, " "), count })));
      setLoading(false);
    }
    load();
  }, []);

  const successRate = kpis.total > 0 ? ((kpis.delivered / kpis.total) * 100).toFixed(1) : "—";
  const costPerTon = kpis.totalWeight > 0 ? (kpis.totalCost / (kpis.totalWeight / 1000)).toFixed(0) : "—";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Logistics Intelligence" description="Delivery performance and cost analytics" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Deliveries", value: kpis.total },
          { label: "Delivered", value: kpis.delivered },
          { label: "In Transit", value: kpis.inTransit },
          { label: "Success Rate", value: `${successRate}%` },
          { label: "Cost/Ton", value: `R ${costPerTon}` },
        ].map((k) => (
          <Card key={k.label}><CardHeader className="pb-2"><CardDescription className="text-xs">{k.label}</CardDescription></CardHeader><CardContent><p className="text-xl font-bold">{loading ? "…" : k.value}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Deliveries by Status</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: "Count", color: "hsl(var(--primary))" } }} className="h-[260px] w-full">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
