import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Wallet, Eye, Plus } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  suspended: { label: 'Suspended', variant: 'destructive' },
  closed: { label: 'Closed', variant: 'outline' },
};

export default function CreditAccountList() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  // Create form
  const [customerId, setCustomerId] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [accNotes, setAccNotes] = useState('');
  // Ledger entry
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [ledgerType, setLedgerType] = useState('payment_receipt');
  const [ledgerAmount, setLedgerAmount] = useState('');
  const [ledgerNotes, setLedgerNotes] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('customer_credit_accounts').select('*, profiles:customer_id(full_name)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = async (acc: any) => {
    setSelected(acc);
    setDetailOpen(true);
    const { data: l } = await supabase.from('customer_credit_ledger').select('*').eq('credit_account_id', acc.id).order('created_at', { ascending: false });
    setLedger(l || []);
  };

  const openCreate = async () => {
    setCreateOpen(true);
    if (profiles.length === 0) {
      const { data: p } = await supabase.from('profiles').select('id, full_name').order('full_name').limit(200);
      setProfiles(p || []);
    }
  };

  const handleCreate = async () => {
    if (!customerId || !creditLimit) { toast({ title: 'Fill required fields', variant: 'destructive' }); return; }
    setSaving(true);
    const accNum = `CA-${Date.now().toString().slice(-8)}`;
    const { error } = await supabase.from('customer_credit_accounts').insert({
      account_number: accNum, customer_id: customerId,
      credit_limit: Number(creditLimit), payment_terms_days: Number(paymentTerms),
      notes: accNotes || null, account_status: 'active',
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else { toast({ title: 'Credit account created' }); setCreateOpen(false); setCreditLimit(''); setCustomerId(''); setAccNotes(''); load(); }
    setSaving(false);
  };

  const handleLedgerEntry = async () => {
    if (!selected || !ledgerAmount || Number(ledgerAmount) <= 0) return;
    setSaving(true);
    const { error } = await supabase.from('customer_credit_ledger').insert({
      credit_account_id: selected.id, transaction_type: ledgerType,
      amount: Number(ledgerAmount), notes: ledgerNotes || null,
      created_by: user?.id,
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else { toast({ title: 'Ledger entry recorded' }); setLedgerOpen(false); setLedgerAmount(''); setLedgerNotes(''); openDetail(selected); load(); }
    setSaving(false);
  };

  const filtered = useMemo(() => {
    if (!search) return data;
    const s = search.toLowerCase();
    return data.filter(r =>
      (r.account_number || '').toLowerCase().includes(s) ||
      ((r.profiles as any)?.full_name || '').toLowerCase().includes(s)
    );
  }, [data, search]);

  const stats = useMemo(() => ({
    total: data.length,
    totalLimit: data.reduce((s, d) => s + Number(d.credit_limit), 0),
    totalUsed: data.reduce((s, d) => s + Number(d.credit_used), 0),
    totalAvailable: data.reduce((s, d) => s + Number(d.credit_available), 0),
  }), [data]);

  return (
    <DataPageShell title="Credit Accounts" description={`${data.length} credit accounts`} loading={loading}
      searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search accounts..."
      action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Account</Button>}>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Accounts</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Total Limit</p><p className="text-2xl font-bold">ZAR {stats.totalLimit.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Used</p><p className="text-2xl font-bold text-amber-600">ZAR {stats.totalUsed.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs font-medium text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-600">ZAR {stats.totalAvailable.toFixed(2)}</p></CardContent></Card>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Limit</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => openDetail(row)}>
                <TableCell><span className="font-mono font-medium text-primary">{row.account_number || row.id.slice(0, 8)}</span></TableCell>
                <TableCell className="font-medium">{(row.profiles as any)?.full_name || '—'}</TableCell>
                <TableCell><Badge variant={STATUS_MAP[row.account_status]?.variant || 'outline'}>{STATUS_MAP[row.account_status]?.label || row.account_status}</Badge></TableCell>
                <TableCell className="text-right">ZAR {Number(row.credit_limit).toFixed(2)}</TableCell>
                <TableCell className="text-right text-amber-600 font-medium">ZAR {Number(row.credit_used).toFixed(2)}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">ZAR {Number(row.credit_available).toFixed(2)}</TableCell>
                <TableCell>{row.payment_terms_days} days</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <EmptyState message="No credit accounts" colSpan={8} />}
          </TableBody>
        </Table>
      </div>

      {/* Detail */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" /> Credit Account {selected?.account_number}</DialogTitle>
            <DialogDescription>{(selected?.profiles as any)?.full_name || '—'}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground">Limit</p><p className="font-bold">ZAR {Number(selected.credit_limit).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Used</p><p className="font-bold text-amber-600">ZAR {Number(selected.credit_used).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Available</p><p className="font-bold text-green-600">ZAR {Number(selected.credit_available).toFixed(2)}</p></div>
                <div><p className="text-xs text-muted-foreground">Terms</p><p className="font-medium">{selected.payment_terms_days} days</p></div>
              </div>
              {/* Usage bar */}
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${Math.min((selected.credit_used / selected.credit_limit) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">{((selected.credit_used / selected.credit_limit) * 100).toFixed(1)}% utilised</p>

              <Separator />
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Credit Ledger ({ledger.length})</h4>
                <Button variant="outline" size="sm" onClick={() => setLedgerOpen(true)}><Plus className="h-3 w-3 mr-1" /> Record Entry</Button>
              </div>
              <div className="rounded border overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Ref</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Notes</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {ledger.map(l => (
                      <TableRow key={l.id}>
                        <TableCell><Badge variant={l.transaction_type === 'invoice_charge' ? 'destructive' : 'default'} className="capitalize">{l.transaction_type.replace('_', ' ')}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{l.reference_type ? `${l.reference_type}` : '—'}</TableCell>
                        <TableCell className={`text-right font-medium ${l.transaction_type === 'invoice_charge' ? 'text-destructive' : 'text-green-600'}`}>
                          {l.transaction_type === 'invoice_charge' ? '-' : '+'}ZAR {Number(l.amount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs">{l.notes || '—'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {ledger.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No ledger entries</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ledger Entry */}
      <Dialog open={ledgerOpen} onOpenChange={setLedgerOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Credit Ledger Entry</DialogTitle><DialogDescription>Add a payment receipt or credit note</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={ledgerType} onValueChange={setLedgerType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment_receipt">Payment Receipt</SelectItem>
                  <SelectItem value="credit_note">Credit Note</SelectItem>
                  <SelectItem value="invoice_charge">Invoice Charge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Amount (ZAR)</Label><Input type="number" step="0.01" value={ledgerAmount} onChange={e => setLedgerAmount(e.target.value)} /></div>
            <div><Label>Notes</Label><Textarea value={ledgerNotes} onChange={e => setLedgerNotes(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLedgerOpen(false)}>Cancel</Button>
            <Button onClick={handleLedgerEntry} disabled={saving}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Credit Account</DialogTitle><DialogDescription>Set up a new customer credit account</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger><SelectValue placeholder="Select customer..." /></SelectTrigger>
                <SelectContent>{profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Credit Limit (ZAR)</Label><Input type="number" step="0.01" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} /></div>
            <div><Label>Payment Terms (days)</Label><Input type="number" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} /></div>
            <div><Label>Notes</Label><Textarea value={accNotes} onChange={e => setAccNotes(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataPageShell>
  );
}
