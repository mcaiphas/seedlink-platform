import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Notebook, Plus } from 'lucide-react';
import { logAudit } from '@/lib/audit';

export default function GLAccountList() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    supabase.from('gl_accounts').select('*').order('account_code', { ascending: true })
      .then(({ data }) => { setAccounts(data || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() =>
    accounts.filter(a => {
      if (search && !(a.account_code || '').includes(search) && !(a.account_name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && a.account_type !== typeFilter) return false;
      return true;
    }), [accounts, search, typeFilter]);

  const parentOptions = accounts.filter(a => a.id !== editing?.id);

  async function saveAccount() {
    if (!editing) return;
    const payload = {
      account_code: editing.account_code,
      account_name: editing.account_name,
      account_type: editing.account_type,
      account_sub_type: editing.account_sub_type || null,
      description: editing.description || null,
      parent_account_id: editing.parent_account_id || null,
      posting_allowed: editing.posting_allowed ?? true,
      is_active: editing.is_active ?? true,
    };
    if (editing.id) {
      const { error } = await supabase.from('gl_accounts').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Account updated');
    } else {
      const { error } = await supabase.from('gl_accounts').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Account created');
    }
    logAudit({ action: editing.id ? 'update' : 'create', entity_type: 'gl_account', new_values: payload });
    setEditing(null);
    load();
  }

  return (
    <PageShell title="Chart of Accounts" subtitle="Hierarchical account structure" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search by code or name..."
      actions={<Button size="sm" onClick={() => setEditing({ account_code: '', account_name: '', account_type: 'asset', posting_allowed: true, is_active: true })}><Plus className="h-4 w-4 mr-1" />New Account</Button>}
      filters={
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="asset">Asset</SelectItem>
            <SelectItem value="liability">Liability</SelectItem>
            <SelectItem value="equity">Equity</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="cost_of_sales">Cost of Sales</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="other_income">Other Income</SelectItem>
            <SelectItem value="other_expense">Other Expense</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Notebook} title="No GL accounts" description="GL accounts will appear once configured." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sub-type</TableHead>
              <TableHead>Postable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="pl-6 font-mono font-medium">{a.account_code}</TableCell>
                  <TableCell className="font-medium">{a.account_name}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{(a.account_type || '').replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm capitalize">{a.account_sub_type || '—'}</TableCell>
                  <TableCell>{a.posting_allowed ? <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">Yes</Badge> : <Badge variant="outline" className="text-xs">No</Badge>}</TableCell>
                  <TableCell>
                    <Badge variant={a.is_active !== false ? 'default' : 'secondary'} className={`text-xs ${a.is_active !== false ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}`}>
                      {a.is_active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button variant="ghost" size="sm" onClick={() => setEditing({ ...a })}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'New'} GL Account</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Account Code</Label><Input value={editing.account_code} onChange={e => setEditing({...editing, account_code: e.target.value})} /></div>
                <div><Label>Account Name</Label><Input value={editing.account_name} onChange={e => setEditing({...editing, account_name: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Account Type</Label>
                  <Select value={editing.account_type} onValueChange={v => setEditing({...editing, account_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="liability">Liability</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="cost_of_sales">Cost of Sales</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="other_income">Other Income</SelectItem>
                      <SelectItem value="other_expense">Other Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Sub-type</Label><Input value={editing.account_sub_type || ''} onChange={e => setEditing({...editing, account_sub_type: e.target.value})} placeholder="Optional" /></div>
              </div>
              <div>
                <Label>Parent Account</Label>
                <Select value={editing.parent_account_id || 'none'} onValueChange={v => setEditing({...editing, parent_account_id: v === 'none' ? null : v})}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {parentOptions.map(p => <SelectItem key={p.id} value={p.id}>{p.account_code} - {p.account_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} rows={2} /></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={editing.posting_allowed ?? true} onCheckedChange={v => setEditing({...editing, posting_allowed: v})} /><Label>Posting Allowed</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editing.is_active ?? true} onCheckedChange={v => setEditing({...editing, is_active: v})} /><Label>Active</Label></div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={saveAccount}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
