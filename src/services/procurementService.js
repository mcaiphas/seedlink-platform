import { supabase } from "@/lib/supabase";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

function normalizePagination(page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE) {
  const safePage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : DEFAULT_PAGE;
  const safePerPage = Number.isFinite(Number(perPage)) ? Math.max(1, Number(perPage)) : DEFAULT_PER_PAGE;

  return {
    page: safePage,
    perPage: safePerPage,
    from: (safePage - 1) * safePerPage,
    to: safePage * safePerPage - 1,
  };
}

function pageResponse({
  items = [],
  count = 0,
  page = DEFAULT_PAGE,
  perPage = DEFAULT_PER_PAGE,
  summary = {},
}) {
  return {
    items,
    totalItems: count || 0,
    totalPages: Math.ceil((count || 0) / perPage),
    page,
    perPage,
    summary,
  };
}

function applySearch(query, search, searchColumns = []) {
  const term = String(search || "").trim();
  if (!term || !searchColumns.length) return query;

  const orClause = searchColumns
    .map((col) => `${col}.ilike.%${term}%`)
    .join(",");

  return query.or(orClause);
}

function applyCommonFilters(query, options = {}, config = {}) {
  const {
    status,
    paymentStatus,
    supplierId,
    dateFrom,
    dateTo,
  } = options;

  const {
    statusColumn = "status",
    paymentStatusColumn = "payment_status",
    supplierColumn = "supplier_id",
    dateColumn = "created_at",
  } = config;

  if (status) query = query.eq(statusColumn, status);
  if (paymentStatus) query = query.eq(paymentStatusColumn, paymentStatus);
  if (supplierId) query = query.eq(supplierColumn, supplierId);
  if (dateFrom) query = query.gte(dateColumn, dateFrom);
  if (dateTo) query = query.lte(dateColumn, dateTo);

  return query;
}

function computeSummary(items = [], amountFields = []) {
  const summary = { count: items.length };

  amountFields.forEach((field) => {
    summary[field] = items.reduce((sum, row) => sum + Number(row?.[field] || 0), 0);
  });

  return summary;
}

async function getList(tableName, options = {}, config = {}) {
  const {
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE,
    search = "",
    sortBy = config.defaultSort?.column || "created_at",
    ascending = config.defaultSort?.ascending ?? false,
  } = options;

  const { from, to } = normalizePagination(page, perPage);

  try {
    let query = supabase
      .from(tableName)
      .select(config.select || "*", { count: "exact" });

    query = applySearch(query, search, config.searchColumns || []);
    query = applyCommonFilters(query, options, config);

    if (sortBy) {
      query = query.order(sortBy, { ascending });
    }

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const items = data || [];
    return pageResponse({
      items,
      count: count || 0,
      page,
      perPage,
      summary: computeSummary(items, config.amountFields || []),
    });
  } catch (error) {
    console.error(`Failed to fetch list from ${tableName}:`, error);
    return pageResponse({
      items: [],
      count: 0,
      page,
      perPage,
      summary: {},
    });
  }
}

