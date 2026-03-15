import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionPlanList() {
  return (
    <AdminListPage title="Subscription Plans" tableName="subscription_plans" searchPlaceholder="Search plans..." searchFields={['name', 'plan_code']}
      columns={[
        { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
        { label: 'Code', key: 'plan_code', render: r => <span className="font-mono text-xs text-muted-foreground">{r.plan_code}</span> },
        { label: 'Price', key: 'price', sortable: true, render: r => `${r.currency_code || 'ZAR'} ${Number(r.price || 0).toFixed(2)}` },
        { label: 'Interval', key: 'billing_interval', render: r => r.billing_interval || '—' },
        { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]} />
  );
}
