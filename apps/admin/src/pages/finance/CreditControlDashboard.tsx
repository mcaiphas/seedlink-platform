import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState, KpiCard } from '@/components/commerce/PageShell';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, DollarSign, Users, ShieldAlert } from 'lucide-react';

export default function CreditControlDashboard() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('customers').select('id, customer_name, customer_code, credit_limit, payment_terms').eq('is_active', true).order('customer_name'),
      supabase.from('customer_invoices').select('id, customer_id, total_amount, paid_amount, status, due_date').in('status', ['issued', 'partially_paid', 'overdue']),
      supabase.from('payments').select('id, customer_id, amount').eq('payment_status', 'paid'),
      supabase.from('customer_credit_notes').select('id, customer_id, total_amount').eq('status', 'issued'),
    ]).then(([{ data: c }, { data: inv }, { data: pay }, { data: cn }]) => {
      setCustomers(c || []);
      setInvoices(inv || []);
      setPayments(pay || []);
      setCreditNotes(cn || []);
      setLoading(false);
    });
  }, []);

  const customerAnalysis = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return customers.map(c => {
      const custInvoices = invoices.filter(i => i.customer_id === c.id);
      const outstanding = custInvoices.reduce((s, i) => s + (Number(i.total_amount) - Number(i.paid_amount || 0)), 0);
      const overdue = custInvoices.filter(i => i.due_date && i.due_date < today).reduce((s, i) => s + (Number(i.total_amount) - Number(i.paid_amount || 0)), 0);
      const creditLimit = Number(c.credit_limit || 0);
      const available = Math.max(creditLimit - outstanding, 0);
      const utilization = creditLimit > 0 ? (outstanding / creditLimit) * 100 : 0;
      const exceeded = creditLimit > 0 && outstanding > creditLimit;
      return { ...c, outstanding, overdue, available, utilization, exceeded, creditLimit };
    }).filter(c => c.outstanding > 0 || c.exceeded)
      .sort((a, b) => b.outstanding - a.outstanding);
  }, [customers, invoices]);

  const totalOutstanding = customerAnalysis.reduce((s, c) => s + c.outstanding, 0);
  const totalOverdue = customerAnalysis.reduce((s, c) => s + c.overdue, 0);
  const exceededCount = customerAnalysis.filter(c => c.exceeded).length;
  const highRiskCount = customerAnalysis.filter(c => c.utilization > 80).length;

  return (
    <PageShell title="Credit Control" subtitle="Monitor customer credit risk and outstanding balances" loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Outstanding" value={`ZAR ${totalOutstanding.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={DollarSign} />
        <KpiCard label="Total Overdue" value={`ZAR ${totalOverdue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={AlertTriangle} />
        <KpiCard label="Credit Limit Exceeded" value={exceededCount} icon={ShieldAlert} />
        <KpiCard label="High Risk (>80%)" value={highRiskCount} icon={Users} />
      </div>

      {customerAnalysis.length === 0 ? (
        <EmptyState icon={Users} title="No outstanding balances" description="All customer accounts are in good standing." />
      ) : (
        <>
          {/* Exceeded Credit Limits */}
          {exceededCount > 0 && (
            <Card className="mb-6 border-destructive/30">
              <CardHeader className="pb-3"><CardTitle className="text-base text-destructive flex items-center gap-2"><ShieldAlert className="h-4 w-4" />Credit Limit Exceeded</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Customer</TableHead>
                    <TableHead className="text-right">Credit Limit</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                    <TableHead className="text-right pr-6">Over By</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {customerAnalysis.filter(c => c.exceeded).map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="pl-6 font-medium">{c.customer_name}</TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={c.creditLimit} /></TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={c.outstanding} /></TableCell>
                        <TableCell className="text-right pr-6 text-destructive font-semibold"><CurrencyDisplay amount={c.outstanding - c.creditLimit} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* All Customers */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base">Customer Credit Overview</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Customer</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-right">Overdue</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead className="text-right pr-6">Available</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {customerAnalysis.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{c.customer_name}</span>
                          {c.exceeded && <Badge variant="destructive" className="text-[10px]">Exceeded</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={c.creditLimit} /></TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={c.outstanding} /></TableCell>
                      <TableCell className="text-right">{c.overdue > 0 ? <span className="text-destructive font-medium"><CurrencyDisplay amount={c.overdue} /></span> : '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={Math.min(c.utilization, 100)} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground w-10 text-right">{c.utilization.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6"><CurrencyDisplay amount={c.available} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </PageShell>
  );
}
