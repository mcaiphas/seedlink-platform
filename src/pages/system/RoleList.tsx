import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/AdminRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Edit, Copy, Shield, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { logAudit } from '@/lib/audit';
import { exportToCsv } from '@/lib/csv-export';

interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
  userCount?: number;
}

type SortField = 'name' | 'created_at' | 'userCount';
type SortDir = 'asc' | 'desc';
const PAGE_SIZE = 20;

function RoleListInner() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSystem, setFormSystem] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const load = useCallback(async () => {
    const [{ data: rData }, { data: uraData }] = await Promise.all([
      supabase.from('roles').select('*').order('name'),
      supabase.from('user_role_assignments').select('role_id').eq('is_active', true),
    ]);

    const countMap: Record<string, number> = {};
    (uraData || []).forEach((a: any) => { countMap[a.role_id] = (countMap[a.role_id] || 0) + 1; });

    setRoles((rData || []).map((r: any) => ({ ...r, userCount: countMap[r.id] || 0 })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = roles.filter((r) => !q || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
    list.sort((a, b) => {
      let va: any = a[sortField]; let vb: any = b[sortField];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase(); }
      if (va == null) va = 0; if (vb == null) vb = 0;
      return sortDir === 'asc' ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0);
    });
    return list;
  }, [roles, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  useEffect(() => { setPage(0); }, [search]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 ml-0.5 inline" /> : <ChevronDown className="h-3 w-3 ml-0.5 inline" />;
  };

  function openCreate() { setEditRole(null); setFormName(''); setFormDesc(''); setFormSystem(false); setEditOpen(true); }
  function openEdit(r: Role) { setEditRole(r); setFormName(r.name); setFormDesc(r.description || ''); setFormSystem(r.is_system_role); setEditOpen(true); }
  function openDuplicate(r: Role) { setEditRole(null); setFormName(r.name + ' (Copy)'); setFormDesc(r.description || ''); setFormSystem(false); setEditOpen(true); }

  async function handleSave() {
    if (!formName.trim()) { toast.error('Role name is required'); return; }
    setSaving(true);
    try {
      if (editRole) {
        const { error } = await supabase.from('roles').update({ name: formName.trim(), description: formDesc.trim() || null, is_system_role: formSystem }).eq('id', editRole.id);
        if (error) throw error;
        await logAudit({ action: 'role_edit', entity_type: 'role', entity_id: editRole.id, old_values: { name: editRole.name }, new_values: { name: formName.trim() } });
        toast.success('Role updated');
      } else {
        const { error } = await supabase.from('roles').insert({ name: formName.trim(), description: formDesc.trim() || null, is_system_role: formSystem });
        if (error) throw error;
        await logAudit({ action: 'role_create', entity_type: 'role', new_values: { name: formName.trim() } });
        toast.success('Role created');
      }
      setEditOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.is_system_role) { toast.error('System roles cannot be deleted'); setDeleteTarget(null); return; }
    if ((deleteTarget.userCount || 0) > 0) { toast.error('Cannot delete a role with assigned users'); setDeleteTarget(null); return; }
    const { error } = await supabase.from('roles').delete().eq('id', deleteTarget.id);
    if (error) { toast.error(error.message); } else {
      await logAudit({ action: 'role_delete', entity_type: 'role', entity_id: deleteTarget.id, old_values: { name: deleteTarget.name } });
      toast.success('Role deleted');
    }
    setDeleteTarget(null);
    load();
  }

  function handleExportCsv() {
    const headers = ['Name', 'Description', 'Type', 'Users', 'Created'];
    const rows = filtered.map((r) => [r.name, r.description || '', r.is_system_role ? 'System' : 'Custom', String(r.userCount || 0), r.created_at ? new Date(r.created_at).toLocaleDateString() : '']);
    exportToCsv('roles', headers, rows);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">{loading ? 'Loading…' : `${roles.length} role${roles.length !== 1 ? 's' : ''} configured`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button onClick={openCreate} size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Role</Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="py-3 px-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search roles…" className="h-8 pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5 text-xs cursor-pointer select-none" onClick={() => toggleSort('name')}>
                      Role Name <SortIcon field="name" />
                    </TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs text-center cursor-pointer select-none" onClick={() => toggleSort('userCount')}>
                      Users <SortIcon field="userCount" />
                    </TableHead>
                    <TableHead className="text-xs cursor-pointer select-none" onClick={() => toggleSort('created_at')}>
                      Created <SortIcon field="created_at" />
                    </TableHead>
                    <TableHead className="pr-5 text-xs w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Shield className="h-8 w-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No roles found</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your search</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pageData.map((r) => (
                    <TableRow key={r.id} className="group">
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                            <Shield className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{r.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{r.description || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={r.is_system_role ? 'default' : 'outline'} className="text-xs">{r.is_system_role ? 'System' : 'Custom'}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs font-mono">{r.userCount}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</TableCell>
                      <TableCell className="pr-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openEdit(r)}><Edit className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDuplicate(r)}><Copy className="mr-2 h-3.5 w-3.5" /> Duplicate</DropdownMenuItem>
                            {!r.is_system_role && (r.userCount || 0) === 0 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeleteTarget(r)} className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t">
                  <p className="text-xs text-muted-foreground">Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                    <span className="text-xs px-2">{page + 1} / {totalPages}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>{editRole ? 'Update role details.' : 'Define a new platform role.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Role Name</Label>
              <Input className="h-8 text-sm" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Operations Manager" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea className="text-sm min-h-[60px]" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="What can this role do?" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">System Role</Label>
                <p className="text-xs text-muted-foreground">Cannot be deleted by users</p>
              </div>
              <Switch checked={formSystem} onCheckedChange={setFormSystem} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editRole ? 'Save Changes' : 'Create Role'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function RoleList() {
  return (
    <AdminRoute title="Roles">
      <RoleListInner />
    </AdminRoute>
  );
}
