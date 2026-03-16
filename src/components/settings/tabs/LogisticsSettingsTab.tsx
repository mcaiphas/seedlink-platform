import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function LogisticsSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('logistics');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Delivery Options" description="Configure how orders are fulfilled and delivered.">
        {[
          { key: 'enable_delivery', label: 'Enable Delivery', desc: 'Allow customers to select delivery to their address.' },
          { key: 'enable_pickup', label: 'Enable Collection/Pickup', desc: 'Allow customers to collect from a depot.' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
      </SettingsSection>

      <SettingsSection title="Shipping Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Default Shipping Method">
            <Select value={s.default_shipping_method || 'standard'} onValueChange={v => update('default_shipping_method', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Delivery</SelectItem>
                <SelectItem value="express">Express Delivery</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsField label="Default Lead Time (days)" hint="Standard processing time before dispatch.">
            <Input type="number" value={s.default_lead_time ?? 3} onChange={e => update('default_lead_time', parseInt(e.target.value))} />
          </SettingsField>
          <SettingsField label="Free Delivery Threshold" hint="Minimum order value for free delivery. 0 = disabled.">
            <Input type="number" value={s.free_delivery_threshold ?? 0} onChange={e => update('free_delivery_threshold', parseFloat(e.target.value))} />
          </SettingsField>
          <SettingsField label="Maximum Delivery Radius (km)" hint="Service area limit. 0 = unlimited.">
            <Input type="number" value={s.max_delivery_radius ?? 0} onChange={e => update('max_delivery_radius', parseInt(e.target.value))} />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Integrations">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Drovvi Integration</p><p className="text-xs text-muted-foreground">Enable Drovvi for last-mile delivery management.</p></div>
          <Switch checked={!!s.drovvi_enabled} onCheckedChange={v => update('drovvi_enabled', v)} />
        </div>
        {s.drovvi_enabled && (
          <SettingsField label="Drovvi API Key" hint="Your Drovvi platform API key.">
            <Input type="password" value={s.drovvi_api_key || ''} onChange={e => update('drovvi_api_key', e.target.value)} />
          </SettingsField>
        )}
      </SettingsSection>
    </div>
  );
}
