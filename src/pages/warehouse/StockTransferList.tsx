import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function StockTransferList() {
  return (
    <AdminPage>
      <AdminListPage title="Stock Transfers" tableName="stock_transfers" searchPlaceholder="Search transfers..." searchFields={['transfer_number']}
        columns={[
          { label: 'Transfer #', key: 'transfer_number', sortable: true, render: r => <span className="font-medium font-mono">{r.transfer_number}</span> },
          { label: 'Status', key: 'status', sortable: true, render: r => <Badge variant="secondary">{r.status}</Badge> },
          { label: 'Date', key: 'transfer_date', sortable: true, render: r => r.transfer_date ? new Date(r.transfer_date).toLocaleDateString() : '—' },
          { label: 'Created', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
