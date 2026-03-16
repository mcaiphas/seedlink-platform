import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
}

export function PricingTab({ form, update }: Props) {
  const margin = useMemo(() => {
    const buy = parseFloat(form.buying_price);
    const sell = parseFloat(form.price);
    if (!isNaN(buy) && !isNaN(sell) && sell > 0) return (((sell - buy) / sell) * 100).toFixed(1);
    return null;
  }, [form.buying_price, form.price]);

  const marginNum = margin ? Number(margin) : null;
  const MarginIcon = marginNum === null ? Minus : marginNum >= 20 ? TrendingUp : marginNum >= 10 ? Minus : TrendingDown;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>Set buying price, selling price, and margin. Margin auto-calculates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Buying Price ({form.currency_code})</Label>
            <Input type="number" step="0.01" min="0" value={form.buying_price} onChange={e => update('buying_price', e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Selling Price ({form.currency_code}) <span className="text-destructive">*</span></Label>
            <Input type="number" step="0.01" min="0" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Margin %</Label>
            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/50 font-medium tabular-nums">
              <MarginIcon className={`h-4 w-4 ${marginNum === null ? 'text-muted-foreground' : marginNum < 10 ? 'text-destructive' : marginNum >= 20 ? 'text-primary' : 'text-amber-500'}`} />
              {margin ? (
                <span className={marginNum! < 10 ? 'text-destructive' : marginNum! >= 20 ? 'text-primary' : 'text-amber-500'}>{margin}%</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Compare-at Price ({form.currency_code})</Label>
            <Input type="number" step="0.01" min="0" value={form.compare_at_price} onChange={e => update('compare_at_price', e.target.value)} placeholder="Promotional / original price" />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select value={form.currency_code} onValueChange={v => update('currency_code', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ZAR">ZAR – South African Rand</SelectItem>
                <SelectItem value="USD">USD – US Dollar</SelectItem>
                <SelectItem value="EUR">EUR – Euro</SelectItem>
                <SelectItem value="GBP">GBP – British Pound</SelectItem>
                <SelectItem value="KES">KES – Kenyan Shilling</SelectItem>
                <SelectItem value="NGN">NGN – Nigerian Naira</SelectItem>
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
        </div>

        {marginNum !== null && marginNum < 5 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-center gap-2">
            <TrendingDown className="h-4 w-4 shrink-0" />
            <span>Low margin warning: {margin}% margin may not cover operational costs.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
