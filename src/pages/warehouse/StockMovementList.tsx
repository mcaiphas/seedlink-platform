import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight } from 'lucide-react';

export default function StockMovementList() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    supabase.from('stock_movements').select('*').order('created_at', { ascending: false }).limit(300)
      .then(({ data }) => { setMovements(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    movements.filter(m => {
      if (search && !(m.reference_type || '').toLowerCase().includes(search.toLowerCase()) && !m.id.includes(search)) return false;
      if (typeFilter !== 'all' && m.movement_type !== typeFilter) return false;
      return true;
    }), [movements, search, typeFilter]);

  return (
    <PageShell title="Stock Movements" subtitle="Track all inventory movements" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search movements..."
      filters={
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase_receipt">Purchase Receipt</SelectItem>
            <SelectItem value="sales_issue">Sales Issue</SelectItem>
            <SelectItem value="adjustment_in">Adjustment In</SelectItem>
            <SelectItem value="adjustment_out">Adjustment Out</SelectItem>
            <SelectItem value="transfer_in">Transfer In</SelectItem>
            <SelectItem value="transfer_out">Transfer Out</SelectItem>
            <SelectItem value="return_from_customer">Customer Return</SelectItem>
            <SelectItem value="return_to_supplier">Supplier Return</SelectItem>
            <SelectItem value="opening_balance">Opening Balance</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No stock movements" description="Stock movements will be recorded as inventory changes." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Type</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Depot</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="pr-6">Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="pl-6"><StatusBadge type="movement" value={m.movement_type} /></TableCell>
                  <TableCell className="font-mono text-xs">{m.variant_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{m.depot_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{m.quantity}</TableCell>
                  <TableCell className="text-sm">{m.quantity_uom || '—'}</TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={m.unit_cost} /></TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{m.reference_type?.replace(/_/g, ' ') || '—'}</Badge>
                  </TableCell>
                  <TableCell className="pr-6"><DateDisplay date={m.created_at} showTime /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
