import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Mail, Phone, MessageSquare } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  queued: { label: 'Queued', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
  bounced: { label: 'Bounced', variant: 'destructive' },
};

const CHANNEL_ICON: Record<string, any> = {
  email: Mail, sms: MessageSquare, phone: Phone, whatsapp: MessageSquare,
};

export default function DocumentDeliveryLogList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    supabase.from('document_delivery_logs').select('*').order('created_at', { ascending: false }).limit(500)
      .then(({ data: d }) => { setData(d || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        (r.recipient_email || '').toLowerCase().includes(s) ||
        (r.subject || '').toLowerCase().includes(s) ||
        (r.document_type || '').toLowerCase().includes(s)
      );
    }
    if (channelFilter !== 'all') result = result.filter(r => r.delivery_channel === channelFilter);
    if (statusFilter !== 'all') result = result.filter(r => r.delivery_status === statusFilter);
    return result;
  }, [data, search, channelFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: data.length,
    sent: data.filter(d => d.delivery_status === 'sent' || d.delivery_status === 'delivered').length,
    failed: data.filter(d => d.delivery_status === 'failed' || d.delivery_status === 'bounced').length,
    queued: data.filter(d => d.delivery_status === 'queued').length,
  }), [data]);

  return (
    <DataPageShell title="Document Delivery Logs" description={`${filtered.length} delivery records`}
      loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by email, subject, or document type...">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Sent/Delivered</p><p className="text-2xl font-bold text-green-600">{stats.sent}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Failed</p><p className="text-2xl font-bold text-destructive">{stats.failed}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Queued</p><p className="text-2xl font-bold text-amber-600">{stats.queued}</p></CardContent></Card>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Type</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => {
              const Icon = CHANNEL_ICON[row.delivery_channel] || Mail;
              return (
                <TableRow key={row.id}>
                  <TableCell><Badge variant="outline" className="capitalize">{(row.document_type || '').replace('_', ' ')}</Badge></TableCell>
                  <TableCell><div className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-muted-foreground" /><span className="capitalize text-sm">{row.delivery_channel}</span></div></TableCell>
                  <TableCell className="text-sm">{row.recipient_email || row.recipient_phone || '—'}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{row.subject || '—'}</TableCell>
                  <TableCell><Badge variant={STATUS_MAP[row.delivery_status]?.variant || 'outline'}>{STATUS_MAP[row.delivery_status]?.label || row.delivery_status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.sent_at ? new Date(row.sent_at).toLocaleString() : '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.delivered_at ? new Date(row.delivered_at).toLocaleString() : '—'}</TableCell>
                  <TableCell className="text-xs text-destructive max-w-[150px] truncate">{row.error_message || ''}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && <EmptyState message="No delivery logs" colSpan={8} />}
          </TableBody>
        </Table>
      </div>
    </DataPageShell>
  );
}
