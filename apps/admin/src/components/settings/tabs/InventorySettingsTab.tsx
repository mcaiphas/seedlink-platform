import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function InventorySettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('inventory');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Stock Tracking" description="Control how inventory is tracked and managed.">
        {[
          { key: 'stock_tracking_enabled', label: 'Enable Stock Tracking', desc: 'Track inventory levels across all products and depots.' },
          { key: 'batch_tracking_enabled', label: 'Batch Tracking', desc: 'Track inventory by batch/lot numbers for traceability.' },
          { key: 'expiry_tracking_enabled', label: 'Expiry Date Tracking', desc: 'Track product expiry dates and trigger alerts.' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
      </SettingsSection>

      <SettingsSection title="Thresholds & Rules" description="Set operational limits for inventory management.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Low Stock Threshold" hint="Default units before a product is flagged as low stock.">
            <Input type="number" value={s.low_stock_threshold ?? 10} onChange={e => update('low_stock_threshold', parseInt(e.target.value))} />
          </SettingsField>
          <SettingsField label="Reserved Stock Buffer" hint="Units reserved for pending orders that can't be sold.">
            <Input type="number" value={s.reserved_stock_buffer ?? 0} onChange={e => update('reserved_stock_buffer', parseInt(e.target.value))} />
          </SettingsField>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Allow Overselling</p><p className="text-xs text-muted-foreground">Permit sales beyond available stock.</p></div>
          <Switch checked={!!s.allow_overselling} onCheckedChange={v => update('allow_overselling', v)} />
        </div>
        <SettingsField label="Warehouse Allocation Strategy">
          <Select value={s.allocation_strategy || 'fifo'} onValueChange={v => update('allocation_strategy', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
              <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
              <SelectItem value="fefo">FEFO (First Expiry, First Out)</SelectItem>
              <SelectItem value="manual">Manual allocation</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Default Unit of Measure">
          <Select value={s.default_uom || 'kg'} onValueChange={v => update('default_uom', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilogram (kg)</SelectItem>
              <SelectItem value="g">Gram (g)</SelectItem>
              <SelectItem value="l">Litre (L)</SelectItem>
              <SelectItem value="ml">Millilitre (mL)</SelectItem>
              <SelectItem value="unit">Unit</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
