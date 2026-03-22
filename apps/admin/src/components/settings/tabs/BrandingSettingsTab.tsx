import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function BrandingSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('branding');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Admin Branding" description="Customise the look of your admin panel.">
        <SettingsField label="Admin Logo URL" hint="Logo displayed in the sidebar header.">
          <Input value={s.admin_logo_url || ''} onChange={e => update('admin_logo_url', e.target.value)} placeholder="https://..." />
        </SettingsField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Primary Colour" hint="Main accent colour (hex).">
            <div className="flex gap-2 items-center">
              <Input value={s.primary_colour || '#16a34a'} onChange={e => update('primary_colour', e.target.value)} className="flex-1" />
              <div className="h-10 w-10 rounded-md border border-border" style={{ backgroundColor: s.primary_colour || '#16a34a' }} />
            </div>
          </SettingsField>
          <SettingsField label="Secondary Colour">
            <div className="flex gap-2 items-center">
              <Input value={s.secondary_colour || '#f59e0b'} onChange={e => update('secondary_colour', e.target.value)} className="flex-1" />
              <div className="h-10 w-10 rounded-md border border-border" style={{ backgroundColor: s.secondary_colour || '#f59e0b' }} />
            </div>
          </SettingsField>
        </div>
        <SettingsField label="Theme">
          <Select value={s.theme || 'system'} onValueChange={v => update('theme', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System default</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsSection>

      <SettingsSection title="Document Branding" description="Appearance of customer-facing documents.">
        <SettingsField label="Invoice Logo URL" hint="Logo printed on invoices and statements.">
          <Input value={s.invoice_logo_url || ''} onChange={e => update('invoice_logo_url', e.target.value)} placeholder="https://..." />
        </SettingsField>
        <SettingsField label="Email Header Logo URL" hint="Logo shown in transactional emails.">
          <Input value={s.email_logo_url || ''} onChange={e => update('email_logo_url', e.target.value)} placeholder="https://..." />
        </SettingsField>
        <SettingsField label="Invoice Footer Text" hint="Legal or additional text at the bottom of invoices.">
          <Input value={s.invoice_footer || ''} onChange={e => update('invoice_footer', e.target.value)} placeholder="Thank you for your business." />
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
