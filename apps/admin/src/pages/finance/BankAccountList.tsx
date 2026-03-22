import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logAudit } from '@/lib/audit';
import { toast } from 'sonner';
import { DataPageShell } from '@/components/DataPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Building2, Edit, Search } from 'lucide-react';

const EMPTY = {
  bank_name: '', account_name: '', account_number: '', branch_code: '', swift_code: '',
  currency_code: 'ZAR', country_code: 'ZA', account_type: 'operating',
  opening_balance: 0, opening_balance_date: new Date().toISOString().slice(0, 10),
  is_active: true, notes: '',
};

export default function BankAccountList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [search, setSearch] = useState('');

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_accounts').select('*').order('bank_name');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        opening_balance: Number(form.opening_balance),
        created_by: user?.id || null,
      };
      if (editing) {
        const { error } = await supabase.from('bank_accounts').update(payload).eq('id', editing.id);
        if (error) throw error;
        logAudit({ action: 'update', entity_type: 'bank_account', entity_id: editing.id });
      } else {
        const { error } = await supabase.from('bank_accounts').insert(payload);
        if (error) throw error;
        logAudit({ action: 'create', entity_type: 'bank_account' });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast.success(editing ? 'Account updated' : 'Account created');
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setOpen(true); };
  const openEdit = (a: any) => {
    setEditing(a);
    setForm({
      bank_name: a.bank_name, account_name: a.account_name, account_number: a.account_number,
      branch_code: a.branch_code || '', swift_code: a.swift_code || '',
      currency_code: a.currency_code, country_code: a.country_code,
      account_type: a.account_type, opening_balance: a.opening_balance,
      opening_balance_date: a.opening_balance_date, is_active: a.is_active, notes: a.notes || '',
    });
    setOpen(true);
  };

  const filtered = accounts.filter((a: any) =>
    `${a.bank_name} ${a.account_name} ${a.account_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalBalance = accounts
    .filter((a: any) => a.is_active)
    .reduce((s: number, a: any) => s + Number(a.opening_balance || 0), 0);

  return (
    <DataPageShell title="Bank Accounts" description="Manage company bank accounts">
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Accounts</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{accounts.length}</p></CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{accounts.filter((a: any) => a.is_active).length}</p></CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Opening Balances Total</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">R {totalBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p></CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search accounts…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Account</Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Opening Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No bank accounts found</TableCell></TableRow>
            ) : filtered.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.bank_name}</TableCell>
                <TableCell>{a.account_name}</TableCell>
                <TableCell className="font-mono text-sm">{a.account_number}</TableCell>
                <TableCell className="capitalize">{a.account_type?.replace(/_/g, ' ')}</TableCell>
                <TableCell>{a.currency_code}</TableCell>
                <TableCell className="text-right font-mono">R {Number(a.opening_balance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Badge variant={a.is_active ? 'default' : 'secondary'}>{a.is_active ? 'Active' : 'Inactive'}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Edit className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Bank Name</Label><Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} /></div>
              <div><Label>Account Name</Label><Input value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Account Number</Label><Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} /></div>
              <div><Label>Branch Code</Label><Input value={form.branch_code} onChange={(e) => setForm({ ...form, branch_code: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>SWIFT Code</Label><Input value={form.swift_code} onChange={(e) => setForm({ ...form, swift_code: e.target.value })} /></div>
              <div>
                <Label>Account Type</Label>
                <Select value={form.account_type} onValueChange={(v) => setForm({ ...form, account_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operating">Operating</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="foreign_currency">Foreign Currency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Currency</Label><Input value={form.currency_code} onChange={(e) => setForm({ ...form, currency_code: e.target.value })} /></div>
              <div><Label>Opening Balance</Label><Input type="number" value={form.opening_balance} onChange={(e) => setForm({ ...form, opening_balance: Number(e.target.value) })} /></div>
              <div><Label>Balance Date</Label><Input type="date" value={form.opening_balance_date} onChange={(e) => setForm({ ...form, opening_balance_date: e.target.value })} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={!form.bank_name || !form.account_number || save.isPending}>
              {save.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
