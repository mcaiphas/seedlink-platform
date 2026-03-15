import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function FulfillmentBatchList() {
  return (
    <AdminPage>
      <AdminListPage title="Fulfillment Batches" tableName="fulfillment_batches" searchPlaceholder="Search batches..." searchFields={['batch_number']}
        columns={[
          { label: 'Batch #', key: 'batch_number', sortable: true, render: r => <span className="font-medium font-mono">{r.batch_number}</span> },
          { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant="secondary">{r.status}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
