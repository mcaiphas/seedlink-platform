import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Truck, DollarSign } from 'lucide-react';

export default function DeliveryPlanningPage() {
  const queryClient = useQueryClient();
  const [distanceInput, setDistanceInput] = useState<Record<string, string>>({});

  const { data: pending = [] } = useQuery({
    queryKey: ['planning_pending_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('logistics_delivery_requests')
        .select('*, customers(company_name), depots(depot_name, physical_address)')
        .in('status', ['pending', 'planning'])
        .order('preferred_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicle_types_planning'],
    queryFn: async () => { const { data } = await supabase.from('vehicle_types').select('*').eq('is_active', true).order('max_weight_kg'); return data || []; },
  });

  const calcCost = (weightKg: number, distKm: number) => {
    const suitable = vehicleTypes.filter((v: any) => v.max_weight_kg >= weightKg);
    if (suitable.length === 0) return null;
    const best = suitable[0] as any;
    return { vehicle: best, cost: (best.base_rate || 0) + (best.per_km_rate || 0) * distKm };
  };

  const updateCost = useMutation({
    mutationFn: async ({ id, cost, distance, vehicleId }: { id: string; cost: number; distance: number; vehicleId: string }) => {
      const { error } = await supabase.from('logistics_delivery_requests').update({
        estimated_cost: cost,
        estimated_distance_km: distance,
        vehicle_type_id: vehicleId,
        status: 'planning',
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Cost estimate saved'); queryClient.invalidateQueries({ queryKey: ['planning_pending_requests'] }); },
  });

  // Group by depot
  const byDepot: Record<string, any[]> = {};
  pending.forEach((r: any) => {
    const depot = (r.depots as any)?.depot_name || 'Unassigned';
    if (!byDepot[depot]) byDepot[depot] = [];
    byDepot[depot].push(r);
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Planning" description="Estimate costs, group routes, and prepare deliveries for dispatch" />

      {Object.keys(byDepot).length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No pending deliveries to plan</CardContent></Card>
      ) : Object.entries(byDepot).map(([depot, items]) => (
        <Card key={depot}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {depot}
              <Badge variant="secondary">{items.length} deliveries</Badge>
              <Badge variant="outline">{items.reduce((s: number, r: any) => s + (r.total_weight_kg || 0), 0).toLocaleString()} kg total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((r: any) => {
              const dist = parseFloat(distanceInput[r.id] || '') || r.estimated_distance_km || 0;
              const estimate = dist > 0 ? calcCost(r.total_weight_kg || 0, dist) : null;
              return (
                <div key={r.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{r.request_number}</span>
                      <span className="text-sm">{(r.customers as any)?.company_name || '—'}</span>
                    </div>
                    <Badge variant={r.priority === 'urgent' ? 'destructive' : 'secondary'} className="capitalize">{r.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.delivery_address || 'No address'}</p>
                  <div className="flex items-end gap-3">
                    <div>
                      <Label className="text-xs">Weight</Label>
                      <p className="text-sm font-medium">{r.total_weight_kg?.toLocaleString() || 0} kg</p>
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Distance (km)</Label>
                      <Input type="number" className="h-8" value={distanceInput[r.id] ?? (r.estimated_distance_km || '')} onChange={e => setDistanceInput(p => ({ ...p, [r.id]: e.target.value }))} />
                    </div>
                    {estimate && (
                      <>
                        <div>
                          <Label className="text-xs">Best Vehicle</Label>
                          <p className="text-sm font-medium flex items-center gap-1"><Truck className="h-3 w-3" />{estimate.vehicle.vehicle_name}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Est. Cost</Label>
                          <p className="text-sm font-medium flex items-center gap-1"><DollarSign className="h-3 w-3" />R {estimate.cost.toLocaleString()}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => updateCost.mutate({ id: r.id, cost: estimate.cost, distance: dist, vehicleId: estimate.vehicle.id })}>
                          Save Estimate
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
