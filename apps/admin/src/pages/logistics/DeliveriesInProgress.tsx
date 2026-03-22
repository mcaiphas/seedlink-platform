import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveriesInProgress() {
  const queryClient = useQueryClient();

  const { data: active = [], isLoading } = useQuery({
    queryKey: ['deliveries_in_progress'],
    queryFn: async () => {
      const { data, error } = await supabase.from('logistics_delivery_requests')
        .select('*, customers(company_name), depots(depot_name), vehicle_types(vehicle_name)')
        .in('status', ['dispatched', 'vehicle_assigned', 'in_transit'])
        .order('preferred_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (status === 'delivered') updates.delivered_at = new Date().toISOString();
      const { error } = await supabase.from('logistics_delivery_requests').update(updates).eq('id', id);
      if (error) throw error;
      await supabase.from('logistics_status_log').insert({ delivery_request_id: id, status, notes: `Status updated to ${status}` });
    },
    onSuccess: () => { toast.success('Status updated'); queryClient.invalidateQueries({ queryKey: ['deliveries_in_progress'] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Deliveries in Progress" description="Track active deliveries and update their status" />

      {isLoading ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : active.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No active deliveries</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold">{r.request_number}</span>
                  <Badge variant="outline" className="capitalize">{r.status?.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{(r.customers as any)?.company_name || 'Walk-in'}</p>
                  <p className="text-muted-foreground">{r.delivery_address || '—'}</p>
                  <div className="flex gap-3 text-muted-foreground">
                    <span><Truck className="h-3 w-3 inline mr-1" />{(r.vehicle_types as any)?.vehicle_name || '—'}</span>
                    <span>{r.total_weight_kg?.toLocaleString() || 0} kg</span>
                  </div>
                  {r.driver_name && <p className="text-muted-foreground">Driver: {r.driver_name} {r.driver_phone ? `• ${r.driver_phone}` : ''}</p>}
                </div>
                <div className="flex gap-2">
                  {r.status === 'dispatched' && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => updateStatus.mutate({ id: r.id, status: 'in_transit' })}>
                      Mark In Transit
                    </Button>
                  )}
                  <Button size="sm" className="flex-1" onClick={() => updateStatus.mutate({ id: r.id, status: 'delivered' })}>
                    <CheckCircle className="h-4 w-4 mr-1" />Delivered
                  </Button>
                  <Button size="sm" variant="destructive" className="shrink-0" onClick={() => updateStatus.mutate({ id: r.id, status: 'delivery_failed' })}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
