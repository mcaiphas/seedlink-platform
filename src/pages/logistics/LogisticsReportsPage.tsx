import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LogisticsReportsPage() {
  const { data: requests = [] } = useQuery({
    queryKey: ['logistics_reports_all'],
    queryFn: async () => {
      const { data } = await supabase.from('logistics_delivery_requests')
        .select('status, total_weight_kg, estimated_cost, actual_cost, vehicle_type_id, origin_depot_id, delivered_at, created_at, depots(depot_name), vehicle_types(vehicle_name)');
      return data || [];
    },
  });

  const delivered = requests.filter((r: any) => r.status === 'delivered');
  const totalWeight = delivered.reduce((s: number, r: any) => s + (r.total_weight_kg || 0), 0);
  const totalCost = delivered.reduce((s: number, r: any) => s + (r.actual_cost || r.estimated_cost || 0), 0);
  const costPerTon = totalWeight > 0 ? (totalCost / totalWeight) * 1000 : 0;
  const successRate = requests.length > 0 ? Math.round((delivered.length / requests.length) * 100) : 0;

  // By depot
  const depotVolume: Record<string, { count: number; weight: number }> = {};
  requests.forEach((r: any) => {
    const depot = (r.depots as any)?.depot_name || 'Unknown';
    if (!depotVolume[depot]) depotVolume[depot] = { count: 0, weight: 0 };
    depotVolume[depot].count++;
    depotVolume[depot].weight += r.total_weight_kg || 0;
  });

  // By vehicle
  const vehicleUtil: Record<string, number> = {};
  requests.forEach((r: any) => {
    const v = (r.vehicle_types as any)?.vehicle_name || 'Unassigned';
    vehicleUtil[v] = (vehicleUtil[v] || 0) + 1;
  });

  const fmt = (v: number) => `R ${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Logistics Reports" description="Delivery performance, costs, and utilization metrics" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Delivered</p><p className="text-2xl font-bold">{delivered.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Weight Delivered</p><p className="text-2xl font-bold">{(totalWeight / 1000).toFixed(1)} t</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Cost per Ton</p><p className="text-2xl font-bold">{fmt(costPerTon)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Success Rate</p><p className="text-2xl font-bold">{successRate}%</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Dispatch Volume by Depot</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(depotVolume).length === 0 ? (
              <p className="text-sm text-muted-foreground">No data</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(depotVolume).sort((a, b) => b[1].count - a[1].count).map(([depot, stats]) => (
                  <div key={depot} className="flex items-center justify-between">
                    <span className="text-sm">{depot}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{stats.count} deliveries</Badge>
                      <Badge variant="outline">{(stats.weight / 1000).toFixed(1)} t</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Vehicle Utilization</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(vehicleUtil).length === 0 ? (
              <p className="text-sm text-muted-foreground">No data</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(vehicleUtil).sort((a, b) => b[1] - a[1]).map(([vehicle, count]) => (
                  <div key={vehicle} className="flex items-center justify-between">
                    <span className="text-sm">{vehicle}</span>
                    <Badge variant="secondary">{count} trips</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
