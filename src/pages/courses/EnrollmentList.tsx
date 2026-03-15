import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function EnrollmentList() {
  return (
    <AdminListPage title="Enrollments" tableName="enrollments" selectQuery="*, courses(title), profiles(full_name)" searchPlaceholder="Search enrollments..." searchFields={['status']}
      columns={[
        { label: 'Student', key: 'user_id', render: r => (r.profiles as any)?.full_name || '—' },
        { label: 'Course', key: 'course_id', render: r => (r.courses as any)?.title || '—' },
        { label: 'Progress', key: 'progress_percent', sortable: true, render: r => `${r.progress_percent || 0}%` },
        { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant={r.status === 'active' ? 'default' : 'secondary'}>{r.status}</Badge> },
        { label: 'Enrolled', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]} />
  );
}
