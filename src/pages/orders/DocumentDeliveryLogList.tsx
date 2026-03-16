import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail } from 'lucide-react';

export default function DocumentDeliveryLogList() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    supabase.from('document_delivery_logs').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    logs.filter(l => {
      if (search && !(l.recipient_email || '').toLowerCase().includes(search.toLowerCase()) && !(l.subject || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && l.delivery_status !== statusFilter) return false;
      return true;
    }), [logs, search, statusFilter]);

  return (
    <PageShell title="Document Delivery Logs" subtitle="Track invoice and document delivery status" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search by email or subject..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Mail} title="No delivery logs" description="Document delivery logs will appear here." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Document</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead className="pr-6">Delivered</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="pl-6"><Badge variant="outline" className="capitalize text-xs">{l.document_type?.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{l.subject || '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{l.delivery_channel}</Badge></TableCell>
                  <TableCell className="text-sm">{l.recipient_email || l.recipient_phone || '—'}</TableCell>
                  <TableCell><StatusBadge type="delivery" value={l.delivery_status} /></TableCell>
                  <TableCell><DateDisplay date={l.sent_at} showTime /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={l.delivered_at} showTime /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
