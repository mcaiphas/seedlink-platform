import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Package, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function SalesAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Revenue, order trends, and customer insights</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderWidget title="Revenue Over Time" icon={TrendingUp} description="Monthly and weekly revenue charts with trend analysis" />
        <PlaceholderWidget title="Order Volume" icon={BarChart3} description="Order count trends by source and status" />
        <PlaceholderWidget title="Top Products" icon={Package} description="Best-selling products by revenue and quantity" />
        <PlaceholderWidget title="Customer Segments" icon={PieChart} description="Customer breakdown by type and region" />
      </div>
    </div>
  );
}
