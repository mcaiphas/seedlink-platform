import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

interface ExpenseRow { category: string; amount: number; pct: number; }

export default function ExpenseAnalysis() {
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));
  const [rows, setRows] = useState<ExpenseRow[]>([]);

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: lines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts || !lines) { setLoading(false); return; }

    const expenseAccounts = accounts.filter(a => ['expense', 'other_expense'].includes(a.account_type));
    const posted = (lines as any[]).filter(l => l.journal_entries?.status === 'posted' && l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

    const catMap: Record<string, number> = {};
    for (const acct of expenseAccounts) {
      const acctLines = posted.filter((l: any) => l.gl_account_id === acct.id);
      const amount = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0) - (l.credit_amount || 0), 0);
      if (Math.abs(amount) > 0.01) {
        catMap[acct.account_name] = (catMap[acct.account_name] || 0) + amount;
      }
    }

    const total = Object.values(catMap).reduce((s, v) => s + v, 0);
    const result = Object.entries(catMap)
      .map(([category, amount]) => ({ category, amount, pct: total > 0 ? (amount / total) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);

    setRows(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Expense Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Expense breakdown by account category</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(rows, 'expense-analysis')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? <Skeleton className="h-48 w-full rounded-xl" /> : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="pl-6">Expense Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right pr-6">% of Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.category}>
                  <TableCell className="pl-6 font-medium">{r.category}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={r.amount} /></TableCell>
                  <TableCell className="text-right pr-6">{r.pct.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="pl-6">Total Expenses</TableCell>
                <TableCell className="text-right"><CurrencyDisplay amount={total} /></TableCell>
                <TableCell className="text-right pr-6">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
