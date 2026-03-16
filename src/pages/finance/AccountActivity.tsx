import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Activity } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

interface AccountSummary {
  account_code: string;
  account_name: string;
  account_type: string;
  total_debit: number;
  total_credit: number;
  net_movement: number;
  transaction_count: number;
}

export default function AccountActivity() {
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<AccountSummary[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: allLines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true).order('account_code'),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts) { setLoading(false); return; }

    const lines = (allLines || []).filter((l: any) =>
      l.journal_entries?.status === 'posted' && l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate
    );

    const result: AccountSummary[] = accounts.map(a => {
      const acctLines = lines.filter((l: any) => l.gl_account_id === a.id);
      const td = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const tc = acctLines.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      return {
        account_code: a.account_code,
        account_name: a.account_name,
        account_type: a.account_type,
        total_debit: td,
        total_credit: tc,
        net_movement: td - tc,
        transaction_count: acctLines.length,
      };
    }).filter(s => s.transaction_count > 0);

    setSummaries(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() =>
    summaries.filter(s => typeFilter === 'all' || s.account_type === typeFilter),
    [summaries, typeFilter]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Account Activity</h1><p className="text-sm text-muted-foreground mt-1">Account movement summary for the period</p></div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="liability">Liability</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="cost_of_sales">Cost of Sales</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(filtered, 'account-activity')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? (
        <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-sm"><CardContent className="py-16 text-center text-muted-foreground">
          <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
          No account activity found for this period.
        </CardContent></Card>
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Code</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Net Movement</TableHead>
              <TableHead className="text-right pr-6">Txns</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.account_code}>
                  <TableCell className="pl-6 font-mono font-medium text-sm">{s.account_code}</TableCell>
                  <TableCell className="font-medium text-sm">{s.account_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{s.account_type.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={s.total_debit} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={s.total_credit} /></TableCell>
                  <TableCell className="text-right font-medium"><CurrencyDisplay amount={s.net_movement} /></TableCell>
                  <TableCell className="text-right pr-6 tabular-nums">{s.transaction_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
