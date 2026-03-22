import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt } from 'lucide-react';

export default function PortalInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    supabase.from('customers').select('id').eq('contact_email', user.email).limit(1).single().then(async ({ data: cust }) => {
      if (cust) {
        const { data } = await supabase.from('customer_invoices').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }).limit(200);
        setInvoices(data || []);
      }
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() =>
    invoices.filter(inv => {
      if (search && !(inv.invoice_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      return true;
    }), [invoices, search, statusFilter]);

  async function openDetail(inv: any) {
    setDetail(inv);
    const { data } = await supabase.from('customer_invoice_items').select('*').eq('customer_invoice_id', inv.id);
    setItems(data || []);
  }

  return (
    <PageShell title="My Invoices" subtitle="View and track your invoices" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices" description="You don't have any invoices yet." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right pr-6">Outstanding</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(inv)}>
                  <TableCell className="pl-6 font-medium">{inv.invoice_number}</TableCell>
                  <TableCell><DateDisplay date={inv.invoice_date} /></TableCell>
                  <TableCell><DateDisplay date={inv.due_date} /></TableCell>
                  <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={inv.total_amount} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={Number(inv.total_amount) - Number(inv.paid_amount || 0)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Invoice {detail?.invoice_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.invoice_date} /></div>
                <div><p className="text-xs text-muted-foreground">Due</p><DateDisplay date={detail.due_date} /></div>
                <div><p className="text-xs text-muted-foreground">Payment Terms</p><span className="text-sm capitalize">{(detail.payment_terms || '').replace(/_/g, ' ')}</span></div>
              </div>
              <Separator />
              <Table>
                <TableHeader><TableRow><TableHead>Description</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {items.map(it => (
                    <TableRow key={it.id}>
                      <TableCell>{it.description || '—'}</TableCell>
                      <TableCell className="text-right">{it.quantity}</TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={it.unit_price} /></TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={it.line_total} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <div className="space-y-1 text-right text-sm w-64">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detail.subtotal_amount} /></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detail.tax_amount} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold"><span>Total</span><CurrencyDisplay amount={detail.total_amount} /></div>
                  <div className="flex justify-between text-emerald-600"><span>Paid</span><CurrencyDisplay amount={detail.paid_amount} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
