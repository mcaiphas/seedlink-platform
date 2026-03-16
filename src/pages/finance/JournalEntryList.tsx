import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function JournalEntryList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [entryLines, setEntryLines] = useState<any[]>([]);

  useEffect(() => {
    (async () => { setLoading(true); const { data: d } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false }); setData(d || []); setLoading(false); })();
  }, []);

  const openDetail = async (entry: any) => {
    setSelectedEntry(entry); setDetailOpen(true);
    const { data: lines } = await supabase.from('journal_entry_lines').select('*, gl_accounts(account_code, account_name)').eq('journal_entry_id', entry.id);
    setEntryLines(lines || []);
  };

  const filtered = useMemo(() => data.filter(r => {
    const ms = !search || r.journal_number?.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || r.status === statusFilter;
    return ms && mst;
  }), [data, search, statusFilter]);

  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);

  return (
    <div className="space-y-6">
      <DataPageShell title="Journal Entries" description="View commerce journal entries and their accounting impact">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search journals..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="posted">Posted</SelectItem></SelectContent></Select>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Journal #</TableHead><TableHead className="font-semibold">Date</TableHead><TableHead className="font-semibold">Reference</TableHead><TableHead className="font-semibold">Description</TableHead><TableHead className="font-semibold">Status</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(r => (
              <TableRow key={r.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => openDetail(r)}>
                <TableCell><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.journal_number}</span></div></TableCell>
                <TableCell className="text-sm">{r.entry_date}</TableCell>
                <TableCell><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{r.reference_type || '—'}</span></TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{r.description || '—'}</TableCell>
                <TableCell><Badge variant={r.status === 'posted' ? 'default' : 'secondary'} className="text-xs">{r.status}</Badge></TableCell>
              </TableRow>
            ))}{filtered.length === 0 && !loading && <EmptyState message="No journal entries found" colSpan={5} />}</TableBody></Table>
        </div>
      </DataPageShell>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Journal Entry — {selectedEntry?.journal_number}</DialogTitle><DialogDescription>{selectedEntry?.description || 'No description'}</DialogDescription></DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-2">
              <div className="flex gap-4 text-sm">
                <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{selectedEntry.entry_date}</p></div>
                <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Reference</p><p className="font-medium font-mono">{selectedEntry.reference_type || '—'}</p></div>
                <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Status</p><Badge variant={selectedEntry.status === 'posted' ? 'default' : 'secondary'} className="text-xs mt-1">{selectedEntry.status}</Badge></div>
              </div>
              <Separator />
              <div className="rounded-lg border overflow-hidden">
                <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Account</TableHead><TableHead className="font-semibold">Description</TableHead><TableHead className="font-semibold text-right">Debit</TableHead><TableHead className="font-semibold text-right">Credit</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {entryLines.map(l => (
                      <TableRow key={l.id}>
                        <TableCell><div><p className="font-mono text-sm">{l.gl_accounts?.account_code}</p><p className="text-xs text-muted-foreground">{l.gl_accounts?.account_name}</p></div></TableCell>
                        <TableCell className="text-sm">{l.line_description || '—'}</TableCell>
                        <TableCell className="text-right font-mono">{Number(l.debit_amount) > 0 ? fmt(Number(l.debit_amount)) : '—'}</TableCell>
                        <TableCell className="text-right font-mono">{Number(l.credit_amount) > 0 ? fmt(Number(l.credit_amount)) : '—'}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/20 font-semibold">
                      <TableCell colSpan={2} className="text-right">Totals</TableCell>
                      <TableCell className="text-right font-mono">{fmt(entryLines.reduce((s, l) => s + Number(l.debit_amount || 0), 0))}</TableCell>
                      <TableCell className="text-right font-mono">{fmt(entryLines.reduce((s, l) => s + Number(l.credit_amount || 0), 0))}</TableCell>
                    </TableRow>
                  </TableBody></Table>
              </div>
              {(() => { const d = entryLines.reduce((s, l) => s + Number(l.debit_amount || 0), 0); const c = entryLines.reduce((s, l) => s + Number(l.credit_amount || 0), 0); const balanced = Math.abs(d - c) < 0.01; return (
                <div className={`rounded-lg border p-3 text-sm flex items-center gap-2 ${balanced ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}>
                  <Badge variant={balanced ? 'default' : 'destructive'} className="text-xs">{balanced ? 'Balanced' : 'Unbalanced'}</Badge>
                  <span>{balanced ? 'Debits equal credits' : `Difference: ${fmt(Math.abs(d - c))}`}</span>
                </div>
              ); })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
