import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Plus, Lock, Unlock } from 'lucide-react';
import { logAudit } from '@/lib/audit';

export default function AccountingPeriods() {
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ financial_year: '', period_name: '', start_date: '', end_date: '' });

  const load = () => {
    supabase.from('accounting_periods').select('*').order('start_date', { ascending: false })
      .then(({ data }) => { setPeriods(data || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() =>
    periods.filter(p => {
      if (search && !(p.period_name || '').toLowerCase().includes(search.toLowerCase()) && !(p.financial_year || '').includes(search)) return false;
      return true;
    }), [periods, search]);

  async function createPeriod() {
    if (!form.financial_year || !form.period_name || !form.start_date || !form.end_date) {
      toast.error('All fields are required');
      return;
    }
    const { error } = await supabase.from('accounting_periods').insert({
      financial_year: form.financial_year,
      period_name: form.period_name,
      start_date: form.start_date,
      end_date: form.end_date,
      status: 'open',
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Period created');
    logAudit({ action: 'create', entity_type: 'accounting_period', new_values: form });
    setShowCreate(false);
    setForm({ financial_year: '', period_name: '', start_date: '', end_date: '' });
    load();
  }

  async function toggleStatus(p: any) {
    const newStatus = p.status === 'open' ? 'closed' : 'open';
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('accounting_periods').update({
      status: newStatus,
      closed_by: newStatus === 'closed' ? user?.id : null,
      closed_at: newStatus === 'closed' ? new Date().toISOString() : null,
    }).eq('id', p.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Period ${newStatus}`);
    logAudit({ action: `period_${newStatus}`, entity_type: 'accounting_period', entity_id: p.id });
    load();
  }

  const statusColor = (s: string) => {
    if (s === 'open') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s === 'closed') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <PageShell title="Accounting Periods" subtitle="Manage financial periods" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search periods..."
      actions={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" />New Period</Button>}
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No periods" description="Create your first accounting period." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Financial Year</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="pl-6 font-medium">{p.financial_year}</TableCell>
                  <TableCell className="font-medium">{p.period_name}</TableCell>
                  <TableCell><DateDisplay date={p.start_date} /></TableCell>
                  <TableCell><DateDisplay date={p.end_date} /></TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs capitalize ${statusColor(p.status)}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(p)}>
                      {p.status === 'open' ? <Lock className="h-3.5 w-3.5 mr-1" /> : <Unlock className="h-3.5 w-3.5 mr-1" />}
                      {p.status === 'open' ? 'Close' : 'Reopen'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Accounting Period</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Financial Year</Label><Input value={form.financial_year} onChange={e => setForm({...form, financial_year: e.target.value})} placeholder="FY2026" /></div>
            <div><Label>Period Name</Label><Input value={form.period_name} onChange={e => setForm({...form, period_name: e.target.value})} placeholder="January 2026" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} /></div>
              <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={createPeriod}>Create Period</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
