import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function DebtorLedger() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('customers').select('id, customer_name, customer_code, credit_limit, currency_code').eq('is_active', true).order('customer_name'),
      supabase.from('customer_invoices').select('id, invoice_number, customer_id, invoice_date, due_date, total_amount, paid_amount, status, currency_code').in('status', ['issued', 'partially_paid', 'paid', 'overdue']).order('invoice_date', { ascending: false }),
      supabase.from('payments').select('id, payment_number, customer_id, customer_invoice_id, amount, payment_status, created_at, payment_method').eq('payment_status', 'paid'),
      supabase.from('customer_credit_notes').select('id, credit_note_number, customer_id, total_amount, status, issue_date').eq('status', 'issued'),
    ]).then(([{ data: c }, { data: inv }, { data: pay }, { data: cn }]) => {
      setCustomers(c || []);
      setInvoices(inv || []);
      setPayments(pay || []);
      setCreditNotes(cn || []);
      setLoading(false);
    });
  }, []);

  const debtorSummary = useMemo(() => {
    return customers.map(cust => {
      const custInv = invoices.filter(i => i.customer_id === cust.id);
      const custPay = payments.filter(p => p.customer_id === cust.id);
      const custCn = creditNotes.filter(cn => cn.customer_id === cust.id);
      const totalInvoiced = custInv.reduce((s, i) => s + Number(i.total_amount || 0), 0);
      const totalPaid = custPay.reduce((s, p) => s + Number(p.amount || 0), 0);
      const totalCredits = custCn.reduce((s, cn) => s + Number(cn.total_amount || 0), 0);
      const balance = totalInvoiced - totalPaid - totalCredits;
      const overdue = custInv.filter(i => i.status === 'overdue' || (i.due_date && new Date(i.due_date) < new Date() && i.status !== 'paid')).reduce((s, i) => s + Number(i.total_amount || 0) - Number(i.paid_amount || 0), 0);
      return { ...cust, totalInvoiced, totalPaid, totalCredits, balance, overdue, invoiceCount: custInv.length };
    }).filter(c => c.invoiceCount > 0 || c.balance !== 0);
  }, [customers, invoices, payments, creditNotes]);

  const filtered = useMemo(() =>
    debtorSummary.filter(d => !search || d.customer_name.toLowerCase().includes(search.toLowerCase()) || (d.customer_code || '').toLowerCase().includes(search.toLowerCase())),
  [debtorSummary, search]);

  const totalOutstanding = filtered.reduce((s, d) => s + d.balance, 0);
  const totalOverdue = filtered.reduce((s, d) => s + d.overdue, 0);

  // Ledger detail for selected customer
  const ledgerEntries = useMemo(() => {
    if (!selectedCustomer) return [];
    const entries: any[] = [];
    invoices.filter(i => i.customer_id === selectedCustomer).forEach(i => {
      entries.push({ date: i.invoice_date, type: 'Invoice', ref: i.invoice_number, debit: Number(i.total_amount), credit: 0 });
    });
    payments.filter(p => p.customer_id === selectedCustomer).forEach(p => {
      entries.push({ date: p.created_at?.split('T')[0], type: 'Payment', ref: p.payment_number, debit: 0, credit: Number(p.amount) });
    });
    creditNotes.filter(cn => cn.customer_id === selectedCustomer).forEach(cn => {
      entries.push({ date: cn.issue_date, type: 'Credit Note', ref: cn.credit_note_number, debit: 0, credit: Number(cn.total_amount) });
    });
    entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    let running = 0;
    return entries.map(e => { running += e.debit - e.credit; return { ...e, balance: running }; });
  }, [selectedCustomer, invoices, payments, creditNotes]);

  const selectedName = customers.find(c => c.id === selectedCustomer)?.customer_name;

  return (
    <PageShell title="Debtors (Accounts Receivable)" subtitle="Customer outstanding balances and ledger" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search customers...">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Outstanding</p><p className="text-2xl font-bold"><CurrencyDisplay amount={totalOutstanding} /></p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Overdue</p><p className="text-2xl font-bold text-destructive"><CurrencyDisplay amount={totalOverdue} /></p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active Debtors</p><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
      </div>

      {selectedCustomer ? (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Ledger: {selectedName}</CardTitle>
            <button className="text-sm text-primary underline" onClick={() => setSelectedCustomer(null)}>← Back to list</button>
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
        <EmptyState icon={Users} title="No debtor accounts" description="Customer invoices will populate debtor accounts." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Customer</TableHead><TableHead>Code</TableHead><TableHead className="text-right">Invoiced</TableHead>
              <TableHead className="text-right">Paid</TableHead><TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Balance</TableHead><TableHead className="text-right pr-6">Overdue</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedCustomer(d.id)}>
                  <TableCell className="pl-6 font-medium">{d.customer_name}</TableCell>
                  <TableCell className="font-mono text-xs">{d.customer_code || '—'}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={d.totalInvoiced} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={d.totalPaid} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={d.totalCredits} /></TableCell>
                  <TableCell className="text-right font-semibold"><CurrencyDisplay amount={d.balance} /></TableCell>
                  <TableCell className="text-right pr-6">{d.overdue > 0 ? <span className="text-destructive font-medium"><CurrencyDisplay amount={d.overdue} /></span> : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
