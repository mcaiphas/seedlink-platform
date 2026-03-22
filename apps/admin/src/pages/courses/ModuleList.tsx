import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function ModuleList() {
  return (
    <AdminListPage title="Course Modules" tableName="course_modules" selectQuery="*, courses(title)" searchPlaceholder="Search modules..." searchFields={['title']} orderBy="sort_order"
      columns={[
        { label: 'Title', key: 'title', sortable: true, render: r => <span className="font-medium">{r.title}</span> },
        { label: 'Course', key: 'course_id', render: r => (r.courses as any)?.title || '—' },
        { label: 'Order', key: 'sort_order' },
        { label: 'Published', key: 'is_published', render: r => <Badge variant={r.is_published ? 'default' : 'secondary'}>{r.is_published ? 'Yes' : 'No'}</Badge> },
      ]} />
  );
}
