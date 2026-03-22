import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function SecuritySettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('security');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Authentication" description="Password and login security policies.">
        <SettingsField label="Minimum Password Length">
          <Input type="number" value={s.min_password_length ?? 8} onChange={e => update('min_password_length', parseInt(e.target.value))} />
        </SettingsField>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Require Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Enforce 2FA for all admin users.</p></div>
          <Switch checked={!!s.require_2fa} onCheckedChange={v => update('require_2fa', v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsField label="Session Timeout (minutes)" hint="Idle time before auto-logout.">
            <Input type="number" value={s.session_timeout_minutes ?? 60} onChange={e => update('session_timeout_minutes', parseInt(e.target.value))} />
          </SettingsField>
          <SettingsField label="Max Login Attempts" hint="Lock account after this many failed attempts.">
            <Input type="number" value={s.max_login_attempts ?? 5} onChange={e => update('max_login_attempts', parseInt(e.target.value))} />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Audit & Compliance" description="Logging and change tracking policies.">
        {[
          { key: 'audit_logging_enabled', label: 'Audit Logging', desc: 'Log all user actions for compliance.' },
          { key: 'require_approval_sensitive', label: 'Require Approval for Sensitive Changes', desc: 'Changes to pricing, roles, and finance require a second approval.' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
        <SettingsField label="Audit Log Retention">
          <Select value={s.audit_retention || '90_days'} onValueChange={v => update('audit_retention', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30_days">30 days</SelectItem>
              <SelectItem value="90_days">90 days</SelectItem>
              <SelectItem value="365_days">1 year</SelectItem>
              <SelectItem value="forever">Indefinite</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
