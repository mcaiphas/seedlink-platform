import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

interface AccountBalance {
  account_code: string;
  account_name: string;
  account_type: string;
  opening_debit: number;
  opening_credit: number;
  period_debit: number;
  period_credit: number;
  closing_debit: number;
  closing_credit: number;
}

export default function TrialBalance() {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<AccountBalance[]>([]);
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: allLines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true).order('account_code'),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);

    if (!accounts) { setLoading(false); return; }

    const lines = (allLines || []).filter((l: any) => l.journal_entries?.status === 'posted');
    const result: AccountBalance[] = accounts.map(a => {
      const acctLines = lines.filter((l: any) => l.gl_account_id === a.id);
      const opening = acctLines.filter((l: any) => l.journal_entries.entry_date < startDate);
      const period = acctLines.filter((l: any) => l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

      const openDr = opening.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const openCr = opening.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      const perDr = period.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const perCr = period.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);

      return {
        account_code: a.account_code,
        account_name: a.account_name,
        account_type: a.account_type,
        opening_debit: openDr,
        opening_credit: openCr,
        period_debit: perDr,
        period_credit: perCr,
        closing_debit: openDr + perDr,
        closing_credit: openCr + perCr,
      };
    }).filter(b => b.closing_debit > 0 || b.closing_credit > 0 || b.period_debit > 0 || b.period_credit > 0);

    setBalances(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const totals = useMemo(() => ({
    opening_debit: balances.reduce((s, b) => s + b.opening_debit, 0),
    opening_credit: balances.reduce((s, b) => s + b.opening_credit, 0),
    period_debit: balances.reduce((s, b) => s + b.period_debit, 0),
    period_credit: balances.reduce((s, b) => s + b.period_credit, 0),
    closing_debit: balances.reduce((s, b) => s + b.closing_debit, 0),
    closing_credit: balances.reduce((s, b) => s + b.closing_credit, 0),
  }), [balances]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trial Balance</h1>
        <p className="text-sm text-muted-foreground mt-1">Account balances for the selected period</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
            <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
            <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
            <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(balances, 'trial-balance')}><Download className="h-4 w-4 mr-1" />Export</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Code</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Open Debit</TableHead>
              <TableHead className="text-right">Open Credit</TableHead>
              <TableHead className="text-right">Period Debit</TableHead>
              <TableHead className="text-right">Period Credit</TableHead>
              <TableHead className="text-right">Close Debit</TableHead>
              <TableHead className="text-right pr-6">Close Credit</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {balances.map(b => (
                <TableRow key={b.account_code}>
                  <TableCell className="pl-6 font-mono font-medium text-sm">{b.account_code}</TableCell>
                  <TableCell className="font-medium text-sm">{b.account_name}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{b.account_type}</Badge></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={b.opening_debit || null} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={b.opening_credit || null} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={b.period_debit || null} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={b.period_credit || null} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={b.closing_debit || null} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={b.closing_credit || null} /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="pl-6" colSpan={3}>Totals</TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.opening_debit} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.opening_credit} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.period_debit} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.period_credit} /></TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={totals.closing_debit} /></TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={totals.closing_credit} /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <div className="text-center">
        <Badge variant={Math.abs(totals.closing_debit - totals.closing_credit) < 0.01 ? 'default' : 'destructive'}
          className={Math.abs(totals.closing_debit - totals.closing_credit) < 0.01 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}>
          {Math.abs(totals.closing_debit - totals.closing_credit) < 0.01 ? '✓ Trial Balance in Balance' : `⚠ Out of Balance by ZAR ${Math.abs(totals.closing_debit - totals.closing_credit).toFixed(2)}`}
        </Badge>
      </div>
    </div>
  );
}
