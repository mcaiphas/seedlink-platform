import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCsv } from '@/lib/csv-export';

export default function CompletedDeliveries() {
  const { data: completed = [], isLoading } = useQuery({
    queryKey: ['completed_deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('logistics_delivery_requests')
        .select('*, customers(company_name), depots(depot_name), vehicle_types(vehicle_name)')
        .in('status', ['delivered', 'delivery_failed'])
        .order('delivered_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const handleExport = () => {
    const headers = ['Request #', 'Customer', 'Depot', 'Destination', 'Weight (kg)', 'Vehicle', 'Status', 'Cost', 'Delivered'];
    const rows = completed.map((r: any) => [
      r.request_number || '', (r.customers as any)?.company_name || '', (r.depots as any)?.depot_name || '',
      r.delivery_address || '', String(r.total_weight_kg || 0), (r.vehicle_types as any)?.vehicle_name || '',
      r.status, String(r.actual_cost || r.estimated_cost || ''), r.delivered_at ? new Date(r.delivered_at).toLocaleDateString() : '',
    ]);
    exportToCsv('completed-deliveries', headers, rows);
  };

  const fmt = (v: number) => `R ${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Completed Deliveries" description="Historical delivery records" action={
        <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
      } />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Depot</TableHead>
                <TableHead className="text-right">Weight (kg)</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Delivered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : completed.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No completed deliveries yet</TableCell></TableRow>
              ) : completed.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.request_number}</TableCell>
                  <TableCell>{(r.customers as any)?.company_name || '—'}</TableCell>
                  <TableCell>{(r.depots as any)?.depot_name || '—'}</TableCell>
                  <TableCell className="text-right">{r.total_weight_kg?.toLocaleString()}</TableCell>
                  <TableCell>{(r.vehicle_types as any)?.vehicle_name || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'delivered' ? 'default' : 'destructive'} className="capitalize">
                      {r.status?.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{r.actual_cost || r.estimated_cost ? fmt(r.actual_cost || r.estimated_cost) : '—'}</TableCell>
                  <TableCell className="text-sm">{r.delivered_at ? new Date(r.delivered_at).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
