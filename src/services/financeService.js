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

function safeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
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
    type,
    bucket,
    customerId,
    supplierId,
    productId,
    depotId,
    transactionType,
    operationType,
    dateFrom,
    dateTo,
    extraFilters = {},
  } = options;

  const {
    statusColumn = "status",
    typeColumn = "type",
    bucketColumn = "aging_bucket",
    customerColumn = "customer_id",
    supplierColumn = "supplier_id",
    productColumn = "product_id",
    depotColumn = "depot_id",
    transactionTypeColumn = "transaction_type",
    operationTypeColumn = "operation_type",
    dateColumn = "created_at",
  } = config;

  if (status) query = query.eq(statusColumn, status);
  if (type) query = query.eq(typeColumn, type);
  if (bucket) query = query.eq(bucketColumn, bucket);
  if (customerId) query = query.eq(customerColumn, customerId);
  if (supplierId) query = query.eq(supplierColumn, supplierId);
  if (productId) query = query.eq(productColumn, productId);
  if (depotId) query = query.eq(depotColumn, depotId);
  if (transactionType) query = query.eq(transactionTypeColumn, transactionType);
  if (operationType) query = query.eq(operationTypeColumn, operationType);

  if (dateFrom) query = query.gte(dateColumn, dateFrom);
  if (dateTo) query = query.lte(dateColumn, dateTo);

  Object.entries(extraFilters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query = query.eq(key, value);
  });

  return query;
}

