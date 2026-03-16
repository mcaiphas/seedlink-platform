import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, DateDisplay, CurrencyDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Scale, Plus, Trash2 } from 'lucide-react';
import { logAudit } from '@/lib/audit';

interface JournalLine {
  gl_account_id: string;
  debit_amount: number;
  credit_amount: number;
  line_description: string;
}

export default function ManualJournals() {
  const [journals, setJournals] = useState<any[]>([]);
  const [glAccounts, setGlAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ entry_date: '', description: '' });
  const [lines, setLines] = useState<JournalLine[]>([
    { gl_account_id: '', debit_amount: 0, credit_amount: 0, line_description: '' },
    { gl_account_id: '', debit_amount: 0, credit_amount: 0, line_description: '' },
  ]);

  const load = () => {
    Promise.all([
      supabase.from('journal_entries').select('*').eq('journal_type', 'manual').order('created_at', { ascending: false }).limit(200),
      supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true).eq('posting_allowed', true).order('account_code'),
    ]).then(([{ data: j }, { data: gl }]) => {
      setJournals(j || []);
      setGlAccounts(gl || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() =>
    journals.filter(j => !search || (j.journal_number || '').toLowerCase().includes(search.toLowerCase()) || (j.description || '').toLowerCase().includes(search.toLowerCase())),
    [journals, search]);

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit_amount) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit_amount) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  function addLine() {
    setLines([...lines, { gl_account_id: '', debit_amount: 0, credit_amount: 0, line_description: '' }]);
  }

  function removeLine(idx: number) {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== idx));
  }

  function updateLine(idx: number, field: string, value: any) {
    setLines(lines.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  }

  async function postJournal() {
    if (!form.entry_date) { toast.error('Date is required'); return; }
    if (!isBalanced) { toast.error('Journal must balance (debits = credits)'); return; }
    if (lines.some(l => !l.gl_account_id)) { toast.error('All lines must have an account'); return; }

    const { data: { user } } = await supabase.auth.getUser();

    // Use RPC to create journal
    const { data: jeData, error: jeError } = await supabase.from('journal_entries').insert({
      journal_number: 'MJ-' + Date.now().toString(36).toUpperCase(),
      entry_date: form.entry_date,
      reference_type: 'manual',
      description: form.description || 'Manual Journal Entry',
      status: 'posted',
      created_by: user?.id,
      journal_type: 'manual',
    }).select('id').single();

    if (jeError) { toast.error(jeError.message); return; }

    const lineInserts = lines.filter(l => l.gl_account_id && (Number(l.debit_amount) > 0 || Number(l.credit_amount) > 0)).map(l => ({
      journal_entry_id: jeData.id,
      gl_account_id: l.gl_account_id,
      debit_amount: Number(l.debit_amount) || 0,
      credit_amount: Number(l.credit_amount) || 0,
      line_description: l.line_description || null,
    }));

    const { error: lineError } = await supabase.from('journal_entry_lines').insert(lineInserts);
    if (lineError) { toast.error(lineError.message); return; }

    toast.success('Journal posted');
    logAudit({ action: 'create_manual_journal', entity_type: 'journal_entry', entity_id: jeData.id });
    setShowCreate(false);
    setForm({ entry_date: '', description: '' });
    setLines([
      { gl_account_id: '', debit_amount: 0, credit_amount: 0, line_description: '' },
      { gl_account_id: '', debit_amount: 0, credit_amount: 0, line_description: '' },
    ]);
    load();
  }

  return (
    <PageShell title="Manual Journals" subtitle="Create and manage manual journal entries" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search journals..."
      actions={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" />New Journal</Button>}
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Scale} title="No manual journals" description="Create a manual journal entry to record adjustments." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Journal #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Created</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(j => (
                <TableRow key={j.id}>
                  <TableCell className="pl-6 font-medium">{j.journal_number}</TableCell>
                  <TableCell className="text-sm max-w-[250px] truncate">{j.description || '—'}</TableCell>
                  <TableCell><DateDisplay date={j.entry_date} /></TableCell>
                  <TableCell><StatusBadge type="document" value={j.status} /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={j.created_at} showTime /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Manual Journal</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Journal Date</Label><Input type="date" value={form.entry_date} onChange={e => setForm({...form, entry_date: e.target.value})} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Narration..." /></div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Journal Lines</h4>
                <Button variant="outline" size="sm" onClick={addLine}><Plus className="h-3.5 w-3.5 mr-1" />Add Line</Button>
              </div>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="w-[120px]">Debit</TableHead>
                  <TableHead className="w-[120px]">Credit</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {lines.map((line, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Select value={line.gl_account_id} onValueChange={v => updateLine(idx, 'gl_account_id', v)}>
                          <SelectTrigger className="text-xs"><SelectValue placeholder="Select account" /></SelectTrigger>
                          <SelectContent>
                            {glAccounts.map(g => (
                              <SelectItem key={g.id} value={g.id} className="text-xs">{g.account_code} - {g.account_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Input type="number" step="0.01" min="0" value={line.debit_amount || ''} onChange={e => updateLine(idx, 'debit_amount', e.target.value)} className="text-right tabular-nums" /></TableCell>
                      <TableCell><Input type="number" step="0.01" min="0" value={line.credit_amount || ''} onChange={e => updateLine(idx, 'credit_amount', e.target.value)} className="text-right tabular-nums" /></TableCell>
                      <TableCell><Input value={line.line_description} onChange={e => updateLine(idx, 'line_description', e.target.value)} placeholder="Notes" className="text-xs" /></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeLine(idx)} disabled={lines.length <= 2}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
              <div className="flex justify-end gap-6 text-sm font-semibold">
                <span>Debit: <CurrencyDisplay amount={totalDebit} /></span>
                <span>Credit: <CurrencyDisplay amount={totalCredit} /></span>
                <Badge variant={isBalanced ? 'default' : 'destructive'} className={isBalanced ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}>
                  {isBalanced ? 'Balanced' : 'Unbalanced'}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={postJournal} disabled={!isBalanced}>Post Journal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
