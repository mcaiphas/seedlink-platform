import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { company_id, clear_credentials = false } = await req.json();

    if (!company_id) {
      return new Response(
        JSON.stringify({ success: false, error: "company_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings, error: settingsError } = await supabase
      .from("integration_drovvi_settings")
      .select("*")
      .eq("company_id", company_id)
      .eq("provider_name", "drovvi")
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ success: false, error: "Drovvi settings not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatePayload: Record<string, unknown> = {
      is_enabled: false,
      connection_status: "disconnected",
      connection_message: "Integration disconnected by user",
      updated_at: new Date().toISOString(),
    };

    if (clear_credentials) {
      updatePayload.api_key_encrypted = null;
      updatePayload.webhook_secret_encrypted = null;
      updatePayload.has_api_key = false;
      updatePayload.has_webhook_secret = false;
    }

    const { error: updateError } = await supabase
      .from("integration_drovvi_settings")
      .update(updatePayload)
      .eq("id", settings.id);

    if (updateError) throw updateError;

    await supabase.from("integration_drovvi_logs").insert({
      company_id,
      settings_id: settings.id,
      event_type: "disconnect",
      status: "success",
      message: clear_credentials
        ? "Drovvi integration disconnected and credentials cleared"
        : "Drovvi integration disconnected",
      retryable: false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: clear_credentials
          ? "Drovvi integration disconnected and credentials cleared"
          : "Drovvi integration disconnected successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
