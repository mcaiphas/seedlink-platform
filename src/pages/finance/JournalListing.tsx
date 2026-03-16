import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Scale } from 'lucide-react';
import { exportObjectsToCsv } from '@/lib/csv-export';

export default function JournalListing() {
  const [journals, setJournals] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const now = new Date();
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));

  async function load() {
    setLoading(true);
    const [{ data: je }, { data: jl }] = await Promise.all([
      supabase.from('journal_entries').select('*').gte('entry_date', startDate).lte('entry_date', endDate).order('entry_date', { ascending: false }).limit(500),
      supabase.from('journal_entry_lines').select('journal_entry_id,debit_amount,credit_amount'),
    ]);
    setJournals(je || []);
    setLines(jl || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const linesByJournal = useMemo(() => {
    const map: Record<string, { debit: number; credit: number }> = {};
    (lines || []).forEach(l => {
      if (!map[l.journal_entry_id]) map[l.journal_entry_id] = { debit: 0, credit: 0 };
      map[l.journal_entry_id].debit += l.debit_amount || 0;
      map[l.journal_entry_id].credit += l.credit_amount || 0;
    });
    return map;
  }, [lines]);

  const filtered = useMemo(() =>
    journals.filter(j => {
      if (search && !(j.journal_number || '').toLowerCase().includes(search.toLowerCase()) && !(j.description || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && j.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && j.reference_type !== sourceFilter) return false;
      return true;
    }), [journals, search, statusFilter, sourceFilter]);

  const sourceTypes = [...new Set(journals.map(j => j.reference_type).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Journal Listing</h1><p className="text-sm text-muted-foreground mt-1">All journal entries with totals</p></div>

      <Card className="shadow-sm"><CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div><Label className="text-xs">From</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-[160px]" /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-[160px]" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="reversed">Reversed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceTypes.map(s => <SelectItem key={s} value={s}>{(s || '').replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={load} size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={() => exportObjectsToCsv(filtered.map(j => ({
            journal_number: j.journal_number, date: j.entry_date, source: j.reference_type, status: j.status,
            debit: linesByJournal[j.id]?.debit || 0, credit: linesByJournal[j.id]?.credit || 0, description: j.description
          })), 'journal-listing')}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
        <div className="mt-3">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search journal # or description..." className="max-w-md" />
        </div>
      </CardContent></Card>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-muted rounded animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Scale} title="No journals found" description="Adjust filters or date range." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Journal #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Type</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(j => {
                const t = linesByJournal[j.id] || { debit: 0, credit: 0 };
                return (
                  <TableRow key={j.id}>
                    <TableCell className="pl-6 font-medium">{j.journal_number}</TableCell>
                    <TableCell><DateDisplay date={j.entry_date} /></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{(j.reference_type || '').replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{j.description || '—'}</TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={t.debit} /></TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={t.credit} /></TableCell>
                    <TableCell><StatusBadge type="document" value={j.status} /></TableCell>
                    <TableCell className="pr-6"><Badge variant="outline" className="text-xs capitalize">{j.journal_type || 'system'}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
