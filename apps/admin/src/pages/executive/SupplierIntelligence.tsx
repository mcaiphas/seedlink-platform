import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export default function SupplierIntelligence() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [suppRes, poRes] = await Promise.all([
        supabase.from("suppliers").select("id, company_name", { count: "exact" }),
        supabase.from("purchase_orders").select("supplier_id, total_amount, suppliers(company_name)"),
      ]);

      setSupplierCount(suppRes.count || 0);

      const map = new Map<string, { name: string; id: string; spend: number; orders: number }>();
      (poRes.data || []).forEach((po) => {
        const sid = po.supplier_id || "";
        const name = (po.suppliers as any)?.company_name || "Unknown";
        const cur = map.get(sid) || { name, id: sid, spend: 0, orders: 0 };
        cur.spend += po.total_amount || 0;
        cur.orders += 1;
        map.set(sid, cur);
      });
      const sorted = [...map.values()].sort((a, b) => b.spend - a.spend);
      setTotalSpend(sorted.reduce((s, x) => s + x.spend, 0));
      setSuppliers(sorted.slice(0, 10));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Supplier Intelligence" description="Procurement spend analysis and supplier performance" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>Active Suppliers</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{loading ? "…" : supplierCount}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Total Procurement Spend</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">R {loading ? "…" : (totalSpend / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Avg Spend/Supplier</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">R {loading || supplierCount === 0 ? "…" : Math.round(totalSpend / supplierCount).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Suppliers by Spend</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Supplier</TableHead><TableHead className="text-right">POs</TableHead><TableHead className="text-right">Spend</TableHead><TableHead className="text-right">% of Total</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Loading…</TableCell></TableRow> :
                suppliers.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/suppliers/${s.id}`)}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">{s.orders}</TableCell>
                    <TableCell className="text-right">R {s.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{totalSpend > 0 ? ((s.spend / totalSpend) * 100).toFixed(1) : 0}%</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
