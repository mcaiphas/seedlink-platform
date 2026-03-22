import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, RefreshCw } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

interface LedgerLine {
  date: string;
  journal_number: string;
  source: string;
  narration: string;
  debit: number;
  credit: number;
  running_balance: number;
}

export default function GeneralLedgerReport() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [ledgerLines, setLedgerLines] = useState<LedgerLine[]>([]);
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));

  useEffect(() => {
    supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true).order('account_code')
      .then(({ data }) => { setAccounts(data || []); setLoading(false); });
  }, []);

  async function loadLedger() {
    if (!selectedAccount) return;
    setLoading(true);

    // Get all posted lines for this account
    const { data: lines } = await supabase.from('journal_entry_lines')
      .select('debit_amount,credit_amount,line_description,journal_entries!inner(journal_number,entry_date,reference_type,description,status)')
      .eq('gl_account_id', selectedAccount)
      .order('created_at', { ascending: true });

    const posted = (lines || []).filter((l: any) => l.journal_entries?.status === 'posted');

    // Opening balance = sum of everything before startDate
    const beforeLines = posted.filter((l: any) => l.journal_entries.entry_date < startDate);
    let openBal = beforeLines.reduce((s: number, l: any) => s + (l.debit_amount || 0) - (l.credit_amount || 0), 0);

    // Period lines
    const periodLines = posted.filter((l: any) => l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

    let running = openBal;
    const result: LedgerLine[] = [
      { date: startDate, journal_number: '', source: '', narration: 'Opening Balance', debit: 0, credit: 0, running_balance: openBal }
    ];

    periodLines.forEach((l: any) => {
      const dr = l.debit_amount || 0;
      const cr = l.credit_amount || 0;
      running += dr - cr;
      result.push({
        date: l.journal_entries.entry_date,
        journal_number: l.journal_entries.journal_number,
        source: l.journal_entries.reference_type || '',
        narration: l.line_description || l.journal_entries.description || '',
        debit: dr,
        credit: cr,
        running_balance: running,
      });
    });

    setLedgerLines(result);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">General Ledger</h1>
        <p className="text-sm text-muted-foreground mt-1">Transaction detail by account</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[250px]">
            <Label className="text-xs">Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
              <SelectContent>
                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.account_code} - {a.account_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadLedger} size="sm" disabled={!selectedAccount}><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(ledgerLines, 'general-ledger')} disabled={ledgerLines.length === 0}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading && ledgerLines.length === 0 ? (
        <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
      ) : ledgerLines.length > 0 ? (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Journal #</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Narration</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right pr-6">Balance</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {ledgerLines.map((l, i) => (
                <TableRow key={i} className={i === 0 ? 'bg-muted/30 font-semibold' : ''}>
                  <TableCell className="pl-6"><DateDisplay date={l.date} /></TableCell>
                  <TableCell className="font-mono text-sm">{l.journal_number}</TableCell>
                  <TableCell className="text-xs capitalize">{l.source.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{l.narration}</TableCell>
                  <TableCell className="text-right">{l.debit > 0 ? <CurrencyDisplay amount={l.debit} /> : '—'}</TableCell>
                  <TableCell className="text-right">{l.credit > 0 ? <CurrencyDisplay amount={l.credit} /> : '—'}</TableCell>
                  <TableCell className="text-right pr-6 font-medium"><CurrencyDisplay amount={l.running_balance} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      ) : (
        <Card className="shadow-sm"><CardContent className="py-16 text-center text-muted-foreground">
          Select an account and date range, then click Generate.
        </CardContent></Card>
      )}
    </div>
  );
}
