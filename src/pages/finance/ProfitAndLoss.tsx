import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

function getPresetDates(preset: string): [string, string] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (preset) {
    case 'this_month': return [new Date(y, m, 1).toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
    case 'last_month': return [new Date(y, m - 1, 1).toISOString().slice(0, 10), new Date(y, m, 0).toISOString().slice(0, 10)];
    case 'qtd': { const qm = Math.floor(m / 3) * 3; return [new Date(y, qm, 1).toISOString().slice(0, 10), now.toISOString().slice(0, 10)]; }
    case 'ytd': return [new Date(y, 0, 1).toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
    case 'fytd': return [new Date(y, 2, 1).toISOString().slice(0, 10), now.toISOString().slice(0, 10)]; // March FY
    default: return [new Date(y, m, 1).toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
  }
}

interface PLLine { category: string; account_code: string; account_name: string; amount: number; }

export default function ProfitAndLoss() {
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState('this_month');
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));
  const [plData, setPlData] = useState<PLLine[]>([]);

  function applyPreset(p: string) {
    setPreset(p);
    if (p !== 'custom') {
      const [s, e] = getPresetDates(p);
      setStartDate(s);
      setEndDate(e);
    }
  }

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: allLines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type,account_sub_type').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts) { setLoading(false); return; }

    const incomeExpenseTypes = ['revenue', 'cost_of_sales', 'expense', 'other_income', 'other_expense'];
    const plAccounts = accounts.filter(a => incomeExpenseTypes.includes(a.account_type));
    const lines = (allLines || []).filter((l: any) => l.journal_entries?.status === 'posted' && l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

    const result: PLLine[] = plAccounts.map(a => {
      const acctLines = lines.filter((l: any) => l.gl_account_id === a.id);
      const dr = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const cr = acctLines.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      // Revenue/income: credit normal (positive = credit > debit)
      // Expenses: debit normal (positive = debit > credit)
      const isRevenue = ['revenue', 'other_income'].includes(a.account_type);
      const amount = isRevenue ? cr - dr : dr - cr;
      return { category: a.account_type, account_code: a.account_code, account_name: a.account_name, amount };
    }).filter(l => Math.abs(l.amount) > 0.01);

    setPlData(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, PLLine[]> = {};
    plData.forEach(l => {
      if (!groups[l.category]) groups[l.category] = [];
      groups[l.category].push(l);
    });
    return groups;
  }, [plData]);

  const revenue = (grouped['revenue'] || []).reduce((s, l) => s + l.amount, 0);
  const cos = (grouped['cost_of_sales'] || []).reduce((s, l) => s + l.amount, 0);
  const grossProfit = revenue - cos;
  const opex = (grouped['expense'] || []).reduce((s, l) => s + l.amount, 0);
  const operatingProfit = grossProfit - opex;
  const otherIncome = (grouped['other_income'] || []).reduce((s, l) => s + l.amount, 0);
  const otherExpense = (grouped['other_expense'] || []).reduce((s, l) => s + l.amount, 0);
  const netProfit = operatingProfit + otherIncome - otherExpense;

  const categoryLabels: Record<string, string> = {
    revenue: 'Revenue', cost_of_sales: 'Cost of Sales', expense: 'Operating Expenses',
    other_income: 'Other Income', other_expense: 'Other Expenses',
  };

  const sections = ['revenue', 'cost_of_sales', 'expense', 'other_income', 'other_expense'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profit & Loss Statement</h1>
        <p className="text-sm text-muted-foreground mt-1">Income statement for the selected period</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label className="text-xs">Period</Label>
            <Select value={preset} onValueChange={applyPreset}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="qtd">Quarter to Date</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="fytd">FY to Date</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPreset('custom'); }} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPreset('custom'); }} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(plData, 'profit-and-loss')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? (
        <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Account</TableHead>
              <TableHead className="text-right pr-6">Amount (ZAR)</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {sections.map(cat => {
                const items = grouped[cat] || [];
                if (items.length === 0) return null;
                const catTotal = items.reduce((s, l) => s + l.amount, 0);
                return (
                  <> 
                    <TableRow key={`h-${cat}`} className="bg-muted/30">
                      <TableCell className="pl-6 font-semibold text-sm" colSpan={2}>{categoryLabels[cat]}</TableCell>
                    </TableRow>
                    {items.map(l => (
                      <TableRow key={l.account_code}>
                        <TableCell className="pl-10 text-sm">{l.account_code} — {l.account_name}</TableCell>
                        <TableCell className="text-right pr-6"><CurrencyDisplay amount={l.amount} /></TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t">
                      <TableCell className="pl-6 font-semibold text-sm">Total {categoryLabels[cat]}</TableCell>
                      <TableCell className="text-right pr-6 font-semibold"><CurrencyDisplay amount={catTotal} /></TableCell>
                    </TableRow>
                    {cat === 'cost_of_sales' && (
                      <TableRow className="bg-primary/5 font-bold">
                        <TableCell className="pl-6">Gross Profit</TableCell>
                        <TableCell className="text-right pr-6"><CurrencyDisplay amount={grossProfit} /></TableCell>
                      </TableRow>
                    )}
                    {cat === 'expense' && (
                      <TableRow className="bg-primary/5 font-bold">
                        <TableCell className="pl-6">Operating Profit</TableCell>
                        <TableCell className="text-right pr-6"><CurrencyDisplay amount={operatingProfit} /></TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
              <TableRow className="bg-primary/10 font-bold text-base">
                <TableCell className="pl-6">Net Profit</TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={netProfit} /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
