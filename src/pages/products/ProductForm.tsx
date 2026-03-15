import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import {
  Save, ArrowLeft, Package, Tag, DollarSign, Truck, Warehouse, Layers, Box, Beaker,
  Plus, Trash2, GripVertical,
} from 'lucide-react';
import { ProductVariantManager } from '@/components/products/ProductVariantManager';

const PACK_SIZE_PRESETS = [
  { label: '10g', quantity: 10, uom: 'g', type: 'weight' },
  { label: '25g', quantity: 25, uom: 'g', type: 'weight' },
  { label: '50g', quantity: 50, uom: 'g', type: 'weight' },
  { label: '100g', quantity: 100, uom: 'g', type: 'weight' },
  { label: '500g', quantity: 500, uom: 'g', type: 'weight' },
  { label: '1kg', quantity: 1, uom: 'kg', type: 'weight' },
  { label: '25kg', quantity: 25, uom: 'kg', type: 'weight' },
  { label: '50kg', quantity: 50, uom: 'kg', type: 'weight' },
  { label: '100kg', quantity: 100, uom: 'kg', type: 'weight' },
  { label: '500kg (Bulk)', quantity: 500, uom: 'kg', type: 'weight' },
  { label: '1 ton (Bulk)', quantity: 1000, uom: 'kg', type: 'weight' },
  { label: '60K', quantity: 60000, uom: 'seeds', type: 'count' },
  { label: '80K', quantity: 80000, uom: 'seeds', type: 'count' },
  { label: '140K', quantity: 140000, uom: 'seeds', type: 'count' },
  { label: '150K', quantity: 150000, uom: 'seeds', type: 'count' },
  { label: '180K', quantity: 180000, uom: 'seeds', type: 'count' },
];

interface FormData {
  name: string;
  sku: string;
  product_type: string;
  status: string;
  brand: string;
  description: string;
  category: string;
  subcategory_id: string;
  supplier_id: string;
  is_active: boolean;
  price: string;
  compare_at_price: string;
  buying_price: string;
  currency_code: string;
  base_uom: string;
  stock_quantity: string;
  track_inventory: boolean;
  allow_backorder: boolean;
  requires_shipping: boolean;
  shipping_weight_kg: string;
  length_cm: string;
  width_cm: string;
  height_cm: string;
  metadata: Record<string, any>;
}

