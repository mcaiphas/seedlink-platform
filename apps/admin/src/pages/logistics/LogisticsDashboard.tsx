import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';

export default function LogisticsDashboardPage() {
  const { data: requests = [] } = useQuery({
    queryKey: ['logistics_dashboard_requests'],
    queryFn: async () => {
      const { data } = await supabase.from('logistics_delivery_requests')
        .select('id, status, total_weight_kg, estimated_cost, actual_cost, preferred_date, created_at');
      return data || [];
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayDeliveries = requests.filter((r: any) => r.preferred_date === today);
  const pending = requests.filter((r: any) => r.status === 'pending');
  const inTransit = requests.filter((r: any) => r.status === 'in_transit');
  const delivered = requests.filter((r: any) => r.status === 'delivered');
  const failed = requests.filter((r: any) => r.status === 'delivery_failed');
  const totalCost = requests.reduce((s: number, r: any) => s + (r.actual_cost || r.estimated_cost || 0), 0);
  const totalWeight = requests.reduce((s: number, r: any) => s + (r.total_weight_kg || 0), 0);

  const statusCounts: Record<string, number> = {};
  requests.forEach((r: any) => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });

  const fmt = (v: number) => `R ${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Logistics Dashboard" description="Delivery operations overview and monitoring" />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><CardContent className="pt-6 text-center">
          <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">{todayDeliveries.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">{pending.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <Package className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">In Transit</p>
          <p className="text-2xl font-bold">{inTransit.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold">{delivered.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed</p>
          <p className="text-2xl font-bold">{failed.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-lg font-bold">{fmt(totalCost)}</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(statusCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">No delivery data yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{status.replace(/_/g, ' ')}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Weight & Cost Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Weight</span>
              <span className="text-sm font-medium">{totalWeight.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Logistics Cost</span>
              <span className="text-sm font-medium">{fmt(totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Cost per Delivery</span>
              <span className="text-sm font-medium">{requests.length > 0 ? fmt(totalCost / requests.length) : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cost per Ton</span>
              <span className="text-sm font-medium">{totalWeight > 0 ? fmt((totalCost / totalWeight) * 1000) : '—'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
