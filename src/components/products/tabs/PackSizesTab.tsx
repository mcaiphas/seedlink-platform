import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Box, GripVertical, AlertTriangle } from 'lucide-react';

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

interface PackSizeForm {
  pack_label: string;
  pack_code: string;
  pack_type: string;
  quantity_value: string;
  quantity_uom: string;
  seed_count: string;
  estimated_weight_kg: string;
  conversion_factor: string;
  conversion_unit: string;
  shipping_weight_kg: string;
  is_default: boolean;
}

const emptyPackForm: PackSizeForm = {
  pack_label: '', pack_code: '', pack_type: 'weight', quantity_value: '',
  quantity_uom: 'kg', seed_count: '', estimated_weight_kg: '', conversion_factor: '',
  conversion_unit: 'seeds_per_kg', shipping_weight_kg: '', is_default: false,
};

interface Props {
  productId: string | undefined;
  isEdit: boolean;
  packSizes: any[];
  setPackSizes: React.Dispatch<React.SetStateAction<any[]>>;
}

export function PackSizesTab({ productId, isEdit, packSizes, setPackSizes }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<PackSizeForm>(emptyPackForm);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!form.pack_label.trim()) errors.push('Pack label is required');
    if (!form.quantity_value || Number(form.quantity_value) <= 0) errors.push('Quantity must be greater than 0');
    if (form.pack_type === 'count') {
      if (!form.seed_count || Number(form.seed_count) <= 0) errors.push('Seed count is required for count-based packs');
      if (form.conversion_factor && Number(form.conversion_factor) <= 0) errors.push('Conversion factor must be positive');
    }
    if (form.shipping_weight_kg && Number(form.shipping_weight_kg) < 0) errors.push('Shipping weight cannot be negative');
    return errors;
  };

  const addPreset = async (preset: typeof PACK_SIZE_PRESETS[0]) => {
    if (!productId) { toast({ title: 'Save the product first', variant: 'destructive' }); return; }
    const { error } = await supabase.from('product_pack_sizes').insert({
      product_id: productId,
      pack_code: preset.label.replace(/\s/g, '_').toLowerCase(),
      pack_label: preset.label,
      pack_type: preset.type,
      quantity_value: preset.quantity,
      quantity_uom: preset.uom,
      seed_count: preset.type === 'count' ? preset.quantity : null,
      shipping_weight_kg: preset.uom === 'kg' ? preset.quantity : preset.uom === 'g' ? preset.quantity / 1000 : 0,
      is_default: packSizes.length === 0,
    } as any);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      const { data } = await supabase.from('product_pack_sizes').select('*').eq('product_id', productId).order('created_at');
      setPackSizes(data || []);
      toast({ title: `${preset.label} pack size added` });
    }
  };

  const handleSaveCustom = async () => {
    const errors = validate();
    setValidationErrors(errors);
    if (errors.length > 0) return;
    if (!productId) return;

    setSaving(true);
    const code = form.pack_code || form.pack_label.replace(/\s+/g, '_').toLowerCase();
    const { error } = await supabase.from('product_pack_sizes').insert({
      product_id: productId,
      pack_code: code,
      pack_label: form.pack_label.trim(),
      pack_type: form.pack_type,
      quantity_value: Number(form.quantity_value),
      quantity_uom: form.quantity_uom,
      seed_count: form.seed_count ? Number(form.seed_count) : null,
      shipping_weight_kg: form.shipping_weight_kg ? Number(form.shipping_weight_kg) : 0,
      is_default: form.is_default,
      metadata: {
        estimated_weight_kg: form.estimated_weight_kg ? Number(form.estimated_weight_kg) : null,
        conversion_factor: form.conversion_factor ? Number(form.conversion_factor) : null,
        conversion_unit: form.conversion_unit || null,
      },
    } as any);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      const { data } = await supabase.from('product_pack_sizes').select('*').eq('product_id', productId).order('created_at');
      setPackSizes(data || []);
      toast({ title: 'Custom pack size added' });
      setDialogOpen(false);
      setForm(emptyPackForm);
    }
    setSaving(false);
  };

  const removePackSize = async (psId: string) => {
    await supabase.from('product_pack_sizes').delete().eq('id', psId);
    setPackSizes(ps => ps.filter(p => p.id !== psId));
    toast({ title: 'Pack size removed' });
  };

  if (!isEdit) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Box className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Save the product first</p>
          <p className="text-xs text-muted-foreground mt-1">Pack sizes can be added after the product is created.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pack Sizes</CardTitle>
              <CardDescription>Define packaging options. K = 1,000 seeds. Seed packs support count-to-weight conversion.</CardDescription>
            </div>
            <Button size="sm" onClick={() => { setForm(emptyPackForm); setValidationErrors([]); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />Custom Pack
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Quick Add Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {PACK_SIZE_PRESETS.map(p => (
                <Button key={p.label} variant="outline" size="sm" className="text-xs h-7"
                  onClick={() => addPreset(p)} disabled={packSizes.some(ps => ps.pack_label === p.label)}>
                  {p.type === 'count' && <span className="mr-1 text-primary font-semibold">K</span>}
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
              <p className="text-xs text-muted-foreground mt-1">Use presets above or create a custom pack size</p>
            </div>
          ) : (
            <div className="space-y-2">
              {packSizes.map(ps => (
                <div key={ps.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-6 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Label</span>
                      <span className="font-medium">{ps.pack_label}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Type</span>
                      <Badge variant={ps.pack_type === 'count' ? 'default' : 'secondary'} className="capitalize text-xs">{ps.pack_type}</Badge>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Qty</span>
                      <span className="tabular-nums">{ps.quantity_value?.toLocaleString()} {ps.quantity_uom}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Seeds</span>
                      <span className="tabular-nums">{ps.seed_count?.toLocaleString() ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Ship Weight</span>
                      <span className="tabular-nums">{ps.shipping_weight_kg ?? '—'} kg</span>
                    </div>
                    <div>
                      {ps.is_default && <Badge variant="outline" className="text-xs">Default</Badge>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removePackSize(ps.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Custom Pack Size</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            {validationErrors.length > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
                {validationErrors.map((e, i) => (
                  <p key={i} className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 shrink-0" />{e}
                  </p>
                ))}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Pack Label <span className="text-destructive">*</span></Label>
                <Input value={form.pack_label} onChange={e => setForm(f => ({ ...f, pack_label: e.target.value }))} placeholder="e.g. 200g Sachet" />
              </div>
              <div className="space-y-2">
                <Label>Pack Code</Label>
                <Input value={form.pack_code} onChange={e => setForm(f => ({ ...f, pack_code: e.target.value }))} placeholder="Auto-generated" className="font-mono" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Pack Type</Label>
                <Select value={form.pack_type} onValueChange={v => setForm(f => ({ ...f, pack_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight-based</SelectItem>
                    <SelectItem value="count">Count-based (seeds)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" value={form.quantity_value} onChange={e => setForm(f => ({ ...f, quantity_value: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>UOM</Label>
                <Select value={form.quantity_uom} onValueChange={v => setForm(f => ({ ...f, quantity_uom: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="seeds">Seeds</SelectItem>
                    <SelectItem value="l">Litres (L)</SelectItem>
                    <SelectItem value="ml">Millilitres (mL)</SelectItem>
                    <SelectItem value="unit">Unit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.pack_type === 'count' && (
              <>
                <Separator />
                <p className="text-xs font-medium text-primary">Seed Count-to-Weight Conversion</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Seed Count <span className="text-destructive">*</span></Label>
                    <Input type="number" min="0" value={form.seed_count} onChange={e => setForm(f => ({ ...f, seed_count: e.target.value }))} placeholder="e.g. 60000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Pack Weight (kg)</Label>
                    <Input type="number" step="0.01" min="0" value={form.estimated_weight_kg} onChange={e => setForm(f => ({ ...f, estimated_weight_kg: e.target.value }))} placeholder="e.g. 25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Conversion Factor</Label>
                    <Input type="number" step="0.01" min="0" value={form.conversion_factor} onChange={e => setForm(f => ({ ...f, conversion_factor: e.target.value }))} placeholder="e.g. 2400" />
                  </div>
                  <div className="space-y-2">
                    <Label>Conversion Unit</Label>
                    <Select value={form.conversion_unit} onValueChange={v => setForm(f => ({ ...f, conversion_unit: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seeds_per_kg">Seeds per kg</SelectItem>
                        <SelectItem value="seeds_per_g">Seeds per gram</SelectItem>
                        <SelectItem value="kg_per_1000_seeds">kg per 1,000 seeds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {form.seed_count && form.conversion_factor && (
                  <div className="rounded-lg bg-muted/50 border p-3 text-sm">
                    <p className="font-medium text-primary">Calculated Weight</p>
                    <p className="text-muted-foreground">
                      {form.conversion_unit === 'seeds_per_kg'
                        ? `${(Number(form.seed_count) / Number(form.conversion_factor)).toFixed(2)} kg`
                        : form.conversion_unit === 'seeds_per_g'
                        ? `${(Number(form.seed_count) / Number(form.conversion_factor) / 1000).toFixed(2)} kg`
                        : `${(Number(form.seed_count) / 1000 * Number(form.conversion_factor)).toFixed(2)} kg`
                      }
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label>Shipping Weight (kg)</Label>
              <Input type="number" step="0.01" min="0" value={form.shipping_weight_kg} onChange={e => setForm(f => ({ ...f, shipping_weight_kg: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCustom} disabled={saving}>{saving ? 'Saving...' : 'Add Pack Size'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
