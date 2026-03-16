import { supabase } from '@/integrations/supabase/client';

interface AuditEntry {
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
}

export async function logAudit(entry: AuditEntry) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id || null,
      old_values: entry.old_values || null,
      new_values: entry.new_values || null,
      actor_user_id: user?.id || null,
    });
  } catch {
    // Audit logging should never break the UI
  }
}
