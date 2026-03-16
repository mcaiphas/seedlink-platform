import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { exportToCSV } from '@/lib/csv-export';
import { Download, FileText, Users } from 'lucide-react';

export default function CustomerStatements() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('customers').select('id, customer_name, customer_code, physical_address, contact_email, contact_phone').eq('is_active', true).order('customer_name'),
      supabase.from('customer_invoices').select('id, invoice_number, customer_id, invoice_date, total_amount, paid_amount, status').order('invoice_date'),
      supabase.from('payments').select('id, payment_number, customer_id, amount, payment_status, created_at').eq('payment_status', 'paid'),
      supabase.from('customer_credit_notes').select('id, credit_note_number, customer_id, total_amount, status, issue_date').eq('status', 'issued'),
    ]).then(([{ data: c }, { data: inv }, { data: pay }, { data: cn }]) => {
      setCustomers(c || []);
      setInvoices(inv || []);
      setPayments(pay || []);
      setCreditNotes(cn || []);
      setLoading(false);
    });
  }, []);

  const statement = useMemo(() => {
    if (!selectedCustomer) return null;
    const entries: any[] = [];
    invoices.filter(i => i.customer_id === selectedCustomer).forEach(i => {
      const d = i.invoice_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Invoice', ref: i.invoice_number, debit: Number(i.total_amount), credit: 0 });
    });
    payments.filter(p => p.customer_id === selectedCustomer).forEach(p => {
      const d = p.created_at?.split('T')[0];
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Payment', ref: p.payment_number, debit: 0, credit: Number(p.amount) });
    });
    creditNotes.filter(cn => cn.customer_id === selectedCustomer).forEach(cn => {
      const d = cn.issue_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Credit Note', ref: cn.credit_note_number, debit: 0, credit: Number(cn.total_amount) });
    });
    entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    // Calculate opening balance (all entries before dateFrom)
    let openingBalance = 0;
    if (dateFrom) {
      invoices.filter(i => i.customer_id === selectedCustomer && i.invoice_date < dateFrom).forEach(i => { openingBalance += Number(i.total_amount); });
      payments.filter(p => p.customer_id === selectedCustomer && (p.created_at?.split('T')[0] || '') < dateFrom).forEach(p => { openingBalance -= Number(p.amount); });
      creditNotes.filter(cn => cn.customer_id === selectedCustomer && cn.issue_date < dateFrom).forEach(cn => { openingBalance -= Number(cn.total_amount); });
    }

    let running = openingBalance;
    const rows = entries.map(e => { running += e.debit - e.credit; return { ...e, balance: running }; });
    return { openingBalance, closingBalance: running, entries: rows, totalDebits: entries.reduce((s, e) => s + e.debit, 0), totalCredits: entries.reduce((s, e) => s + e.credit, 0) };
  }, [selectedCustomer, dateFrom, dateTo, invoices, payments, creditNotes]);

  const customer = customers.find(c => c.id === selectedCustomer);

  function handleExport() {
    if (!statement) return;
    exportToCSV([
      { Date: 'Opening Balance', Type: '', Reference: '', Debit: '', Credit: '', Balance: statement.openingBalance },
      ...statement.entries.map(e => ({ Date: e.date, Type: e.type, Reference: e.ref, Debit: e.debit || '', Credit: e.credit || '', Balance: e.balance })),
      { Date: 'Closing Balance', Type: '', Reference: '', Debit: statement.totalDebits, Credit: statement.totalCredits, Balance: statement.closingBalance },
    ], `statement-${customer?.customer_name || 'customer'}`);
  }

  return (
    <PageShell title="Customer Statements" subtitle="Generate account statements for customers" loading={loading}>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div><Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>From</Label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-card" /></div>
            <div><Label>To</Label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-card" /></div>
            <div className="flex items-end">
              <Button variant="outline" onClick={handleExport} disabled={!statement}><Download className="h-4 w-4 mr-2" />Export</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedCustomer ? (
        <EmptyState icon={Users} title="Select a customer" description="Choose a customer to generate their statement." />
      ) : !statement || statement.entries.length === 0 ? (
        <EmptyState icon={FileText} title="No transactions" description="No transactions found for this period." />
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{customer?.customer_name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{customer?.physical_address}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Opening: <span className="font-medium text-foreground"><CurrencyDisplay amount={statement.openingBalance} /></span></p>
                <p className="text-muted-foreground">Closing: <span className="font-semibold text-foreground"><CurrencyDisplay amount={statement.closingBalance} /></span></p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Date</TableHead><TableHead>Type</TableHead><TableHead>Reference</TableHead>
                <TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead className="text-right pr-6">Balance</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {statement.entries.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><DateDisplay date={e.date} /></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{e.type}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{e.ref}</TableCell>
                    <TableCell className="text-right">{e.debit > 0 ? <CurrencyDisplay amount={e.debit} /> : '—'}</TableCell>
                    <TableCell className="text-right">{e.credit > 0 ? <CurrencyDisplay amount={e.credit} /> : '—'}</TableCell>
                    <TableCell className="text-right pr-6 font-medium"><CurrencyDisplay amount={e.balance} /></TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="pl-6" colSpan={3}>Totals</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={statement.totalDebits} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={statement.totalCredits} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={statement.closingBalance} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
