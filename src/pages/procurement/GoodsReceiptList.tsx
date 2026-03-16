import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus, PackageCheck } from 'lucide-react';

export default function GoodsReceiptList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QueryStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [form, setForm] = useState({ receipt_number: '', supplier_id: '', depot_id: '', purchase_order_id: '', receipt_date: new Date().toISOString().split('T')[0], notes: '', status: 'received' });

  const load = async () => {
    setLoading(true);
    const [grR, sR, dR, poR] = await Promise.all([
      supabase.from('goods_receipts').select('*, suppliers(supplier_name), depots(name), purchase_orders(po_number)').order('created_at', { ascending: false }).limit(500),
      supabase.from('suppliers').select('id, supplier_name').order('supplier_name'),
      supabase.from('depots').select('id, name').order('name'),
      supabase.from('purchase_orders').select('id, po_number, supplier_id').order('created_at', { ascending: false }).limit(200),
    ]);
    if (grR.error) { const c = classifyError(grR.error); setStatus(c.status); setErrorMsg(c.message); setData([]); }
    else { setStatus(grR.data?.length ? 'success' : 'empty'); setData(grR.data || []); }
    setSuppliers(sR.data || []); setDepots(dR.data || []); setPos(poR.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = data.filter(r => !search || r.receipt_number?.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => {
    setForm({ receipt_number: `GR-${Date.now().toString(36).toUpperCase()}`, supplier_id: '', depot_id: '', purchase_order_id: '', receipt_date: new Date().toISOString().split('T')[0], notes: '', status: 'received' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.receipt_number) { toast({ title: 'Receipt number required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload: any = { receipt_number: form.receipt_number, supplier_id: form.supplier_id || null, depot_id: form.depot_id || null, purchase_order_id: form.purchase_order_id || null, receipt_date: form.receipt_date, notes: form.notes || null, status: form.status };
    const { error } = await supabase.from('goods_receipts').insert(payload);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    toast({ title: 'Goods receipt created' }); setSaving(false); setDialogOpen(false); load();
  };

  return (
    <AdminPage>
      <DataPageShell title="Goods Receipts" description={`${filtered.length} receipts`} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search receipts..." action={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />New Receipt</Button>}>
        {status !== 'success' && status !== 'loading' && status !== 'empty' && <QueryStatusBanner status={status} message={errorMsg || undefined} tableName="goods_receipts" />}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Receipt #</TableHead><TableHead>PO #</TableHead><TableHead>Supplier</TableHead><TableHead>Depot</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell><span className="font-medium font-mono text-primary">{r.receipt_number}</span></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{(r.purchase_orders as any)?.po_number || '—'}</TableCell>
                  <TableCell>{(r.suppliers as any)?.supplier_name || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{(r.depots as any)?.name || '—'}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{r.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.receipt_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <EmptyState message="No goods receipts found" colSpan={6} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Goods Receipt</DialogTitle><DialogDescription>Receive goods against a purchase order or ad-hoc.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Receipt Number</Label><Input value={form.receipt_number} onChange={e => setForm(f => ({ ...f, receipt_number: e.target.value }))} className="font-mono" /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.receipt_date} onChange={e => setForm(f => ({ ...f, receipt_date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Purchase Order</Label>
                <Select value={form.purchase_order_id || '__none'} onValueChange={v => setForm(f => ({ ...f, purchase_order_id: v === '__none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to PO" /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">None</SelectItem>{pos.map(p => <SelectItem key={p.id} value={p.id}>{p.po_number}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Supplier</Label>
                <Select value={form.supplier_id || '__none'} onValueChange={v => setForm(f => ({ ...f, supplier_id: v === '__none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">None</SelectItem>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Depot</Label>
                <Select value={form.depot_id || '__none'} onValueChange={v => setForm(f => ({ ...f, depot_id: v === '__none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">None</SelectItem>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="received">Received</SelectItem><SelectItem value="partial">Partial</SelectItem><SelectItem value="inspecting">Inspecting</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Receipt'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
