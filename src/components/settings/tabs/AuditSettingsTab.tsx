import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SettingsSection } from '../SettingsSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export function AuditSettingsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, []);

  if (loading) return <Skeleton className="h-64 w-full" />;

  const actionColor = (action: string) => {
    if (action.includes('delete')) return 'destructive' as const;
    if (action.includes('create')) return 'default' as const;
    return 'secondary' as const;
  };

  return (
    <div className="space-y-6">
      <SettingsSection title="Recent Audit Logs" description="Latest 50 system events for compliance and troubleshooting.">
        <div className="rounded-lg border bg-card overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No audit logs found</TableCell></TableRow>
              )}
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
                  <TableCell><Badge variant={actionColor(log.action)} className="text-xs">{log.action}</Badge></TableCell>
                  <TableCell className="font-medium text-sm">{log.entity_type}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.entity_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.ip_address || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsSection>
    </div>
  );
}
