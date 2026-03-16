import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileSpreadsheet, PackageCheck, Clock, DollarSign, AlertTriangle,
  TrendingUp, Building2,
} from 'lucide-react';

export default function ProcurementDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pos, setPos] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('goods_receipts').select('*, depots(name)').order('created_at', { ascending: false }).limit(50),
      supabase.from('suppliers').select('id, supplier_name, is_active').order('supplier_name'),
    ]).then(([poRes, grRes, supRes]) => {
      setPos(poRes.data || []);
      setReceipts(grRes.data || []);
      setSuppliers(supRes.data || []);
      setSupplierMap(Object.fromEntries((supRes.data || []).map(s => [s.id, s.supplier_name])));
      setLoading(false);
    });
  }, []);

  const openPOs = pos.filter(p => !['cancelled', 'received', 'fully_received'].includes(p.status));
  const pendingApproval = pos.filter(p => p.status === 'submitted' || p.status === 'pending');
  const partiallyReceived = pos.filter(p => p.status === 'partially_received');
  const totalSpend = pos.filter(p => p.status !== 'cancelled').reduce((s, p) => s + (p.total_amount || 0), 0);

  // Spend by supplier (top 5)
  const spendBySupplier: Record<string, number> = {};
  pos.filter(p => p.status !== 'cancelled').forEach(p => {
    const name = supplierMap[p.supplier_id] || 'Unknown';
    spendBySupplier[name] = (spendBySupplier[name] || 0) + (p.total_amount || 0);
  });
  const topSuppliers = Object.entries(spendBySupplier).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Procurement Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of purchasing operations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/purchase-orders')}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><FileSpreadsheet className="h-4 w-4" />Open POs</div>
              <p className="text-3xl font-bold">{openPOs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><AlertTriangle className="h-4 w-4" />Pending Approval</div>
              <p className="text-3xl font-bold text-amber-600">{pendingApproval.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><PackageCheck className="h-4 w-4" />Partially Received</div>
              <p className="text-3xl font-bold">{partiallyReceived.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><DollarSign className="h-4 w-4" />Total Spend</div>
              <p className="text-2xl font-bold"><CurrencyDisplay amount={totalSpend} /></p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent POs */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Recent Purchase Orders</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="pl-6">PO #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Total</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {pos.slice(0, 8).map(po => (
                    <TableRow key={po.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/purchase-orders/${po.id}/edit`)}>
                      <TableCell className="pl-6 font-mono text-xs">{po.po_number}</TableCell>
                      <TableCell className="text-sm">{supplierMap[po.supplier_id] || '—'}</TableCell>
                      <TableCell><StatusBadge type="document" value={po.status} /></TableCell>
                      <TableCell className="text-right pr-6"><CurrencyDisplay amount={po.total_amount} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Suppliers by Spend */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Top Suppliers by Spend</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topSuppliers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No purchase data</p>
              ) : (
                topSuppliers.map(([name, amount], i) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <CurrencyDisplay amount={amount} className="text-sm" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Receipts */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Recent Goods Receipts</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Receipt #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Depot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6">Date</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {receipts.slice(0, 6).map(gr => (
                  <TableRow key={gr.id}>
                    <TableCell className="pl-6 font-mono text-xs">{gr.receipt_number}</TableCell>
                    <TableCell className="text-sm">{supplierMap[gr.supplier_id] || '—'}</TableCell>
                    <TableCell className="text-sm">{(gr as any).depots?.name || '—'}</TableCell>
                    <TableCell><StatusBadge type="document" value={gr.status} /></TableCell>
                    <TableCell className="pr-6"><DateDisplay date={gr.receipt_date} /></TableCell>
                  </TableRow>
                ))}
                {receipts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No receipts yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
