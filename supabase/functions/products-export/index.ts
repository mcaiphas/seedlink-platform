import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toExportRows(products: any[]) {
  return products.map((p) => ({
    name: p.name ?? "",
    sku: p.sku ?? "",
    category: p.category ?? "",
    brand: p.brand ?? "",
    description: p.description ?? "",
    short_description: p.short_description ?? "",
    price: p.price ?? "",
    compare_at_price: p.compare_at_price ?? "",
    currency_code: p.currency_code ?? "",
    stock_quantity: p.stock_quantity ?? "",
    status: p.status ?? "",
    base_uom: p.base_uom ?? "",
    shipping_weight_kg: p.shipping_weight_kg ?? "",
    image_url: p.image_url ?? "",
    barcode: p.metadata?.barcode ?? "",
    handle: p.metadata?.handle ?? "",
    external_id: p.metadata?.external_id ?? "",
    shopify_product_id: p.metadata?.shopify_product_id ?? "",
    shopify_variant_id: p.metadata?.shopify_variant_id ?? "",
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const { format = "csv", scope = "all", filters = {} } = await req.json();

    const orgId = filters.organization_id ?? null;

    const { data: allowed, error: permError } = await serviceClient.rpc(
      "user_has_permission",
      {
        p_permission: "products:export",
        p_org_id: orgId,
        p_user_id: user.id,
      },
    );

    if (permError) {
      throw permError;
    }

    if (!allowed) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let query = serviceClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (scope === "filtered") {
      if (filters.search) query = query.ilike("name", `%${filters.search}%`);
      if (filters.category) query = query.eq("category", filters.category);
      if (filters.category_id) query = query.eq("category_id", filters.category_id);
      if (filters.supplier_id) query = query.eq("supplier_id", filters.supplier_id);
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.brand) query = query.eq("brand", filters.brand);
      if (filters.sku) query = query.eq("sku", filters.sku);
      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }
      if (filters.organization_id) {
        query = query.eq("organization_id", filters.organization_id);
      }
    } else if (filters.organization_id) {
      query = query.eq("organization_id", filters.organization_id);
    }

    const { data: products, error } = await query;
    if (error) throw error;

    const rows = toExportRows(products ?? []);

    if (format === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      const xlsxBuffer = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
      });

      return new Response(xlsxBuffer, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="products-export.xlsx"',
        },
      });
    }

    const headers = Object.keys(
      rows[0] ?? {
        name: "",
        sku: "",
        category: "",
        brand: "",
        description: "",
        short_description: "",
        price: "",
        compare_at_price: "",
        currency_code: "",
        stock_quantity: "",
        status: "",
        base_uom: "",
        shipping_weight_kg: "",
        image_url: "",
        barcode: "",
        handle: "",
        external_id: "",
        shopify_product_id: "",
        shopify_variant_id: "",
      },
    );

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => escapeCsv((row as Record<string, unknown>)[h]))
          .join(",")
      ),
    ].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="products-export.csv"',
      },
    });
  } catch (err: any) {
    console.error("products-export failed", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
