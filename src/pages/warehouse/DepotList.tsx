import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function DepotList() {
  return (
    <AdminPage>
      <AdminListPage title="Depots" tableName="depots" searchPlaceholder="Search depots..." searchFields={['name', 'code']}
        columns={[
          { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
          { label: 'Code', key: 'code', render: r => <span className="font-mono text-xs text-muted-foreground">{r.code || '—'}</span> },
          { label: 'Location', key: 'location', render: r => r.location || '—' },
          { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
