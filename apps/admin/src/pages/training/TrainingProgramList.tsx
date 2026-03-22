import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function TrainingProgramList() {
  return (
    <AdminListPage
      title="Training Programs"
      tableName="training_programs"
      searchPlaceholder="Search programs..."
      searchFields={['program_name', 'category']}
      columns={[
        { label: 'Program', key: 'program_name', sortable: true, render: r => <span className="font-medium">{r.program_name}</span> },
        { label: 'Category', key: 'category', render: r => <Badge variant="secondary" className="capitalize">{r.category || '—'}</Badge> },
        { label: 'Enrollment', key: 'enrollment_type', render: r => <span className="capitalize">{r.enrollment_type}</span> },
        { label: 'Start', key: 'start_date', sortable: true, render: r => r.start_date ? new Date(r.start_date).toLocaleDateString() : '—' },
        { label: 'End', key: 'end_date', render: r => r.end_date ? new Date(r.end_date).toLocaleDateString() : '—' },
        { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant={r.status === 'active' ? 'default' : 'secondary'} className="capitalize">{r.status}</Badge> },
      ]}
    />
  );
}
