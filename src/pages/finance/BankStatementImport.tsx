import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logAudit } from '@/lib/audit';
import { toast } from 'sonner';
import { DataPageShell } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, AlertTriangle } from 'lucide-react';

interface ParsedRow {
  transaction_date: string;
  description: string;
  reference_number: string;
  debit_amount: number;
  credit_amount: number;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase().split(',').map((h) => h.trim().replace(/"/g, ''));
  const dateIdx = header.findIndex((h) => h.includes('date'));
  const descIdx = header.findIndex((h) => h.includes('desc') || h.includes('narr') || h.includes('detail'));
  const refIdx = header.findIndex((h) => h.includes('ref'));
  const debitIdx = header.findIndex((h) => h.includes('debit') || h.includes('withdrawal'));
  const creditIdx = header.findIndex((h) => h.includes('credit') || h.includes('deposit'));
  const amountIdx = header.findIndex((h) => h === 'amount');

  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/"/g, ''));
    const rawAmount = amountIdx >= 0 ? Number(cols[amountIdx]?.replace(/[^\d.-]/g, '') || 0) : 0;
    let debit = debitIdx >= 0 ? Math.abs(Number(cols[debitIdx]?.replace(/[^\d.-]/g, '') || 0)) : 0;
    let credit = creditIdx >= 0 ? Math.abs(Number(cols[creditIdx]?.replace(/[^\d.-]/g, '') || 0)) : 0;
    if (amountIdx >= 0 && debitIdx < 0 && creditIdx < 0) {
      if (rawAmount < 0) debit = Math.abs(rawAmount);
      else credit = rawAmount;
    }
    return {
      transaction_date: cols[dateIdx] || '',
      description: cols[descIdx >= 0 ? descIdx : 1] || '',
      reference_number: cols[refIdx >= 0 ? refIdx : 2] || '',
      debit_amount: debit,
      credit_amount: credit,
    };
  }).filter((r) => r.transaction_date);
}

export default function BankStatementImport() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [accountId, setAccountId] = useState('');
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [duplicates, setDuplicates] = useState(0);
  const [importOpen, setImportOpen] = useState(false);

  const { data: accounts = [] } = useQuery({
    queryKey: ['bank-accounts-active'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_accounts').select('id,bank_name,account_name').eq('is_active', true).order('bank_name');
      if (error) throw error;
      return data;
    },
  });

  const { data: imports = [], isLoading } = useQuery({
    queryKey: ['bank-statement-imports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_statement_imports').select('*, bank_accounts(bank_name, account_name)').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string);
      setPreview(rows);
      setImportOpen(true);
    };
    reader.readAsText(file);
  };

  const doImport = useMutation({
    mutationFn: async () => {
      if (!accountId || preview.length === 0) throw new Error('Select account and file');

      // Check for duplicates
      const { data: existing } = await supabase
        .from('bank_transactions')
        .select('transaction_date,debit_amount,credit_amount,reference_number')
        .eq('bank_account_id', accountId);

      const existingSet = new Set((existing || []).map((e: any) => `${e.transaction_date}|${e.debit_amount}|${e.credit_amount}|${e.reference_number}`));
      const unique: ParsedRow[] = [];
      let dupes = 0;
      for (const row of preview) {
        const key = `${row.transaction_date}|${row.debit_amount}|${row.credit_amount}|${row.reference_number}`;
        if (existingSet.has(key)) { dupes++; continue; }
        existingSet.add(key);
        unique.push(row);
      }
      setDuplicates(dupes);

      // Create import record
      const { data: imp, error: impErr } = await supabase.from('bank_statement_imports').insert({
        bank_account_id: accountId,
        file_name: fileName,
        file_format: 'csv',
        total_rows: preview.length,
        imported_rows: unique.length,
        duplicate_rows: dupes,
        import_status: 'completed',
        imported_by: user?.id,
        imported_at: new Date().toISOString(),
      }).select('id').single();
      if (impErr) throw impErr;

      // Insert transactions in batches
      if (unique.length > 0) {
        const batch = unique.map((r) => ({
          bank_account_id: accountId,
          transaction_date: r.transaction_date,
          description: r.description,
          reference_number: r.reference_number,
          debit_amount: r.debit_amount,
          credit_amount: r.credit_amount,
          source: 'bank_import',
          statement_import_id: imp.id,
        }));
        const { error } = await supabase.from('bank_transactions').insert(batch);
        if (error) throw error;
      }

      logAudit({ action: 'import_statement', entity_type: 'bank_statement_import', entity_id: imp.id, new_values: { rows: unique.length, duplicates: dupes } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-statement-imports'] });
      qc.invalidateQueries({ queryKey: ['bank-transactions'] });
      toast.success(`Imported ${preview.length - duplicates} transactions (${duplicates} duplicates skipped)`);
      setImportOpen(false);
      setPreview([]);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DataPageShell title="Bank Statement Import" subtitle="Upload and import bank statements">
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Imports</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{imports.length}</p></CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select bank account" /></SelectTrigger>
          <SelectContent>
            {accounts.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.bank_name} - {a.account_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <Button onClick={() => fileRef.current?.click()} disabled={!accountId}>
          <Upload className="h-4 w-4 mr-1" /> Upload CSV
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Total Rows</TableHead>
              <TableHead className="text-right">Imported</TableHead>
              <TableHead className="text-right">Duplicates</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : imports.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No imports yet</TableCell></TableRow>
            ) : imports.map((i: any) => (
              <TableRow key={i.id}>
                <TableCell className="whitespace-nowrap">{new Date(i.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{(i as any).bank_accounts?.bank_name || '—'}</TableCell>
                <TableCell className="flex items-center gap-1"><FileSpreadsheet className="h-4 w-4" />{i.file_name}</TableCell>
                <TableCell className="text-right">{i.total_rows}</TableCell>
                <TableCell className="text-right">{i.imported_rows}</TableCell>
                <TableCell className="text-right">{i.duplicate_rows > 0 && <span className="text-amber-600">{i.duplicate_rows}</span>}{i.duplicate_rows === 0 && '0'}</TableCell>
                <TableCell><Badge variant="default" className="capitalize">{i.import_status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader><DialogTitle>Preview Import — {fileName}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">{preview.length} rows parsed</p>
          <div className="border rounded-lg overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.slice(0, 50).map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.transaction_date}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.description}</TableCell>
                    <TableCell className="font-mono text-sm">{r.reference_number}</TableCell>
                    <TableCell className="text-right font-mono">{r.debit_amount > 0 ? r.debit_amount.toFixed(2) : '—'}</TableCell>
                    <TableCell className="text-right font-mono">{r.credit_amount > 0 ? r.credit_amount.toFixed(2) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {preview.length > 50 && <p className="text-sm text-muted-foreground">Showing first 50 of {preview.length} rows</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button onClick={() => doImport.mutate()} disabled={doImport.isPending}>
              {doImport.isPending ? 'Importing…' : `Import ${preview.length} Transactions`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
