import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const permissionCache = new Map<string, { value: boolean; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

export function usePermission(permissionCode: string) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !permissionCode) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    const cached = permissionCache.get(permissionCode);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setAllowed(cached.value);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .rpc('current_user_has_permission', { p_permission_code: permissionCode })
      .then(({ data, error }) => {
        const val = error ? false : !!data;
        permissionCache.set(permissionCode, { value: val, ts: Date.now() });
        setAllowed(val);
        setLoading(false);
      });
  }, [user?.id, permissionCode]);

  return { allowed: allowed ?? false, loading };
}

export function usePermissions(codes: string[]) {
  const { user } = useAuth();
  const [perms, setPerms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || codes.length === 0) {
      setPerms({});
      setLoading(false);
      return;
    }

    const uncached: string[] = [];
    const result: Record<string, boolean> = {};

    for (const code of codes) {
      const cached = permissionCache.get(code);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        result[code] = cached.value;
      } else {
        uncached.push(code);
      }
    }

    if (uncached.length === 0) {
      setPerms(result);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      uncached.map((code) =>
        supabase
          .rpc('current_user_has_permission', { p_permission_code: code })
          .then(({ data, error }) => {
            const val = error ? false : !!data;
            permissionCache.set(code, { value: val, ts: Date.now() });
            result[code] = val;
          })
      )
    ).then(() => {
      setPerms(result);
      setLoading(false);
    });
  }, [user?.id, codes.join(',')]);

  return { perms, loading, can: (code: string) => perms[code] ?? false };
}

export function clearPermissionCache() {
  permissionCache.clear();
}
