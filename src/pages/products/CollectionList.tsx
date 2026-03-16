import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function CollectionList() {
  return (
    <AdminListPage
      title="Collections"
      tableName="product_collections"
      searchPlaceholder="Search collections..."
      searchFields={['name', 'slug']}
      orderBy="sort_order"
      columns={[
        { label: 'Order', key: 'sort_order' },
        { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
        { label: 'Slug', key: 'slug', render: r => <span className="font-mono text-xs text-muted-foreground">{r.slug}</span> },
        { label: 'Description', key: 'description', render: r => <span className="text-sm text-muted-foreground truncate max-w-[200px] block">{r.description || '—'}</span> },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
