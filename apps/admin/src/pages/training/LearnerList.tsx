import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function LearnerList() {
  return (
    <AdminListPage
      title="Learners"
      tableName="enrollments"
      selectQuery="*, courses(title), profiles(full_name)"
      searchPlaceholder="Search learners..."
      searchFields={['status']}
      orderBy="created_at"
      
      columns={[
        { label: 'Learner', key: 'user_id', render: r => <span className="font-medium">{(r as any).profiles?.full_name || '—'}</span> },
        { label: 'Course', key: 'course_id', render: r => (r as any).courses?.title || '—' },
        { label: 'Progress', key: 'progress_percent', sortable: true, render: r => (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${r.progress_percent || 0}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{r.progress_percent || 0}%</span>
          </div>
        )},
        { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant={r.status === 'active' ? 'default' : r.status === 'completed' ? 'secondary' : 'outline'} className="capitalize">{r.status}</Badge> },
        { label: 'Enrolled', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]}
    />
  );
}
