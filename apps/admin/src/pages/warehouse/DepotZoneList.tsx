import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function DepotZoneList() {
  return (
    <AdminPage>
      <AdminListPage title="Depot Zones" tableName="depot_zones" selectQuery="*, depots(name)" searchPlaceholder="Search zones..." searchFields={['zone_name', 'zone_code']}
        columns={[
          { label: 'Zone', key: 'zone_name', sortable: true, render: r => <span className="font-medium">{r.zone_name}</span> },
          { label: 'Code', key: 'zone_code', render: r => <span className="font-mono text-xs text-muted-foreground">{r.zone_code || '—'}</span> },
          { label: 'Depot', key: 'depot_id', render: r => (r.depots as any)?.name || '—' },
          { label: 'Type', key: 'zone_type', render: r => <Badge variant="secondary">{r.zone_type || '—'}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
