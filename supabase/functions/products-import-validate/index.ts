import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { file_name, file_type, import_source, rows, mapping } = await req.json();

    if (!rows || !Array.isArray(rows)) {
      return new Response(JSON.stringify({ success: false, error: "rows array is required" }), { status: 400, headers: corsHeaders });
    }

    const { data: job, error: jobError } = await supabase
      .from("product_import_jobs")
      .insert({
        file_name,
        file_type,
        import_source,
        status: "validated",
        total_rows: rows.length,
        success_rows: 0,
        failed_rows: 0,
      })
      .select()
      .single();

    if (jobError) throw jobError;

    const seenSkus = new Set<string>();
    let successCount = 0;
    let failedCount = 0;

    const stagedRows = rows.map((row: any, index: number) => {
      const rowNumber = index + 1;
      const normalized: Record<string, any> = {};

      for (const key in (mapping || {})) {
        normalized[mapping[key]] = row[key];
      }

      normalized.name = normalized.name ?? row.name ?? row.Title ?? null;
      normalized.sku = normalized.sku ?? row.sku ?? row["Variant SKU"] ?? null;
      normalized.price = Number(normalized.price ?? row.price ?? row["Variant Price"] ?? 0);
      normalized.category = normalized.category ?? row.category ?? row.Type ?? null;
      normalized.brand = normalized.brand ?? row.brand ?? row.Vendor ?? null;
      normalized.currency_code = normalized.currency_code ?? "ZAR";
      normalized.product_type = "physical";
      normalized.status = normalized.status ?? "draft";
      normalized.stock_quantity = Number(normalized.stock_quantity ?? row.stock_quantity ?? 0);
      normalized.base_uom = normalized.base_uom ?? "unit";

      let validationStatus = "valid";
      let errorMessage = "";

      if (!normalized.name) {
        validationStatus = "invalid";
        errorMessage = "Product name is required";
      } else if (!normalized.sku) {
        validationStatus = "invalid";
        errorMessage = "SKU is required";
      } else if (seenSkus.has(normalized.sku)) {
        validationStatus = "invalid";
        errorMessage = "Duplicate SKU in file";
      } else if (Number.isNaN(normalized.price) || normalized.price < 0) {
        validationStatus = "invalid";
        errorMessage = "Price must be >= 0";
      }

      if (normalized.sku) seenSkus.add(normalized.sku);

      if (validationStatus === "valid") successCount++;
      else failedCount++;

      return {
        import_job_id: job.id,
        row_number: rowNumber,
        raw_data_json: normalized,
        validation_status: validationStatus,
        error_message: validationStatus === "valid" ? null : errorMessage,
      };
    });

    const { error: insertError } = await supabase
      .from("product_import_rows")
      .insert(stagedRows);

    if (insertError) throw insertError;

    await supabase
      .from("product_import_jobs")
      .update({
        success_rows: successCount,
        failed_rows: failedCount,
      })
      .eq("id", job.id);

    return new Response(JSON.stringify({
      success: true,
      import_job_id: job.id,
      summary: {
        total_rows: rows.length,
        valid_rows: successCount,
        invalid_rows: failedCount,
      },
    }), { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err?.message ?? "Unknown error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
