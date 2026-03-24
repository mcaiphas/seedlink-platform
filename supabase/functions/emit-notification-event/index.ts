import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const body = await req.json();
    const { company_id, event_type, entity_type, entity_id, source_module, payload = {}, triggered_by_user_id = null } = body;

    const recipientUserId = payload?.user_id ? String(payload.user_id) : null; if ((!company_id && !recipientUserId) || !event_type || !entity_type || !entity_id || !source_module) {
      return new Response(JSON.stringify({ success: false, error: "company_id, event_type, entity_type, entity_id, and source_module are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("notification_events")
      .insert({
        company_id,
        event_type,
        entity_type,
        entity_id,
        source_module,
        payload,
        triggered_by_user_id,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, event: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
