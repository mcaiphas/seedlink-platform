import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ProductPerformance() {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [itemsRes, invRes] = await Promise.all([
        supabase.from("order_items").select("product_name, quantity, unit_price, line_total").order("line_total", { ascending: false }).limit(100),
        supabase.from("depot_inventory").select("quantity, product_variants(sku, products(name))").lt("quantity", 10).limit(10),
      ]);

      // Aggregate by product
      const map = new Map<string, { qty: number; revenue: number }>();
      (itemsRes.data || []).forEach((i) => {
        const n = i.product_name || "Unknown";
        const cur = map.get(n) || { qty: 0, revenue: 0 };
        cur.qty += i.quantity || 0;
        cur.revenue += i.line_total || 0;
        map.set(n, cur);
      });
      setTopProducts([...map.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10).map(([name, d]) => ({ name, ...d })));
      setLowStock((invRes.data || []).map((i) => ({
        name: (i.product_variants as any)?.products?.name || (i.product_variants as any)?.sku || "—",
        sku: (i.product_variants as any)?.sku || "—",
        qty: i.quantity,
      })));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Product Performance" description="Top sellers, margins, and stock alerts" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Products by Revenue</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty Sold</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Loading…</TableCell></TableRow> :
                  topProducts.map((p) => (
                    <TableRow key={p.name}><TableCell className="font-medium truncate max-w-[200px]">{p.name}</TableCell><TableCell className="text-right">{p.qty}</TableCell><TableCell className="text-right">R {p.revenue.toLocaleString()}</TableCell></TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Low Stock Alerts</CardTitle><CardDescription>Products below 10 units</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead className="text-right">Stock</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Loading…</TableCell></TableRow> :
                  lowStock.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No low stock items</TableCell></TableRow> :
                  lowStock.map((p, i) => (
                    <TableRow key={i}><TableCell className="font-medium truncate max-w-[160px]">{p.name}</TableCell><TableCell>{p.sku}</TableCell><TableCell className="text-right"><Badge variant="destructive">{p.qty}</Badge></TableCell></TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
