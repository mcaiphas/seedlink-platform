import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generateDocNumber } from '@/lib/document-numbers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

interface POLine {
  id?: string;
  product_id: string | null;
  pack_size_id: string | null;
  variant_id: string | null;
  product_description: string;
  supplier_product_code: string;
  quantity: number;
  quantity_uom: string;
  unit_price: number;
  line_total: number;
  weight_equivalent_kg: number | null;
  expected_date: string;
}

const emptyLine: POLine = {
  product_id: null, pack_size_id: null, variant_id: null,
  product_description: '', supplier_product_code: '', quantity: 1, quantity_uom: 'pack',
  unit_price: 0, line_total: 0, weight_equivalent_kg: null, expected_date: '',
};

export default function PurchaseOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;

  const [poNumber, setPoNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [depotId, setDepotId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [currencyCode, setCurrencyCode] = useState('ZAR');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('draft');
  const [lines, setLines] = useState<POLine[]>([{ ...emptyLine }]);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [supRes, depRes, prodRes, psRes] = await Promise.all([
        supabase.from('suppliers').select('id, supplier_name, supplier_code, payment_terms, currency_code').eq('is_active', true).order('supplier_name'),
        supabase.from('depots').select('id, name, depot_code').eq('is_active', true).order('name'),
        supabase.from('products').select('id, name, sku').eq('is_active', true).order('name').limit(500),
        supabase.from('product_pack_sizes').select('id, name, estimated_weight_kg').eq('is_active', true).order('sort_order'),
      ]);
      setSuppliers(supRes.data || []);
      setDepots(depRes.data || []);
      setProducts(prodRes.data || []);
      setPackSizes(psRes.data || []);

      if (isEdit) {
        const { data: po } = await supabase.from('purchase_orders').select('*').eq('id', id).single();
        if (po) {
          setPoNumber(po.po_number); setSupplierId(po.supplier_id); setDepotId(po.depot_id || '');
          setOrderDate(po.order_date); setExpectedDate(po.expected_date || ''); setCurrencyCode(po.currency_code);
          setPaymentTerms(po.payment_terms || ''); setNotes(po.notes || ''); setStatus(po.status);
          const { data: items } = await supabase.from('purchase_order_items').select('*').eq('purchase_order_id', id);
          if (items?.length) setLines(items.map(i => ({
            id: i.id, product_id: i.product_id, pack_size_id: i.pack_size_id, variant_id: i.variant_id,
            product_description: i.product_description, supplier_product_code: i.supplier_product_code || '',
            quantity: Number(i.quantity), quantity_uom: i.quantity_uom, unit_price: Number(i.unit_price),
            line_total: Number(i.line_total), weight_equivalent_kg: i.weight_equivalent_kg ? Number(i.weight_equivalent_kg) : null,
            expected_date: i.expected_date || '',
          })));
          // Load supplier products
          if (po.supplier_id) {
            const { data: sp } = await supabase.from('supplier_products').select('*').eq('supplier_id', po.supplier_id);
            setSupplierProducts(sp || []);
          }
        }
      } else {
        const num = await generateDocNumber('po');
        setPoNumber(num);
      }
      setLoading(false);
    };
    init();
  }, [id, isEdit]);

  const onSupplierChange = async (sid: string) => {
    setSupplierId(sid);
    const sup = suppliers.find(s => s.id === sid);
    if (sup) {
      if (sup.payment_terms) setPaymentTerms(sup.payment_terms);
      if (sup.currency_code) setCurrencyCode(sup.currency_code);
    }
    const { data: sp } = await supabase.from('supplier_products').select('*').eq('supplier_id', sid);
    setSupplierProducts(sp || []);
  };

  const updateLine = (idx: number, field: keyof POLine, value: any) => {
    setLines(prev => prev.map((l, i) => {
      if (i !== idx) return l;
      const updated = { ...l, [field]: value };
      if (field === 'product_id' && value) {
        const prod = products.find(p => p.id === value);
        if (prod) updated.product_description = prod.name;
        const sp = supplierProducts.find(s => s.product_id === value);
        if (sp) {
          updated.supplier_product_code = sp.supplier_product_code || '';
          if (sp.standard_cost) updated.unit_price = Number(sp.standard_cost);
        }
      }
      if (field === 'pack_size_id' && value) {
        const ps = packSizes.find(p => p.id === value);
        if (ps?.estimated_weight_kg) {
          updated.weight_equivalent_kg = ps.estimated_weight_kg * updated.quantity;
        }
      }
      if (field === 'quantity' || field === 'unit_price') {
        updated.line_total = Number(updated.quantity) * Number(updated.unit_price);
        if (updated.pack_size_id) {
          const ps = packSizes.find(p => p.id === updated.pack_size_id);
          if (ps?.estimated_weight_kg) updated.weight_equivalent_kg = ps.estimated_weight_kg * Number(updated.quantity);
        }
      }
      return updated;
    }));
  };

  const subtotal = lines.reduce((s, l) => s + l.line_total, 0);
  const taxAmount = subtotal * 0.15;
  const totalAmount = subtotal + taxAmount;
  const totalWeight = lines.reduce((s, l) => s + (l.weight_equivalent_kg || 0), 0);
  const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: currencyCode }).format(v);

  const handleSave = async (newStatus?: string) => {
    if (!supplierId) { toast({ title: 'Select a supplier', variant: 'destructive' }); return; }
    if (!lines.some(l => l.product_description.trim())) { toast({ title: 'Add at least one line item', variant: 'destructive' }); return; }
    setSaving(true);
    const finalStatus = newStatus || status;
    const poPayload: any = {
      po_number: poNumber, supplier_id: supplierId, depot_id: depotId || null,
      ordered_by: user?.id || null, order_date: orderDate, expected_date: expectedDate || null,
      currency_code: currencyCode, payment_terms: paymentTerms || null,
      subtotal_amount: subtotal, tax_amount: taxAmount, total_amount: totalAmount,
      status: finalStatus, notes: notes || null,
    };

    let poId = id;
    if (isEdit) {
      const { error } = await supabase.from('purchase_orders').update(poPayload).eq('id', id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
      await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id!);
    } else {
      const { data: newPo, error } = await supabase.from('purchase_orders').insert(poPayload).select('id').single();
      if (error || !newPo) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); setSaving(false); return; }
      poId = newPo.id;
    }

    const linePayloads = lines.filter(l => l.product_description.trim()).map(l => ({
      purchase_order_id: poId!, product_id: l.product_id || null, pack_size_id: l.pack_size_id || null,
      variant_id: l.variant_id || null, product_description: l.product_description,
      supplier_product_code: l.supplier_product_code || null, quantity: l.quantity,
      quantity_uom: l.quantity_uom, unit_price: l.unit_price, line_total: l.line_total,
      weight_equivalent_kg: l.weight_equivalent_kg, expected_date: l.expected_date || null,
    }));
    if (linePayloads.length) {
      const { error: lineErr } = await supabase.from('purchase_order_items').insert(linePayloads);
      if (lineErr) toast({ title: 'Lines error', description: lineErr.message, variant: 'destructive' });
    }
    toast({ title: isEdit ? 'Purchase order updated' : 'Purchase order created' });
    setSaving(false);
    navigate('/purchase-orders');
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  const isLocked = !['draft'].includes(status);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/purchase-orders')}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Purchase Order' : 'New Purchase Order'}</h1>
            <Badge variant={status === 'draft' ? 'secondary' : 'default'} className="text-xs uppercase">{status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono mt-0.5">{poNumber}</p>
        </div>
        <div className="flex gap-2">
          {!isLocked && <Button variant="outline" onClick={() => handleSave()} disabled={saving} className="gap-2"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save Draft'}</Button>}
          {status === 'draft' && <Button onClick={() => handleSave('submitted')} disabled={saving} className="gap-2"><Send className="h-4 w-4" />Submit for Approval</Button>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4"><CardTitle className="text-base">Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Supplier <span className="text-destructive">*</span></Label>
                <Select value={supplierId} onValueChange={onSupplierChange} disabled={isLocked}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name} ({s.supplier_code})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Destination Depot</Label>
                <Select value={depotId} onValueChange={setDepotId} disabled={isLocked}>
                  <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                  <SelectContent>{depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Order Date</Label><Input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} disabled={isLocked} /></div>
              <div className="space-y-1.5"><Label>Expected Delivery</Label><Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} disabled={isLocked} /></div>
              <div className="space-y-1.5"><Label>Payment Terms</Label><Input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} disabled={isLocked} /></div>
              <div className="space-y-1.5"><Label>Currency</Label><Input value={currencyCode} onChange={e => setCurrencyCode(e.target.value)} disabled={isLocked} /></div>
            </div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} disabled={isLocked} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">VAT (15%)</span><span className="font-mono">{fmt(taxAmount)}</span></div>
            <Separator />
            <div className="flex justify-between font-semibold"><span>Total</span><span className="font-mono text-lg">{fmt(totalAmount)}</span></div>
            <Separator />
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Weight</span><span className="font-mono">{totalWeight.toFixed(1)} kg</span></div>
            <p className="text-xs text-muted-foreground">{lines.filter(l => l.product_description.trim()).length} line item(s)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Line Items</CardTitle>
            {!isLocked && <Button size="sm" variant="outline" onClick={() => setLines(prev => [...prev, { ...emptyLine }])} className="gap-2"><Plus className="h-3.5 w-3.5" />Add Line</Button>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[200px] font-semibold">Product</TableHead>
                  <TableHead className="w-[140px] font-semibold">Pack Size</TableHead>
                  <TableHead className="w-[90px] font-semibold">Qty</TableHead>
                  <TableHead className="w-[80px] font-semibold">UOM</TableHead>
                  <TableHead className="w-[110px] font-semibold">Unit Price</TableHead>
                  <TableHead className="w-[80px] font-semibold">Weight</TableHead>
                  <TableHead className="w-[110px] font-semibold text-right">Total</TableHead>
                  {!isLocked && <TableHead className="w-10" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Select value={line.product_id || ''} onValueChange={v => updateLine(idx, 'product_id', v)} disabled={isLocked}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={line.pack_size_id || ''} onValueChange={v => updateLine(idx, 'pack_size_id', v)} disabled={isLocked}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Pack size" /></SelectTrigger>
                        <SelectContent>{packSizes.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input type="number" min={0} value={line.quantity} onChange={e => updateLine(idx, 'quantity', Number(e.target.value))} className="h-9 text-sm" disabled={isLocked} /></TableCell>
                    <TableCell>
                      <Select value={line.quantity_uom} onValueChange={v => updateLine(idx, 'quantity_uom', v)} disabled={isLocked}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pack">pack</SelectItem>
                          <SelectItem value="bag">bag</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="unit">unit</SelectItem>
                          <SelectItem value="litre">litre</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input type="number" min={0} step={0.01} value={line.unit_price} onChange={e => updateLine(idx, 'unit_price', Number(e.target.value))} className="h-9 text-sm font-mono" disabled={isLocked} /></TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">{line.weight_equivalent_kg ? `${line.weight_equivalent_kg.toFixed(1)}` : '—'}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">{fmt(line.line_total)}</TableCell>
                    {!isLocked && (
                      <TableCell>
                        {lines.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setLines(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3.5 w-3.5" /></Button>}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
