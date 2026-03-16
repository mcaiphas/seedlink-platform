import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'sonner';
import { logAudit } from '@/lib/audit';

interface Permission {
  id: string;
  code: string;
  name: string;
  module: string;
}

interface Override {
  id: string;
  permission_id: string;
  is_allowed: boolean;
}

interface RolePermission {
  permission_id: string;
}

interface Props {
  userId: string;
  userRoleIds: string[];
}

export function UserPermissionOverrides({ userId, userRoleIds }: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, [userId, userRoleIds.join(',')]);

  async function loadAll() {
    setLoading(true);
    const [permRes, overrideRes, rpRes] = await Promise.all([
      supabase.from('permissions').select('id, code, name, module').order('module').order('name'),
      supabase.from('user_permission_overrides').select('id, permission_id, is_allowed').eq('user_id', userId),
      userRoleIds.length > 0
        ? supabase.from('role_permissions').select('permission_id').in('role_id', userRoleIds)
        : Promise.resolve({ data: [] }),
    ]);
    setPermissions(permRes.data || []);
    setOverrides(overrideRes.data || []);
    setRolePermissions(new Set((rpRes.data || []).map((r: any) => r.permission_id)));
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return permissions;
    return permissions.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.module.toLowerCase().includes(q)
    );
  }, [permissions, search]);

  const grouped = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    filtered.forEach(p => {
      const mod = p.module || 'general';
      if (!map[mod]) map[mod] = [];
      map[mod].push(p);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  function getEffective(permId: string): { source: 'role' | 'override_grant' | 'override_revoke' | 'none'; allowed: boolean } {
    const override = overrides.find(o => o.permission_id === permId);
    if (override) {
      return { source: override.is_allowed ? 'override_grant' : 'override_revoke', allowed: override.is_allowed };
    }
    if (rolePermissions.has(permId)) {
      return { source: 'role', allowed: true };
    }
    return { source: 'none', allowed: false };
  }

  async function toggleOverride(perm: Permission) {
    setSaving(perm.id);
    const existing = overrides.find(o => o.permission_id === perm.id);
    const fromRole = rolePermissions.has(perm.id);

    try {
      if (existing) {
        // Remove override → revert to role
        await supabase.from('user_permission_overrides').delete().eq('id', existing.id);
        await logAudit({
          action: 'permission_override_removed',
          entity_type: 'user_permission',
          entity_id: userId,
          old_values: { permission: perm.code, was_allowed: existing.is_allowed },
        });
      } else {
        // Create override: if role grants → revoke; if role doesn't → grant
        const is_allowed = !fromRole;
        await supabase.from('user_permission_overrides').insert({
          user_id: userId,
          permission_id: perm.id,
          is_allowed,
        });
        await logAudit({
          action: 'permission_override_set',
          entity_type: 'user_permission',
          entity_id: userId,
          new_values: { permission: perm.code, is_allowed },
        });
      }
      await loadAll();
      toast.success('Permission updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Direct Permissions</h3>
          <p className="text-xs text-muted-foreground">Grant or revoke individual permissions beyond the user's role</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search permissions..." className="h-8 pl-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-4">
        {grouped.map(([module, perms]) => (
          <Card key={module}>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{module}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {perms.map(perm => {
                  const eff = getEffective(perm.id);
                  return (
                    <div key={perm.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {eff.source === 'override_grant' ? <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" /> :
                         eff.source === 'override_revoke' ? <ShieldX className="h-4 w-4 text-destructive shrink-0" /> :
                         <Shield className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{perm.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{perm.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className="text-[10px]">
                          {eff.source === 'role' ? 'From Role' :
                           eff.source === 'override_grant' ? 'Granted' :
                           eff.source === 'override_revoke' ? 'Revoked' : 'No Access'}
                        </Badge>
                        <Switch
                          checked={eff.allowed}
                          onCheckedChange={() => toggleOverride(perm)}
                          disabled={saving === perm.id}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        {grouped.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">No permissions found</div>
        )}
      </div>
    </div>
  );
}
