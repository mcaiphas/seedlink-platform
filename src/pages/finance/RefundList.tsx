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
import { toast } from '@/hooks/use-toast';
import { logAudit } from '@/lib/audit';
import { RotateCcw, Plus } from 'lucide-react';

export default function RefundList() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '', credit_note_id: '', amount: 0, refund_method: 'bank_transfer', payment_reference: '', notes: '',
  });

  useEffect(() => {
    Promise.all([
      supabase.from('customer_refunds').select('*, customers(customer_name)').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, customer_name').eq('is_active', true).order('customer_name'),
      supabase.from('customer_credit_notes').select('id, credit_note_number, customer_id, total_amount').eq('status', 'issued'),
    ]).then(([{ data: r }, { data: c }, { data: cn }]) => {
      setRefunds(r || []);
      setCustomers(c || []);
      setCreditNotes(cn || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    refunds.filter(r => !search || (r.refund_number || '').toLowerCase().includes(search.toLowerCase()) || (r.customers?.customer_name || '').toLowerCase().includes(search.toLowerCase())),
  [refunds, search]);

  async function handleCreate() {
    if (!formData.customer_id || formData.amount <= 0) { toast({ title: 'Fill required fields', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: numData } = await supabase.rpc('generate_refund_number');
      const refundNumber = numData || `RF-${Date.now()}`;

      const { data } = await supabase.from('customer_refunds').insert({
        refund_number: refundNumber, customer_id: formData.customer_id,
        credit_note_id: formData.credit_note_id || null,
        amount: formData.amount, refund_method: formData.refund_method,
        payment_reference: formData.payment_reference || null,
        notes: formData.notes || null, status: 'pending',
        created_by: user?.id || null,
      }).select('*, customers(customer_name)').single();

      if (data) setRefunds(prev => [data, ...prev]);
      logAudit({ action: 'create', entity_type: 'customer_refund', entity_id: data?.id });
      toast({ title: 'Refund created' });
      setShowForm(false);
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setSaving(false);
  }

  async function processRefund(id: string) {
    await supabase.from('customer_refunds').update({ status: 'processed', updated_at: new Date().toISOString() }).eq('id', id);
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'processed' } : r));
    logAudit({ action: 'process', entity_type: 'customer_refund', entity_id: id });
    toast({ title: 'Refund processed' });
  }

  const filteredCreditNotes = creditNotes.filter(cn => cn.customer_id === formData.customer_id);

  return (
    <PageShell title="Refunds" subtitle="Manage customer refunds" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search refunds..."
      actions={<Button onClick={() => { setFormData({ customer_id: '', credit_note_id: '', amount: 0, refund_method: 'bank_transfer', payment_reference: '', notes: '' }); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" />New Refund</Button>}>
      {filtered.length === 0 ? (
        <EmptyState icon={RotateCcw} title="No refunds" description="Create refunds from credit notes." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Refund #</TableHead><TableHead>Customer</TableHead>
              <TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead><TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6 font-medium">{r.refund_number}</TableCell>
                  <TableCell>{r.customers?.customer_name || '—'}</TableCell>
                  <TableCell className="capitalize text-xs">{(r.refund_method || '').replace(/_/g, ' ')}</TableCell>
                  <TableCell><StatusBadge type="document" value={r.status} /></TableCell>
                  <TableCell><DateDisplay date={r.refund_date} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={r.amount} /></TableCell>
                  <TableCell className="text-right pr-6">
                    {r.status === 'pending' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => processRefund(r.id)}>Process</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Refund</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Customer *</Label>
              <Select value={formData.customer_id} onValueChange={v => setFormData(p => ({ ...p, customer_id: v, credit_note_id: '' }))}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Credit Note (optional)</Label>
              <Select value={formData.credit_note_id} onValueChange={v => {
                const cn = filteredCreditNotes.find(x => x.id === v);
                setFormData(p => ({ ...p, credit_note_id: v, amount: cn ? Number(cn.total_amount) : p.amount }));
              }}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select credit note" /></SelectTrigger>
                <SelectContent>{filteredCreditNotes.map(cn => <SelectItem key={cn.id} value={cn.id}>{cn.credit_note_number} — ZAR {Number(cn.total_amount).toFixed(2)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Amount *</Label><Input type="number" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: Number(e.target.value) }))} className="bg-card" /></div>
              <div><Label>Method</Label>
                <Select value={formData.refund_method} onValueChange={v => setFormData(p => ({ ...p, refund_method: v }))}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="gateway_refund">Gateway Refund</SelectItem>
                    <SelectItem value="credit_applied">Credit Applied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Payment Reference</Label><Input value={formData.payment_reference} onChange={e => setFormData(p => ({ ...p, payment_reference: e.target.value }))} className="bg-card" /></div>
            <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" rows={2} /></div>
          </div>
          <DialogFooter><Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Create Refund'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
