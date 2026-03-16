import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function SubcategoryList() {
  return (
    <AdminListPage
      title="Subcategories"
      tableName="product_subcategories"
      selectQuery="*, product_categories(name, sku_prefix)"
      searchPlaceholder="Search subcategories..."
      searchFields={['name', 'slug', 'code']}
      orderBy="sort_order"
      columns={[
        { label: 'Order', key: 'sort_order' },
        { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
        { label: 'Category', key: 'category_id', render: r => {
          const cat = r.product_categories as any;
          return cat?.name ? (
            <div className="flex items-center gap-1.5">
              {cat.sku_prefix && <Badge variant="outline" className="font-mono text-[10px] h-4 px-1">{cat.sku_prefix}</Badge>}
              <span className="text-sm">{cat.name}</span>
            </div>
          ) : '—';
        }},
        { label: 'Code', key: 'code', render: r => r.code ? <span className="font-mono text-xs text-muted-foreground">{r.code}</span> : '—' },
        { label: 'Slug', key: 'slug', render: r => <span className="font-mono text-xs text-muted-foreground">{r.slug || '—'}</span> },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
