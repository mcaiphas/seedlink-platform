import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, Receipt, FileText, DollarSign, Truck, CreditCard } from 'lucide-react';

const flows = [
  {
    title: 'Goods Receipt',
    icon: Package,
    trigger: 'GR posted',
    entries: [
      { account: '1100 — Inventory', effect: 'Debit', color: 'bg-emerald-100 text-emerald-800' },
      { account: '2100 — GRNI', effect: 'Credit', color: 'bg-blue-100 text-blue-800' },
    ],
    description: 'When goods are received and posted, inventory increases and GRNI liability is created.',
  },
  {
    title: 'Supplier Invoice',
    icon: Receipt,
    trigger: 'SI posted',
    entries: [
      { account: '2100 — GRNI', effect: 'Debit', color: 'bg-emerald-100 text-emerald-800' },
      { account: '2200 — Accounts Payable', effect: 'Credit', color: 'bg-blue-100 text-blue-800' },
    ],
    description: 'Supplier invoice reverses GRNI and creates a payable obligation.',
  },
  {
    title: 'Customer Invoice',
    icon: FileText,
    trigger: 'CI posted',
    entries: [
      { account: '1200 — Accounts Receivable', effect: 'Debit', color: 'bg-emerald-100 text-emerald-800' },
      { account: '4100 — Sales Revenue', effect: 'Credit', color: 'bg-blue-100 text-blue-800' },
    ],
    description: 'Customer invoice creates a receivable and recognizes revenue.',
  },
  {
    title: 'Cost of Goods Sold',
    icon: Truck,
    trigger: 'CI paid / fulfilled',
    entries: [
      { account: '5100 — COGS', effect: 'Debit', color: 'bg-emerald-100 text-emerald-800' },
      { account: '1100 — Inventory', effect: 'Credit', color: 'bg-blue-100 text-blue-800' },
    ],
    description: 'When invoice is paid, cost of goods sold is recognized and inventory decreases.',
  },
  {
    title: 'Supplier Payment',
    icon: CreditCard,
    trigger: 'Payment recorded',
    entries: [
      { account: '2200 — Accounts Payable', effect: 'Debit', color: 'bg-emerald-100 text-emerald-800' },
      { account: '1000 — Bank / Cash', effect: 'Credit', color: 'bg-blue-100 text-blue-800' },
    ],
    description: 'Payment to supplier reduces the payable and decreases bank balance.',
  },
  {
    title: 'Customer Payment',
    icon: DollarSign,
    trigger: 'Payment received',
    entries: [
      { account: '1000 — Bank / Cash', effect: 'Debit', color: 'bg-emerald-100 text-emerald-800' },
      { account: '1200 — Accounts Receivable', effect: 'Credit', color: 'bg-blue-100 text-blue-800' },
    ],
    description: 'Receipt from customer increases bank and settles the receivable.',
  },
];

export default function CommerceAccounting() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commerce Accounting</h1>
        <p className="text-sm text-muted-foreground mt-1">Operational finance flow and journal entry mapping for Seedlink commerce</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flows.map((flow) => (
          <Card key={flow.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <flow.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{flow.title}</CardTitle>
                  <Badge variant="outline" className="text-xs mt-0.5">{flow.trigger}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {flow.entries.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-mono">{entry.account}</span>
                    <Badge className={`text-xs ${entry.color} border-0`}>{entry.effect}</Badge>
                  </div>
                ))}
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground leading-relaxed">{flow.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">End-to-End Commerce Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              'Cart', 'Order', 'Payment', 'Invoice', 'Delivery Log', 'Stock Movement', 'Journal Entry',
            ].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <Badge variant="outline" className="font-medium">{step}</Badge>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Each step in the Seedlink commerce workflow generates the appropriate financial entries, stock movements, and delivery notifications automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
