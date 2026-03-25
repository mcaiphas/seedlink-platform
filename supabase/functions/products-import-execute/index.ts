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
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { import_job_id, upsert_key = "sku" } = await req.json();

    if (!import_job_id) {
      return new Response(JSON.stringify({ success: false, error: "import_job_id is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: job, error: jobError } = await supabase
      .from("product_import_jobs")
      .select("*")
      .eq("id", import_job_id)
      .maybeSingle();

    if (jobError) throw jobError;
    if (!job) {
      return new Response(JSON.stringify({ success: false, error: `Import job not found: ${import_job_id}` }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    await supabase
      .from("product_import_jobs")
      .update({ status: "processing" })
      .eq("id", import_job_id);

    const { data: rows, error: rowsError } = await supabase
      .from("product_import_rows")
      .select("*")
      .eq("import_job_id", import_job_id)
      .eq("validation_status", "valid")
      .order("row_number", { ascending: true });

    if (rowsError) throw rowsError;

    let successRows = 0;
    let failedRows = 0;
    let createdCount = 0;
    let updatedCount = 0;
    const results: Array<Record<string, unknown>> = [];

    for (const row of rows ?? []) {
      try {
        const raw = row.raw_data_json ?? {};
        const sku = raw.sku ?? null;
        const name = raw.name ?? null;

        if (!name) throw new Error("Product name is required");
        if (upsert_key === "sku" && !sku) throw new Error("SKU is required for SKU upsert");

        let existingProduct: any = null;

        if (upsert_key === "sku" && sku) {
          const { data } = await supabase
            .from("products")
            .select("id, sku")
            .eq("sku", sku)
            .maybeSingle();
          existingProduct = data;
        }

        const productPayload = {
          name,
          category: raw.category ?? null,
          price: raw.price ?? 0,
          description: raw.description ?? null,
          sku: sku,
          product_type: raw.product_type ?? "physical",
          status: raw.status ?? "draft",
          currency_code: raw.currency_code ?? "ZAR",
          compare_at_price: raw.compare_at_price ?? null,
          stock_quantity: raw.stock_quantity ?? 0,
          is_active: raw.is_active ?? true,
          requires_shipping: raw.requires_shipping ?? true,
          metadata: {
            ...(raw.metadata ?? {}),
            external_id: raw.external_id ?? null,
            barcode: raw.barcode ?? null,
            handle: raw.handle ?? null,
            supplier_sku: raw.supplier_sku ?? null,
            shopify_product_id: raw.shopify_product_id ?? null,
            shopify_variant_id: raw.shopify_variant_id ?? null,
          },
          subcategory_id: raw.subcategory_id ?? null,
          supplier_id: raw.supplier_id ?? null,
          brand: raw.brand ?? null,
          base_uom: raw.base_uom ?? "unit",
          track_inventory: raw.track_inventory ?? true,
          allow_backorder: raw.allow_backorder ?? false,
          shipping_weight_kg: raw.shipping_weight_kg ?? null,
          length_cm: raw.length_cm ?? null,
          width_cm: raw.width_cm ?? null,
          height_cm: raw.height_cm ?? null,
          category_id: raw.category_id ?? null,
          sku_base: raw.sku_base ?? null,
          short_description: raw.short_description ?? null,
          default_buying_price: raw.default_buying_price ?? raw.cost_price ?? null,
          default_selling_price: raw.default_selling_price ?? raw.price ?? null,
          default_margin_percent: raw.default_margin_percent ?? null,
          depot_id: raw.depot_id ?? null,
          organization_id: raw.organization_id ?? null,
          image_url: raw.image_url ?? null,
          is_variant_product: raw.is_variant_product ?? false,
          updated_at: new Date().toISOString(),
        };

        let savedProduct: any = null;
        let operation: "created" | "updated" = "created";

        if (existingProduct?.id) {
          const { data, error } = await supabase
            .from("products")
            .update(productPayload)
            .eq("id", existingProduct.id)
            .select("id")
            .single();

          if (error) throw error;
          savedProduct = data;
          operation = "updated";
          updatedCount++;
        } else {
          const { data, error } = await supabase
            .from("products")
            .insert(productPayload)
            .select("id")
            .single();

          if (error) throw error;
          savedProduct = data;
          operation = "created";
          createdCount++;
        }

        const { error: rowUpdateError } = await supabase
          .from("product_import_rows")
          .update({
            validation_status: "imported",
            error_message: null,
            created_product_id: savedProduct.id,
          })
          .eq("id", row.id);

        if (rowUpdateError) throw rowUpdateError;

        successRows++;
        results.push({
          row_number: row.row_number,
          status: operation,
          created_product_id: savedProduct.id,
        });
      } catch (err: any) {
        failedRows++;
        await supabase
          .from("product_import_rows")
          .update({
            validation_status: "failed",
            error_message: err?.message ?? "Unknown row processing error",
          })
          .eq("id", row.id);

        results.push({
          row_number: row.row_number,
          status: "failed",
          error_message: err?.message ?? "Unknown row processing error",
        });
      }
    }

    const finalStatus = failedRows > 0 ? "failed" : "completed";

    const { error: jobUpdateError } = await supabase
      .from("product_import_jobs")
      .update({
        status: finalStatus,
        success_rows: successRows,
        failed_rows: failedRows,
        completed_at: new Date().toISOString(),
      })
      .eq("id", import_job_id);

    if (jobUpdateError) throw jobUpdateError;

    return new Response(JSON.stringify({
      success: true,
      import_job_id,
      summary: {
        total_rows: rows?.length ?? 0,
        success_rows: successRows,
        failed_rows: failedRows,
        created: createdCount,
        updated: updatedCount,
      },
      results,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err?.message ?? "Unknown error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
