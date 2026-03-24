import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function renderTemplate(template: string | null, payload: Record<string, unknown>) {
  if (!template) return null;
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = payload[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

serve(async (req) => {
  try {
    const { event_id } = await req.json();

    if (!event_id) {
      return new Response(JSON.stringify({ success: false, error: "event_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data: event, error: eventError } = await supabase
      .from("notification_events")
      .select("*")
      .eq("id", event_id)
      .single();

    if (eventError || !event) throw eventError || new Error("Notification event not found");

    const payload = (event.payload ?? {}) as Record<string, unknown>;

    const { data: templates, error: templateError } = await supabase
      .from("notification_templates")
      .select("*")
      .eq("is_active", true)
      .or(`event_type.eq."${event.event_type}",trigger_event.eq."${event.event_type}"`);

    if (templateError) throw templateError;

    let processedCount = 0;
    let failedCount = 0;

    for (const template of templates ?? []) {
      const channel = template.channel;
      const recipientType = template.recipient_type ?? "customer";
      const recipientEmail = String(payload.customer_email ?? "");
      const recipientUserId = payload.user_id ? String(payload.user_id) : null;

      const subject = renderTemplate(template.subject_template ?? template.subject ?? null, payload);
      const body = renderTemplate(template.body_template ?? template.body ?? null, payload);
      const title = renderTemplate(template.title ?? subject ?? "Notification", payload);

      const { data: channelConfig } = await supabase.from("communication_channels").select("*").eq("channel_type", channel).eq("is_active", true).limit(1).single(); if (!channelConfig) { throw new Error(`No active config for channel: `); } if (channel === "email") { const { data: emailResp, error: emailError } = await supabase.functions.invoke("send-email", { body: { to: recipientEmail, subject, body, config: channelConfig?.config } }););
          continue;
        }

        const { data: emailResp, error: emailError } = await supabase.functions.invoke("send-email", {
          body: { to: recipientEmail, subject, body, provider: "stub" },
        });

        const logPayload: Record<string, unknown> = {
          event_id: event.id,
          company_id: event.company_id,
          entity_type: event.entity_type,
          entity_id: event.entity_id,
          event_type: event.event_type,
          recipient_type: recipientType,
          recipient_address: recipientEmail,
          channel: "email",
          template_key: template.template_key ?? template.code ?? "unknown",
          subject,
          message_preview: body?.slice(0, 300) ?? null,
        };

        if (emailError || !emailResp?.success) {
          failedCount++;
          await supabase.from("notification_logs").insert({
            ...logPayload,
            status: "failed",
            error_message: emailError?.message ?? emailResp?.error ?? "Email send failed",
            failed_at: new Date().toISOString(),
          });
        } else {
          processedCount++;
          await supabase.from("notification_logs").insert({
            ...logPayload,
            status: "sent",
            provider: emailResp.provider ?? "stub",
            provider_message_id: emailResp.provider_message_id ?? null,
            provider_response: emailResp,
            sent_at: new Date().toISOString(),
          });
        }
      }

      if (channel === "sms") { const recipientPhone = String(payload.customer_phone ?? payload.phone ?? ""); if (!recipientPhone) { failedCount++; await supabase.from("notification_logs").insert({ event_id: event.id, company_id: event.company_id, entity_type: event.entity_type, entity_id: event.entity_id, event_type: event.event_type, recipient_type: recipientType, recipient_address: "missing-phone", channel: "sms", template_key: template.template_key ?? template.code ?? "unknown", subject, message_preview: body?.slice(0, 300) ?? null, status: "failed", error_message: "Missing recipient phone" }); continue; } const { data: smsResp, error: smsError } = await supabase.functions.invoke("send-sms", { body: { to: recipientPhone, body, config: channelConfig?.config } }); const smsLogPayload = { event_id: event.id, company_id: event.company_id, entity_type: event.entity_type, entity_id: event.entity_id, event_type: event.event_type, recipient_type: recipientType, recipient_address: recipientPhone, channel: "sms", template_key: template.template_key ?? template.code ?? "unknown", subject, message_preview: body?.slice(0, 300) ?? null }; if (smsError || !smsResp?.success) { failedCount++; await supabase.from("notification_logs").insert({ ...smsLogPayload, status: "failed", error_message: smsError?.message ?? smsResp?.error ?? "SMS send failed", failed_at: new Date().toISOString() }); } else { processedCount++; await supabase.from("notification_logs").insert({ ...smsLogPayload, status: "sent", provider: smsResp.provider ?? "twilio", provider_message_id: smsResp.provider_message_id ?? null, provider_response: smsResp, sent_at: new Date().toISOString() }); } } if (channel === "whatsapp") { const recipientPhone = String(payload.customer_phone ?? payload.phone ?? ""); if (!recipientPhone) { failedCount++; await supabase.from("notification_logs").insert({ event_id: event.id, company_id: event.company_id, entity_type: event.entity_type, entity_id: event.entity_id, event_type: event.event_type, recipient_type: recipientType, recipient_address: "missing-phone", channel: "whatsapp", template_key: template.template_key ?? template.code ?? "unknown", subject, message_preview: body?.slice(0, 300) ?? null, status: "failed", error_message: "Missing recipient phone" }); continue; } const { data: waResp, error: waError } = await supabase.functions.invoke("send-whatsapp", { body: { to: recipientPhone, body, config: channelConfig?.config } }); const waLogPayload = { event_id: event.id, company_id: event.company_id, entity_type: event.entity_type, entity_id: event.entity_id, event_type: event.event_type, recipient_type: recipientType, recipient_address: recipientPhone, channel: "whatsapp", template_key: template.template_key ?? template.code ?? "unknown", subject, message_preview: body?.slice(0, 300) ?? null }; if (waError || !waResp?.success) { failedCount++; await supabase.from("notification_logs").insert({ ...waLogPayload, status: "failed", error_message: waError?.message ?? waResp?.error ?? "WhatsApp send failed", failed_at: new Date().toISOString() }); } else { processedCount++; await supabase.from("notification_logs").insert({ ...waLogPayload, status: "sent", provider: waResp.provider ?? "twilio_whatsapp", provider_message_id: waResp.provider_message_id ?? null, provider_response: waResp, sent_at: new Date().toISOString() }); } } if (channel === "in_app") {
        if (!recipientUserId) {
          failedCount++;
          await supabase.from("notification_logs").insert({
            event_id: event.id,
            company_id: event.company_id,
            entity_type: event.entity_type,
            entity_id: event.entity_id,
            event_type: event.event_type,
            recipient_type: recipientType,
            recipient_address: "missing-user-id",
            channel: "in_app",
            template_key: template.template_key ?? template.code ?? "unknown",
            subject: title,
            message_preview: body?.slice(0, 300) ?? null,
            status: "failed",
            error_message: "Missing recipient user_id",
          });
          continue;
        }

        const { data: logRow, error: logError } = await supabase
          .from("notification_logs")
          .insert({
            event_id: event.id,
            company_id: event.company_id,
            entity_type: event.entity_type,
            entity_id: event.entity_id,
            event_type: event.event_type,
            recipient_type: recipientType,
            recipient_id: recipientUserId,
            recipient_address: recipientUserId,
            channel: "in_app",
            template_key: template.template_key ?? template.code ?? "unknown",
            subject: title,
            message_preview: body?.slice(0, 300) ?? null,
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (logError || !logRow) {
          failedCount++;
          continue;
        }

        const { error: userNotificationError } = await supabase
          .from("user_notifications")
          .insert({
            company_id: event.company_id,
            user_id: recipientUserId,
            notification_log_id: logRow.id,
            event_type: event.event_type,
            entity_type: event.entity_type,
            entity_id: event.entity_id,
            title: title ?? "Notification",
            message: body ?? "",
            action_url: payload.action_url ?? null,
            priority: "normal",
            status: "unread",
          });

        if (userNotificationError) {
          failedCount++;
        } else {
          processedCount++;
        }
      }
    }

    const finalStatus =
      failedCount === 0 ? "processed" : processedCount > 0 ? "partially_processed" : "failed";

    await supabase
      .from("notification_events")
      .update({
        status: finalStatus,
      templates_found: (templates ?? []).length,
        processed_at: new Date().toISOString(),
      })
      .eq("id", event.id);

    return new Response(JSON.stringify({
      success: true,
      event_id: event.id,
      processed_count: processedCount,
      failed_count: failedCount,
      status: finalStatus,
      templates_found: (templates ?? []).length,
    }), {
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
