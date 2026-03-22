import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

export default function CartList() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailCart, setDetailCart] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('carts').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setCarts(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    carts.filter(c => {
      if (search && !(c.customer_email || '').toLowerCase().includes(search.toLowerCase()) && !c.id.includes(search)) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    }), [carts, search, statusFilter]);

  async function openDetail(cart: any) {
    setDetailCart(cart);
    const { data } = await supabase.from('cart_items').select('*, products(name)').eq('cart_id', cart.id);
    setCartItems(data || []);
  }

  return (
    <PageShell title="Carts" subtitle="Active and historic shopping carts" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search by email or cart ID..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No carts found" description="Carts will appear when customers begin shopping." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Cart ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="pr-6">Created</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(c)}>
                  <TableCell className="pl-6 font-mono text-xs">{c.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-sm">{c.customer_email || '—'}</TableCell>
                  <TableCell><StatusBadge type="cart" value={c.status} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={c.total_amount} currency={c.currency_code} /></TableCell>
                  <TableCell><DateDisplay date={c.last_activity_at} showTime /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={c.created_at} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detailCart} onOpenChange={() => setDetailCart(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Cart Detail</DialogTitle></DialogHeader>
          {detailCart && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge type="cart" value={detailCart.status} /></div>
                <div><span className="text-muted-foreground">Email:</span> {detailCart.customer_email || '—'}</div>
                <div><span className="text-muted-foreground">Phone:</span> {detailCart.customer_phone || '—'}</div>
                <div><span className="text-muted-foreground">Abandoned:</span> <DateDisplay date={detailCart.abandoned_at} showTime /></div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Items</h4>
                {cartItems.length === 0 ? <p className="text-sm text-muted-foreground">No items</p> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="text-sm">{(item.products as any)?.name || '—'}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={item.unit_price} /></TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={item.line_total} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <div className="flex justify-end text-sm">
                <div className="space-y-1 text-right">
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detailCart.subtotal_amount} /></div>
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detailCart.tax_amount} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between gap-8 font-semibold"><span>Total</span><CurrencyDisplay amount={detailCart.total_amount} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
