import { AdminListPage } from '@/components/AdminListPage';

export default function CropCalendarList() {
  return (
    <AdminListPage title="Crop Calendar Plans" tableName="crop_calendar_plans" searchPlaceholder="Search plans..." searchFields={['plan_name']}
      columns={[
        { label: 'Plan Name', key: 'plan_name', sortable: true, render: r => <span className="font-medium">{r.plan_name}</span> },
        { label: 'Planting Window', key: 'planting_window_start', render: r => r.planting_window_start ? `${new Date(r.planting_window_start).toLocaleDateString()} — ${r.planting_window_end ? new Date(r.planting_window_end).toLocaleDateString() : '?'}` : '—' },
        { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]} />
  );
}
