import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PackageCheck } from 'lucide-react';

export default function GoodsReceiptList() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      supabase.from('goods_receipts').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('suppliers').select('id, supplier_name'),
    ]).then(([{ data: grs }, { data: sups }]) => {
      setReceipts(grs || []);
      setSupplierMap(Object.fromEntries((sups || []).map(s => [s.id, s.supplier_name])));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() =>
    receipts.filter(r => {
      if (search && !(r.receipt_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    }), [receipts, search, statusFilter]);

  async function openDetail(gr: any) {
    setDetail(gr);
    const { data } = await supabase.from('goods_receipt_items').select('*').eq('goods_receipt_id', gr.id);
    setItems(data || []);
  }

  return (
    <PageShell title="Goods Receipts" subtitle="Receiving and quality control" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search receipts..."
      filters={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={PackageCheck} title="No goods receipts" description="Goods receipts will appear when inventory is received." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Receipt #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>PO</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6">Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(r)}>
                  <TableCell className="pl-6 font-medium">{r.receipt_number}</TableCell>
                  <TableCell className="text-sm">{supplierMap[r.supplier_id] || '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{r.purchase_order_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={r.status} /></TableCell>
                  <TableCell className="pr-6"><DateDisplay date={r.receipt_date} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Receipt {detail?.receipt_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge type="document" value={detail.status} /></div>
                <div><p className="text-xs text-muted-foreground">Supplier</p><span>{supplierMap[detail.supplier_id] || '—'}</span></div>
                <div><p className="text-xs text-muted-foreground">Receipt Date</p><DateDisplay date={detail.receipt_date} /></div>
                <div><p className="text-xs text-muted-foreground">Depot</p><span className="font-mono text-xs">{detail.depot_id?.slice(0, 8) || '—'}</span></div>
              </div>
              {detail.notes && <p className="text-sm text-muted-foreground border rounded-lg p-3">{detail.notes}</p>}
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Received Items</h4>
                <Table>
                  <TableHeader><TableRow><TableHead>Batch</TableHead><TableHead className="text-right">Received</TableHead><TableHead className="text-right">Accepted</TableHead><TableHead className="text-right">Rejected</TableHead><TableHead className="text-right">Cost</TableHead><TableHead>Expiry</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {items.map(it => (
                      <TableRow key={it.id}>
                        <TableCell className="font-mono text-xs">{it.batch_number || '—'}</TableCell>
                        <TableCell className="text-right">{it.quantity_received} {it.quantity_uom}</TableCell>
                        <TableCell className="text-right font-medium">{it.accepted_quantity}</TableCell>
                        <TableCell className="text-right text-destructive">{it.rejected_quantity || 0}</TableCell>
                        <TableCell className="text-right"><CurrencyDisplay amount={it.unit_cost} /></TableCell>
                        <TableCell><DateDisplay date={it.expiry_date} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
