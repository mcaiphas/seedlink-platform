import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsSection } from '../SettingsSection';
import { SettingsField } from '../SettingsField';
import { SettingsToolbar } from '../SettingsToolbar';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function UserAccessSettingsTab() {
  const { settings: s, loading, saving, dirty, update, save, discard } = useSystemSettings('user_access');
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    supabase.from('roles').select('id, name').order('name').then(({ data }) => setRoles((data as any) || []));
  }, []);

  if (loading) return <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsToolbar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      <SettingsSection title="User Onboarding" description="Defaults applied when new users are invited or sign up.">
        <SettingsField label="Default Role for Invited Users" hint="Role assigned automatically when a new user is invited.">
          <Select value={s.default_role || ''} onValueChange={v => update('default_role', v)}>
            <SelectTrigger><SelectValue placeholder="Select a default role" /></SelectTrigger>
            <SelectContent>
              {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.display_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </SettingsField>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Require Admin Approval for New Users</p><p className="text-xs text-muted-foreground">New sign-ups are held pending until an admin approves.</p></div>
          <Switch checked={!!s.require_user_approval} onCheckedChange={v => update('require_user_approval', v)} />
        </div>
      </SettingsSection>

      <SettingsSection title="Access Controls" description="Branch-level and override access rules.">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Branch-Based Access</p><p className="text-xs text-muted-foreground">Restrict data visibility based on user's assigned branch/depot.</p></div>
          <Switch checked={!!s.branch_based_access} onCheckedChange={v => update('branch_based_access', v)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="text-sm font-medium">Allow Permission Overrides</p><p className="text-xs text-muted-foreground">Enable per-user permission overrides beyond their role.</p></div>
          <Switch checked={s.allow_permission_overrides !== false} onCheckedChange={v => update('allow_permission_overrides', v)} />
        </div>
      </SettingsSection>
    </div>
  );
}
