import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, FileText, Bell, MessageSquare } from 'lucide-react';

interface Props {
  customerId: string;
}

const ACTION_ICONS: Record<string, any> = {
  email: Mail,
  document: FileText,
  notification: Bell,
  general: MessageSquare,
};

export function CustomerCommunicationTab({ customerId }: Props) {
  const [logs, setLogs] = useState<any[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('customer_communication_logs')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('document_delivery_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
    ]).then(([{ data: comm }, { data: del }]) => {
      setLogs(comm || []);
      setDeliveryLogs(del || []);
      setLoading(false);
    });
  }, [customerId]);

  if (loading) return <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  // Merge communication logs and delivery logs into unified timeline
  const timeline = [
    ...logs.map(l => ({
      id: l.id,
      date: l.created_at,
      type: l.action_type || 'general',
      action: l.action,
      channel: 'system',
      recipient: '',
      status: 'logged',
      notes: l.notes,
    })),
    ...deliveryLogs.map(d => ({
      id: d.id,
      date: d.created_at,
      type: 'email',
      action: d.subject || `${d.document_type} sent`,
      channel: d.delivery_channel,
      recipient: d.recipient_email || d.recipient_phone || '',
      status: d.delivery_status,
      notes: d.failure_reason,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (timeline.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No communication history for this customer.</div>;
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeline.map(item => {
            const Icon = ACTION_ICONS[item.type] || MessageSquare;
            return (
              <TableRow key={item.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(item.date).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs capitalize">{item.type.replace(/_/g, ' ')}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium max-w-[200px] truncate">{item.action}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{item.channel}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.recipient || '—'}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'sent' || item.status === 'delivered' ? 'default' : item.status === 'failed' ? 'destructive' : 'secondary'} className="text-[10px]">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
