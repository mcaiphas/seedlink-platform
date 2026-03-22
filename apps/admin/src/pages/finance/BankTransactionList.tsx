import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logAudit } from '@/lib/audit';
import { toast } from 'sonner';
import { DataPageShell } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Link2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  unmatched: 'destructive',
  matched: 'default',
  reconciled: 'secondary',
  ignored: 'outline',
};

export default function BankTransactionList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [accountFilter, setAccountFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [matchType, setMatchType] = useState('bank_fee');
  const [matchNotes, setMatchNotes] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    bank_account_id: '', transaction_date: new Date().toISOString().slice(0, 10),
    description: '', reference_number: '', debit_amount: 0, credit_amount: 0, category: '', notes: '',
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_accounts').select('id,bank_name,account_name').eq('is_active', true).order('bank_name');
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['bank-transactions', accountFilter, statusFilter],
    queryFn: async () => {
      let q = supabase.from('bank_transactions').select('*, bank_accounts(bank_name, account_name)').order('transaction_date', { ascending: false }).limit(500);
      if (accountFilter !== 'all') q = q.eq('bank_account_id', accountFilter);
      if (statusFilter !== 'all') q = q.eq('reconciliation_status', statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const reconcile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('bank_transactions').update({
        reconciliation_status: matchType === 'ignored' ? 'ignored' : 'reconciled',
        matched_entity_type: matchType,
        matched_by: user?.id,
        matched_at: new Date().toISOString(),
        notes: matchNotes || selectedTxn.notes,
      }).eq('id', selectedTxn.id);
      if (error) throw error;
      logAudit({ action: 'reconcile', entity_type: 'bank_transaction', entity_id: selectedTxn.id, new_values: { matchType } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-transactions'] });
      toast.success('Transaction reconciled');
      setReconcileOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addManual = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('bank_transactions').insert({
        ...manualForm,
        debit_amount: Number(manualForm.debit_amount),
        credit_amount: Number(manualForm.credit_amount),
        source: 'manual',
        reconciliation_status: 'unmatched',
      });
      if (error) throw error;
      logAudit({ action: 'manual_entry', entity_type: 'bank_transaction' });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-transactions'] });
      toast.success('Transaction added');
      setManualOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = transactions.filter((t: any) =>
    `${t.description} ${t.reference_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const unmatched = transactions.filter((t: any) => t.reconciliation_status === 'unmatched').length;

  const openReconcile = (t: any) => {
    setSelectedTxn(t);
    setMatchType('bank_fee');
    setMatchNotes('');
    setReconcileOpen(true);
  };

  return (
    <DataPageShell title="Bank Transactions" description="View and reconcile bank transactions">
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex-1 min-w-[180px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Transactions</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{transactions.length}</p></CardContent>
        </Card>
        <Card className="flex-1 min-w-[180px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Unmatched</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-destructive">{unmatched}</p></CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search description / reference…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All accounts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.bank_name} - {a.account_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="unmatched">Unmatched</SelectItem>
            <SelectItem value="matched">Matched</SelectItem>
            <SelectItem value="reconciled">Reconciled</SelectItem>
            <SelectItem value="ignored">Ignored</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => { setManualForm({ ...manualForm, bank_account_id: accounts[0]?.id || '' }); setManualOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Manual Entry
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No transactions found</TableCell></TableRow>
            ) : filtered.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell className="whitespace-nowrap">{t.transaction_date}</TableCell>
                <TableCell className="text-sm">{(t as any).bank_accounts?.bank_name || '—'}</TableCell>
                <TableCell className="max-w-[200px] truncate">{t.description || '—'}</TableCell>
                <TableCell className="font-mono text-sm">{t.reference_number || '—'}</TableCell>
                <TableCell className="text-right font-mono">{Number(t.debit_amount) > 0 ? `R ${Number(t.debit_amount).toFixed(2)}` : '—'}</TableCell>
                <TableCell className="text-right font-mono">{Number(t.credit_amount) > 0 ? `R ${Number(t.credit_amount).toFixed(2)}` : '—'}</TableCell>
                <TableCell>
                  <Badge variant={(statusColors[t.reconciliation_status] as any) || 'outline'} className="capitalize">
                    {t.reconciliation_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm capitalize">{t.source?.replace(/_/g, ' ')}</TableCell>
                <TableCell>
                  {t.reconciliation_status === 'unmatched' && (
                    <Button variant="ghost" size="sm" onClick={() => openReconcile(t)}>
                      <Link2 className="h-4 w-4 mr-1" /> Reconcile
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Manual Reconciliation Dialog */}
      <Dialog open={reconcileOpen} onOpenChange={setReconcileOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reconcile Transaction</DialogTitle></DialogHeader>
          {selectedTxn && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
                <p><strong>Date:</strong> {selectedTxn.transaction_date}</p>
                <p><strong>Description:</strong> {selectedTxn.description}</p>
                <p><strong>Amount:</strong> R {(Number(selectedTxn.debit_amount) || Number(selectedTxn.credit_amount)).toFixed(2)}</p>
                <p><strong>Reference:</strong> {selectedTxn.reference_number || '—'}</p>
              </div>
              <div>
                <Label>Match Type</Label>
                <Select value={matchType} onValueChange={setMatchType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_payment">Customer Payment</SelectItem>
                    <SelectItem value="supplier_payment">Supplier Payment</SelectItem>
                    <SelectItem value="invoice_payment">Invoice Payment</SelectItem>
                    <SelectItem value="bank_fee">Bank Fee</SelectItem>
                    <SelectItem value="interest">Interest</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                    <SelectItem value="ignored">Ignore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={matchNotes} onChange={(e) => setMatchNotes(e.target.value)} placeholder="Reconciliation notes…" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReconcileOpen(false)}>Cancel</Button>
            <Button onClick={() => reconcile.mutate()} disabled={reconcile.isPending}>
              {reconcile.isPending ? 'Saving…' : 'Reconcile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Entry Dialog */}
      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Manual Transaction</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Bank Account</Label>
              <Select value={manualForm.bank_account_id} onValueChange={(v) => setManualForm({ ...manualForm, bank_account_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.bank_name} - {a.account_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date</Label><Input type="date" value={manualForm.transaction_date} onChange={(e) => setManualForm({ ...manualForm, transaction_date: e.target.value })} /></div>
              <div><Label>Reference</Label><Input value={manualForm.reference_number} onChange={(e) => setManualForm({ ...manualForm, reference_number: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Input value={manualForm.description} onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Debit (Out)</Label><Input type="number" value={manualForm.debit_amount} onChange={(e) => setManualForm({ ...manualForm, debit_amount: Number(e.target.value) })} /></div>
              <div><Label>Credit (In)</Label><Input type="number" value={manualForm.credit_amount} onChange={(e) => setManualForm({ ...manualForm, credit_amount: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Category</Label><Input value={manualForm.category} onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })} placeholder="e.g. Bank Fee, Interest" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualOpen(false)}>Cancel</Button>
            <Button onClick={() => addManual.mutate()} disabled={!manualForm.bank_account_id || addManual.isPending}>
              {addManual.isPending ? 'Adding…' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
