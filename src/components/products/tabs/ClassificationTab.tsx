import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
  categories: any[];
  subcategories: any[];
  suppliers: any[];
  collections: any[];
  selectedCollections: string[];
  setSelectedCollections: React.Dispatch<React.SetStateAction<string[]>>;
  depots?: any[];
  organizations?: any[];
}

export function ClassificationTab({ form, update, categories, subcategories, suppliers, collections, selectedCollections, setSelectedCollections, depots = [], organizations = [] }: Props) {
  const selectedCat = categories.find(c => c.id === form.category_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Classification</CardTitle>
        <CardDescription>Link to categories, collections, suppliers, and depots</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category_id || '__none'} onValueChange={v => {
            const catId = v === '__none' ? '' : v;
            const cat = categories.find(c => c.id === catId);
            update('category_id', catId);
            update('category', cat?.name || '');
          }}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No category</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.sku_prefix && <span className="font-mono text-xs text-muted-foreground mr-1.5">[{c.sku_prefix}]</span>}
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCat?.sku_prefix && (
            <p className="text-xs text-muted-foreground">SKU prefix: <span className="font-mono font-medium text-primary">{selectedCat.sku_prefix}</span></p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Select value={form.subcategory_id || '__none'} onValueChange={v => update('subcategory_id', v === '__none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No subcategory</SelectItem>
              {subcategories.filter(s => !form.category_id || s.category_id === form.category_id).map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Select value={form.supplier_id || '__none'} onValueChange={v => update('supplier_id', v === '__none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No supplier</SelectItem>
              {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.supplier_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Depot</Label>
          <Select value={form.depot_id || '__none'} onValueChange={v => update('depot_id', v === '__none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Select depot" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No depot</SelectItem>
              {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {organizations.length > 0 && (
          <div className="space-y-2">
            <Label>Organization</Label>
            <Select value={form.organization_id || '__none'} onValueChange={v => update('organization_id', v === '__none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Select organization" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No organization</SelectItem>
                {organizations.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2 sm:col-span-2">
          <Label>Collections</Label>
          <p className="text-xs text-muted-foreground mb-2">Click to toggle collection assignment</p>
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border min-h-[56px]">
            {collections.map(c => {
              const active = selectedCollections.includes(c.id);
              return (
                <Badge key={c.id} variant={active ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors hover:opacity-80"
                  onClick={() => setSelectedCollections(prev =>
                    active ? prev.filter(x => x !== c.id) : [...prev, c.id]
                  )}>
                  {c.name}
                </Badge>
              );
            })}
            {collections.length === 0 && <span className="text-sm text-muted-foreground">No collections available</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
