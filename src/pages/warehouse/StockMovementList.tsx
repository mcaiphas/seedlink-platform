import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StockMovementList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => { (async () => { setLoading(true); const { data: d } = await supabase.from('stock_movements').select('*, product_variants(variant_name, sku), depots(name)').order('created_at', { ascending: false }).limit(500); setData(d || []); setLoading(false); })(); }, []);

  const filtered = useMemo(() => data.filter(r => { const ms = !search || r.product_variants?.sku?.toLowerCase().includes(search.toLowerCase()) || r.product_variants?.variant_name?.toLowerCase().includes(search.toLowerCase()) || r.reference_type?.toLowerCase().includes(search.toLowerCase()); const mt = typeFilter === 'all' || r.movement_type === typeFilter; return ms && mt; }), [data, search, typeFilter]);
  const isPositive = (type: string) => ['receipt', 'adjustment_in', 'return', 'transfer_in'].includes(type);

  return (
    <div className="space-y-6">
      <DataPageShell title="Stock Movements" description="Track all inventory movements across depots">
        <div className="grid grid-cols-3 gap-4">
          {[{ label: 'Total Movements', value: data.length }, { label: 'Receipts', value: data.filter(r => r.movement_type === 'receipt').length }, { label: 'Issues', value: data.filter(r => ['issue', 'sale'].includes(r.movement_type)).length }].map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by SKU, variant, or reference..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-[160px]"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="receipt">Receipt</SelectItem><SelectItem value="issue">Issue</SelectItem><SelectItem value="sale">Sale</SelectItem><SelectItem value="adjustment_in">Adjustment In</SelectItem><SelectItem value="adjustment_out">Adjustment Out</SelectItem><SelectItem value="transfer_in">Transfer In</SelectItem><SelectItem value="transfer_out">Transfer Out</SelectItem></SelectContent></Select>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Variant</TableHead><TableHead className="font-semibold">Type</TableHead><TableHead className="font-semibold text-right">Qty</TableHead><TableHead className="font-semibold">UOM</TableHead><TableHead className="font-semibold">Depot</TableHead><TableHead className="font-semibold">Reference</TableHead><TableHead className="font-semibold">Date</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(r => (
              <TableRow key={r.id} className="hover:bg-muted/20">
                <TableCell><div><p className="font-medium text-sm">{r.product_variants?.variant_name || '—'}</p><p className="text-xs text-muted-foreground font-mono">{r.product_variants?.sku}</p></div></TableCell>
                <TableCell><Badge variant={isPositive(r.movement_type) ? 'default' : 'secondary'} className="text-xs gap-1">{isPositive(r.movement_type) ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{r.movement_type}</Badge></TableCell>
                <TableCell className={`text-right font-mono font-medium ${isPositive(r.movement_type) ? 'text-primary' : 'text-destructive'}`}>{isPositive(r.movement_type) ? '+' : '-'}{Number(r.quantity)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.quantity_uom}</TableCell>
                <TableCell className="text-sm">{r.depots?.name || '—'}</TableCell>
                <TableCell><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{r.reference_type || '—'}</span></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}{filtered.length === 0 && !loading && <EmptyState message="No stock movements found" colSpan={7} />}</TableBody></Table>
        </div>
      </DataPageShell>
    </div>
  );
}
