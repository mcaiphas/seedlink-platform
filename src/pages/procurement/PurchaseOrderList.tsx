import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Filter, Eye, FileText, PackageCheck, Receipt, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Submitted', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  received: { label: 'Received', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  closed: { label: 'Closed', variant: 'secondary' },
};

export default function PurchaseOrderList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [poLines, setPoLines] = useState<any[]>([]);
  const [linkedGRs, setLinkedGRs] = useState<any[]>([]);
  const [linkedSIs, setLinkedSIs] = useState<any[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const { data: d } = await supabase.from('purchase_orders').select('*, suppliers(supplier_name, supplier_code), depots(name)').order('created_at', { ascending: false });
    setData(d || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openDetail = async (po: any) => {
    setSelectedPO(po);
    setDetailOpen(true);
    const [linesRes, grRes, siRes] = await Promise.all([
      supabase.from('purchase_order_items').select('*, product_variants(variant_name, sku)').eq('purchase_order_id', po.id),
      supabase.from('goods_receipts').select('id, receipt_number, receipt_date, status').eq('purchase_order_id', po.id).order('created_at', { ascending: false }),
      supabase.from('supplier_invoices').select('id, supplier_invoice_number, invoice_date, total_amount, status').eq('purchase_order_id', po.id).order('created_at', { ascending: false }),
    ]);
    setPoLines(linesRes.data || []);
    setLinkedGRs(grRes.data || []);
    setLinkedSIs(siRes.data || []);
  };

  const filtered = useMemo(() => data.filter(r => {
    const matchSearch = !search || r.po_number?.toLowerCase().includes(search.toLowerCase()) || r.suppliers?.supplier_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  }), [data, search, statusFilter]);

  const stats = useMemo(() => ({
    total: data.length,
    draft: data.filter(r => r.status === 'draft').length,
    open: data.filter(r => ['submitted', 'approved'].includes(r.status)).length,
    totalValue: data.reduce((s, r) => s + Number(r.total_amount || 0), 0),
  }), [data]);

  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);

  return (
    <div className="space-y-6">
      <DataPageShell
        title="Purchase Orders"
        description="Manage procurement orders to suppliers"
        action={<Button onClick={() => navigate('/purchase-orders/new')} className="gap-2"><Plus className="h-4 w-4" />New Purchase Order</Button>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total POs', value: stats.total, sub: 'All time' },
            { label: 'Draft', value: stats.draft, sub: 'Awaiting submission' },
            { label: 'Open', value: stats.open, sub: 'Submitted / Approved' },
            { label: 'Total Value', value: fmt(stats.totalValue), sub: 'Across all POs' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search PO number or supplier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">PO Number</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Depot</TableHead>
                <TableHead className="font-semibold">Order Date</TableHead>
                <TableHead className="font-semibold">Expected</TableHead>
                <TableHead className="font-semibold text-right">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const st = STATUS_MAP[r.status] || { label: r.status, variant: 'outline' as const };
                return (
                  <TableRow key={r.id} className="group hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-mono font-medium text-sm">{r.po_number}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{r.suppliers?.supplier_name || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.depots?.name || '—'}</TableCell>
                    <TableCell className="text-sm">{r.order_date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.expected_date || '—'}</TableCell>
                    <TableCell className="text-right font-mono font-medium">{fmt(Number(r.total_amount || 0))}</TableCell>
                    <TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(r)} title="View details"><Eye className="h-3.5 w-3.5" /></Button>
                        {r.status === 'draft' && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/purchase-orders/${r.id}/edit`)} title="Edit"><ExternalLink className="h-3.5 w-3.5" /></Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && !loading && <EmptyState message="No purchase orders found" colSpan={8} />}
            </TableBody>
          </Table>
        </div>
      </DataPageShell>

      {/* PO Detail Drawer */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              Purchase Order — {selectedPO?.po_number}
            </DialogTitle>
            <DialogDescription>Full document view with linked goods receipts and supplier invoices.</DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-5 py-2">
              {/* Header info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Supplier', value: selectedPO.suppliers?.supplier_name || '—' },
                  { label: 'Depot', value: selectedPO.depots?.name || 'Not set' },
                  { label: 'Order Date', value: selectedPO.order_date },
                  { label: 'Status', value: null, badge: selectedPO.status },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    {f.badge ? <Badge variant={(STATUS_MAP[f.badge]?.variant || 'outline') as any} className="text-xs mt-1">{STATUS_MAP[f.badge]?.label || f.badge}</Badge> : <p className="font-medium text-sm mt-0.5">{f.value}</p>}
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="font-mono text-sm">{fmt(Number(selectedPO.subtotal_amount || 0))}</p>
                </div>
                <div className="space-y-0.5 text-center">
                  <p className="text-xs text-muted-foreground">Tax</p>
                  <p className="font-mono text-sm">{fmt(Number(selectedPO.tax_amount || 0))}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-xs text-muted-foreground font-semibold">Total</p>
                  <p className="font-mono text-lg font-bold">{fmt(Number(selectedPO.total_amount || 0))}</p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <p className="text-sm font-semibold mb-2">Line Items ({poLines.length})</p>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold w-[80px] text-right">Qty</TableHead>
                        <TableHead className="font-semibold w-[60px]">UOM</TableHead>
                        <TableHead className="font-semibold w-[100px] text-right">Unit Price</TableHead>
                        <TableHead className="font-semibold w-[110px] text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poLines.map(l => (
                        <TableRow key={l.id}>
                          <TableCell>
                            <p className="text-sm font-medium">{l.product_description}</p>
                            {l.product_variants?.sku && <p className="text-xs font-mono text-muted-foreground">{l.product_variants.sku}</p>}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">{Number(l.quantity)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{l.quantity_uom}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{fmt(Number(l.unit_price))}</TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">{fmt(Number(l.line_total))}</TableCell>
                        </TableRow>
                      ))}
                      {poLines.length === 0 && <tr><td colSpan={5} className="text-center text-sm text-muted-foreground py-6">No line items</td></tr>}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Linked Documents */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Goods Receipts */}
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2"><PackageCheck className="h-4 w-4 text-primary" />Goods Receipts ({linkedGRs.length})</p>
                  {linkedGRs.length > 0 ? (
                    <div className="space-y-2">
                      {linkedGRs.map(gr => (
                        <div key={gr.id} className="rounded-lg border bg-card p-3 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm font-medium">{gr.receipt_number}</p>
                            <p className="text-xs text-muted-foreground">{gr.receipt_date}</p>
                          </div>
                          <Badge variant={gr.status === 'received' ? 'default' : 'secondary'} className="text-xs">{gr.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No goods receipts yet</div>
                  )}
                </div>

                {/* Supplier Invoices */}
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" />Supplier Invoices ({linkedSIs.length})</p>
                  {linkedSIs.length > 0 ? (
                    <div className="space-y-2">
                      {linkedSIs.map(si => (
                        <div key={si.id} className="rounded-lg border bg-card p-3 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm font-medium">{si.supplier_invoice_number}</p>
                            <p className="text-xs text-muted-foreground">{si.invoice_date} · {fmt(Number(si.total_amount || 0))}</p>
                          </div>
                          <Badge variant={si.status === 'paid' ? 'default' : 'secondary'} className="text-xs">{si.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No invoices matched</div>
                  )}
                </div>
              </div>

              {/* Workflow indicator */}
              <div className="rounded-lg border bg-muted/10 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Procurement Workflow</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={selectedPO.status !== 'draft' ? 'default' : 'secondary'} className="text-xs">PO Created</Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant={linkedGRs.length > 0 ? 'default' : 'outline'} className="text-xs">Goods Received</Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant={linkedSIs.length > 0 ? 'default' : 'outline'} className="text-xs">Invoice Matched</Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant={linkedSIs.some(s => s.status === 'paid') ? 'default' : 'outline'} className="text-xs">Paid</Badge>
                </div>
              </div>

              {selectedPO.notes && (
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedPO.notes}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                {selectedPO.status === 'draft' && <Button variant="outline" onClick={() => { setDetailOpen(false); navigate(`/purchase-orders/${selectedPO.id}/edit`); }}>Edit PO</Button>}
                <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
