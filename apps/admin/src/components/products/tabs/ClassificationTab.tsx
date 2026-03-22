import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Building2, Truck, FolderOpen } from 'lucide-react';

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
  const filteredSubs = subcategories.filter(s => !form.category_id || s.category_id === form.category_id);

  return (
    <div className="space-y-6">
      {/* Category & Subcategory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary" />Category & Subcategory</CardTitle>
          <CardDescription>Assign the product to a category for SKU prefix generation and catalog structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category_id || '__none'} onValueChange={v => {
                const catId = v === '__none' ? '' : v;
                const cat = categories.find(c => c.id === catId);
                update('category_id', catId);
                update('category', cat?.name || '');
                update('subcategory_id', '');
              }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">No category</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        {c.sku_prefix && <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">{c.sku_prefix}</code>}
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCat?.sku_prefix && (
                <p className="text-[11px] text-muted-foreground">SKU prefix: <code className="font-mono font-semibold text-primary">{selectedCat.sku_prefix}</code></p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Select value={form.subcategory_id || '__none'} onValueChange={v => update('subcategory_id', v === '__none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">No subcategory</SelectItem>
                  {filteredSubs.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.category_id && filteredSubs.length === 0 && (
                <p className="text-[11px] text-muted-foreground">No subcategories for this category</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier & Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />Supplier & Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Collections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5 text-primary" />Collections</CardTitle>
          <CardDescription>
            Assign to one or more collections. Click to toggle.
            {selectedCollections.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{selectedCollections.length} selected</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {collections.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <FolderOpen className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No collections available</p>
              <p className="text-xs text-muted-foreground mt-0.5">Create collections from Commerce → Collections</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-3 rounded-lg border bg-muted/10 min-h-[60px]">
              {collections.map(c => {
                const active = selectedCollections.includes(c.id);
                return (
                  <Badge
                    key={c.id}
                    variant={active ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${active ? 'shadow-sm' : 'hover:bg-muted/50'}`}
                    onClick={() => setSelectedCollections(prev =>
                      active ? prev.filter(x => x !== c.id) : [...prev, c.id]
                    )}
                  >
                    {c.name}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
