import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { DollarSign, TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface AgingBucket { label: string; amount: number; }

export default function FinanceSummary() {
  const [loading, setLoading] = useState(true);
  const [arAging, setArAging] = useState<AgingBucket[]>([]);
  const [apAging, setApAging] = useState<AgingBucket[]>([]);
  const [cashBalance, setCashBalance] = useState(0);
  const [trialSummary, setTrialSummary] = useState<{ type: string; dr: number; cr: number }[]>([]);

  useEffect(() => {
    async function load() {
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      // AR aging from customer invoices
      const { data: invoices } = await supabase
        .from('customer_invoices')
        .select('id,total_amount,due_date,status')
        .in('status', ['posted', 'overdue', 'partially_paid']);

      const arBuckets = [
        { label: 'Current', amount: 0 },
        { label: '30 Days', amount: 0 },
        { label: '60 Days', amount: 0 },
        { label: '90 Days', amount: 0 },
        { label: '120+ Days', amount: 0 },
      ];
      (invoices || []).forEach((inv: any) => {
        const dueDate = new Date(inv.due_date);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / 86400000);
        const amt = Number(inv.total_amount) || 0;
        if (daysOverdue <= 0) arBuckets[0].amount += amt;
        else if (daysOverdue <= 30) arBuckets[1].amount += amt;
        else if (daysOverdue <= 60) arBuckets[2].amount += amt;
        else if (daysOverdue <= 90) arBuckets[3].amount += amt;
        else arBuckets[4].amount += amt;
      });
      setArAging(arBuckets);

      // AP aging from supplier invoices
      const { data: supInvoices } = await supabase
        .from('supplier_invoices')
        .select('id,total_amount,due_date,status')
        .in('status', ['posted', 'approved', 'partially_paid']);

      const apBuckets = [
        { label: 'Current', amount: 0 },
        { label: '30 Days', amount: 0 },
        { label: '60 Days', amount: 0 },
        { label: '90 Days', amount: 0 },
        { label: '120+ Days', amount: 0 },
      ];
      (supInvoices || []).forEach((inv: any) => {
        const dueDate = new Date(inv.due_date);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / 86400000);
        const amt = Number(inv.total_amount) || 0;
        if (daysOverdue <= 0) apBuckets[0].amount += amt;
        else if (daysOverdue <= 30) apBuckets[1].amount += amt;
        else if (daysOverdue <= 60) apBuckets[2].amount += amt;
        else if (daysOverdue <= 90) apBuckets[3].amount += amt;
        else apBuckets[4].amount += amt;
      });
      setApAging(apBuckets);

      // Cash balance + trial summary from GL
      const [{ data: accounts }, { data: lines }] = await Promise.all([
        supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true),
        supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
      ]);

      if (accounts && lines) {
        const posted = (lines as any[]).filter(l => l.journal_entries?.status === 'posted');
        const acctMap = Object.fromEntries(accounts.map(a => [a.id, a]));

        // Cash balance
        const bankAccts = accounts.filter(a => a.account_code >= '1000' && a.account_code < '1100');
        const bankIds = new Set(bankAccts.map(a => a.id));
        const cash = posted.filter((l: any) => bankIds.has(l.gl_account_id))
          .reduce((s: number, l: any) => s + (l.debit_amount || 0) - (l.credit_amount || 0), 0);
        setCashBalance(cash);

        // Trial summary by account type
        const typeSums: Record<string, { dr: number; cr: number }> = {};
        posted.forEach((l: any) => {
          const acct = acctMap[l.gl_account_id];
          if (!acct) return;
          if (!typeSums[acct.account_type]) typeSums[acct.account_type] = { dr: 0, cr: 0 };
          typeSums[acct.account_type].dr += l.debit_amount || 0;
          typeSums[acct.account_type].cr += l.credit_amount || 0;
        });
        setTrialSummary(Object.entries(typeSums).map(([type, v]) => ({ type, ...v })).sort((a, b) => a.type.localeCompare(b.type)));
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Finance Summary</h1></div>
      <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>
    </div>
  );

  const totalAR = arAging.reduce((s, b) => s + b.amount, 0);
  const totalAP = apAging.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance Summary</h1>
        <p className="text-sm text-muted-foreground mt-1">Accounts receivable, payable, and cash flow overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" />Total Receivables</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold"><CurrencyDisplay amount={totalAR} /></div></CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4" />Total Payables</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold"><CurrencyDisplay amount={totalAP} /></div></CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" />Cash at Bank</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold"><CurrencyDisplay amount={cashBalance} /></div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" />Accounts Receivable Aging</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead className="pl-6">Bucket</TableHead><TableHead className="text-right pr-6">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {arAging.map(b => (
                  <TableRow key={b.label}>
                    <TableCell className="pl-6">{b.label}</TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={b.amount} /></TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="pl-6">Total</TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={totalAR} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4" />Accounts Payable Aging</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead className="pl-6">Bucket</TableHead><TableHead className="text-right pr-6">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {apAging.map(b => (
                  <TableRow key={b.label}>
                    <TableCell className="pl-6">{b.label}</TableCell>
                    <TableCell className="text-right pr-6"><CurrencyDisplay amount={b.amount} /></TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="pl-6">Total</TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={totalAP} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4" />Trial Balance Summary by Account Type</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="pl-6">Account Type</TableHead>
              <TableHead className="text-right">Total Debits</TableHead>
              <TableHead className="text-right pr-6">Total Credits</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {trialSummary.map(row => (
                <TableRow key={row.type}>
                  <TableCell className="pl-6 font-medium capitalize">{row.type.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={row.dr} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={row.cr} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
