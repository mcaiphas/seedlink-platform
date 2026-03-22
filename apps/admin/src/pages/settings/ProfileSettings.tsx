import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { User } from 'lucide-react';

interface ProfileFields {
  full_name: string;
  phone: string;
  avatar_url: string;
  job_title: string;
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const [fields, setFields] = useState<ProfileFields>({ full_name: '', phone: '', avatar_url: '', job_title: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('profiles')
      .select('full_name, phone, avatar_url, job_title')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFields({
            full_name: data.full_name || '',
            phone: data.phone || '',
            avatar_url: data.avatar_url || '',
            job_title: data.job_title || '',
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fields.full_name || null,
        phone: fields.phone || null,
        avatar_url: fields.avatar_url || null,
        job_title: fields.job_title || null,
      })
      .eq('id', user.id);
    if (error) toast.error(error.message);
    else toast.success('Profile updated');
    setSaving(false);
  };

  const initials = (fields.full_name || user?.email || '?').slice(0, 2).toUpperCase();
  const update = (key: keyof ProfileFields, val: string) => setFields(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      <PageHeader title="Profile Settings" description="Manage your personal information" />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={fields.avatar_url || undefined} alt={fields.full_name || 'Avatar'} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{fields.full_name || 'No name set'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fields.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Enter your full name" />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={fields.phone} onChange={e => update('phone', e.target.value)} placeholder="e.g. +27 82 000 0000" />
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={fields.job_title} onChange={e => update('job_title', e.target.value)} placeholder="e.g. Farm Manager" />
              </div>

              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input value={fields.avatar_url} onChange={e => update('avatar_url', e.target.value)} placeholder="https://example.com/avatar.jpg" />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
