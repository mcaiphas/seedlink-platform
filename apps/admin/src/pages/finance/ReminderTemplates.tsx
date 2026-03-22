import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export default function ReminderTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('reminder_templates').select('*').order('days_offset').then(({ data }) => {
      setTemplates(data || []);
      setLoading(false);
    });
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    await supabase.from('reminder_templates').update({ is_active: !isActive, updated_at: new Date().toISOString() }).eq('id', id);
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !isActive } : t));
    toast({ title: `Template ${!isActive ? 'enabled' : 'disabled'}` });
  }

  return (
    <PageShell title="Reminder Templates" subtitle="Configure automated reminder templates for invoices and statements" loading={loading}>
      {templates.length === 0 ? (
        <EmptyState icon={Bell} title="No templates" description="Reminder templates have not been configured." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Template</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Days Offset</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right pr-6">Active</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {templates.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6 font-medium">{t.template_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{(t.reminder_type || '').replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">
                    {t.days_offset === 0 ? 'On due date' : t.days_offset < 0 ? `${Math.abs(t.days_offset)} days before` : `${t.days_offset} days after`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{t.subject_template}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Switch checked={t.is_active} onCheckedChange={() => toggleActive(t.id, t.is_active)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
