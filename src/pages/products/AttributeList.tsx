import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function AttributeList() {
  return (
    <AdminListPage
      title="Product Attributes"
      tableName="product_attributes"
      selectQuery="*, product_categories(name)"
      searchPlaceholder="Search attributes..."
      searchFields={['name', 'attribute_code', 'description']}
      columns={[
        { label: 'Name', key: 'name', sortable: true, render: r => (
          <div>
            <span className="font-medium">{r.name}</span>
            {r.description && <span className="block text-xs text-muted-foreground truncate max-w-[200px]">{r.description}</span>}
          </div>
        )},
        { label: 'Code', key: 'attribute_code', render: r => <span className="font-mono text-xs text-muted-foreground">{r.attribute_code}</span> },
        { label: 'Type', key: 'data_type', render: r => <Badge variant="secondary" className="text-xs">{r.data_type}</Badge> },
        { label: 'Category', key: 'applies_to_category_id', render: r => (r.product_categories as any)?.name || <span className="text-muted-foreground text-xs">All</span> },
        { label: 'Required', key: 'is_required', render: r => r.is_required ? <Badge variant="default" className="text-xs">Yes</Badge> : <span className="text-muted-foreground text-xs">No</span> },
        { label: 'Variant Driver', key: 'is_variant_driver', render: r => r.is_variant_driver ? <Badge variant="default" className="text-xs">Yes</Badge> : <span className="text-muted-foreground text-xs">No</span> },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
