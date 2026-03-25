create extension if not exists pgcrypto;

create table public.product_subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.product_categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, name)
);

create table public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  attribute_code text not null unique,
  name text not null,
  description text,
  data_type text not null check (
    data_type in ('text', 'number', 'boolean', 'select')
  ),
  is_required boolean not null default false,
  is_variant_driver boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_attribute_options (
  id uuid primary key default gen_random_uuid(),
  attribute_id uuid not null references public.product_attributes(id) on delete cascade,
  option_value text not null,
  display_label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (attribute_id, option_value)
);

create table public.product_attribute_assignments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  attribute_id uuid not null references public.product_attributes(id) on delete cascade,
  attribute_value_text text,
  attribute_value_number numeric,
  attribute_value_boolean boolean,
  attribute_option_id uuid references public.product_attribute_options(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (product_id, attribute_id)
);

alter table public.products
  add column if not exists subcategory_id uuid references public.product_subcategories(id) on delete set null,
  add column if not exists supplier_id uuid,
  add column if not exists brand text,
  add column if not exists base_uom text not null default 'kg',
  add column if not exists track_inventory boolean not null default true,
  add column if not exists allow_backorder boolean not null default false,
  add column if not exists shipping_weight_kg numeric,
  add column if not exists length_cm numeric,
  add column if not exists width_cm numeric,
  add column if not exists height_cm numeric;