function computeSummary(items = [], config = {}) {
  const amountFields = safeArray(config.amountFields);
  const summary = {
    count: items.length,
  };

  amountFields.forEach((field) => {
    summary[field] = items.reduce((sum, row) => {
      const value = Number(row?.[field] ?? 0);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  });

  return summary;
}

async function getFinanceList(tableName, options = {}, config = {}) {
  const {
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE,
    search = "",
    sortBy = config.defaultSort?.column || "created_at",
    ascending = config.defaultSort?.ascending ?? false,
  } = options;

  const { from, to } = normalizePagination(page, perPage);

  const selectColumns = config.select || "*";
  const searchColumns = safeArray(config.searchColumns);

  try {
    let query = supabase
      .from(tableName)
      .select(selectColumns, { count: "exact" });

    query = applySearch(query, search, searchColumns);
    query = applyCommonFilters(query, options, config);

    if (sortBy) {
      query = query.order(sortBy, { ascending });
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.warn(`Finance list error for ${tableName}:`, error);
      return pageResponse({
        items: [],
        count: 0,
        page,
        perPage,
        summary: {},
      });
    }

    const items = data || [];
    const summary = computeSummary(items, config);

    return pageResponse({
      items,
      count: count || 0,
      page,
      perPage,
      summary,
    });
  } catch (error) {
    console.error(`Unexpected finance list error for ${tableName}:`, error);
    return pageResponse({
      items: [],
      count: 0,
      page,
      perPage,
      summary: {},
    });
  }
}

async function upsertFinanceRecord(tableName, payload, conflictColumn) {
  try {
    let query = supabase.from(tableName).upsert(payload);

    if (conflictColumn) {
      query = supabase.from(tableName).upsert(payload, { onConflict: conflictColumn });
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Upsert failed for ${tableName}:`, error);
    return { data: null, error };
  }
}

async function deleteFinanceRecord(tableName, id) {
  try {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error(`Delete failed for ${tableName}:`, error);
    return { success: false, error };
  }
}

export const financeService = {
  // -------------------------------------------------------
  // Generic helpers
  // -------------------------------------------------------
  getFinanceList,
  upsertFinanceRecord,
  deleteFinanceRecord,

  // -------------------------------------------------------
  // 1. Credit Control
  // -------------------------------------------------------
  async getCreditControl(options = {}) {
    return getFinanceList("credit_control", options, {
      searchColumns: ["customer_name", "status", "risk_rating", "notes"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["credit_limit", "credit_used", "available_credit"],
      dateColumn: "created_at",
    });
  },

  // -------------------------------------------------------
  // 2. Customer Aging
  // -------------------------------------------------------
  async getCustomerAging(options = {}) {
    return getFinanceList("customer_aging", options, {
      searchColumns: ["customer_name", "invoice_number", "status"],
      defaultSort: { column: "due_date", ascending: false },
      amountFields: ["amount_due"],
      dateColumn: "invoice_date",
      bucketColumn: "aging_bucket",
      customerColumn: "customer_id",
    });
  },

  // -------------------------------------------------------
  // 3. Supplier Aging
  // -------------------------------------------------------
  async getSupplierAging(options = {}) {
    return getFinanceList("supplier_aging", options, {
      searchColumns: ["supplier_name", "invoice_number", "status"],
      defaultSort: { column: "due_date", ascending: false },
      amountFields: ["amount_due"],
      dateColumn: "invoice_date",
      bucketColumn: "aging_bucket",
      supplierColumn: "supplier_id",
    });
  },

  // -------------------------------------------------------
  // 4. Customer Credit Notes
  // -------------------------------------------------------
  async getCustomerCreditNotes(options = {}) {
    return getFinanceList("customer_credit_notes", options, {
      searchColumns: ["customer_name", "reference", "credit_note_number", "reason", "status"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["amount", "tax_amount", "total_amount"],
      dateColumn: "created_at",
      customerColumn: "customer_id",
    });
  },

  // -------------------------------------------------------
  // 5. Supplier Credit Notes
  // -------------------------------------------------------
  async getSupplierCreditNotes(options = {}) {
    return getFinanceList("supplier_credit_notes", options, {
      searchColumns: ["supplier_name", "reference", "credit_note_number", "reason", "status"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["amount", "tax_amount", "total_amount"],
      dateColumn: "created_at",
      supplierColumn: "supplier_id",
    });
  },

  // -------------------------------------------------------
  // 6. Refunds
  // -------------------------------------------------------
  async getRefunds(options = {}) {
    return getFinanceList("refunds", options, {
      searchColumns: ["customer_name", "reference", "refund_number", "reason", "status"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["amount"],
      dateColumn: "refund_date",
      customerColumn: "customer_id",
    });
  },

  // -------------------------------------------------------
  // 7. Supplier Payments
  // -------------------------------------------------------
  async getSupplierPayments(options = {}) {
    return getFinanceList("supplier_payments", options, {
      searchColumns: ["supplier_name", "reference", "payment_number", "status"],
      defaultSort: { column: "payment_date", ascending: false },
      amountFields: ["amount"],
      dateColumn: "payment_date",
      supplierColumn: "supplier_id",
      typeColumn: "payment_method",
    });
  },

  // -------------------------------------------------------
  // 8. Customer Statements
  // -------------------------------------------------------
  async getCustomerStatements(options = {}) {
    return getFinanceList("customer_statements", options, {
      searchColumns: ["customer_name", "status"],
      defaultSort: { column: "statement_date", ascending: false },
      amountFields: ["opening_balance", "total_debits", "total_credits", "closing_balance"],
      dateColumn: "statement_date",
      customerColumn: "customer_id",
    });
  },

  // -------------------------------------------------------
  // 9. Supplier Statements
  // -------------------------------------------------------
  async getSupplierStatements(options = {}) {
    return getFinanceList("supplier_statements", options, {
      searchColumns: ["supplier_name", "status"],
      defaultSort: { column: "statement_date", ascending: false },
      amountFields: ["opening_balance", "total_debits", "total_credits", "closing_balance"],
      dateColumn: "statement_date",
      supplierColumn: "supplier_id",
    });
  },

  // -------------------------------------------------------
  // 10. Communication Logs
  // -------------------------------------------------------
  async getCommunicationLogs(options = {}) {
    return getFinanceList("communication_logs", options, {
      searchColumns: ["recipient", "subject", "message", "status", "external_provider"],
      defaultSort: { column: "created_at", ascending: false },
      dateColumn: "created_at",
      typeColumn: "contact_type",
    });
  },

  // -------------------------------------------------------
  // 11. Notification Templates
  // -------------------------------------------------------
  async getNotificationTemplates(options = {}) {
    return getFinanceList("notification_templates", options, {
      searchColumns: ["name", "code", "subject", "body", "status"],
      defaultSort: { column: "created_at", ascending: false },
      dateColumn: "created_at",
      typeColumn: "type",
    });
  },

  // -------------------------------------------------------
  // 12. Operations Finance
  // -------------------------------------------------------
  async getOperationsFinance(options = {}) {
    return getFinanceList("operations_finance", options, {
      searchColumns: ["description", "reference", "status", "operation_type"],
      defaultSort: { column: "transaction_date", ascending: false },
      amountFields: ["amount"],
      dateColumn: "transaction_date",
      operationTypeColumn: "operation_type",
    });
  },

  // -------------------------------------------------------
  // 13. Inventory Valuation
  // -------------------------------------------------------
  async getInventoryValuation(options = {}) {
    return getFinanceList("inventory_valuation", options, {
      searchColumns: ["product_name", "sku", "valuation_method"],
      defaultSort: { column: "valuation_date", ascending: false },
      amountFields: ["quantity", "unit_cost", "total_value"],
      dateColumn: "valuation_date",
      productColumn: "product_id",
      depotColumn: "depot_id",
      typeColumn: "valuation_method",
    });
  },

  // -------------------------------------------------------
  // 14. Commerce Accounting
  // -------------------------------------------------------
  async getCommerceAccounting(options = {}) {
    return getFinanceList("commerce_accounting", options, {
      searchColumns: ["reference", "account_code", "account_name", "status", "source_type"],
      defaultSort: { column: "posting_date", ascending: false },
      amountFields: ["amount"],
      dateColumn: "posting_date",
      transactionTypeColumn: "transaction_type",
    });
  },
};
