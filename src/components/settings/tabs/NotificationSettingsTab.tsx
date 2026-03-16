import { Switch } from '@/components/ui/switch';
import { SettingsSection } from '../SettingsSection';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('notifications');

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  const channels = [
    { key: 'email_enabled', label: 'Email Alerts', desc: 'Send notifications via email.' },
    { key: 'sms_enabled', label: 'SMS Alerts', desc: 'Send critical alerts via SMS.' },
    { key: 'whatsapp_enabled', label: 'WhatsApp Alerts', desc: 'Send alerts via WhatsApp Business API.' },
    { key: 'in_app_enabled', label: 'In-App Notifications', desc: 'Show notifications inside the admin panel.' },
  ];

  const triggers = [
    { key: 'alert_new_order', label: 'New Order', desc: 'Alert when a new order is placed.' },
    { key: 'alert_payment', label: 'Payment Received', desc: 'Alert on successful payment.' },
    { key: 'alert_low_stock', label: 'Low Stock', desc: 'Alert when product stock falls below threshold.' },
    { key: 'alert_user_invite', label: 'User Invitation', desc: 'Alert when a new user is invited to the platform.' },
    { key: 'alert_approval_required', label: 'Approval Required', desc: 'Alert when a document needs approval.' },
    { key: 'alert_delivery_status', label: 'Delivery Status Change', desc: 'Alert on shipment status updates.' },
  ];

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="Notification Channels" description="Choose which channels are active for system notifications.">
        {channels.map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
      </SettingsSection>

      <SettingsSection title="Alert Triggers" description="Control which events trigger notifications.">
        {triggers.map(item => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={s[item.key] !== false} onCheckedChange={v => update(item.key, v)} />
          </div>
        ))}
      </SettingsSection>
    </div>
  );
}
