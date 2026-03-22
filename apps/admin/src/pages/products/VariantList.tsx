import { AdminListPage } from '@/components/AdminListPage';
import { Badge } from '@/components/ui/badge';

export default function VariantList() {
  return (
    <AdminListPage
      title="Product Variants"
      tableName="product_variants"
      selectQuery="*, products(name, currency_code), product_pack_sizes(name)"
      searchPlaceholder="Search variants..."
      searchFields={['variant_name', 'sku', 'barcode']}
      columns={[
        { label: 'Name', key: 'variant_name', sortable: true, render: r => (
          <div>
            <span className="font-medium">{r.variant_name}</span>
            <span className="block text-xs text-muted-foreground font-mono">{r.sku}</span>
          </div>
        )},
        { label: 'Product', key: 'product_id', render: r => (r.products as any)?.name || '—' },
        { label: 'Pack Size', key: 'pack_size_id', render: r => (r.product_pack_sizes as any)?.name || <span className="text-muted-foreground text-xs">—</span> },
        { label: 'Buying', key: 'buying_price', sortable: true, render: r => {
          const cc = (r.products as any)?.currency_code || 'ZAR';
          return r.buying_price != null ? <span className="tabular-nums">{cc} {Number(r.buying_price).toFixed(2)}</span> : '—';
        }},
        { label: 'Selling', key: 'selling_price', sortable: true, render: r => {
          const cc = (r.products as any)?.currency_code || 'ZAR';
          return r.selling_price != null ? <span className="tabular-nums">{cc} {Number(r.selling_price).toFixed(2)}</span> : '—';
        }},
        { label: 'Margin %', key: 'margin_percent', render: r => r.margin_percent != null ? (
          <span className={Number(r.margin_percent) < 10 ? 'text-destructive tabular-nums' : 'text-primary tabular-nums'}>{Number(r.margin_percent).toFixed(1)}%</span>
        ) : '—' },
        { label: 'Status', key: 'variant_status', render: r => (
          <Badge variant={r.is_active ? 'default' : 'secondary'} className="capitalize text-xs">{r.variant_status}</Badge>
        )},
      ]}
    />
  );
}
