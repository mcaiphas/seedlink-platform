import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DataPageShell } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Bell, Plus, Pencil, Copy } from 'lucide-react';

const CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'in_app', label: 'In-App' },
];

const TRIGGER_EVENTS = [
  'quote_sent', 'order_confirmed', 'order_shipped', 'invoice_issued',
  'invoice_due', 'invoice_overdue', 'payment_received', 'payment_request_sent',
  'statement_generated', 'po_approved', 'goods_received', 'supplier_invoice_due',
  'welcome', 'password_reset', 'low_stock', 'approval_required',
  'delivery_status_change', 'manual',
];

const RECIPIENT_TYPES = [
  { value: 'customer', label: 'Customer' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'staff', label: 'Staff' },
  { value: 'custom', label: 'Custom' },
];

interface Template {
  id: string; code: string; title: string; channel: string; subject: string | null;
  body: string | null; is_active: boolean; trigger_event: string; recipient_type: string;
  description: string | null; sort_order: number;
}

const emptyForm = {
  code: '', title: '', channel: 'email', subject: '', body: '', trigger_event: 'manual',
  recipient_type: 'customer', description: '', is_active: true,
};

export default function NotificationTemplates() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [channelFilter, setChannelFilter] = useState('all');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notification_templates')
        .select('*').order('sort_order').order('title');
      if (error) throw error;
      return data as Template[];
    },
  });

  const filtered = channelFilter === 'all'
    ? templates
    : templates.filter(t => t.channel === channelFilter);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        code: form.code, title: form.title, channel: form.channel,
        subject: form.subject || null, body: form.body || null,
        trigger_event: form.trigger_event, recipient_type: form.recipient_type,
        description: form.description || null, is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await supabase.from('notification_templates').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        payload.created_by = user?.id;
        const { error } = await supabase.from('notification_templates').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-templates'] });
      toast.success(editing ? 'Template updated' : 'Template created');
      setShowForm(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await supabase.from('notification_templates').update({ is_active: active, updated_at: new Date().toISOString() }).eq('id', id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notification-templates'] }); },
  });

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(t: Template) {
    setEditing(t);
    setForm({
      code: t.code, title: t.title, channel: t.channel,
      subject: t.subject || '', body: t.body || '',
      trigger_event: t.trigger_event || 'manual',
      recipient_type: t.recipient_type || 'customer',
      description: t.description || '', is_active: t.is_active,
    });
    setShowForm(true);
  }

  const channelBadge = (ch: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-500/10 text-blue-700 border-blue-200',
      sms: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      whatsapp: 'bg-green-500/10 text-green-700 border-green-200',
      in_app: 'bg-purple-500/10 text-purple-700 border-purple-200',
    };
    return <Badge variant="outline" className={`text-[10px] capitalize ${colors[ch] || ''}`}>{ch.replace('_', '-')}</Badge>;
  };

  return (
    <DataPageShell title="Notification Templates" description="Manage email, SMS, WhatsApp, and in-app notification templates">
      <div className="flex items-center gap-3 mb-6">
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Channel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {CHANNELS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Template</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No notification templates configured</p>
          <Button className="mt-4" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Create Template</Button>
        </Card>
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Template</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Trigger Event</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6">
                    <div>
                      <p className="font-medium text-sm">{t.title}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{t.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>{channelBadge(t.channel)}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{(t.trigger_event || '').replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm capitalize">{(t.recipient_type || '').replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.subject || '—'}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={t.is_active} onCheckedChange={v => toggleMutation.mutate({ id: t.id, active: v })} />
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(t)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Template' : 'New Notification Template'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Template Code *</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. invoice_due_reminder" /></div>
              <div><Label>Template Name *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Channel *</Label>
                <Select value={form.channel} onValueChange={v => setForm(f => ({ ...f, channel: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CHANNELS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trigger Event *</Label>
                <Select value={form.trigger_event} onValueChange={v => setForm(f => ({ ...f, trigger_event: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TRIGGER_EVENTS.map(e => <SelectItem key={e} value={e}>{e.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recipient Type</Label>
                <Select value={form.recipient_type} onValueChange={v => setForm(f => ({ ...f, recipient_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{RECIPIENT_TYPES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><Label>Subject Template</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Invoice {{invoice_number}} is due" /></div>
            <div><Label>Body Template</Label><Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={6} placeholder="Template body with {{placeholders}}" /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : editing ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
