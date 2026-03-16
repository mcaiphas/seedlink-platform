import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Eye, ArrowRight, Filter } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  abandoned: { label: 'Abandoned', variant: 'destructive' },
  converted: { label: 'Converted', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'outline' },
};

export default function CartList() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [converting, setConverting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('carts').select('*, profiles(full_name)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = async (cart: any) => {
    setSelected(cart);
    setDetailOpen(true);
    const { data: items } = await supabase.from('cart_items').select('*, products(name)').eq('cart_id', cart.id);
    setCartItems(items || []);
  };

  const convertToOrder = async () => {
    if (!selected) return;
    setConverting(true);
    const subtotal = Number(selected.subtotal_amount || 0);
    const tax = Number(selected.tax_amount || 0);
    const total = Number(selected.total_amount || 0);

    const { data: ord, error } = await supabase.from('orders').insert({
      cart_id: selected.id, user_id: selected.user_id,
      order_source: selected.status === 'abandoned' ? 'abandoned_cart_recovery' : 'online_store',
      subtotal_amount: subtotal, tax_amount: tax, total_amount: total,
      currency_code: selected.currency_code, payment_status: 'pending',
      fulfillment_status: 'draft', approval_status: 'pending',
      invoice_generated: false,
    }).select().single();

    if (error || !ord) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setConverting(false); return; }

    // Copy cart items to order items
    if (cartItems.length > 0) {
      const orderItems = cartItems.map(ci => ({
        order_id: ord.id, product_id: ci.product_id,
        product_name: (ci.products as any)?.name || 'Product',
        quantity: ci.quantity, unit_price: ci.unit_price, line_total: ci.line_total,
      }));
      await supabase.from('order_items').insert(orderItems);
    }

    // Update cart
    await supabase.from('carts').update({
      status: 'converted', cart_status: 'converted',
      converted_order_id: ord.id, recovered_by: user?.id,
    }).eq('id', selected.id);

    toast({ title: 'Cart converted to order' });
    setConverting(false);
    setDetailOpen(false);
    load();
  };

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        (r.customer_email || '').toLowerCase().includes(s) ||
        ((r.profiles as any)?.full_name || '').toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    return result;
  }, [data, search, statusFilter]);

  const stats = useMemo(() => ({
    active: data.filter(d => d.status === 'active').length,
    abandoned: data.filter(d => d.status === 'abandoned').length,
    converted: data.filter(d => d.status === 'converted').length,
    totalValue: data.filter(d => d.status === 'active').reduce((s, d) => s + Number(d.total_amount || 0), 0),
  }), [data]);

  return (
    <DataPageShell title="Carts" description={`${filtered.length} carts`} loading={loading}
      searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by email or customer...">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{stats.active}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Abandoned</p><p className="text-2xl font-bold text-destructive">{stats.abandoned}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Converted</p><p className="text-2xl font-bold">{stats.converted}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Active Value</p><p className="text-2xl font-bold">ZAR {stats.totalValue.toFixed(2)}</p></CardContent></Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cart ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => openDetail(row)}>
                <TableCell><span className="font-mono text-xs">{row.id.slice(0, 8)}</span></TableCell>
                <TableCell>{(row.profiles as any)?.full_name || '—'}</TableCell>
                <TableCell className="text-sm">{row.customer_email || '—'}</TableCell>
                <TableCell><Badge variant={STATUS_MAP[row.status]?.variant || 'outline'}>{STATUS_MAP[row.status]?.label || row.status}</Badge></TableCell>
                <TableCell className="text-right font-medium">{row.currency_code} {Number(row.total_amount).toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.last_activity_at ? new Date(row.last_activity_at).toLocaleString() : '—'}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <EmptyState message="No carts found" colSpan={7} />}
          </TableBody>
        </Table>
      </div>

      {/* Detail */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Cart Detail</DialogTitle>
            <DialogDescription>Cart {selected?.id?.slice(0, 8)}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Status</p><Badge variant={STATUS_MAP[selected.status]?.variant || 'outline'}>{STATUS_MAP[selected.status]?.label || selected.status}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{(selected.profiles as any)?.full_name || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm">{selected.customer_email || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm">{selected.customer_phone || '—'}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xs text-muted-foreground">Subtotal</p><p className="font-medium">{selected.currency_code} {Number(selected.subtotal_amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Tax</p><p className="font-medium">{selected.currency_code} {Number(selected.tax_amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-primary">{selected.currency_code} {Number(selected.total_amount).toFixed(2)}</p></div>
              </div>
              {selected.abandoned_at && (
                <div className="bg-destructive/10 rounded p-3 text-sm"><span className="font-medium text-destructive">Abandoned:</span> {new Date(selected.abandoned_at).toLocaleString()}</div>
              )}
              {selected.recovery_notes && <div className="bg-muted/50 rounded p-3 text-sm"><span className="font-medium">Recovery Notes:</span> {selected.recovery_notes}</div>}

              <Separator />
              <h4 className="font-semibold">Cart Items ({cartItems.length})</h4>
              <div className="rounded border overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cartItems.map(ci => (
                      <TableRow key={ci.id}>
                        <TableCell className="font-medium">{(ci.products as any)?.name || '—'}</TableCell>
                        <TableCell className="text-right">{ci.quantity}</TableCell>
                        <TableCell className="text-right">{Number(ci.unit_price).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">{Number(ci.line_total).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {(selected.status === 'active' || selected.status === 'abandoned') && (
                <div className="flex gap-2">
                  <Button onClick={convertToOrder} disabled={converting} className="gap-1">
                    <ArrowRight className="h-4 w-4" /> Convert to Order
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
