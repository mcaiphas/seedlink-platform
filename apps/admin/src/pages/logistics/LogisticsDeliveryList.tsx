import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  planning: 'bg-blue-100 text-blue-800',
  dispatched: 'bg-indigo-100 text-indigo-800',
  vehicle_assigned: 'bg-purple-100 text-purple-800',
  in_transit: 'bg-sky-100 text-sky-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  delivery_failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function LogisticsDeliveryList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    delivery_address: '', cargo_description: '', total_weight_kg: '',
    preferred_date: '', priority: 'normal', origin_depot_id: '', customer_id: '',
    special_requirements: '',
  });

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['logistics_delivery_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('logistics_delivery_requests')
        .select('*, customers(company_name), depots(depot_name), vehicle_types(vehicle_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: depots = [] } = useQuery({
    queryKey: ['depots_list_logistics'],
    queryFn: async () => { const { data } = await supabase.from('depots').select('id, depot_name'); return data || []; },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers_list_logistics'],
    queryFn: async () => { const { data } = await supabase.from('customers').select('id, company_name'); return data || []; },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('logistics_delivery_requests').insert({
        delivery_address: form.delivery_address,
        cargo_description: form.cargo_description,
        total_weight_kg: form.total_weight_kg ? parseFloat(form.total_weight_kg) : 0,
        preferred_date: form.preferred_date || null,
        priority: form.priority as any,
        origin_depot_id: form.origin_depot_id || null,
        customer_id: form.customer_id || null,
        special_requirements: form.special_requirements || null,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Delivery request created');
      queryClient.invalidateQueries({ queryKey: ['logistics_delivery_requests'] });
      setOpen(false);
      setForm({ delivery_address: '', cargo_description: '', total_weight_kg: '', preferred_date: '', priority: 'normal', origin_depot_id: '', customer_id: '', special_requirements: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Requests" description="Manage logistics delivery requests and dispatch" action={
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />New Request</Button>
      } />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Depot</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Weight (kg)</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No delivery requests yet</TableCell></TableRow>
              ) : requests.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.request_number || '—'}</TableCell>
                  <TableCell>{(r.customers as any)?.company_name || '—'}</TableCell>
                  <TableCell>{(r.depots as any)?.depot_name || '—'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{r.delivery_address || '—'}</TableCell>
                  <TableCell className="text-right">{r.total_weight_kg?.toLocaleString() || '0'}</TableCell>
                  <TableCell><Badge variant={r.priority === 'urgent' ? 'destructive' : 'secondary'} className="capitalize">{r.priority}</Badge></TableCell>
                  <TableCell>{(r.vehicle_types as any)?.vehicle_name || '—'}</TableCell>
                  <TableCell><Badge className={STATUS_COLORS[r.status] || ''} variant="outline">{r.status?.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">{r.preferred_date ? new Date(r.preferred_date).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Delivery Request</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Customer</Label>
                <Select value={form.customer_id} onValueChange={v => setForm(f => ({ ...f, customer_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Origin Depot</Label>
                <Select value={form.origin_depot_id} onValueChange={v => setForm(f => ({ ...f, origin_depot_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                  <SelectContent>{depots.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.depot_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Delivery Address</Label><Input value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))} /></div>
            <div><Label>Cargo Description</Label><Textarea value={form.cargo_description} onChange={e => setForm(f => ({ ...f, cargo_description: e.target.value }))} rows={2} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Weight (kg)</Label><Input type="number" value={form.total_weight_kg} onChange={e => setForm(f => ({ ...f, total_weight_kg: e.target.value }))} /></div>
              <div><Label>Preferred Date</Label><Input type="date" value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} /></div>
              <div><Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Special Requirements</Label><Textarea value={form.special_requirements} onChange={e => setForm(f => ({ ...f, special_requirements: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
