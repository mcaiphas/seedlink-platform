import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function InventoryBatchList() {
  return (
    <AdminPage>
      <AdminListPage title="Inventory Batches" tableName="inventory_batches" searchPlaceholder="Search batches..." searchFields={['batch_number']}
        columns={[
          { label: 'Batch #', key: 'batch_number', sortable: true, render: r => <span className="font-medium font-mono">{r.batch_number}</span> },
          { label: 'Quantity', key: 'quantity_on_hand', sortable: true },
          { label: 'UOM', key: 'quantity_uom' },
          { label: 'Expiry', key: 'expiry_date', render: r => r.expiry_date ? new Date(r.expiry_date).toLocaleDateString() : '—' },
          { label: 'Status', key: 'status', render: r => <Badge variant="secondary">{r.status}</Badge> },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
