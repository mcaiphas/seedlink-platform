import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Plus, Filter } from 'lucide-react';

export default function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderPayments, setOrderPayments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      setOrders(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (search && !(o.order_number || '').toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
      if (sourceFilter !== 'all' && o.order_source !== sourceFilter) return false;
      if (paymentFilter !== 'all' && o.payment_status !== paymentFilter) return false;
      return true;
    });
  }, [orders, search, sourceFilter, paymentFilter]);

  async function openDetail(order: any) {
    setDetailOrder(order);
    const [{ data: items }, { data: payments }] = await Promise.all([
      supabase.from('order_items').select('*').eq('order_id', order.id),
      supabase.from('payments').select('*').eq('order_id', order.id),
    ]);
    setOrderItems(items || []);
    setOrderPayments(payments || []);
  }

  return (
    <PageShell
      title="Orders"
      subtitle="Manage customer orders across all channels"
      loading={loading}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by order number..."
      filters={
        <div className="flex gap-2">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="online_store">Online Store</SelectItem>
              <SelectItem value="customer_service">Customer Service</SelectItem>
              <SelectItem value="abandoned_cart_recovery">Cart Recovery</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No orders found" description="Orders will appear here once created." />
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Order #</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(o)}>
                    <TableCell className="pl-6 font-medium">{o.order_number || o.id.slice(0, 8)}</TableCell>
                    <TableCell><StatusBadge type="order_source" value={o.order_source} /></TableCell>
                    <TableCell><StatusBadge type="approval" value={o.approval_status} /></TableCell>
                    <TableCell><StatusBadge type="payment" value={o.payment_status} /></TableCell>
                    <TableCell><StatusBadge type="fulfillment" value={o.fulfillment_status} /></TableCell>
                    <TableCell>
                      {o.invoice_generated ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Generated</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">—</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={o.total_amount} currency={o.currency_code} /></TableCell>
                    <TableCell className="text-right pr-6"><DateDisplay date={o.created_at} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Order {detailOrder?.order_number || detailOrder?.id?.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground">Source</p><StatusBadge type="order_source" value={detailOrder.order_source} /></div>
                <div><p className="text-xs text-muted-foreground">Approval</p><StatusBadge type="approval" value={detailOrder.approval_status} /></div>
                <div><p className="text-xs text-muted-foreground">Payment</p><StatusBadge type="payment" value={detailOrder.payment_status} /></div>
                <div><p className="text-xs text-muted-foreground">Fulfillment</p><StatusBadge type="fulfillment" value={detailOrder.fulfillment_status} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Created:</span> <DateDisplay date={detailOrder.created_at} showTime /></div>
                <div><span className="text-muted-foreground">Invoice Generated:</span> {detailOrder.invoice_generated ? 'Yes' : 'No'}</div>
                {detailOrder.approved_at && <div><span className="text-muted-foreground">Approved:</span> <DateDisplay date={detailOrder.approved_at} showTime /></div>}
                {detailOrder.cart_id && <div><span className="text-muted-foreground">Cart ID:</span> {detailOrder.cart_id.slice(0, 8)}...</div>}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items</p>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_name || item.description || '—'}</TableCell>
                          <TableCell className="text-right">{item.quantity} {item.quantity_uom}</TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={item.unit_price} /></TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={item.line_total} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="flex justify-end">
                <div className="space-y-1 text-right text-sm">
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detailOrder.subtotal_amount} currency={detailOrder.currency_code} /></div>
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detailOrder.tax_amount} currency={detailOrder.currency_code} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between gap-8 font-semibold"><span>Total</span><CurrencyDisplay amount={detailOrder.total_amount} currency={detailOrder.currency_code} /></div>
                </div>
              </div>

              {orderPayments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Payments</h4>
                    <Table>
                      <TableHeader><TableRow><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Reference</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {orderPayments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="capitalize">{p.payment_method?.replace(/_/g, ' ')}</TableCell>
                            <TableCell><StatusBadge type="payment" value={p.payment_status} /></TableCell>
                            <TableCell className="text-sm">{p.payment_reference || '—'}</TableCell>
                            <TableCell className="text-right"><CurrencyDisplay amount={p.amount} currency={p.currency_code} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
