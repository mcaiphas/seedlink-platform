import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Pencil, Copy, Archive, Package, Truck, Warehouse, Sprout, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<any[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [seedDetails, setSeedDetails] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('products').select('*, product_categories!products_category_id_fkey(name), product_subcategories(name), suppliers!fk_products_supplier(supplier_name), depots!products_depot_id_fkey(name)').eq('id', id).single(),
      supabase.from('product_variants').select('*, product_pack_sizes(name)').eq('product_id', id).order('created_at'),
      supabase.from('product_collection_items').select('product_collections(name)').eq('product_id', id),
      supabase.from('seed_product_details').select('*').eq('product_id', id).maybeSingle(),
    ]).then(([pRes, vRes, cRes, sRes]) => {
      setProduct(pRes.data);
      setVariants(vRes.data || []);
      setCollections((cRes.data || []).map((c: any) => (c.product_collections as any)?.name).filter(Boolean));
      setSeedDetails(sRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleDuplicate = async () => {
    if (!product) return;
    const { id: _, created_at, updated_at, product_categories: _pc, product_subcategories: _s, suppliers: _sup, depots: _d, ...rest } = product;
    const { data, error } = await supabase.from('products').insert({ ...rest, name: `${rest.name} (Copy)`, sku: rest.sku ? `${rest.sku}-COPY` : null, status: 'draft' } as any).select('id').single();
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Product duplicated' }); navigate(`/products/${data.id}`); }
  };

  const handleArchive = async () => {
    if (!id) return;
    const { error } = await supabase.from('products').update({ status: 'archived', is_active: false } as any).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Product archived' }); navigate('/products'); }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full rounded-lg" /></div>;
  if (!product) return <div className="text-center py-20 text-muted-foreground">Product not found</div>;

  const margin = product.default_margin_percent != null ? Number(product.default_margin_percent).toFixed(1)
    : (product.default_buying_price && product.default_selling_price && product.default_buying_price > 0)
      ? (((product.default_selling_price - product.default_buying_price) / product.default_buying_price) * 100).toFixed(1)
      : null;

  const Field = ({ label, value, mono }: { label: string; value: any; mono?: boolean }) => (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={product.name}
        description={product.brand ? `by ${product.brand}` : undefined}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/products')}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate}><Copy className="mr-1 h-4 w-4" />Duplicate</Button>
            <Button variant="outline" size="sm" onClick={handleArchive} className="text-destructive"><Archive className="mr-1 h-4 w-4" />Archive</Button>
            <Button size="sm" asChild><Link to={`/products/${id}/edit`}><Pencil className="mr-1 h-4 w-4" />Edit</Link></Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2 mb-2">
        <Badge variant={product.status === 'published' ? 'default' : product.status === 'archived' ? 'outline' : 'secondary'}>{product.status}</Badge>
        <Badge variant={product.is_active ? 'default' : 'secondary'}>{product.is_active ? 'Active' : 'Inactive'}</Badge>
        <Badge variant="outline">{product.product_type}</Badge>
        {product.sku_base && <Badge variant="outline" className="font-mono">Base: {product.sku_base}</Badge>}
        {product.sku && <Badge variant="outline" className="font-mono">{product.sku}</Badge>}
      </div>

      {product.image_url && (
        <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted border">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><DollarSign className="h-4 w-4" />Pricing</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Buying Price" value={product.default_buying_price != null ? `${product.currency_code} ${Number(product.default_buying_price).toFixed(2)}` : null} />
            <Field label="Selling Price" value={product.default_selling_price != null ? `${product.currency_code} ${Number(product.default_selling_price).toFixed(2)}` : null} />
            <Field label="Margin %" value={margin ? `${margin}%` : null} />
            <Field label="Compare-at Price" value={product.compare_at_price != null ? `${product.currency_code} ${Number(product.compare_at_price).toFixed(2)}` : null} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Tag className="h-4 w-4" />Classification</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Category" value={(product.product_categories as any)?.name || product.category} />
            <Field label="Subcategory" value={(product.product_subcategories as any)?.name} />
            <Field label="Supplier" value={(product.suppliers as any)?.supplier_name} />
            <Field label="Depot" value={(product.depots as any)?.name} />
            <Field label="Base UOM" value={product.base_uom} />
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Collections</p>
              {collections.length > 0
                ? <div className="flex flex-wrap gap-1">{collections.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                : <p className="text-sm text-muted-foreground">—</p>
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Warehouse className="h-4 w-4" />Inventory & Shipping</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Stock" value={product.stock_quantity} />
            <Field label="Track Inventory" value={product.track_inventory ? 'Yes' : 'No'} />
            <Field label="Weight (kg)" value={product.shipping_weight_kg} />
            <Field label="Dimensions" value={product.length_cm ? `${product.length_cm}×${product.width_cm}×${product.height_cm} cm` : null} />
            <Field label="Requires Shipping" value={product.requires_shipping ? 'Yes' : 'No'} />
            <Field label="Allow Backorder" value={product.allow_backorder ? 'Yes' : 'No'} />
          </CardContent>
        </Card>
      </div>

      {product.description && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            {product.short_description && <p className="text-sm font-medium mb-2">{product.short_description}</p>}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </CardContent>
        </Card>
      )}

      {seedDetails && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Sprout className="h-4 w-4 text-primary" />Seed Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Crop" value={seedDetails.crop_name} />
              <Field label="Variety" value={seedDetails.variety_name} />
              <Field label="Hybrid" value={seedDetails.hybrid_name} />
              <Field label="Maturity" value={seedDetails.maturity_classification} />
              <Field label="Maturity Days" value={seedDetails.maturity_days} />
              <Field label="Seed Class" value={seedDetails.seed_class} />
              <Field label="Treatment" value={seedDetails.treatment_name} />
              <Field label="Germination %" value={seedDetails.germination_percent != null ? `${seedDetails.germination_percent}%` : null} />
              <Field label="Purity %" value={seedDetails.purity_percent != null ? `${seedDetails.purity_percent}%` : null} />
              <Field label="TKW (g)" value={seedDetails.thousand_kernel_weight_g} />
              <Field label="Seeds/kg" value={seedDetails.seeds_per_kg?.toLocaleString()} />
            </div>
            {seedDetails.notes && <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">{seedDetails.notes}</p>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4" />Variants ({variants.length})</CardTitle>
          <Button size="sm" variant="outline" asChild><Link to={`/products/${id}/edit`}>Manage Variants</Link></Button>
        </CardHeader>
        <CardContent>
          {variants.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No variants defined</p>
          ) : (
            <div className="space-y-2">
              {variants.map(v => (
                <div key={v.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{v.variant_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{v.sku}</p>
                    {(v.product_pack_sizes as any)?.name && <Badge variant="outline" className="text-xs mt-1">{(v.product_pack_sizes as any).name}</Badge>}
                  </div>
                  <div className="text-sm tabular-nums">
                    {v.selling_price != null ? `${product.currency_code} ${Number(v.selling_price).toFixed(2)}` : '—'}
                  </div>
                  <div className="text-sm tabular-nums">
                    {v.margin_percent != null ? <span className={Number(v.margin_percent) < 10 ? 'text-destructive' : 'text-primary'}>{Number(v.margin_percent).toFixed(1)}%</span> : '—'}
                  </div>
                  <Badge variant={v.is_active ? 'default' : 'secondary'} className="text-xs capitalize">{v.variant_status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
