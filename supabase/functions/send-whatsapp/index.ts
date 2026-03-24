import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { to, body, config = {} } = await req.json();
    if (!to || !body) return new Response(JSON.stringify({ success: false, error: "to and body are required" }), { status: 400, headers: { "Content-Type": "application/json" } });

    const accountSid = config.account_sid ?? Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = config.auth_token ?? Deno.env.get("TWILIO_AUTH_TOKEN");
    const from = config.from_number ?? Deno.env.get("TWILIO_WHATSAPP_FROM");

    if (!accountSid || !authToken || !from) {
      return new Response(JSON.stringify({ success: false, error: "Missing Twilio WhatsApp config" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const auth = btoa(`${accountSid}:${authToken}`);
    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
        From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
        Body: body,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.message ?? "WhatsApp send failed");

    return new Response(JSON.stringify({ success: true, provider: "twilio_whatsapp", provider_message_id: data.sid, provider_response: data }), {
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
