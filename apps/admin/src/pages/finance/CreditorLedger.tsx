import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export default function CreditorLedger() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('suppliers').select('id, supplier_name, supplier_code, currency_code').eq('is_active', true).order('supplier_name'),
      supabase.from('supplier_invoices').select('id, supplier_invoice_number, supplier_id, invoice_date, due_date, total_amount, paid_amount, status, currency_code').in('status', ['posted', 'approved', 'paid', 'pending']).order('invoice_date', { ascending: false }),
      supabase.from('supplier_payments').select('id, payment_number, supplier_id, supplier_invoice_id, amount, payment_status, payment_date').eq('payment_status', 'paid'),
      supabase.from('supplier_credit_notes').select('id, credit_note_number, supplier_id, total_amount, status, issue_date').eq('status', 'issued'),
    ]).then(([{ data: s }, { data: inv }, { data: pay }, { data: cn }]) => {
      setSuppliers(s || []);
      setInvoices(inv || []);
      setPayments(pay || []);
      setCreditNotes(cn || []);
      setLoading(false);
    });
  }, []);

  const creditorSummary = useMemo(() => {
    return suppliers.map(sup => {
      const supInv = invoices.filter(i => i.supplier_id === sup.id);
      const supPay = payments.filter(p => p.supplier_id === sup.id);
      const supCn = creditNotes.filter(cn => cn.supplier_id === sup.id);
      const totalInvoiced = supInv.reduce((s, i) => s + Number(i.total_amount || 0), 0);
      const totalPaid = supPay.reduce((s, p) => s + Number(p.amount || 0), 0);
      const totalCredits = supCn.reduce((s, cn) => s + Number(cn.total_amount || 0), 0);
      const balance = totalInvoiced - totalPaid - totalCredits;
      const overdue = supInv.filter(i => i.due_date && new Date(i.due_date) < new Date() && i.status !== 'paid').reduce((s, i) => s + Number(i.total_amount || 0) - Number(i.paid_amount || 0), 0);
      return { ...sup, totalInvoiced, totalPaid, totalCredits, balance, overdue, invoiceCount: supInv.length };
    }).filter(s => s.invoiceCount > 0 || s.balance !== 0);
  }, [suppliers, invoices, payments, creditNotes]);

  const filtered = useMemo(() =>
    creditorSummary.filter(c => !search || c.supplier_name.toLowerCase().includes(search.toLowerCase())),
  [creditorSummary, search]);

  const totalOutstanding = filtered.reduce((s, c) => s + c.balance, 0);
  const totalOverdue = filtered.reduce((s, c) => s + c.overdue, 0);

  const ledgerEntries = useMemo(() => {
    if (!selectedSupplier) return [];
    const entries: any[] = [];
    invoices.filter(i => i.supplier_id === selectedSupplier).forEach(i => {
      entries.push({ date: i.invoice_date, type: 'Invoice', ref: i.supplier_invoice_number, debit: 0, credit: Number(i.total_amount) });
    });
    payments.filter(p => p.supplier_id === selectedSupplier).forEach(p => {
      entries.push({ date: p.payment_date, type: 'Payment', ref: p.payment_number, debit: Number(p.amount), credit: 0 });
    });
    creditNotes.filter(cn => cn.supplier_id === selectedSupplier).forEach(cn => {
      entries.push({ date: cn.issue_date, type: 'Credit Note', ref: cn.credit_note_number, debit: Number(cn.total_amount), credit: 0 });
    });
    entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    let running = 0;
    return entries.map(e => { running += e.credit - e.debit; return { ...e, balance: running }; });
  }, [selectedSupplier, invoices, payments, creditNotes]);

  const selectedName = suppliers.find(s => s.id === selectedSupplier)?.supplier_name;

  return (
    <PageShell title="Creditors (Accounts Payable)" subtitle="Supplier outstanding balances and ledger" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search suppliers...">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Payable</p><p className="text-2xl font-bold"><CurrencyDisplay amount={totalOutstanding} /></p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Overdue</p><p className="text-2xl font-bold text-destructive"><CurrencyDisplay amount={totalOverdue} /></p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active Creditors</p><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
      </div>

      {selectedSupplier ? (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Ledger: {selectedName}</CardTitle>
            <button className="text-sm text-primary underline" onClick={() => setSelectedSupplier(null)}>← Back to list</button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Date</TableHead><TableHead>Type</TableHead><TableHead>Reference</TableHead>
                <TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead className="text-right pr-6">Balance</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {ledgerEntries.map((e, i) => (
                  <TableRow key={i}><TableCell className="pl-6"><DateDisplay date={e.date} /></TableCell><TableCell><Badge variant="outline" className="text-xs">{e.type}</Badge></TableCell><TableCell className="font-mono text-xs">{e.ref}</TableCell>
                    <TableCell className="text-right">{e.debit > 0 ? <CurrencyDisplay amount={e.debit} /> : '—'}</TableCell>
                    <TableCell className="text-right">{e.credit > 0 ? <CurrencyDisplay amount={e.credit} /> : '—'}</TableCell>
                    <TableCell className="text-right pr-6 font-medium"><CurrencyDisplay amount={e.balance} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No creditor accounts" description="Supplier invoices will populate creditor accounts." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Supplier</TableHead><TableHead>Code</TableHead><TableHead className="text-right">Invoiced</TableHead>
              <TableHead className="text-right">Paid</TableHead><TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Balance</TableHead><TableHead className="text-right pr-6">Overdue</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedSupplier(c.id)}>
                  <TableCell className="pl-6 font-medium">{c.supplier_name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.supplier_code || '—'}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={c.totalInvoiced} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={c.totalPaid} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={c.totalCredits} /></TableCell>
                  <TableCell className="text-right font-semibold"><CurrencyDisplay amount={c.balance} /></TableCell>
                  <TableCell className="text-right pr-6">{c.overdue > 0 ? <span className="text-destructive font-medium"><CurrencyDisplay amount={c.overdue} /></span> : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
