import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export interface ProductOption {
  id: string;
  name: string;
  sku: string | null;
  default_selling_price: number | null;
  default_buying_price: number | null;
  base_uom: string;
  description: string | null;
}

interface Props {
  value: string | null;
  onSelect: (product: ProductOption | null) => void;
  disabled?: boolean;
  className?: string;
}

let cachedProducts: ProductOption[] | null = null;

async function loadProducts(): Promise<ProductOption[]> {
  if (cachedProducts) return cachedProducts;
  const { data } = await supabase
    .from('products')
    .select('id, name, sku, default_selling_price, default_buying_price, base_uom, description')
    .eq('is_active', true)
    .order('name')
    .limit(1000);
  cachedProducts = (data || []) as ProductOption[];
  return cachedProducts;
}

// Invalidate cache when new product is added
function invalidateCache() { cachedProducts = null; }

export function ProductLineItemSelect({ value, onSelect, disabled, className }: Props) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProducts().then(setProducts); }, []);

  const selected = useMemo(() => products.find(p => p.id === value), [products, value]);

  async function handleCreateProduct() {
    if (!newName.trim()) { toast({ title: 'Product name is required', variant: 'destructive' }); return; }
    setSaving(true);
    const { data, error } = await supabase.from('products').insert({
      name: newName.trim(),
      sku: newSku.trim() || null,
      default_selling_price: newPrice ? Number(newPrice) : null,
      is_active: true,
      status: 'draft',
      product_type: 'physical',
    }).select('id, name, sku, default_selling_price, default_buying_price, base_uom, description').single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    if (data) {
      invalidateCache();
      const prod = data as ProductOption;
      setProducts(prev => [...prev, prod].sort((a, b) => a.name.localeCompare(b.name)));
      onSelect(prod);
      toast({ title: `Product "${prod.name}" created` });
    }
    setShowCreate(false);
    setNewName(''); setNewSku(''); setNewPrice('');
    setSaving(false);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" disabled={disabled}
            className={cn("justify-between h-9 text-xs font-normal w-full", !selected && "text-muted-foreground", className)}>
            <span className="truncate">{selected ? selected.name : 'Select product...'}</span>
            <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search products..." className="h-9" />
            <CommandList>
              <CommandEmpty>
                <p className="text-sm text-muted-foreground py-2">No products found</p>
              </CommandEmpty>
              <CommandGroup>
                {products.map(p => (
                  <CommandItem key={p.id} value={p.name + ' ' + (p.sku || '')}
                    onSelect={() => { onSelect(p); setOpen(false); }}>
                    <Check className={cn("mr-2 h-3 w-3", value === p.id ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                      <span className="text-xs">{p.name}</span>
                      {p.sku && <span className="text-[10px] text-muted-foreground font-mono">{p.sku}</span>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t p-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-1.5"
                onClick={() => { setOpen(false); setShowCreate(true); }}>
                <Plus className="h-3 w-3" /> Add New Product
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Quick Add Product</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Product Name *</Label><Input value={newName} onChange={e => setNewName(e.target.value)} /></div>
            <div><Label>SKU</Label><Input value={newSku} onChange={e => setNewSku(e.target.value)} /></div>
            <div><Label>Default Price</Label><Input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreateProduct} disabled={saving}>{saving ? 'Creating...' : 'Create & Select'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
