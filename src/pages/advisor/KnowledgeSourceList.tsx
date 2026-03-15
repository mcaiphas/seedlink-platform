import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function KnowledgeSourceList() {
  return (
    <AdminPage>
      <AdminListPage title="Knowledge Sources" tableName="knowledge_sources" searchPlaceholder="Search sources..." searchFields={['name']}
        columns={[
          { label: 'Name', key: 'name', sortable: true, render: r => <span className="font-medium">{r.name}</span> },
          { label: 'Type', key: 'source_type', render: r => <Badge variant="secondary">{r.source_type}</Badge> },
          { label: 'Status', key: 'is_active', render: r => <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
