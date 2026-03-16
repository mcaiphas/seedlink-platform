import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { RefreshCw } from 'lucide-react';

interface ControlLine {
  account_code: string;
  account_name: string;
  gl_balance: number;
}

export default function VATControlReconciliation() {
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState<ControlLine[]>([]);
  const [asAtDate, setAsAtDate] = useState(new Date().toISOString().slice(0, 10));

  async function loadData() {
    setLoading(true);
    const [{ data: accounts }, { data: jLines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
    ]);
    if (!accounts || !jLines) { setLoading(false); return; }

    const vatAccounts = accounts.filter(a => a.account_name.toLowerCase().includes('vat') || a.account_code.startsWith('2300'));
    const posted = (jLines as any[]).filter(l => l.journal_entries?.status === 'posted' && l.journal_entries.entry_date <= asAtDate);

    const result: ControlLine[] = vatAccounts.map(acct => {
      const acctLines = posted.filter((l: any) => l.gl_account_id === acct.id);
      const dr = acctLines.reduce((s: number, l: any) => s + (l.debit_amount || 0), 0);
      const cr = acctLines.reduce((s: number, l: any) => s + (l.credit_amount || 0), 0);
      return { account_code: acct.account_code, account_name: acct.account_name, gl_balance: cr - dr };
    });

    setLines(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const totalBalance = lines.reduce((s, l) => s + l.gl_balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">VAT Control Reconciliation</h1>
        <p className="text-sm text-muted-foreground mt-1">Reconcile VAT control account balances</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">As at</Label><Input type="date" value={asAtDate} onChange={e => setAsAtDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
        </div>
      </CardContent></Card>

      {loading ? <Skeleton className="h-48 w-full rounded-xl" /> : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="pl-6">Account Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead className="text-right pr-6">GL Balance</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {lines.map(l => (
                <TableRow key={l.account_code}>
                  <TableCell className="pl-6 font-mono">{l.account_code}</TableCell>
                  <TableCell>{l.account_name}</TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={l.gl_balance} /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="pl-6" colSpan={2}>Net VAT Balance</TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={totalBalance} /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <div className="text-center">
        <Badge variant={totalBalance >= 0 ? 'destructive' : 'default'} className="text-sm">
          {totalBalance >= 0 ? `VAT Payable: ZAR ${totalBalance.toFixed(2)}` : `VAT Refundable: ZAR ${Math.abs(totalBalance).toFixed(2)}`}
        </Badge>
      </div>
    </div>
  );
}
