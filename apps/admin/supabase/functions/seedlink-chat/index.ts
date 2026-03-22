import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  general: `You are Seedlink AI, an intelligent assistant for the Seedlink agribusiness platform. You help farmers, agronomists, sales teams, operations teams, and executives with questions about agriculture, farm planning, products, orders, inventory, logistics, and finance. Keep answers practical, actionable, and concise. Use markdown formatting. When suggesting actions, be specific about what the user should do in the Seedlink platform.`,

  agronomy: `You are the Seedlink Agronomy Assistant. You specialize in crop production advice for Southern African agriculture including:
- Seed selection and planting recommendations for maize, soybean, sunflower, wheat, vegetables
- Fertilizer programs (NPK, lime, foliar feeds)
- Pest and disease management (spray programs, IPM)
- Soil health and interpretation of soil analysis
- Irrigation planning
- Crop calendars and seasonal planning
- Yield optimization strategies
Always consider the farmer's region, soil type, and farming system. Reference Seedlink products when relevant. Use markdown formatting.`,

  operations: `You are the Seedlink Operations Assistant. You help with:
- Order management and tracking
- Delivery and logistics planning
- Depot and inventory management
- Stock levels and replenishment
- Dispatch and vehicle coordination
- Customer service queries
Provide practical, step-by-step operational guidance. Use markdown formatting.`,

  finance: `You are the Seedlink Finance Assistant. You help with:
- Revenue analysis and reporting
- Accounts receivable and payable
- Customer aging and credit control
- Profitability analysis by product, customer, region
- VAT and tax queries
- Journal entries and accounting periods
- Cash flow and banking reconciliation
Provide clear financial insights. Use markdown formatting.`,

  knowledge: `You are the Seedlink Knowledge Assistant. You help users learn about:
- Agricultural best practices
- Seedlink platform features and workflows
- Training course content
- Agronomy guides and manuals
- Product information and usage
Be educational, clear, and reference Seedlink training materials when relevant. Use markdown formatting.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, assistant_type = "general" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[assistant_type] || SYSTEM_PROMPTS.general;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
