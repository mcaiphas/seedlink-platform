import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function StoreSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('store');

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Document Prefixes" description="Prefixes used when auto-generating document numbers.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SettingsField label="Order Prefix" hint="e.g. ORD-">
            <Input value={s.order_prefix || 'ORD-'} onChange={e => update('order_prefix', e.target.value)} />
          </SettingsField>
          <SettingsField label="Invoice Prefix" hint="e.g. INV-">
            <Input value={s.invoice_prefix || 'INV-'} onChange={e => update('invoice_prefix', e.target.value)} />
          </SettingsField>
          <SettingsField label="Quote Prefix" hint="e.g. QT-">
            <Input value={s.quote_prefix || 'QT-'} onChange={e => update('quote_prefix', e.target.value)} />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="SKU Generation" description="How product SKUs are auto-generated.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="SKU Format" hint="Pattern: {category}-{subcategory}-{base}-{packsize}">
            <Select value={s.sku_format || 'auto'} onValueChange={v => update('sku_format', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-generated (recommended)</SelectItem>
                <SelectItem value="manual">Manual entry only</SelectItem>
                <SelectItem value="hybrid">Auto-suggest, allow override</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsField label="SKU Separator">
            <Select value={s.sku_separator || '-'} onValueChange={v => update('sku_separator', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="-">Hyphen (-)</SelectItem>
                <SelectItem value="_">Underscore (_)</SelectItem>
                <SelectItem value=".">Dot (.)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Tax & Workflow Defaults" description="Default behaviour for new orders and documents.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Default Tax Rate (%)" hint="Applied automatically to new products.">
            <Input type="number" value={s.default_tax_rate ?? 15} onChange={e => update('default_tax_rate', parseFloat(e.target.value))} />
          </SettingsField>
          <SettingsField label="Default Order Workflow">
            <Select value={s.order_workflow || 'standard'} onValueChange={v => update('order_workflow', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (draft → approved → paid)</SelectItem>
                <SelectItem value="auto_approve">Auto-approve on payment</SelectItem>
                <SelectItem value="manual">Manual approval required</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium">Allow Backorders</p>
            <p className="text-xs text-muted-foreground">Permit orders when stock is insufficient.</p>
          </div>
          <Switch checked={!!s.allow_backorders} onCheckedChange={v => update('allow_backorders', v)} />
        </div>
        <SettingsField label="Minimum Order Value" hint="Orders below this amount will be rejected.">
          <Input type="number" value={s.minimum_order_value ?? 0} onChange={e => update('minimum_order_value', parseFloat(e.target.value))} placeholder="0.00" />
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
