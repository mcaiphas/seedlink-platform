import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Plus } from 'lucide-react';

export default function CustomerCommunicationLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', action: '', action_type: 'general', notes: '' });

  useEffect(() => {
    Promise.all([
      supabase.from('customer_communication_logs').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('customers').select('id, customer_name').eq('is_active', true).order('customer_name'),
      supabase.from('profiles').select('id, full_name').limit(200),
    ]).then(([{ data: l }, { data: c }, { data: p }]) => {
      setLogs(l || []);
      setCustomers(c || []);
      setProfiles(p || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    logs.filter(l => {
      if (search && !(l.action || '').toLowerCase().includes(search.toLowerCase()) && !(l.notes || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (customerFilter !== 'all' && l.customer_id !== customerFilter) return false;
      return true;
    }), [logs, search, customerFilter]);

  const getName = (id: string) => customers.find(c => c.id === id)?.customer_name || '—';
  const getUserName = (id: string) => profiles.find(p => p.id === id)?.full_name || '—';

  async function handleCreate() {
    if (!formData.customer_id || !formData.action) { toast({ title: 'Fill required fields', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('customer_communication_logs').insert({
        customer_id: formData.customer_id, action: formData.action,
        action_type: formData.action_type, notes: formData.notes || null,
        performed_by: user?.id || null,
      }).select().single();
      if (data) setLogs(prev => [data, ...prev]);
      toast({ title: 'Log entry added' });
      setShowForm(false);
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setSaving(false);
  }

  const actionTypeColors: Record<string, string> = {
    statement_sent: 'bg-blue-100 text-blue-800 border-blue-200',
    payment_request: 'bg-amber-100 text-amber-800 border-amber-200',
    invoice_emailed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    reminder: 'bg-orange-100 text-orange-800 border-orange-200',
    general: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <PageShell title="Communication History" subtitle="Track all customer communication events" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search communications..."
      actions={<Button onClick={() => { setFormData({ customer_id: '', action: '', action_type: 'general', notes: '' }); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" />Log Entry</Button>}
      filters={
        <Select value={customerFilter} onValueChange={setCustomerFilter}>
          <SelectTrigger className="w-[200px] bg-card"><SelectValue placeholder="All Customers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No communication logs" description="Communication events will appear here." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Date</TableHead><TableHead>Customer</TableHead>
              <TableHead>Type</TableHead><TableHead>Action</TableHead>
              <TableHead>User</TableHead><TableHead className="pr-6">Notes</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="pl-6"><DateDisplay date={l.created_at} showTime /></TableCell>
                  <TableCell className="font-medium">{getName(l.customer_id)}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${actionTypeColors[l.action_type] || ''}`}>{(l.action_type || '').replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">{l.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.performed_by ? getUserName(l.performed_by) : '—'}</TableCell>
                  <TableCell className="pr-6 text-xs text-muted-foreground max-w-[200px] truncate">{l.notes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Log Communication</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Customer *</Label>
              <Select value={formData.customer_id} onValueChange={v => setFormData(p => ({ ...p, customer_id: v }))}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.customer_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Type</Label>
              <Select value={formData.action_type} onValueChange={v => setFormData(p => ({ ...p, action_type: v }))}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="statement_sent">Statement Sent</SelectItem>
                  <SelectItem value="payment_request">Payment Request</SelectItem>
                  <SelectItem value="invoice_emailed">Invoice Emailed</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Action *</Label><Input value={formData.action} onChange={e => setFormData(p => ({ ...p, action: e.target.value }))} className="bg-card" placeholder="e.g., Sent monthly statement via email" /></div>
            <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="bg-card" rows={3} /></div>
          </div>
          <DialogFooter><Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Add Entry'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
