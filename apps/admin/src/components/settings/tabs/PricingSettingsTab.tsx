import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function PricingSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('pricing');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Price Tiers" description="Enable or disable price levels for different customer segments.">
        {[
          { key: 'retail_pricing', label: 'Retail Pricing', desc: 'Standard end-consumer prices.' },
          { key: 'dealer_pricing', label: 'Dealer Pricing', desc: 'Discounted prices for registered dealers.' },
          { key: 'wholesale_pricing', label: 'Wholesale Pricing', desc: 'Bulk pricing for wholesale customers.' },
          { key: 'regional_pricing', label: 'Regional Pricing', desc: 'Location-based pricing adjustments.' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
      </SettingsSection>

      <SettingsSection title="Tax & Promotions" description="Tax display and promotional pricing rules.">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Tax Inclusive Pricing</p><p className="text-xs text-muted-foreground">Show prices including VAT on storefront.</p></div>
          <Switch checked={!!s.tax_inclusive} onCheckedChange={v => update('tax_inclusive', v)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Promotional Pricing</p><p className="text-xs text-muted-foreground">Allow time-bound sale prices on products.</p></div>
          <Switch checked={s.promotional_pricing !== false} onCheckedChange={v => update('promotional_pricing', v)} />
        </div>
        <SettingsField label="Default Markup (%)" hint="Applied when auto-calculating selling prices from cost.">
          <Input type="number" value={s.default_markup ?? 30} onChange={e => update('default_markup', parseFloat(e.target.value))} />
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
