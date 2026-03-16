import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Edit, Copy, ShieldOff, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
  userCount?: number;
}

export default function RoleList() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSystem, setFormSystem] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!isAdmin) { setLoading(false); return; }

    const [{ data: rData }, { data: uraData }] = await Promise.all([
      supabase.from('roles').select('*').order('name'),
      supabase.from('user_role_assignments').select('role_id').eq('is_active', true),
    ]);

    const countMap: Record<string, number> = {};
    (uraData || []).forEach((a: any) => {
      countMap[a.role_id] = (countMap[a.role_id] || 0) + 1;
    });

    const enriched = (rData || []).map((r: any) => ({
      ...r,
      userCount: countMap[r.id] || 0,
    }));

    setRoles(enriched);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    if (adminLoading) return;
    load();
  }, [isAdmin, adminLoading, load]);

  const filtered = roles.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
  });

  function openCreate() {
    setEditRole(null);
    setFormName('');
    setFormDesc('');
    setFormSystem(false);
    setEditOpen(true);
  }

  function openEdit(r: Role) {
    setEditRole(r);
    setFormName(r.name);
    setFormDesc(r.description || '');
    setFormSystem(r.is_system_role);
    setEditOpen(true);
  }

  function openDuplicate(r: Role) {
    setEditRole(null);
    setFormName(r.name + ' (Copy)');
    setFormDesc(r.description || '');
    setFormSystem(false);
    setEditOpen(true);
  }

  async function handleSave() {
    if (!formName.trim()) { toast.error('Role name is required'); return; }
    setSaving(true);
    try {
      if (editRole) {
        const { error } = await supabase.from('roles').update({
          name: formName.trim(),
          description: formDesc.trim() || null,
          is_system_role: formSystem,
        }).eq('id', editRole.id);
        if (error) throw error;
        toast.success('Role updated');
      } else {
        const { error } = await supabase.from('roles').insert({
          name: formName.trim(),
          description: formDesc.trim() || null,
          is_system_role: formSystem,
        });
        if (error) throw error;
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

  if (!adminLoading && !isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Role management</p>
        </div>
        <AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage roles." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${roles.length} role${roles.length !== 1 ? 's' : ''} configured`}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> New Role
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="py-3 px-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search roles…" className="h-8 pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 text-xs">Role Name</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs text-center">Users</TableHead>
                  <TableHead className="text-xs">Created</TableHead>
                  <TableHead className="pr-5 text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Shield className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm">No roles found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((r) => (
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
                      <Badge variant={r.is_system_role ? 'default' : 'outline'} className="text-xs">
                        {r.is_system_role ? 'System' : 'Custom'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-xs font-mono">{r.userCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openEdit(r)}>
                            <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDuplicate(r)}>
                            <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>
              {editRole ? 'Update role details.' : 'Define a new platform role.'}
            </DialogDescription>
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
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
