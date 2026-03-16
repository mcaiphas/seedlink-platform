import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

interface VAT201Data {
  output_vat: number;
  input_vat: number;
  net_vat: number;
  output_details: { account: string; amount: number }[];
  input_details: { account: string; amount: number }[];
}

export default function VAT201Report() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VAT201Data>({ output_vat: 0, input_vat: 0, net_vat: 0, output_details: [], input_details: [] });
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10));

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: lines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts || !lines) { setLoading(false); return; }

    const vatAccounts = accounts.filter(a => a.account_name.toLowerCase().includes('vat') || a.account_code.startsWith('2300'));
    const posted = (lines as any[]).filter(l => l.journal_entries?.status === 'posted' && l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

    let output_vat = 0;
    let input_vat = 0;
    const output_details: { account: string; amount: number }[] = [];
    const input_details: { account: string; amount: number }[] = [];

    for (const acct of vatAccounts) {
      const acctLines = posted.filter((l: any) => l.gl_account_id === acct.id);
      const cr = acctLines.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      const dr = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const net = cr - dr;

      const isOutput = acct.account_name.toLowerCase().includes('output') || acct.account_code === '2300';
      if (isOutput || net > 0) {
        output_vat += Math.abs(net);
        output_details.push({ account: `${acct.account_code} — ${acct.account_name}`, amount: Math.abs(net) });
      } else {
        input_vat += Math.abs(net);
        input_details.push({ account: `${acct.account_code} — ${acct.account_name}`, amount: Math.abs(net) });
      }
    }

    setData({ output_vat, input_vat, net_vat: output_vat - input_vat, output_details, input_details });
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SARS VAT201 Working Report</h1>
        <p className="text-sm text-muted-foreground mt-1">VAT return summary for the selected tax period</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">Tax Period From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">Tax Period To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv([
            { field: 'Output VAT', amount: data.output_vat },
            { field: 'Input VAT', amount: data.input_vat },
            { field: 'Net VAT Payable', amount: data.net_vat },
          ], 'vat201-working')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? <Skeleton className="h-64 w-full rounded-xl" /> : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Output VAT (Sales)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"><CurrencyDisplay amount={data.output_vat} /></div>
              <div className="mt-4 space-y-2">
                {data.output_details.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[150px]">{d.account}</span>
                    <CurrencyDisplay amount={d.amount} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Input VAT (Purchases)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"><CurrencyDisplay amount={data.input_vat} /></div>
              <div className="mt-4 space-y-2">
                {data.input_details.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[150px]">{d.account}</span>
                    <CurrencyDisplay amount={d.amount} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-2 border-primary/20">
            <CardHeader><CardTitle className="text-sm">Net VAT Payable / (Refundable)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold"><CurrencyDisplay amount={data.net_vat} /></div>
              <div className="mt-4">
                <Badge variant={data.net_vat >= 0 ? 'destructive' : 'default'} className="text-sm">
                  {data.net_vat >= 0 ? 'VAT Payable to SARS' : 'VAT Refundable from SARS'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
