import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Eye, ArrowRight, Phone, Mail, MessageSquare, Plus } from 'lucide-react';

export default function AbandonedCartList() {
  const { user } = useAuth();
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [followupOpen, setFollowupOpen] = useState(false);
  const [fChannel, setFChannel] = useState('email');
  const [fNotes, setFNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('carts').select('*, profiles(full_name)')
      .eq('status', 'abandoned').order('abandoned_at', { ascending: false });
    setCarts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = async (cart: any) => {
    setSelected(cart);
    setDetailOpen(true);
    const [items, fups] = await Promise.all([
      supabase.from('cart_items').select('*, products(name)').eq('cart_id', cart.id),
      supabase.from('abandoned_cart_followups').select('*').eq('cart_id', cart.id).order('created_at', { ascending: false }),
    ]);
    setCartItems(items.data || []);
    setFollowups(fups.data || []);
  };

  const createFollowup = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase.from('abandoned_cart_followups').insert({
      cart_id: selected.id, followup_channel: fChannel, followup_status: 'completed',
      contact_target: fChannel === 'email' ? selected.customer_email : selected.customer_phone,
      notes: fNotes || null, performed_at: new Date().toISOString(), performed_by: user?.id,
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else { toast({ title: 'Follow-up logged' }); setFollowupOpen(false); setFNotes(''); openDetail(selected); }
    setSaving(false);
  };

  const convertToOrder = async () => {
    if (!selected) return;
    setSaving(true);
    const { data: ord, error } = await supabase.from('orders').insert({
      cart_id: selected.id, user_id: selected.user_id,
      order_source: 'abandoned_cart_recovery',
      subtotal_amount: selected.subtotal_amount, tax_amount: selected.tax_amount,
      total_amount: selected.total_amount, currency_code: selected.currency_code,
      payment_status: 'pending', fulfillment_status: 'draft', approval_status: 'pending',
      invoice_generated: false, notes: 'Recovered from abandoned cart',
    }).select().single();
    if (error || !ord) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setSaving(false); return; }
    if (cartItems.length > 0) {
      await supabase.from('order_items').insert(cartItems.map(ci => ({
        order_id: ord.id, product_id: ci.product_id,
        product_name: (ci.products as any)?.name || 'Product',
        quantity: ci.quantity, unit_price: ci.unit_price, line_total: ci.line_total,
      })));
    }
    await supabase.from('carts').update({
      status: 'converted', cart_status: 'converted',
      converted_order_id: ord.id, recovered_by: user?.id,
    }).eq('id', selected.id);
    toast({ title: 'Abandoned cart recovered and converted to order' });
    setSaving(false);
    setDetailOpen(false);
    load();
  };

  const filtered = useMemo(() => {
    if (!search) return carts;
    const s = search.toLowerCase();
    return carts.filter(c =>
      (c.customer_email || '').toLowerCase().includes(s) ||
      ((c.profiles as any)?.full_name || '').toLowerCase().includes(s)
    );
  }, [carts, search]);

  const totalValue = useMemo(() => carts.reduce((s, c) => s + Number(c.total_amount || 0), 0), [carts]);

  return (
    <DataPageShell title="Abandoned Carts" description={`${carts.length} abandoned carts · ZAR ${totalValue.toFixed(2)} potential revenue`}
      loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by email or customer...">

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Abandoned Carts</p><p className="text-2xl font-bold text-destructive">{carts.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Potential Revenue</p><p className="text-2xl font-bold">ZAR {totalValue.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Avg Cart Value</p><p className="text-2xl font-bold">ZAR {carts.length > 0 ? (totalValue / carts.length).toFixed(2) : '0.00'}</p></CardContent></Card>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Cart Value</TableHead>
              <TableHead>Abandoned</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => openDetail(row)}>
                <TableCell className="font-medium">{(row.profiles as any)?.full_name || '—'}</TableCell>
                <TableCell className="text-sm">{row.customer_email || '—'}</TableCell>
                <TableCell className="text-sm">{row.customer_phone || '—'}</TableCell>
                <TableCell className="text-right font-medium">{row.currency_code} {Number(row.total_amount).toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.abandoned_at ? new Date(row.abandoned_at).toLocaleString() : '—'}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <EmptyState message="No abandoned carts" colSpan={6} />}
          </TableBody>
        </Table>
      </div>

      {/* Detail */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-destructive" /> Abandoned Cart Recovery</DialogTitle>
            <DialogDescription>Cart {selected?.id?.slice(0, 8)} — {selected?.customer_email || 'No email'}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{(selected.profiles as any)?.full_name || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Cart Value</p><p className="text-lg font-bold text-primary">{selected.currency_code} {Number(selected.total_amount).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm">{selected.customer_email || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm">{selected.customer_phone || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Abandoned At</p><p className="text-sm text-destructive">{selected.abandoned_at ? new Date(selected.abandoned_at).toLocaleString() : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Last Activity</p><p className="text-sm">{selected.last_activity_at ? new Date(selected.last_activity_at).toLocaleString() : '—'}</p></div>
              </div>

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

              <Separator />
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Follow-up History ({followups.length})</h4>
                <Button variant="outline" size="sm" onClick={() => setFollowupOpen(true)}><Plus className="h-3 w-3 mr-1" /> Log Follow-up</Button>
              </div>
              {followups.length > 0 ? (
                <div className="space-y-2">
                  {followups.map(f => (
                    <div key={f.id} className="flex items-start justify-between bg-muted/50 rounded p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {f.followup_channel === 'email' && <Mail className="h-3.5 w-3.5 text-muted-foreground" />}
                          {f.followup_channel === 'phone' && <Phone className="h-3.5 w-3.5 text-muted-foreground" />}
                          {f.followup_channel === 'sms' && <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />}
                          <span className="text-sm font-medium capitalize">{f.followup_channel}</span>
                          <Badge variant="outline" className="text-xs">{f.followup_status}</Badge>
                        </div>
                        {f.notes && <p className="text-xs text-muted-foreground mt-1">{f.notes}</p>}
                        {f.contact_target && <p className="text-xs text-muted-foreground">→ {f.contact_target}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground">{f.performed_at ? new Date(f.performed_at).toLocaleString() : '—'}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No follow-ups recorded yet</p>}

              <Separator />
              <div className="flex gap-2">
                <Button onClick={convertToOrder} disabled={saving} className="gap-1"><ArrowRight className="h-4 w-4" /> Convert to Order</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followupOpen} onOpenChange={setFollowupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Follow-up Action</DialogTitle>
            <DialogDescription>Record a recovery attempt for this abandoned cart</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Channel</Label>
              <Select value={fChannel} onValueChange={setFChannel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Describe the follow-up action..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowupOpen(false)}>Cancel</Button>
            <Button onClick={createFollowup} disabled={saving}>Log Follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
