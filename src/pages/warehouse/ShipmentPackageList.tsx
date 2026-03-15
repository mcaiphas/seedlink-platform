import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function ShipmentPackageList() {
  return (
    <AdminPage>
      <AdminListPage title="Shipment Packages" tableName="shipment_packages" searchPlaceholder="Search packages..." searchFields={['tracking_number']}
        columns={[
          { label: 'Tracking #', key: 'tracking_number', sortable: true, render: r => <span className="font-medium font-mono">{r.tracking_number || '—'}</span> },
          { label: 'Weight (kg)', key: 'weight_kg', sortable: true, render: r => r.weight_kg ?? '—' },
          { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant="secondary">{r.status}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
