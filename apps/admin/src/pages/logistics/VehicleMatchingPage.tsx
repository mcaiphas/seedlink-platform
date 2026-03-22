import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle } from 'lucide-react';

export default function VehicleMatchingPage() {
  const [weight, setWeight] = useState('');

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicle_types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicle_types')
        .select('*').eq('is_active', true).order('max_weight_kg');
      if (error) throw error;
      return data || [];
    },
  });

  const weightKg = parseFloat(weight) || 0;
  const suitable = vehicleTypes.filter((v: any) => v.max_weight_kg >= weightKg);
  const bestFit = suitable.length > 0 ? suitable[0] : null;

  const estimateCost = (vehicle: any, distKm: number) => {
    return (vehicle.base_rate || 0) + (vehicle.per_km_rate || 0) * distKm;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vehicle Matching" description="Find the best vehicle for your shipment weight and distance" />

      <Card>
        <CardHeader><CardTitle className="text-base">Shipment Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div>
              <Label>Shipment Weight (kg)</Label>
              <Input type="number" placeholder="e.g. 5000" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {weightKg > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Vehicles for {weightKg.toLocaleString()} kg</h3>
          {suitable.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No vehicle can carry this weight. Consider splitting the shipment.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suitable.map((v: any) => {
                const isBest = v.id === bestFit?.id;
                const utilization = Math.round((weightKg / v.max_weight_kg) * 100);
                const est50 = estimateCost(v, 50);
                const est200 = estimateCost(v, 200);
                return (
                  <Card key={v.id} className={isBest ? 'border-primary shadow-md' : ''}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{v.vehicle_name}</span>
                        </div>
                        {isBest && <Badge className="bg-primary text-primary-foreground"><CheckCircle className="h-3 w-3 mr-1" />Best Fit</Badge>}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span>{v.max_weight_kg.toLocaleString()} kg</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Utilization</span><span className={utilization > 90 ? 'text-amber-600 font-medium' : ''}>{utilization}%</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Base Rate</span><span>R {v.base_rate?.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Per km</span><span>R {v.per_km_rate}</span></div>
                        <div className="border-t pt-1 mt-1">
                          <div className="flex justify-between"><span className="text-muted-foreground">Est. 50km</span><span className="font-medium">R {est50.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Est. 200km</span><span className="font-medium">R {est200.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">All Vehicle Types</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {vehicleTypes.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{v.vehicle_name}</p>
                  <p className="text-xs text-muted-foreground">{v.max_weight_kg.toLocaleString()} kg max</p>
                </div>
                <Badge variant="outline">R {v.base_rate} + R {v.per_km_rate}/km</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
