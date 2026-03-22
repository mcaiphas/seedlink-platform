import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function StorageBinList() {
  return (
    <AdminPage>
      <AdminListPage title="Storage Bins" tableName="storage_bins" selectQuery="*, depot_zones(zone_name)" searchPlaceholder="Search bins..." searchFields={['bin_code']}
        columns={[
          { label: 'Bin Code', key: 'bin_code', sortable: true, render: r => <span className="font-medium font-mono">{r.bin_code}</span> },
          { label: 'Zone', key: 'zone_id', render: r => (r.depot_zones as any)?.zone_name || '—' },
          { label: 'Type', key: 'bin_type', render: r => <Badge variant="secondary">{r.bin_type || '—'}</Badge> },
          { label: 'Capacity', key: 'capacity', render: r => r.capacity ?? '—' },
          { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
        ]} />
    </AdminPage>
  );
}
