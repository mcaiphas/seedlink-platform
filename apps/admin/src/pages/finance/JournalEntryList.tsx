import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Scale } from 'lucide-react';

export default function JournalEntryList() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [lines, setLines] = useState<any[]>([]);
  const [glMap, setGlMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      supabase.from('journal_entries').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('gl_accounts').select('id, account_code, account_name'),
    ]).then(([{ data: jes }, { data: gls }]) => {
      setEntries(jes || []);
      setGlMap(Object.fromEntries((gls || []).map(g => [g.id, `${g.account_code} - ${g.account_name}`])));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    entries.filter(e => {
      if (search && !(e.journal_number || '').toLowerCase().includes(search.toLowerCase()) && !(e.description || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      return true;
    }), [entries, search, statusFilter]);

  async function openDetail(je: any) {
    setDetail(je);
    const { data } = await supabase.from('journal_entry_lines').select('*').eq('journal_entry_id', je.id);
    setLines(data || []);
  }

  return (
    <PageShell title="Journal Entries" subtitle="Financial journal entries and postings" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search journals..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Scale} title="No journal entries" description="Journal entries are auto-generated from commerce operations." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Journal #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(e)}>
                  <TableCell className="pl-6 font-medium">{e.journal_number}</TableCell>
                  <TableCell className="text-sm max-w-[250px] truncate">{e.description || '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{e.reference_type?.replace(/_/g, ' ') || '—'}</Badge></TableCell>
                  <TableCell><StatusBadge type="document" value={e.status} /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={e.entry_date} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Journal {detail?.journal_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.entry_date} /></div>
                <div><p className="text-xs text-muted-foreground">Reference</p><Badge variant="outline" className="capitalize text-xs">{detail.reference_type?.replace(/_/g, ' ')}</Badge></div>
              </div>
              {detail.description && <p className="text-sm text-muted-foreground border rounded-lg p-3">{detail.description}</p>}
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Journal Lines</h4>
                <Table>
                  <TableHeader><TableRow><TableHead>Account</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {lines.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="text-sm">{glMap[l.gl_account_id] || l.gl_account_id?.slice(0, 8)}</TableCell>
                        <TableCell className="text-right tabular-nums">{l.debit_amount > 0 ? <CurrencyDisplay amount={l.debit_amount} /> : '—'}</TableCell>
                        <TableCell className="text-right tabular-nums">{l.credit_amount > 0 ? <CurrencyDisplay amount={l.credit_amount} /> : '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{l.line_description || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator className="my-2" />
                <div className="flex justify-end gap-8 text-sm font-semibold">
                  <div>Total Debit: <CurrencyDisplay amount={lines.reduce((s, l) => s + (l.debit_amount || 0), 0)} /></div>
                  <div>Total Credit: <CurrencyDisplay amount={lines.reduce((s, l) => s + (l.credit_amount || 0), 0)} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
