import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';
import { AdminPage } from '@/components/AdminPage';

export default function StockMovementList() {
  return (
    <AdminPage>
      <AdminListPage title="Stock Movements" tableName="stock_movements" searchPlaceholder="Search movements..." searchFields={['movement_type', 'reference_number']}
        columns={[
          { label: 'Type', key: 'movement_type', sortable: true, render: r => <Badge variant="secondary" className="capitalize">{r.movement_type}</Badge> },
          { label: 'Reference', key: 'reference_number', render: r => <span className="font-mono text-xs">{r.reference_number || '—'}</span> },
          { label: 'Quantity', key: 'quantity', sortable: true },
          { label: 'UOM', key: 'quantity_uom' },
          { label: 'Date', key: 'created_at', sortable: true, render: r => new Date(r.created_at).toLocaleDateString() },
        ]} />
    </AdminPage>
  );
}
