import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const CYCLE_TYPES = ['summer', 'winter', 'perennial'];

export default function SeasonList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ season_name: '', start_date: '', end_date: '', crop_cycle_type: 'summer', notes: '' });

  const { data: seasons = [], isLoading } = useQuery({
    queryKey: ['farm_seasons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('farm_seasons').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('farm_seasons').insert({
        season_name: form.season_name,
        start_date: form.start_date,
        end_date: form.end_date,
        crop_cycle_type: form.crop_cycle_type,
        notes: form.notes || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_seasons'] });
      setOpen(false);
      setForm({ season_name: '', start_date: '', end_date: '', crop_cycle_type: 'summer', notes: '' });
      toast.success('Season created');
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Seasons" description="Manage production seasons for farm planning" action={
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />New Season</Button>
      } />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Season</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : seasons.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No seasons yet</TableCell></TableRow>
              ) : seasons.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.season_name}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{s.crop_cycle_type}</Badge></TableCell>
                  <TableCell>{new Date(s.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(s.end_date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{s.notes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Season</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Season Name</Label><Input value={form.season_name} onChange={e => setForm(f => ({ ...f, season_name: e.target.value }))} placeholder="e.g. 2026 Summer Season" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
              <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>
            </div>
            <div>
              <Label>Crop Cycle</Label>
              <Select value={form.crop_cycle_type} onValueChange={v => setForm(f => ({ ...f, crop_cycle_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CYCLE_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.season_name || !form.start_date || !form.end_date}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
