import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { generateDocNumber } from '@/lib/document-numbers';
import { logAudit } from '@/lib/audit';
import { CreditCard, Plus, Link2, Copy } from 'lucide-react';

export default function PaymentRequestList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '', reference_type: 'invoice', reference_id: '', amount: 0, due_date: '', notes: '', gateway_code: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('payment_requests').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, customer_name').eq('is_active', true).order('customer_name').limit(500),
    ]).then(([{ data: r }, { data: c }]) => {
      setRequests(r || []);
      setCustomers(c || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    requests.filter(r => {
      if (search && !(r.request_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    }), [requests, search, statusFilter]);

  async function handleSave() {
    if (!formData.customer_id || !formData.reference_id || formData.amount <= 0) {
      toast({ title: 'Fill all required fields', variant: 'destructive' }); return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const requestNumber = await generateDocNumber('pr');
      const paymentLink = `${window.location.origin}/pay/${requestNumber}`;

      const { data } = await supabase.from('payment_requests').insert({
        request_number: requestNumber, customer_id: formData.customer_id,
        reference_type: formData.reference_type, reference_id: formData.reference_id,
        amount: formData.amount, due_date: formData.due_date || null,
        notes: formData.notes || null, gateway_code: formData.gateway_code || null,
        payment_link: paymentLink, created_by: user?.id || null,
      }).select('*, customers(customer_name)').single();

      if (data) setRequests(prev => [data, ...prev]);
      logAudit({ action: 'create', entity_type: 'payment_request', entity_id: data?.id });
      toast({ title: 'Payment request created' });
      setShowForm(false);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('payment_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast({ title: `Request ${status}` });
  }

  function copyLink(link: string) {
    navigator.clipboard.writeText(link);
    toast({ title: 'Payment link copied' });
  }

  return (
    <PageShell title="Payment Requests" subtitle="Generate and track payment requests" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search requests..."
      actions={<Button onClick={() => { setFormData({ customer_id: '', reference_type: 'invoice', reference_id: '', amount: 0, due_date: '', notes: '', gateway_code: '' }); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" />New Request</Button>}
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payment requests" description="Generate payment requests from invoices or quotes." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Request #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6 font-medium">{r.request_number}</TableCell>
                  <TableCell>{r.customers?.customer_name || '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{r.reference_type}</Badge></TableCell>
                  <TableCell><StatusBadge type="document" value={r.status} /></TableCell>
                  <TableCell><DateDisplay date={r.due_date} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={r.amount} currency={r.currency_code} /></TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {r.payment_link && (
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => copyLink(r.payment_link)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      {r.status === 'pending' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(r.id, 'sent')}>Send</Button>
                      )}
                      {r.status === 'sent' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(r.id, 'paid')}>Mark Paid</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Payment Request</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer *</Label>
              <Select value={formData.customer_id} onValueChange={v => setFormData(p => ({ ...p, customer_id: v }))}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Reference Type</Label>
                <Select value={formData.reference_type} onValueChange={v => setFormData(p => ({ ...p, reference_type: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="proforma">Proforma</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reference ID *</Label>
                <Input value={formData.reference_id} onChange={e => setFormData(p => ({ ...p, reference_id: e.target.value }))} className="bg-card" placeholder="Document ID" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount *</Label>
                <Input type="number" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: Number(e.target.value) }))} className="bg-card" />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={formData.due_date} onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))} className="bg-card" />
              </div>
            </div>
            <div>
              <Label>Payment Gateway</Label>
              <Select value={formData.gateway_code} onValueChange={v => setFormData(p => ({ ...p, gateway_code: v }))}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select gateway" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="payfast">PayFast</SelectItem>
                  <SelectItem value="paygate">PayGate</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="eft">EFT / Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Request'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
