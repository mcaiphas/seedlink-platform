import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function AdvisorySessionList() {
  return (
    <AdminListPage
      title="Advisory Sessions"
      tableName="advisory_sessions"
      selectQuery="*, customers(business_name), advisory_services(service_name), profiles!advisory_sessions_advisor_id_fkey(full_name)"
      searchPlaceholder="Search sessions..."
      searchFields={['session_number', 'session_type']}
      columns={[
        { label: 'Session #', key: 'session_number', sortable: true, render: r => <span className="font-mono font-medium text-sm">{r.session_number || '—'}</span> },
        { label: 'Customer', key: 'customer_id', render: r => (r as any).customers?.business_name || '—' },
        { label: 'Service', key: 'service_id', render: r => (r as any).advisory_services?.service_name || '—' },
        { label: 'Advisor', key: 'advisor_id', render: r => (r as any).profiles?.full_name || '—' },
        { label: 'Date', key: 'session_date', sortable: true, render: r => r.session_date ? new Date(r.session_date).toLocaleDateString() : '—' },
        { label: 'Status', key: 'status', sortable: true, render: r => (
          <Badge variant={r.status === 'completed' ? 'default' : r.status === 'scheduled' ? 'secondary' : 'outline'} className="capitalize">
            {r.status}
          </Badge>
        )},
      ]}
    />
  );
}
