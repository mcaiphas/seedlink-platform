import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell } from '@/components/DataPageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Building2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function BankReconciliationDashboard() {
  const [accountFilter, setAccountFilter] = useState('all');

  const { data: accounts = [] } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_accounts').select('*').eq('is_active', true).order('bank_name');
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['bank-txn-summary', accountFilter],
    queryFn: async () => {
      let q = supabase.from('bank_transactions').select('bank_account_id,debit_amount,credit_amount,reconciliation_status,transaction_date,description,reference_number,matched_entity_type');
      if (accountFilter !== 'all') q = q.eq('bank_account_id', accountFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const { data: recentImports = [] } = useQuery({
    queryKey: ['recent-imports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_statement_imports')
        .select('*, bank_accounts(bank_name)')
        .order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Compute stats
  const totalCredits = transactions.reduce((s: number, t: any) => s + Number(t.credit_amount || 0), 0);
  const totalDebits = transactions.reduce((s: number, t: any) => s + Number(t.debit_amount || 0), 0);
  const unmatched = transactions.filter((t: any) => t.reconciliation_status === 'unmatched');
  const reconciled = transactions.filter((t: any) => t.reconciliation_status === 'reconciled');
  const unmatchedAmount = unmatched.reduce((s: number, t: any) => s + Number(t.debit_amount || 0) + Number(t.credit_amount || 0), 0);
  const reconciledAmount = reconciled.reduce((s: number, t: any) => s + Number(t.debit_amount || 0) + Number(t.credit_amount || 0), 0);

  const bankBalance = accounts.reduce((s: number, a: any) => s + Number(a.opening_balance || 0), 0) + totalCredits - totalDebits;

  const fmt = (n: number) => `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  // Recent unmatched for review
  const recentUnmatched = unmatched.slice(0, 10);

  return (
    <DataPageShell title="Bank Reconciliation" subtitle="Overview of banking reconciliation status">
      <div className="mb-4">
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-[280px]"><SelectValue placeholder="All accounts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.bank_name} - {a.account_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm text-muted-foreground">Estimated Bank Balance</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{fmt(bankBalance)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm text-muted-foreground">Reconciled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reconciled.length}</p>
            <p className="text-sm text-muted-foreground">{fmt(reconciledAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <CardTitle className="text-sm text-muted-foreground">Unmatched</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{unmatched.length}</p>
            <p className="text-sm text-muted-foreground">{fmt(unmatchedAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{transactions.length}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unmatched for review */}
        <Card>
          <CardHeader><CardTitle className="text-base">Unmatched Transactions</CardTitle></CardHeader>
          <CardContent>
            {recentUnmatched.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">All transactions reconciled ✓</p>
            ) : (
              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUnmatched.map((t: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-nowrap text-sm">{t.transaction_date}</TableCell>
                        <TableCell className="text-sm max-w-[150px] truncate">{t.description}</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {Number(t.debit_amount) > 0 ? `-${Number(t.debit_amount).toFixed(2)}` : Number(t.credit_amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent imports */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Statement Imports</CardTitle></CardHeader>
          <CardContent>
            {recentImports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No imports yet</p>
            ) : (
              <div className="space-y-3">
                {recentImports.map((imp: any) => (
                  <div key={imp.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{imp.file_name}</p>
                      <p className="text-xs text-muted-foreground">{(imp as any).bank_accounts?.bank_name} · {new Date(imp.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{imp.imported_rows} rows</p>
                      {imp.duplicate_rows > 0 && <p className="text-xs text-amber-600">{imp.duplicate_rows} dupes</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Summary per Account */}
      {accounts.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-base">Account Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Opening Balance</TableHead>
                    <TableHead className="text-right">Total In</TableHead>
                    <TableHead className="text-right">Total Out</TableHead>
                    <TableHead className="text-right">Est. Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((a: any) => {
                    const acctTxns = transactions.filter((t: any) => t.bank_account_id === a.id);
                    const totalIn = acctTxns.reduce((s: number, t: any) => s + Number(t.credit_amount || 0), 0);
                    const totalOut = acctTxns.reduce((s: number, t: any) => s + Number(t.debit_amount || 0), 0);
                    const est = Number(a.opening_balance || 0) + totalIn - totalOut;
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.bank_name}</TableCell>
                        <TableCell>{a.account_name}</TableCell>
                        <TableCell className="capitalize">{a.account_type?.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(Number(a.opening_balance))}</TableCell>
                        <TableCell className="text-right font-mono text-primary">{fmt(totalIn)}</TableCell>
                        <TableCell className="text-right font-mono text-destructive">{fmt(totalOut)}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{fmt(est)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </DataPageShell>
  );
}
