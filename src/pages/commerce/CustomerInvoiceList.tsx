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
import { FileText } from 'lucide-react';

export default function CustomerInvoiceList() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('customer_invoices').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setInvoices(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    invoices.filter(inv => {
      if (search && !(inv.invoice_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      return true;
    }), [invoices, search, statusFilter]);

  async function openDetail(inv: any) {
    setDetail(inv);
    const [{ data: lineItems }, { data: logs }] = await Promise.all([
      supabase.from('customer_invoice_items').select('*').eq('customer_invoice_id', inv.id),
      supabase.from('document_delivery_logs').select('*').eq('document_id', inv.id).eq('document_type', 'customer_invoice'),
    ]);
    setItems(lineItems || []);
    setDeliveryLogs(logs || []);
  }

  return (
    <PageShell title="Customer Invoices" subtitle="Invoice management and delivery tracking" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices found" description="Customer invoices will appear here." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Invoice #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="pr-6">Type</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(inv)}>
                  <TableCell className="pl-6 font-medium">{inv.invoice_number}</TableCell>
                  <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                  <TableCell><DateDisplay date={inv.invoice_date} /></TableCell>
                  <TableCell><DateDisplay date={inv.due_date} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={inv.total_amount} currency={inv.currency_code} /></TableCell>
                  <TableCell className="pr-6">
                    {inv.notes?.includes('Auto-generated') ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Auto</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Manual</Badge>
                    )}
                  </TableCell>
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
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.invoice_date} /></div>
                <div><p className="text-xs text-muted-foreground">Due</p><DateDisplay date={detail.due_date} /></div>
                <div><p className="text-xs text-muted-foreground">Order</p><span className="font-mono text-xs">{detail.order_id?.slice(0, 8) || '—'}</span></div>
              </div>

              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                {items.length === 0 ? <p className="text-sm text-muted-foreground">No items</p> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Description</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {items.map(it => (
                        <TableRow key={it.id}>
                          <TableCell>{it.description || '—'}</TableCell>
                          <TableCell className="text-right">{it.quantity} {it.quantity_uom}</TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={it.unit_price} /></TableCell>
                          <TableCell className="text-right"><CurrencyDisplay amount={it.line_total} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="flex justify-end">
                <div className="space-y-1 text-right text-sm">
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detail.subtotal_amount} currency={detail.currency_code} /></div>
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detail.tax_amount} currency={detail.currency_code} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between gap-8 font-semibold"><span>Total</span><CurrencyDisplay amount={detail.total_amount} currency={detail.currency_code} /></div>
                </div>
              </div>

              {deliveryLogs.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Delivery Log</h4>
                    {deliveryLogs.map(log => (
                      <div key={log.id} className="rounded-lg border p-3 text-sm mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize text-xs">{log.delivery_channel}</Badge>
                            <StatusBadge type="delivery" value={log.delivery_status} />
                          </div>
                          <DateDisplay date={log.sent_at || log.created_at} showTime />
                        </div>
                        <p className="text-muted-foreground mt-1">{log.recipient_email || log.recipient_phone || '—'}</p>
                        {log.error_message && <p className="text-destructive text-xs mt-1">{log.error_message}</p>}
                      </div>
                    ))}
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
