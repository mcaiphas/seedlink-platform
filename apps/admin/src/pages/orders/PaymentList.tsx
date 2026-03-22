import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard } from 'lucide-react';

export default function PaymentList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setPayments(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    payments.filter(p => {
      if (search && !(p.payment_reference || '').toLowerCase().includes(search.toLowerCase()) && !p.id.includes(search)) return false;
      if (methodFilter !== 'all' && p.payment_method !== methodFilter) return false;
      if (statusFilter !== 'all' && p.payment_status !== statusFilter) return false;
      return true;
    }), [payments, search, methodFilter, statusFilter]);

  async function openDetail(p: any) {
    setDetail(p);
    const { data } = await supabase.from('payment_allocations').select('*').eq('payment_id', p.id);
    setAllocations(data || []);
  }

  return (
    <PageShell title="Payments" subtitle="Track all payment transactions" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search by reference..."
      filters={
        <div className="flex gap-2">
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="eft">EFT</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit_account">Credit Account</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments found" description="Payment records will appear here." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Reference</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="pr-6">Paid</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(p)}>
                  <TableCell className="pl-6 font-medium text-sm">{p.payment_reference || p.id.slice(0, 8)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{p.payment_method?.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">{p.payment_provider || '—'}</TableCell>
                  <TableCell><StatusBadge type="payment" value={p.payment_status} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={p.amount} currency={p.currency_code} /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={p.paid_at} showTime /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Payment Detail</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Method:</span> <span className="capitalize">{detail.payment_method?.replace(/_/g, ' ')}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge type="payment" value={detail.payment_status} /></div>
                <div><span className="text-muted-foreground">Provider:</span> {detail.payment_provider || '—'}</div>
                <div><span className="text-muted-foreground">Transaction ID:</span> <span className="font-mono text-xs">{detail.provider_transaction_id || '—'}</span></div>
                <div><span className="text-muted-foreground">Amount:</span> <CurrencyDisplay amount={detail.amount} currency={detail.currency_code} /></div>
                <div><span className="text-muted-foreground">Paid:</span> <DateDisplay date={detail.paid_at} showTime /></div>
              </div>
              {allocations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Allocations</h4>
                    <Table>
                      <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Reference</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {allocations.map(a => (
                          <TableRow key={a.id}>
                            <TableCell className="capitalize text-sm">{a.allocation_type?.replace(/_/g, ' ')}</TableCell>
                            <TableCell className="font-mono text-xs">{a.invoice_id?.slice(0, 8) || a.order_id?.slice(0, 8) || '—'}</TableCell>
                            <TableCell className="text-right"><CurrencyDisplay amount={a.amount} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
