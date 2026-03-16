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
import { DollarSign, Plus } from 'lucide-react';

export default function SupplierPaymentList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ supplier_id: '', supplier_invoice_id: '', amount: 0, payment_method: 'bank_transfer', payment_reference: '', notes: '' });

  useEffect(() => {
    Promise.all([
      supabase.from('supplier_payments').select('*, suppliers(supplier_name)').order('created_at', { ascending: false }),
      supabase.from('suppliers').select('id, supplier_name').eq('is_active', true).order('supplier_name'),
      supabase.from('supplier_invoices').select('id, supplier_invoice_number, supplier_id, total_amount, paid_amount, status').in('status', ['posted', 'approved', 'pending']),
    ]).then(([{ data: p }, { data: s }, { data: inv }]) => {
      setPayments(p || []);
      setSuppliers(s || []);
      setSupplierInvoices(inv || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    payments.filter(p => !search || (p.payment_number || '').toLowerCase().includes(search.toLowerCase()) || (p.suppliers?.supplier_name || '').toLowerCase().includes(search.toLowerCase())),
  [payments, search]);

  const filteredInvoices = supplierInvoices.filter(i => i.supplier_id === formData.supplier_id);

  async function handleCreate() {
    if (!formData.supplier_id || formData.amount <= 0) { toast({ title: 'Provide supplier and amount', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: numData } = await supabase.rpc('generate_sp_number');
      const spNumber = numData || `SP-${Date.now()}`;

      const { data: newPay } = await supabase.from('supplier_payments').insert({
        payment_number: spNumber, supplier_id: formData.supplier_id,
        supplier_invoice_id: formData.supplier_invoice_id || null, amount: formData.amount,
        payment_method: formData.payment_method, payment_reference: formData.payment_reference || null,
        notes: formData.notes || null, payment_status: 'paid', created_by: user?.id || null,
      } as any).select('*, suppliers(supplier_name)').single();

      // Update supplier invoice paid_amount if linked
      if (newPay && formData.supplier_invoice_id) {
        const inv = supplierInvoices.find(i => i.id === formData.supplier_invoice_id);
        if (inv) {
          const newPaid = Number(inv.paid_amount || 0) + formData.amount;
          const newStatus = newPaid >= Number(inv.total_amount) ? 'paid' : inv.status;
          await supabase.from('supplier_invoices').update({ paid_amount: newPaid, status: newStatus, updated_at: new Date().toISOString() }).eq('id', inv.id);
        }
      }

      if (newPay) {
        setPayments(prev => [newPay, ...prev]);
        logAudit({ action: 'create', entity_type: 'supplier_payment', entity_id: newPay.id, new_values: { amount: formData.amount } });
      }
      toast({ title: 'Payment recorded' });
      setShowCreate(false);
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setSaving(false);
  }

  return (
    <PageShell title="Supplier Payments" subtitle="Record and track payments to suppliers" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search payments..."
      actions={<Button onClick={() => { setFormData({ supplier_id: '', supplier_invoice_id: '', amount: 0, payment_method: 'bank_transfer', payment_reference: '', notes: '' }); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" />Record Payment</Button>}>
      {filtered.length === 0 ? (
        <EmptyState icon={DollarSign} title="No supplier payments" description="Record payments to suppliers." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Payment #</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead>
              <TableHead>Date</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right pr-6">Reference</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="pl-6 font-medium">{p.payment_number}</TableCell>
                  <TableCell>{p.suppliers?.supplier_name || '—'}</TableCell>
                  <TableCell><StatusBadge type="payment" value={p.payment_status} /></TableCell>
                  <TableCell><DateDisplay date={p.payment_date} /></TableCell>
                  <TableCell className="capitalize text-xs">{(p.payment_method || '').replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={p.amount} currency={p.currency_code} /></TableCell>
                  <TableCell className="text-right pr-6 font-mono text-xs">{p.payment_reference || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record Supplier Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Supplier *</Label>
              <Select value={formData.supplier_id} onValueChange={v => setFormData(p => ({ ...p, supplier_id: v, supplier_invoice_id: '' }))}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Invoice (optional)</Label>
              <Select value={formData.supplier_invoice_id} onValueChange={v => {
                const inv = supplierInvoices.find(i => i.id === v);
                const outstanding = inv ? Number(inv.total_amount) - Number(inv.paid_amount || 0) : 0;
                setFormData(p => ({ ...p, supplier_invoice_id: v, amount: outstanding }));
              }}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select invoice" /></SelectTrigger>
                <SelectContent>{filteredInvoices.map(i => <SelectItem key={i.id} value={i.id}>{i.supplier_invoice_number} ({<CurrencyDisplay amount={Number(i.total_amount) - Number(i.paid_amount || 0)} />})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Amount *</Label><Input type="number" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: Number(e.target.value) }))} className="bg-card" /></div>
            <div><Label>Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={v => setFormData(p => ({ ...p, payment_method: v }))}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Reference</Label><Input value={formData.payment_reference} onChange={e => setFormData(p => ({ ...p, payment_reference: e.target.value }))} className="bg-card" /></div>
            <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" /></div>
          </div>
          <DialogFooter><Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Record Payment'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
