import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
type SortKey = 'title' | 'price' | 'created_at';
const PAGE_SIZE = 20;
export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState(''); const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at'); const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc'); const [page, setPage] = useState(0);
  useEffect(() => { supabase.from('courses').select('*, course_categories(name)').order('created_at',{ascending:false}).limit(500).then(({data,error})=>{if(error)setError(error.message);else setCourses(data||[]);setLoading(false);}); }, []);
  const filtered = useMemo(() => {
    let result = courses.filter(c => { const ms = c.title.toLowerCase().includes(search.toLowerCase()); const mst = statusFilter === 'all' || c.status === statusFilter; return ms && mst; });
    result.sort((a,b) => { const av=a[sortKey]??''; const bv=b[sortKey]??''; const cmp=typeof av==='number'?av-bv:String(av).localeCompare(String(bv)); return sortDir==='asc'?cmp:-cmp; });
    return result;
  }, [courses, search, statusFilter, sortKey, sortDir]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE); const paged = filtered.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
  useEffect(() => { setPage(0); }, [search, statusFilter]);
  const toggleSort = (key: SortKey) => { if(sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortKey(key); setSortDir('asc'); } };
  return (
    <DataPageShell title="Courses" description={`${filtered.length} course${filtered.length!==1?'s':''}`} loading={loading} error={error} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search courses..."
      action={<Button asChild><Link to="/courses/new"><Plus className="mr-2 h-4 w-4" />Add Course</Link></Button>}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
      </div>
      <div className="rounded-lg border bg-card overflow-x-auto"><Table><TableHeader><TableRow>
        <TableHead className="cursor-pointer" onClick={()=>toggleSort('title')}>Title</TableHead><TableHead>Category</TableHead><TableHead>Level</TableHead>
        <TableHead className="cursor-pointer" onClick={()=>toggleSort('price')}>Price</TableHead><TableHead>Status</TableHead>
        <TableHead className="cursor-pointer" onClick={()=>toggleSort('created_at')}>Created</TableHead>
      </TableRow></TableHeader><TableBody>
        {paged.map(c=>(<TableRow key={c.id}><TableCell><div className="flex items-center gap-2"><Link to={`/courses/${c.id}`} className="font-medium text-primary hover:underline">{c.title}</Link>{c.is_featured&&<Star className="h-3.5 w-3.5 text-accent fill-accent" />}</div></TableCell><TableCell className="text-muted-foreground">{(c.course_categories as any)?.name||'—'}</TableCell><TableCell>{c.level?<Badge variant="secondary" className="capitalize">{c.level}</Badge>:'—'}</TableCell><TableCell className="font-medium">{c.price!=null&&c.price>0?`R ${Number(c.price).toFixed(2)}`:<span className="text-primary font-semibold">Free</span>}</TableCell><TableCell><Badge variant={c.status==='published'?'default':'secondary'}>{c.status}</Badge></TableCell><TableCell className="text-muted-foreground text-xs">{c.created_at?new Date(c.created_at).toLocaleDateString():'—'}</TableCell></TableRow>))}
        {paged.length===0&&<EmptyState message="No courses found" colSpan={6} />}
      </TableBody></Table></div>
      {totalPages>1&&(<div className="flex items-center justify-between pt-2"><p className="text-sm text-muted-foreground">Page {page+1} of {totalPages}</p><div className="flex gap-1"><Button variant="outline" size="sm" disabled={page===0} onClick={()=>setPage(p=>p-1)}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="sm" disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}><ChevronRight className="h-4 w-4" /></Button></div></div>)}
    </DataPageShell>
  );
}
