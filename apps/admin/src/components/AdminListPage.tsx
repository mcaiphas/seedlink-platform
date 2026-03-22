import { useEffect, useState, useMemo, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from './DataPageShell';
import { QueryStatusBanner } from './QueryStatusBanner';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const PAGE_SIZE = 20;

interface AdminListPageProps {
  title: string;
  description?: string;
  tableName: string;
  selectQuery?: string;
  searchPlaceholder?: string;
  searchFields?: string[];
  orderBy?: string;
  action?: ReactNode;
  filters?: ReactNode;
  columns: { label: string; key: string; sortable?: boolean; render?: (row: any) => ReactNode }[];
  filterFn?: (row: any, search: string) => boolean;
  onRowClick?: (row: any) => void;
}

export function AdminListPage({
  title, description, tableName, selectQuery = '*', searchPlaceholder = 'Search...',
  searchFields = ['name'], orderBy = 'created_at', action, filters,
  columns, filterFn, onRowClick,
}: AdminListPageProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryStatus, setQueryStatus] = useState<QueryStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(orderBy);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setQueryStatus('loading');
    setErrorMessage(null);

    supabase.from(tableName as any).select(selectQuery).order(orderBy, { ascending: false }).limit(500)
      .then(({ data: d, error: e }) => {
        if (e) {
          const classified = classifyError(e);
          setQueryStatus(classified.status);
          setErrorMessage(classified.message);
          setData([]);
        } else if (!d || d.length === 0) {
          setQueryStatus('empty');
          setData([]);
        } else {
          setQueryStatus('success');
          setData(d);
        }
        setLoading(false);
      });
  }, [tableName, selectQuery, orderBy]);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      if (filterFn) {
        result = result.filter(r => filterFn(r, s));
      } else {
        result = result.filter(r =>
          searchFields.some(f => String(r[f] || '').toLowerCase().includes(s))
        );
      }
    }
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [data, search, sortKey, sortDir, filterFn, searchFields]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => { setPage(0); }, [search]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const statusDesc = queryStatus === 'success' || queryStatus === 'empty'
    ? `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`
    : undefined;

  return (
    <DataPageShell title={title} description={description || statusDesc}
      loading={loading} searchValue={search} onSearchChange={setSearch}
      searchPlaceholder={searchPlaceholder} action={action}>

      {queryStatus !== 'success' && queryStatus !== 'loading' && queryStatus !== 'empty' && (
        <QueryStatusBanner status={queryStatus} message={errorMessage || undefined} tableName={tableName} />
      )}

      {filters && <div className="flex flex-wrap items-center gap-2 mb-2">{filters}</div>}

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key} className={col.sortable ? 'cursor-pointer select-none' : ''}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown className={`h-3 w-3 ${sortKey === col.key ? 'text-primary' : 'text-muted-foreground/40'}`} />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(row => (
              <TableRow key={row.id} className={onRowClick ? 'cursor-pointer' : ''} onClick={() => onRowClick?.(row)}>
                {columns.map(col => (
                  <td key={col.key} className="p-4 align-middle">
                    {col.render ? col.render(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </TableRow>
            ))}
            {paged.length === 0 && <EmptyState message={queryStatus === 'empty' ? 'No records found' : 'No matching records'} colSpan={columns.length} />}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </DataPageShell>
  );
}
