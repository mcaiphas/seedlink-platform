import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import {
  Save, ArrowLeft, Package, Tag, DollarSign, Truck, Warehouse, Layers, Box, Beaker, Image as ImageIcon,
} from 'lucide-react';
import { GeneralTab } from '@/components/products/tabs/GeneralTab';
import { ClassificationTab } from '@/components/products/tabs/ClassificationTab';
import { PricingTab } from '@/components/products/tabs/PricingTab';
import { PackSizesTab } from '@/components/products/tabs/PackSizesTab';
import { ShippingTab } from '@/components/products/tabs/ShippingTab';
import { InventoryTab } from '@/components/products/tabs/InventoryTab';
import { AttributesTab } from '@/components/products/tabs/AttributesTab';
import { MediaTab } from '@/components/products/tabs/MediaTab';
import { ProductVariantManager } from '@/components/products/ProductVariantManager';

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

  const update = useCallback((key: keyof FormData, value: any) => setForm(f => ({ ...f, [key]: value })), []);

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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-lg">
          <TabsTrigger value="general" className="gap-1.5"><Package className="h-3.5 w-3.5" />General</TabsTrigger>
          <TabsTrigger value="classification" className="gap-1.5"><Tag className="h-3.5 w-3.5" />Classification</TabsTrigger>
          <TabsTrigger value="pricing" className="gap-1.5"><DollarSign className="h-3.5 w-3.5" />Pricing</TabsTrigger>
          <TabsTrigger value="packing" className="gap-1.5"><Box className="h-3.5 w-3.5" />Pack Sizes</TabsTrigger>
          <TabsTrigger value="variants" className="gap-1.5"><Layers className="h-3.5 w-3.5" />Variants</TabsTrigger>
          <TabsTrigger value="shipping" className="gap-1.5"><Truck className="h-3.5 w-3.5" />Shipping</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1.5"><Warehouse className="h-3.5 w-3.5" />Depot / Inventory</TabsTrigger>
          <TabsTrigger value="media" className="gap-1.5"><ImageIcon className="h-3.5 w-3.5" />Media</TabsTrigger>
          <TabsTrigger value="attributes" className="gap-1.5"><Beaker className="h-3.5 w-3.5" />Attributes</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab form={form} update={update} />
        </TabsContent>

        <TabsContent value="classification">
          <ClassificationTab
            form={form} update={update}
            categories={categories} subcategories={subcategories}
            suppliers={suppliers} collections={collections}
            selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}
          />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingTab form={form} update={update} />
        </TabsContent>

        <TabsContent value="packing">
          <PackSizesTab productId={id} isEdit={isEdit} packSizes={packSizes} setPackSizes={setPackSizes} />
        </TabsContent>

        <TabsContent value="variants">
          {isEdit && id ? (
            <ProductVariantManager productId={id} productPrice={form.price} currencyCode={form.currency_code} />
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Save the product first</p>
              <p className="text-xs text-muted-foreground mt-1">Variants can be managed after the product is created.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingTab form={form} update={update} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab form={form} update={update} setForm={setForm} depots={depots} />
        </TabsContent>

        <TabsContent value="media">
          <MediaTab form={form} update={update} />
        </TabsContent>

        <TabsContent value="attributes">
          <AttributesTab form={form} setForm={setForm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
