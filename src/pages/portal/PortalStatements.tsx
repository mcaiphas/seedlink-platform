import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { exportObjectsToCsv } from '@/lib/csv-export';
import { Download, FileText } from 'lucide-react';

export default function PortalStatements() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    supabase.from('customers').select('id, customer_name').eq('contact_email', user.email).limit(1).single().then(async ({ data: cust }) => {
      if (cust) {
        setCustomerId(cust.id);
        setCustomerName(cust.customer_name);
        const [{ data: inv }, { data: pay }, { data: cn }] = await Promise.all([
          supabase.from('customer_invoices').select('id, invoice_number, customer_id, invoice_date, total_amount, paid_amount, status').eq('customer_id', cust.id).order('invoice_date'),
          supabase.from('payments').select('id, payment_number, customer_id, amount, payment_status, created_at').eq('customer_id', cust.id).eq('payment_status', 'paid'),
          supabase.from('customer_credit_notes').select('id, credit_note_number, customer_id, total_amount, status, issue_date').eq('customer_id', cust.id).eq('status', 'issued'),
        ]);
        setInvoices(inv || []);
        setPayments(pay || []);
        setCreditNotes(cn || []);
      }
      setLoading(false);
    });
  }, [user]);

  const statement = useMemo(() => {
    if (!customerId) return null;
    const entries: any[] = [];
    invoices.forEach(i => {
      const d = i.invoice_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Invoice', ref: i.invoice_number, debit: Number(i.total_amount), credit: 0 });
    });
    payments.forEach(p => {
      const d = p.created_at?.split('T')[0];
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Payment', ref: p.payment_number, debit: 0, credit: Number(p.amount) });
    });
    creditNotes.forEach(cn => {
      const d = cn.issue_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Credit Note', ref: cn.credit_note_number, debit: 0, credit: Number(cn.total_amount) });
    });
    entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    let openingBalance = 0;
    if (dateFrom) {
      invoices.filter(i => i.invoice_date < dateFrom).forEach(i => { openingBalance += Number(i.total_amount); });
      payments.filter(p => (p.created_at?.split('T')[0] || '') < dateFrom).forEach(p => { openingBalance -= Number(p.amount); });
      creditNotes.filter(cn => cn.issue_date < dateFrom).forEach(cn => { openingBalance -= Number(cn.total_amount); });
    }

    let running = openingBalance;
    const rows = entries.map(e => { running += e.debit - e.credit; return { ...e, balance: running }; });
    return { openingBalance, closingBalance: running, entries: rows, totalDebits: entries.reduce((s, e) => s + e.debit, 0), totalCredits: entries.reduce((s, e) => s + e.credit, 0) };
  }, [customerId, dateFrom, dateTo, invoices, payments, creditNotes]);

  function handleExport() {
    if (!statement) return;
    exportObjectsToCsv([
      { Date: 'Opening Balance', Type: '', Reference: '', Debit: '', Credit: '', Balance: statement.openingBalance },
      ...statement.entries.map(e => ({ Date: e.date, Type: e.type, Reference: e.ref, Debit: e.debit || '', Credit: e.credit || '', Balance: e.balance })),
      { Date: 'Closing Balance', Type: '', Reference: '', Debit: statement.totalDebits, Credit: statement.totalCredits, Balance: statement.closingBalance },
    ], `my-statement`);
  }

  if (loading) return <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Statement</h1>
        <p className="text-sm text-muted-foreground mt-1">Account statement for {customerName}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>From</Label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-card" /></div>
            <div><Label>To</Label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-card" /></div>
            <div className="flex items-end"><Button variant="outline" onClick={handleExport} disabled={!statement}><Download className="h-4 w-4 mr-2" />Export CSV</Button></div>
          </div>
        </CardContent>
      </Card>

      {!statement || statement.entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4"><FileText className="h-8 w-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-semibold text-foreground">No transactions</h3>
          <p className="text-sm text-muted-foreground mt-1">No transactions found for this period.</p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{customerName}</CardTitle>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
