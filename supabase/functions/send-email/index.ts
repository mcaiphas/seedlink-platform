import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

serve(async (req) => {
  try {
    const { to, subject, body, provider = "stub", config = {} } = await req.json();

    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ success: false, error: "to, subject, and body are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (provider === "resend") {
      const apiKey = config?.api_key ?? Deno.env.get("RESEND_API_KEY");
      if (!apiKey) throw new Error("Missing RESEND_API_KEY");

      const resend = new Resend(apiKey);
      const fromEmail = config?.from_email ?? "onboarding@resend.dev";

      const { data, error } = await resend.emails.send({
        from: `Seedlink <${fromEmail}>`,
        to: [to],
        subject,
        html: body,
      });

      if (error) throw new Error(error.message);

      return new Response(JSON.stringify({
        success: true,
        provider: "resend",
        provider_message_id: data?.id ?? null
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      provider,
      provider_message_id: crypto.randomUUID(),
      message: "Email accepted by stub sender",
      preview: { to, subject, body }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
