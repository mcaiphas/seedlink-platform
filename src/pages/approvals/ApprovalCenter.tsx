import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { toast } from 'sonner';
import { logAudit } from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';
import {
  CheckCircle, XCircle, Clock, Search, FileSpreadsheet, ArrowLeftRight,
  ClipboardList, DollarSign, Package, Filter,
} from 'lucide-react';

const TYPE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  purchase_order: { label: 'Purchase Order', icon: FileSpreadsheet, color: 'bg-blue-100 text-blue-800' },
  stock_adjustment: { label: 'Stock Adjustment', icon: ClipboardList, color: 'bg-amber-100 text-amber-800' },
  depot_transfer: { label: 'Depot Transfer', icon: ArrowLeftRight, color: 'bg-purple-100 text-purple-800' },
  inventory_writeoff: { label: 'Inventory Write-off', icon: Package, color: 'bg-red-100 text-red-800' },
  price_change: { label: 'Price Change', icon: DollarSign, color: 'bg-teal-100 text-teal-800' },
};

export default function ApprovalCenter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('approval_requests')
      .select('*, requester:requested_by(full_name), approver:approved_by(full_name)')
      .order('created_at', { ascending: false })
      .limit(300);
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const filtered = requests.filter(r => {
    if (typeFilter !== 'all' && r.request_type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.approval_status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(r.reference_number || '').toLowerCase().includes(s) && !(r.description || '').toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const pendingCount = requests.filter(r => r.approval_status === 'pending').length;
  const approvedCount = requests.filter(r => r.approval_status === 'approved').length;
  const rejectedCount = requests.filter(r => r.approval_status === 'rejected').length;

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('approval_requests').update({
      approval_status: 'approved',
      approved_by: user?.id,
      approved_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    logAudit({ action: 'approve', entity_type: 'approval_request', entity_id: id });
    toast.success('Request approved');
    fetchRequests();
  };

  const handleReject = async () => {
    if (!rejectId) return;
    const { error } = await supabase.from('approval_requests').update({
      approval_status: 'rejected',
      approved_by: user?.id,
      approved_at: new Date().toISOString(),
      rejection_reason: rejectReason,
    }).eq('id', rejectId);
    if (error) { toast.error(error.message); return; }
    logAudit({ action: 'reject', entity_type: 'approval_request', entity_id: rejectId });
    toast.success('Request rejected');
    setRejectOpen(false);
    setRejectId(null);
    setRejectReason('');
    fetchRequests();
  };

  const getLink = (r: any) => {
    if (r.request_type === 'purchase_order') return `/purchase-orders/${r.reference_id}/edit`;
    if (r.request_type === 'stock_adjustment') return '/stock-adjustments';
    if (r.request_type === 'depot_transfer') return '/stock-transfers';
    return '#';
  };

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div></AdminPage>;

  return (
    <AdminPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approval Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and approve pending transactions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer" onClick={() => setStatusFilter('pending')}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Clock className="h-4 w-4" />Pending</div>
              <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => setStatusFilter('approved')}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><CheckCircle className="h-4 w-4" />Approved</div>
              <p className="text-3xl font-bold text-emerald-600">{approvedCount}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => setStatusFilter('rejected')}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><XCircle className="h-4 w-4" />Rejected</div>
              <p className="text-3xl font-bold text-destructive">{rejectedCount}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => setStatusFilter('all')}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Filter className="h-4 w-4" />Total</div>
              <p className="text-3xl font-bold">{requests.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by reference or description…" className="h-8 pl-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Value Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const typeInfo = TYPE_LABELS[r.request_type];
                const label = typeInfo?.label || r.request_type;
                const color = typeInfo?.color || '';
                const Icon = typeInfo?.icon || Clock;
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Badge variant="outline" className={`${color} text-xs gap-1`}>
                        <Icon className="h-3 w-3" />{typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <button onClick={() => navigate(getLink(r))} className="text-primary hover:underline">{r.reference_number || r.reference_id?.slice(0, 8)}</button>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{r.description || '—'}</TableCell>
                    <TableCell className="text-sm">{(r.requester as any)?.full_name || '—'}</TableCell>
                    <TableCell><DateDisplay date={r.requested_at} /></TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={r.value_impact} /></TableCell>
                    <TableCell>
                      <Badge variant={r.approval_status === 'pending' ? 'secondary' : r.approval_status === 'approved' ? 'default' : 'destructive'}
                        className={r.approval_status === 'pending' ? 'bg-amber-100 text-amber-800' : r.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : ''}>
                        {r.approval_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {r.approval_status === 'pending' && (
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-700" onClick={() => handleApprove(r.id)}>
                            <CheckCircle className="h-3 w-3" />Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" onClick={() => { setRejectId(r.id); setRejectOpen(true); }}>
                            <XCircle className="h-3 w-3" />Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No approval requests found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Request</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Provide a reason for rejection.</p>
            <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
