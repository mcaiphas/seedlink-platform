import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, Plus } from 'lucide-react';

export default function AbandonedCartList() {
  const { user } = useAuth();
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailCart, setDetailCart] = useState<any>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [showFollowup, setShowFollowup] = useState(false);
  const [followupChannel, setFollowupChannel] = useState('email');
  const [followupNotes, setFollowupNotes] = useState('');

  useEffect(() => {
    supabase.from('carts').select('*').eq('status', 'abandoned').order('abandoned_at', { ascending: false }).limit(200)
      .then(({ data }) => { setCarts(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    carts.filter(c => !search || (c.customer_email || '').toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)),
    [carts, search]);

  async function openDetail(cart: any) {
    setDetailCart(cart);
    const { data } = await supabase.from('abandoned_cart_followups').select('*').eq('cart_id', cart.id).order('created_at', { ascending: false });
    setFollowups(data || []);
  }

  async function createFollowup() {
    if (!detailCart || !user) return;
    const { error } = await supabase.from('abandoned_cart_followups').insert({
      cart_id: detailCart.id,
      followup_channel: followupChannel,
      followup_status: 'completed',
      notes: followupNotes,
      performed_by: user.id,
      performed_at: new Date().toISOString(),
      contact_target: detailCart.customer_email || detailCart.customer_phone,
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Follow-up logged' });
    setShowFollowup(false);
    setFollowupNotes('');
    openDetail(detailCart);
  }

  return (
    <PageShell title="Abandoned Carts" subtitle="Recover abandoned carts and track follow-up actions" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search by email...">
      {filtered.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No abandoned carts" description="Abandoned carts will appear here for recovery." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Cart Value</TableHead>
              <TableHead>Abandoned</TableHead>
              <TableHead className="pr-6">Recovery</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(c)}>
                  <TableCell className="pl-6">{c.customer_email || <span className="text-muted-foreground">No email</span>}</TableCell>
                  <TableCell className="text-sm">{c.customer_phone || '—'}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={c.total_amount} currency={c.currency_code} /></TableCell>
                  <TableCell><DateDisplay date={c.abandoned_at} showTime /></TableCell>
                  <TableCell className="pr-6">
                    {c.recovered_by ? <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Recovered</Badge> : <Badge variant="outline" className="text-xs text-muted-foreground">Pending</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detailCart} onOpenChange={() => setDetailCart(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Abandoned Cart Recovery</DialogTitle></DialogHeader>
          {detailCart && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> {detailCart.customer_email || '—'}</div>
                <div><span className="text-muted-foreground">Phone:</span> {detailCart.customer_phone || '—'}</div>
                <div><span className="text-muted-foreground">Value:</span> <CurrencyDisplay amount={detailCart.total_amount} currency={detailCart.currency_code} /></div>
                <div><span className="text-muted-foreground">Abandoned:</span> <DateDisplay date={detailCart.abandoned_at} showTime /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Follow-up History</h4>
                <Button size="sm" variant="outline" onClick={() => setShowFollowup(true)}><Plus className="h-3 w-3 mr-1" /> Log Follow-up</Button>
              </div>
              {followups.length === 0 ? <p className="text-sm text-muted-foreground">No follow-ups recorded</p> : (
                <div className="space-y-2">
                  {followups.map(f => (
                    <div key={f.id} className="rounded-lg border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize text-xs">{f.followup_channel?.replace(/_/g, ' ')}</Badge>
                        <DateDisplay date={f.performed_at || f.created_at} showTime />
                      </div>
                      {f.notes && <p className="mt-1 text-muted-foreground">{f.notes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {showFollowup && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label>Channel</Label>
                    <Select value={followupChannel} onValueChange={setFollowupChannel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="phone_call">Phone Call</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label>Notes</Label>
                    <Textarea value={followupNotes} onChange={e => setFollowupNotes(e.target.value)} placeholder="Follow-up notes..." />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setShowFollowup(false)}>Cancel</Button>
                      <Button size="sm" onClick={createFollowup}>Save Follow-up</Button>
                    </div>
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
