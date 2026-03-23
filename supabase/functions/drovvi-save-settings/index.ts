import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const body = await req.json();

    const {
      company_id,
      is_enabled,
      environment,
      api_base_url,
      api_key,
      webhook_secret,
      tenant_mapping_code,
      default_shipment_mode,
      auto_create_shipment,
      auto_request_quote,
      auto_sync_tracking,
      auto_sync_pod,
      auto_sync_settlement,
    } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔐 Never return raw secrets
    const updatePayload: any = {
      company_id,
      is_enabled,
      environment,
      api_base_url,
      tenant_mapping_code,
      default_shipment_mode,
      auto_create_shipment,
      auto_request_quote,
      auto_sync_tracking,
      auto_sync_pod,
      auto_sync_settlement,
      connection_status: "disconnected",
      updated_at: new Date().toISOString(),
    };

    if (api_key) {
      updatePayload.api_key_encrypted = api_key; // 🔁 later: encrypt
      updatePayload.has_api_key = true;
    }

    if (webhook_secret) {
      updatePayload.webhook_secret_encrypted = webhook_secret;
      updatePayload.has_webhook_secret = true;
    }

    const { data, error } = await supabase
      .from("integration_drovvi_settings")
      .upsert(updatePayload, {
        onConflict: "company_id,provider_name",
      })
      .select()
      .single();

    if (error) throw error;

    // 🧾 Log entry
    await supabase.from("integration_drovvi_logs").insert({
      company_id,
      event_type: "config_saved",
      status: "success",
      message: "Drovvi settings updated",
    });

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      { status: 500 }
    );
  }
});
