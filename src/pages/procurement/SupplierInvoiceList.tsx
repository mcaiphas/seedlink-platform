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
import { Receipt } from 'lucide-react';

export default function SupplierInvoiceList() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      supabase.from('supplier_invoices').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('suppliers').select('id, supplier_name'),
    ]).then(([{ data: sis }, { data: sups }]) => {
      setInvoices(sis || []);
      setSupplierMap(Object.fromEntries((sups || []).map(s => [s.id, s.supplier_name])));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    invoices.filter(inv => {
      if (search && !(inv.supplier_invoice_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      return true;
    }), [invoices, search, statusFilter]);

  async function openDetail(inv: any) {
    setDetail(inv);
    const { data } = await supabase.from('supplier_invoice_items').select('*').eq('supplier_invoice_id', inv.id);
    setItems(data || []);
  }

  return (
    <PageShell title="Supplier Invoices" subtitle="Invoice matching and accounts payable" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No supplier invoices" description="Supplier invoices will appear here." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Invoice #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right pr-6">Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(inv)}>
                  <TableCell className="pl-6 font-medium">{inv.supplier_invoice_number || inv.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-sm">{supplierMap[inv.supplier_id] || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                  <TableCell><DateDisplay date={inv.invoice_date} /></TableCell>
                  <TableCell><DateDisplay date={inv.due_date} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={inv.total_amount} currency={inv.currency_code} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Supplier Invoice {detail?.supplier_invoice_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Supplier</p><span>{supplierMap[detail.supplier_id] || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Date</p><DateDisplay date={detail.invoice_date} /></div>
                <div><p className="text-xs text-muted-foreground">Due</p><DateDisplay date={detail.due_date} /></div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                <Table>
                  <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Tax</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {items.map(it => (
                      <TableRow key={it.id}>
                        <TableCell className="font-mono text-xs">{it.product_id?.slice(0, 8) || '—'}</TableCell>
                        <TableCell className="text-right">{it.quantity}</TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={it.unit_price} /></TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={it.tax_amount} /></TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={it.line_total} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <div className="space-y-1 text-right text-sm">
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amount={detail.subtotal_amount} currency={detail.currency_code} /></div>
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Tax</span><CurrencyDisplay amount={detail.tax_amount} currency={detail.currency_code} /></div>
                  <Separator className="my-1" />
                  <div className="flex justify-between gap-8 font-semibold"><span>Total</span><CurrencyDisplay amount={detail.total_amount} currency={detail.currency_code} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
