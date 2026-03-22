import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Plus, Send, CheckCircle, XCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function PurchaseOrderList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<string, string>>({});
  const [actionConfirm, setActionConfirm] = useState<{ po: any; action: string } | null>(null);

  const fetchData = async () => {
    const [{ data: pos }, { data: sups }] = await Promise.all([
      supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('suppliers').select('id, supplier_name'),
    ]);
    setOrders(pos || []);
    setSupplierMap(Object.fromEntries((sups || []).map(s => [s.id, s.supplier_name])));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    orders.filter(o => {
      if (search && !(o.po_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      return true;
    }), [orders, search, statusFilter]);

  async function openDetail(po: any) {
    setDetail(po);
    const { data } = await supabase.from('purchase_order_items').select('*, products(name), product_pack_sizes(name)').eq('purchase_order_id', po.id);
    setItems(data || []);
  }

  async function handleAction() {
    if (!actionConfirm) return;
    const { po, action } = actionConfirm;
    let update: any = {};
    if (action === 'approve') update = { status: 'approved', approved_by: user?.id, approved_at: new Date().toISOString() };
    else if (action === 'send') update = { status: 'sent', sent_at: new Date().toISOString() };
    else if (action === 'cancel') update = { status: 'cancelled' };

    const { error } = await supabase.from('purchase_orders').update(update).eq('id', po.id);
    if (error) { toast.error(error.message); } else { toast.success(`PO ${po.po_number} ${action}d`); }
    setActionConfirm(null);
    setDetail(null);
    fetchData();
  }

  return (
    <PageShell title="Purchase Orders" subtitle="Procurement orders and approval workflow" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search PO number..."
      actions={<Button size="sm" onClick={() => navigate('/purchase-orders/new')}><Plus className="h-4 w-4 mr-1" /> New PO</Button>}
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="partially_received">Partial</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="No purchase orders" description="Create your first purchase order." action={<Button size="sm" onClick={() => navigate('/purchase-orders/new')}>New PO</Button>} />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">PO #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead className="text-right pr-6">Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(o)}>
                  <TableCell className="pl-6 font-medium font-mono">{o.po_number}</TableCell>
                  <TableCell className="text-sm">{supplierMap[o.supplier_id] || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={o.status} /></TableCell>
                  <TableCell><DateDisplay date={o.order_date} /></TableCell>
                  <TableCell><DateDisplay date={o.expected_date} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={o.total_amount} currency={o.currency_code} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>PO {detail?.po_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Supplier</p><span>{supplierMap[detail.supplier_id] || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Order Date</p><DateDisplay date={detail.order_date} /></div>
                <div><p className="text-xs text-muted-foreground">Expected</p><DateDisplay date={detail.expected_date} /></div>
              </div>
              {detail.notes && <p className="text-sm text-muted-foreground border rounded-lg p-3">{detail.notes}</p>}
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Pack Size</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {items.map(it => (
                      <TableRow key={it.id}>
                        <TableCell>{(it as any).products?.name || it.product_description || '—'}</TableCell>
                        <TableCell>{(it as any).product_pack_sizes?.name || '—'}</TableCell>
                        <TableCell className="text-right tabular-nums">{it.quantity} {it.quantity_uom}</TableCell>
                        <TableCell className="text-right tabular-nums">{it.quantity_received || 0}</TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={it.unit_price} /></TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={it.line_total} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {detail.status === 'draft' && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/purchase-orders/${detail.id}/edit`)}>Edit</Button>
                  )}
                  {(detail.status === 'submitted' || detail.status === 'pending') && (
                    <Button size="sm" onClick={() => setActionConfirm({ po: detail, action: 'approve' })} className="gap-1"><CheckCircle className="h-3.5 w-3.5" />Approve</Button>
                  )}
                  {detail.status === 'approved' && (
                    <Button size="sm" onClick={() => setActionConfirm({ po: detail, action: 'send' })} className="gap-1"><Send className="h-3.5 w-3.5" />Send to Supplier</Button>
                  )}
                  {!['cancelled', 'received', 'fully_received'].includes(detail.status) && (
                    <Button variant="destructive" size="sm" onClick={() => setActionConfirm({ po: detail, action: 'cancel' })} className="gap-1"><XCircle className="h-3.5 w-3.5" />Cancel</Button>
                  )}
                  {['approved', 'sent', 'partially_received'].includes(detail.status) && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/goods-receiving?po=${detail.id}`)}>Receive Goods</Button>
                  )}
                </div>
                <div className="space-y-1 text-right text-sm">
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detail.subtotal_amount} currency={detail.currency_code} /></div>
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detail.tax_amount} currency={detail.currency_code} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between gap-8 font-semibold"><span>Total</span><CurrencyDisplay amount={detail.total_amount} currency={detail.currency_code} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!actionConfirm} onOpenChange={() => setActionConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {actionConfirm?.action}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionConfirm?.action} PO {actionConfirm?.po?.po_number}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
