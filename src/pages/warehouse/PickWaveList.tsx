import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function PickWaveList() {
  return (
    <AdminPage>
      <AdminListPage title="Pick Waves" tableName="pick_waves" searchPlaceholder="Search waves..." searchFields={['wave_number']}
        columns={[
          { label: 'Wave #', key: 'wave_number', sortable: true, render: r => <span className="font-medium font-mono">{r.wave_number}</span> },
          { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant="secondary">{r.status}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