const emptyForm: FormData = {
  name: '', sku: '', product_type: 'physical', status: 'draft', brand: '', description: '',
  category: '', subcategory_id: '', supplier_id: '', is_active: true,
  price: '', compare_at_price: '', buying_price: '', currency_code: 'ZAR', base_uom: 'kg',
  stock_quantity: '0', track_inventory: true, allow_backorder: false, requires_shipping: true,
  shipping_weight_kg: '', length_cm: '', width_cm: '', height_cm: '', metadata: {},
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);

  // Load lookups
  useEffect(() => {
    Promise.all([
      supabase.from('product_categories').select('id, name').order('sort_order'),
      supabase.from('product_subcategories').select('id, name, category_id').order('sort_order'),
      supabase.from('suppliers').select('id, supplier_name').order('supplier_name'),
      supabase.from('product_collections').select('id, name').order('sort_order'),
      supabase.from('depots').select('id, name').order('name'),
    ]).then(([catR, subR, supR, colR, depR]) => {
      setCategories(catR.data || []);
      setSubcategories(subR.data || []);
      setSuppliers(supR.data || []);
      setCollections(colR.data || []);
      setDepots(depR.data || []);
    });
  }, []);

  // Load product for edit
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('product_collection_items').select('collection_id').eq('product_id', id),
      supabase.from('product_pack_sizes').select('*').eq('product_id', id).order('created_at'),
    ]).then(([prodR, colR, packR]) => {
      if (prodR.data) {
        const p = prodR.data as any;
        setForm({
          name: p.name || '', sku: p.sku || '', product_type: p.product_type, status: p.status,
          brand: p.brand || '', description: p.description || '', category: p.category || '',
          subcategory_id: p.subcategory_id || '', supplier_id: p.supplier_id || '',
          is_active: p.is_active, price: p.price != null ? String(p.price) : '',
          compare_at_price: p.compare_at_price != null ? String(p.compare_at_price) : '',
          buying_price: p.metadata?.buying_price != null ? String(p.metadata.buying_price) : '',
          currency_code: p.currency_code, base_uom: p.base_uom,
          stock_quantity: String(p.stock_quantity), track_inventory: p.track_inventory,
          allow_backorder: p.allow_backorder, requires_shipping: p.requires_shipping,
          shipping_weight_kg: p.shipping_weight_kg != null ? String(p.shipping_weight_kg) : '',
          length_cm: p.length_cm != null ? String(p.length_cm) : '',
          width_cm: p.width_cm != null ? String(p.width_cm) : '',
          height_cm: p.height_cm != null ? String(p.height_cm) : '',
          metadata: p.metadata || {},
        });
      }
      setSelectedCollections((colR.data || []).map((c: any) => c.collection_id));
      setPackSizes(packR.data || []);
      setLoading(false);
    });
  }, [id]);

  const margin = useMemo(() => {
    const buy = parseFloat(form.buying_price);
    const sell = parseFloat(form.price);
    if (!isNaN(buy) && !isNaN(sell) && sell > 0) return (((sell - buy) / sell) * 100).toFixed(1);
    return null;
  }, [form.buying_price, form.price]);

  const update = (key: keyof FormData, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation', description: 'Product name is required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload: any = {
      name: form.name.trim(),
      sku: form.sku || null,
      product_type: form.product_type,
      status: form.status,
      brand: form.brand || null,
      description: form.description || null,
      category: form.category || null,
      subcategory_id: form.subcategory_id || null,
      supplier_id: form.supplier_id || null,
      is_active: form.is_active,
      price: form.price ? Number(form.price) : null,
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      currency_code: form.currency_code,
      base_uom: form.base_uom,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      track_inventory: form.track_inventory,
      allow_backorder: form.allow_backorder,
      requires_shipping: form.requires_shipping,
      shipping_weight_kg: form.shipping_weight_kg ? Number(form.shipping_weight_kg) : null,
      length_cm: form.length_cm ? Number(form.length_cm) : null,
      width_cm: form.width_cm ? Number(form.width_cm) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      metadata: { ...form.metadata, buying_price: form.buying_price ? Number(form.buying_price) : null },
    };

    let productId = id;
    if (isEdit) {
      const { error } = await supabase.from('products').update(payload).eq('id', id!);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select('id').single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
      productId = data.id;
    }

    // Sync collections
    if (productId) {
      await supabase.from('product_collection_items').delete().eq('product_id', productId);
      if (selectedCollections.length > 0) {
        await supabase.from('product_collection_items').insert(
          selectedCollections.map(cid => ({ product_id: productId!, collection_id: cid })) as any
        );
      }
    }

    toast({ title: isEdit ? 'Product updated' : 'Product created' });
    setSaving(false);
    navigate(`/products/${productId}`);
  };

  const addPackSize = async (preset: typeof PACK_SIZE_PRESETS[0]) => {
    if (!id) { toast({ title: 'Save the product first', variant: 'destructive' }); return; }
    const { error } = await supabase.from('product_pack_sizes').insert({
      product_id: id,
      pack_code: preset.label.replace(/\s/g, '_').toLowerCase(),
      pack_label: preset.label,
      pack_type: preset.type,
      quantity_value: preset.quantity,
      quantity_uom: preset.uom,
      shipping_weight_kg: preset.uom === 'kg' ? preset.quantity : 0,
      is_default: packSizes.length === 0,
    } as any);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      const { data } = await supabase.from('product_pack_sizes').select('*').eq('product_id', id).order('created_at');
      setPackSizes(data || []);
      toast({ title: 'Pack size added' });
    }
  };

  const removePackSize = async (psId: string) => {
    await supabase.from('product_pack_sizes').delete().eq('id', psId);
    setPackSizes(ps => ps.filter(p => p.id !== psId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={isEdit ? 'Edit Product' : 'New Product'}
        description={isEdit ? form.name : 'Create a new product in your catalog'}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />{saving ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="basic" className="gap-1.5"><Package className="h-3.5 w-3.5" />Basic Info</TabsTrigger>
          <TabsTrigger value="classification" className="gap-1.5"><Tag className="h-3.5 w-3.5" />Classification</TabsTrigger>
          <TabsTrigger value="pricing" className="gap-1.5"><DollarSign className="h-3.5 w-3.5" />Pricing</TabsTrigger>
          <TabsTrigger value="packing" className="gap-1.5"><Box className="h-3.5 w-3.5" />Pack Sizes</TabsTrigger>
          <TabsTrigger value="variants" className="gap-1.5"><Layers className="h-3.5 w-3.5" />Variants</TabsTrigger>
          <TabsTrigger value="shipping" className="gap-1.5"><Truck className="h-3.5 w-3.5" />Shipping</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1.5"><Warehouse className="h-3.5 w-3.5" />Inventory</TabsTrigger>
          <TabsTrigger value="attributes" className="gap-1.5"><Beaker className="h-3.5 w-3.5" />Attributes</TabsTrigger>
        </TabsList>

        {/* BASIC INFO */}
        <TabsContent value="basic">
          <Card>
            <CardHeader><CardTitle>Basic Product Information</CardTitle></CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Pioneer P3456 Maize Seed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Internal Code</Label>
                <Input id="sku" value={form.sku} onChange={e => update('sku', e.target.value)} placeholder="e.g. SL-MAIZE-001" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={form.product_type} onValueChange={v => update('product_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => update('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={e => update('brand', e.target.value)} placeholder="e.g. Pioneer, Syngenta" />
              </div>
              <div className="flex items-center justify-between sm:col-span-2 p-4 rounded-lg border bg-muted/30">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">Product is visible and available for sale</p>
                </div>
                <Switch checked={form.is_active} onCheckedChange={v => update('is_active', v)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="Full product description..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CLASSIFICATION */}
        <TabsContent value="classification">
          <Card>
            <CardHeader><CardTitle>Product Classification</CardTitle><CardDescription>Link to categories, collections, and suppliers</CardDescription></CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category || '__none'} onValueChange={v => update('category', v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No category</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select value={form.subcategory_id || '__none'} onValueChange={v => update('subcategory_id', v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No subcategory</SelectItem>
                    {subcategories.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select value={form.supplier_id || '__none'} onValueChange={v => update('supplier_id', v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No supplier</SelectItem>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Collections</Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border min-h-[56px]">
                  {collections.map(c => {
                    const active = selectedCollections.includes(c.id);
                    return (
                      <Badge key={c.id} variant={active ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() => setSelectedCollections(prev =>
                          active ? prev.filter(x => x !== c.id) : [...prev, c.id]
                        )}>
                        {c.name}
                      </Badge>
                    );
                  })}
                  {collections.length === 0 && <span className="text-sm text-muted-foreground">No collections available</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRICING */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle><CardDescription>Set buying price, selling price, and margin</CardDescription></CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Buying Price ({form.currency_code})</Label>
                <Input type="number" step="0.01" value={form.buying_price} onChange={e => update('buying_price', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Selling Price ({form.currency_code}) *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Margin %</Label>
                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 font-medium tabular-nums">
                  {margin ? <span className={Number(margin) < 10 ? 'text-destructive' : 'text-primary'}>{margin}%</span> : <span className="text-muted-foreground">—</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Compare-at Price ({form.currency_code})</Label>
                <Input type="number" step="0.01" value={form.compare_at_price} onChange={e => update('compare_at_price', e.target.value)} placeholder="Promotional / original price" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={form.currency_code} onValueChange={v => update('currency_code', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base UOM</Label>
                <Select value={form.base_uom} onValueChange={v => update('base_uom', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="l">Litre (L)</SelectItem>
                    <SelectItem value="ml">Millilitre (mL)</SelectItem>
                    <SelectItem value="unit">Unit</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="seeds">Seeds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PACK SIZES */}
        <TabsContent value="packing">
          <Card>
            <CardHeader>
              <CardTitle>Pack Sizes</CardTitle>
              <CardDescription>Define packaging options. K = 1,000 seeds. Seed packs support count-to-weight conversion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isEdit && (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">Save the product first, then add pack sizes.</p>
                </div>
              )}

              {isEdit && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Quick Add Presets</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {PACK_SIZE_PRESETS.map(p => (
                        <Button key={p.label} variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => addPackSize(p)} disabled={packSizes.some(ps => ps.pack_label === p.label)}>
                          {p.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {packSizes.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <Box className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No pack sizes defined yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {packSizes.map(ps => (
                        <div key={ps.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                          <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                          <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                            <div><span className="text-xs text-muted-foreground block">Label</span><span className="font-medium">{ps.pack_label}</span></div>
                            <div><span className="text-xs text-muted-foreground block">Type</span><Badge variant="secondary" className="capitalize text-xs">{ps.pack_type}</Badge></div>
                            <div><span className="text-xs text-muted-foreground block">Qty</span>{ps.quantity_value} {ps.quantity_uom}</div>
                            <div><span className="text-xs text-muted-foreground block">Seeds</span>{ps.seed_count ?? '—'}</div>
                            <div><span className="text-xs text-muted-foreground block">Weight (kg)</span>{ps.shipping_weight_kg}</div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removePackSize(ps.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VARIANTS */}
        <TabsContent value="variants">
          {isEdit && id ? (
            <ProductVariantManager productId={id} productPrice={form.price} currencyCode={form.currency_code} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Layers className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Save the product first, then manage variants.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SHIPPING / DROVVI */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Dimensions</CardTitle>
              <CardDescription>Dimensions for Drovvi shipping integration. All fields optional.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Shipping Weight (kg)</Label>
                <Input type="number" step="0.01" value={form.shipping_weight_kg} onChange={e => update('shipping_weight_kg', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Length (cm)</Label>
                <Input type="number" step="0.1" value={form.length_cm} onChange={e => update('length_cm', e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Width (cm)</Label>
                <Input type="number" step="0.1" value={form.width_cm} onChange={e => update('width_cm', e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input type="number" step="0.1" value={form.height_cm} onChange={e => update('height_cm', e.target.value)} placeholder="0" />
              </div>
              {form.shipping_weight_kg && form.length_cm && form.width_cm && form.height_cm && (
                <div className="sm:col-span-2 p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium">Volumetric Weight</p>
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {((Number(form.length_cm) * Number(form.width_cm) * Number(form.height_cm)) / 5000).toFixed(2)} kg
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Calculated as L×W×H / 5000</p>
                </div>
              )}
              <div className="flex items-center justify-between sm:col-span-2 p-4 rounded-lg border bg-muted/30">
                <div><Label>Requires Shipping</Label><p className="text-xs text-muted-foreground">This product needs physical delivery</p></div>
                <Switch checked={form.requires_shipping} onCheckedChange={v => update('requires_shipping', v)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVENTORY */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader><CardTitle>Inventory & Depot</CardTitle></CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={form.stock_quantity} onChange={e => update('stock_quantity', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Depot</Label>
                <Select value={form.metadata?.depot_id || '__none'} onValueChange={v => setForm(f => ({ ...f, metadata: { ...f.metadata, depot_id: v === '__none' ? null : v } }))}>
                  <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No depot assigned</SelectItem>
                    {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div><Label>Track Inventory</Label><p className="text-xs text-muted-foreground">Monitor stock levels</p></div>
                <Switch checked={form.track_inventory} onCheckedChange={v => update('track_inventory', v)} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div><Label>Allow Backorder</Label><p className="text-xs text-muted-foreground">Accept orders when out of stock</p></div>
                <Switch checked={form.allow_backorder} onCheckedChange={v => update('allow_backorder', v)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ATTRIBUTES */}
        <TabsContent value="attributes">
          <Card>
            <CardHeader>
              <CardTitle>Product Attributes</CardTitle>
              <CardDescription>Agribusiness-specific attributes stored in metadata</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {[
                { key: 'crop', label: 'Crop', placeholder: 'e.g. Maize, Soybean' },
                { key: 'product_form', label: 'Product Form', placeholder: 'e.g. Granular, Liquid' },
                { key: 'seed_type', label: 'Seed Type', placeholder: 'e.g. Hybrid, OPV' },
                { key: 'seed_class', label: 'Seed Class', placeholder: 'e.g. Certified, Foundation' },
                { key: 'germination_pct', label: 'Germination %', placeholder: '0-100' },
                { key: 'purity_pct', label: 'Purity %', placeholder: '0-100' },
                { key: 'treatment', label: 'Treatment', placeholder: 'e.g. Thiram, Metalaxyl' },
                { key: 'active_ingredient', label: 'Active Ingredient', placeholder: 'e.g. Glyphosate 360g/L' },
                { key: 'concentration', label: 'Concentration', placeholder: 'e.g. 480 g/L' },
                { key: 'target_use', label: 'Target Use', placeholder: 'e.g. Pre-emerge herbicide' },
                { key: 'season', label: 'Season', placeholder: 'e.g. Summer 2025' },
                { key: 'market_segment', label: 'Market Segment', placeholder: 'e.g. Commercial, Smallholder' },
              ].map(attr => (
                <div key={attr.key} className="space-y-2">
                  <Label>{attr.label}</Label>
                  <Input
                    value={form.metadata?.[attr.key] || ''}
                    onChange={e => setForm(f => ({ ...f, metadata: { ...f.metadata, [attr.key]: e.target.value } }))}
                    placeholder={attr.placeholder}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
