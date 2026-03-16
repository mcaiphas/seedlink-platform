import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Truck, Send, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function DispatchBoard() {
  const queryClient = useQueryClient();
  const [assignDialog, setAssignDialog] = useState<any>(null);
  const [assignForm, setAssignForm] = useState({ vehicle_type_id: '', assigned_vehicle_reg: '', driver_name: '', driver_phone: '' });

  const { data: pending = [] } = useQuery({
    queryKey: ['dispatch_pending'],
    queryFn: async () => {
      const { data, error } = await supabase.from('logistics_delivery_requests')
        .select('*, customers(company_name), depots(depot_name)')
        .in('status', ['pending', 'planning'])
        .order('priority', { ascending: true })
        .order('preferred_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: dispatched = [] } = useQuery({
    queryKey: ['dispatch_active'],
    queryFn: async () => {
      const { data, error } = await supabase.from('logistics_delivery_requests')
        .select('*, customers(company_name), depots(depot_name), vehicle_types(vehicle_name)')
        .in('status', ['dispatched', 'vehicle_assigned', 'in_transit'])
        .order('preferred_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicle_types_dispatch'],
    queryFn: async () => { const { data } = await supabase.from('vehicle_types').select('id, vehicle_name, max_weight_kg').eq('is_active', true).order('max_weight_kg'); return data || []; },
  });

  const dispatchMutation = useMutation({
    mutationFn: async () => {
      if (!assignDialog) return;
      const { error } = await supabase.from('logistics_delivery_requests')
        .update({
          status: 'dispatched',
          vehicle_type_id: assignForm.vehicle_type_id || null,
          assigned_vehicle_reg: assignForm.assigned_vehicle_reg || null,
          driver_name: assignForm.driver_name || null,
          driver_phone: assignForm.driver_phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', assignDialog.id);
      if (error) throw error;
      // Log status change
      await supabase.from('logistics_status_log').insert({
        delivery_request_id: assignDialog.id,
        status: 'dispatched',
        notes: `Assigned vehicle: ${assignForm.assigned_vehicle_reg || 'pending'}`,
      });
    },
    onSuccess: () => {
      toast.success('Delivery dispatched');
      queryClient.invalidateQueries({ queryKey: ['dispatch_pending'] });
      queryClient.invalidateQueries({ queryKey: ['dispatch_active'] });
      setAssignDialog(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const priorityOrder = { urgent: 0, normal: 1, scheduled: 2 };

  return (
    <div className="space-y-6">
      <PageHeader title="Dispatch Board" description="Plan and dispatch deliveries to vehicles" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" /> Awaiting Dispatch ({pending.length})
          </h3>
          {pending.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No pending deliveries</CardContent></Card>
          ) : pending.map((r: any) => (
            <Card key={r.id} className={r.priority === 'urgent' ? 'border-destructive' : ''}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{r.request_number}</span>
                  <Badge variant={r.priority === 'urgent' ? 'destructive' : 'secondary'} className="capitalize">{r.priority}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Customer:</span> {(r.customers as any)?.company_name || '—'}</p>
                  <p><span className="text-muted-foreground">From:</span> {(r.depots as any)?.depot_name || '—'}</p>
                  <p><span className="text-muted-foreground">To:</span> {r.delivery_address || '—'}</p>
                  <div className="flex gap-4">
                    <span><span className="text-muted-foreground">Weight:</span> {r.total_weight_kg?.toLocaleString() || 0} kg</span>
                    <span><span className="text-muted-foreground">Date:</span> {r.preferred_date || '—'}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full" onClick={() => { setAssignDialog(r); setAssignForm({ vehicle_type_id: '', assigned_vehicle_reg: '', driver_name: '', driver_phone: '' }); }}>
                  <Send className="h-4 w-4 mr-2" />Assign & Dispatch
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-500" /> Active Deliveries ({dispatched.length})
          </h3>
          {dispatched.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No active deliveries</CardContent></Card>
          ) : dispatched.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{r.request_number}</span>
                  <Badge variant="outline" className="capitalize">{r.status?.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Customer:</span> {(r.customers as any)?.company_name || '—'}</p>
                  <p><span className="text-muted-foreground">Vehicle:</span> {(r.vehicle_types as any)?.vehicle_name || '—'} {r.assigned_vehicle_reg ? `(${r.assigned_vehicle_reg})` : ''}</p>
                  <p><span className="text-muted-foreground">Driver:</span> {r.driver_name || '—'} {r.driver_phone ? `• ${r.driver_phone}` : ''}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dispatch {assignDialog?.request_number}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Vehicle Type</Label>
              <Select value={assignForm.vehicle_type_id} onValueChange={v => setAssignForm(f => ({ ...f, vehicle_type_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>{vehicleTypes.map((v: any) => (
                  <SelectItem key={v.id} value={v.id}>{v.vehicle_name} ({v.max_weight_kg.toLocaleString()} kg)</SelectItem>
                ))}</SelectContent>
              </Select>
            </div>
            <div><Label>Vehicle Registration</Label><Input value={assignForm.assigned_vehicle_reg} onChange={e => setAssignForm(f => ({ ...f, assigned_vehicle_reg: e.target.value }))} placeholder="e.g. ABC 123 GP" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Driver Name</Label><Input value={assignForm.driver_name} onChange={e => setAssignForm(f => ({ ...f, driver_name: e.target.value }))} /></div>
              <div><Label>Driver Phone</Label><Input value={assignForm.driver_phone} onChange={e => setAssignForm(f => ({ ...f, driver_phone: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(null)}>Cancel</Button>
            <Button onClick={() => dispatchMutation.mutate()} disabled={dispatchMutation.isPending}><Send className="h-4 w-4 mr-2" />Dispatch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
