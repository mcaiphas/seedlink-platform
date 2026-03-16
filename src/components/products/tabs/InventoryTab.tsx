import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Warehouse, AlertTriangle } from 'lucide-react';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  depots: any[];
}

export function InventoryTab({ form, update, setForm, depots }: Props) {
  const reorderLevel = form.metadata?.reorder_level || '';
  const stockQty = Number(form.stock_quantity) || 0;
  const reorderNum = Number(reorderLevel) || 0;
  const isLowStock = reorderLevel && stockQty <= reorderNum;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5 text-primary" />Inventory & Depot</CardTitle>
          <CardDescription>Manage stock levels, depot assignments, and reorder thresholds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" min="0" value={form.stock_quantity} onChange={e => update('stock_quantity', e.target.value)} className="tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label>Reorder Level</Label>
              <Input type="number" min="0" value={reorderLevel} onChange={e => setForm((f: any) => ({ ...f, metadata: { ...f.metadata, reorder_level: e.target.value ? Number(e.target.value) : null } }))} placeholder="Low stock alert threshold" className="tabular-nums" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
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
          </div>

          {isLowStock && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
              <span>Stock level ({form.stock_quantity}) is at or below reorder level ({reorderLevel})</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Inventory Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
              <div><Label className="text-sm">Track Inventory</Label><p className="text-[11px] text-muted-foreground">Monitor stock levels automatically</p></div>
              <Switch checked={form.track_inventory} onCheckedChange={v => update('track_inventory', v)} />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
              <div><Label className="text-sm">Allow Backorder</Label><p className="text-[11px] text-muted-foreground">Accept orders when out of stock</p></div>
              <Switch checked={form.allow_backorder} onCheckedChange={v => update('allow_backorder', v)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
