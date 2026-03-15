import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
export default function ProfileSettings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (user) supabase.from('profiles').select('full_name').eq('id', user.id).single().then(({data})=>{if(data)setFullName(data.full_name||'')}); }, [user]);
  const handleSave = async () => { if (!user) return; setLoading(true); const {error} = await supabase.from('profiles').update({full_name:fullName}).eq('id',user.id); if(error)toast.error(error.message); else toast.success('Profile updated'); setLoading(false); };
  return (<div><PageHeader title="Profile Settings" description="Manage your personal information" /><Card className="max-w-lg"><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Email</Label><Input value={user?.email||''} disabled /></div><div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={e=>setFullName(e.target.value)} /></div><Button onClick={handleSave} disabled={loading}>{loading?'Saving...':'Save Changes'}</Button></CardContent></Card></div>);
}
