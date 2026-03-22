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

interface VATTxn {
  date: string;
  doc_type: string;
  reference: string;
  description: string;
  taxable_amount: number;
  vat_amount: number;
  vat_code: string;
  direction: string;
}

export default function VATTransactionReport() {
  const [loading, setLoading] = useState(true);
  const [txns, setTxns] = useState<VATTxn[]>([]);
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));

  async function loadData() {
    setLoading(true);
    // Pull journal lines that reference VAT GL accounts (account codes starting with '2300' or containing 'VAT')
    const [{ data: accounts }, { data: lines }] = await Promise.all([
      supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true),
      supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,line_description,journal_entries!inner(entry_date,status,reference_type,reference_id,description,journal_number)'),
    ]);

    if (!accounts || !lines) { setLoading(false); return; }

    const vatAcctIds = new Set(accounts.filter(a => a.account_name.toLowerCase().includes('vat') || a.account_code.startsWith('2300')).map(a => a.id));
    const acctMap = Object.fromEntries(accounts.map(a => [a.id, a]));

    const filtered = (lines as any[])
      .filter(l => vatAcctIds.has(l.gl_account_id) && l.journal_entries?.status === 'posted' && l.journal_entries.entry_date >= startDate && l.journal_entries.entry_date <= endDate);

    const result: VATTxn[] = filtered.map(l => {
      const je = l.journal_entries;
      const acct = acctMap[l.gl_account_id];
      const vatAmt = (l.credit_amount || 0) - (l.debit_amount || 0);
      return {
        date: je.entry_date,
        doc_type: je.reference_type || 'journal',
        reference: je.journal_number,
        description: l.line_description || je.description || '',
        taxable_amount: Math.abs(vatAmt) * (100 / 15), // estimate at 15%
        vat_amount: Math.abs(vatAmt),
        vat_code: acct?.account_name || '',
        direction: vatAmt > 0 ? 'Output' : 'Input',
      };
    });

    setTxns(result);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const totalVAT = txns.reduce((s, t) => s + t.vat_amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">VAT Transaction Report</h1>
        <p className="text-sm text-muted-foreground mt-1">All VAT-related transactions for the selected period</p>
      </div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Button onClick={loadData} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Generate</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(txns, 'vat-transactions')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </CardContent></Card>

      {loading ? <Skeleton className="h-64 w-full rounded-xl" /> : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead className="text-right">Taxable</TableHead>
              <TableHead className="text-right pr-6">VAT Amount</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {txns.map((t, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6">{t.date}</TableCell>
                  <TableCell className="capitalize">{t.doc_type.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="font-mono text-sm">{t.reference}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{t.description}</TableCell>
                  <TableCell>{t.direction}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={t.taxable_amount} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={t.vat_amount} /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="pl-6" colSpan={5}>Total</TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right pr-6"><CurrencyDisplay amount={totalVAT} /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
