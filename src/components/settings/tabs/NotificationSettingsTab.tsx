import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Mail, MessageSquare, Bell, Smartphone, Send, Settings2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { SettingsSection } from '../SettingsSection';

interface ChannelConfig {
  id: string;
  channel: string;
  is_active: boolean;
  provider_name: string | null;
  sender_identity: string | null;
  config: Record<string, any>;
  auth_status: string;
  retry_enabled: boolean;
  max_retries: number;
}

const CHANNEL_META: Record<string, { label: string; icon: any; color: string }> = {
  email: { label: 'Email', icon: Mail, color: 'text-blue-600' },
  sms: { label: 'SMS', icon: Smartphone, color: 'text-emerald-600' },
  in_app: { label: 'In-App Notifications', icon: Bell, color: 'text-purple-600' },
  whatsapp: { label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' },
  push: { label: 'Push Notifications', icon: Send, color: 'text-orange-600' },
};

const AUTH_STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
  not_configured: { label: 'Not Configured', variant: 'outline', icon: XCircle },
  configured: { label: 'Configured', variant: 'secondary', icon: Settings2 },
  verified: { label: 'Verified', variant: 'default', icon: CheckCircle2 },
  error: { label: 'Error', variant: 'destructive', icon: AlertCircle },
};

export function NotificationSettingsTab() {
  const qc = useQueryClient();
  const [editChannel, setEditChannel] = useState<ChannelConfig | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['notification-channel-configs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notification_channel_configs' as any).select('*').order('channel');
      if (error) throw error;
      return (data || []) as unknown as ChannelConfig[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('notification_channel_configs' as any).update({ is_active: active, updated_at: new Date().toISOString() } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification-channel-configs'] }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editChannel) return;
      const { error } = await supabase.from('notification_channel_configs' as any).update({
        provider_name: editForm.provider_name || null,
        sender_identity: editForm.sender_identity || null,
        config: editForm.config,
        auth_status: editForm.auth_status,
        retry_enabled: editForm.retry_enabled,
        max_retries: editForm.max_retries,
        updated_at: new Date().toISOString(),
      } as any).eq('id', editChannel.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-channel-configs'] });
      toast.success('Channel configuration saved');
      setEditChannel(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  function openEdit(ch: ChannelConfig) {
    setEditChannel(ch);
    setEditForm({
      provider_name: ch.provider_name || '',
      sender_identity: ch.sender_identity || '',
      config: { ...ch.config },
      auth_status: ch.auth_status,
      retry_enabled: ch.retry_enabled,
      max_retries: ch.max_retries,
    });
  }

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <SettingsSection title="Notification Channels" description="Configure delivery channels for system notifications, document dispatch, and customer communications.">
        <div className="space-y-3">
          {channels.map(ch => {
            const meta = CHANNEL_META[ch.channel] || { label: ch.channel, icon: Bell, color: 'text-muted-foreground' };
            const Icon = meta.icon;
            const status = AUTH_STATUS_BADGE[ch.auth_status] || AUTH_STATUS_BADGE.not_configured;
            const StatusIcon = status.icon;
            return (
              <Card key={ch.id} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${meta.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{meta.label}</p>
                          <Badge variant={status.variant} className="text-[10px] gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ch.provider_name ? `Provider: ${ch.provider_name}` : 'No provider configured'}
                          {ch.sender_identity ? ` · ${ch.sender_identity}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(ch)}>
                        <Settings2 className="h-4 w-4 mr-1" />Configure
                      </Button>
                      <Switch
                        checked={ch.is_active}
                        onCheckedChange={v => toggleMutation.mutate({ id: ch.id, active: v })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection title="Communication Diagnostics" description="Quick status overview of communication infrastructure readiness.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            const emailCh = channels.find(c => c.channel === 'email');
            const smsCh = channels.find(c => c.channel === 'sms');
            const inAppCh = channels.find(c => c.channel === 'in_app');
            const templateCount = 0; // will be fetched if needed
            const items = [
              { label: 'Email Channel', ok: emailCh?.is_active && emailCh?.auth_status !== 'not_configured' },
              { label: 'SMS Channel', ok: smsCh?.is_active && smsCh?.auth_status !== 'not_configured' },
              { label: 'In-App Notifications', ok: inAppCh?.is_active },
              { label: 'Document Storage', ok: true },
            ];
            return items.map(item => (
              <Card key={item.label} className="border-border/50">
                <CardContent className="p-3 flex items-center gap-2">
                  {item.ok
                    ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                  <span className="text-xs font-medium">{item.label}</span>
                </CardContent>
              </Card>
            ));
          })()}
        </div>
      </SettingsSection>

      {/* Channel Configuration Dialog */}
      <Dialog open={!!editChannel} onOpenChange={() => setEditChannel(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure {editChannel && (CHANNEL_META[editChannel.channel]?.label || editChannel.channel)}</DialogTitle>
          </DialogHeader>
          {editChannel && (
            <div className="space-y-4">
              <div><Label>Provider Name</Label><Input value={editForm.provider_name} onChange={e => setEditForm({ ...editForm, provider_name: e.target.value })} placeholder="e.g. SendGrid, Twilio, Internal" /></div>
              <div><Label>Sender Identity</Label><Input value={editForm.sender_identity} onChange={e => setEditForm({ ...editForm, sender_identity: e.target.value })} placeholder="e.g. noreply@seedlink.co.za or +27..." /></div>

              {editChannel.channel === 'email' && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Settings</p>
                  <div><Label>From Display Name</Label><Input value={editForm.config?.from_name || ''} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, from_name: e.target.value } })} /></div>
                  <div><Label>From Email Address</Label><Input value={editForm.config?.from_email || ''} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, from_email: e.target.value } })} placeholder="accounts@seedlink.co.za" /></div>
                  <div><Label>Reply-To Email</Label><Input value={editForm.config?.reply_to || ''} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, reply_to: e.target.value } })} /></div>
                  <div><Label>Default Signature / Footer</Label><Input value={editForm.config?.signature || ''} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, signature: e.target.value } })} placeholder="Kind regards, Seedlink Team" /></div>
                </>
              )}

              {editChannel.channel === 'sms' && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">SMS Settings</p>
                  <div><Label>Sender ID</Label><Input value={editForm.config?.sender_id || ''} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, sender_id: e.target.value } })} placeholder="SEEDLINK" /></div>
                  <div><Label>Default Country Format</Label><Input value={editForm.config?.country_format || ''} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, country_format: e.target.value } })} placeholder="+27" /></div>
                </>
              )}

              {editChannel.channel === 'in_app' && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">In-App Settings</p>
                  <div><Label>Retention Period (days)</Label><Input type="number" value={editForm.config?.retention_days || 90} onChange={e => setEditForm({ ...editForm, config: { ...editForm.config, retention_days: parseInt(e.target.value) || 90 } })} /></div>
                  <div><Label>Default Priority</Label>
                    <Select value={editForm.config?.priority || 'normal'} onValueChange={v => setEditForm({ ...editForm, config: { ...editForm.config, priority: v } })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Separator />
              <div><Label>Authentication Status</Label>
                <Select value={editForm.auth_status} onValueChange={v => setEditForm({ ...editForm, auth_status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_configured">Not Configured</SelectItem>
                    <SelectItem value="configured">Configured</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Retry on Failure</Label>
                  <p className="text-xs text-muted-foreground">Automatically retry failed deliveries</p>
                </div>
                <Switch checked={editForm.retry_enabled} onCheckedChange={v => setEditForm({ ...editForm, retry_enabled: v })} />
              </div>
              {editForm.retry_enabled && (
                <div><Label>Max Retries</Label><Input type="number" min={1} max={10} value={editForm.max_retries} onChange={e => setEditForm({ ...editForm, max_retries: parseInt(e.target.value) || 3 })} /></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChannel(null)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
