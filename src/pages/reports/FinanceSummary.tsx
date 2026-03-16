import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Scale } from 'lucide-react';

function PlaceholderWidget({ title, icon: Icon, description }: { title: string; icon: any; description: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function FinanceSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance Summary</h1>
        <p className="text-sm text-muted-foreground mt-1">Accounts receivable, payable, and cash flow overview</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderWidget title="Accounts Receivable Aging" icon={TrendingUp} description="Outstanding customer invoices by age bucket" />
        <PlaceholderWidget title="Accounts Payable Aging" icon={TrendingDown} description="Outstanding supplier invoices by due date" />
        <PlaceholderWidget title="Cash Flow" icon={DollarSign} description="Cash inflows and outflows over time" />
        <PlaceholderWidget title="Trial Balance" icon={Scale} description="Summarized GL account balances" />
      </div>
    </div>
  );
}
