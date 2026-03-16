import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Warehouse } from 'lucide-react';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  depots: any[];
}

export function InventoryTab({ form, update, setForm, depots }: Props) {
  const reorderLevel = form.metadata?.reorder_level || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5" />Inventory & Depot</CardTitle>
        <CardDescription>Manage stock levels, depot assignments, and reorder thresholds.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Input type="number" min="0" value={form.stock_quantity} onChange={e => update('stock_quantity', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Reorder Level</Label>
          <Input type="number" min="0" value={reorderLevel} onChange={e => setForm((f: any) => ({ ...f, metadata: { ...f.metadata, reorder_level: e.target.value ? Number(e.target.value) : null } }))} placeholder="Low stock alert threshold" />
        </div>
        <div className="space-y-2">
          <Label>Depot</Label>
          <Select value={form.depot_id || '__none'} onValueChange={v => update('depot_id', v === '__none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No depot assigned</SelectItem>
              {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Inventory Status</Label>
          <Select value={form.metadata?.inventory_status || 'in_stock'} onValueChange={v => setForm((f: any) => ({ ...f, metadata: { ...f.metadata, inventory_status: v } }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
          <div><Label>Track Inventory</Label><p className="text-xs text-muted-foreground">Monitor stock levels automatically</p></div>
          <Switch checked={form.track_inventory} onCheckedChange={v => update('track_inventory', v)} />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
          <div><Label>Allow Backorder</Label><p className="text-xs text-muted-foreground">Accept orders when out of stock</p></div>
          <Switch checked={form.allow_backorder} onCheckedChange={v => update('allow_backorder', v)} />
        </div>

        {form.stock_quantity && reorderLevel && Number(form.stock_quantity) <= Number(reorderLevel) && (
          <div className="sm:col-span-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-400">
            ⚠️ Stock level ({form.stock_quantity}) is at or below reorder level ({reorderLevel})
          </div>
        )}
      </CardContent>
    </Card>
  );
}