async function getSingle(tableName, id, select = "*") {
  const { data, error } = await supabase
    .from(tableName)
    .select(select)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export const procurementService = {
  // -------------------------------------------------------
  // Suppliers
  // -------------------------------------------------------
  async getSuppliers(options = {}) {
    return getList("suppliers", options, {
      searchColumns: ["supplier_name", "supplier_code", "contact_person", "email"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["credit_limit"],
      statusColumn: "status",
      dateColumn: "created_at",
    });
  },

  async getSupplierById(supplierId) {
    return getSingle("suppliers", supplierId, "*");
  },

  async createSupplier(payload) {
    const { data, error } = await supabase
      .from("suppliers")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSupplier(supplierId, payload) {
    const { data, error } = await supabase
      .from("suppliers")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", supplierId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // -------------------------------------------------------
  // Purchase Orders
  // -------------------------------------------------------
  async getPurchaseOrders(options = {}) {
    return getList("purchase_orders", options, {
      searchColumns: ["po_number"],
      defaultSort: { column: "order_date", ascending: false },
      amountFields: ["subtotal", "tax_total", "discount_total", "total_amount"],
      statusColumn: "status",
      paymentStatusColumn: "payment_status",
      supplierColumn: "supplier_id",
      dateColumn: "order_date",
    });
  },

  async getPurchaseOrderById(poId) {
    const po = await getSingle("purchase_orders", poId, "*, suppliers(id, supplier_name, supplier_code)");

    const { data: items, error: itemsError } = await supabase
      .from("purchase_order_items")
      .select("*")
      .eq("purchase_order_id", poId)
      .order("created_at", { ascending: true });

    if (itemsError) throw itemsError;

    return {
      ...po,
      items: items || [],
    };
  },

  async createPurchaseOrder(payload) {
    const { items = [], ...header } = payload;

    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .insert(header)
      .select()
      .single();

    if (poError) throw poError;

    if (items.length) {
      const rows = items.map((item) => ({
        ...item,
        tenant_id: po.tenant_id,
        purchase_order_id: po.id,
        line_total: Math.max(
          (Number(item.quantity || 0) * Number(item.unit_cost || 0)) -
            Number(item.discount_amount || 0) +
            Number(item.tax_amount || 0),
          0
        ),
      }));

      const { error: itemError } = await supabase
        .from("purchase_order_items")
        .insert(rows);

      if (itemError) throw itemError;

      await supabase.rpc("recalculate_purchase_order_totals", {
        p_purchase_order_id: po.id,
      });
    }

    return this.getPurchaseOrderById(po.id);
  },

  async updatePurchaseOrder(poId, payload) {
    const { items, ...header } = payload;

    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .update({
        ...header,
        updated_at: new Date().toISOString(),
      })
      .eq("id", poId)
      .select()
      .single();

    if (poError) throw poError;

    if (Array.isArray(items)) {
      const { error: deleteError } = await supabase
        .from("purchase_order_items")
        .delete()
        .eq("purchase_order_id", poId);

      if (deleteError) throw deleteError;

      if (items.length) {
        const rows = items.map((item) => ({
          ...item,
          tenant_id: po.tenant_id,
          purchase_order_id: po.id,
          line_total: Math.max(
            (Number(item.quantity || 0) * Number(item.unit_cost || 0)) -
              Number(item.discount_amount || 0) +
              Number(item.tax_amount || 0),
            0
          ),
        }));

        const { error: itemError } = await supabase
          .from("purchase_order_items")
          .insert(rows);

        if (itemError) throw itemError;
      }
    }

    await supabase.rpc("recalculate_purchase_order_totals", {
      p_purchase_order_id: poId,
    });

    return this.getPurchaseOrderById(poId);
  },

  async submitPurchaseOrder(poId) {
    const { data, error } = await supabase.rpc("submit_purchase_order_record", {
      p_purchase_order_id: poId,
    });

    if (error) throw error;
    return data;
  },

  async approvePurchaseOrder(poId) {
    const { data, error } = await supabase.rpc("approve_purchase_order_record", {
      p_purchase_order_id: poId,
    });

    if (error) throw error;
    return data;
  },

  async receivePurchaseOrder(poId, payload) {
    const { items = [] } = payload;

    const { data, error } = await supabase.rpc("receive_purchase_order_record", {
      p_purchase_order_id: poId,
      p_items: items,
    });

    if (error) throw error;
    return data;
  },

  // -------------------------------------------------------
  // Supplier Invoices
  // -------------------------------------------------------
  async getSupplierInvoices(options = {}) {
    return getList("supplier_invoices", options, {
      searchColumns: ["invoice_number", "reference"],
      defaultSort: { column: "invoice_date", ascending: false },
      amountFields: ["subtotal", "tax_total", "discount_total", "total_amount", "amount_paid", "balance_due"],
      statusColumn: "status",
      supplierColumn: "supplier_id",
      dateColumn: "invoice_date",
    });
  },

  async getSupplierInvoiceById(invoiceId) {
    const invoice = await getSingle(
      "supplier_invoices",
      invoiceId,
      "*, suppliers(id, supplier_name, supplier_code), purchase_orders(id, po_number)"
    );

    const { data: items, error: itemsError } = await supabase
      .from("supplier_invoice_items")
      .select("*")
      .eq("supplier_invoice_id", invoiceId)
      .order("created_at", { ascending: true });

    if (itemsError) throw itemsError;

    return {
      ...invoice,
      items: items || [],
    };
  },

  async createSupplierInvoice(payload) {
    const { items = [], ...header } = payload;

    const { data: invoice, error: invoiceError } = await supabase
      .from("supplier_invoices")
      .insert(header)
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    if (items.length) {
      const rows = items.map((item) => ({
        ...item,
        tenant_id: invoice.tenant_id,
        supplier_invoice_id: invoice.id,
        line_total: Math.max(
          (Number(item.quantity || 0) * Number(item.unit_cost || 0)) -
            Number(item.discount_amount || 0) +
            Number(item.tax_amount || 0),
          0
        ),
      }));

      const { error: itemError } = await supabase
        .from("supplier_invoice_items")
        .insert(rows);

      if (itemError) throw itemError;

      await supabase.rpc("recalculate_supplier_invoice_totals", {
        p_supplier_invoice_id: invoice.id,
      });
    }

    return this.getSupplierInvoiceById(invoice.id);
  },

  async updateSupplierInvoice(invoiceId, payload) {
    const { items, ...header } = payload;

    const { data: invoice, error: invoiceError } = await supabase
      .from("supplier_invoices")
      .update({
        ...header,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    if (Array.isArray(items)) {
      const { error: deleteError } = await supabase
        .from("supplier_invoice_items")
        .delete()
        .eq("supplier_invoice_id", invoiceId);

      if (deleteError) throw deleteError;

      if (items.length) {
        const rows = items.map((item) => ({
          ...item,
          tenant_id: invoice.tenant_id,
          supplier_invoice_id: invoice.id,
          line_total: Math.max(
            (Number(item.quantity || 0) * Number(item.unit_cost || 0)) -
              Number(item.discount_amount || 0) +
              Number(item.tax_amount || 0),
            0
          ),
        }));

        const { error: itemError } = await supabase
          .from("supplier_invoice_items")
          .insert(rows);

        if (itemError) throw itemError;
      }
    }

    await supabase.rpc("recalculate_supplier_invoice_totals", {
      p_supplier_invoice_id: invoiceId,
    });

    return this.getSupplierInvoiceById(invoiceId);
  },

  async postSupplierInvoice(invoiceId) {
    const { data, error } = await supabase.rpc("post_supplier_invoice_record", {
      p_supplier_invoice_id: invoiceId,
    });

    if (error) throw error;
    return data;
  },

  // -------------------------------------------------------
  // Procurement Dashboard Helpers
  // -------------------------------------------------------
  async getProcurementDashboard() {
    const [suppliersRes, poRes, invoicesRes] = await Promise.all([
      supabase.from("suppliers").select("id, status, credit_limit"),
      supabase.from("purchase_orders").select("id, status, total_amount"),
      supabase.from("supplier_invoices").select("id, status, total_amount, balance_due"),
    ]);

    if (suppliersRes.error) throw suppliersRes.error;
    if (poRes.error) throw poRes.error;
    if (invoicesRes.error) throw invoicesRes.error;

    const suppliers = suppliersRes.data || [];
    const purchaseOrders = poRes.data || [];
    const supplierInvoices = invoicesRes.data || [];

    return {
      activeSuppliers: suppliers.filter((s) => s.status === "active").length,
      openPurchaseOrders: purchaseOrders.filter((p) =>
        ["draft", "submitted", "approved", "partially_received"].includes(p.status)
      ).length,
      pendingSupplierInvoices: supplierInvoices.filter((i) =>
        ["draft", "posted", "partially_paid", "overdue"].includes(i.status)
      ).length,
      totalProcurementValue: purchaseOrders.reduce(
        (sum, row) => sum + Number(row.total_amount || 0),
        0
      ),
      totalInvoiceExposure: supplierInvoices.reduce(
        (sum, row) => sum + Number(row.balance_due || 0),
        0
      ),
    };
  },
};
