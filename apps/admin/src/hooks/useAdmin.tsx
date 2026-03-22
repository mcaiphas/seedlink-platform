import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    supabase.rpc('is_admin').then(({ data }) => {
      setIsAdmin(!!data);
      setLoading(false);
    });
  }, [user]);

  return { isAdmin, loading };
}

export function useUserRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRoles([]); setLoading(false); return; }
    supabase
      .from('user_role_assignments')
      .select('roles(name)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .then(({ data }) => {
        setRoles((data || []).map((r: any) => r.roles?.name).filter(Boolean));
        setLoading(false);
      });
  }, [user]);

  return { roles, loading, hasRole: (r: string) => roles.includes(r) };
}
