import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function FertiliserPlanner() {
  return (
    <AdminListPage title="Fertiliser Planner" tableName="agronomy_tool_runs" searchPlaceholder="Search runs..." searchFields={['run_name']}
      filterFn={(r, s) => r.run_name?.toLowerCase().includes(s) || false}
      columns={[
        { label: 'Run Name', key: 'run_name', sortable: true, render: r => <span className="font-medium">{r.run_name || 'Untitled'}</span> },
        { label: 'Status', key: 'status', render: r => <Badge variant="secondary">{r.status}</Badge> },
        { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]} />
  );
}
