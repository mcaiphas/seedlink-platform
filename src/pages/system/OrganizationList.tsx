import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';
export default function OrganizationList() {
  return (
    <AdminPage>
      <AdminListPage title="Organizations" tableName="organizations" searchPlaceholder="Search organizations..." searchFields={['name','org_code']}
        columns={[
          { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
          { label: 'Code', key: 'org_code', render: r => <span className="font-mono text-xs text-muted-foreground">{r.org_code || '—'}</span> },
          { label: 'Type', key: 'org_type', render: r => <Badge variant="secondary" className="capitalize">{r.org_type || 'standard'}</Badge> },
          { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'outline'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
