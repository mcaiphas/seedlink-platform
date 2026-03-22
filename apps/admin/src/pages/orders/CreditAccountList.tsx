import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Wallet } from 'lucide-react';

export default function CreditAccountList() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('customer_credit_accounts').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setAccounts(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    accounts.filter(a => !search || a.id.includes(search) || (a.account_status || '').includes(search)),
    [accounts, search]);

  async function openDetail(acct: any) {
    setDetail(acct);
    const { data } = await supabase.from('customer_credit_ledger').select('*').eq('credit_account_id', acct.id).order('created_at', { ascending: false });
    setLedger(data || []);
  }

  return (
    <PageShell title="Credit Accounts" subtitle="Manage customer credit limits and ledger" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search accounts...">
      {filtered.length === 0 ? (
        <EmptyState icon={Wallet} title="No credit accounts" description="Credit accounts will appear here once created." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead className="text-right">Limit</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="pr-6">Usage</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => {
                const pct = a.credit_limit > 0 ? Math.min(100, ((a.credit_used || 0) / a.credit_limit) * 100) : 0;
                return (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(a)}>
                    <TableCell className="pl-6 font-mono text-xs">{a.id.slice(0, 8)}</TableCell>
                    <TableCell><StatusBadge type="credit" value={a.account_status} /></TableCell>
                    <TableCell className="text-sm">{a.payment_terms || '—'}</TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={a.credit_limit} currency={a.currency_code} /></TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={a.credit_used} currency={a.currency_code} /></TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={a.credit_available} currency={a.currency_code} /></TableCell>
                    <TableCell className="pr-6 w-24"><Progress value={pct} className="h-2" /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Credit Account Detail</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge type="credit" value={detail.account_status} /></div>
                <div><span className="text-muted-foreground">Terms:</span> {detail.payment_terms || '—'}</div>
                <div><span className="text-muted-foreground">Limit:</span> <CurrencyDisplay amount={detail.credit_limit} currency={detail.currency_code} /></div>
                <div><span className="text-muted-foreground">Used:</span> <CurrencyDisplay amount={detail.credit_used} currency={detail.currency_code} /></div>
                <div><span className="text-muted-foreground">Available:</span> <CurrencyDisplay amount={detail.credit_available} currency={detail.currency_code} /></div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Credit Ledger</h4>
                {ledger.length === 0 ? <p className="text-sm text-muted-foreground">No ledger entries</p> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Ref</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {ledger.map(l => (
                        <TableRow key={l.id}>
                          <TableCell>
                            <Badge variant={l.transaction_type === 'invoice_charge' ? 'destructive' : 'default'} className="text-xs capitalize">
                              {l.transaction_type?.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{l.reference_id?.slice(0, 8) || '—'}</TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={l.amount} /></TableCell>
                          <TableCell><DateDisplay date={l.created_at} showTime /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
