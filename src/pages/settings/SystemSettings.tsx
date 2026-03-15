import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { DataPageShell } from '@/components/DataPageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
export default function SystemSettings() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!adminLoading) setLoading(false); }, [adminLoading]);
  if (!adminLoading && !isAdmin) return <DataPageShell title="Settings" loading={false}><AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage system settings." /></DataPageShell>;
  return (
    <DataPageShell title="Settings" description="Platform configuration" loading={loading || adminLoading}>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />System Settings</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">System configuration management is available here.</p></CardContent></Card>
    </DataPageShell>
  );
}
