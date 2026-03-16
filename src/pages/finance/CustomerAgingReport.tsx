import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportObjectsToCsv } from '@/lib/csv-export';
import { Download, BarChart3 } from 'lucide-react';

export default function CustomerAgingReport() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('customers').select('id, customer_name, customer_code').eq('is_active', true),
      supabase.from('customer_invoices').select('id, customer_id, invoice_date, due_date, total_amount, paid_amount, status, currency_code').not('status', 'in', '("draft","cancelled","paid")'),
    ]).then(([{ data: c }, { data: inv }]) => {
      setCustomers(c || []);
      setInvoices(inv || []);
      setLoading(false);
    });
  }, []);

  const agingData = useMemo(() => {
    const now = new Date();
    return customers.map(cust => {
      const custInv = invoices.filter(i => i.customer_id === cust.id);
      if (custInv.length === 0) return null;
      const buckets = { current: 0, d30: 0, d60: 0, d90: 0, d120: 0 };
      custInv.forEach(inv => {
        const outstanding = Number(inv.total_amount || 0) - Number(inv.paid_amount || 0);
        if (outstanding <= 0) return;
        const dueDate = new Date(inv.due_date || inv.invoice_date);
        const days = Math.floor((now.getTime() - dueDate.getTime()) / 86400000);
        if (days <= 0) buckets.current += outstanding;
        else if (days <= 30) buckets.d30 += outstanding;
        else if (days <= 60) buckets.d60 += outstanding;
        else if (days <= 90) buckets.d90 += outstanding;
        else buckets.d120 += outstanding;
      });
      const total = buckets.current + buckets.d30 + buckets.d60 + buckets.d90 + buckets.d120;
      if (total === 0) return null;
      return { ...cust, ...buckets, total };
    }).filter(Boolean) as any[];
  }, [customers, invoices]);

  const filtered = useMemo(() =>
    agingData.filter(d => !search || d.customer_name.toLowerCase().includes(search.toLowerCase())),
  [agingData, search]);

  const totals = filtered.reduce((acc, d) => ({
    current: acc.current + d.current, d30: acc.d30 + d.d30, d60: acc.d60 + d.d60, d90: acc.d90 + d.d90, d120: acc.d120 + d.d120, total: acc.total + d.total,
  }), { current: 0, d30: 0, d60: 0, d90: 0, d120: 0, total: 0 });

  function handleExport() {
    exportToCSV(filtered.map(d => ({
      Customer: d.customer_name, Code: d.customer_code, Current: d.current, '1-30 Days': d.d30, '31-60 Days': d.d60, '61-90 Days': d.d90, '90+ Days': d.d120, Total: d.total,
    })), 'customer-aging-report');
  }

  return (
    <PageShell title="Customer Aging Report" subtitle="Outstanding receivables by age" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search customers..."
      actions={<Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export CSV</Button>}>
      {filtered.length === 0 ? (
        <EmptyState icon={BarChart3} title="No outstanding balances" description="All customer accounts are current." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Customer</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">1-30 Days</TableHead>
              <TableHead className="text-right">31-60 Days</TableHead>
              <TableHead className="text-right">61-90 Days</TableHead>
              <TableHead className="text-right">90+ Days</TableHead>
              <TableHead className="text-right pr-6 font-semibold">Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="pl-6 font-medium">{d.customer_name}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={d.current} /></TableCell>
                  <TableCell className="text-right">{d.d30 > 0 ? <span className="text-amber-600"><CurrencyDisplay amount={d.d30} /></span> : '—'}</TableCell>
                  <TableCell className="text-right">{d.d60 > 0 ? <span className="text-orange-600"><CurrencyDisplay amount={d.d60} /></span> : '—'}</TableCell>
                  <TableCell className="text-right">{d.d90 > 0 ? <span className="text-red-600"><CurrencyDisplay amount={d.d90} /></span> : '—'}</TableCell>
                  <TableCell className="text-right">{d.d120 > 0 ? <span className="text-destructive font-medium"><CurrencyDisplay amount={d.d120} /></span> : '—'}</TableCell>
                  <TableCell className="text-right pr-6 font-semibold"><CurrencyDisplay amount={d.total} /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell className="pl-6">Total</TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.current} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.d30} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.d60} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.d90} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.d120} /></TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={totals.total} /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
