create extension if not exists pgcrypto;

-- =========================================================
-- HELPER FUNCTION
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- 1) SUPPLIERS
-- =========================================================
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_code text unique,
  name text not null,
  contact_person text,
  email text,
  phone text,
  vat_number text,
  payment_terms_days integer default 30,
  currency_code text default 'ZAR',
  is_active boolean not null default true,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_suppliers_supplier_name
  on public.suppliers(supplier_name);

drop trigger if exists trg_suppliers_updated_at on public.suppliers;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_suppliers_updated_at
before') then create trigger trg_suppliers_updated_at
before update on public.suppliers
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 2) PURCHASE ORDERS
-- =========================================================
create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text not null unique,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  depot_id uuid references public.depots(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  order_date date not null default current_date,
  expected_date date,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'approved', 'partially_received', 'fully_received', 'cancelled', 'closed')),
  currency_code text not null default 'ZAR',
  subtotal_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  notes text,
  ordered_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_purchase_orders_supplier_id
  on public.purchase_orders(supplier_id);

create index if not exists idx_purchase_orders_depot_id
  on public.purchase_orders(depot_id);

create index if not exists idx_purchase_orders_status
  on public.purchase_orders(status);

drop trigger if exists trg_purchase_orders_updated_at on public.purchase_orders;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_purchase_orders_updated_at
before') then create trigger trg_purchase_orders_updated_at
before update on public.purchase_orders
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 3) PURCHASE ORDER ITEMS
-- =========================================================
create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_description text,
  quantity numeric(14,3) not null default 0,
  quantity_uom text,
  unit_price numeric(14,2) not null default 0,
  line_discount_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  line_total numeric(14,2) not null default 0,
  expected_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_purchase_order_items_po_id
  on public.purchase_order_items(purchase_order_id);

alter table public.purchase_order_items
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_purchase_order_items_variant_id
  on public.purchase_order_items(variant_id);

drop trigger if exists trg_purchase_order_items_updated_at on public.purchase_order_items;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_purchase_order_items_updated_at
before') then create trigger trg_purchase_order_items_updated_at
before update on public.purchase_order_items
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 4) GOODS RECEIPTS
-- =========================================================
create table if not exists public.goods_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  depot_id uuid references public.depots(id) on delete set null,
  receipt_date date not null default current_date,
  status text not null default 'draft'
    check (status in ('draft', 'received', 'posted', 'cancelled')),
  received_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_goods_receipts_supplier_id
  on public.goods_receipts(supplier_id);

create index if not exists idx_goods_receipts_po_id
  on public.goods_receipts(purchase_order_id);

