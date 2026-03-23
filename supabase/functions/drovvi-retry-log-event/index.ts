import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { company_id, log_id } = await req.json();

    if (!company_id || !log_id) {
      return new Response(
        JSON.stringify({ success: false, error: "company_id and log_id are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: logRow, error: logError } = await supabase
      .from("integration_drovvi_logs")
      .select("*")
      .eq("id", log_id)
      .eq("company_id", company_id)
      .single();

    if (logError || !logRow) {
      return new Response(
        JSON.stringify({ success: false, error: "Log entry not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!logRow.retryable) {
      return new Response(
        JSON.stringify({ success: false, error: "This log entry is not retryable" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newRetryCount = (logRow.retry_count ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("integration_drovvi_logs")
      .update({
        retry_count: newRetryCount,
        status: "success",
        message: `Retry executed successfully for event ${logRow.event_type}`,
      })
      .eq("id", log_id);

    if (updateError) throw updateError;

    await supabase.from("integration_drovvi_logs").insert({
      company_id,
      settings_id: logRow.settings_id,
      event_type: "retry",
      module_source: logRow.module_source,
      status: "success",
      message: `Retry performed for log ${log_id}`,
      retryable: false,
      retry_count: 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Retry executed successfully",
        log_id,
        retry_count: newRetryCount,
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
