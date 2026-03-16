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
import { Plus, Download, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 20;
const REASON_CODES = ['damage', 'expiry', 'shrinkage', 'found_stock', 'counting_error', 'system_correction', 'sample_issue', 'internal_use', 'repacking', 'other'];

export default function StockAdjustmentList() {
  const { user } = useAuth();
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);

  // Create form
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    adjustment_type: 'increase', depot_id: '', product_id: '', pack_size_id: '',
    quantity: '', weight_equivalent_kg: '', reason_code: '', notes: '',
  });

  // Detail & posting
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [postConfirm, setPostConfirm] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const [adjRes, depRes, prodRes, psRes] = await Promise.all([
      supabase.from('stock_adjustments').select('*, depots(name)').order('created_at', { ascending: false }).limit(300),
      supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
      supabase.from('products').select('id, name').eq('is_active', true).order('name').limit(500),
      supabase.from('product_pack_sizes').select('id, name, estimated_weight_kg').eq('is_active', true).order('sort_order'),
    ]);
    setAdjustments(adjRes.data || []);
    setDepots(depRes.data || []);
    setProducts(prodRes.data || []);
    setPackSizes(psRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = adjustments;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(a => (a.adjustment_number || '').toLowerCase().includes(s) || (a.reason_code || '').toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    return result;
  }, [adjustments, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openDetail = async (adj: any) => {
    setDetail(adj);
    const { data } = await supabase.from('stock_adjustment_items').select('*, products(name), product_pack_sizes(name)').eq('stock_adjustment_id', adj.id);
    setItems(data || []);
  };

  const handleCreate = async () => {
    if (!form.depot_id || !form.product_id || !form.quantity) {
      toast.error('Depot, product and quantity are required'); return;
    }
    setSaving(true);
    const { data: saNum } = await supabase.rpc('generate_sa_number');
    const adjNumber = saNum || `SA-${Date.now()}`;

    // Create adjustment header
    const { data: adj, error: adjErr } = await supabase.from('stock_adjustments').insert({
      adjustment_number: adjNumber,
      depot_id: form.depot_id,
      adjustment_type: form.adjustment_type,
      reason: form.notes || null,
      reason_code: form.reason_code || null,
      status: 'draft',
      created_by: user?.id,
    }).select().single();

    if (adjErr || !adj) { toast.error(adjErr?.message || 'Failed'); setSaving(false); return; }

    const qty = parseFloat(form.quantity) || 0;
    const ps = packSizes.find(p => p.id === form.pack_size_id);
    const weightKg = parseFloat(form.weight_equivalent_kg) || (ps?.estimated_weight_kg ? ps.estimated_weight_kg * qty : null);

    // Create adjustment item
    await supabase.from('stock_adjustment_items').insert({
      stock_adjustment_id: adj.id,
      product_id: form.product_id,
      pack_size_id: form.pack_size_id || null,
      adjustment_type: form.adjustment_type,
      quantity: qty,
      quantity_adjustment: form.adjustment_type === 'increase' ? qty : -qty,
      weight_equivalent_kg: weightKg,
      notes: form.notes || null,
    });

    toast.success(`Adjustment ${adjNumber} created as draft`);
    setSaving(false);
    setCreateOpen(false);
    setForm({ adjustment_type: 'increase', depot_id: '', product_id: '', pack_size_id: '', quantity: '', weight_equivalent_kg: '', reason_code: '', notes: '' });
    fetchData();
  };

  const handlePost = async (adj: any) => {
    // Load items
    const { data: adjItems } = await supabase.from('stock_adjustment_items').select('*').eq('stock_adjustment_id', adj.id);
    if (!adjItems?.length) { toast.error('No items to post'); return; }

    for (const item of adjItems) {
      const isIncrease = item.adjustment_type === 'increase';
      const qty = Math.abs(item.quantity || item.quantity_adjustment);

      // Update inventory
      const { data: inv } = await supabase.from('depot_inventory')
        .select('id, quantity_on_hand')
        .eq('product_id', item.product_id)
        .eq('depot_id', adj.depot_id)
        .maybeSingle();

      if (inv) {
        const newQty = isIncrease ? inv.quantity_on_hand + qty : Math.max(0, inv.quantity_on_hand - qty);
        await supabase.from('depot_inventory').update({ quantity_on_hand: newQty, last_movement_at: new Date().toISOString() }).eq('id', inv.id);
      } else if (isIncrease) {
        await supabase.from('depot_inventory').insert({
          product_id: item.product_id, pack_size_id: item.pack_size_id, depot_id: adj.depot_id,
          quantity_on_hand: qty, weight_equivalent_kg: item.weight_equivalent_kg, last_movement_at: new Date().toISOString(),
        });
      }

      // Create movement record
      await supabase.from('stock_movements').insert({
        movement_type: isIncrease ? 'adjustment_in' : 'adjustment_out',
        product_id: item.product_id, pack_size_id: item.pack_size_id, depot_id: adj.depot_id,
        quantity: qty, weight_equivalent_kg: item.weight_equivalent_kg,
        reference_type: 'stock_adjustment', reference_id: adj.id,
        reference_number: adj.adjustment_number, reason_code: adj.reason_code,
        created_by: user?.id, status: 'completed',
      });
    }

    await supabase.from('stock_adjustments').update({ status: 'posted', posted_at: new Date().toISOString() }).eq('id', adj.id);
    toast.success(`Adjustment ${adj.adjustment_number} posted — inventory updated`);
    setPostConfirm(null);
    setDetail(null);
    fetchData();
  };

  const handleExport = () => {
    exportToCsv('stock-adjustments', ['Adjustment #', 'Type', 'Depot', 'Reason', 'Status', 'Date'],
      filtered.map(a => [a.adjustment_number, a.adjustment_type, (a as any).depots?.name || '', a.reason_code || '', a.status, a.created_at]));
  };

  return (
    <AdminPage>
      <DataPageShell title="Stock Adjustments" description="Inventory corrections with reason tracking and approval"
        loading={loading} searchValue={search} onSearchChange={v => { setSearch(v); setPage(0); }} searchPlaceholder="Search adjustments..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" />New Adjustment</Button>
          </div>
        }>
        <div className="flex gap-2 mb-2">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4"><ClipboardList className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold">No adjustments</h3>
            <p className="text-sm text-muted-foreground mt-1">Stock adjustments will appear here.</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adjustment #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Depot</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(a => (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(a)}>
                    <TableCell className="font-medium font-mono">{a.adjustment_number}</TableCell>
                    <TableCell><Badge variant={a.adjustment_type === 'increase' ? 'default' : 'secondary'} className="text-xs capitalize">{a.adjustment_type}</Badge></TableCell>
                    <TableCell>{(a as any).depots?.name || '—'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{a.reason_code?.replace(/_/g, ' ') || '—'}</Badge></TableCell>
                    <TableCell><StatusBadge type="document" value={a.status} /></TableCell>
                    <TableCell><DateDisplay date={a.created_at} /></TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      {a.status === 'draft' && (
                        <Button size="sm" variant="outline" onClick={() => setPostConfirm(a)}>Post</Button>
                      )}
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

      {/* Create Adjustment Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Stock Adjustment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Adjustment Type *</Label>
                <Select value={form.adjustment_type} onValueChange={v => setForm(f => ({ ...f, adjustment_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase Stock</SelectItem>
                    <SelectItem value="decrease">Decrease Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Reason Code *</Label>
                <Select value={form.reason_code} onValueChange={v => setForm(f => ({ ...f, reason_code: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>{REASON_CODES.map(r => <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Depot *</Label>
              <Select value={form.depot_id} onValueChange={v => setForm(f => ({ ...f, depot_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
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
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Adjustment'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Adjustment {detail?.adjustment_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Type</p><Badge variant="outline" className="capitalize">{detail.adjustment_type}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Reason</p><span className="capitalize">{detail.reason_code?.replace(/_/g, ' ') || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.created_at} /></div>
              </div>
              {detail.reason && <p className="text-sm text-muted-foreground border rounded-lg p-3">{detail.reason}</p>}
              <Separator />
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Product</TableHead><TableHead>Pack Size</TableHead>
                  <TableHead className="text-right">Qty</TableHead><TableHead>Direction</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {items.map(it => (
                    <TableRow key={it.id}>
                      <TableCell className="font-medium">{(it as any).products?.name || '—'}</TableCell>
                      <TableCell>{(it as any).product_pack_sizes?.name || '—'}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{it.quantity || Math.abs(it.quantity_adjustment)}</TableCell>
                      <TableCell><StatusBadge type="movement" value={it.adjustment_type === 'increase' ? 'adjustment_in' : 'adjustment_out'} /></TableCell>
                      <TableCell className="text-right tabular-nums">{it.weight_equivalent_kg ? `${Number(it.weight_equivalent_kg).toFixed(1)}` : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {detail.status === 'draft' && (
                <div className="flex justify-end">
                  <Button onClick={() => { setDetail(null); setPostConfirm(detail); }}>Post Adjustment</Button>
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
            <AlertDialogTitle>Post Adjustment {postConfirm?.adjustment_number}?</AlertDialogTitle>
            <AlertDialogDescription>This will update inventory quantities at the depot. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handlePost(postConfirm)}>Post & Update Inventory</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
