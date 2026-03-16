import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import {
  Save, ArrowLeft, Package, Tag, DollarSign, Truck, Warehouse, Layers, Box, Sprout, Image as ImageIcon, Beaker, Wand2,
} from 'lucide-react';
import { GeneralTab } from '@/components/products/tabs/GeneralTab';
import { ClassificationTab } from '@/components/products/tabs/ClassificationTab';
import { PricingTab } from '@/components/products/tabs/PricingTab';
import { PackSizesTab } from '@/components/products/tabs/PackSizesTab';
import { ShippingTab } from '@/components/products/tabs/ShippingTab';
import { InventoryTab } from '@/components/products/tabs/InventoryTab';
import { AttributesTab } from '@/components/products/tabs/AttributesTab';
import { MediaTab } from '@/components/products/tabs/MediaTab';
import { SeedDetailsTab } from '@/components/products/tabs/SeedDetailsTab';
import { ProductVariantManager } from '@/components/products/ProductVariantManager';

export interface FormData {
  name: string;
  sku_base: string;
  sku: string;
  product_type: string;
  status: string;
  brand: string;
  description: string;
  short_description: string;
  image_url: string;
  category: string;
  category_id: string;
  subcategory_id: string;
  supplier_id: string;
  depot_id: string;
  organization_id: string;
  is_active: boolean;
  is_variant_product: boolean;
  default_buying_price: string;
  default_selling_price: string;
  default_margin_percent: string;
  compare_at_price: string;
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
  name: '', sku_base: '', sku: '', product_type: 'physical', status: 'draft', brand: '',
  description: '', short_description: '', image_url: '',
  category: '', category_id: '', subcategory_id: '', supplier_id: '', depot_id: '', organization_id: '',
  is_active: true, is_variant_product: false,
  default_buying_price: '', default_selling_price: '', default_margin_percent: '', compare_at_price: '',
  currency_code: 'ZAR', base_uom: 'kg',
  stock_quantity: '0', track_inventory: true, allow_backorder: false, requires_shipping: true,
  shipping_weight_kg: '', length_cm: '', width_cm: '', height_cm: '', metadata: {},
};

export interface SeedDetailsData {
  crop_name: string;
  variety_name: string;
  hybrid_name: string;
  maturity_classification: string;
  maturity_days: string;
  seed_class: string;
  treatment_name: string;
  germination_percent: string;
  purity_percent: string;
  thousand_kernel_weight_g: string;
  seeds_per_kg: string;
  notes: string;
}

const emptySeedDetails: SeedDetailsData = {
  crop_name: '', variety_name: '', hybrid_name: '', maturity_classification: '',
  maturity_days: '', seed_class: '', treatment_name: '', germination_percent: '',
  purity_percent: '', thousand_kernel_weight_g: '', seeds_per_kg: '', notes: '',
};

