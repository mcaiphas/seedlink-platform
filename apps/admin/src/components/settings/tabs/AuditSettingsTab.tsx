import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SettingsSection } from '../SettingsSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { exportToCsv } from '@/lib/csv-export';
import { toast } from 'sonner';

const PAGE_SIZE = 25;

export function AuditSettingsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    supabase
      .from('audit_logs')
      .select('*, profiles:actor_user_id(full_name)')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, []);

  const actionTypes = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.action));
    return Array.from(set).sort();
  }, [logs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((l) => {
      const matchSearch = !q || l.action.toLowerCase().includes(q) || l.entity_type.toLowerCase().includes(q) || (l.entity_id || '').toLowerCase().includes(q);
      const matchAction = filterAction === 'all' || l.action === filterAction;
      return matchSearch && matchAction;
    });
  }, [logs, search, filterAction]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  useEffect(() => { setPage(0); }, [search, filterAction]);

  if (loading) return <Skeleton className="h-64 w-full" />;

  const actionColor = (action: string) => {
    if (action.includes('delete')) return 'destructive' as const;
    if (action.includes('create') || action.includes('assign')) return 'default' as const;
    return 'secondary' as const;
  };

  function handleExport() {
    const headers = ['Timestamp', 'Action', 'Entity Type', 'Entity ID', 'Actor', 'IP'];
    const rows = filtered.map((l) => [
      format(new Date(l.created_at), 'yyyy-MM-dd HH:mm:ss'), l.action, l.entity_type,
      l.entity_id || '', (l.profiles as any)?.full_name || '—', l.ip_address || '',
    ]);
    exportToCsv('audit-logs', headers, rows);
    toast.success('Audit logs exported');
  }

  return (
    <div className="space-y-6">
      <SettingsSection title="Audit Logs" description="System activity log for compliance and troubleshooting.">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search logs…" className="h-8 pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="h-8 w-44 text-sm"><SelectValue placeholder="All Actions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actionTypes.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 ml-auto">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Timestamp</TableHead>
                <TableHead className="text-xs">Actor</TableHead>
                <TableHead className="text-xs">Action</TableHead>
                <TableHead className="text-xs">Entity</TableHead>
                <TableHead className="text-xs">Entity ID</TableHead>
                <TableHead className="text-xs">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No audit logs found</TableCell></TableRow>
              )}
              {pageData.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
                  <TableCell className="text-xs font-medium">{(log.profiles as any)?.full_name || '—'}</TableCell>
                  <TableCell><Badge variant={actionColor(log.action)} className="text-xs">{log.action}</Badge></TableCell>
                  <TableCell className="font-medium text-sm">{log.entity_type}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.entity_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.new_values ? JSON.stringify(log.new_values).slice(0, 80) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs px-2">{page + 1} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
