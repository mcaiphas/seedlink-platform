import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  createCheckout,
  confirmCheckout,
  formatMoney,
  isPaid,
  type PaymentRow,
} from "../../services/checkoutService";

export default function OrderDetail() {
  // 🔴 TEMP: Replace with real data later (API / route param)
  const order = {
    id: "b30228d6-3aa1-45a3-8fa2-cac594872256",
    order_number: "SO-20260322-001000",
    total_amount: 6250,
    currency_code: "ZAR",
  };

  const [payment, setPayment] = useState<PaymentRow | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateCheckout() {
    try {
      setLoadingCreate(true);
      setError(null);

      const result = await createCheckout({
        checkout_type: "order",
        order_id: order.id,
        payment_method: "card",
        provider: "manual",
        metadata: {
          channel: "admin_order_detail",
          order_number: order.order_number,
        },
      });

      setPayment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoadingCreate(false);
    }
  }

  async function handleConfirmCheckout() {
    try {
      if (!payment?.id) {
        throw new Error("Create checkout first");
      }

      setLoadingConfirm(true);
      setError(null);

      const result = await confirmCheckout({
        paymentId: payment.id,
        providerTransactionId: `MANUAL-${order.order_number}`,
        responsePayload: {
          source: "admin_manual_confirm",
          order_number: order.order_number,
        },
      });

      setPayment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm failed");
    } finally {
      setLoadingConfirm(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Order ${order.order_number}`}
        description="Order detail and checkout"
      />

      {/* ORDER SUMMARY */}
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <p>Order ID: {order.id}</p>
        <p>
          Amount: {formatMoney(order.total_amount, order.currency_code)}
        </p>
      </div>

      {/* CHECKOUT SECTION */}
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Checkout</h2>

          <span
            className={`px-3 py-1 text-xs rounded-full ${
              isPaid(payment)
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {payment?.payment_status ?? "not_started"}
          </span>
        </div>

        {payment && (
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <p>Payment #: {payment.payment_number}</p>
            <p>Reference: {payment.payment_reference}</p>
            <p>Amount: {formatMoney(payment.amount)}</p>
            <p>Provider: {payment.provider}</p>
            <p>Session: {payment.provider_checkout_session_id}</p>
            <p>Txn: {payment.provider_transaction_id ?? "-"}</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 mb-4 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCreateCheckout}
            disabled={loadingCreate || !!payment}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingCreate ? "Creating..." : "Create Checkout"}
          </button>

          <button
            onClick={handleConfirmCheckout}
            disabled={loadingConfirm || !payment || isPaid(payment)}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingConfirm ? "Confirming..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
