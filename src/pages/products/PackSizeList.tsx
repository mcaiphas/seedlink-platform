import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function PackSizeList() {
  return (
    <AdminListPage
      title="Pack Sizes"
      tableName="product_pack_sizes"
      searchPlaceholder="Search pack sizes..."
      searchFields={['name']}
      orderBy="sort_order"
      columns={[
        { label: 'Order', key: 'sort_order' },
        { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
        { label: 'Type', key: 'pack_type', render: r => <Badge variant={r.pack_type === 'count' ? 'default' : 'secondary'} className="capitalize text-xs">{r.pack_type}</Badge> },
        { label: 'Qty', key: 'quantity_value', render: r => r.quantity_value != null ? <span className="tabular-nums">{r.quantity_value.toLocaleString()} {r.quantity_unit || ''}</span> : '—' },
        { label: 'Seeds', key: 'seed_count', render: r => r.seed_count != null ? <span className="tabular-nums">{r.seed_count.toLocaleString()}</span> : '—' },
        { label: 'Est. Weight', key: 'estimated_weight_kg', render: r => r.estimated_weight_kg != null ? <span className="tabular-nums">{r.estimated_weight_kg} kg</span> : '—' },
        { label: 'Bulk', key: 'is_bulk', render: r => r.is_bulk ? <Badge variant="outline" className="text-xs">Bulk</Badge> : '' },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
