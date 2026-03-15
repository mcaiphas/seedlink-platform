import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus, ArrowUpDown, ChevronLeft, ChevronRight, Download, Upload, MoreHorizontal,
  Copy, Archive, Eye, Pencil, Package, Image as ImageIcon,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProductImportExport } from '@/components/products/ProductImportExport';

type SortKey = 'name' | 'price' | 'stock_quantity' | 'created_at' | 'updated_at';
type SortDir = 'asc' | 'desc';
const PAGE_SIZE = 20;

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryStatus, setQueryStatus] = useState<QueryStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showImportExport, setShowImportExport] = useState(false);

  // Lookup data
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [variantCounts, setVariantCounts] = useState<Record<string, number>>({});
  const [collectionMap, setCollectionMap] = useState<Record<string, string[]>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setQueryStatus('loading');

    const [prodRes, catRes, supRes, varRes, colRes] = await Promise.all([
      supabase.from('products').select('*, product_subcategories(name), suppliers!fk_products_supplier(supplier_name)').order('created_at', { ascending: false }).limit(500),
      supabase.from('product_categories').select('id, name').order('sort_order'),
      supabase.from('suppliers').select('id, supplier_name').order('supplier_name').limit(200),
      supabase.from('product_variants').select('product_id'),
      supabase.from('product_collection_items').select('product_id, product_collections(name)'),
    ]);

    if (prodRes.error) {
      const c = classifyError(prodRes.error);
      setQueryStatus(c.status);
      setErrorMessage(c.message);
      setProducts([]);
    } else {
      setProducts(prodRes.data || []);
      setQueryStatus(prodRes.data?.length ? 'success' : 'empty');
    }

    setCategories(catRes.data || []);
    setSuppliers(supRes.data || []);

    // Count variants per product
    if (varRes.data) {
      const counts: Record<string, number> = {};
      varRes.data.forEach((v: any) => { counts[v.product_id] = (counts[v.product_id] || 0) + 1; });
      setVariantCounts(counts);
    }

    // Map collections
    if (colRes.data) {
      const m: Record<string, string[]> = {};
      colRes.data.forEach((ci: any) => {
        const name = (ci.product_collections as any)?.name;
        if (name) {
          if (!m[ci.product_id]) m[ci.product_id] = [];
          m[ci.product_id].push(name);
        }
      });
      setCollectionMap(m);
    }

    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const s = search.toLowerCase();
      const matchSearch = !search || p.name?.toLowerCase().includes(s) || (p.sku || '').toLowerCase().includes(s) || (p.brand || '').toLowerCase().includes(s);
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchSupplier = supplierFilter === 'all' || p.supplier_id === supplierFilter;
      return matchSearch && matchStatus && matchCategory && matchSupplier;
    });
    result.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [products, search, statusFilter, categoryFilter, supplierFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => { setPage(0); }, [search, statusFilter, categoryFilter, supplierFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const allOnPageSelected = paged.length > 0 && paged.every(p => selected.has(p.id));
  const toggleAll = () => {
    if (allOnPageSelected) setSelected(new Set());
    else setSelected(new Set(paged.map(p => p.id)));
  };
  const toggleOne = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const handleDuplicate = async (product: any) => {
    const { id, created_at, updated_at, product_subcategories: _s, suppliers: _sup, ...rest } = product;
    const { error } = await supabase.from('products').insert({ ...rest, name: `${rest.name} (Copy)`, sku: rest.sku ? `${rest.sku}-COPY` : null, status: 'draft' } as any);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Product duplicated' }); loadData(); }
  };

  const handleArchive = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'archived', is_active: false } as any).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Product archived' }); loadData(); }
  };

  const handleBulkArchive = async () => {
    if (selected.size === 0) return;
    const { error } = await supabase.from('products').update({ status: 'archived', is_active: false } as any).in('id', [...selected]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: `${selected.size} products archived` }); setSelected(new Set()); loadData(); }
  };

  const getMargin = (p: any) => {
    const buy = p.metadata?.buying_price;
    const sell = p.price;
    if (buy && sell && sell > 0) return (((sell - buy) / sell) * 100).toFixed(1);
    return null;
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-primary' : 'text-muted-foreground/40'}`} />
      </div>
    </TableHead>
  );

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <>
      <DataPageShell
        title="Products"
        description={`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, SKU, or brand..."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
              <Upload className="mr-2 h-4 w-4" />Import / Export
            </Button>
            <Button asChild>
              <Link to="/products/new"><Plus className="mr-2 h-4 w-4" />Add Product</Link>
            </Button>
          </div>
        }
      >
        {queryStatus !== 'success' && queryStatus !== 'loading' && queryStatus !== 'empty' && (
          <QueryStatusBanner status={queryStatus} message={errorMessage || undefined} tableName="products" />
        )}

        {/* Filters + Bulk actions */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Supplier" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}
            </SelectContent>
          </Select>

          {selected.size > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
              <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                <Archive className="mr-1 h-3 w-3" />Archive
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allOnPageSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="w-10" />
                <SortHeader label="Name" field="name" />
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Collection</TableHead>
                <SortHeader label="Price" field="price" />
                <TableHead>Margin</TableHead>
                <SortHeader label="Stock" field="stock_quantity" />
                <TableHead>Variants</TableHead>
                <TableHead>Status</TableHead>
                <SortHeader label="Updated" field="updated_at" />
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(p => {
                const margin = getMargin(p);
                const vCount = variantCounts[p.id] || 0;
                const cols = collectionMap[p.id] || [];
                return (
                  <TableRow key={p.id} className="group">
                    <TableCell><Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleOne(p.id)} /></TableCell>
                    <TableCell>
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                        {p.metadata?.image_url
                          ? <img src={p.metadata.image_url} alt="" className="h-full w-full object-cover" />
                          : <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/products/${p.id}`} className="font-medium text-primary hover:underline">
                        {p.name}
                      </Link>
                      {p.brand && <p className="text-xs text-muted-foreground">{p.brand}</p>}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{p.sku || '—'}</TableCell>
                    <TableCell className="text-sm">{p.category || '—'}</TableCell>
                    <TableCell>
                      {cols.length > 0
                        ? cols.map(c => <Badge key={c} variant="outline" className="mr-1 text-xs">{c}</Badge>)
                        : <span className="text-muted-foreground text-xs">—</span>
                      }
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {p.price != null ? `${p.currency_code} ${Number(p.price).toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {margin ? <span className={Number(margin) < 10 ? 'text-destructive' : 'text-primary'}>{margin}%</span> : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={p.stock_quantity <= 0 ? 'text-destructive font-medium' : 'tabular-nums'}>
                        {p.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      {vCount > 0
                        ? <Badge variant="secondary" className="text-xs"><Package className="h-3 w-3 mr-1" />{vCount}</Badge>
                        : <span className="text-muted-foreground text-xs">—</span>
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'published' ? 'default' : p.status === 'archived' ? 'outline' : 'secondary'}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/products/${p.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/products/${p.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(p)}>
                            <Copy className="mr-2 h-4 w-4" />Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchive(p.id)} className="text-destructive">
                            <Archive className="mr-2 h-4 w-4" />Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paged.length === 0 && (
                <EmptyState message={queryStatus === 'empty' ? 'No products yet — add your first product' : 'No products match filters'} colSpan={13} />
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages} · {filtered.length} products</p>
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

      <ProductImportExport
        open={showImportExport}
        onOpenChange={setShowImportExport}
        onImportComplete={loadData}
        products={products}
      />
    </>
  );
}
