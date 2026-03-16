import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function CategoryList() {
  return (
    <AdminListPage
      title="Product Categories"
      tableName="product_categories"
      searchPlaceholder="Search categories..."
      searchFields={['name', 'slug', 'code', 'sku_prefix']}
      orderBy="sort_order"
      columns={[
        { label: 'Order', key: 'sort_order' },
        { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
        { label: 'SKU Prefix', key: 'sku_prefix', render: r => r.sku_prefix ? <Badge variant="outline" className="font-mono text-xs">{r.sku_prefix}</Badge> : <span className="text-muted-foreground text-xs">—</span> },
        { label: 'Code', key: 'code', render: r => r.code ? <span className="font-mono text-xs text-muted-foreground">{r.code}</span> : '—' },
        { label: 'Slug', key: 'slug', render: r => <span className="font-mono text-xs text-muted-foreground">{r.slug}</span> },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
