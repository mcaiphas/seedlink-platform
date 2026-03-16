import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sprout, Leaf } from 'lucide-react';

interface SeedDetailsData {
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

interface Props {
  seedDetails: SeedDetailsData;
  setSeedDetails: React.Dispatch<React.SetStateAction<SeedDetailsData>>;
  isEdit: boolean;
}

const MATURITY_OPTIONS = ['Ultra Early', 'Early', 'Medium', 'Late'];
const SEED_CLASS_OPTIONS = ['Breeder', 'Pre-Basic', 'Basic', 'Certified', 'Quality Declared', 'Standard'];

export function SeedDetailsTab({ seedDetails, setSeedDetails, isEdit }: Props) {
  const update = (key: keyof SeedDetailsData, value: string) => {
    setSeedDetails(prev => ({ ...prev, [key]: value }));
  };

  const validatePct = (key: keyof SeedDetailsData, value: string) => {
    if (value === '') { update(key, ''); return; }
    const num = Number(value);
    if (!isNaN(num) && num >= 0 && num <= 100) update(key, value);
  };

  const seedsPerKg = Number(seedDetails.seeds_per_kg) || 0;
  const tkw = Number(seedDetails.thousand_kernel_weight_g) || 0;
  const calculatedSeedsPerKg = tkw > 0 ? Math.round(1000000 / tkw) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-primary" />
          Seed Product Details
        </CardTitle>
        <CardDescription>
          Seed-specific classification and quality data from the <code className="text-xs bg-muted px-1 rounded">seed_product_details</code> table.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Crop & Variety */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Leaf className="h-3 w-3" /> Crop Identification
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Crop Name</Label>
              <Input value={seedDetails.crop_name} onChange={e => update('crop_name', e.target.value)} placeholder="e.g. Maize, Soybean, Sunflower" />
            </div>
            <div className="space-y-2">
              <Label>Variety Name</Label>
              <Input value={seedDetails.variety_name} onChange={e => update('variety_name', e.target.value)} placeholder="e.g. PAN 5R-591R" />
            </div>
            <div className="space-y-2">
              <Label>Hybrid Name</Label>
              <Input value={seedDetails.hybrid_name} onChange={e => update('hybrid_name', e.target.value)} placeholder="e.g. DKC 73-74" />
            </div>
          </div>
        </div>

        {/* Maturity */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Maturity & Classification</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Maturity Classification</Label>
              <Select value={seedDetails.maturity_classification || '__none'} onValueChange={v => update('maturity_classification', v === '__none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select maturity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Not specified</SelectItem>
                  {MATURITY_OPTIONS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Maturity Days</Label>
              <Input type="number" min="0" max="365" value={seedDetails.maturity_days} onChange={e => update('maturity_days', e.target.value)} placeholder="e.g. 120" />
            </div>
            <div className="space-y-2">
              <Label>Seed Class</Label>
              <Select value={seedDetails.seed_class || '__none'} onValueChange={v => update('seed_class', v === '__none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Not specified</SelectItem>
                  {SEED_CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quality */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Quality & Treatment</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Germination %</Label>
              <Input type="number" min="0" max="100" step="0.1" value={seedDetails.germination_percent} onChange={e => validatePct('germination_percent', e.target.value)} placeholder="e.g. 95" />
            </div>
            <div className="space-y-2">
              <Label>Purity %</Label>
              <Input type="number" min="0" max="100" step="0.1" value={seedDetails.purity_percent} onChange={e => validatePct('purity_percent', e.target.value)} placeholder="e.g. 99.5" />
            </div>
            <div className="space-y-2">
              <Label>Treatment</Label>
              <Input value={seedDetails.treatment_name} onChange={e => update('treatment_name', e.target.value)} placeholder="e.g. Thiram + Metalaxyl" />
            </div>
            <div className="space-y-2">
              <Label>1000 Kernel Weight (g)</Label>
              <Input type="number" min="0" step="0.1" value={seedDetails.thousand_kernel_weight_g} onChange={e => update('thousand_kernel_weight_g', e.target.value)} placeholder="e.g. 350" />
            </div>
          </div>
        </div>

        {/* Seed count & conversion */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Count & Conversion</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Seeds per kg</Label>
              <Input type="number" min="0" value={seedDetails.seeds_per_kg} onChange={e => update('seeds_per_kg', e.target.value)} placeholder="e.g. 2857" />
            </div>
            {calculatedSeedsPerKg && !seedDetails.seeds_per_kg && (
              <div className="flex items-end">
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm w-full">
                  <p className="text-xs text-muted-foreground">Calculated from TKW</p>
                  <p className="font-medium text-primary">≈ {calculatedSeedsPerKg.toLocaleString()} seeds/kg</p>
                </div>
              </div>
            )}
          </div>

          {seedsPerKg > 0 && (
            <div className="mt-3 rounded-lg bg-muted/50 border p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Pack Size Conversions (K = 1,000 seeds)</p>
              <div className="flex flex-wrap gap-2">
                {[60, 80, 140, 150, 180].map(k => {
                  const count = k * 1000;
                  const weightKg = count / seedsPerKg;
                  return (
                    <Badge key={k} variant="outline" className="text-xs tabular-nums">
                      {k}K = {weightKg.toFixed(1)} kg
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea value={seedDetails.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Additional seed-specific notes..." />
        </div>
      </CardContent>
    </Card>
  );
}
