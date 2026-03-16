import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default', processing: 'secondary', failed: 'destructive', pending: 'outline',
};

export default function ImportJobList() {
  return (
    <AdminListPage
      title="Import Jobs"
      tableName="product_import_jobs"
      searchPlaceholder="Search by file name..."
      searchFields={['file_name']}
      orderBy="created_at"
      orderAscending={false}
      columns={[
        { label: 'File', key: 'file_name', sortable: true, render: r => (
          <div>
            <span className="font-medium">{r.file_name}</span>
            <span className="block text-xs text-muted-foreground font-mono">{r.file_type}</span>
          </div>
        )},
        { label: 'Status', key: 'status', render: r => (
          <Badge variant={STATUS_COLORS[r.status] || 'outline'} className="capitalize">{r.status}</Badge>
        )},
        { label: 'Total Rows', key: 'total_rows', render: r => <span className="tabular-nums">{r.total_rows}</span> },
        { label: 'Success', key: 'success_rows', render: r => <span className="tabular-nums text-primary font-medium">{r.success_rows}</span> },
        { label: 'Failed', key: 'failed_rows', render: r => (
          <span className={`tabular-nums ${r.failed_rows > 0 ? 'text-destructive font-medium' : ''}`}>{r.failed_rows}</span>
        )},
        { label: 'Source', key: 'import_source', render: r => <span className="text-sm text-muted-foreground">{r.import_source || '—'}</span> },
        { label: 'Created', key: 'created_at', render: r => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</span>
        )},
      ]}
    />
  );
}
