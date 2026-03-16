import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

export default function CashMovementSummary() {
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));
  const [data, setData] = useState({ openingBalance: 0, inflows: 0, outflows: 0, closingBalance: 0 });

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: lines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts || !lines) { setLoading(false); return; }

    // Bank/cash accounts (code 1000-1099)
    const bankAccounts = accounts.filter(a => a.account_code >= '1000' && a.account_code < '1100');
    const bankIds = new Set(bankAccounts.map(a => a.id));
    const posted = (lines as any[]).filter(l => l.journal_entries?.status === 'posted' && bankIds.has(l.gl_account_id));

    const beforePeriod = posted.filter((l: any) => l.journal_entries.entry_date < startDate);
    const inPeriod = posted.filter((l: any) => l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

    const openingBalance = beforePeriod.reduce((s: number, l: any) => s + (l.debit_amount || 0) - (l.credit_amount || 0), 0);
    const inflows = inPeriod.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
    const outflows = inPeriod.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);

    setData({ openingBalance, inflows, outflows, closingBalance: openingBalance + inflows - outflows });
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const exportData = [
    { item: 'Opening Balance', amount: data.openingBalance },
    { item: 'Total Inflows', amount: data.inflows },
    { item: 'Total Outflows', amount: data.outflows },
    { item: 'Closing Balance', amount: data.closingBalance },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cash Movement Summary</h1>
        <p className="text-sm text-muted-foreground mt-1">Cash inflows and outflows from bank accounts</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(exportData, 'cash-movement')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? <Skeleton className="h-48 w-full rounded-xl" /> : (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Opening Balance', value: data.openingBalance, color: 'border-l-4 border-l-blue-500' },
            { label: 'Cash Inflows', value: data.inflows, color: 'border-l-4 border-l-emerald-500' },
            { label: 'Cash Outflows', value: data.outflows, color: 'border-l-4 border-l-red-500' },
            { label: 'Closing Balance', value: data.closingBalance, color: 'border-l-4 border-l-primary' },
          ].map(item => (
            <Card key={item.label} className={`shadow-sm ${item.color}`}>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold"><CurrencyDisplay amount={item.value} /></div></CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
