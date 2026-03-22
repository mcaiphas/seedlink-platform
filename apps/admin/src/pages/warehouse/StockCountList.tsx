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
import { Plus, Download, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 20;

const COUNT_TYPES = [
  { value: 'full', label: 'Full Depot Count' },
  { value: 'cycle', label: 'Cycle Count' },
  { value: 'spot_check', label: 'Spot Check' },
];

export default function StockCountList() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ depot_id: '', count_type: 'full', notes: '' });

  const [detail, setDetail] = useState<any>(null);
  const [countItems, setCountItems] = useState<any[]>([]);
  const [postConfirm, setPostConfirm] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const [cRes, depRes, prodRes, psRes] = await Promise.all([
      supabase.from('stock_counts').select('*, depots(name)').order('created_at', { ascending: false }).limit(200),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
      supabase.from('products').select('id, name').eq('is_active', true).order('name').limit(500),
      supabase.from('product_pack_sizes').select('id, name, estimated_weight_kg').eq('is_active', true).order('sort_order'),
    ]);
    setCounts(cRes.data || []);
    setDepots(depRes.data || []);
    setProducts(prodRes.data || []);
    setPackSizes(psRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = counts;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c => (c.count_number || '').toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    return result;
  }, [counts, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openDetail = async (count: any) => {
    setDetail(count);
    const { data } = await supabase.from('stock_count_items').select('*, products(name), product_pack_sizes(name)').eq('stock_count_id', count.id);
    setCountItems(data || []);
  };

  const handleCreate = async () => {
    if (!form.depot_id) { toast.error('Depot is required'); return; }
    setSaving(true);

    const { data: numData } = await supabase.rpc('generate_sc_number');
    const countNumber = numData || `SC-${Date.now()}`;

    // Create count session
    const { data: count, error } = await supabase.from('stock_counts').insert({
      count_number: countNumber,
      depot_id: form.depot_id,
      count_type: form.count_type,
      notes: form.notes || null,
      created_by: user?.id,
      status: 'draft',
    }).select().single();

    if (error || !count) { toast.error(error?.message || 'Failed'); setSaving(false); return; }

    // Pre-populate with current depot inventory
    const { data: inv } = await supabase.from('depot_inventory').select('product_id, pack_size_id, quantity_on_hand, weight_equivalent_kg').eq('depot_id', form.depot_id);
    if (inv?.length) {
      const items = inv.map(i => ({
        stock_count_id: count.id,
        product_id: i.product_id,
        pack_size_id: i.pack_size_id,
        system_quantity: i.quantity_on_hand || 0,
        weight_equivalent_kg: i.weight_equivalent_kg,
      }));
      await supabase.from('stock_count_items').insert(items);
    }

    toast.success(`Count ${countNumber} created with ${inv?.length || 0} items from depot inventory`);
    setSaving(false);
    setCreateOpen(false);
    setForm({ depot_id: '', count_type: 'full', notes: '' });
    fetchData();
  };

  const updateCountedQty = async (itemId: string, value: string) => {
    const qty = value === '' ? null : parseFloat(value);
    await supabase.from('stock_count_items').update({ counted_quantity: qty }).eq('id', itemId);
    setCountItems(prev => prev.map(i => i.id === itemId ? { ...i, counted_quantity: qty, variance: (qty ?? 0) - i.system_quantity } : i));
  };

  const handlePost = async (count: any) => {
    // Post all variances as inventory adjustments
    const itemsWithVariance = countItems.filter(i => i.counted_quantity !== null && i.variance !== 0);

    for (const item of itemsWithVariance) {
      const isIncrease = item.variance > 0;
      const qty = Math.abs(item.variance);

      // Update inventory
      const { data: inv } = await supabase.from('depot_inventory').select('id, quantity_on_hand').eq('product_id', item.product_id).eq('depot_id', count.depot_id).maybeSingle();
      if (inv) {
        await supabase.from('depot_inventory').update({
          quantity_on_hand: item.counted_quantity,
          last_movement_at: new Date().toISOString(),
        }).eq('id', inv.id);
      }

      // Create movement record
      await supabase.from('stock_movements').insert({
        movement_type: 'count_variance',
        product_id: item.product_id,
        pack_size_id: item.pack_size_id,
        depot_id: count.depot_id,
        quantity: isIncrease ? qty : -qty,
        weight_equivalent_kg: item.weight_equivalent_kg,
        reference_type: 'stock_count',
        reference_id: count.id,
        reference_number: count.count_number,
        reason_code: 'counting_error',
        created_by: user?.id,
        status: 'completed',
      });
    }

    await supabase.from('stock_counts').update({
      status: 'posted',
      posted_at: new Date().toISOString(),
      approved_by: user?.id,
    }).eq('id', count.id);

    toast.success(`Count ${count.count_number} posted — ${itemsWithVariance.length} variance${itemsWithVariance.length !== 1 ? 's' : ''} applied`);
    setPostConfirm(null);
    setDetail(null);
    fetchData();
  };

  return (
    <AdminPage>
      <DataPageShell title="Stock Counts" description="Cycle counts, spot checks and full depot counts"
        loading={loading} searchValue={search} onSearchChange={v => { setSearch(v); setPage(0); }} searchPlaceholder="Search counts..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportToCsv('stock-counts', ['Count #', 'Depot', 'Type', 'Status', 'Date'], filtered.map(c => [c.count_number, (c as any).depots?.name, c.count_type, c.status, c.count_date]))}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" />New Count</Button>
          </div>
        }>
        <div className="flex gap-2 mb-2">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4"><ClipboardCheck className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold">No stock counts</h3>
            <p className="text-sm text-muted-foreground mt-1">Create a stock count to verify physical inventory against system records.</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Count #</TableHead>
                  <TableHead>Depot</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(c => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(c)}>
                    <TableCell className="font-medium font-mono">{c.count_number}</TableCell>
                    <TableCell>{(c as any).depots?.name || '—'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{c.count_type?.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell><StatusBadge type="document" value={c.status} /></TableCell>
                    <TableCell><DateDisplay date={c.count_date} /></TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      {c.status === 'draft' && <Button size="sm" variant="outline" onClick={() => openDetail(c)}>Count</Button>}
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* Create Count */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Stock Count</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Depot *</Label>
              <Select value={form.depot_id} onValueChange={v => setForm(f => ({ ...f, depot_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Count Type</Label>
              <Select value={form.count_type} onValueChange={v => setForm(f => ({ ...f, count_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{COUNT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Start Count'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Count Detail / Entry */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Count {detail?.count_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Depot</p><span>{(detail as any).depots?.name}</span></div>
                <div><p className="text-xs text-muted-foreground">Type</p><Badge variant="outline" className="capitalize">{detail.count_type?.replace(/_/g, ' ')}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.count_date} /></div>
              </div>
              <Separator />

              {countItems.length > 0 && (
                <>
                  <div className="text-sm font-medium mb-2">
                    {countItems.filter(i => i.counted_quantity !== null).length} / {countItems.length} items counted
                    {countItems.some(i => i.variance !== 0 && i.counted_quantity !== null) && (
                      <span className="text-destructive ml-2">
                        ({countItems.filter(i => i.variance !== 0 && i.counted_quantity !== null).length} variances)
                      </span>
                    )}
                  </div>
                  <div className="rounded-lg border overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Pack Size</TableHead>
                        <TableHead className="text-right">System Qty</TableHead>
                        <TableHead className="text-right w-32">Counted Qty</TableHead>
                        <TableHead className="text-right">Variance</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {countItems.map(it => (
                          <TableRow key={it.id} className={it.counted_quantity !== null && it.variance !== 0 ? 'bg-destructive/5' : ''}>
                            <TableCell className="font-medium">{(it as any).products?.name || '—'}</TableCell>
                            <TableCell>{(it as any).product_pack_sizes?.name || '—'}</TableCell>
                            <TableCell className="text-right tabular-nums">{it.system_quantity}</TableCell>
                            <TableCell className="text-right">
                              {detail.status === 'draft' ? (
                                <Input
                                  type="number"
                                  className="w-24 h-7 text-right text-sm ml-auto"
                                  value={it.counted_quantity ?? ''}
                                  onChange={e => updateCountedQty(it.id, e.target.value)}
                                  placeholder="—"
                                />
                              ) : (
                                <span className="tabular-nums">{it.counted_quantity ?? '—'}</span>
                              )}
                            </TableCell>
                            <TableCell className={`text-right tabular-nums font-medium ${it.counted_quantity !== null && it.variance !== 0 ? (it.variance > 0 ? 'text-emerald-600' : 'text-destructive') : ''}`}>
                              {it.counted_quantity !== null ? (it.variance > 0 ? `+${it.variance}` : it.variance) : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {countItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No inventory items found in this depot</p>
              )}

              {detail.status === 'draft' && countItems.some(i => i.counted_quantity !== null) && (
                <div className="flex justify-end">
                  <Button onClick={() => { setDetail(null); setPostConfirm(detail); }}>Post Variances & Update Inventory</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Post Confirmation */}
      <AlertDialog open={!!postConfirm} onOpenChange={() => setPostConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post Count {postConfirm?.count_number}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will adjust inventory to the counted quantities and create variance movement records. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => postConfirm && handlePost(postConfirm)}>Post & Adjust Inventory</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
