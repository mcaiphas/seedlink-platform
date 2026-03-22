import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings2, Plus } from 'lucide-react';
import { logAudit } from '@/lib/audit';

export default function PostingRules() {
  const [rules, setRules] = useState<any[]>([]);
  const [glAccounts, setGlAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    Promise.all([
      supabase.from('posting_rules').select('*').order('sort_order'),
      supabase.from('gl_accounts').select('id,account_code,account_name').eq('is_active', true).order('account_code'),
    ]).then(([{ data: r }, { data: gl }]) => {
      setRules(r || []);
      setGlAccounts(gl || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const glMap = useMemo(() => Object.fromEntries((glAccounts).map(g => [g.account_code, `${g.account_code} - ${g.account_name}`])), [glAccounts]);

  const filtered = useMemo(() =>
    rules.filter(r => !search || (r.rule_name || '').toLowerCase().includes(search.toLowerCase()) || (r.source_type || '').toLowerCase().includes(search.toLowerCase())),
    [rules, search]);

  async function toggleActive(rule: any) {
    await supabase.from('posting_rules').update({ is_active: !rule.is_active }).eq('id', rule.id);
    logAudit({ action: 'toggle_posting_rule', entity_type: 'posting_rule', entity_id: rule.id });
    load();
  }

  async function saveRule() {
    if (!editing) return;
    const payload = {
      rule_name: editing.rule_name,
      source_type: editing.source_type,
      description: editing.description || null,
      debit_account_code: editing.debit_account_code,
      credit_account_code: editing.credit_account_code,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
    };
    if (editing.id) {
      const { error } = await supabase.from('posting_rules').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Rule updated');
    } else {
      const { error } = await supabase.from('posting_rules').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Rule created');
    }
    logAudit({ action: editing.id ? 'update' : 'create', entity_type: 'posting_rule', new_values: payload });
    setEditing(null);
    load();
  }

  return (
    <PageShell title="Posting Rules" subtitle="Account mapping rules for automated journal entries" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search rules..."
      actions={<Button size="sm" onClick={() => setEditing({ rule_name: '', source_type: '', debit_account_code: '', credit_account_code: '', is_active: true, sort_order: 0 })}><Plus className="h-4 w-4 mr-1" />New Rule</Button>}
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Settings2} title="No posting rules" description="Configure account mappings for automated journal entries." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Rule</TableHead>
              <TableHead>Source Type</TableHead>
              <TableHead>Debit Account</TableHead>
              <TableHead>Credit Account</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="pr-6">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6 font-medium">{r.rule_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{r.source_type?.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm font-mono">{glMap[r.debit_account_code] || r.debit_account_code}</TableCell>
                  <TableCell className="text-sm font-mono">{glMap[r.credit_account_code] || r.credit_account_code}</TableCell>
                  <TableCell>
                    <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} />
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button variant="ghost" size="sm" onClick={() => setEditing({ ...r })}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'New'} Posting Rule</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Rule Name</Label><Input value={editing.rule_name} onChange={e => setEditing({...editing, rule_name: e.target.value})} /></div>
              <div><Label>Source Type</Label><Input value={editing.source_type} onChange={e => setEditing({...editing, source_type: e.target.value})} placeholder="e.g. customer_invoice" /></div>
              <div><Label>Description</Label><Input value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Debit Account Code</Label><Input value={editing.debit_account_code} onChange={e => setEditing({...editing, debit_account_code: e.target.value})} /></div>
                <div><Label>Credit Account Code</Label><Input value={editing.credit_account_code} onChange={e => setEditing({...editing, credit_account_code: e.target.value})} /></div>
              </div>
              <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: parseInt(e.target.value) || 0})} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={saveRule}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
