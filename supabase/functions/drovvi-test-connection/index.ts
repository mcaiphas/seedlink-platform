import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { company_id } = await req.json();

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

    if (!settings.api_base_url || !settings.has_api_key) {
      await supabase.from("integration_drovvi_logs").insert({
        company_id,
        settings_id: settings.id,
        event_type: "connection_test",
        status: "error",
        message: "Missing API base URL or API key",
        retryable: false,
      });

      await supabase
        .from("integration_drovvi_settings")
        .update({
          connection_status: "error",
          connection_message: "Missing API base URL or API key",
          last_tested_at: new Date().toISOString(),
          last_test_result: "failed",
          last_failed_sync_at: new Date().toISOString(),
          failed_sync_count: (settings.failed_sync_count ?? 0) + 1,
        })
        .eq("id", settings.id);

      return new Response(
        JSON.stringify({
          success: false,
          status: "error",
          message: "Missing API base URL or API key",
          health: {
            api_connectivity: "unknown",
            auth_status: "invalid",
            webhook_status: settings.has_webhook_secret ? "configured" : "missing",
            overall_status: "critical",
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let apiConnectivity = "healthy";
    let authStatus = "valid";
    let webhookStatus = settings.has_webhook_secret ? "configured" : "missing";
    let overallStatus = "healthy";
    let message = "Connection test successful";

    try {
      const resp = await fetch(settings.api_base_url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${settings.api_key_encrypted ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        apiConnectivity = resp.status >= 500 ? "down" : "healthy";
        authStatus = resp.status === 401 || resp.status === 403 ? "invalid" : "valid";
        overallStatus = authStatus === "invalid" ? "critical" : "warning";
        message = `Connection test failed with status ${resp.status}`;
      }
    } catch (_err) {
      apiConnectivity = "down";
      authStatus = "unknown";
      overallStatus = "critical";
      message = "Unable to reach Drovvi API";
    }

    const success = overallStatus === "healthy";

    await supabase
      .from("integration_drovvi_settings")
      .update({
        connection_status: success ? "connected" : "error",
        connection_message: message,
        last_tested_at: new Date().toISOString(),
        last_test_result: success ? "success" : "failed",
        last_successful_sync_at: success ? new Date().toISOString() : settings.last_successful_sync_at,
        last_failed_sync_at: success ? settings.last_failed_sync_at : new Date().toISOString(),
        failed_sync_count: success ? 0 : (settings.failed_sync_count ?? 0) + 1,
      })
      .eq("id", settings.id);

    await supabase.from("integration_drovvi_logs").insert({
      company_id,
      settings_id: settings.id,
      event_type: "connection_test",
      status: success ? "success" : "error",
      message,
      retryable: !success,
    });

    return new Response(
      JSON.stringify({
        success,
        status: success ? "connected" : "error",
        message,
        health: {
          api_connectivity: apiConnectivity,
          auth_status: authStatus,
          webhook_status: webhookStatus,
          overall_status: overallStatus,
        },
        tested_at: new Date().toISOString(),
      }),
      {
        status: success ? 200 : 400,
        headers: { "Content-Type": "application/json" },
      }
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
