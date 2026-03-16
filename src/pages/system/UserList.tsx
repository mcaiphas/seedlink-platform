import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, UserPlus, Edit, UserX, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  avatar_url: string | null;
  job_title: string | null;
  is_active: boolean;
  created_at: string;
  organization_id: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
}

export default function UserList() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, { roleId: string; roleName: string; assignmentId: string }[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', job_title: '', role: '', is_active: true, notes: '',
  });
  const [assignedRoleId, setAssignedRoleId] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!isAdmin) { setLoading(false); return; }

    const [{ data: pData }, { data: rData }, { data: uraData }] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email, phone, role, avatar_url, job_title, is_active, created_at, organization_id').order('created_at', { ascending: false }).limit(500),
      supabase.from('roles').select('id, name, description').order('name'),
      supabase.from('user_role_assignments').select('id, user_id, role_id, is_active, roles(name)').eq('is_active', true),
    ]);

    setProfiles(pData || []);
    setRoles(rData || []);

    const map: Record<string, { roleId: string; roleName: string; assignmentId: string }[]> = {};
    (uraData || []).forEach((r: any) => {
      const uid = r.user_id;
      const name = r.roles?.name;
      if (uid && name) {
        if (!map[uid]) map[uid] = [];
        map[uid].push({ roleId: r.role_id, roleName: name, assignmentId: r.id });
      }
    });
    setRoleMap(map);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    if (adminLoading) return;
    load();
  }, [isAdmin, adminLoading, load]);

  const filtered = profiles.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.phone || '').toLowerCase().includes(q);
    const matchRole = filterRole === 'all' || (roleMap[u.id] || []).some((r) => r.roleId === filterRole);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? u.is_active !== false : u.is_active === false);
    return matchSearch && matchRole && matchStatus;
  });

  function openCreate() {
    setEditUser(null);
    setFormData({ full_name: '', email: '', phone: '', job_title: '', role: '', is_active: true, notes: '' });
    setAssignedRoleId('');
    setEditOpen(true);
  }

  function openEdit(u: Profile) {
    setEditUser(u);
    setFormData({
      full_name: u.full_name || '',
      email: u.email || '',
      phone: u.phone || '',
      job_title: u.job_title || '',
      role: u.role || '',
      is_active: u.is_active !== false,
      notes: '',
    });
    const userRoles = roleMap[u.id] || [];
    setAssignedRoleId(userRoles[0]?.roleId || '');
    setEditOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editUser) {
        // Update existing profile
        const { error } = await supabase.from('profiles').update({
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          job_title: formData.job_title || null,
          is_active: formData.is_active,
        }).eq('id', editUser.id);

        if (error) throw error;

        // Handle role assignment
        if (assignedRoleId) {
          const existingRoles = roleMap[editUser.id] || [];
          if (existingRoles.length > 0 && existingRoles[0].roleId !== assignedRoleId) {
            // Deactivate old, create new
            await supabase.from('user_role_assignments').update({ is_active: false }).eq('id', existingRoles[0].assignmentId);
            await supabase.from('user_role_assignments').insert({
              user_id: editUser.id,
              role_id: assignedRoleId,
              assigned_by: currentUser?.id || null,
              is_active: true,
            });
          } else if (existingRoles.length === 0) {
            await supabase.from('user_role_assignments').insert({
              user_id: editUser.id,
              role_id: assignedRoleId,
              assigned_by: currentUser?.id || null,
              is_active: true,
            });
          }
        }

        toast.success('User updated successfully');
      } else {
        toast.info('New user creation requires Supabase Auth admin. Use the invite flow or Supabase dashboard.');
      }

      setEditOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u: Profile) {
    const newStatus = u.is_active === false ? true : false;
    const { error } = await supabase.from('profiles').update({ is_active: newStatus }).eq('id', u.id);
    if (error) { toast.error(error.message); return; }
    toast.success(newStatus ? 'User activated' : 'User deactivated');
    load();
  }

  if (!adminLoading && !isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">User management</p>
        </div>
        <AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage users." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${filtered.length} user${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 min-w-0 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search by name, email, phone…" className="h-8 pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-8 w-40 text-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-32 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 text-xs">User</TableHead>
                  <TableHead className="text-xs">Phone</TableHead>
                  <TableHead className="text-xs">Job Title</TableHead>
                  <TableHead className="text-xs">Roles</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Joined</TableHead>
                  <TableHead className="pr-5 text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((u) => {
                  const initials = (u.full_name || u.email || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  const userRoles = roleMap[u.id] || [];
                  return (
                    <TableRow key={u.id} className="group">
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar_url || undefined} />
                            <AvatarFallback className="text-[10px] bg-muted font-medium">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{u.full_name || '—'}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email || '—'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.phone || '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.job_title || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {userRoles.map((r, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{r.roleName}</Badge>
                          ))}
                          {userRoles.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.is_active !== false ? 'default' : 'secondary'} className="text-xs">
                          {u.is_active !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="pr-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => openEdit(u)}>
                              <Edit className="mr-2 h-3.5 w-3.5" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(u)}>
                              <Shield className="mr-2 h-3.5 w-3.5" /> Assign Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleActive(u)} className={u.is_active !== false ? 'text-destructive focus:text-destructive' : ''}>
                              <UserX className="mr-2 h-3.5 w-3.5" />
                              {u.is_active !== false ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription>
              {editUser ? 'Update user details and role assignment.' : 'New user accounts are created through Supabase Auth. Use this form to update profile details.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input className="h-8 text-sm" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input className="h-8 text-sm" value={formData.email} disabled={!!editUser} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input className="h-8 text-sm" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Job Title</Label>
                <Input className="h-8 text-sm" value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} />
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label className="text-xs">Assigned Role</Label>
              <Select value={assignedRoleId} onValueChange={setAssignedRoleId}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select a role…" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Active</Label>
                <p className="text-xs text-muted-foreground">User can access the platform</p>
              </div>
              <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !editUser}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
