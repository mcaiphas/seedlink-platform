import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, AlertTriangle, Scale } from 'lucide-react';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
}

export function ShippingTab({ form, update }: Props) {
  const volumetricWeight = useMemo(() => {
    const l = Number(form.length_cm);
    const w = Number(form.width_cm);
    const h = Number(form.height_cm);
    if (l > 0 && w > 0 && h > 0) return (l * w * h) / 5000;
    return null;
  }, [form.length_cm, form.width_cm, form.height_cm]);

  const actualWeight = Number(form.shipping_weight_kg) || 0;
  const chargeableWeight = volumetricWeight ? Math.max(actualWeight, volumetricWeight) : actualWeight;

  const isDangerousGoods = form.metadata?.dangerous_goods || false;
  const isStackable = form.metadata?.stackable ?? true;
  const isBulkItem = form.metadata?.bulk_item || false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Shipping & Dimensions
          </CardTitle>
          <CardDescription>Dimensions for Drovvi shipping integration. All fields optional but recommended for accurate quoting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Shipping Weight (kg)</Label>
              <Input type="number" step="0.01" min="0" value={form.shipping_weight_kg} onChange={e => update('shipping_weight_kg', e.target.value)} placeholder="0.00" className="tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label>Length (cm)</Label>
              <Input type="number" step="0.1" min="0" value={form.length_cm} onChange={e => update('length_cm', e.target.value)} placeholder="0" className="tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label>Width (cm)</Label>
              <Input type="number" step="0.1" min="0" value={form.width_cm} onChange={e => update('width_cm', e.target.value)} placeholder="0" className="tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" step="0.1" min="0" value={form.height_cm} onChange={e => update('height_cm', e.target.value)} placeholder="0" className="tabular-nums" />
            </div>
          </div>

          {(volumetricWeight !== null || actualWeight > 0) && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/30 border text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Actual Weight</p>
                <p className="text-xl font-bold tabular-nums">{actualWeight.toFixed(2)} kg</p>
              </div>
              {volumetricWeight !== null && (
                <div className="p-4 rounded-lg bg-muted/30 border text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Volumetric</p>
                  <p className="text-xl font-bold tabular-nums">{volumetricWeight.toFixed(2)} kg</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">L×W×H ÷ 5000</p>
                </div>
              )}
              <div className="p-4 rounded-lg border text-center bg-primary/5 border-primary/20">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Chargeable</p>
                <div className="flex items-center justify-center gap-1.5">
                  <Scale className="h-4 w-4 text-primary" />
                  <p className="text-xl font-bold text-primary tabular-nums">{chargeableWeight.toFixed(2)} kg</p>
                </div>
                {volumetricWeight !== null && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {volumetricWeight > actualWeight ? 'Volumetric' : 'Actual'}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Handling & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
              <div><Label className="text-sm">Requires Shipping</Label><p className="text-[11px] text-muted-foreground">Needs physical delivery</p></div>
              <Switch checked={form.requires_shipping} onCheckedChange={v => update('requires_shipping', v)} />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
              <div><Label className="text-sm">Stackable</Label><p className="text-[11px] text-muted-foreground">Can be stacked during transport</p></div>
              <Switch checked={isStackable} onCheckedChange={v => update('metadata', { ...form.metadata, stackable: v })} />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
              <div><Label className="text-sm">Bulk Item</Label><p className="text-[11px] text-muted-foreground">Requires special handling</p></div>
              <Switch checked={isBulkItem} onCheckedChange={v => update('metadata', { ...form.metadata, bulk_item: v })} />
            </div>
            <div className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${isDangerousGoods ? 'border-destructive/30 bg-destructive/5' : 'bg-muted/20 hover:bg-muted/40'}`}>
              <div>
                <Label className="text-sm flex items-center gap-1.5">
                  {isDangerousGoods && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                  Dangerous Goods
                </Label>
                <p className="text-[11px] text-muted-foreground">Special handling & documentation</p>
              </div>
              <Switch checked={isDangerousGoods} onCheckedChange={v => update('metadata', { ...form.metadata, dangerous_goods: v })} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
