import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Sprout, MapPin, Mountain, Tractor, Zap, Package, FileText,
  ShoppingCart, AlertTriangle, CheckCircle, Info,
} from 'lucide-react';

const CROPS = ['maize', 'soybean', 'sunflower', 'sorghum', 'dry_beans', 'vegetables'];
const CATEGORY_LABELS: Record<string, string> = {
  seed: 'Seed / Hybrid', basal_fertilizer: 'Basal Fertilizer', top_dressing: 'Top Dressing',
  herbicide: 'Herbicide', fungicide: 'Fungicide', insecticide: 'Insecticide',
  adjuvant: 'Adjuvant', inoculant: 'Inoculant', seed_treatment: 'Seed Treatment',
  lime: 'Lime / Soil Amendment', other: 'Other',
};
const CATEGORY_ORDER = ['seed', 'basal_fertilizer', 'top_dressing', 'lime', 'herbicide', 'fungicide', 'insecticide', 'adjuvant', 'inoculant', 'seed_treatment', 'other'];

interface RecommendationItem {
  product_category: string;
  product_name: string;
  rationale: string;
  application_rate_per_ha: number | null;
  application_rate_unit: string;
  total_quantity: number | null;
  packs_needed: number | null;
  product_id: string | null;
}

export default function RecommendationEngine() {
  const { user } = useAuth();
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [regions, setRegions] = useState<any[]>([]);
  const [soils, setSoils] = useState<any[]>([]);
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationItem[]>([]);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    crop: '', area_ha: '', province: '', region_profile_id: '',
    soil_profile_id: '', farming_system_id: '', irrigation_type: '',
    production_scale: '', production_goal: '', planting_window: '', yield_target: '',
  });

  useEffect(() => {
    Promise.all([
      supabase.from('agro_region_profiles').select('*').eq('is_active', true).order('province'),
      supabase.from('agro_soil_profiles').select('*').eq('is_active', true).order('profile_name'),
      supabase.from('agro_farming_systems').select('*').eq('is_active', true).order('system_name'),
    ]).then(([r, s, f]) => {
      setRegions((r.data as any[]) || []);
      setSoils((s.data as any[]) || []);
      setSystems((f.data as any[]) || []);
    });
  }, []);

  const generateRecommendation = async () => {
    if (!form.crop) { toast.error('Please select a crop'); return; }
    setLoading(true);
    const assumptionsList: string[] = [];

    // Build query for matching advisory rules
    let query = supabase.from('agro_advisory_rules').select('*').eq('crop', form.crop).eq('is_active', true);
    if (form.region_profile_id) {
      query = query.or(`region_profile_id.eq.${form.region_profile_id},region_profile_id.is.null`);
    }
    if (form.soil_profile_id) {
      query = query.or(`soil_profile_id.eq.${form.soil_profile_id},soil_profile_id.is.null`);
    }
    if (form.farming_system_id) {
      query = query.or(`farming_system_id.eq.${form.farming_system_id},farming_system_id.is.null`);
    }

    const { data: rules } = await query.order('priority', { ascending: false });
    const matchedRules = (rules as any[]) || [];

    if (!form.region_profile_id) assumptionsList.push('No specific region selected — generic recommendations applied');
    if (!form.soil_profile_id) assumptionsList.push('Soil type not specified — standard program assumed');
    if (!form.area_ha) assumptionsList.push('No area specified — quantities shown per hectare');
    if (form.irrigation_type === 'dryland' || !form.irrigation_type) assumptionsList.push('Dryland production context assumed');

    const area = parseFloat(form.area_ha) || 1;
    const items: RecommendationItem[] = [];

    // Group by category and pick best rule per category
    const categoryBest = new Map<string, any>();
    for (const rule of matchedRules) {
      const existing = categoryBest.get(rule.product_category);
      if (!existing || rule.priority > existing.priority) {
        categoryBest.set(rule.product_category, rule);
      }
    }

    // If no rules found, generate generic recommendations
    if (categoryBest.size === 0) {
      assumptionsList.push('No specific advisory rules configured for this scenario — showing generic program structure');
      const genericCategories = ['seed', 'basal_fertilizer', 'top_dressing', 'herbicide'];
      for (const cat of genericCategories) {
        items.push({
          product_category: cat,
          product_name: `${CATEGORY_LABELS[cat]} — configure advisory rules for specific products`,
          rationale: 'Generic recommendation — add advisory rules to specify products',
          application_rate_per_ha: null, application_rate_unit: '', total_quantity: null,
          packs_needed: null, product_id: null,
        });
      }
    } else {
      for (const cat of CATEGORY_ORDER) {
        const rule = categoryBest.get(cat);
        if (!rule) continue;

        // Try to fetch product name
        let productName = rule.rule_name;
        if (rule.product_id) {
          const { data: prod } = await supabase.from('products').select('name').eq('id', rule.product_id).single();
          if (prod) productName = prod.name;
        }

        const totalQty = rule.application_rate_per_ha ? rule.application_rate_per_ha * area : null;

        items.push({
          product_category: cat,
          product_name: productName,
          rationale: rule.rationale || `Recommended for ${form.crop} production`,
          application_rate_per_ha: rule.application_rate_per_ha,
          application_rate_unit: rule.application_rate_unit || '',
          total_quantity: totalQty,
          packs_needed: totalQty ? Math.ceil(totalQty) : null,
          product_id: rule.product_id,
        });
      }
    }

    setResults(items);
    setAssumptions(assumptionsList);
    setStep('results');
    setLoading(false);
  };

  const saveRecommendation = async () => {
    if (!user) return;
    const recNumber = `REC-${Date.now().toString().slice(-6)}`;
    const { data, error } = await supabase.from('agro_recommendations').insert({
      recommendation_number: recNumber,
      user_id: user.id,
      crop: form.crop,
      area_ha: form.area_ha ? parseFloat(form.area_ha) : null,
      province: form.province || null,
      region_profile_id: form.region_profile_id || null,
      soil_profile_id: form.soil_profile_id || null,
      farming_system_id: form.farming_system_id || null,
      irrigation_type: form.irrigation_type || null,
      production_scale: form.production_scale || null,
      production_goal: form.production_goal || null,
      planting_window: form.planting_window || null,
      yield_target: form.yield_target || null,
      assumptions: assumptions.join('; '),
      status: 'final',
    } as any).select('id').single();

    if (error) { toast.error(error.message); return; }
    if (data) {
      setSavedId((data as any).id);
      // Save items
      const items = results.filter(r => r.product_id).map((r, i) => ({
        recommendation_id: (data as any).id,
        product_category: r.product_category,
        product_id: r.product_id,
        product_name: r.product_name,
        rationale: r.rationale,
        application_rate_per_ha: r.application_rate_per_ha,
        application_rate_unit: r.application_rate_unit,
        total_quantity: r.total_quantity,
        packs_needed: r.packs_needed,
        sort_order: i,
      }));
      if (items.length > 0) {
        await supabase.from('agro_recommendation_items').insert(items as any[]);
      }
      toast.success(`Recommendation ${recNumber} saved`);
    }
  };

  const selectedRegion = regions.find(r => r.id === form.region_profile_id);
  const selectedSoil = soils.find(s => s.id === form.soil_profile_id);

  if (step === 'results') {
    return (
      <div className="space-y-6">
        <PageHeader title="Recommendation Results" description={`${form.crop.replace('_', ' ')} — ${form.area_ha || '1'} ha`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('input')}>Modify Inputs</Button>
              {!savedId && <Button onClick={saveRecommendation}><CheckCircle className="h-4 w-4 mr-1" />Save Recommendation</Button>}
              {savedId && <Badge variant="default" className="h-9 px-3 flex items-center">Saved ✓</Badge>}
            </div>
          }
        />

        {/* Assumptions */}
        {assumptions.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" />Assumptions</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                {assumptions.map((a, i) => <li key={i} className="flex items-start gap-2"><Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />{a}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Context Summary */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { icon: Sprout, label: 'Crop', value: form.crop.replace('_', ' ') },
            { icon: MapPin, label: 'Region', value: selectedRegion?.production_zone || 'Not specified' },
            { icon: Mountain, label: 'Soil', value: selectedSoil?.profile_name || 'Not specified' },
            { icon: Tractor, label: 'System', value: form.irrigation_type || 'Dryland' },
          ].map(c => (
            <Card key={c.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><c.icon className="h-4 w-4 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground">{c.label}</p><p className="text-sm font-medium capitalize">{c.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommended Products by Category */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Recommended Product Set</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {results.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg border bg-card">
                <Badge variant="outline" className="capitalize shrink-0 mt-0.5">{CATEGORY_LABELS[item.product_category] || item.product_category}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.rationale}</p>
                  {item.application_rate_per_ha && (
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-muted-foreground">Rate: <strong>{item.application_rate_per_ha} {item.application_rate_unit}/ha</strong></span>
                      {item.total_quantity && <span className="text-muted-foreground">Total: <strong>{item.total_quantity.toFixed(1)} {item.application_rate_unit}</strong></span>}
                      {item.packs_needed && <span className="text-muted-foreground">Packs: <strong>~{item.packs_needed}</strong></span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" />Convert to Quote</Button>
          <Button variant="outline" size="sm"><ShoppingCart className="h-4 w-4 mr-1" />Add to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Recommendation Engine" description="Generate intelligent product recommendations based on crop, region, soil and farming context" />

      <Tabs defaultValue="crop" className="space-y-4">
        <TabsList>
          <TabsTrigger value="crop"><Sprout className="h-3.5 w-3.5 mr-1" />Crop</TabsTrigger>
          <TabsTrigger value="location"><MapPin className="h-3.5 w-3.5 mr-1" />Location</TabsTrigger>
          <TabsTrigger value="soil"><Mountain className="h-3.5 w-3.5 mr-1" />Soil</TabsTrigger>
          <TabsTrigger value="context"><Tractor className="h-3.5 w-3.5 mr-1" />Context</TabsTrigger>
        </TabsList>

        <TabsContent value="crop">
          <Card>
            <CardHeader><CardTitle>Crop Information</CardTitle><CardDescription>Select the crop and specify the planting area</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Crop *</Label>
                <Select value={form.crop} onValueChange={v => setForm(f => ({ ...f, crop: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                  <SelectContent>{CROPS.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Planting Area (ha)</Label><Input type="number" value={form.area_ha} onChange={e => setForm(f => ({ ...f, area_ha: e.target.value }))} placeholder="e.g. 50" /></div>
              <div><Label>Production Goal</Label><Input value={form.production_goal} onChange={e => setForm(f => ({ ...f, production_goal: e.target.value }))} placeholder="e.g. grain, silage" /></div>
              <div><Label>Yield Target</Label><Input value={form.yield_target} onChange={e => setForm(f => ({ ...f, yield_target: e.target.value }))} placeholder="e.g. 8 t/ha" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader><CardTitle>Location & Region</CardTitle><CardDescription>Specify the production region for region-aware recommendations</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Region Profile</Label>
                <Select value={form.region_profile_id} onValueChange={v => {
                  const region = regions.find(r => r.id === v);
                  setForm(f => ({ ...f, region_profile_id: v, province: region?.province || f.province }));
                }}>
                  <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>{regions.map(r => <SelectItem key={r.id} value={r.id}>{r.production_zone} ({r.province})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Province</Label><Input value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} placeholder="e.g. Mpumalanga" /></div>
              <div><Label>Planting Window</Label><Input value={form.planting_window} onChange={e => setForm(f => ({ ...f, planting_window: e.target.value }))} placeholder="e.g. October–November" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soil">
          <Card>
            <CardHeader><CardTitle>Soil Information</CardTitle><CardDescription>Soil characteristics influence fertilizer and amendment recommendations</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Soil Profile</Label>
                <Select value={form.soil_profile_id} onValueChange={v => setForm(f => ({ ...f, soil_profile_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
                  <SelectContent>{soils.map(s => <SelectItem key={s.id} value={s.id}>{s.profile_name} ({s.texture_class.replace('_', ' ')})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {selectedSoil && (
                <div className="sm:col-span-2 p-3 rounded-lg border bg-muted/30 text-sm">
                  <p className="font-medium mb-1">{selectedSoil.profile_name}</p>
                  <p className="text-muted-foreground">{selectedSoil.agronomic_notes}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span>Drainage: <strong className="capitalize">{selectedSoil.drainage}</strong></span>
                    <span>Leaching: <strong className="capitalize">{selectedSoil.leaching_risk}</strong></span>
                    <span>Nutrient holding: <strong className="capitalize">{selectedSoil.nutrient_holding}</strong></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context">
          <Card>
            <CardHeader><CardTitle>Farming Context</CardTitle><CardDescription>Production system and scale influence input recommendations</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Farming System</Label>
                <Select value={form.farming_system_id} onValueChange={v => setForm(f => ({ ...f, farming_system_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select system" /></SelectTrigger>
                  <SelectContent>{systems.map(s => <SelectItem key={s.id} value={s.id}>{s.system_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Irrigation</Label>
                <Select value={form.irrigation_type} onValueChange={v => setForm(f => ({ ...f, irrigation_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dryland">Dryland</SelectItem>
                    <SelectItem value="irrigated">Irrigated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Production Scale</Label>
                <Select value={form.production_scale} onValueChange={v => setForm(f => ({ ...f, production_scale: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="smallholder">Smallholder / Emerging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end">
        <Button size="lg" onClick={generateRecommendation} disabled={loading || !form.crop}>
          <Zap className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Recommendation'}
        </Button>
      </div>
    </div>
  );
}
