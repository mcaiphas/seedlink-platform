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
import { exportToCSV } from '@/lib/csv-export';
import { Download, FileText, Building2 } from 'lucide-react';

export default function SupplierStatements() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('suppliers').select('id, supplier_name, supplier_code, physical_address, email').eq('is_active', true).order('supplier_name'),
      supabase.from('supplier_invoices').select('id, supplier_invoice_number, supplier_id, invoice_date, total_amount, paid_amount, status').order('invoice_date'),
      supabase.from('supplier_payments').select('id, payment_number, supplier_id, amount, payment_status, payment_date').eq('payment_status', 'paid'),
      supabase.from('supplier_credit_notes').select('id, credit_note_number, supplier_id, total_amount, status, issue_date').eq('status', 'issued'),
    ]).then(([{ data: s }, { data: inv }, { data: pay }, { data: cn }]) => {
      setSuppliers(s || []);
      setInvoices(inv || []);
      setPayments(pay || []);
      setCreditNotes(cn || []);
      setLoading(false);
    });
  }, []);

  const statement = useMemo(() => {
    if (!selectedSupplier) return null;
    const entries: any[] = [];
    invoices.filter(i => i.supplier_id === selectedSupplier).forEach(i => {
      const d = i.invoice_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Invoice', ref: i.supplier_invoice_number, debit: 0, credit: Number(i.total_amount) });
    });
    payments.filter(p => p.supplier_id === selectedSupplier).forEach(p => {
      const d = p.payment_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Payment', ref: p.payment_number, debit: Number(p.amount), credit: 0 });
    });
    creditNotes.filter(cn => cn.supplier_id === selectedSupplier).forEach(cn => {
      const d = cn.issue_date;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      entries.push({ date: d, type: 'Credit Note', ref: cn.credit_note_number, debit: Number(cn.total_amount), credit: 0 });
    });
    entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    let openingBalance = 0;
    if (dateFrom) {
      invoices.filter(i => i.supplier_id === selectedSupplier && i.invoice_date < dateFrom).forEach(i => { openingBalance += Number(i.total_amount); });
      payments.filter(p => p.supplier_id === selectedSupplier && p.payment_date < dateFrom).forEach(p => { openingBalance -= Number(p.amount); });
      creditNotes.filter(cn => cn.supplier_id === selectedSupplier && cn.issue_date < dateFrom).forEach(cn => { openingBalance -= Number(cn.total_amount); });
    }

    let running = openingBalance;
    const rows = entries.map(e => { running += e.credit - e.debit; return { ...e, balance: running }; });
    return { openingBalance, closingBalance: running, entries: rows, totalDebits: entries.reduce((s, e) => s + e.debit, 0), totalCredits: entries.reduce((s, e) => s + e.credit, 0) };
  }, [selectedSupplier, dateFrom, dateTo, invoices, payments, creditNotes]);

  const supplier = suppliers.find(s => s.id === selectedSupplier);

  function handleExport() {
    if (!statement) return;
    exportToCSV([
      { Date: 'Opening Balance', Type: '', Reference: '', Debit: '', Credit: '', Balance: statement.openingBalance },
      ...statement.entries.map(e => ({ Date: e.date, Type: e.type, Reference: e.ref, Debit: e.debit || '', Credit: e.credit || '', Balance: e.balance })),
      { Date: 'Closing Balance', Type: '', Reference: '', Debit: statement.totalDebits, Credit: statement.totalCredits, Balance: statement.closingBalance },
    ], `statement-${supplier?.supplier_name || 'supplier'}`);
  }

  return (
    <PageShell title="Supplier Statements" subtitle="Generate account statements for suppliers" loading={loading}>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div><Label>Supplier</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
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

      {!selectedSupplier ? (
        <EmptyState icon={Building2} title="Select a supplier" description="Choose a supplier to generate their statement." />
      ) : !statement || statement.entries.length === 0 ? (
        <EmptyState icon={FileText} title="No transactions" description="No transactions found for this period." />
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{supplier?.supplier_name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{supplier?.physical_address}</p>
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
