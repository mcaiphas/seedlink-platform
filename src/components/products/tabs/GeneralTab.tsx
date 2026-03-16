import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
}

export function GeneralTab({ form, update }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle>Basic Product Information</CardTitle></CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
          <Input id="name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Pioneer P3456 Maize Seed" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku_base">SKU Base</Label>
          <Input id="sku_base" value={form.sku_base} onChange={e => update('sku_base', e.target.value)} placeholder="e.g. SD-MZ-PAN5P" className="font-mono" />
          <p className="text-xs text-muted-foreground">Base SKU for variant generation (e.g. SD-MZ-PAN5P)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU / Full Code</Label>
          <Input id="sku" value={form.sku} onChange={e => update('sku', e.target.value)} placeholder="e.g. SD-MZ-PAN5P952PW-60K" className="font-mono" />
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
        <div className="flex items-center justify-between sm:col-span-2 p-4 rounded-lg border bg-muted/30">
          <div>
            <Label>Variant Product</Label>
            <p className="text-xs text-muted-foreground">This product has variants (pack sizes, treatments, etc.)</p>
          </div>
          <Switch checked={form.is_variant_product} onCheckedChange={v => update('is_variant_product', v)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="short_desc">Short Description</Label>
          <Textarea id="short_desc" value={form.short_description || ''} onChange={e => update('short_description', e.target.value)} rows={2} placeholder="Brief summary for listings..." />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="Full product description..." />
        </div>
      </CardContent>
    </Card>
  );
}
