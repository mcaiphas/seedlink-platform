import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Power, ChevronLeft, ChevronRight, ArrowUpDown, Download, Star } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCsv } from '@/lib/csv-export';
import { logAudit } from '@/lib/audit';

const PAGE_SIZE = 20;
const DEPOT_TYPES = ['warehouse', 'distribution_center', 'cold_room', 'retail_store'];
const STORAGE_CATEGORIES = ['general', 'cold_storage', 'hazardous', 'bulk', 'mixed'];

const emptyForm = {
  name: '', depot_code: '', depot_type: 'warehouse', city: '', province: '', country: 'ZA',
  physical_address: '', gps_lat: '', gps_lng: '', contact_person: '', contact_phone: '',
  contact_email: '', storage_category: 'general', notes: '', is_active: true, is_default: false,
};

export default function DepotList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('depots').select('*').order('name').limit(500);
    setData(d || []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        (r.name || '').toLowerCase().includes(s) ||
        (r.depot_code || '').toLowerCase().includes(s) ||
        (r.city || '').toLowerCase().includes(s) ||
        (r.contact_person || '').toLowerCase().includes(s)
      );
    }
    if (typeFilter !== 'all') result = result.filter(r => r.depot_type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(r => statusFilter === 'active' ? r.is_active : !r.is_active);
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [data, search, typeFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const openNew = () => { setForm(emptyForm); setEditId(null); setDialogOpen(true); };
  const openEdit = (row: any) => {
    setForm({
      name: row.name || '', depot_code: row.depot_code || '', depot_type: row.depot_type || 'warehouse',
      city: row.city || '', province: row.province || '', country: row.country || 'ZA',
      physical_address: row.physical_address || '', gps_lat: row.gps_lat?.toString() || '',
      gps_lng: row.gps_lng?.toString() || '', contact_person: row.contact_person || '',
      contact_phone: row.contact_phone || '', contact_email: row.contact_email || '',
      storage_category: row.storage_category || 'general', notes: row.notes || '',
      is_active: row.is_active ?? true, is_default: row.is_default ?? false,
    });
    setEditId(row.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.depot_code.trim()) {
      toast.error('Name and Code are required');
      return;
    }
    setSaving(true);
    const payload: any = {
      name: form.name.trim(), depot_code: form.depot_code.trim(), depot_type: form.depot_type,
      city: form.city || null, province: form.province || null, country: form.country || 'ZA',
      physical_address: form.physical_address || null,
      gps_lat: form.gps_lat ? parseFloat(form.gps_lat) : null,
      gps_lng: form.gps_lng ? parseFloat(form.gps_lng) : null,
      contact_person: form.contact_person || null, contact_phone: form.contact_phone || null,
      contact_email: form.contact_email || null, storage_category: form.storage_category,
      notes: form.notes || null, is_active: form.is_active, is_default: form.is_default,
    };

    if (editId) {
      const { error } = await supabase.from('depots').update(payload).eq('id', editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      logAudit({ action: 'update', entity_type: 'depot', entity_id: editId, new_values: payload });
      toast.success('Depot updated');
    } else {
      const { error } = await supabase.from('depots').insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      logAudit({ action: 'create', entity_type: 'depot', new_values: payload });
      toast.success('Depot created');
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    const target = data.find(d => d.id === deactivateId);
    const newStatus = !target?.is_active;
    await supabase.from('depots').update({ is_active: newStatus }).eq('id', deactivateId);
    logAudit({ action: newStatus ? 'activate' : 'deactivate', entity_type: 'depot', entity_id: deactivateId });
    toast.success(`Depot ${newStatus ? 'activated' : 'deactivated'}`);
    setDeactivateId(null);
    fetchData();
  };

  const handleExport = () => {
    exportToCsv('depots', ['Name', 'Code', 'Type', 'City', 'Province', 'Contact', 'Status'],
      filtered.map(r => [r.name, r.depot_code, r.depot_type, r.city || '', r.province || '', r.contact_person || '', r.is_active ? 'Active' : 'Inactive']));
  };

  const formatType = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—';

  return (
    <AdminPage>
      <DataPageShell title="Depots" description={`${filtered.length} depot${filtered.length !== 1 ? 's' : ''}`}
        loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search depots..."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
            <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add Depot</Button>
          </div>
        }>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {DEPOT_TYPES.map(t => <SelectItem key={t} value={t}>{formatType(t)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: 'Depot Name', key: 'name', sortable: true },
                  { label: 'Code', key: 'depot_code', sortable: true },
                  { label: 'Location', key: 'city', sortable: true },
                  { label: 'Type', key: 'depot_type', sortable: true },
                  { label: 'Contact', key: 'contact_person' },
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
                <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`/depots/${row.id}`)}>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{row.name}</span>
                      {row.is_default && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                  </td>
                  <td className="p-4 align-middle"><span className="font-mono text-xs text-muted-foreground">{row.depot_code}</span></td>
                  <td className="p-4 align-middle">{[row.city, row.province].filter(Boolean).join(', ') || '—'}</td>
                  <td className="p-4 align-middle"><Badge variant="outline" className="text-xs capitalize">{formatType(row.depot_type)}</Badge></td>
                  <td className="p-4 align-middle">{row.contact_person || '—'}</td>
                  <td className="p-4 align-middle"><Badge variant={row.is_active ? 'default' : 'secondary'}>{row.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-4 align-middle" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeactivateId(row.id)}><Power className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow><td colSpan={7} className="p-8 text-center text-muted-foreground">No depots found</td></TableRow>
              )}
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
            <DialogTitle>{editId ? 'Edit Depot' : 'Add Depot'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Depot Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Depot Code *</Label><Input value={form.depot_code} onChange={e => setForm(f => ({ ...f, depot_code: e.target.value.toUpperCase() }))} placeholder="e.g. JHB-01" /></div>
            <div className="space-y-1.5">
              <Label>Depot Type</Label>
              <Select value={form.depot_type} onValueChange={v => setForm(f => ({ ...f, depot_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEPOT_TYPES.map(t => <SelectItem key={t} value={t}>{formatType(t)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Storage Category</Label>
              <Select value={form.storage_category} onValueChange={v => setForm(f => ({ ...f, storage_category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STORAGE_CATEGORIES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>City / Town</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Province / State</Label><Input value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Physical Address</Label><Input value={form.physical_address} onChange={e => setForm(f => ({ ...f, physical_address: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>GPS Latitude</Label><Input type="number" step="any" value={form.gps_lat} onChange={e => setForm(f => ({ ...f, gps_lat: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>GPS Longitude</Label><Input type="number" step="any" value={form.gps_lng} onChange={e => setForm(f => ({ ...f, gps_lng: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Contact Person</Label><Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Contact Phone</Label><Input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Contact Email</Label><Input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_default} onCheckedChange={v => setForm(f => ({ ...f, is_default: v }))} />
              <Label>Default Depot</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirmation */}
      <AlertDialog open={!!deactivateId} onOpenChange={() => setDeactivateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Toggle Depot Status</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to change the status of this depot?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
