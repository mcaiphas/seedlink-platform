import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

export default function RecommendationHistory() {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('agro_recommendations').select('*').order('created_at', { ascending: false });
      setRecs((data as any[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = recs.filter(r => `${r.recommendation_number} ${r.crop} ${r.province}`.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => {
    if (s === 'final') return 'default';
    if (s === 'converted') return 'secondary';
    return 'outline';
  };

  return (
    <DataPageShell title="Recommendation History" description="Track all agronomy recommendations generated"
      searchValue={search} onSearchChange={setSearch} loading={loading}
      action={<Button size="sm" onClick={() => navigate('/agronomy/recommend')}>New Recommendation</Button>}
    >
      <div className="rounded-lg border">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Number</TableHead><TableHead>Crop</TableHead><TableHead>Province</TableHead>
            <TableHead>Area (ha)</TableHead><TableHead>System</TableHead><TableHead>Status</TableHead>
            <TableHead>Converted</TableHead><TableHead>Date</TableHead><TableHead className="w-10" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <EmptyState message="No recommendations yet" colSpan={9} /> : filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">{r.recommendation_number || '—'}</TableCell>
                <TableCell className="capitalize font-medium">{r.crop.replace('_', ' ')}</TableCell>
                <TableCell>{r.province || '—'}</TableCell>
                <TableCell>{r.area_ha || '—'}</TableCell>
                <TableCell className="text-sm capitalize">{r.irrigation_type?.replace('_', ' ') || '—'}</TableCell>
                <TableCell><Badge variant={statusColor(r.status)} className="capitalize">{r.status}</Badge></TableCell>
                <TableCell>{r.converted_to_type ? <Badge variant="outline" className="capitalize">{r.converted_to_type}</Badge> : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => navigate(`/agronomy/recommend?id=${r.id}`)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
