import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOVEMENT_TYPES = ['receipt', 'issue', 'sale', 'adjustment_in', 'adjustment_out', 'transfer_in', 'transfer_out', 'return'];

export default function StockMovementList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMov, setSelectedMov] = useState<any>(null);

  useEffect(() => { (async () => { setLoading(true); const { data: d } = await supabase.from('stock_movements').select('*, product_variants(variant_name, sku, products(name)), depots(name)').order('created_at', { ascending: false }).limit(500); setData(d || []); setLoading(false); })(); }, []);

  const filtered = useMemo(() => data.filter(r => { const ms = !search || r.product_variants?.sku?.toLowerCase().includes(search.toLowerCase()) || r.product_variants?.variant_name?.toLowerCase().includes(search.toLowerCase()) || r.reference_type?.toLowerCase().includes(search.toLowerCase()) || r.notes?.toLowerCase().includes(search.toLowerCase()); const mt = typeFilter === 'all' || r.movement_type === typeFilter; return ms && mt; }), [data, search, typeFilter]);
  const isPositive = (type: string) => ['receipt', 'adjustment_in', 'return', 'transfer_in'].includes(type);

  const stats = useMemo(() => ({
    total: data.length,
    receipts: data.filter(r => r.movement_type === 'receipt').length,
    issues: data.filter(r => ['issue', 'sale'].includes(r.movement_type)).length,
    adjustments: data.filter(r => r.movement_type?.startsWith('adjustment')).length,
  }), [data]);

  const getSourceLink = (refType: string | null) => {
    if (!refType) return null;
    const map: Record<string, string> = { goods_receipt: '/goods-receipts', customer_invoice: '/customer-invoices', stock_adjustment: '/stock-adjustments' };
    return map[refType] || null;
  };

  return (
    <div className="space-y-6">
      <DataPageShell title="Stock Movements" description="Track all inventory movements across depots">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Movements', value: stats.total },
            { label: 'Receipts (In)', value: stats.receipts, color: 'text-primary' },
            { label: 'Issues (Out)', value: stats.issues, color: 'text-destructive' },
            { label: 'Adjustments', value: stats.adjustments },
          ].map(s => (
            <Card key={s.label}><CardContent className="pt-5 pb-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className={`text-2xl font-bold mt-1 ${(s as any).color || ''}`}>{s.value}</p></CardContent></Card>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by SKU, variant, or reference..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-[160px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{MOVEMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30">
            <TableHead className="font-semibold">Variant</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold text-right">Qty</TableHead>
            <TableHead className="font-semibold">UOM</TableHead>
            <TableHead className="font-semibold">Depot</TableHead>
            <TableHead className="font-semibold">Source</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="w-10" />
          </TableRow></TableHeader>
            <TableBody>{filtered.map(r => {
              const pos = isPositive(r.movement_type);
              const sourceLink = getSourceLink(r.reference_type);
              return (
              <TableRow key={r.id} className="group hover:bg-muted/20">
                <TableCell><div><p className="font-medium text-sm">{r.product_variants?.variant_name || '—'}</p><p className="text-xs text-muted-foreground font-mono">{r.product_variants?.sku}</p></div></TableCell>
                <TableCell><Badge variant={pos ? 'default' : 'secondary'} className="text-xs gap-1">{pos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{r.movement_type?.replace('_', ' ')}</Badge></TableCell>
                <TableCell className={`text-right font-mono font-medium ${pos ? 'text-primary' : 'text-destructive'}`}>{pos ? '+' : '-'}{Number(r.quantity)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.quantity_uom}</TableCell>
                <TableCell className="text-sm">{r.depots?.name || '—'}</TableCell>
                <TableCell>
                  {r.reference_type ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{r.reference_type.replace('_', ' ')}</span>
                      {sourceLink && <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => navigate(sourceLink)}><ExternalLink className="h-3 w-3" /></Button>}
                    </div>
                  ) : <span className="text-sm text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedMov(r); setDetailOpen(true); }}><Eye className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>);
            })}{filtered.length === 0 && !loading && <EmptyState message="No stock movements found" colSpan={8} />}</TableBody></Table>
        </div>
      </DataPageShell>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Stock Movement Detail</DialogTitle><DialogDescription>Full movement record with source document reference.</DialogDescription></DialogHeader>
          {selectedMov && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Variant', value: selectedMov.product_variants?.variant_name || '—' },
                  { label: 'SKU', value: selectedMov.product_variants?.sku || '—' },
                  { label: 'Depot', value: selectedMov.depots?.name || '—' },
                  { label: 'Movement Type', value: selectedMov.movement_type?.replace('_', ' ') },
                  { label: 'Quantity', value: `${isPositive(selectedMov.movement_type) ? '+' : '-'}${Number(selectedMov.quantity)} ${selectedMov.quantity_uom}` },
                  { label: 'Unit Cost', value: selectedMov.unit_cost ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(Number(selectedMov.unit_cost)) : '—' },
                  { label: 'Reference Type', value: selectedMov.reference_type?.replace('_', ' ') || '—' },
                  { label: 'Created', value: new Date(selectedMov.created_at).toLocaleString() },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className={`font-medium text-sm mt-0.5 ${f.label === 'Quantity' ? (isPositive(selectedMov.movement_type) ? 'text-primary font-mono' : 'text-destructive font-mono') : ''}`}>{f.value}</p>
                  </div>
                ))}
              </div>
              {selectedMov.notes && <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm">{selectedMov.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
