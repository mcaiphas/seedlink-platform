import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
export default function UserList() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string|null>(null); const [search, setSearch] = useState('');
  useEffect(() => { if (adminLoading) return; if (!isAdmin) { setLoading(false); return; } supabase.from('profiles').select('*, user_role_assignments(roles(name))').order('created_at',{ascending:false}).limit(200).then(({data,error})=>{if(error)setError(error.message);else setData(data||[]);setLoading(false);}); }, [isAdmin, adminLoading]);
  if (!adminLoading && !isAdmin) return <DataPageShell title="Users" loading={false}><AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage users." /></DataPageShell>;
  const filtered = data.filter(u=>(u.full_name||'').toLowerCase().includes(search.toLowerCase()));
  return (
    <DataPageShell title="Users" description="Manage platform users" loading={loading||adminLoading} error={error} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name...">
      <div className="rounded-lg border bg-card"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Roles</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader><TableBody>
        {filtered.map(u=>(<TableRow key={u.id}><TableCell className="font-medium">{u.full_name||'—'}</TableCell><TableCell className="text-muted-foreground">{u.phone||'—'}</TableCell><TableCell><div className="flex gap-1 flex-wrap">{(u.user_role_assignments||[]).map((ura:any,i:number)=>(<Badge key={i} variant="default">{ura.roles?.name||'—'}</Badge>))}{(!u.user_role_assignments||u.user_role_assignments.length===0)&&<span className="text-muted-foreground text-sm">None</span>}</div></TableCell><TableCell className="text-muted-foreground">{u.created_at?new Date(u.created_at).toLocaleDateString():'—'}</TableCell></TableRow>))}
        {filtered.length===0&&<EmptyState message="No users found" colSpan={4} />}
      </TableBody></Table></div>
    </DataPageShell>
  );
}
