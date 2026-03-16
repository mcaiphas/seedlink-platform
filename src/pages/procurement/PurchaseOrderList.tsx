import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Submitted', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  received: { label: 'Received', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  closed: { label: 'Closed', variant: 'secondary' },
};

export default function PurchaseOrderList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('purchase_orders').select('*, suppliers(supplier_name, supplier_code), depots(name)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => data.filter(r => {
    const matchSearch = !search || r.po_number?.toLowerCase().includes(search.toLowerCase()) || r.suppliers?.supplier_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  }), [data, search, statusFilter]);

  const stats = useMemo(() => ({
    total: data.length,
    draft: data.filter(r => r.status === 'draft').length,
    open: data.filter(r => ['submitted', 'approved'].includes(r.status)).length,
    totalValue: data.reduce((s, r) => s + Number(r.total_amount || 0), 0),
  }), [data]);

  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);

  return (
    <div className="space-y-6">
      <DataPageShell
        title="Purchase Orders"
        description="Manage procurement orders to suppliers"
        action={<Button onClick={() => navigate('/purchase-orders/new')} className="gap-2"><Plus className="h-4 w-4" />New Purchase Order</Button>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total POs', value: stats.total },
            { label: 'Draft', value: stats.draft },
            { label: 'Open', value: stats.open },
            { label: 'Total Value', value: fmt(stats.totalValue) },
          ].map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search PO number or supplier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">PO Number</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Depot</TableHead>
                <TableHead className="font-semibold">Order Date</TableHead>
                <TableHead className="font-semibold">Expected</TableHead>
                <TableHead className="font-semibold text-right">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const st = STATUS_MAP[r.status] || { label: r.status, variant: 'outline' as const };
                return (
                  <TableRow key={r.id} className="group cursor-pointer hover:bg-muted/20" onClick={() => navigate(`/purchase-orders/${r.id}/edit`)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-mono font-medium text-sm">{r.po_number}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{r.suppliers?.supplier_name || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.depots?.name || '—'}</TableCell>
                    <TableCell className="text-sm">{r.order_date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.expected_date || '—'}</TableCell>
                    <TableCell className="text-right font-mono font-medium">{fmt(Number(r.total_amount || 0))}</TableCell>
                    <TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && !loading && <EmptyState message="No purchase orders found" colSpan={8} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>
    </div>
  );
}
