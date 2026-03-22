import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Beaker } from 'lucide-react';

const ATTRIBUTES = [
  { key: 'crop', label: 'Crop', placeholder: 'e.g. Maize, Soybean', group: 'seed' },
  { key: 'product_form', label: 'Product Form', placeholder: 'e.g. Granular, Liquid', group: 'general' },
  { key: 'seed_type', label: 'Seed Type', placeholder: 'e.g. Hybrid, OPV', group: 'seed' },
  { key: 'seed_class', label: 'Seed Class', placeholder: 'e.g. Certified, Foundation', group: 'seed' },
  { key: 'germination_pct', label: 'Germination %', placeholder: '0-100', group: 'seed' },
  { key: 'purity_pct', label: 'Purity %', placeholder: '0-100', group: 'seed' },
  { key: 'treatment', label: 'Treatment', placeholder: 'e.g. Thiram, Metalaxyl', group: 'chemical' },
  { key: 'active_ingredient', label: 'Active Ingredient', placeholder: 'e.g. Glyphosate 360g/L', group: 'chemical' },
  { key: 'concentration', label: 'Concentration', placeholder: 'e.g. 480 g/L', group: 'chemical' },
  { key: 'target_use', label: 'Target Use', placeholder: 'e.g. Pre-emerge herbicide', group: 'general' },
  { key: 'season', label: 'Season', placeholder: 'e.g. Summer 2025', group: 'general' },
  { key: 'market_segment', label: 'Market Segment', placeholder: 'e.g. Commercial, Smallholder', group: 'general' },
];

interface Props {
  form: Record<string, any>;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export function AttributesTab({ form, setForm }: Props) {
  const updateAttr = (key: string, value: string) => {
    setForm((f: any) => ({ ...f, metadata: { ...f.metadata, [key]: value || undefined } }));
  };

  const validatePct = (key: string, value: string) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0 || num > 100)) return;
    updateAttr(key, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Beaker className="h-5 w-5" />Product Attributes</CardTitle>
        <CardDescription>Agribusiness-specific attributes for seeds, chemicals, and fertilisers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Seed Attributes</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ATTRIBUTES.filter(a => a.group === 'seed').map(attr => (
              <div key={attr.key} className="space-y-2">
                <Label>{attr.label}</Label>
                <Input
                  value={form.metadata?.[attr.key] || ''}
                  onChange={e => attr.key.includes('pct') ? validatePct(attr.key, e.target.value) : updateAttr(attr.key, e.target.value)}
                  placeholder={attr.placeholder}
                  type={attr.key.includes('pct') ? 'number' : 'text'}
                  min={attr.key.includes('pct') ? 0 : undefined}
                  max={attr.key.includes('pct') ? 100 : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Chemical / Treatment Attributes</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ATTRIBUTES.filter(a => a.group === 'chemical').map(attr => (
              <div key={attr.key} className="space-y-2">
                <Label>{attr.label}</Label>
                <Input
                  value={form.metadata?.[attr.key] || ''}
                  onChange={e => updateAttr(attr.key, e.target.value)}
                  placeholder={attr.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">General</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ATTRIBUTES.filter(a => a.group === 'general').map(attr => (
              <div key={attr.key} className="space-y-2">
                <Label>{attr.label}</Label>
                <Input
                  value={form.metadata?.[attr.key] || ''}
                  onChange={e => updateAttr(attr.key, e.target.value)}
                  placeholder={attr.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
