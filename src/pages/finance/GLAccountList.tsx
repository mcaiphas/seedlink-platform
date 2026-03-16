import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Pencil, BookOpen } from 'lucide-react';

interface GLForm { account_code: string; account_name: string; account_type: string; is_active: boolean; }
const empty: GLForm = { account_code: '', account_name: '', account_type: 'asset', is_active: true };

export default function GLAccountList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<GLForm>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); const { data: d } = await supabase.from('gl_accounts').select('*').order('account_code'); setData(d || []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => data.filter(r => !search || r.account_code?.toLowerCase().includes(search.toLowerCase()) || r.account_name?.toLowerCase().includes(search.toLowerCase())), [data, search]);

  const handleSave = async () => {
    if (!form.account_code.trim() || !form.account_name.trim()) { toast({ title: 'Code and name required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload: any = { account_code: form.account_code.trim(), account_name: form.account_name.trim(), account_type: form.account_type, is_active: form.is_active };
    const { error } = editId ? await supabase.from('gl_accounts').update(payload).eq('id', editId) : await supabase.from('gl_accounts').insert(payload);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    toast({ title: editId ? 'Account updated' : 'Account created' }); setSaving(false); setDialogOpen(false); load();
  };

  const typeColor: Record<string, string> = { asset: 'default', liability: 'secondary', equity: 'outline', revenue: 'default', expense: 'destructive' };

  return (
    <div className="space-y-6">
      <DataPageShell title="GL Accounts" description="Chart of accounts for commerce finance"
        action={<Button onClick={() => { setEditId(null); setForm(empty); setDialogOpen(true); }} className="gap-2"><Plus className="h-4 w-4" />Add Account</Button>}>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Code</TableHead><TableHead className="font-semibold">Account Name</TableHead><TableHead className="font-semibold">Type</TableHead><TableHead className="font-semibold">Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
            <TableBody>{filtered.map(r => (
              <TableRow key={r.id} className="group hover:bg-muted/20 cursor-pointer" onClick={() => { setEditId(r.id); setForm({ account_code: r.account_code, account_name: r.account_name, account_type: r.account_type, is_active: r.is_active }); setDialogOpen(true); }}>
                <TableCell><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.account_code}</span></div></TableCell>
                <TableCell className="font-medium">{r.account_name}</TableCell>
                <TableCell><Badge variant={(typeColor[r.account_type] || 'outline') as any} className="text-xs capitalize">{r.account_type}</Badge></TableCell>
                <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'} className="text-xs">{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}{filtered.length === 0 && !loading && <EmptyState message="No GL accounts found" colSpan={5} />}</TableBody></Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? 'Edit Account' : 'New GL Account'}</DialogTitle><DialogDescription>Manage chart of accounts entries.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Account Code <span className="text-destructive">*</span></Label><Input value={form.account_code} onChange={e => setForm(f => ({ ...f, account_code: e.target.value }))} className="font-mono" placeholder="e.g. 1000" /></div>
            <div className="space-y-1.5"><Label>Account Name <span className="text-destructive">*</span></Label><Input value={form.account_name} onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))} placeholder="e.g. Inventory" /></div>
            <div className="space-y-1.5"><Label>Account Type</Label><Select value={form.account_type} onValueChange={v => setForm(f => ({ ...f, account_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="asset">Asset</SelectItem><SelectItem value="liability">Liability</SelectItem><SelectItem value="equity">Equity</SelectItem><SelectItem value="revenue">Revenue</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select></div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"><Label>Active</Label><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
