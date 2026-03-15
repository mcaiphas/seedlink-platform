import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
type SortKey = 'name' | 'price' | 'stock_quantity' | 'created_at';
type SortDir = 'asc' | 'desc';
const PAGE_SIZE = 20;
export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(500)
      .then(({ data, error }) => { if (error) setError(error.message); else setProducts(data || []); setLoading(false); });
  }, []);
  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
    result.sort((a, b) => { const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? ''; const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv)); return sortDir === 'asc' ? cmp : -cmp; });
    return result;
  }, [products, search, statusFilter, sortKey, sortDir]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  useEffect(() => { setPage(0); }, [search, statusFilter]);
  const toggleSort = (key: SortKey) => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(field)}><div className="flex items-center gap-1">{label}<ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-primary' : 'text-muted-foreground/40'}`} /></div></TableHead>
  );
  return (
    <DataPageShell title="Products" description={`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`} loading={loading} error={error} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name or SKU..."
      action={<Button asChild><Link to="/products/new"><Plus className="mr-2 h-4 w-4" />Add Product</Link></Button>}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
      </div>
      <div className="rounded-lg border bg-card overflow-x-auto"><Table><TableHeader><TableRow><SortHeader label="Name" field="name" /><TableHead>SKU</TableHead><SortHeader label="Price" field="price" /><SortHeader label="Stock" field="stock_quantity" /><TableHead>Status</TableHead><SortHeader label="Created" field="created_at" /></TableRow></TableHeader><TableBody>
        {paged.map(p => (<TableRow key={p.id}><TableCell><Link to={`/products/${p.id}`} className="font-medium text-primary hover:underline">{p.name}</Link></TableCell><TableCell className="text-muted-foreground font-mono text-xs">{p.sku || '—'}</TableCell><TableCell className="font-medium">{p.currency_code} {p.price != null ? Number(p.price).toFixed(2) : '—'}</TableCell><TableCell><span className={p.stock_quantity <= 0 ? 'text-destructive font-medium' : ''}>{p.stock_quantity}</span></TableCell><TableCell><Badge variant={p.status === 'published' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell><TableCell className="text-muted-foreground text-xs">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</TableCell></TableRow>))}
        {paged.length === 0 && <EmptyState message="No products found" colSpan={6} />}
      </TableBody></Table></div>
      {totalPages > 1 && (<div className="flex items-center justify-between pt-2"><p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p><div className="flex gap-1"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button></div></div>)}
    </DataPageShell>
  );
}
