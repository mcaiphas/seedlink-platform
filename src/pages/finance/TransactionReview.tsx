import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DataPageShell } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';

const CLASSIFICATIONS = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'fee', label: 'Bank Fee' },
  { value: 'tax', label: 'Tax' },
  { value: 'loan', label: 'Loan' },
  { value: 'capital_contribution', label: 'Capital Contribution' },
  { value: 'unknown', label: 'Unknown' },
];

const EXPENSE_CATEGORIES = [
  'general_expenses', 'communication', 'salaries', 'rent', 'transport',
  'bank_charges', 'utilities', 'insurance', 'marketing', 'repairs',
  'office_supplies', 'professional_fees', 'subscriptions',
];

const INCOME_CATEGORIES = [
  'sales', 'loans', 'capital_introduced', 'transport_income',
  'training_income', 'interest_received', 'other_income',
];

export default function TransactionReview() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [classifyOpen, setClassifyOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [form, setForm] = useState({
    classification: 'unknown', income_category: '', expense_category: '',
    business_line: '', branch: '', segment: '', notes: '',
  });

  // Get unreviewed bank transactions (those without a review record or pending)
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transaction-review', statusFilter],
    queryFn: async () => {
      // First get all bank transactions
      const { data: txns, error: txnErr } = await supabase
        .from('bank_transactions')
        .select('*, bank_accounts(bank_name, account_name)')
        .order('transaction_date', { ascending: false })
        .limit(500);
      if (txnErr) throw txnErr;

      // Get existing reviews
      const txnIds = (txns || []).map(t => t.id);
      let reviews: any[] = [];
      if (txnIds.length > 0) {
        const { data: r } = await supabase
          .from('bank_transaction_reviews')
          .select('*')
          .in('bank_transaction_id', txnIds);
        reviews = r || [];
      }

      const reviewMap = new Map(reviews.map(r => [r.bank_transaction_id, r]));

      return (txns || []).map(t => ({
        ...t,
        review: reviewMap.get(t.id) || null,
      })).filter(t => {
        if (statusFilter === 'pending') return !t.review || t.review.review_status === 'pending';
        if (statusFilter === 'classified') return t.review?.review_status === 'classified';
        if (statusFilter === 'posted') return t.review?.review_status === 'posted';
        return true;
      });
    },
  });

  const classifyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTxn) return;
      const payload: any = {
        bank_transaction_id: selectedTxn.id,
        classification: form.classification,
        income_category: form.classification === 'income' ? form.income_category || null : null,
        expense_category: form.classification === 'expense' ? form.expense_category || null : null,
        business_line: form.business_line || null,
        branch: form.branch || null,
        segment: form.segment || null,
        notes: form.notes || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        review_status: 'classified',
        updated_at: new Date().toISOString(),
      };

      if (selectedTxn.review) {
        const { error } = await supabase.from('bank_transaction_reviews').update(payload).eq('id', selectedTxn.review.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bank_transaction_reviews').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transaction-review'] });
      toast.success('Transaction classified');
      setClassifyOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  function openClassify(txn: any) {
    setSelectedTxn(txn);
    const r = txn.review;
    setForm({
      classification: r?.classification || (Number(txn.credit_amount) > 0 ? 'income' : Number(txn.debit_amount) > 0 ? 'expense' : 'unknown'),
      income_category: r?.income_category || '',
      expense_category: r?.expense_category || '',
      business_line: r?.business_line || '',
      branch: r?.branch || '',
      segment: r?.segment || '',
      notes: r?.notes || '',
    });
    setClassifyOpen(true);
  }

  const pendingCount = transactions.length;
  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v || 0);

  const classificationBadge = (cls: string) => {
    const colors: Record<string, string> = {
      income: 'bg-emerald-500/10 text-emerald-700',
      expense: 'bg-red-500/10 text-red-700',
      transfer: 'bg-blue-500/10 text-blue-700',
      fee: 'bg-amber-500/10 text-amber-700',
      tax: 'bg-purple-500/10 text-purple-700',
      loan: 'bg-indigo-500/10 text-indigo-700',
      unknown: 'bg-muted text-muted-foreground',
    };
    return <Badge variant="outline" className={`text-[10px] capitalize ${colors[cls] || ''}`}>{cls}</Badge>;
  };

  return (
    <DataPageShell title="Transaction Review" description="Classify and allocate imported bank transactions before reconciliation">
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex-1 min-w-[180px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending Review</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="classified">Classified</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      ) : transactions.length === 0 ? (
        <Card className="py-16 text-center">
          <CheckCircle className="h-10 w-10 mx-auto text-emerald-500/40 mb-3" />
          <p className="text-muted-foreground">No transactions pending review</p>
        </Card>
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6 whitespace-nowrap text-sm">{t.transaction_date ? new Date(t.transaction_date).toLocaleDateString() : '—'}</TableCell>
                  <TableCell className="text-sm">{t.bank_accounts?.bank_name || '—'}</TableCell>
                  <TableCell className="text-sm max-w-[220px] truncate">{t.description || '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{t.reference_number || '—'}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{Number(t.debit_amount) > 0 ? fmt(t.debit_amount) : '—'}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{Number(t.credit_amount) > 0 ? fmt(t.credit_amount) : '—'}</TableCell>
                  <TableCell>{t.review ? classificationBadge(t.review.classification) : <Badge variant="outline" className="text-[10px] text-muted-foreground">Unclassified</Badge>}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openClassify(t)}>
                      <ClipboardList className="h-3 w-3 mr-1" /> Classify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={classifyOpen} onOpenChange={setClassifyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Classify Transaction</DialogTitle></DialogHeader>
          {selectedTxn && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{selectedTxn.transaction_date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span className="text-right max-w-[250px] truncate">{selectedTxn.description}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Debit</span><span className="font-mono">{fmt(selectedTxn.debit_amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Credit</span><span className="font-mono">{fmt(selectedTxn.credit_amount)}</span></div>
              </div>

              <div>
                <Label>Classification *</Label>
                <Select value={form.classification} onValueChange={v => setForm(f => ({ ...f, classification: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CLASSIFICATIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {form.classification === 'income' && (
                <div>
                  <Label>Income Category</Label>
                  <Select value={form.income_category} onValueChange={v => setForm(f => ({ ...f, income_category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{INCOME_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}

              {form.classification === 'expense' && (
                <div>
                  <Label>Expense Category</Label>
                  <Select value={form.expense_category} onValueChange={v => setForm(f => ({ ...f, expense_category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div><Label>Business Line</Label><Input value={form.business_line} onChange={e => setForm(f => ({ ...f, business_line: e.target.value }))} placeholder="e.g. Seeds" /></div>
                <div><Label>Branch</Label><Input value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} /></div>
                <div><Label>Segment</Label><Input value={form.segment} onChange={e => setForm(f => ({ ...f, segment: e.target.value }))} /></div>
              </div>

              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setClassifyOpen(false)}>Cancel</Button>
            <Button onClick={() => classifyMutation.mutate()} disabled={classifyMutation.isPending}>
              {classifyMutation.isPending ? 'Saving...' : 'Save Classification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
