import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusConfig {
  label: string;
  variant: Variant;
  className?: string;
}

const STATUS_CONFIGS: Record<string, Record<string, StatusConfig>> = {
  approval: {
    not_required: { label: 'Not Required', variant: 'outline' },
    pending: { label: 'Pending', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    approved: { label: 'Approved', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    rejected: { label: 'Rejected', variant: 'destructive' },
  },
  payment: {
    pending: { label: 'Pending', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    authorized: { label: 'Authorized', variant: 'outline', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    paid: { label: 'Paid', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    partially_paid: { label: 'Partial', variant: 'secondary', className: 'bg-sky-100 text-sky-800 border-sky-200' },
    failed: { label: 'Failed', variant: 'destructive' },
    cancelled: { label: 'Cancelled', variant: 'destructive', className: 'bg-red-100 text-red-800 border-red-200' },
    refunded: { label: 'Refunded', variant: 'outline', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    partially_refunded: { label: 'Partial Refund', variant: 'outline', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  },
  fulfillment: {
    draft: { label: 'Draft', variant: 'outline' },
    reserved: { label: 'Reserved', variant: 'secondary', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    ready: { label: 'Ready', variant: 'secondary', className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    fulfilled: { label: 'Fulfilled', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    partially_fulfilled: { label: 'Partial', variant: 'secondary', className: 'bg-sky-100 text-sky-800 border-sky-200' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
  },
  order_source: {
    online_store: { label: 'Online', variant: 'outline', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    customer_service: { label: 'CS', variant: 'outline', className: 'bg-teal-100 text-teal-800 border-teal-200' },
    abandoned_cart_recovery: { label: 'Recovery', variant: 'outline', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    marketplace: { label: 'Marketplace', variant: 'outline', className: 'bg-violet-100 text-violet-800 border-violet-200' },
    manual: { label: 'Manual', variant: 'outline' },
  },
  document: {
    draft: { label: 'Draft', variant: 'outline' },
    pending: { label: 'Pending', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    submitted: { label: 'Submitted', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    approved: { label: 'Approved', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    posted: { label: 'Posted', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
    partially_received: { label: 'Partial', variant: 'secondary', className: 'bg-sky-100 text-sky-800 border-sky-200' },
    received: { label: 'Received', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    sent: { label: 'Sent', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    paid: { label: 'Paid', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    overdue: { label: 'Overdue', variant: 'destructive' },
    void: { label: 'Void', variant: 'destructive' },
  },
  delivery: {
    pending: { label: 'Pending', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    sent: { label: 'Sent', variant: 'default', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    delivered: { label: 'Delivered', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    failed: { label: 'Failed', variant: 'destructive' },
    bounced: { label: 'Bounced', variant: 'destructive' },
  },
  cart: {
    active: { label: 'Active', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    abandoned: { label: 'Abandoned', variant: 'destructive', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    converted: { label: 'Converted', variant: 'default', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
    expired: { label: 'Expired', variant: 'outline' },
  },
  credit: {
    active: { label: 'Active', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    suspended: { label: 'Suspended', variant: 'destructive', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    closed: { label: 'Closed', variant: 'destructive' },
    pending_review: { label: 'Under Review', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  },
  movement: {
    goods_received: { label: 'Goods Received', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    purchase_receipt: { label: 'Receipt', variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    stock_issue: { label: 'Stock Issue', variant: 'outline', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    sales_issue: { label: 'Sales Issue', variant: 'outline', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    adjustment_in: { label: 'Adjust In', variant: 'default', className: 'bg-teal-100 text-teal-800 border-teal-200' },
    adjustment_out: { label: 'Adjust Out', variant: 'outline', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    transfer_in: { label: 'Transfer In', variant: 'default', className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    transfer_out: { label: 'Transfer Out', variant: 'outline', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    customer_dispatch: { label: 'Dispatched', variant: 'outline', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    customer_return: { label: 'Customer Return', variant: 'secondary' },
    return_from_customer: { label: 'Customer Return', variant: 'secondary' },
    supplier_return: { label: 'Supplier Return', variant: 'secondary' },
    return_to_supplier: { label: 'Supplier Return', variant: 'secondary' },
    damaged: { label: 'Damaged', variant: 'destructive' },
    expired: { label: 'Expired', variant: 'destructive', className: 'bg-red-100 text-red-800 border-red-200' },
    count_variance: { label: 'Count Variance', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    opening_balance: { label: 'Opening', variant: 'outline' },
  },
};

export function StatusBadge({ type, value }: { type: keyof typeof STATUS_CONFIGS; value: string | null | undefined }) {
  if (!value) return <Badge variant="outline" className="text-muted-foreground">—</Badge>;
  const config = STATUS_CONFIGS[type]?.[value];
  if (!config) return <Badge variant="outline">{value}</Badge>;
  return (
    <Badge variant={config.variant} className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}

export function CurrencyDisplay({ amount, currency = 'ZAR', className }: { amount: number | null | undefined; currency?: string; className?: string }) {
  if (amount == null) return <span className={cn('text-muted-foreground', className)}>—</span>;
  return (
    <span className={cn('tabular-nums font-medium', className)}>
      {currency} {Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export function DateDisplay({ date, showTime = false }: { date: string | null | undefined; showTime?: boolean }) {
  if (!date) return <span className="text-muted-foreground">—</span>;
  const d = new Date(date);
  if (showTime) return <span className="tabular-nums text-sm">{d.toLocaleDateString('en-ZA')} {d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>;
  return <span className="tabular-nums text-sm">{d.toLocaleDateString('en-ZA')}</span>;
}
