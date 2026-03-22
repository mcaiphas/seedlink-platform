import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function AdvisorProfileList() {
  return (
    <AdminPage>
      <AdminListPage title="Advisor Profiles" tableName="advisor_profiles" searchPlaceholder="Search profiles..." searchFields={['name', 'advisor_code']}
        columns={[
          { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
          { label: 'Code', key: 'advisor_code', render: r => <span className="font-mono text-xs text-muted-foreground">{r.advisor_code}</span> },
          { label: 'Type', key: 'advisor_type', render: r => <Badge variant="secondary">{r.advisor_type}</Badge> },
          { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
        ]} />
    </AdminPage>
  );
}
