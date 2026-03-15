import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function ConversationList() {
  return (
    <AdminListPage title="Conversations" tableName="advisor_conversations" searchPlaceholder="Search conversations..." searchFields={['title']}
      columns={[
        { label: 'Title', key: 'title', sortable: true, render: r => <span className="font-medium">{r.title || 'Untitled'}</span> },
        { label: 'Status', key: 'status', render: r => <Badge variant="secondary">{r.status}</Badge> },
        { label: 'Last Message', key: 'last_message_at', sortable: true, render: r => r.last_message_at ? new Date(r.last_message_at).toLocaleString() : '—' },
        { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]} />
  );
}
