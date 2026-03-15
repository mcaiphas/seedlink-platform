import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function KnowledgeBase() {
  return (
    <AdminListPage title="Knowledge Base" tableName="knowledge_documents" searchPlaceholder="Search documents..." searchFields={['title']}
      columns={[
        { label: 'Title', key: 'title', sortable: true, render: r => <span className="font-medium">{r.title}</span> },
        { label: 'Access', key: 'access_level', render: r => <Badge variant="secondary">{r.access_level}</Badge> },
        { label: 'Published', key: 'is_published', render: r => <Badge variant={r.is_published ? 'default' : 'outline'}>{r.is_published ? 'Yes' : 'No'}</Badge> },
        { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]} />
  );
}
