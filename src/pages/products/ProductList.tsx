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
  Plus, ArrowUpDown, ChevronLeft, ChevronRight, Upload, MoreHorizontal,
  Copy, Archive, Eye, Pencil, Image as ImageIcon, ShoppingCart, Layers, Download,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProductImportExport } from '@/components/products/ProductImportExport';

type SortKey = 'name' | 'default_selling_price' | 'stock_quantity' | 'created_at' | 'updated_at';
type SortDir = 'asc' | 'desc';
const PAGE_SIZE = 25;

const SKU_PREFIXES: Record<string, string> = {
  Seeds: 'SD', 'Crop Protection': 'CP', Fertiliser: 'FZ', Equipment: 'EQ',
  Training: 'TR', Services: 'SV', 'Lime & Soil Amendments': 'LM',
  Irrigation: 'IR', Packaging: 'PK', 'Marketplace Commodity': 'MC',
};

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

  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [variantCounts, setVariantCounts] = useState<Record<string, number>>({});
  const [collectionMap, setCollectionMap] = useState<Record<string, string[]>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setQueryStatus('loading');

    const [prodRes, catRes, supRes, varRes, colRes] = await Promise.all([
      supabase.from('products').select('*, product_categories!products_category_id_fkey(name, sku_prefix), product_subcategories(name), suppliers!fk_products_supplier(supplier_name)').order('created_at', { ascending: false }).limit(500),
      supabase.from('product_categories').select('id, name, sku_prefix').order('sort_order'),
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

    if (varRes.data) {
      const counts: Record<string, number> = {};
      varRes.data.forEach((v: any) => { counts[v.product_id] = (counts[v.product_id] || 0) + 1; });
      setVariantCounts(counts);
    }

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
      const matchSearch = !search || p.name?.toLowerCase().includes(s) || (p.sku || '').toLowerCase().includes(s) || (p.sku_base || '').toLowerCase().includes(s) || (p.brand || '').toLowerCase().includes(s);
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || p.category_id === categoryFilter || p.category === categoryFilter;
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
    const { id, created_at, updated_at, product_categories: _pc, product_subcategories: _s, suppliers: _sup, ...rest } = product;
    const { error } = await supabase.from('products').insert({ ...rest, name: `${rest.name} (Copy)`, sku: rest.sku ? `${rest.sku}-COPY` : null, sku_base: rest.sku_base ? `${rest.sku_base}-COPY` : null, status: 'draft' } as any);
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

  const handleBulkPublish = async () => {
    if (selected.size === 0) return;
    const { error } = await supabase.from('products').update({ status: 'published', is_active: true } as any).in('id', [...selected]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: `${selected.size} products published` }); setSelected(new Set()); loadData(); }
  };

  const getMargin = (p: any) => {
    if (p.default_margin_percent != null) return Number(p.default_margin_percent).toFixed(1);
    const buy = p.default_buying_price;
    const sell = p.default_selling_price ?? p.price;
    if (buy && sell && buy > 0) return (((sell - buy) / buy) * 100).toFixed(1);
    return null;
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-primary' : 'text-muted-foreground/40'}`} />
      </div>
    </TableHead>
  );

  const activeFilterCount = [statusFilter, categoryFilter, supplierFilter].filter(f => f !== 'all').length;

  const handleExportCSV = () => {
    if (!products.length) { toast({ title: 'No products to export' }); return; }
    const headers = ['name', 'sku_base', 'sku', 'category', 'brand', 'default_buying_price', 'default_selling_price', 'default_margin_percent', 'status', 'is_active', 'currency_code', 'stock_quantity', 'updated_at'];
    const rows = products.map(p => headers.map(h => {
      const v = p[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'string' && (v.includes(',') || v.includes('"'))) return `"${v.replace(/"/g, '""')}"`;
      return String(v);
    }).join(','));
    const csv = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `seedlink_products_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${products.length} products exported` });
  };

  return (
    <>
      <DataPageShell
        title="Products"
        description={`${filtered.length} product${filtered.length !== 1 ? 's' : ''}${activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active` : ''}`}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, SKU, or brand..."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
              <Upload className="mr-2 h-4 w-4" />Import
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
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Supplier" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-9" onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setSupplierFilter('all'); }}>
              Clear filters
            </Button>
          )}

          {selected.size > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">{selected.size} selected</span>
              <Button variant="outline" size="sm" onClick={handleBulkPublish}>
                <ShoppingCart className="mr-1 h-3 w-3" />Publish
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                <Archive className="mr-1 h-3 w-3" />Archive
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelected(new Set())}>
                Deselect
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={allOnPageSelected} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="w-10" />
                <SortHeader label="Name" field="name" />
                <TableHead>SKU Base</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Supplier</TableHead>
                <SortHeader label="Buying" field="default_selling_price" />
                <TableHead>Selling</TableHead>
                <TableHead>Margin</TableHead>
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
                const catName = (p.product_categories as any)?.name || p.category || '—';
                const supName = (p.suppliers as any)?.supplier_name || '—';
                const buyPrice = p.default_buying_price;
                const sellPrice = p.default_selling_price ?? p.price;
                return (
                  <TableRow key={p.id} className="group">
                    <TableCell><Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleOne(p.id)} /></TableCell>
                    <TableCell>
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                        {p.image_url
                          ? <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                          : <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/products/${p.id}`} className="font-medium text-primary hover:underline">{p.name}</Link>
                      {cols.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {cols.slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-[10px] h-4 px-1">{c}</Badge>)}
                          {cols.length > 2 && <span className="text-[10px] text-muted-foreground">+{cols.length - 2}</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{p.sku_base || '—'}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{p.sku || '—'}</TableCell>
                    <TableCell className="text-sm">{catName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.brand || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{supName}</TableCell>
                    <TableCell className="font-medium tabular-nums text-sm">
                      {buyPrice != null ? `${p.currency_code} ${Number(buyPrice).toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums text-sm">
                      {sellPrice != null ? `${p.currency_code} ${Number(sellPrice).toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {margin ? <span className={Number(margin) < 10 ? 'text-destructive' : Number(margin) >= 20 ? 'text-primary' : 'text-amber-600'}>{margin}%</span> : '—'}
                    </TableCell>
                    <TableCell>
                      {vCount > 0
                        ? <Badge variant="secondary" className="text-xs"><Layers className="h-3 w-3 mr-1" />{vCount}</Badge>
                        : <span className="text-muted-foreground text-xs">—</span>
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'published' ? 'default' : p.status === 'archived' ? 'outline' : 'secondary'}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
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
                          <DropdownMenuItem onClick={() => navigate(`/products/${p.id}`)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/products/${p.id}/edit`)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(p)}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchive(p.id)} className="text-destructive"><Archive className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paged.length === 0 && !loading && (
                <EmptyState
                  message={queryStatus === 'empty' ? 'No products yet — add your first product to get started' : 'No products match your current filters'}
                  colSpan={15}
                />
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pageNum = totalPages <= 7 ? i : page <= 3 ? i : page >= totalPages - 4 ? totalPages - 7 + i : page - 3 + i;
                return (
                  <Button key={pageNum} variant={pageNum === page ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setPage(pageNum)}>
                    {pageNum + 1}
                  </Button>
                );
              })}
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
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
