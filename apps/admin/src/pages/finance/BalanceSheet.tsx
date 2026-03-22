import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

interface BSLine { category: string; account_code: string; account_name: string; balance: number; }

export default function BalanceSheet() {
  const [loading, setLoading] = useState(true);
  const [asAtDate, setAsAtDate] = useState(new Date().toISOString().slice(0, 10));
  const [bsData, setBsData] = useState<BSLine[]>([]);

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: allLines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts) { setLoading(false); return; }

    const bsTypes = ['asset', 'liability', 'equity'];
    const incomeTypes = ['revenue', 'cost_of_sales', 'expense', 'other_income', 'other_expense'];
    const lines = (allLines || []).filter((l: any) => l.journal_entries?.status === 'posted' && l.journal_entries.entry_date <= asAtDate);

    // Balance sheet accounts
    const bsAccounts = accounts.filter(a => bsTypes.includes(a.account_type));
    const result: BSLine[] = bsAccounts.map(a => {
      const acctLines = lines.filter((l: any) => l.gl_account_id === a.id);
      const dr = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const cr = acctLines.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      // Assets: debit normal, Liabilities/Equity: credit normal
      const balance = a.account_type === 'asset' ? dr - cr : cr - dr;
      return { category: a.account_type, account_code: a.account_code, account_name: a.account_name, balance };
    }).filter(l => Math.abs(l.balance) > 0.01);

    // Retained earnings from income accounts
    const incAccounts = accounts.filter(a => incomeTypes.includes(a.account_type));
    let retainedEarnings = 0;
    incAccounts.forEach(a => {
      const acctLines = lines.filter((l: any) => l.gl_account_id === a.id);
      const dr = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const cr = acctLines.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      const isRev = ['revenue', 'other_income'].includes(a.account_type);
      retainedEarnings += isRev ? (cr - dr) : -(dr - cr);
    });

    if (Math.abs(retainedEarnings) > 0.01) {
      result.push({ category: 'equity', account_code: 'RE', account_name: 'Retained Earnings (current)', balance: retainedEarnings });
    }

    setBsData(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, BSLine[]> = {};
    bsData.forEach(l => {
      if (!groups[l.category]) groups[l.category] = [];
      groups[l.category].push(l);
    });
    return groups;
  }, [bsData]);

  const totalAssets = (grouped['asset'] || []).reduce((s, l) => s + l.balance, 0);
  const totalLiabilities = (grouped['liability'] || []).reduce((s, l) => s + l.balance, 0);
  const totalEquity = (grouped['equity'] || []).reduce((s, l) => s + l.balance, 0);

  const categoryLabels: Record<string, string> = { asset: 'Assets', liability: 'Liabilities', equity: 'Equity' };
  const sectionOrder = ['asset', 'liability', 'equity'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Balance Sheet</h1>
        <p className="text-sm text-muted-foreground mt-1">Financial position as at selected date</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">As at Date</Label><Input type="date" value={asAtDate} onChange={e => setAsAtDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(bsData, 'balance-sheet')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? (
        <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Account</TableHead>
              <TableHead className="text-right pr-6">Balance (ZAR)</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {sectionOrder.map(cat => {
                const items = grouped[cat] || [];
                if (items.length === 0) return null;
                const catTotal = items.reduce((s, l) => s + l.balance, 0);
                return (
                  <>
                    <TableRow key={`h-${cat}`} className="bg-muted/30">
                      <TableCell className="pl-6 font-semibold text-sm" colSpan={2}>{categoryLabels[cat]}</TableCell>
                    </TableRow>
                    {items.map(l => (
                      <TableRow key={l.account_code}>
                        <TableCell className="pl-10 text-sm">{l.account_code} — {l.account_name}</TableCell>
                        <TableCell className="text-right pr-6"><CurrencyDisplay amount={l.balance} /></TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t">
                      <TableCell className="pl-6 font-semibold text-sm">Total {categoryLabels[cat]}</TableCell>
                      <TableCell className="text-right pr-6 font-semibold"><CurrencyDisplay amount={catTotal} /></TableCell>
                    </TableRow>
                  </>
                );
              })}
              <TableRow className="bg-primary/10 font-bold text-base">
                <TableCell className="pl-6">Total Assets</TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={totalAssets} /></TableCell>
              </TableRow>
              <TableRow className="bg-primary/10 font-bold text-base">
                <TableCell className="pl-6">Total Liabilities + Equity</TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={totalLiabilities + totalEquity} /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
