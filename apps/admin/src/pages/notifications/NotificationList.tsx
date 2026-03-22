import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
export default function NotificationList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  useEffect(() => { supabase.from('notifications').select('*').order('created_at',{ascending:false}).limit(100).then(({data,error})=>{if(error)setError(error.message);else setData(data||[]);setLoading(false);}); }, [user]);
  const unreadCount = data.filter(n=>!n.read_at).length;
  const markAllRead = async () => { const ids=data.filter(n=>!n.read_at).map(n=>n.id); if(!ids.length)return; const {error}=await supabase.from('notifications').update({read_at:new Date().toISOString()}).in('id',ids); if(error)toast.error(error.message); else{setData(d=>d.map(n=>({...n,read_at:n.read_at||new Date().toISOString()})));toast.success('All marked read');} };
  const filtered = data.filter(n=>(n.title||'').toLowerCase().includes(search.toLowerCase()));
  return (
    <DataPageShell title="Notifications" loading={loading} error={error} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search..."
      action={unreadCount>0?<Button variant="outline" onClick={markAllRead}><CheckCheck className="mr-2 h-4 w-4" />Mark All Read</Button>:undefined}>
      <div className="rounded-lg border bg-card"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>
        {filtered.map(n=>(<TableRow key={n.id} className={!n.read_at?'bg-primary/5':''}><TableCell><p className="font-medium">{n.title}</p>{n.body&&<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.body}</p>}</TableCell><TableCell><Badge variant="secondary">{n.notification_type}</Badge></TableCell><TableCell><Badge variant={n.read_at?'secondary':'default'}>{n.read_at?'Read':'Unread'}</Badge></TableCell><TableCell className="text-muted-foreground">{new Date(n.created_at).toLocaleString()}</TableCell></TableRow>))}
        {filtered.length===0&&<EmptyState message="No notifications" colSpan={4} />}
      </TableBody></Table></div>
    </DataPageShell>
  );
}
