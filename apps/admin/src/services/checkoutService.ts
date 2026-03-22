import { supabase } from "../integrations/supabase/client";

export type CheckoutType =
  | "order"
  | "delivery"
  | "course"
  | "subscription"
  | "digital_product"
  | "wallet_topup"
  | "wallet_payout";

export type PaymentMethod = "card" | "eft" | "wallet" | "manual";
export type ProviderType = "manual" | "stripe" | "payfast" | "ozow";

export interface CreateCheckoutPayload {
  checkout_type: CheckoutType;
  order_id?: string | null;
  course_id?: string | null;
  subscription_plan_id?: string | null;
  digital_product_id?: string | null;
  delivery_request_id?: string | null;
  payment_method?: PaymentMethod;
  provider?: ProviderType;
  metadata?: Record<string, unknown>;
}

export interface PaymentRow {
  id: string;
  payment_number: string;
  customer_id: string | null;
  order_id: string | null;
  customer_invoice_id: string | null;
  payment_method: string;
  payment_provider: string | null;
  provider_transaction_id: string | null;
  payment_reference: string | null;
  amount: string;
  currency_code: string;
  payment_status: string;
  paid_at: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  allocated_amount: string;
  tenant_id: string | null;
  checkout_session_id: string | null;
  provider: string | null;
  provider_response: Record<string, unknown> | null;
  failed_at: string | null;
  checkout_url: string | null;
  initiated_at: string;
  authorized_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  failure_reason: string | null;
  payment_type: string;
  status_reason: string | null;
  provider_payment_intent_id: string | null;
  provider_checkout_session_id: string | null;
  provider_customer_id: string | null;
  authorization_amount: string | null;
  captured_amount: string | null;
  refunded_amount: string;
  expired_at: string | null;
}

export interface ConfirmCheckoutPayload {
  paymentId: string;
  providerTransactionId?: string;
  responsePayload?: Record<string, unknown>;
}

function ensureCheckoutPayload(payload: CreateCheckoutPayload) {
  if (payload.checkout_type === "order" && !payload.order_id) {
    throw new Error("order_id is required for order checkout");
  }
  if (payload.checkout_type === "course" && !payload.course_id) {
    throw new Error("course_id is required for course checkout");
  }
  if (
    payload.checkout_type === "subscription" &&
    !payload.subscription_plan_id
  ) {
    throw new Error("subscription_plan_id is required for subscription checkout");
  }
  if (
    payload.checkout_type === "digital_product" &&
    !payload.digital_product_id
  ) {
    throw new Error("digital_product_id is required for digital product checkout");
  }
  if (payload.checkout_type === "delivery" && !payload.delivery_request_id) {
    throw new Error("delivery_request_id is required for delivery checkout");
  }
}

export async function createCheckout(
  payload: CreateCheckoutPayload
): Promise<PaymentRow> {
  ensureCheckoutPayload(payload);

  const { data, error } = await supabase.rpc("create_checkout", {
    p_checkout_type: payload.checkout_type,
    p_order_id: payload.order_id ?? null,
    p_course_id: payload.course_id ?? null,
    p_subscription_plan_id: payload.subscription_plan_id ?? null,
    p_digital_product_id: payload.digital_product_id ?? null,
    p_delivery_request_id: payload.delivery_request_id ?? null,
    p_payment_method: payload.payment_method ?? "card",
    p_provider: payload.provider ?? "manual",
    p_metadata: payload.metadata ?? {},
  });

  if (error) {
    throw new Error(error.message || "Failed to create checkout");
  }

  return data as PaymentRow;
}

export async function confirmCheckout(
  payload: ConfirmCheckoutPayload
): Promise<PaymentRow> {
  const { data, error } = await supabase.rpc("confirm_checkout", {
    p_payment_id: payload.paymentId,
    p_provider_transaction_id:
      payload.providerTransactionId ?? `MANUAL-${payload.paymentId}`,
    p_response_payload: payload.responsePayload ?? {},
  });

  if (error) {
    throw new Error(error.message || "Failed to confirm checkout");
  }

  return data as PaymentRow;
}

export function isPaid(payment: PaymentRow | null | undefined): boolean {
  return payment?.payment_status === "paid";
}

export function formatMoney(value: string | number, currency = "ZAR"): string {
  const amount =
    typeof value === "string" ? Number.parseFloat(value || "0") : value;

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(Number.isFinite(amount) ? amount : 0);
}
