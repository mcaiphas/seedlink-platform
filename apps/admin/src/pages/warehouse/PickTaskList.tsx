import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function PickTaskList() {
  return (
    <AdminPage>
      <AdminListPage title="Pick Tasks" tableName="pick_tasks" searchPlaceholder="Search tasks..." searchFields={['status']}
        columns={[
          { label: 'ID', key: 'id', render: r => <span className="font-mono text-xs">{r.id?.slice(0, 8)}</span> },
          { label: 'Quantity', key: 'quantity_to_pick', sortable: true },
          { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant="secondary">{r.status}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
