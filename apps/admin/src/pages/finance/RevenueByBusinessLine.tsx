import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

const BUSINESS_LINES = ['Seedlink Inputs', 'Seedlink Grow', 'Seedlink Connect', 'Drovvi', 'Training', 'Logistics', 'Other'];

export default function RevenueByBusinessLine() {
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));
  const [data, setData] = useState<{ line: string; amount: number }[]>([]);

  async function loadData() {
    setLoading(true);
    // Pull classified income transactions with correct column names
    const { data: reviews } = await supabase
      .from('bank_transaction_reviews')
      .select('classification,income_category,business_line,amount,transaction_date')
      .eq('classification', 'income')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);

    // Also pull revenue from journal entries
    const [{ data: accounts }, { data: jLines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true).eq('account_type', 'revenue'),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,line_description,journal_entries!inner(entry_date,status)'),
    ]);

    const lineMap: Record<string, number> = {};
    BUSINESS_LINES.forEach(bl => { lineMap[bl] = 0; });

    // From classified bank transactions
    (reviews || []).forEach((r: any) => {
      const bl = r.business_line || 'Other';
      const key = BUSINESS_LINES.includes(bl) ? bl : 'Other';
      lineMap[key] += Math.abs(r.amount || 0);
    });

    // From journal revenue accounts (if no bank classification exists, add to Other)
    if (accounts && jLines) {
      const revIds = new Set(accounts.map(a => a.id));
      const posted = (jLines as any[]).filter(l => l.journal_entries?.status === 'posted' && revIds.has(l.gl_account_id) && l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);
      const journalRevenue = posted.reduce((s: number, l: any) => s + (l.credit_amount || 0) - (l.debit_amount || 0), 0);
      const classifiedTotal = Object.values(lineMap).reduce((s, v) => s + v, 0);
      if (journalRevenue > classifiedTotal) {
        lineMap['Other'] += journalRevenue - classifiedTotal;
      }
    }

    setData(BUSINESS_LINES.map(bl => ({ line: bl, amount: lineMap[bl] })).filter(d => d.amount > 0.01));
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue by Business Line</h1>
        <p className="text-sm text-muted-foreground mt-1">Revenue breakdown across business segments</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(data, 'revenue-by-business-line')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? <Skeleton className="h-48 w-full rounded-xl" /> : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="pl-6">Business Line</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right pr-6">% of Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map(d => (
                <TableRow key={d.line}>
                  <TableCell className="pl-6 font-medium">{d.line}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={d.amount} /></TableCell>
                  <TableCell className="text-right pr-6">{total > 0 ? ((d.amount / total) * 100).toFixed(1) : 0}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="pl-6">Total Revenue</TableCell>
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
