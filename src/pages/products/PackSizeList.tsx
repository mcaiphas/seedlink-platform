import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { DataPageShell } from '@/components/DataPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Download, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { logAudit } from '@/lib/audit';

const PAGE_SIZE = 20;
const PACK_TYPES = ['weight', 'volume', 'unit', 'seed_count'];
const PACKAGING_TYPES = ['bag', 'bottle', 'carton', 'pallet', 'drum', 'sachet', 'tub', 'other'];

const emptyForm = {
  name: '', display_label: '', pack_type: 'weight', quantity_value: '', quantity_unit: 'kg',
  packaging_type: 'bag', seed_count: '', seed_count_label: '', estimated_weight_kg: '',
  conversion_factor_kg: '', crop_type: '', is_bulk: false, is_active: true,
  sort_order: '0', description: '',
};

export default function PackSizeList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortKey, setSortKey] = useState('sort_order');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('product_pack_sizes').select('*').order('sort_order').limit(500);
    setData(d || []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => (r.name || '').toLowerCase().includes(s) || (r.display_label || '').toLowerCase().includes(s));
    }
    if (typeFilter !== 'all') result = result.filter(r => r.pack_type === typeFilter);
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [data, search, typeFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const isSeedCount = form.pack_type === 'seed_count';

  const openNew = () => { setForm(emptyForm); setEditId(null); setDialogOpen(true); };
  const openEdit = (row: any) => {
    setForm({
      name: row.name || '', display_label: row.display_label || '', pack_type: row.pack_type || 'weight',
      quantity_value: row.quantity_value?.toString() || '', quantity_unit: row.quantity_unit || 'kg',
      packaging_type: row.packaging_type || 'bag', seed_count: row.seed_count?.toString() || '',
      seed_count_label: row.seed_count_label || '', estimated_weight_kg: row.estimated_weight_kg?.toString() || '',
      conversion_factor_kg: row.conversion_factor_kg?.toString() || '', crop_type: row.crop_type || '',
      is_bulk: row.is_bulk ?? false, is_active: row.is_active ?? true,
      sort_order: row.sort_order?.toString() || '0', description: row.description || '',
    });
    setEditId(row.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    const payload: any = {
      name: form.name.trim(), display_label: form.display_label || null, pack_type: form.pack_type,
      quantity_value: form.quantity_value ? parseFloat(form.quantity_value) : null,
      quantity_unit: form.quantity_unit || null, packaging_type: form.packaging_type || 'bag',
      seed_count: form.seed_count ? parseInt(form.seed_count) : null,
      seed_count_label: form.seed_count_label || null,
      estimated_weight_kg: form.estimated_weight_kg ? parseFloat(form.estimated_weight_kg) : null,
      conversion_factor_kg: form.conversion_factor_kg ? parseFloat(form.conversion_factor_kg) : null,
      crop_type: form.crop_type || null, is_bulk: form.is_bulk, is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0, description: form.description || null,
    };

    // Auto-calculate weight equivalent for seed_count
    if (form.pack_type === 'seed_count' && form.conversion_factor_kg) {
      payload.estimated_weight_kg = parseFloat(form.conversion_factor_kg);
    }
    // For weight type, weight equivalent = quantity value
    if (form.pack_type === 'weight' && form.quantity_value) {
      payload.estimated_weight_kg = parseFloat(form.quantity_value);
    }

    if (editId) {
      const { error } = await supabase.from('product_pack_sizes').update(payload).eq('id', editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      logAudit({ action: 'update', entity_type: 'pack_size', entity_id: editId, new_values: payload });
      toast.success('Pack size updated');
    } else {
      const { error } = await supabase.from('product_pack_sizes').insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      logAudit({ action: 'create', entity_type: 'pack_size', new_values: payload });
      toast.success('Pack size created');
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleExport = () => {
    exportToCsv('pack-sizes', ['Name', 'Label', 'Type', 'Qty', 'Unit', 'Seeds', 'Weight (kg)', 'Conversion (kg)', 'Crop', 'Bulk', 'Active'],
      filtered.map(r => [r.name, r.display_label || '', r.pack_type, r.quantity_value || '', r.quantity_unit || '', r.seed_count || '', r.estimated_weight_kg || '', r.conversion_factor_kg || '', r.crop_type || '', r.is_bulk ? 'Yes' : 'No', r.is_active ? 'Yes' : 'No']));
  };

  const formatSeedCount = (count: number | null) => {
    if (!count) return '—';
    if (count >= 1000) return `${(count / 1000).toLocaleString()}K`;
    return count.toLocaleString();
  };

  return (
    <AdminPage>
      <DataPageShell title="Packaging & Pack Sizes" description={`${filtered.length} pack size${filtered.length !== 1 ? 's' : ''}`}
        loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search pack sizes..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add Pack Size</Button>
          </div>
        }>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PACK_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: '#', key: 'sort_order', sortable: true },
                  { label: 'Pack Size', key: 'name', sortable: true },
                  { label: 'Type', key: 'pack_type', sortable: true },
                  { label: 'Quantity', key: 'quantity_value' },
                  { label: 'Seeds', key: 'seed_count' },
                  { label: 'Weight (kg)', key: 'estimated_weight_kg' },
                  { label: 'Packaging', key: 'packaging_type' },
                  { label: 'Status', key: 'is_active' },
                  { label: 'Actions', key: '_actions' },
                ].map(col => (
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
                <TableRow key={row.id}>
                  <td className="p-4 text-muted-foreground text-xs">{row.sort_order}</td>
                  <td className="p-4">
                    <div>
                      <span className="font-medium">{row.name}</span>
                      {row.display_label && <span className="text-xs text-muted-foreground ml-1.5">({row.display_label})</span>}
                    </div>
                    {row.crop_type && <span className="text-xs text-muted-foreground">{row.crop_type}</span>}
                  </td>
                  <td className="p-4"><Badge variant={row.pack_type === 'seed_count' ? 'default' : 'secondary'} className="capitalize text-xs">{row.pack_type?.replace(/_/g, ' ')}</Badge></td>
                  <td className="p-4 tabular-nums">{row.quantity_value != null ? `${row.quantity_value.toLocaleString()} ${row.quantity_unit || ''}` : '—'}</td>
                  <td className="p-4 tabular-nums font-medium">{formatSeedCount(row.seed_count)}</td>
                  <td className="p-4 tabular-nums">{row.estimated_weight_kg != null ? `${row.estimated_weight_kg} kg` : '—'}</td>
                  <td className="p-4 capitalize text-xs">{row.packaging_type || '—'}</td>
                  <td className="p-4"><Badge variant={row.is_active ? 'default' : 'secondary'}>{row.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5" /></Button>
                  </td>
                </TableRow>
              ))}
              {paged.length === 0 && <TableRow><td colSpan={9} className="p-8 text-center text-muted-foreground">No pack sizes found</td></TableRow>}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </DataPageShell>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Pack Size' : 'Add Pack Size'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Pack Size Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. 60K Maize" /></div>
            <div className="space-y-1.5"><Label>Display Label</Label><Input value={form.display_label} onChange={e => setForm(f => ({ ...f, display_label: e.target.value }))} placeholder="e.g. 60,000 seeds" /></div>
            <div className="space-y-1.5">
              <Label>Pack Type *</Label>
              <Select value={form.pack_type} onValueChange={v => setForm(f => ({ ...f, pack_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PACK_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Packaging Type</Label>
              <Select value={form.packaging_type} onValueChange={v => setForm(f => ({ ...f, packaging_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PACKAGING_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {!isSeedCount && (
              <>
                <div className="space-y-1.5"><Label>Quantity Value</Label><Input type="number" value={form.quantity_value} onChange={e => setForm(f => ({ ...f, quantity_value: e.target.value }))} /></div>
                <div className="space-y-1.5">
                  <Label>Unit of Measure</Label>
                  <Select value={form.quantity_unit} onValueChange={v => setForm(f => ({ ...f, quantity_unit: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['kg', 'g', 'L', 'mL', 'unit', 'each'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {isSeedCount && (
              <>
                <div className="col-span-2 rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                  <p className="text-sm font-medium text-primary">Seed Count Configuration</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Seed Count Label</Label>
                      <Input value={form.seed_count_label} onChange={e => setForm(f => ({ ...f, seed_count_label: e.target.value }))} placeholder="e.g. 60K" />
                      <p className="text-xs text-muted-foreground">K = 1,000 seeds</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Numeric Seed Count</Label>
                      <Input type="number" value={form.seed_count} onChange={e => setForm(f => ({ ...f, seed_count: e.target.value }))} placeholder="e.g. 60000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Conversion Factor to kg</Label>
                      <Input type="number" step="0.01" value={form.conversion_factor_kg} onChange={e => setForm(f => ({ ...f, conversion_factor_kg: e.target.value }))} placeholder="e.g. 24" />
                      <p className="text-xs text-muted-foreground">Weight equivalent per pack in kg</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Crop Type (optional)</Label>
                      <Input value={form.crop_type} onChange={e => setForm(f => ({ ...f, crop_type: e.target.value }))} placeholder="e.g. Maize, Soybean" />
                    </div>
                  </div>
                  {form.seed_count && form.conversion_factor_kg && (
                    <div className="rounded-md bg-background p-3 text-sm">
                      <strong>{parseInt(form.seed_count).toLocaleString()}</strong> seeds = <strong>{form.conversion_factor_kg} kg</strong> equivalent
                      <br />
                      <span className="text-muted-foreground">20 bags × {form.conversion_factor_kg} kg = {(20 * parseFloat(form.conversion_factor_kg)).toLocaleString()} kg for logistics</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isSeedCount && (
              <div className="space-y-1.5">
                <Label>Weight Equivalent (kg)</Label>
                <Input type="number" step="0.01" value={form.estimated_weight_kg} onChange={e => setForm(f => ({ ...f, estimated_weight_kg: e.target.value }))} />
                <p className="text-xs text-muted-foreground">Used for logistics weight calculations</p>
              </div>
            )}

            <div className="space-y-1.5"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.is_bulk} onCheckedChange={v => setForm(f => ({ ...f, is_bulk: v }))} /><Label>Bulk Pack</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
