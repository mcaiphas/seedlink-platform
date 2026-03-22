import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function AdvisoryServiceList() {
  return (
    <AdminListPage
      title="Advisory Services"
      tableName="advisory_services"
      searchPlaceholder="Search services..."
      searchFields={['service_name', 'service_category']}
      columns={[
        { label: 'Service', key: 'service_name', sortable: true, render: r => <span className="font-medium">{r.service_name}</span> },
        { label: 'Category', key: 'service_category', render: r => <Badge variant="secondary" className="capitalize">{r.service_category}</Badge> },
        { label: 'Pricing', key: 'pricing_model', render: r => <span className="capitalize">{r.pricing_model?.replace('_', ' ')}</span> },
        { label: 'Price', key: 'price', sortable: true, render: r => r.price > 0 ? `${r.currency_code || 'ZAR'} ${Number(r.price).toFixed(2)}` : <span className="text-primary font-semibold">Free</span> },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
