import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SettingsMap = Record<string, any>;

export function useSystemSettings(prefix?: string) {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [original, setOriginal] = useState<SettingsMap>({});

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('system_settings').select('*');
    if (prefix) query = query.like('setting_key', `${prefix}.%`);
    const { data, error } = await query;
    if (error) { toast.error('Failed to load settings'); setLoading(false); return; }
    const map: SettingsMap = {};
    (data || []).forEach((row: any) => {
      const key = prefix ? row.setting_key.replace(`${prefix}.`, '') : row.setting_key;
      map[key] = row.setting_value;
    });
    setSettings(map);
    setOriginal(map);
    setDirty(false);
    setLoading(false);
  }, [prefix]);

  useEffect(() => { load(); }, [load]);

  const update = useCallback((key: string, value: any) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      setDirty(JSON.stringify(next) !== JSON.stringify(original));
      return next;
    });
  }, [original]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const entries = Object.entries(settings);
      for (const [key, value] of entries) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const { error } = await supabase
          .from('system_settings')
          .upsert(
            { setting_key: fullKey, setting_value: value, updated_at: new Date().toISOString() },
            { onConflict: 'setting_key' }
          );
        if (error) throw error;
      }
      setOriginal({ ...settings });
      setDirty(false);
      toast.success('Settings saved successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }, [settings, prefix]);

  const discard = useCallback(() => {
    setSettings({ ...original });
    setDirty(false);
  }, [original]);

  return { settings, loading, saving, dirty, update, save, discard };
}