drop trigger if exists trg_goods_receipts_updated_at on public.goods_receipts;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_goods_receipts_updated_at
before') then create trigger trg_goods_receipts_updated_at
before update on public.goods_receipts
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 5) GOODS RECEIPT ITEMS
-- =========================================================
create table if not exists public.goods_receipt_items (
  id uuid primary key default gen_random_uuid(),
  goods_receipt_id uuid not null references public.goods_receipts(id) on delete cascade,
  purchase_order_item_id uuid references public.purchase_order_items(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity_received numeric(14,3) not null default 0,
  accepted_quantity numeric(14,3) not null default 0,
  rejected_quantity numeric(14,3) not null default 0,
  quantity_uom text,
  unit_cost numeric(14,2) not null default 0,
  batch_number text,
  expiry_date date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_goods_receipt_items_gr_id
  on public.goods_receipt_items(goods_receipt_id);

alter table public.goods_receipt_items
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_goods_receipt_items_variant_id
  on public.goods_receipt_items(variant_id);

-- =========================================================
-- 6) SUPPLIER INVOICES
-- =========================================================
create table if not exists public.supplier_invoices (
  id uuid primary key default gen_random_uuid(),
  si_number text not null unique,
  supplier_invoice_number text,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  goods_receipt_id uuid references public.goods_receipts(id) on delete set null,
  invoice_date date not null default current_date,
  due_date date,
  status text not null default 'draft'
    check (status in ('draft', 'matched', 'approved', 'posted', 'partially_paid', 'paid', 'cancelled')),
  currency_code text not null default 'ZAR',
  subtotal_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_supplier_invoices_supplier_id
  on public.supplier_invoices(supplier_id);

create index if not exists idx_supplier_invoices_po_id
  on public.supplier_invoices(purchase_order_id);

drop trigger if exists trg_supplier_invoices_updated_at on public.supplier_invoices;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_supplier_invoices_updated_at
before') then create trigger trg_supplier_invoices_updated_at
before update on public.supplier_invoices
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 7) SUPPLIER INVOICE ITEMS
-- =========================================================
create table if not exists public.supplier_invoice_items (
  id uuid primary key default gen_random_uuid(),
  supplier_invoice_id uuid not null references public.supplier_invoices(id) on delete cascade,
  purchase_order_item_id uuid references public.purchase_order_items(id) on delete set null,
  goods_receipt_item_id uuid references public.goods_receipt_items(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity numeric(14,3) not null default 0,
  unit_price numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  line_total numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_supplier_invoice_items_invoice_id
  on public.supplier_invoice_items(supplier_invoice_id);

alter table public.supplier_invoice_items
  add column if not exists goods_receipt_item_id uuid,
  add column if not exists product_id uuid,
  add column if not exists variant_id uuid,
  add column if not exists quantity numeric(14,3) not null default 0,
  add column if not exists unit_price numeric(14,2) not null default 0,
  add column if not exists tax_amount numeric(14,2) not null default 0,
  add column if not exists line_total numeric(14,2) not null default 0,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'supplier_invoice_items_goods_receipt_item_id_fkey'
  ) then
    alter table public.supplier_invoice_items
      add constraint supplier_invoice_items_goods_receipt_item_id_fkey
      foreign key (goods_receipt_item_id)
      references public.goods_receipt_items(id)
      on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'supplier_invoice_items_product_id_fkey'
  ) then
    alter table public.supplier_invoice_items
      add constraint supplier_invoice_items_product_id_fkey
      foreign key (product_id)
      references public.products(id)
      on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'supplier_invoice_items_variant_id_fkey'
  ) then
    alter table public.supplier_invoice_items
      add constraint supplier_invoice_items_variant_id_fkey
      foreign key (variant_id)
      references public.product_variants(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_supplier_invoice_items_variant_id
  on public.supplier_invoice_items(variant_id);

-- =========================================================
-- 8) CUSTOMER INVOICES
-- =========================================================
create table if not exists public.customer_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  customer_id uuid,
  order_id uuid references public.orders(id) on delete set null,
  depot_id uuid references public.depots(id) on delete set null,
  invoice_date date not null default current_date,
  due_date date,
  status text not null default 'draft'
    check (status in ('draft', 'posted', 'partially_paid', 'paid', 'cancelled', 'credited')),
  currency_code text not null default 'ZAR',
  subtotal_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customer_invoices_order_id
  on public.customer_invoices(order_id);

create index if not exists idx_customer_invoices_status
  on public.customer_invoices(status);

drop trigger if exists trg_customer_invoices_updated_at on public.customer_invoices;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_customer_invoices_updated_at
before') then create trigger trg_customer_invoices_updated_at
before update on public.customer_invoices
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 9) CUSTOMER INVOICE ITEMS
-- =========================================================
create table if not exists public.customer_invoice_items (
  id uuid primary key default gen_random_uuid(),
  customer_invoice_id uuid not null references public.customer_invoices(id) on delete cascade,
  order_item_id uuid,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity numeric(14,3) not null default 0,
  unit_price numeric(14,2) not null default 0,
  discount_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  line_total numeric(14,2) not null default 0,
  cost_of_sale_unit numeric(14,2),
  created_at timestamptz not null default now()
);

create index if not exists idx_customer_invoice_items_invoice_id
  on public.customer_invoice_items(customer_invoice_id);

alter table public.customer_invoice_items
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_customer_invoice_items_variant_id
  on public.customer_invoice_items(variant_id);

