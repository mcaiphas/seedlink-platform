import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertTriangle } from 'lucide-react';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
}

export function PricingTab({ form, update }: Props) {
  const margin = useMemo(() => {
    const buy = parseFloat(form.default_buying_price);
    const sell = parseFloat(form.default_selling_price);
    if (!isNaN(buy) && !isNaN(sell) && buy > 0) return (((sell - buy) / buy) * 100).toFixed(1);
    return null;
  }, [form.default_buying_price, form.default_selling_price]);

  const marginNum = margin ? Number(margin) : null;
  const MarginIcon = marginNum === null ? Minus : marginNum >= 20 ? TrendingUp : marginNum >= 10 ? Minus : TrendingDown;

  const profit = useMemo(() => {
    const buy = parseFloat(form.default_buying_price);
    const sell = parseFloat(form.default_selling_price);
    if (!isNaN(buy) && !isNaN(sell)) return (sell - buy).toFixed(2);
    return null;
  }, [form.default_buying_price, form.default_selling_price]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />Pricing</CardTitle>
          <CardDescription>Set cost, selling price, and margin. Margin auto-calculates from cost markup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Inputs */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Buying Price ({form.currency_code})</Label>
              <Input type="number" step="0.01" min="0" value={form.default_buying_price} onChange={e => update('default_buying_price', e.target.value)} placeholder="0.00" className="tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label>Selling Price ({form.currency_code})</Label>
              <Input type="number" step="0.01" min="0" value={form.default_selling_price} onChange={e => update('default_selling_price', e.target.value)} placeholder="0.00" className="tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label>Compare-at Price ({form.currency_code})</Label>
              <Input type="number" step="0.01" min="0" value={form.compare_at_price} onChange={e => update('compare_at_price', e.target.value)} placeholder="Original / promo price" className="tabular-nums" />
            </div>
          </div>

          {/* Margin Summary Cards */}
          {(marginNum !== null || profit !== null) && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className={`p-4 rounded-lg border text-center ${marginNum !== null && marginNum < 10 ? 'border-destructive/30 bg-destructive/5' : 'bg-muted/30'}`}>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Margin</p>
                <div className="flex items-center justify-center gap-1.5">
                  <MarginIcon className={`h-5 w-5 ${marginNum === null ? 'text-muted-foreground' : marginNum < 10 ? 'text-destructive' : marginNum >= 20 ? 'text-primary' : 'text-accent'}`} />
                  <span className={`text-2xl font-bold tabular-nums ${marginNum === null ? 'text-muted-foreground' : marginNum < 10 ? 'text-destructive' : marginNum >= 20 ? 'text-primary' : 'text-accent-foreground'}`}>
                    {margin ? `${margin}%` : '—'}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 text-center">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Profit</p>
                <p className={`text-2xl font-bold tabular-nums ${profit && Number(profit) < 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {profit ? `${form.currency_code} ${profit}` : '—'}
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 text-center">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Sell Price</p>
                <p className="text-2xl font-bold tabular-nums text-primary">
                  {form.default_selling_price ? `${form.currency_code} ${Number(form.default_selling_price).toFixed(2)}` : '—'}
                </p>
              </div>
            </div>
          )}

          {marginNum !== null && marginNum < 5 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Low margin warning: {margin}% may not cover operational costs.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Currency & Unit of Measure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
