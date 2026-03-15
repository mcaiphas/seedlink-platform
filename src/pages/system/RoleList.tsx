import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
export default function RoleList() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string|null>(null);
  useEffect(() => { if (adminLoading) return; if (!isAdmin) { setLoading(false); return; } supabase.from('roles').select('*').order('name').limit(50).then(({data,error})=>{if(error)setError(error.message);else setData(data||[]);setLoading(false);}); }, [isAdmin, adminLoading]);
  if (!adminLoading && !isAdmin) return <DataPageShell title="Roles" loading={false}><AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage roles." /></DataPageShell>;
  return (
    <DataPageShell title="Roles" description="Manage platform roles" loading={loading||adminLoading} error={error}>
      <div className="rounded-lg border bg-card"><Table><TableHeader><TableRow><TableHead>Role Name</TableHead><TableHead>Description</TableHead><TableHead>Type</TableHead><TableHead>Created</TableHead></TableRow></TableHeader><TableBody>
        {data.map(r=>(<TableRow key={r.id}><TableCell className="font-medium">{r.name}</TableCell><TableCell className="text-muted-foreground">{r.description||'—'}</TableCell><TableCell><Badge variant={r.is_system_role?'default':'secondary'}>{r.is_system_role?'System':'Custom'}</Badge></TableCell><TableCell className="text-muted-foreground">{r.created_at?new Date(r.created_at).toLocaleDateString():'—'}</TableCell></TableRow>))}
        {data.length===0&&<EmptyState message="No roles configured" colSpan={4} />}
      </TableBody></Table></div>
    </DataPageShell>
  );
}