-- =========================================================
-- 10) STOCK MOVEMENTS
-- signed quantity: positive = in, negative = out
-- =========================================================
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  movement_number text not null unique,
  movement_type text not null
    check (movement_type in (
      'purchase_receipt',
      'sales_issue',
      'adjustment_in',
      'adjustment_out',
      'transfer_in',
      'transfer_out',
      'return_from_customer',
      'return_to_supplier',
      'opening_balance'
    )),
  movement_date date not null default current_date,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  depot_id uuid references public.depots(id) on delete set null,
  batch_number text,
  quantity numeric(14,3) not null,
  quantity_uom text,
  unit_cost numeric(14,2),
  total_cost numeric(14,2),
  reference_type text,
  reference_id uuid,
  reference_line_id uuid,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_stock_movements_variant_id
  on public.stock_movements(variant_id);

create index if not exists idx_stock_movements_depot_id
  on public.stock_movements(depot_id);

create index if not exists idx_stock_movements_reference
  on public.stock_movements(reference_type, reference_id);

-- =========================================================
-- 11) STOCK ADJUSTMENTS
-- =========================================================
create table if not exists public.stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  adjustment_number text not null unique,
  depot_id uuid references public.depots(id) on delete set null,
  reason text,
  status text not null default 'draft'
    check (status in ('draft', 'posted', 'cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_stock_adjustments_updated_at on public.stock_adjustments;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_stock_adjustments_updated_at
before') then create trigger trg_stock_adjustments_updated_at
before update on public.stock_adjustments
for each row
 execute function public.set_updated_at(); end if; end
$$;

create table if not exists public.stock_adjustment_items (
  id uuid primary key default gen_random_uuid(),
  stock_adjustment_id uuid not null references public.stock_adjustments(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity_adjustment numeric(14,3) not null default 0,
  unit_cost numeric(14,2),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_stock_adjustment_items_adjustment_id
  on public.stock_adjustment_items(stock_adjustment_id);

-- =========================================================
-- 12) GL ACCOUNTS
-- =========================================================
create table if not exists public.gl_accounts (
  id uuid primary key default gen_random_uuid(),
  account_code text not null unique,
  account_name text not null,
  account_type text not null
    check (account_type in (
      'asset',
      'liability',
      'equity',
      'income',
      'expense'
    )),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_gl_accounts_type
  on public.gl_accounts(account_type);

-- =========================================================
-- 13) JOURNAL ENTRIES
-- =========================================================
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  journal_number text not null unique,
  entry_date date not null default current_date,
  reference_type text,
  reference_id uuid,
  description text,
  status text not null default 'draft'
    check (status in ('draft', 'posted', 'reversed')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_journal_entries_updated_at on public.journal_entries;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_journal_entries_updated_at
before') then create trigger trg_journal_entries_updated_at
before update on public.journal_entries
for each row
 execute function public.set_updated_at(); end if; end
$$;

create table if not exists public.journal_entry_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  gl_account_id uuid not null references public.gl_accounts(id) on delete restrict,
  debit_amount numeric(14,2) not null default 0,
  credit_amount numeric(14,2) not null default 0,
  line_description text,
  depot_id uuid references public.depots(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_entry_lines_journal_id
  on public.journal_entry_lines(journal_entry_id);

create index if not exists idx_journal_entry_lines_account_id
  on public.journal_entry_lines(gl_account_id);

-- =========================================================
-- 14) OPTIONAL REFERENCE DATA FOR GL ACCOUNTS
-- =========================================================
insert into public.gl_accounts (account_code, account_name, account_type)
values
('1100', 'Inventory', 'asset'),
('1200', 'Accounts Receivable', 'asset'),
('1300', 'Bank', 'asset'),
('2100', 'Goods Received Not Invoiced', 'liability'),
('2200', 'Accounts Payable', 'liability'),
('4100', 'Sales Revenue', 'income'),
('5100', 'Cost of Goods Sold', 'expense'),
('5200', 'VAT Input', 'expense'),
('5300', 'VAT Output', 'liability')
on conflict (account_code) do nothing;
