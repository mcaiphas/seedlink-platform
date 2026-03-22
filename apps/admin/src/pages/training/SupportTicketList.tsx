import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

const priorityVariant = (p: string) => {
  switch (p) {
    case 'urgent': return 'destructive' as const;
    case 'high': return 'default' as const;
    default: return 'secondary' as const;
  }
};

const statusVariant = (s: string) => {
  switch (s) {
    case 'open': return 'default' as const;
    case 'in_progress': return 'outline' as const;
    case 'resolved': case 'closed': return 'secondary' as const;
    default: return 'outline' as const;
  }
};

export default function SupportTicketList() {
  return (
    <AdminListPage
      title="Support Tickets"
      tableName="support_tickets"
      selectQuery="*, customers(customer_name), profiles!support_tickets_assigned_advisor_id_fkey(full_name)"
      searchPlaceholder="Search tickets..."
      searchFields={['ticket_number', 'subject', 'category']}
      columns={[
        { label: 'Ticket #', key: 'ticket_number', sortable: true, render: r => <span className="font-mono font-medium text-sm">{r.ticket_number || '—'}</span> },
        { label: 'Subject', key: 'subject', sortable: true, render: r => <span className="font-medium">{r.subject}</span> },
        { label: 'Customer', key: 'customer_id', render: r => (r as any).customers?.customer_name || '—' },
        { label: 'Category', key: 'category', render: r => <Badge variant="secondary" className="capitalize">{r.category}</Badge> },
        { label: 'Priority', key: 'priority', sortable: true, render: r => <Badge variant={priorityVariant(r.priority)} className="capitalize">{r.priority}</Badge> },
        { label: 'Assigned', key: 'assigned_advisor_id', render: r => (r as any).profiles?.full_name || '—' },
        { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant={statusVariant(r.status)} className="capitalize">{r.status?.replace('_', ' ')}</Badge> },
        { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
      ]}
    />
  );
}
