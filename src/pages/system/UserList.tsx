import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserList() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<QueryStatus>('loading');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [roleStatus, setRoleStatus] = useState<QueryStatus>('loading');
  const [roleError, setRoleError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (adminLoading) return;
    if (!isAdmin) { setLoading(false); return; }

    async function load() {
      const { data: pData, error: pError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role, avatar_url, job_title, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(200);

      if (pError) {
        const c = classifyError(pError);
        setProfileStatus(c.status);
        setProfileError(c.message);
      } else {
        setProfiles(pData || []);
        setProfileStatus(pData && pData.length > 0 ? 'success' : 'empty');
      }

      const { data: rData, error: rError } = await supabase
        .from('user_role_assignments')
        .select('user_id, roles(name)')
        .eq('is_active', true);

      if (rError) {
        const c = classifyError(rError);
        setRoleStatus(c.status);
        setRoleError(c.message);
      } else {
        setRoleStatus('success');
        const map: Record<string, string[]> = {};
        (rData || []).forEach((r: any) => {
          const uid = r.user_id;
          const name = r.roles?.name;
          if (uid && name) {
            if (!map[uid]) map[uid] = [];
            map[uid].push(name);
          }
        });
        setRoleMap(map);
      }

      setLoading(false);
    }

    load();
  }, [isAdmin, adminLoading]);

  if (!adminLoading && !isAdmin) {
    return (
      <DataPageShell title="Users" loading={false}>
        <AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage users." />
      </DataPageShell>
    );
  }

  const filtered = profiles.filter(u => {
    const q = search.toLowerCase();
    return (u.full_name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q);
  });

  return (
    <DataPageShell title="Users" description={`${filtered.length} user${filtered.length !== 1 ? 's' : ''}`}
      loading={loading || adminLoading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name, email, phone...">

      {profileStatus !== 'success' && profileStatus !== 'loading' && profileStatus !== 'empty' && (
        <QueryStatusBanner status={profileStatus} message={profileError || undefined} tableName="profiles" />
      )}
      {roleStatus !== 'success' && roleStatus !== 'loading' && (
        <QueryStatusBanner status={roleStatus} message={roleError || undefined} tableName="user_role_assignments" />
      )}

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(u => {
              const initials = (u.full_name || u.email || '?').slice(0, 2).toUpperCase();
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.avatar_url || undefined} />
                        <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{u.full_name || '—'}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email || '—'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.phone || '—'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.job_title || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(roleMap[u.id] || []).map((name, i) => (
                        <Badge key={i} variant="default">{name}</Badge>
                      ))}
                      {(!roleMap[u.id] || roleMap[u.id].length === 0) && (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.is_active === false
                      ? <Badge variant="secondary">Inactive</Badge>
                      : <Badge variant="default">Active</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && <EmptyState message="No users found" colSpan={6} />}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
