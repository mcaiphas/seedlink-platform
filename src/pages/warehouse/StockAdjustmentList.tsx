import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDocNumber } from '@/lib/document-numbers';
import { DataPageShell, EmptyState } from '@/components/DataPageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, ClipboardList, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' }, posted: { label: 'Posted', variant: 'default' }, cancelled: { label: 'Cancelled', variant: 'destructive' },
};
interface SALine { variant_id: string | null; quantity_adjustment: number; unit_cost: number; notes: string; variant_label?: string; }

export default function StockAdjustmentList() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [depots, setDepots] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [depotId, setDepotId] = useState('');
  const [reason, setReason] = useState('');
  const [saLines, setSaLines] = useState<SALine[]>([{ variant_id: null, quantity_adjustment: 0, unit_cost: 0, notes: '' }]);

  const load = async () => { setLoading(true); const { data: d } = await supabase.from('stock_adjustments').select('*, depots(name)').order('created_at', { ascending: false }); setData(d || []); setLoading(false); };
  useEffect(() => {
    load();
    supabase.from('depots').select('id, name').eq('is_active', true).order('name').then(r => setDepots(r.data || []));
    supabase.from('product_variants').select('id, variant_name, sku').eq('is_active', true).order('variant_name').then(r => setVariants(r.data || []));
  }, []);

  const handleCreate = async () => {
    if (!depotId) { toast({ title: 'Select a depot', variant: 'destructive' }); return; }
    const validLines = saLines.filter(l => l.variant_id && l.quantity_adjustment !== 0);
    if (!validLines.length) { toast({ title: 'Add at least one adjustment line', variant: 'destructive' }); return; }
    setSaving(true);
    const saNumber = await generateDocNumber('sa');
    const { data: sa, error } = await supabase.from('stock_adjustments').insert({ adjustment_number: saNumber, depot_id: depotId, reason: reason || null, status: 'draft', created_by: user?.id || null }).select('id').single();
    if (error || !sa) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setSaving(false); return; }
    await supabase.from('stock_adjustment_items').insert(validLines.map(l => ({ stock_adjustment_id: sa.id, variant_id: l.variant_id, quantity_adjustment: l.quantity_adjustment, unit_cost: l.unit_cost || null, notes: l.notes || null })));
    toast({ title: `Stock adjustment ${saNumber} created` }); setSaving(false); setDialogOpen(false); load();
  };

  const filtered = useMemo(() => data.filter(r => !search || r.adjustment_number?.toLowerCase().includes(search.toLowerCase()) || r.reason?.toLowerCase().includes(search.toLowerCase())), [data, search]);

  return (
    <div className="space-y-6">
      <DataPageShell title="Stock Adjustments" description="Adjust inventory quantities with audit trail"
        action={<Button onClick={() => { setDialogOpen(true); setDepotId(''); setReason(''); setSaLines([{ variant_id: null, quantity_adjustment: 0, unit_cost: 0, notes: '' }]); }} className="gap-2"><Plus className="h-4 w-4" />New Adjustment</Button>}>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search adjustments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Adjustment #</TableHead><TableHead className="font-semibold">Depot</TableHead><TableHead className="font-semibold">Reason</TableHead><TableHead className="font-semibold">Date</TableHead><TableHead className="font-semibold">Status</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(r => { const st = STATUS_MAP[r.status] || { label: r.status, variant: 'outline' as const }; return (
              <TableRow key={r.id} className="hover:bg-muted/20"><TableCell><div className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{r.adjustment_number}</span></div></TableCell><TableCell>{r.depots?.name || '—'}</TableCell><TableCell className="text-sm text-muted-foreground">{r.reason || '—'}</TableCell><TableCell className="text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell><TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell></TableRow>); })}
              {filtered.length === 0 && !loading && <EmptyState message="No stock adjustments found" colSpan={5} />}</TableBody></Table>
        </div>
      </DataPageShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Stock Adjustment</DialogTitle><DialogDescription>Adjust inventory quantities. Positive values increase stock, negative decrease.</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Depot <span className="text-destructive">*</span></Label><Select value={depotId} onValueChange={setDepotId}><SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger><SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Reason</Label><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Stocktake variance" /></div>
            </div>
            <Separator />
            <div className="flex items-center justify-between"><p className="text-sm font-semibold">Adjustment Lines</p><Button size="sm" variant="outline" onClick={() => setSaLines(prev => [...prev, { variant_id: null, quantity_adjustment: 0, unit_cost: 0, notes: '' }])} className="gap-2"><Plus className="h-3.5 w-3.5" />Add Line</Button></div>
            <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="w-[220px] font-semibold">Variant</TableHead><TableHead className="w-[100px] font-semibold">Qty (+/-)</TableHead><TableHead className="w-[100px] font-semibold">Unit Cost</TableHead><TableHead className="font-semibold">Notes</TableHead><TableHead className="w-8" /></TableRow></TableHeader>
              <TableBody>{saLines.map((line, idx) => (<TableRow key={idx}>
                <TableCell><Select value={line.variant_id || ''} onValueChange={v => setSaLines(prev => prev.map((l, i) => i === idx ? { ...l, variant_id: v } : l))}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{variants.map(v => <SelectItem key={v.id} value={v.id}>{v.sku} — {v.variant_name}</SelectItem>)}</SelectContent></Select></TableCell>
                <TableCell><Input type="number" value={line.quantity_adjustment} onChange={e => setSaLines(prev => prev.map((l, i) => i === idx ? { ...l, quantity_adjustment: Number(e.target.value) } : l))} className="h-8 text-sm" /></TableCell>
                <TableCell><Input type="number" step={0.01} value={line.unit_cost} onChange={e => setSaLines(prev => prev.map((l, i) => i === idx ? { ...l, unit_cost: Number(e.target.value) } : l))} className="h-8 text-sm font-mono" /></TableCell>
                <TableCell><Input value={line.notes} onChange={e => setSaLines(prev => prev.map((l, i) => i === idx ? { ...l, notes: e.target.value } : l))} className="h-8 text-sm" /></TableCell>
                <TableCell>{saLines.length > 1 && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setSaLines(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button>}</TableCell>
              </TableRow>))}</TableBody></Table></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Adjustment'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
