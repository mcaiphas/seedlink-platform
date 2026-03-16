import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generateDocNumber } from '@/lib/document-numbers';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2, FileSpreadsheet, DollarSign } from 'lucide-react';

interface POLine { id?: string; product_description: string; quantity: string; quantity_uom: string; unit_price: string; variant_id: string; }
const emptyLine: POLine = { product_description: '', quantity: '1', quantity_uom: 'unit', unit_price: '0', variant_id: '' };

export default function PurchaseOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [poNumber, setPoNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [depotId, setDepotId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [status, setStatus] = useState('draft');
  const [currencyCode, setCurrencyCode] = useState('ZAR');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<POLine[]>([{ ...emptyLine }]);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('suppliers').select('id, supplier_name').eq('is_active', true).order('supplier_name'),
      supabase.from('depots').select('id, name').order('name'),
      supabase.from('product_variants').select('id, variant_name, sku, product_id, products(name)').eq('is_active', true).order('variant_name').limit(500),
    ]).then(([sR, dR, vR]) => {
      setSuppliers(sR.data || []);
      setDepots(dR.data || []);
      setVariants(vR.data || []);
    });
  }, []);

  useEffect(() => {
    if (!id) {
      generateDocNumber('po').then(setPoNumber);
      return;
    }
    setLoading(true);
    Promise.all([
      supabase.from('purchase_orders').select('*').eq('id', id).single(),
      supabase.from('purchase_order_items').select('*').eq('purchase_order_id', id).order('created_at'),
    ]).then(([poR, liR]) => {
      if (poR.data) {
        const p = poR.data as any;
        setPoNumber(p.po_number); setSupplierId(p.supplier_id); setDepotId(p.depot_id || '');
        setExpectedDate(p.expected_date || ''); setStatus(p.status); setCurrencyCode(p.currency_code); setNotes(p.notes || '');
      }
      if (liR.data && liR.data.length > 0) {
        setLines(liR.data.map((l: any) => ({
          id: l.id, product_description: l.product_description, quantity: String(l.quantity),
          quantity_uom: l.quantity_uom, unit_price: String(l.unit_price), variant_id: l.variant_id || '',
        })));
      }
      setLoading(false);
    });
  }, [id]);

  const addLine = () => setLines(l => [...l, { ...emptyLine }]);
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, key: keyof POLine, value: string) => setLines(l => l.map((line, idx) => idx === i ? { ...line, [key]: value } : line));

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.quantity) || 0) * (parseFloat(l.unit_price) || 0), 0);

  const handleSave = async () => {
    if (!supplierId) { toast({ title: 'Select a supplier', variant: 'destructive' }); return; }
    if (lines.length === 0 || !lines[0].product_description) { toast({ title: 'Add at least one line item', variant: 'destructive' }); return; }
    setSaving(true);

    const poPayload: any = {
      po_number: poNumber, supplier_id: supplierId, depot_id: depotId || null,
      expected_date: expectedDate || null, status, currency_code: currencyCode,
      notes: notes || null, subtotal_amount: subtotal, total_amount: subtotal, tax_amount: 0,
    };

    let poId = id;
    if (isEdit) {
      const { error } = await supabase.from('purchase_orders').update(poPayload).eq('id', id!);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
      await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id!);
    } else {
      const { data, error } = await supabase.from('purchase_orders').insert(poPayload).select('id').single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
      poId = data.id;
    }

    const linePayloads = lines.filter(l => l.product_description).map(l => ({
      purchase_order_id: poId!,
      product_description: l.product_description,
      quantity: parseFloat(l.quantity) || 1,
      quantity_uom: l.quantity_uom,
      unit_price: parseFloat(l.unit_price) || 0,
      line_total: (parseFloat(l.quantity) || 1) * (parseFloat(l.unit_price) || 0),
      variant_id: l.variant_id || null,
    }));

    if (linePayloads.length > 0) {
      const { error } = await supabase.from('purchase_order_items').insert(linePayloads as any);
      if (error) toast({ title: 'Line items warning', description: error.message, variant: 'destructive' });
    }

    toast({ title: isEdit ? 'Purchase order updated' : 'Purchase order created' });
    setSaving(false);
    navigate('/purchase-orders');
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-[500px] w-full rounded-lg" /></div>;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title={isEdit ? `Edit PO: ${poNumber}` : 'New Purchase Order'} description="Create or edit a purchase order for supplier procurement" action={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/purchase-orders')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          <Badge variant="outline" className="capitalize">{status}</Badge>
          <Button onClick={handleSave} disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? 'Saving...' : 'Save PO'}</Button>
        </div>
      } />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-primary" />Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>PO Number</Label><Input value={poNumber} onChange={e => setPoNumber(e.target.value)} className="font-mono" /></div>
              <div className="space-y-2">
                <Label>Supplier <span className="text-destructive">*</span></Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Depot</Label>
                <Select value={depotId || '__none'} onValueChange={v => setDepotId(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">No depot</SelectItem>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Expected Date</Label><Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem><SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem><SelectItem value="received">Received</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currencyCode} onValueChange={setCurrencyCode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="ZAR">ZAR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..." /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Lines</span><span className="font-medium tabular-nums">{lines.filter(l => l.product_description).length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium tabular-nums">{currencyCode} {subtotal.toFixed(2)}</span></div>
            <div className="border-t pt-3 flex justify-between font-medium"><span>Total</span><span className="tabular-nums">{currencyCode} {subtotal.toFixed(2)}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div><CardTitle>Line Items</CardTitle><CardDescription>Add products or descriptions to this purchase order. Link to existing variants if available.</CardDescription></div>
          <Button size="sm" onClick={addLine}><Plus className="mr-2 h-4 w-4" />Add Line</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lines.map((line, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="flex-1 grid gap-3 sm:grid-cols-5">
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Input value={line.product_description} onChange={e => updateLine(i, 'product_description', e.target.value)} placeholder="Product or item description" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Variant (optional)</Label>
                    <Select value={line.variant_id || '__none'} onValueChange={v => updateLine(i, 'variant_id', v === '__none' ? '' : v)}>
                      <SelectTrigger className="text-xs"><SelectValue placeholder="Link variant" /></SelectTrigger>
                      <SelectContent>{[<SelectItem key="__none" value="__none">None</SelectItem>, ...variants.map(v => <SelectItem key={v.id} value={v.id}>{v.variant_name} ({v.sku})</SelectItem>)]}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                      <Input type="number" step="1" value={line.quantity} onChange={e => updateLine(i, 'quantity', e.target.value)} className="tabular-nums" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Unit Price</Label>
                      <Input type="number" step="0.01" value={line.unit_price} onChange={e => updateLine(i, 'unit_price', e.target.value)} className="tabular-nums" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <Label className="text-xs text-muted-foreground">Line Total</Label>
                      <p className="text-sm font-medium tabular-nums">{currencyCode} {((parseFloat(line.quantity) || 0) * (parseFloat(line.unit_price) || 0)).toFixed(2)}</p>
                    </div>
                    {lines.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLine(i)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
