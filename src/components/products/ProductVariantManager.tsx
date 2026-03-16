import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Layers, Package, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  productId: string;
  currencyCode: string;
  packSizes?: any[];
  depots?: any[];
}

interface VariantForm {
  variant_name: string;
  sku: string;
  barcode: string;
  buying_price: string;
  selling_price: string;
  margin_percent: string;
  pack_size_id: string;
  depot_id: string;
  weight_kg: string;
  length_cm: string;
  width_cm: string;
  height_cm: string;
  is_active: boolean;
  is_bulk: boolean;
  variant_status: string;
}

const emptyVariant: VariantForm = {
  variant_name: '', sku: '', barcode: '', buying_price: '', selling_price: '', margin_percent: '',
  pack_size_id: '', depot_id: '', weight_kg: '', length_cm: '', width_cm: '', height_cm: '',
  is_active: true, is_bulk: false, variant_status: 'active',
};

export function ProductVariantManager({ productId, currencyCode, packSizes = [], depots = [] }: Props) {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<VariantForm>(emptyVariant);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('product_variants').select('*, product_pack_sizes(name)').eq('product_id', productId).order('created_at');
    setVariants(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const openNew = () => { setEditId(null); setForm(emptyVariant); setDialogOpen(true); };
  const openEdit = (v: any) => {
    setEditId(v.id);
    setForm({
      variant_name: v.variant_name, sku: v.sku, barcode: v.barcode || '',
      buying_price: v.buying_price != null ? String(v.buying_price) : '',
      selling_price: v.selling_price != null ? String(v.selling_price) : '',
      margin_percent: v.margin_percent != null ? String(v.margin_percent) : '',
      pack_size_id: v.pack_size_id || '', depot_id: v.depot_id || '',
      weight_kg: v.weight_kg != null ? String(v.weight_kg) : '',
      length_cm: v.length_cm != null ? String(v.length_cm) : '',
      width_cm: v.width_cm != null ? String(v.width_cm) : '',
      height_cm: v.height_cm != null ? String(v.height_cm) : '',
      is_active: v.is_active, is_bulk: v.is_bulk, variant_status: v.variant_status,
    });
    setDialogOpen(true);
  };

  const calcMargin = () => {
    const buy = parseFloat(form.buying_price);
    const sell = parseFloat(form.selling_price);
    if (!isNaN(buy) && !isNaN(sell) && buy > 0) return (((sell - buy) / buy) * 100).toFixed(1);
    return null;
  };

  const handleSave = async () => {
    if (!form.variant_name.trim() || !form.sku.trim()) {
      toast({ title: 'Name and SKU are required', variant: 'destructive' }); return;
    }
    setSaving(true);

    const buy = form.buying_price ? Number(form.buying_price) : null;
    const sell = form.selling_price ? Number(form.selling_price) : null;
    let margin = form.margin_percent ? Number(form.margin_percent) : null;
    if (buy && sell && buy > 0 && margin === null) {
      margin = Number((((sell - buy) / buy) * 100).toFixed(2));
    }

    const payload: any = {
      product_id: productId,
      variant_name: form.variant_name.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode || null,
      buying_price: buy,
      selling_price: sell,
      margin_percent: margin,
      pack_size_id: form.pack_size_id || null,
      depot_id: form.depot_id || null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      length_cm: form.length_cm ? Number(form.length_cm) : null,
      width_cm: form.width_cm ? Number(form.width_cm) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      is_active: form.is_active,
      is_bulk: form.is_bulk,
      variant_status: form.variant_status,
    };

    if (editId) {
      const { error } = await supabase.from('product_variants').update(payload).eq('id', editId);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('product_variants').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    }

    toast({ title: editId ? 'Variant updated' : 'Variant added' });
    setSaving(false);
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (vid: string) => {
    const { error } = await supabase.from('product_variants').delete().eq('id', vid);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Variant deleted' }); load(); }
  };

  const autoMargin = calcMargin();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />Product Variants</CardTitle>
            <CardDescription>Manage pack size, treatment, colour, and other variants. {variants.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{variants.length}</Badge>}</CardDescription>
          </div>
          <Button size="sm" onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Variant</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
          ) : variants.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No variants yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create variants for different pack sizes, treatments, or formulations.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={openNew}>
                <Plus className="mr-2 h-4 w-4" />Create First Variant
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {variants.map(v => {
                const m = v.margin_percent != null ? Number(v.margin_percent).toFixed(1) : null;
                const mNum = m ? Number(m) : null;
                const psName = (v.product_pack_sizes as any)?.name;
                return (
                  <div key={v.id} className="flex items-center gap-3 p-3.5 rounded-lg border bg-card group hover:bg-muted/20 transition-colors">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${v.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Package className={`h-4 w-4 ${v.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-6 gap-x-4 gap-y-1 text-sm min-w-0">
                      <div className="sm:col-span-2">
                        <span className="font-medium line-clamp-1">{v.variant_name}</span>
                        <code className="block text-[11px] text-muted-foreground font-mono">{v.sku}</code>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Pack</span>
                        <span className="text-xs">{psName || '—'}</span>
                      </div>
                      <div className="tabular-nums">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Buy / Sell</span>
                        <span className="text-xs">
                          {v.buying_price != null ? Number(v.buying_price).toFixed(2) : '—'}
                          <span className="text-muted-foreground/50 mx-0.5">/</span>
                          {v.selling_price != null ? Number(v.selling_price).toFixed(2) : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Margin</span>
                        {mNum !== null ? (
                          <span className={`text-xs font-medium flex items-center gap-0.5 ${mNum < 10 ? 'text-destructive' : mNum >= 20 ? 'text-primary' : 'text-accent-foreground'}`}>
                            {mNum >= 20 ? <TrendingUp className="h-3 w-3" /> : mNum < 10 ? <TrendingDown className="h-3 w-3" /> : null}
                            {m}%
                          </span>
                        ) : <span className="text-xs text-muted-foreground/40">—</span>}
                      </div>
                      <div>
                        <Badge variant={v.is_active ? 'default' : 'secondary'} className="text-[10px] capitalize">{v.variant_status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(v.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
            <DialogDescription>Configure variant details, pricing, and logistics</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {/* Identity */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Identity</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Variant Name <span className="text-destructive">*</span></Label>
                  <Input value={form.variant_name} onChange={e => setForm(f => ({ ...f, variant_name: e.target.value }))} placeholder="e.g. 25kg Treated" />
                </div>
                <div className="space-y-2">
                  <Label>SKU <span className="text-destructive">*</span></Label>
                  <Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. SD-MZ-001-25KG" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Barcode</Label>
                  <Input value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="EAN / UPC" />
                </div>
                <div className="space-y-2">
                  <Label>Pack Size</Label>
                  <Select value={form.pack_size_id || '__none'} onValueChange={v => setForm(f => ({ ...f, pack_size_id: v === '__none' ? '' : v }))}>
                    <SelectTrigger><SelectValue placeholder="Select pack size" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">No pack size</SelectItem>
                      {packSizes.map(ps => <SelectItem key={ps.id} value={ps.id}>{ps.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Pricing</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Buying Price ({currencyCode})</Label>
                  <Input type="number" step="0.01" value={form.buying_price} onChange={e => setForm(f => ({ ...f, buying_price: e.target.value }))} className="tabular-nums" />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price ({currencyCode})</Label>
                  <Input type="number" step="0.01" value={form.selling_price} onChange={e => setForm(f => ({ ...f, selling_price: e.target.value }))} className="tabular-nums" />
                </div>
                <div className="space-y-2">
                  <Label>Margin %</Label>
                  <div className={`flex items-center h-10 px-3 rounded-md border font-medium tabular-nums text-sm ${autoMargin && Number(autoMargin) < 10 ? 'border-destructive/30 bg-destructive/5' : 'bg-muted/50'}`}>
                    {autoMargin ? (
                      <span className={Number(autoMargin) < 10 ? 'text-destructive' : Number(autoMargin) >= 20 ? 'text-primary' : 'text-accent-foreground'}>{autoMargin}%</span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Logistics</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Depot</Label>
                  <Select value={form.depot_id || '__none'} onValueChange={v => setForm(f => ({ ...f, depot_id: v === '__none' ? '' : v }))}>
                    <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">No depot</SelectItem>
                      {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.variant_status} onValueChange={v => setForm(f => ({ ...f, variant_status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-4 mt-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.01" value={form.weight_kg} onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Length (cm)</Label>
                  <Input type="number" step="0.1" value={form.length_cm} onChange={e => setForm(f => ({ ...f, length_cm: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Width (cm)</Label>
                  <Input type="number" step="0.1" value={form.width_cm} onChange={e => setForm(f => ({ ...f, width_cm: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" step="0.1" value={form.height_cm} onChange={e => setForm(f => ({ ...f, height_cm: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <Label className="text-sm">Active</Label>
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <Label className="text-sm">Bulk Item</Label>
                <Switch checked={form.is_bulk} onCheckedChange={v => setForm(f => ({ ...f, is_bulk: v }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
