import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function IntegrationSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('integrations');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  const integrations = [
    { key: 'accounting', label: 'Accounting Integration', desc: 'Connect to external accounting software (Xero, Sage).', fields: ['accounting_provider', 'accounting_api_key'] },
    { key: 'email', label: 'Email Provider', desc: 'Transactional email service configuration.', fields: ['email_provider', 'email_api_key'] },
    { key: 'sms', label: 'SMS Provider', desc: 'SMS notification gateway.', fields: ['sms_provider', 'sms_api_key'] },
    { key: 'whatsapp', label: 'WhatsApp Provider', desc: 'WhatsApp Business API for messaging.', fields: ['whatsapp_provider', 'whatsapp_api_key'] },
  ];

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="API Access" description="Manage API keys for external integrations.">
        <SettingsField label="Webhook URL" hint="URL that receives event callbacks from Seedlink.">
          <Input value={s.webhook_url || ''} onChange={e => update('webhook_url', e.target.value)} placeholder="https://..." />
        </SettingsField>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Enable Webhooks</p><p className="text-xs text-muted-foreground">Send real-time event notifications to your webhook endpoint.</p></div>
          <Switch checked={!!s.webhooks_enabled} onCheckedChange={v => update('webhooks_enabled', v)} />
        </div>
      </SettingsSection>

      {integrations.map(int => (
        <SettingsSection key={int.key} title={int.label} description={int.desc}>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Enabled</p>
              {s[`${int.key}_enabled`] && <Badge variant="default" className="text-xs">Connected</Badge>}
            </div>
            <Switch checked={!!s[`${int.key}_enabled`]} onCheckedChange={v => update(`${int.key}_enabled`, v)} />
          </div>
          {s[`${int.key}_enabled`] && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsField label="Provider">
                <Input value={s[int.fields[0]] || ''} onChange={e => update(int.fields[0], e.target.value)} placeholder="e.g. sendgrid, twilio" />
              </SettingsField>
              <SettingsField label="API Key">
                <Input type="password" value={s[int.fields[1]] || ''} onChange={e => update(int.fields[1], e.target.value)} />
              </SettingsField>
            </div>
          )}
        </SettingsSection>
      ))}
    </div>
  );
}
