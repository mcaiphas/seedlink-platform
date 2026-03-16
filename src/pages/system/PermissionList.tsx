import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Lock, Shield, Save, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Permission {
  id: string;
  code: string;
  module: string;
  name: string | null;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
}

// Derive action from permission code (e.g. "orders:create" → "create")
function extractAction(code: string): string {
  const parts = code.split(':');
  return parts.length > 1 ? parts.slice(1).join(':') : code;
}

export default function PermissionList() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [grantedIds, setGrantedIds] = useState<Set<string>>(new Set()); // set of permission_ids granted to selected role
  const [originalGrantedIds, setOriginalGrantedIds] = useState<Set<string>>(new Set());
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!isAdmin) { setLoading(false); return; }
    const [{ data: pData }, { data: rData }] = await Promise.all([
      supabase.from('permissions').select('*').order('module').order('code'),
      supabase.from('roles').select('id, name, description').order('name'),
    ]);
    setPermissions(pData || []);
    setRoles(rData || []);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    if (adminLoading) return;
    load();
  }, [isAdmin, adminLoading, load]);

  // Load role_permissions when role changes
  useEffect(() => {
    if (!selectedRoleId) { setGrantedIds(new Set()); setOriginalGrantedIds(new Set()); return; }
    supabase.from('role_permissions').select('permission_id').eq('role_id', selectedRoleId).then(({ data }) => {
      const ids = new Set((data || []).map((r: any) => r.permission_id));
      setGrantedIds(ids);
      setOriginalGrantedIds(new Set(ids));
    });
  }, [selectedRoleId]);

  // Group permissions by module
  const modules = useMemo(() => {
    const map = new Map<string, Permission[]>();
    const q = search.toLowerCase();
    permissions
      .filter((p) => !q || p.module.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
      .forEach((p) => {
        if (!map.has(p.module)) map.set(p.module, []);
        map.get(p.module)!.push(p);
      });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [permissions, search]);

  // Collect all unique actions across all permissions
  const allActions = useMemo(() => {
    const s = new Set<string>();
    permissions.forEach((p) => s.add(extractAction(p.code)));
    return Array.from(s).sort();
  }, [permissions]);

  function togglePermission(permId: string) {
    setGrantedIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId); else next.add(permId);
      return next;
    });
  }

  const hasChanges = useMemo(() => {
    if (grantedIds.size !== originalGrantedIds.size) return true;
    for (const id of grantedIds) if (!originalGrantedIds.has(id)) return true;
    return false;
  }, [grantedIds, originalGrantedIds]);

  async function handleSave() {
    if (!selectedRoleId) return;
    setSaving(true);
    try {
      // Find additions and removals
      const toAdd = Array.from(grantedIds).filter((id) => !originalGrantedIds.has(id));
      const toRemove = Array.from(originalGrantedIds).filter((id) => !grantedIds.has(id));

      // Remove
      if (toRemove.length > 0) {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', selectedRoleId)
          .in('permission_id', toRemove);
        if (error) throw error;
      }

      // Add
      if (toAdd.length > 0) {
        const rows = toAdd.map((pid) => ({ role_id: selectedRoleId, permission_id: pid }));
        const { error } = await supabase.from('role_permissions').insert(rows);
        if (error) throw error;
      }

      setOriginalGrantedIds(new Set(grantedIds));
      toast.success('Permissions saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setGrantedIds(new Set(originalGrantedIds));
  }

  if (!adminLoading && !isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Access control matrix</p>
        </div>
        <AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage permissions." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading…</p>
        </div>
        <Skeleton className="h-12 w-64 rounded-lg" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Role-permission matrix &middot; {permissions.length} permissions across {modules.length} modules
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1.5">
              <X className="h-3.5 w-3.5" /> Discard
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Role Selector + Search */}
      <Card className="shadow-sm">
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Select Role</label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="h-8 w-56 text-sm">
                  <SelectValue placeholder="Choose a role…" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRoleId && selectedRole?.description && (
              <p className="text-xs text-muted-foreground mt-auto">{selectedRole.description}</p>
            )}
            <div className="sm:ml-auto relative max-w-xs w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Filter modules…" className="h-8 pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      {!selectedRoleId ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Select a role</h3>
            <p className="text-xs text-muted-foreground max-w-sm">Choose a role from the dropdown above to view and manage its permissions.</p>
          </CardContent>
        </Card>
      ) : modules.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Lock className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No permissions match your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {modules.map(([module, perms]) => (
            <Card key={module} className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize font-semibold">{module}</Badge>
                    <span className="text-xs text-muted-foreground">{perms.length} permission{perms.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => {
                        setGrantedIds((prev) => {
                          const next = new Set(prev);
                          perms.forEach((p) => next.add(p.id));
                          return next;
                        });
                      }}
                    >
                      Grant All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2 text-muted-foreground"
                      onClick={() => {
                        setGrantedIds((prev) => {
                          const next = new Set(prev);
                          perms.forEach((p) => next.delete(p.id));
                          return next;
                        });
                      }}
                    >
                      Revoke All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {perms.map((p) => {
                    const action = extractAction(p.code);
                    const granted = grantedIds.has(p.id);
                    const changed = granted !== originalGrantedIds.has(p.id);
                    return (
                      <div key={p.id} className={`flex items-center justify-between px-5 py-2.5 ${changed ? 'bg-accent/5' : ''}`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-foreground">{p.code}</code>
                            {changed && <Badge variant="secondary" className="text-[9px] h-4">Changed</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.description || p.name || action}</p>
                        </div>
                        <Switch
                          checked={granted}
                          onCheckedChange={() => togglePermission(p.id)}
                          className="shrink-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
