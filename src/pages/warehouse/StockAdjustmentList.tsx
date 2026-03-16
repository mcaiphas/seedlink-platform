import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ClipboardList } from 'lucide-react';

export default function StockAdjustmentList() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('stock_adjustments').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => { setAdjustments(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    adjustments.filter(a => {
      if (search && !(a.adjustment_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    }), [adjustments, search, statusFilter]);

  async function openDetail(adj: any) {
    setDetail(adj);
    const { data } = await supabase.from('stock_adjustment_items').select('*').eq('stock_adjustment_id', adj.id);
    setItems(data || []);
  }

  return (
    <PageShell title="Stock Adjustments" subtitle="Inventory corrections and adjustments" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search adjustments..."
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
        <EmptyState icon={ClipboardList} title="No adjustments" description="Stock adjustments will appear here." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Adjustment #</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Depot</TableHead>
              <TableHead className="pr-6">Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(a)}>
                  <TableCell className="pl-6 font-medium">{a.adjustment_number}</TableCell>
                  <TableCell className="text-sm">{a.reason || '—'}</TableCell>
                  <TableCell><StatusBadge type="document" value={a.status} /></TableCell>
                  <TableCell className="font-mono text-xs">{a.depot_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell className="pr-6"><DateDisplay date={a.adjustment_date || a.created_at} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Adjustment {detail?.adjustment_number}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge type="document" value={detail.status} /></div>
                <div><span className="text-muted-foreground">Reason:</span> {detail.reason || '—'}</div>
              </div>
              <Separator />
              <Table>
                <TableHeader><TableRow><TableHead>Variant</TableHead><TableHead className="text-right">Qty</TableHead><TableHead>Direction</TableHead><TableHead className="text-right">Cost</TableHead></TableRow></TableHeader>
                <TableBody>
                  {items.map(it => (
                    <TableRow key={it.id}>
                      <TableCell className="font-mono text-xs">{it.variant_id?.slice(0, 8) || '—'}</TableCell>
                      <TableCell className="text-right font-medium">{it.quantity} {it.quantity_uom}</TableCell>
                      <TableCell><StatusBadge type="movement" value={it.adjustment_type === 'increase' ? 'adjustment_in' : 'adjustment_out'} /></TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={it.unit_cost} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
