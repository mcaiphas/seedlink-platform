import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell } from '@/components/DataPageShell';
import { StatusBadge, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Download, ChevronLeft, ChevronRight, ArrowLeftRight, Truck, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 20;

const TRANSFER_STATUSES: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  pending_approval: { label: 'Pending Approval', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  in_transit: { label: 'In Transit', variant: 'secondary' },
  received: { label: 'Received', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

export default function StockTransferList() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    from_depot_id: '', to_depot_id: '', product_id: '', pack_size_id: '',
    quantity: '', weight_equivalent_kg: '', transfer_reason: '', notes: '',
  });

  const [detail, setDetail] = useState<any>(null);
  const [detailItems, setDetailItems] = useState<any[]>([]);
  const [actionConfirm, setActionConfirm] = useState<{ transfer: any; action: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [tRes, depRes, prodRes, psRes] = await Promise.all([
      supabase.from('stock_transfers').select('*, from_depot:depots!stock_transfers_from_depot_id_fkey(name), to_depot:depots!stock_transfers_to_depot_id_fkey(name)').order('created_at', { ascending: false }).limit(300),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
      supabase.from('products').select('id, name').eq('is_active', true).order('name').limit(500),
      supabase.from('product_pack_sizes').select('id, name, estimated_weight_kg').eq('is_active', true).order('sort_order'),
    ]);
    setTransfers(tRes.data || []);
    setDepots(depRes.data || []);
    setProducts(prodRes.data || []);
    setPackSizes(psRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = transfers;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(t => (t.transfer_number || '').toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    return result;
  }, [transfers, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openDetail = async (t: any) => {
    setDetail(t);
    const { data } = await supabase.from('stock_transfer_items').select('*, products(name), product_pack_sizes(name)').eq('transfer_id', t.id);
    setDetailItems(data || []);
  };

  const handleCreate = async () => {
    if (!form.from_depot_id || !form.to_depot_id || !form.product_id || !form.quantity) {
      toast.error('Source, destination depots, product and quantity are required'); return;
    }
    if (form.from_depot_id === form.to_depot_id) {
      toast.error('Source and destination must be different'); return;
    }
    setSaving(true);
    const transferNum = `ST-${Date.now().toString(36).toUpperCase()}`;
    const qty = parseFloat(form.quantity) || 0;
    const ps = packSizes.find(p => p.id === form.pack_size_id);
    const weightKg = parseFloat(form.weight_equivalent_kg) || (ps?.estimated_weight_kg ? ps.estimated_weight_kg * qty : null);

    const { data: transfer, error } = await supabase.from('stock_transfers').insert({
      transfer_number: transferNum,
      from_depot_id: form.from_depot_id,
      to_depot_id: form.to_depot_id,
      transfer_reason: form.transfer_reason || null,
      notes: form.notes || null,
      requested_by: user?.id,
      status: 'draft',
      transfer_date: new Date().toISOString().split('T')[0],
    }).select().single();

    if (error || !transfer) { toast.error(error?.message || 'Failed'); setSaving(false); return; }

    await supabase.from('stock_transfer_items').insert({
      transfer_id: transfer.id,
      product_id: form.product_id,
      pack_size_id: form.pack_size_id || null,
      requested_quantity: qty,
      weight_equivalent_kg: weightKg,
    });

    toast.success(`Transfer ${transferNum} created`);
    setSaving(false);
    setCreateOpen(false);
    setForm({ from_depot_id: '', to_depot_id: '', product_id: '', pack_size_id: '', quantity: '', weight_equivalent_kg: '', transfer_reason: '', notes: '' });
    fetchData();
  };

  const handleAction = async (transfer: any, action: string) => {
    const now = new Date().toISOString();

    if (action === 'approve') {
      await supabase.from('stock_transfers').update({ status: 'approved', approved_by: user?.id }).eq('id', transfer.id);
      toast.success('Transfer approved');
    } else if (action === 'dispatch') {
      // Decrease source depot inventory
      const { data: items } = await supabase.from('stock_transfer_items').select('*').eq('transfer_id', transfer.id);
      for (const item of items || []) {
        const qty = item.requested_quantity;
        const { data: inv } = await supabase.from('depot_inventory').select('id, quantity_on_hand').eq('product_id', item.product_id).eq('depot_id', transfer.from_depot_id).maybeSingle();
        if (inv) {
          await supabase.from('depot_inventory').update({ quantity_on_hand: Math.max(0, inv.quantity_on_hand - qty), last_movement_at: now }).eq('id', inv.id);
        }
        await supabase.from('stock_transfer_items').update({ sent_quantity: qty }).eq('id', item.id);
        await supabase.from('stock_movements').insert({
          movement_type: 'transfer_out', product_id: item.product_id, pack_size_id: item.pack_size_id,
          depot_id: transfer.from_depot_id, source_depot_id: transfer.from_depot_id, destination_depot_id: transfer.to_depot_id,
          quantity: qty, weight_equivalent_kg: item.weight_equivalent_kg,
          reference_type: 'stock_transfer', reference_id: transfer.id, reference_number: transfer.transfer_number,
          created_by: user?.id, status: 'completed',
        });
      }
      await supabase.from('stock_transfers').update({ status: 'in_transit', dispatched_at: now }).eq('id', transfer.id);
      toast.success('Transfer dispatched — source depot stock decreased');
    } else if (action === 'receive') {
      // Increase destination depot inventory
      const { data: items } = await supabase.from('stock_transfer_items').select('*').eq('transfer_id', transfer.id);
      for (const item of items || []) {
        const qty = item.sent_quantity || item.requested_quantity;
        const { data: inv } = await supabase.from('depot_inventory').select('id, quantity_on_hand').eq('product_id', item.product_id).eq('depot_id', transfer.to_depot_id).maybeSingle();
        if (inv) {
          await supabase.from('depot_inventory').update({ quantity_on_hand: inv.quantity_on_hand + qty, last_movement_at: now }).eq('id', inv.id);
        } else {
          await supabase.from('depot_inventory').insert({
            product_id: item.product_id, pack_size_id: item.pack_size_id, depot_id: transfer.to_depot_id,
            quantity_on_hand: qty, weight_equivalent_kg: item.weight_equivalent_kg, last_movement_at: now,
          });
        }
        await supabase.from('stock_transfer_items').update({ received_quantity: qty }).eq('id', item.id);
        await supabase.from('stock_movements').insert({
          movement_type: 'transfer_in', product_id: item.product_id, pack_size_id: item.pack_size_id,
          depot_id: transfer.to_depot_id, source_depot_id: transfer.from_depot_id, destination_depot_id: transfer.to_depot_id,
          quantity: qty, weight_equivalent_kg: item.weight_equivalent_kg,
          reference_type: 'stock_transfer', reference_id: transfer.id, reference_number: transfer.transfer_number,
          created_by: user?.id, status: 'completed',
        });
      }
      await supabase.from('stock_transfers').update({ status: 'received', received_at: now }).eq('id', transfer.id);
      toast.success('Transfer received — destination depot stock increased');
    } else if (action === 'cancel') {
      await supabase.from('stock_transfers').update({ status: 'cancelled' }).eq('id', transfer.id);
      toast.success('Transfer cancelled');
    }

    setActionConfirm(null);
    setDetail(null);
    fetchData();
  };

  const getActions = (t: any) => {
    const actions: { label: string; action: string; icon: any; variant?: any }[] = [];
    if (t.status === 'draft') {
      actions.push({ label: 'Approve', action: 'approve', icon: PackageCheck });
      actions.push({ label: 'Cancel', action: 'cancel', icon: ArrowLeftRight, variant: 'destructive' });
    }
    if (t.status === 'approved') actions.push({ label: 'Dispatch', action: 'dispatch', icon: Truck });
    if (t.status === 'in_transit') actions.push({ label: 'Receive', action: 'receive', icon: PackageCheck });
    return actions;
  };

  return (
    <AdminPage>
      <DataPageShell title="Depot Transfers" description="Transfer stock between depots with full tracking"
        loading={loading} searchValue={search} onSearchChange={v => { setSearch(v); setPage(0); }} searchPlaceholder="Search transfers..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportToCsv('transfers', ['#', 'From', 'To', 'Status', 'Date'], filtered.map(t => [t.transfer_number, (t as any).from_depot?.name, (t as any).to_depot?.name, t.status, t.transfer_date]))}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" />New Transfer</Button>
          </div>
        }>
        <div className="flex gap-2 mb-2">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(TRANSFER_STATUSES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4"><ArrowLeftRight className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold">No transfers</h3>
            <p className="text-sm text-muted-foreground mt-1">Stock transfers between depots will appear here.</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer #</TableHead>
                  <TableHead>From Depot</TableHead>
                  <TableHead>To Depot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(t => {
                  const statusConf = TRANSFER_STATUSES[t.status];
                  return (
                    <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(t)}>
                      <TableCell className="font-medium font-mono">{t.transfer_number}</TableCell>
                      <TableCell>{(t as any).from_depot?.name || '—'}</TableCell>
                      <TableCell>{(t as any).to_depot?.name || '—'}</TableCell>
                      <TableCell><Badge variant={statusConf?.variant || 'outline'}>{statusConf?.label || t.status}</Badge></TableCell>
                      <TableCell><DateDisplay date={t.transfer_date || t.created_at} /></TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          {getActions(t).map(a => (
                            <Button key={a.action} size="sm" variant={a.variant || 'outline'}
                              onClick={() => setActionConfirm({ transfer: t, action: a.action })}>
                              {a.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </DataPageShell>

      {/* Create Transfer Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Depot Transfer</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Source Depot *</Label>
                <Select value={form.from_depot_id} onValueChange={v => setForm(f => ({ ...f, from_depot_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
                  <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Destination Depot *</Label>
                <Select value={form.to_depot_id} onValueChange={v => setForm(f => ({ ...f, to_depot_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
                  <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Product *</Label>
                <Select value={form.product_id} onValueChange={v => setForm(f => ({ ...f, product_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Pack Size</Label>
                <Select value={form.pack_size_id} onValueChange={v => setForm(f => ({ ...f, pack_size_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{packSizes.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Quantity *</Label><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" value={form.weight_equivalent_kg} onChange={e => setForm(f => ({ ...f, weight_equivalent_kg: e.target.value }))} placeholder="Auto" /></div>
            </div>
            <div className="space-y-1.5"><Label>Transfer Reason</Label><Input value={form.transfer_reason} onChange={e => setForm(f => ({ ...f, transfer_reason: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Transfer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Transfer {detail?.transfer_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><Badge variant={TRANSFER_STATUSES[detail.status]?.variant || 'outline'}>{TRANSFER_STATUSES[detail.status]?.label || detail.status}</Badge></div>
                <div><p className="text-xs text-muted-foreground">From</p><span>{(detail as any).from_depot?.name || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">To</p><span>{(detail as any).to_depot?.name || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.transfer_date || detail.created_at} /></div>
              </div>
              {detail.transfer_reason && <p className="text-sm text-muted-foreground border rounded-lg p-3">{detail.transfer_reason}</p>}
              <Separator />
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Product</TableHead><TableHead>Pack Size</TableHead>
                  <TableHead className="text-right">Requested</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {detailItems.map(it => (
                    <TableRow key={it.id}>
                      <TableCell className="font-medium">{(it as any).products?.name || '—'}</TableCell>
                      <TableCell>{(it as any).product_pack_sizes?.name || '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">{it.requested_quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">{it.sent_quantity || '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">{it.received_quantity || '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">{it.weight_equivalent_kg ? `${Number(it.weight_equivalent_kg).toFixed(1)}` : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end gap-2">
                {getActions(detail).map(a => (
                  <Button key={a.action} variant={a.variant || 'default'} onClick={() => { setDetail(null); setActionConfirm({ transfer: detail, action: a.action }); }}>
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation */}
      <AlertDialog open={!!actionConfirm} onOpenChange={() => setActionConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionConfirm?.action === 'dispatch' ? 'Dispatch Transfer?' :
               actionConfirm?.action === 'receive' ? 'Confirm Receipt?' :
               actionConfirm?.action === 'approve' ? 'Approve Transfer?' : 'Cancel Transfer?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionConfirm?.action === 'dispatch' ? 'This will decrease stock at the source depot and create movement records.' :
               actionConfirm?.action === 'receive' ? 'This will increase stock at the destination depot.' :
               actionConfirm?.action === 'approve' ? 'This will approve the transfer for dispatch.' : 'This will cancel the transfer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => actionConfirm && handleAction(actionConfirm.transfer, actionConfirm.action)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
