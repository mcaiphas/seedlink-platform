import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Layers, Package } from 'lucide-react';

interface Props {
  productId: string;
  productPrice: string;
  currencyCode: string;
}

interface VariantForm {
  variant_name: string;
  sku: string;
  barcode: string;
  price_override: string;
  compare_at_price_override: string;
  buying_price: string;
  stock_quantity: string;
  shipping_weight_kg: string;
  is_active: boolean;
}

const emptyVariant: VariantForm = {
  variant_name: '', sku: '', barcode: '', price_override: '', compare_at_price_override: '',
  buying_price: '', stock_quantity: '0', shipping_weight_kg: '', is_active: true,
};

export function ProductVariantManager({ productId, productPrice, currencyCode }: Props) {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<VariantForm>(emptyVariant);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('product_variants').select('*').eq('product_id', productId).order('created_at');
    setVariants(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const openNew = () => { setEditId(null); setForm(emptyVariant); setDialogOpen(true); };
  const openEdit = (v: any) => {
    setEditId(v.id);
    setForm({
      variant_name: v.variant_name, sku: v.sku, barcode: v.barcode || '',
      price_override: v.price_override != null ? String(v.price_override) : '',
      compare_at_price_override: v.compare_at_price_override != null ? String(v.compare_at_price_override) : '',
      buying_price: v.metadata?.buying_price != null ? String(v.metadata.buying_price) : '',
      stock_quantity: String(v.stock_quantity), shipping_weight_kg: v.shipping_weight_kg != null ? String(v.shipping_weight_kg) : '',
      is_active: v.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.variant_name.trim() || !form.sku.trim()) {
      toast({ title: 'Name and SKU are required', variant: 'destructive' }); return;
    }
    setSaving(true);
    const payload: any = {
      product_id: productId,
      variant_name: form.variant_name.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode || null,
      price_override: form.price_override ? Number(form.price_override) : null,
      compare_at_price_override: form.compare_at_price_override ? Number(form.compare_at_price_override) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      shipping_weight_kg: form.shipping_weight_kg ? Number(form.shipping_weight_kg) : null,
      is_active: form.is_active,
      metadata: { buying_price: form.buying_price ? Number(form.buying_price) : null },
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

  const getVariantMargin = (v: any) => {
    const buy = v.metadata?.buying_price;
    const sell = v.price_override ?? (productPrice ? Number(productPrice) : null);
    if (buy && sell && sell > 0) return (((sell - buy) / sell) * 100).toFixed(1);
    return null;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Manage pack size, treatment, colour, and other variants</CardDescription>
          </div>
          <Button size="sm" onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Variant</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
          ) : variants.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No variants yet. Create variants for different pack sizes, treatments, or formulations.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {variants.map(v => {
                const margin = getVariantMargin(v);
                return (
                  <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card group hover:bg-muted/30 transition-colors">
                    <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-6 gap-x-4 gap-y-1 text-sm">
                      <div className="sm:col-span-2">
                        <span className="font-medium">{v.variant_name}</span>
                        <span className="block text-xs text-muted-foreground font-mono">{v.sku}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Price</span>
                        <span className="tabular-nums">
                          {v.price_override != null ? `${currencyCode} ${Number(v.price_override).toFixed(2)}` : <span className="text-muted-foreground">Parent</span>}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Margin</span>
                        {margin ? <span className={Number(margin) < 10 ? 'text-destructive' : 'text-primary'}>{margin}%</span> : '—'}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Stock</span>
                        <span className={v.stock_quantity <= 0 ? 'text-destructive font-medium' : ''}>{v.stock_quantity}</span>
                      </div>
                      <div>
                        <Badge variant={v.is_active ? 'default' : 'secondary'} className="text-xs">{v.is_active ? 'Active' : 'Inactive'}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(v.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Variant' : 'Add Variant'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Variant Name *</Label>
                <Input value={form.variant_name} onChange={e => setForm(f => ({ ...f, variant_name: e.target.value }))} placeholder="e.g. 25kg Treated" />
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. SL-MAIZE-001-25KG" className="font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Barcode</Label>
              <Input value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="EAN / UPC" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Buying Price</Label>
                <Input type="number" step="0.01" value={form.buying_price} onChange={e => setForm(f => ({ ...f, buying_price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Selling Price</Label>
                <Input type="number" step="0.01" value={form.price_override} onChange={e => setForm(f => ({ ...f, price_override: e.target.value }))} placeholder={productPrice || 'Parent price'} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Shipping Weight (kg)</Label>
              <Input type="number" step="0.01" value={form.shipping_weight_kg} onChange={e => setForm(f => ({ ...f, shipping_weight_kg: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <Label>Active</Label>
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
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
