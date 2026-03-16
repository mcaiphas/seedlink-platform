import { Card, CardContent } from '@/components/ui/card';
import { Boxes, Package, Warehouse, ArrowLeftRight } from 'lucide-react';

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

export default function InventorySnapshot() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Snapshot</h1>
        <p className="text-sm text-muted-foreground mt-1">Current stock levels and movement analysis</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderWidget title="Stock Levels by Depot" icon={Warehouse} description="Current stock quantities across all depots" />
        <PlaceholderWidget title="Low Stock Alerts" icon={Package} description="Products below reorder point threshold" />
        <PlaceholderWidget title="Movement Summary" icon={ArrowLeftRight} description="Stock in/out analysis over time" />
        <PlaceholderWidget title="Batch Expiry Tracking" icon={Boxes} description="Upcoming expiry dates and aged inventory" />
      </div>
    </div>
  );
}
