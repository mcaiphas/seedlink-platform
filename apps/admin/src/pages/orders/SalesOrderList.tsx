import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, EmptyState } from "@/components/commerce/PageShell";
import {
  StatusBadge,
  CurrencyDisplay,
  DateDisplay,
} from "@/components/commerce/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import {
  createCheckout,
  confirmCheckout,
  formatMoney,
  isPaid,
  type PaymentRow,
} from "@/services/checkoutService";

type SalesOrderRow = {
  id: string;
  order_number: string;
  customer_id: string | null;
  subtotal_amount?: number | string | null;
  tax_amount?: number | string | null;
  total_amount: number | string;
  currency_code?: string | null;
  order_status?: string | null;
  payment_status?: string | null;
  fulfillment_status?: string | null;
  approval_status?: string | null;
  created_at: string;
  approved_at?: string | null;
  metadata?: Record<string, unknown> | null;
};

type SalesOrderItemRow = {
  id: string;
  sales_order_id?: string | null;
  order_id?: string | null;
  product_name?: string | null;
  description?: string | null;
  quantity?: number | string | null;
  quantity_uom?: string | null;
  unit_price?: number | string | null;
  line_total?: number | string | null;
};

export default function SalesOrderList() {
  const [orders, setOrders] = useState<SalesOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [detailOrder, setDetailOrder] = useState<SalesOrderRow | null>(null);
  const [orderItems, setOrderItems] = useState<SalesOrderItemRow[]>([]);
  const [orderPayments, setOrderPayments] = useState<any[]>([]);

  const [checkoutPayment, setCheckoutPayment] = useState<PaymentRow | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("sales_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) {
        console.error("Failed to load sales orders:", error);
        setOrders([]);
      } else {
        setOrders((data || []) as SalesOrderRow[]);
      }

      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const number = (o.order_number || "").toLowerCase();

      if (
        search &&
        !number.includes(search.toLowerCase()) &&
        !o.id.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      if (paymentFilter !== "all" && (o.payment_status || "pending") !== paymentFilter) {
        return false;
      }

      return true;
    });
  }, [orders, search, paymentFilter]);

  async function openDetail(order: SalesOrderRow) {
    setDetailOrder(order);
    setCheckoutError(null);
    setCheckoutPayment(null);

    const paymentsPromise = supabase
      .from("payments")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false });

    let items: SalesOrderItemRow[] = [];

    const salesOrderItemsRes = await supabase
      .from("sales_order_items")
      .select("*")
      .eq("sales_order_id", order.id);

    if (!salesOrderItemsRes.error && salesOrderItemsRes.data) {
      items = salesOrderItemsRes.data as SalesOrderItemRow[];
    } else {
      const fallbackItemsRes = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      items = (fallbackItemsRes.data || []) as SalesOrderItemRow[];
    }

    const { data: payments } = await paymentsPromise;

    setOrderItems(items || []);
    setOrderPayments(payments || []);

    const existingCheckout = (payments || []).find(
      (p: any) => p.payment_type === "order_payment"
    );
    setCheckoutPayment((existingCheckout as PaymentRow) || null);
  }

  function closeDetail() {
    setDetailOrder(null);
    setOrderItems([]);
    setOrderPayments([]);
    setCheckoutPayment(null);
    setCheckoutError(null);
  }

  async function reloadPayments(orderId: string) {
    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    setOrderPayments(payments || []);

    const latestCheckout = (payments || []).find(
      (p: any) => p.payment_type === "order_payment"
    );
    setCheckoutPayment((latestCheckout as PaymentRow) || null);
  }

  async function handleCreateCheckout() {
    try {
      if (!detailOrder) throw new Error("No sales order selected.");

      setCheckoutLoading(true);
      setCheckoutError(null);

      const payment = await createCheckout({
        checkout_type: "order",
        order_id: detailOrder.id,
        payment_method: "card",
        provider: "manual",
        metadata: {
          channel: "admin_sales_order_dialog",
          order_number: detailOrder.order_number,
          source_table: "sales_orders",
        },
      });

      setCheckoutPayment(payment);
      await reloadPayments(detailOrder.id);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Failed to create checkout"
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleConfirmCheckout() {
    try {
      if (!detailOrder) throw new Error("No sales order selected.");
      if (!checkoutPayment?.id) throw new Error("Create checkout first.");

      setConfirmLoading(true);
      setCheckoutError(null);

      const payment = await confirmCheckout({
        paymentId: checkoutPayment.id,
        providerTransactionId: `MANUAL-${detailOrder.order_number}`,
        responsePayload: {
          source: "admin_sales_order_dialog_manual_confirm",
          order_number: detailOrder.order_number,
        },
      });

      setCheckoutPayment(payment);
      await reloadPayments(detailOrder.id);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Failed to confirm payment"
      );
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <PageShell
      title="Sales Orders"
      subtitle="Checkout-ready sales orders aligned to the payment engine"
      loading={loading}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by sales order number..."
      filters={
        <div className="flex gap-2">
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No sales orders found"
          description="Sales orders will appear here once created."
        />
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Sales Order #</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetail(o)}
                  >
                    <TableCell className="pl-6 font-medium">
                      {o.order_number || o.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        type="approval"
                        value={o.approval_status || o.order_status || "pending"}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        type="payment"
                        value={o.payment_status || "pending"}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        type="fulfillment"
                        value={o.fulfillment_status || "pending"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay
                        amount={o.total_amount}
                        currency={o.currency_code || "ZAR"}
                      />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DateDisplay date={o.created_at} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!detailOrder} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Sales Order {detailOrder?.order_number || detailOrder?.id?.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>

          {detailOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Approval</p>
                  <StatusBadge
                    type="approval"
                    value={detailOrder.approval_status || detailOrder.order_status || "pending"}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <StatusBadge
                    type="payment"
                    value={detailOrder.payment_status || "pending"}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fulfillment</p>
                  <StatusBadge
                    type="fulfillment"
                    value={detailOrder.fulfillment_status || "pending"}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <DateDisplay date={detailOrder.created_at} showTime />
                </div>
              </div>

              <div className="rounded-2xl border p-4 bg-white shadow-sm">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">Checkout</h4>
                    <p className="text-sm text-muted-foreground">
                      {detailOrder.order_number} •{" "}
                      {formatMoney(
                        detailOrder.total_amount,
                        detailOrder.currency_code || "ZAR"
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sales Order ID: {detailOrder.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isPaid(checkoutPayment)
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {checkoutPayment?.payment_status ?? "not_started"}
                  </span>
                </div>

                {checkoutPayment && (
                  <div className="grid grid-cols-1 gap-2 text-sm mb-4 md:grid-cols-2">
                    <p>Payment #: {checkoutPayment.payment_number}</p>
                    <p>Reference: {checkoutPayment.payment_reference || "—"}</p>
                    <p>
                      Amount:{" "}
                      {formatMoney(
                        checkoutPayment.amount,
                        checkoutPayment.currency_code || "ZAR"
                      )}
                    </p>
                    <p>Provider: {checkoutPayment.provider || "—"}</p>
                    <p>
                      Session:{" "}
                      {checkoutPayment.provider_checkout_session_id || "—"}
                    </p>
                    <p>Txn: {checkoutPayment.provider_transaction_id || "—"}</p>
                  </div>
                )}

                {checkoutError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {checkoutError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateCheckout}
                    disabled={checkoutLoading || !!checkoutPayment}
                  >
                    {checkoutLoading ? "Creating..." : "Create Checkout"}
                  </Button>

                  <Button
                    onClick={handleConfirmCheckout}
                    disabled={
                      confirmLoading || !checkoutPayment || isPaid(checkoutPayment)
                    }
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {confirmLoading ? "Confirming..." : "Confirm Payment"}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.product_name || item.description || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity || 0} {item.quantity_uom || ""}
                          </TableCell>
                          <TableCell className="text-right">
                            <CurrencyDisplay amount={item.unit_price || 0} />
                          </TableCell>
                          <TableCell className="text-right">
                            <CurrencyDisplay amount={item.line_total || 0} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="flex justify-end">
                <div className="space-y-1 text-right text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Subtotal</span>
                    <CurrencyDisplay
                      amount={detailOrder.subtotal_amount || 0}
                      currency={detailOrder.currency_code || "ZAR"}
                    />
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Tax</span>
                    <CurrencyDisplay
                      amount={detailOrder.tax_amount || 0}
                      currency={detailOrder.currency_code || "ZAR"}
                    />
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between gap-8 font-semibold">
                    <span>Total</span>
                    <CurrencyDisplay
                      amount={detailOrder.total_amount}
                      currency={detailOrder.currency_code || "ZAR"}
                    />
                  </div>
                </div>
              </div>

              {orderPayments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Payments</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderPayments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="capitalize">
                              {p.payment_method?.replace(/_/g, " ") || "—"}
                            </TableCell>
                            <TableCell>
                              <StatusBadge type="payment" value={p.payment_status} />
                            </TableCell>
                            <TableCell className="text-sm">
                              {p.payment_reference || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <CurrencyDisplay
                                amount={p.amount}
                                currency={p.currency_code || "ZAR"}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