create table public.product_pack_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  pack_code text not null,
  pack_label text not null,
  pack_type text not null check (
    pack_type in ('weight', 'seed_count', 'unit')
  ),
  quantity_value numeric not null,
  quantity_uom text not null,
  seed_count integer,
  conversion_factor_to_kg numeric,
  shipping_weight_kg numeric not null default 0,
  is_default boolean not null default false,
  is_active boolean not null default true,
  length_cm numeric,
  width_cm numeric,
  height_cm numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, pack_code)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  pack_size_id uuid references public.product_pack_sizes(id) on delete set null,
  sku text not null unique,
  variant_name text not null,
  barcode text,
  is_active boolean not null default true,
  price_override numeric,
  compare_at_price_override numeric,
  stock_quantity integer not null default 0,
  shipping_weight_kg numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variant_attribute_values (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  attribute_id uuid not null references public.product_attributes(id) on delete cascade,
  attribute_value_text text,
  attribute_value_number numeric,
  attribute_value_boolean boolean,
  attribute_option_id uuid references public.product_attribute_options(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (variant_id, attribute_id)
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  supplier_code text not null unique,
  supplier_name text not null,
  contact_name text,
  email text,
  phone text,
  tax_number text,
  payment_terms text,
  currency_code text not null default 'ZAR',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add constraint fk_products_supplier
  foreign key (supplier_id) references public.suppliers(id) on delete set null;

create table public.depots (
  id uuid primary key default gen_random_uuid(),
  depot_code text not null unique,
  name text not null,
  depot_type text not null default 'warehouse' check (
    depot_type in ('warehouse', 'store', 'distribution_center', 'pickup_point')
  ),
  organization_id uuid references public.organizations(id) on delete set null,
  address_id uuid references public.addresses(id) on delete set null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.depot_zones (
  id uuid primary key default gen_random_uuid(),
  depot_id uuid not null references public.depots(id) on delete cascade,
  zone_code text not null,
  name text not null,
  zone_type text not null default 'storage' check (
    zone_type in ('receiving', 'storage', 'picking', 'packing', 'dispatch', 'returns')
  ),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (depot_id, zone_code)
);

create table public.storage_bins (
  id uuid primary key default gen_random_uuid(),
  depot_id uuid not null references public.depots(id) on delete cascade,
  zone_id uuid references public.depot_zones(id) on delete set null,
  bin_code text not null,
  name text,
  bin_type text not null default 'standard' check (
    bin_type in ('standard', 'bulk', 'pick_face', 'staging', 'quarantine')
  ),
  capacity_kg numeric,
  is_pickable boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (depot_id, bin_code)
);

create table public.inventory_batches (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  depot_id uuid not null references public.depots(id) on delete cascade,
  bin_id uuid references public.storage_bins(id) on delete set null,
  batch_number text not null,
  lot_number text,
  manufacture_date date,
  expiry_date date,
  quantity_on_hand numeric not null default 0,
  quantity_reserved numeric not null default 0,
  unit_cost numeric,
  currency_code text not null default 'ZAR',
  status text not null default 'available' check (
    status in ('available', 'quarantine', 'damaged', 'expired', 'depleted')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (variant_id, depot_id, batch_number)
);

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  batch_id uuid references public.inventory_batches(id) on delete set null,
  depot_id uuid references public.depots(id) on delete set null,
  bin_id uuid references public.storage_bins(id) on delete set null,
  movement_type text not null check (
    movement_type in (
      'receipt',
      'sale',
      'reservation',
      'release',
      'adjustment',
      'transfer_out',
      'transfer_in',
      'return_in',
      'return_out',
      'pick',
      'pack',
      'dispatch'
    )
  ),
  quantity numeric not null,
  quantity_uom text not null default 'kg',
  unit_cost numeric,
  reference_type text,
  reference_id uuid,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.stock_transfers (
  id uuid primary key default gen_random_uuid(),
  transfer_number text not null unique,
  from_depot_id uuid not null references public.depots(id) on delete restrict,
  to_depot_id uuid not null references public.depots(id) on delete restrict,
  requested_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'approved', 'in_transit', 'received', 'cancelled')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stock_transfer_items (
  id uuid primary key default gen_random_uuid(),
  transfer_id uuid not null references public.stock_transfers(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  batch_id uuid references public.inventory_batches(id) on delete set null,
  requested_quantity numeric not null,
  sent_quantity numeric default 0,
  received_quantity numeric default 0,
  quantity_uom text not null default 'kg',
  notes text,
  created_at timestamptz not null default now()
);

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text not null unique,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  depot_id uuid references public.depots(id) on delete set null,
  ordered_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  order_date date not null default current_date,
  expected_date date,
  currency_code text not null default 'ZAR',
  subtotal_amount numeric not null default 0,
  tax_amount numeric not null default 0,
  total_amount numeric not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'approved', 'sent', 'partially_received', 'received', 'cancelled')
  ),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_description text not null,
  quantity numeric not null,
  quantity_uom text not null default 'kg',
  unit_price numeric not null default 0,
  line_total numeric not null default 0,
  expected_date date,
  created_at timestamptz not null default now()
);

create table public.goods_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  depot_id uuid references public.depots(id) on delete set null,
  received_by uuid references public.profiles(id) on delete set null,
  receipt_date date not null default current_date,
  status text not null default 'received' check (
    status in ('draft', 'received', 'partially_received', 'cancelled')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goods_receipt_items (
  id uuid primary key default gen_random_uuid(),
  goods_receipt_id uuid not null references public.goods_receipts(id) on delete cascade,
  purchase_order_item_id uuid references public.purchase_order_items(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  batch_number text,
  quantity_received numeric not null,
  quantity_uom text not null default 'kg',
  unit_cost numeric,
  expiry_date date,
  created_at timestamptz not null default now()
);

create table public.customer_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  order_id uuid references public.orders(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null,
  invoice_date date not null default current_date,
  due_date date,
  currency_code text not null default 'ZAR',
  subtotal_amount numeric not null default 0,
  tax_amount numeric not null default 0,
  total_amount numeric not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'issued', 'part_paid', 'paid', 'cancelled')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_invoice_items (
  id uuid primary key default gen_random_uuid(),
  customer_invoice_id uuid not null references public.customer_invoices(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  description text not null,
  quantity numeric not null,
  quantity_uom text not null default 'kg',
  unit_price numeric not null default 0,
  line_total numeric not null default 0,
  created_at timestamptz not null default now()
);

create table public.supplier_invoices (
  id uuid primary key default gen_random_uuid(),
  supplier_invoice_number text not null,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  invoice_date date not null default current_date,
  due_date date,
  currency_code text not null default 'ZAR',
  subtotal_amount numeric not null default 0,
  tax_amount numeric not null default 0,
  total_amount numeric not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'received', 'approved', 'paid', 'cancelled')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, supplier_invoice_number)
);

create table public.supplier_invoice_items (
  id uuid primary key default gen_random_uuid(),
  supplier_invoice_id uuid not null references public.supplier_invoices(id) on delete cascade,
  purchase_order_item_id uuid references public.purchase_order_items(id) on delete set null,
  description text not null,
  quantity numeric not null,
  quantity_uom text not null default 'kg',
  unit_price numeric not null default 0,
  line_total numeric not null default 0,
  created_at timestamptz not null default now()
);

create table public.pick_waves (
  id uuid primary key default gen_random_uuid(),
  wave_number text not null unique,
  depot_id uuid not null references public.depots(id) on delete restrict,
  status text not null default 'planned' check (
    status in ('planned', 'released', 'in_progress', 'completed', 'cancelled')
  ),
  priority integer not null default 0,
  scheduled_at timestamptz,
  released_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pick_tasks (
  id uuid primary key default gen_random_uuid(),
  wave_id uuid references public.pick_waves(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  batch_id uuid references public.inventory_batches(id) on delete set null,
  depot_id uuid references public.depots(id) on delete set null,
  bin_id uuid references public.storage_bins(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  quantity_to_pick numeric not null,
  quantity_picked numeric not null default 0,
  quantity_uom text not null default 'kg',
  status text not null default 'open' check (
    status in ('open', 'assigned', 'picked', 'short', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fulfillment_batches (
  id uuid primary key default gen_random_uuid(),
  fulfillment_number text not null unique,
  depot_id uuid references public.depots(id) on delete set null,
  wave_id uuid references public.pick_waves(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  status text not null default 'packing' check (
    status in ('packing', 'packed', 'shipped', 'cancelled')
  ),
  packed_by uuid references public.profiles(id) on delete set null,
  packed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shipment_packages (
  id uuid primary key default gen_random_uuid(),
  fulfillment_batch_id uuid not null references public.fulfillment_batches(id) on delete cascade,
  package_number text not null,
  package_type text,
  gross_weight_kg numeric,
  length_cm numeric,
  width_cm numeric,
  height_cm numeric,
  tracking_number text,
  status text not null default 'packed' check (
    status in ('packed', 'dispatched', 'delivered', 'returned')
  ),
  created_at timestamptz not null default now(),
  unique (fulfillment_batch_id, package_number)
);

create table public.shipment_package_items (
  id uuid primary key default gen_random_uuid(),
  shipment_package_id uuid not null references public.shipment_packages(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  batch_id uuid references public.inventory_batches(id) on delete set null,
  quantity numeric not null,
  quantity_uom text not null default 'kg',
  created_at timestamptz not null default now()
);

create index idx_products_subcategory_id on public.products(subcategory_id);
create index idx_products_supplier_id on public.products(supplier_id);
create index idx_product_attribute_assignments_product_id on public.product_attribute_assignments(product_id);
create index idx_product_attribute_assignments_attribute_id on public.product_attribute_assignments(attribute_id);
create index idx_product_pack_sizes_product_id on public.product_pack_sizes(product_id);
create index idx_product_variants_product_id on public.product_variants(product_id);
create index idx_product_variants_pack_size_id on public.product_variants(pack_size_id);
create index idx_suppliers_organization_id on public.suppliers(organization_id);
create index idx_depots_organization_id on public.depots(organization_id);
create index idx_depot_zones_depot_id on public.depot_zones(depot_id);
create index idx_storage_bins_depot_id on public.storage_bins(depot_id);
create index idx_storage_bins_zone_id on public.storage_bins(zone_id);
create index idx_inventory_batches_variant_id on public.inventory_batches(variant_id);
create index idx_inventory_batches_depot_id on public.inventory_batches(depot_id);
create index idx_inventory_batches_bin_id on public.inventory_batches(bin_id);
create index idx_stock_movements_variant_id on public.stock_movements(variant_id);
create index idx_stock_movements_batch_id on public.stock_movements(batch_id);
create index idx_stock_movements_depot_id on public.stock_movements(depot_id);
create index idx_stock_transfers_from_depot_id on public.stock_transfers(from_depot_id);
create index idx_stock_transfers_to_depot_id on public.stock_transfers(to_depot_id);
create index idx_stock_transfer_items_transfer_id on public.stock_transfer_items(transfer_id);
create index idx_purchase_orders_supplier_id on public.purchase_orders(supplier_id);
create index idx_purchase_orders_depot_id on public.purchase_orders(depot_id);
create index idx_purchase_order_items_purchase_order_id on public.purchase_order_items(purchase_order_id);
create index idx_goods_receipts_purchase_order_id on public.goods_receipts(purchase_order_id);
create index idx_goods_receipt_items_goods_receipt_id on public.goods_receipt_items(goods_receipt_id);
create index idx_customer_invoices_order_id on public.customer_invoices(order_id);
create index idx_customer_invoices_customer_id on public.customer_invoices(customer_id);
create index idx_customer_invoice_items_customer_invoice_id on public.customer_invoice_items(customer_invoice_id);
create index idx_supplier_invoices_supplier_id on public.supplier_invoices(supplier_id);
create index idx_supplier_invoice_items_supplier_invoice_id on public.supplier_invoice_items(supplier_invoice_id);
create index idx_pick_waves_depot_id on public.pick_waves(depot_id);
create index idx_pick_tasks_wave_id on public.pick_tasks(wave_id);
create index idx_pick_tasks_order_id on public.pick_tasks(order_id);
create index idx_pick_tasks_variant_id on public.pick_tasks(variant_id);
create index idx_fulfillment_batches_order_id on public.fulfillment_batches(order_id);
create index idx_shipment_packages_fulfillment_batch_id on public.shipment_packages(fulfillment_batch_id);
create index idx_shipment_package_items_shipment_package_id on public.shipment_package_items(shipment_package_id);

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_subcategories_updated_at
before') then create trigger trg_product_subcategories_updated_at
before update on public.product_subcategories
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_attributes_updated_at
before') then create trigger trg_product_attributes_updated_at
before update on public.product_attributes
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_pack_sizes_updated_at
before') then create trigger trg_product_pack_sizes_updated_at
before update on public.product_pack_sizes
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_variants_updated_at
before') then create trigger trg_product_variants_updated_at
before update on public.product_variants
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_suppliers_updated_at
before') then create trigger trg_suppliers_updated_at
before update on public.suppliers
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_depots_updated_at
before') then create trigger trg_depots_updated_at
before update on public.depots
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_depot_zones_updated_at
before') then create trigger trg_depot_zones_updated_at
before update on public.depot_zones
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_storage_bins_updated_at
before') then create trigger trg_storage_bins_updated_at
before update on public.storage_bins
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_inventory_batches_updated_at
before') then create trigger trg_inventory_batches_updated_at
before update on public.inventory_batches
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_stock_transfers_updated_at
before') then create trigger trg_stock_transfers_updated_at
before update on public.stock_transfers
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_purchase_orders_updated_at
before') then create trigger trg_purchase_orders_updated_at
before update on public.purchase_orders
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_goods_receipts_updated_at
before') then create trigger trg_goods_receipts_updated_at
before update on public.goods_receipts
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_customer_invoices_updated_at
before') then create trigger trg_customer_invoices_updated_at
before update on public.customer_invoices
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_supplier_invoices_updated_at
before') then create trigger trg_supplier_invoices_updated_at
before update on public.supplier_invoices
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_pick_waves_updated_at
before') then create trigger trg_pick_waves_updated_at
before update on public.pick_waves
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_pick_tasks_updated_at
before') then create trigger trg_pick_tasks_updated_at
before update on public.pick_tasks
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_fulfillment_batches_updated_at
before') then create trigger trg_fulfillment_batches_updated_at
before update on public.fulfillment_batches
for each row
 execute function public.set_updated_at(); end if; end
$$;

alter table public.product_subcategories enable row level security;
alter table public.product_attributes enable row level security;
alter table public.product_attribute_options enable row level security;
alter table public.product_attribute_assignments enable row level security;
alter table public.product_pack_sizes enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_variant_attribute_values enable row level security;
alter table public.suppliers enable row level security;
alter table public.depots enable row level security;
alter table public.depot_zones enable row level security;
alter table public.storage_bins enable row level security;
alter table public.inventory_batches enable row level security;
alter table public.stock_movements enable row level security;
alter table public.stock_transfers enable row level security;
alter table public.stock_transfer_items enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.goods_receipts enable row level security;
alter table public.goods_receipt_items enable row level security;
alter table public.customer_invoices enable row level security;
alter table public.customer_invoice_items enable row level security;
alter table public.supplier_invoices enable row level security;
alter table public.supplier_invoice_items enable row level security;
alter table public.pick_waves enable row level security;
alter table public.pick_tasks enable row level security;
alter table public.fulfillment_batches enable row level security;
alter table public.shipment_packages enable row level security;
alter table public.shipment_package_items enable row level security;

drop policy if exists "product_subcategories_public_read" on public.product_subcategories;
create policy "product_subcategories_public_read"
on public.product_subcategories
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "product_subcategories_admin_manage" on public.product_subcategories;
create policy "product_subcategories_admin_manage"
on public.product_subcategories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "product_attributes_admin_or_trainer_read" on public.product_attributes;
create policy "product_attributes_admin_or_trainer_read"
on public.product_attributes
for select
to authenticated
using (public.is_admin() or public.has_role('trainer'));

drop policy if exists "product_attributes_admin_manage" on public.product_attributes;
create policy "product_attributes_admin_manage"
on public.product_attributes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "product_attribute_options_admin_or_trainer_read" on public.product_attribute_options;
create policy "product_attribute_options_admin_or_trainer_read"
on public.product_attribute_options
for select
to authenticated
using (public.is_admin() or public.has_role('trainer'));

drop policy if exists "product_attribute_options_admin_manage" on public.product_attribute_options;
create policy "product_attribute_options_admin_manage"
on public.product_attribute_options
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "product_attribute_assignments_admin_or_supplier_manage" on public.product_attribute_assignments;
create policy "product_attribute_assignments_admin_or_supplier_manage"
on public.product_attribute_assignments
for all
to authenticated
using (public.is_admin() or public.has_role('supplier'))
with check (public.is_admin() or public.has_role('supplier'));

drop policy if exists "product_pack_sizes_read_authenticated" on public.product_pack_sizes;
create policy "product_pack_sizes_read_authenticated"
on public.product_pack_sizes
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "product_pack_sizes_admin_or_supplier_manage" on public.product_pack_sizes;
create policy "product_pack_sizes_admin_or_supplier_manage"
on public.product_pack_sizes
for all
to authenticated
using (public.is_admin() or public.has_role('supplier'))
with check (public.is_admin() or public.has_role('supplier'));

drop policy if exists "product_variants_read_authenticated" on public.product_variants;
create policy "product_variants_read_authenticated"
on public.product_variants
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "product_variants_admin_or_supplier_manage" on public.product_variants;
create policy "product_variants_admin_or_supplier_manage"
on public.product_variants
for all
to authenticated
using (public.is_admin() or public.has_role('supplier'))
with check (public.is_admin() or public.has_role('supplier'));

drop policy if exists "product_variant_attribute_values_admin_or_supplier_manage" on public.product_variant_attribute_values;
create policy "product_variant_attribute_values_admin_or_supplier_manage"
on public.product_variant_attribute_values
for all
to authenticated
using (public.is_admin() or public.has_role('supplier'))
with check (public.is_admin() or public.has_role('supplier'));

drop policy if exists "suppliers_admin_only" on public.suppliers;
create policy "suppliers_admin_only"
on public.suppliers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "depots_admin_only" on public.depots;
create policy "depots_admin_only"
on public.depots
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "depot_zones_admin_only" on public.depot_zones;
create policy "depot_zones_admin_only"
on public.depot_zones
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "storage_bins_admin_only" on public.storage_bins;
create policy "storage_bins_admin_only"
on public.storage_bins
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "inventory_batches_admin_only" on public.inventory_batches;
create policy "inventory_batches_admin_only"
on public.inventory_batches
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "stock_movements_admin_only" on public.stock_movements;
create policy "stock_movements_admin_only"
on public.stock_movements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "stock_transfers_admin_only" on public.stock_transfers;
create policy "stock_transfers_admin_only"
on public.stock_transfers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "stock_transfer_items_admin_only" on public.stock_transfer_items;
create policy "stock_transfer_items_admin_only"
on public.stock_transfer_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "purchase_orders_admin_only" on public.purchase_orders;
create policy "purchase_orders_admin_only"
on public.purchase_orders
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "purchase_order_items_admin_only" on public.purchase_order_items;
create policy "purchase_order_items_admin_only"
on public.purchase_order_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "goods_receipts_admin_only" on public.goods_receipts;
create policy "goods_receipts_admin_only"
on public.goods_receipts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "goods_receipt_items_admin_only" on public.goods_receipt_items;
create policy "goods_receipt_items_admin_only"
on public.goods_receipt_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "customer_invoices_select_owner_or_admin" on public.customer_invoices;
create policy "customer_invoices_select_owner_or_admin"
on public.customer_invoices
for select
to authenticated
using (
  customer_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "customer_invoices_admin_manage" on public.customer_invoices;
create policy "customer_invoices_admin_manage"
on public.customer_invoices
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "customer_invoice_items_select_owner_or_admin" on public.customer_invoice_items;
create policy "customer_invoice_items_select_owner_or_admin"
on public.customer_invoice_items
for select
to authenticated
using (
  exists (
    select 1
    from public.customer_invoices ci
    where ci.id = customer_invoice_items.customer_invoice_id
      and (ci.customer_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "customer_invoice_items_admin_manage" on public.customer_invoice_items;
create policy "customer_invoice_items_admin_manage"
on public.customer_invoice_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "supplier_invoices_admin_only" on public.supplier_invoices;
create policy "supplier_invoices_admin_only"
on public.supplier_invoices
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "supplier_invoice_items_admin_only" on public.supplier_invoice_items;
create policy "supplier_invoice_items_admin_only"
on public.supplier_invoice_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "pick_waves_admin_only" on public.pick_waves;
create policy "pick_waves_admin_only"
on public.pick_waves
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "pick_tasks_admin_only" on public.pick_tasks;
create policy "pick_tasks_admin_only"
on public.pick_tasks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "fulfillment_batches_admin_only" on public.fulfillment_batches;
create policy "fulfillment_batches_admin_only"
on public.fulfillment_batches
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "shipment_packages_admin_only" on public.shipment_packages;
create policy "shipment_packages_admin_only"
on public.shipment_packages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "shipment_package_items_admin_only" on public.shipment_package_items;
create policy "shipment_package_items_admin_only"
on public.shipment_package_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.product_attributes (
  attribute_code,
  name,
  description,
  data_type,
  is_required,
  is_variant_driver,
  is_active
)
values
  ('pack_type', 'Pack Type', 'Whether the pack is weight-based or seed-count-based', 'select', true, true, true),
  ('pack_size', 'Pack Size', 'Commercial pack size label', 'text', true, true, true),
  ('crop_type', 'Crop Type', 'Crop associated with the product', 'text', false, false, true),
  ('seed_count', 'Seed Count', 'Number of seeds in the pack', 'number', false, true, true),
  ('conversion_factor_to_kg', 'Conversion Factor to KG', 'Factor used to convert seed count pack to shipping kg', 'number', false, false, true)
on conflict (attribute_code) do nothing;

insert into public.product_attribute_options (
  attribute_id,
  option_value,
  display_label,
  sort_order
)
select pa.id, vals.option_value, vals.display_label, vals.sort_order
from public.product_attributes pa
join (
  values
    ('pack_type', 'weight', 'Weight', 1),
    ('pack_type', 'seed_count', 'Seed Count', 2)
) as vals(attribute_code, option_value, display_label, sort_order)
on pa.attribute_code = vals.attribute_code
on conflict (attribute_id, option_value) do nothing;