const TAB_CONFIG = [
  { value: 'general', label: 'General', icon: Package },
  { value: 'classification', label: 'Classification', icon: Tag },
  { value: 'pricing', label: 'Pricing', icon: DollarSign },
  { value: 'packing', label: 'Pack Sizes', icon: Box },
  { value: 'variants', label: 'Variants', icon: Layers },
  { value: 'shipping', label: 'Shipping', icon: Truck },
  { value: 'inventory', label: 'Depot / Inventory', icon: Warehouse },
  { value: 'media', label: 'Media', icon: ImageIcon },
  { value: 'seed', label: 'Seed Details', icon: Sprout },
  { value: 'attributes', label: 'Attributes', icon: Beaker },
] as const;

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [seedDetails, setSeedDetails] = useState<SeedDetailsData>(emptySeedDetails);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('product_categories').select('id, name, sku_prefix').order('sort_order'),
      supabase.from('product_subcategories').select('id, name, category_id').order('sort_order'),
      supabase.from('suppliers').select('id, supplier_name').order('supplier_name'),
      supabase.from('product_collections').select('id, name').order('sort_order'),
      supabase.from('depots').select('id, name').order('name'),
      supabase.from('organizations').select('id, name').order('name'),
      supabase.from('product_pack_sizes').select('*').order('sort_order'),
    ]).then(([catR, subR, supR, colR, depR, orgR, psR]) => {
      setCategories(catR.data || []);
      setSubcategories(subR.data || []);
      setSuppliers(supR.data || []);
      setCollections(colR.data || []);
      setDepots(depR.data || []);
      setOrganizations(orgR.data || []);
      setPackSizes(psR.data || []);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('product_collection_items').select('collection_id').eq('product_id', id),
      supabase.from('seed_product_details').select('*').eq('product_id', id).maybeSingle(),
    ]).then(([prodR, colR, seedR]) => {
      if (prodR.data) {
        const p = prodR.data as any;
        setForm({
          name: p.name || '', sku_base: p.sku_base || '', sku: p.sku || '',
          product_type: p.product_type, status: p.status,
          brand: p.brand || '', description: p.description || '',
          short_description: p.short_description || '', image_url: p.image_url || '',
          category: p.category || '', category_id: p.category_id || '',
          subcategory_id: p.subcategory_id || '', supplier_id: p.supplier_id || '',
          depot_id: p.depot_id || '', organization_id: p.organization_id || '',
          is_active: p.is_active, is_variant_product: p.is_variant_product,
          default_buying_price: p.default_buying_price != null ? String(p.default_buying_price) : '',
          default_selling_price: p.default_selling_price != null ? String(p.default_selling_price) : '',
          default_margin_percent: p.default_margin_percent != null ? String(p.default_margin_percent) : '',
          compare_at_price: p.compare_at_price != null ? String(p.compare_at_price) : '',
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
      if (seedR.data) {
        const s = seedR.data as any;
        setSeedDetails({
          crop_name: s.crop_name || '', variety_name: s.variety_name || '',
          hybrid_name: s.hybrid_name || '', maturity_classification: s.maturity_classification || '',
          maturity_days: s.maturity_days != null ? String(s.maturity_days) : '',
          seed_class: s.seed_class || '', treatment_name: s.treatment_name || '',
          germination_percent: s.germination_percent != null ? String(s.germination_percent) : '',
          purity_percent: s.purity_percent != null ? String(s.purity_percent) : '',
          thousand_kernel_weight_g: s.thousand_kernel_weight_g != null ? String(s.thousand_kernel_weight_g) : '',
          seeds_per_kg: s.seeds_per_kg != null ? String(s.seeds_per_kg) : '',
          notes: s.notes || '',
        });
      }
      setLoading(false);
    });
  }, [id]);

  const update = useCallback((key: keyof FormData, value: any) => setForm(f => ({ ...f, [key]: value })), []);

  const generateSkuSuggestion = () => {
    const cat = categories.find(c => c.id === form.category_id);
    const prefix = cat?.sku_prefix || 'XX';
    const brand = (form.brand || '').substring(0, 4).toUpperCase().replace(/\s/g, '');
    const name = (form.name || '').substring(0, 6).toUpperCase().replace(/\s/g, '');
    return `${prefix}-${brand || name}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation', description: 'Product name is required', variant: 'destructive' });
      setActiveTab('general');
      return;
    }
    setSaving(true);

    let marginPct = form.default_margin_percent ? Number(form.default_margin_percent) : null;
    const buy = form.default_buying_price ? Number(form.default_buying_price) : null;
    const sell = form.default_selling_price ? Number(form.default_selling_price) : null;
    if (buy && sell && buy > 0 && marginPct === null) {
      marginPct = Number((((sell - buy) / buy) * 100).toFixed(2));
    }

    const payload: any = {
      name: form.name.trim(),
      sku_base: form.sku_base || null,
      sku: form.sku || null,
      product_type: form.product_type,
      status: form.status,
      brand: form.brand || null,
      description: form.description || null,
      short_description: form.short_description || null,
      image_url: form.image_url || null,
      category: form.category || null,
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      supplier_id: form.supplier_id || null,
      depot_id: form.depot_id || null,
      organization_id: form.organization_id || null,
      is_active: form.is_active,
      is_variant_product: form.is_variant_product,
      default_buying_price: buy,
      default_selling_price: sell,
      default_margin_percent: marginPct,
      price: sell,
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
      metadata: form.metadata,
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

    const hasSeedData = Object.values(seedDetails).some(v => v !== '');
    if (productId && hasSeedData) {
      const seedPayload: any = {
        product_id: productId,
        crop_name: seedDetails.crop_name || null,
        variety_name: seedDetails.variety_name || null,
        hybrid_name: seedDetails.hybrid_name || null,
        maturity_classification: seedDetails.maturity_classification || null,
        maturity_days: seedDetails.maturity_days ? Number(seedDetails.maturity_days) : null,
        seed_class: seedDetails.seed_class || null,
        treatment_name: seedDetails.treatment_name || null,
        germination_percent: seedDetails.germination_percent ? Number(seedDetails.germination_percent) : null,
        purity_percent: seedDetails.purity_percent ? Number(seedDetails.purity_percent) : null,
        thousand_kernel_weight_g: seedDetails.thousand_kernel_weight_g ? Number(seedDetails.thousand_kernel_weight_g) : null,
        seeds_per_kg: seedDetails.seeds_per_kg ? Number(seedDetails.seeds_per_kg) : null,
        notes: seedDetails.notes || null,
      };
      const { data: existing } = await supabase.from('seed_product_details').select('id').eq('product_id', productId).maybeSingle();
      if (existing) {
        await supabase.from('seed_product_details').update(seedPayload).eq('product_id', productId);
      } else {
        await supabase.from('seed_product_details').insert(seedPayload);
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

  // Compute completion indicators
  const hasClassification = !!(form.category_id || form.supplier_id || selectedCollections.length);
  const hasPricing = !!(form.default_buying_price || form.default_selling_price);
  const hasShipping = !!(form.shipping_weight_kg || form.length_cm);
  const hasSeedData = Object.values(seedDetails).some(v => v !== '');

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={isEdit ? 'Edit Product' : 'New Product'}
        description={isEdit ? form.name : 'Create a new product in your catalog'}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Button>
            {!form.sku && (
              <Button variant="outline" size="sm" onClick={() => { const s = generateSkuSuggestion(); update('sku', s); toast({ title: `SKU suggested: ${s}` }); }}>
                <Wand2 className="mr-2 h-4 w-4" />Generate SKU
              </Button>
            )}
            <Badge variant={form.status === 'published' ? 'default' : 'outline'} className="capitalize hidden sm:flex">
              {form.status}
            </Badge>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />{saving ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border rounded-lg bg-card p-1.5 overflow-x-auto">
          <TabsList className="flex h-auto gap-0.5 bg-transparent w-full">
            {TAB_CONFIG.map(tab => {
              const Icon = tab.icon;
              const hasDot = (tab.value === 'classification' && hasClassification) ||
                (tab.value === 'pricing' && hasPricing) ||
                (tab.value === 'shipping' && hasShipping) ||
                (tab.value === 'seed' && hasSeedData);
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative flex-1 min-w-0 px-2"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  {hasDot && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary data-[state=active]:bg-primary-foreground" />}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="general">
          <GeneralTab form={form} update={update} />
        </TabsContent>
        <TabsContent value="classification">
          <ClassificationTab
            form={form} update={update}
            categories={categories} subcategories={subcategories}
            suppliers={suppliers} collections={collections}
            selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}
            depots={depots} organizations={organizations}
          />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingTab form={form} update={update} />
        </TabsContent>
        <TabsContent value="packing">
          <PackSizesTab packSizes={packSizes} />
        </TabsContent>
        <TabsContent value="variants">
          {isEdit && id ? (
            <ProductVariantManager productId={id} currencyCode={form.currency_code} packSizes={packSizes} depots={depots} />
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center bg-card">
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
        <TabsContent value="seed">
          <SeedDetailsTab seedDetails={seedDetails} setSeedDetails={setSeedDetails} isEdit={isEdit} />
        </TabsContent>
        <TabsContent value="attributes">
          <AttributesTab form={form} setForm={setForm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
