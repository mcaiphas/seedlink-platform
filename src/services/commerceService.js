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
    orderStatus,
    type,
    dateFrom,
    dateTo,
    customerId,
  } = options;

  const {
    statusColumn = "status",
    paymentStatusColumn = "payment_status",
    orderStatusColumn = "order_status",
    typeColumn = "discount_type",
    dateColumn = "created_at",
    customerColumn = "customer_id",
  } = config;

  if (status) query = query.eq(statusColumn, status);
  if (paymentStatus) query = query.eq(paymentStatusColumn, paymentStatus);
  if (orderStatus) query = query.eq(orderStatusColumn, orderStatus);
  if (type) query = query.eq(typeColumn, type);
  if (customerId) query = query.eq(customerColumn, customerId);
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

async function upsert(tableName, payload, onConflict) {
  let query = supabase.from(tableName).upsert(payload);
  if (onConflict) {
    query = supabase.from(tableName).upsert(payload, { onConflict });
  }

  const { data, error } = await query.select();
  if (error) throw error;
  return data;
}

async function remove(tableName, id) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);
  if (error) throw error;
  return true;
}

export const commerceService = {
  // -------------------------------------------------------
  // Customers / addresses
  // -------------------------------------------------------
  async getCustomerProfileByUserId(userId) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createCustomerAddress(payload) {
    const { data, error } = await supabase
      .from("addresses")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCustomerAddresses(customerId) {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // -------------------------------------------------------
  // Cart
  // -------------------------------------------------------
  async getOrCreateCart({ customerId = null, sessionId = null, tenantId = null } = {}) {
    let query = supabase
      .from("carts")
      .select("*")
      .eq("status", "active")
      .limit(1);

    if (customerId) query = query.eq("customer_id", customerId);
    if (!customerId && sessionId) query = query.eq("session_id", sessionId);

    const { data: existing, error: existingError } = await query.maybeSingle();
    if (existingError) throw existingError;
    if (existing) return existing;

    const insertPayload = {
      tenant_id: tenantId,
      customer_id: customerId,
      session_id: sessionId,
      status: "active",
      currency_code: "ZAR",
    };

    const { data, error } = await supabase
      .from("carts")
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCart(cartId) {
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("id", cartId)
      .single();

    if (cartError) throw cartError;

    const { data: items, error: itemsError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .order("created_at", { ascending: true });

    if (itemsError) throw itemsError;

    return {
      ...cart,
      items: items || [],
    };
  },

  async addCartItem(payload) {
    const { cart_id, product_id, quantity, unit_price, product_name, sku, metadata = {} } = payload;

    const { data: existing, error: existingError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart_id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      const newQuantity = Number(existing.quantity || 0) + Number(quantity || 0);

      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
          line_total: (newQuantity * Number(existing.unit_price || unit_price || 0)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc("recalculate_cart_totals", { p_cart_id: cart_id });
      return data;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        ...payload,
        product_name,
        sku,
        quantity,
        unit_price,
        line_total: Number(quantity || 0) * Number(unit_price || 0),
        metadata,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc("recalculate_cart_totals", { p_cart_id: cart_id });
    return data;
  },

  async updateCartItem(cartItemId, payload) {
    const { data: existing, error: existingError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("id", cartItemId)
      .single();

    if (existingError) throw existingError;

    const nextQuantity = Number(payload.quantity ?? existing.quantity);
    const nextUnitPrice = Number(payload.unit_price ?? existing.unit_price);
    const nextDiscount = Number(payload.discount_amount ?? existing.discount_amount ?? 0);
    const nextTax = Number(payload.tax_amount ?? existing.tax_amount ?? 0);

    const { data, error } = await supabase
      .from("cart_items")
      .update({
        ...payload,
        line_total: Math.max((nextQuantity * nextUnitPrice) - nextDiscount + nextTax, 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartItemId)
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc("recalculate_cart_totals", { p_cart_id: existing.cart_id });
    return data;
  },

  async removeCartItem(cartItemId) {
    const { data: existing, error: existingError } = await supabase
      .from("cart_items")
      .select("id, cart_id")
      .eq("id", cartItemId)
      .single();

    if (existingError) throw existingError;

    await remove("cart_items", cartItemId);
    await supabase.rpc("recalculate_cart_totals", { p_cart_id: existing.cart_id });
    return true;
  },

  async applyDiscountCode({ cartId, code }) {
    const { data, error } = await supabase.rpc("apply_discount_code_to_cart", {
      p_cart_id: cartId,
      p_code: code,
    });

    if (error) throw error;
    return data;
  },

  async removeDiscountCode(cartId) {
    const { data, error } = await supabase
      .from("carts")
      .update({
        discount_code: null,
        discount_total: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartId)
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc("recalculate_cart_totals", { p_cart_id: cartId });
    return data;
  },

  // -------------------------------------------------------
  // Checkout
  // -------------------------------------------------------
  async startCheckout({ cartId, customerId = null }) {
    const { data, error } = await supabase.rpc("start_checkout_session", {
      p_cart_id: cartId,
      p_customer_id: customerId,
    });

    if (error) throw error;
    return data;
  },

  async updateCheckoutSession(checkoutSessionId, payload) {
    const { billing_address, shipping_address, ...sessionFields } = payload;

    let billingAddressId = sessionFields.billing_address_id || null;
    let shippingAddressId = sessionFields.shipping_address_id || null;
    let customerId = sessionFields.customer_id || null;
    let tenantId = sessionFields.tenant_id || null;

    if (billing_address?.customer_id && !customerId) customerId = billing_address.customer_id;
    if (billing_address?.tenant_id && !tenantId) tenantId = billing_address.tenant_id;
    if (shipping_address?.customer_id && !customerId) customerId = shipping_address.customer_id;
    if (shipping_address?.tenant_id && !tenantId) tenantId = shipping_address.tenant_id;

    if (billing_address) {
      const billing = await this.createCustomerAddress({
        ...billing_address,
        customer_id: customerId,
        tenant_id: tenantId,
        address_type: "billing",
      });
      billingAddressId = billing.id;
    }

    if (shipping_address) {
      const shipping = await this.createCustomerAddress({
        ...shipping_address,
        customer_id: customerId,
        tenant_id: tenantId,
        address_type: "shipping",
      });
      shippingAddressId = shipping.id;
    }

    const { data, error } = await supabase
      .from("checkout_sessions")
      .update({
        ...sessionFields,
        customer_id: customerId,
        billing_address_id: billingAddressId,
        shipping_address_id: shippingAddressId,
        checkout_status: "address_captured",
        updated_at: new Date().toISOString(),
      })
      .eq("id", checkoutSessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitCheckout(checkoutSessionId) {
    const { data, error } = await supabase.rpc("submit_checkout_session", {
      p_checkout_session_id: checkoutSessionId,
    });

    if (error) throw error;
    return data;
  },

  // -------------------------------------------------------
  // Payments
  // -------------------------------------------------------
  async createPaymentIntent({ checkoutSessionId, paymentMethod, provider = null }) {
    const { data: checkout, error: checkoutError } = await supabase
      .from("checkout_sessions")
      .select("*")
      .eq("id", checkoutSessionId)
      .single();

    if (checkoutError) throw checkoutError;

    const { data, error } = await supabase
      .from("payments")
      .insert({
        tenant_id: checkout.tenant_id,
        checkout_session_id: checkout.id,
        provider,
        payment_method: paymentMethod,
        amount: checkout.grand_total,
        currency_code: "ZAR",
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("checkout_sessions")
      .update({
        payment_method: paymentMethod,
        checkout_status: "payment_pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", checkoutSessionId);

    return data;
  },

  async confirmPayment({ orderId, provider, providerTransactionId, providerResponse = {} }) {
    const { data, error } = await supabase.rpc("confirm_payment_for_order", {
      p_order_id: orderId,
      p_provider: provider,
      p_provider_transaction_id: providerTransactionId,
      p_provider_response: providerResponse,
    });

    if (error) throw error;
    return data;
  },

  async markPaymentFailed({ orderId, provider, providerResponse = {} }) {
    const { data, error } = await supabase.rpc("fail_payment_for_order", {
      p_order_id: orderId,
      p_provider: provider,
      p_provider_response: providerResponse,
    });

    if (error) throw error;
    return data;
  },

  async refundPayment({ orderId, amount, reason }) {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "refunded",
        order_status: "refunded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError) throw orderError;

    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        payment_status: "refunded",
        provider_response: { refund_amount: amount, reason },
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (paymentError) throw paymentError;

    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert({
        tenant_id: order.tenant_id,
        order_id: order.id,
        status: "refunded",
        comment: reason || "Refund processed",
      });

    if (historyError) throw historyError;

    return order;
  },

  // -------------------------------------------------------
  // Customer order pages
  // -------------------------------------------------------
  async getOrderConfirmation(orderId) {
    const order = await this.getOrderById(orderId);
    return order;
  },

  async getMyOrders(options = {}) {
    return getList("orders", options, {
      searchColumns: ["order_number", "customer_name", "customer_email"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["total_amount"],
      statusColumn: "order_status",
      paymentStatusColumn: "payment_status",
      dateColumn: "created_at",
    });
  },

  async getMyOrderById(orderId) {
    return this.getOrderById(orderId);
  },

  // -------------------------------------------------------
  // Admin orders
  // -------------------------------------------------------
  async getOrders(options = {}) {
    return getList("orders", options, {
      searchColumns: ["order_number", "customer_name", "customer_email"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["total_amount"],
      statusColumn: "order_status",
      paymentStatusColumn: "payment_status",
      dateColumn: "created_at",
    });
  },

  async getOrderById(orderId) {
    const order = await getSingle("orders", orderId, "*");

    const [itemsRes, billingAddressRes, shippingAddressRes, paymentsRes, historyRes] =
      await Promise.all([
        supabase.from("order_items").select("*").eq("order_id", orderId).order("created_at", { ascending: true }),
        order.billing_address_id
          ? supabase.from("addresses").select("*").eq("id", order.billing_address_id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        order.shipping_address_id
          ? supabase.from("addresses").select("*").eq("id", order.shipping_address_id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        supabase.from("payments").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
        supabase.from("order_status_history").select("*").eq("order_id", orderId).order("created_at", { ascending: true }),
      ]);

    if (itemsRes.error) throw itemsRes.error;
    if (billingAddressRes.error) throw billingAddressRes.error;
    if (shippingAddressRes.error) throw shippingAddressRes.error;
    if (paymentsRes.error) throw paymentsRes.error;
    if (historyRes.error) throw historyRes.error;

    return {
      ...order,
      items: itemsRes.data || [],
      billing_address: billingAddressRes.data || null,
      shipping_address: shippingAddressRes.data || null,
      payments: paymentsRes.data || [],
      status_history: historyRes.data || [],
    };
  },

  async updateOrderStatus(orderId, { status, comment = null }) {
    const allowedStatuses = [
      "cart",
      "checkout_started",
      "pending_payment",
      "paid",
      "confirmed",
      "packed",
      "dispatched",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert({
        tenant_id: order.tenant_id,
        order_id: order.id,
        status,
        comment,
      });

    if (historyError) throw historyError;

    return order;
  },

  // -------------------------------------------------------
  // Discounts
  // -------------------------------------------------------
  async getDiscounts(options = {}) {
    return getList("discounts", options, {
      searchColumns: ["code", "name"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["discount_value"],
      statusColumn: "status",
      typeColumn: "discount_type",
      dateColumn: "created_at",
    });
  },

  async createDiscount(payload) {
    const { data, error } = await supabase
      .from("discounts")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDiscount(discountId, payload) {
    const { data, error } = await supabase
      .from("discounts")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", discountId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // -------------------------------------------------------
  // Subscriptions
  // -------------------------------------------------------
  async getSubscriptions(options = {}) {
    return getList("subscriptions", options, {
      searchColumns: ["subscription_code", "customer_name", "plan_name"],
      defaultSort: { column: "created_at", ascending: false },
      amountFields: ["amount"],
      statusColumn: "status",
      dateColumn: "created_at",
    });
  },

  async createSubscription(payload) {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSubscription(subscriptionId, payload) {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // -------------------------------------------------------
  // Generic helpers if needed elsewhere
  // -------------------------------------------------------
  getList,
  getSingle,
  upsert,
  remove,
};
