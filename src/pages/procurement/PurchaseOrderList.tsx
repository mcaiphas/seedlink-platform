import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Eye, FileSpreadsheet } from 'lucide-react';

const statusColor = (s: string) => {
  switch (s) { case 'approved': return 'default'; case 'received': return 'default'; case 'cancelled': return 'destructive'; default: return 'secondary'; }
};

export default function PurchaseOrderList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QueryStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: d, error } = await supabase.from('purchase_orders').select('*, suppliers(supplier_name), depots(name)').order('created_at', { ascending: false }).limit(500);
    if (error) { const c = classifyError(error); setStatus(c.status); setErrorMsg(c.message); setData([]); }
    else { setStatus(d?.length ? 'success' : 'empty'); setData(d || []); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(r => !search || r.po_number?.toLowerCase().includes(search.toLowerCase()) || (r.suppliers as any)?.supplier_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminPage>
      <DataPageShell title="Purchase Orders" description={`${filtered.length} orders`} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search POs..." action={<Button asChild><Link to="/purchase-orders/new"><Plus className="mr-2 h-4 w-4" />New PO</Link></Button>}>
        {status !== 'success' && status !== 'loading' && status !== 'empty' && <QueryStatusBanner status={status} message={errorMsg || undefined} tableName="purchase_orders" />}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>PO #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Depot</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10" />
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="group cursor-pointer" onClick={() => navigate(`/purchase-orders/${r.id}/edit`)}>
                  <TableCell><span className="font-medium font-mono text-primary">{r.po_number}</span></TableCell>
                  <TableCell>{(r.suppliers as any)?.supplier_name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{(r.depots as any)?.name || '—'}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{r.currency_code} {Number(r.total_amount || 0).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={statusColor(r.status) as any} className="capitalize">{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.expected_date ? new Date(r.expected_date).toLocaleDateString() : '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.order_date).toLocaleDateString()}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <EmptyState message="No purchase orders found" colSpan={8} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>
    </AdminPage>
  );
}
