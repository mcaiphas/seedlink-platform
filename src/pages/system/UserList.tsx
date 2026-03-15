import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
      // Fetch profiles (simple query, no joins)
      const { data: pData, error: pError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role, created_at')
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

      // Fetch role assignments separately (disambiguated FK)
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

  const filtered = profiles.filter(u => (u.full_name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <DataPageShell title="Users" description={`${filtered.length} user${filtered.length !== 1 ? 's' : ''}`}
      loading={loading || adminLoading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name...">

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
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(u => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                <TableCell className="text-muted-foreground">{u.phone || '—'}</TableCell>
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
                <TableCell className="text-muted-foreground">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <EmptyState message="No users found" colSpan={4} />}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
