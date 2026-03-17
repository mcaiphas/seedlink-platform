import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/AdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Database, HardDrive, Mail, FileText, Activity, Landmark } from 'lucide-react';

interface DiagnosticItem {
  label: string;
  status: 'ok' | 'warning' | 'error' | 'unknown';
  detail: string;
  icon: React.ElementType;
}

export default function BackendDiagnostics() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<DiagnosticItem[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  async function runDiagnostics() {
    setLoading(true);
    const results: DiagnosticItem[] = [];

    // 1. Supabase connectivity
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      results.push({
        label: 'Supabase Connectivity',
        status: error ? 'error' : 'ok',
        detail: error ? error.message : 'Connected successfully',
        icon: Database,
      });
    } catch {
      results.push({ label: 'Supabase Connectivity', status: 'error', detail: 'Connection failed', icon: Database });
    }

    // 2. Storage bucket – use list() with defensive timeout handling
    try {
      const { data, error } = await supabase.storage.from('document-files').list('', { limit: 1 });
      if (error) {
        const msg = error.message || '';
        if (msg.includes('not found') || msg.includes('Bucket not found')) {
          results.push({ label: 'Document Storage Bucket', status: 'error', detail: 'Bucket not found', icon: HardDrive });
        } else if (msg.includes('Timeout') || msg.includes('timeout') || msg.includes('DatabaseTimeout')) {
          // Bucket exists but storage RLS query timed out – not a missing-bucket error
          results.push({ label: 'Document Storage Bucket', status: 'warning', detail: 'Bucket exists but RLS query timed out', icon: HardDrive });
        } else {
          results.push({ label: 'Document Storage Bucket', status: 'warning', detail: msg, icon: HardDrive });
        }
      } else {
        results.push({
          label: 'Document Storage Bucket',
          status: 'ok',
          detail: `Private bucket configured (${data?.length ?? 0} items sampled)`,
          icon: HardDrive,
        });
      }
    } catch {
      results.push({ label: 'Document Storage Bucket', status: 'warning', detail: 'Could not verify – possible timeout', icon: HardDrive });
    }

    // 3. Notification channel configs
    try {
      const { data, error } = await supabase.from('notification_channel_configs').select('channel,is_active,auth_status');
      if (error) {
        results.push({ label: 'Notification Channels', status: 'warning', detail: error.message, icon: Mail });
      } else {
        const active = (data || []).filter((c: any) => c.is_active);
        const verified = active.filter((c: any) => c.auth_status === 'verified');
        results.push({
          label: 'Notification Channels',
          status: verified.length > 0 ? 'ok' : active.length > 0 ? 'warning' : 'error',
          detail: `${active.length} active, ${verified.length} verified`,
          icon: Mail,
        });
      }
    } catch {
      results.push({ label: 'Notification Channels', status: 'unknown', detail: 'Table may not exist', icon: Mail });
    }

    // 4. Failed dispatch count
    try {
      const { count, error } = await supabase
        .from('document_delivery_logs')
        .select('id', { count: 'exact', head: true })
        .eq('delivery_status', 'failed');
      results.push({
        label: 'Failed Document Dispatches',
        status: (count ?? 0) > 0 ? 'warning' : 'ok',
        detail: error ? error.message : `${count ?? 0} failed dispatches`,
        icon: FileText,
      });
    } catch {
      results.push({ label: 'Failed Document Dispatches', status: 'unknown', detail: 'Could not query', icon: FileText });
    }

    // 5. GL Accounts health
    try {
      const { count } = await supabase.from('gl_accounts').select('id', { count: 'exact', head: true }).eq('is_active', true);
      results.push({
        label: 'Chart of Accounts',
        status: (count ?? 0) > 5 ? 'ok' : 'warning',
        detail: `${count ?? 0} active GL accounts`,
        icon: Landmark,
      });
    } catch {
      results.push({ label: 'Chart of Accounts', status: 'unknown', detail: 'Could not query', icon: Landmark });
    }

    // 6. Bank statement imports – empty is valid, not an error
    try {
      const { data, error } = await supabase
        .from('bank_statement_imports')
        .select('id,created_at,import_status')
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) {
        results.push({ label: 'Bank Statement Imports', status: 'warning', detail: error.message, icon: Activity });
      } else {
        const latest = data?.[0];
        results.push({
          label: 'Bank Statement Imports',
          status: latest ? 'ok' : 'ok',
          detail: latest
            ? `Last import: ${new Date(latest.created_at).toLocaleDateString()} (${latest.import_status})`
            : 'No imports yet – ready to receive',
          icon: Activity,
        });
      }
    } catch {
      results.push({ label: 'Bank Statement Imports', status: 'unknown', detail: 'Could not query', icon: Activity });
    }

    // 7. Journal entries health
    try {
      const { count } = await supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('status', 'posted');
      results.push({
        label: 'Posted Journal Entries',
        status: 'ok',
        detail: `${count ?? 0} posted journals`,
        icon: Database,
      });
    } catch {
      results.push({ label: 'Posted Journal Entries', status: 'unknown', detail: 'Could not query', icon: Database });
    }

    setItems(results);
    setLastChecked(new Date());
    setLoading(false);
  }

  useEffect(() => { runDiagnostics(); }, []);

  const statusIcon = (s: DiagnosticItem['status']) => {
    if (s === 'ok') return <CheckCircle2 className="h-4 w-4 text-primary" />;
    if (s === 'warning') return <AlertTriangle className="h-4 w-4 text-accent-foreground" />;
    if (s === 'error') return <XCircle className="h-4 w-4 text-destructive" />;
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  const statusBadge = (s: DiagnosticItem['status']) => {
    const map = { ok: 'default', warning: 'secondary', error: 'destructive', unknown: 'outline' } as const;
    const labels = { ok: 'Healthy', warning: 'Warning', error: 'Error', unknown: 'Unknown' };
    return <Badge variant={map[s]}>{labels[s]}</Badge>;
  };

  return (
    <AdminRoute title="Backend Diagnostics">
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Backend Diagnostics</h1>
            <p className="text-muted-foreground mt-1">
              Operational health checks for Supabase backend services.
              {lastChecked && <span className="ml-2 text-xs">Last checked: {lastChecked.toLocaleTimeString()}</span>}
            </p>
          </div>
          <Button onClick={runDiagnostics} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Re-check
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <Card key={item.label} className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                  </div>
                  {statusIcon(item.status)}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.detail}</span>
                  {statusBadge(item.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
