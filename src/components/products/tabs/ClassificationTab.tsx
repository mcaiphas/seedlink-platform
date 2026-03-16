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
}

export function ClassificationTab({ form, update, categories, subcategories, suppliers, collections, selectedCollections, setSelectedCollections }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Classification</CardTitle>
        <CardDescription>Link to categories, collections, and suppliers</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category || '__none'} onValueChange={v => update('category', v === '__none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No category</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Select value={form.subcategory_id || '__none'} onValueChange={v => update('subcategory_id', v === '__none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No subcategory</SelectItem>
              {subcategories.filter(s => !form.category || s.category_id === categories.find(c => c.name === form.category)?.id).map(s => (
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
