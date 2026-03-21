begin;

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- =========================================================
-- HELPERS
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create or replace function public.current_company_id()
returns uuid
language sql
stable
as $fn$
  select coalesce(
    nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'company_id'), '')::uuid,
    nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'), '')::uuid
  );
$fn$;

create or replace function public.jwt_has_role(role_name text)
returns boolean
language sql
stable
as $fn$
  select
    coalesce(
      (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' -> 'roles') ? role_name,
      false
    )
    or coalesce(
      current_setting('request.jwt.claims', true)::jsonb ->> 'role' = role_name,
      false
    );
$fn$;

create or replace function public.procurement_can_write()
returns boolean
language sql
stable
as $fn$
  select
    public.jwt_has_role('superuser')
    or public.jwt_has_role('admin')
    or public.jwt_has_role('procurement_admin')
    or public.jwt_has_role('procurement_manager');
$fn$;

create or replace function public.procurement_can_read()
returns boolean
language sql
stable
as $fn$
  select auth.uid() is not null;
$fn$;

-- =========================================================
-- TABLE: suppliers
-- =========================================================

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_code text,
  supplier_name text not null,
  contact_person text,
  email text,
  phone text,
  vat_number text,
  payment_terms text,
  credit_limit numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  status text not null default 'active'
    check (status in ('active','inactive','on_hold','blacklisted')),
  address_line1 text,
  address_line2 text,
  city text,
  province text,
  postal_code text,
  country_code text not null default 'ZA',
  notes text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.suppliers
  add column if not exists tenant_id uuid,
  add column if not exists supplier_code text,
  add column if not exists supplier_name text,
  add column if not exists contact_person text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists vat_number text,
  add column if not exists payment_terms text,
  add column if not exists credit_limit numeric(15,2) not null default 0,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists status text not null default 'active',
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country_code text not null default 'ZA',
  add column if not exists notes text,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_suppliers_tenant_supplier_code
  on public.suppliers(tenant_id, supplier_code)
  where supplier_code is not null;

create index if not exists idx_suppliers_tenant on public.suppliers(tenant_id);
create index if not exists idx_suppliers_status on public.suppliers(status);
create index if not exists idx_suppliers_name_trgm on public.suppliers using gin (supplier_name gin_trgm_ops);
create index if not exists idx_suppliers_code_trgm on public.suppliers using gin (supplier_code gin_trgm_ops);
create index if not exists idx_suppliers_contact_trgm on public.suppliers using gin (contact_person gin_trgm_ops);
create index if not exists idx_suppliers_email_trgm on public.suppliers using gin (email gin_trgm_ops);

drop trigger if exists trg_suppliers_set_updated_at on public.suppliers;
create trigger trg_suppliers_set_updated_at
before update on public.suppliers
for each row execute function public.set_updated_at();

-- =========================================================
-- TABLE: purchase_orders
-- =========================================================

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  po_number text not null,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  order_date date not null,
  expected_delivery_date date,
  currency_code text not null default 'ZAR',
  subtotal numeric(15,2) not null default 0,
  tax_total numeric(15,2) not null default 0,
  discount_total numeric(15,2) not null default 0,
  total_amount numeric(15,2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft','submitted','approved','partially_received','received','cancelled','closed')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','partial','paid')),
  notes text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.purchase_orders
  add column if not exists tenant_id uuid,
  add column if not exists po_number text,
  add column if not exists supplier_id uuid,
  add column if not exists order_date date,
  add column if not exists expected_delivery_date date,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists subtotal numeric(15,2) not null default 0,
  add column if not exists tax_total numeric(15,2) not null default 0,
  add column if not exists discount_total numeric(15,2) not null default 0,
  add column if not exists total_amount numeric(15,2) not null default 0,
  add column if not exists status text not null default 'draft',
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists notes text,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_purchase_orders_tenant_po_number
  on public.purchase_orders(tenant_id, po_number);

create index if not exists idx_purchase_orders_tenant on public.purchase_orders(tenant_id);
create index if not exists idx_purchase_orders_supplier on public.purchase_orders(supplier_id);
create index if not exists idx_purchase_orders_status on public.purchase_orders(status);
create index if not exists idx_purchase_orders_payment_status on public.purchase_orders(payment_status);
create index if not exists idx_purchase_orders_order_date on public.purchase_orders(order_date desc);
create index if not exists idx_purchase_orders_po_number_trgm on public.purchase_orders using gin (po_number gin_trgm_ops);

drop trigger if exists trg_purchase_orders_set_updated_at on public.purchase_orders;
create trigger trg_purchase_orders_set_updated_at
before update on public.purchase_orders
for each row execute function public.set_updated_at();

-- =========================================================
-- TABLE: purchase_order_items
-- =========================================================

create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id uuid not null,
  sku text,
  product_name text not null,
  quantity numeric(15,3) not null check (quantity > 0),
  received_quantity numeric(15,3) not null default 0 check (received_quantity >= 0),
  unit_cost numeric(15,2) not null default 0,
  discount_amount numeric(15,2) not null default 0,
  tax_amount numeric(15,2) not null default 0,
  line_total numeric(15,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.purchase_order_items
  add column if not exists tenant_id uuid,
  add column if not exists purchase_order_id uuid,
  add column if not exists product_id uuid,
  add column if not exists sku text,
  add column if not exists product_name text,
  add column if not exists quantity numeric(15,3) not null default 1,
  add column if not exists received_quantity numeric(15,3) not null default 0,
  add column if not exists unit_cost numeric(15,2) not null default 0,
  add column if not exists discount_amount numeric(15,2) not null default 0,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists line_total numeric(15,2) not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_purchase_order_items_tenant on public.purchase_order_items(tenant_id);
create index if not exists idx_purchase_order_items_po on public.purchase_order_items(purchase_order_id);
create index if not exists idx_purchase_order_items_product on public.purchase_order_items(product_id);

drop trigger if exists trg_purchase_order_items_set_updated_at on public.purchase_order_items;
create trigger trg_purchase_order_items_set_updated_at
before update on public.purchase_order_items
for each row execute function public.set_updated_at();

-- =========================================================
-- TABLE: supplier_invoices
-- =========================================================

create table if not exists public.supplier_invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  invoice_number text not null,
  invoice_date date not null,
  due_date date,
  currency_code text not null default 'ZAR',
  subtotal numeric(15,2) not null default 0,
  tax_total numeric(15,2) not null default 0,
  discount_total numeric(15,2) not null default 0,
  total_amount numeric(15,2) not null default 0,
  amount_paid numeric(15,2) not null default 0,
  balance_due numeric(15,2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft','posted','partially_paid','paid','overdue','cancelled')),
  reference text,
  notes text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.supplier_invoices
  add column if not exists tenant_id uuid,
  add column if not exists supplier_id uuid,
  add column if not exists purchase_order_id uuid,
  add column if not exists invoice_number text,
  add column if not exists invoice_date date,
  add column if not exists due_date date,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists subtotal numeric(15,2) not null default 0,
  add column if not exists tax_total numeric(15,2) not null default 0,
  add column if not exists discount_total numeric(15,2) not null default 0,
  add column if not exists total_amount numeric(15,2) not null default 0,
  add column if not exists amount_paid numeric(15,2) not null default 0,
  add column if not exists balance_due numeric(15,2) not null default 0,
  add column if not exists status text not null default 'draft',
  add column if not exists reference text,
  add column if not exists notes text,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_supplier_invoices_tenant_supplier_invoice
  on public.supplier_invoices(tenant_id, supplier_id, invoice_number);

create index if not exists idx_supplier_invoices_tenant on public.supplier_invoices(tenant_id);
create index if not exists idx_supplier_invoices_supplier on public.supplier_invoices(supplier_id);
create index if not exists idx_supplier_invoices_po on public.supplier_invoices(purchase_order_id);
create index if not exists idx_supplier_invoices_status on public.supplier_invoices(status);
create index if not exists idx_supplier_invoices_invoice_date on public.supplier_invoices(invoice_date desc);
create index if not exists idx_supplier_invoices_invoice_number_trgm on public.supplier_invoices using gin (invoice_number gin_trgm_ops);
create index if not exists idx_supplier_invoices_reference_trgm on public.supplier_invoices using gin (reference gin_trgm_ops);

drop trigger if exists trg_supplier_invoices_set_updated_at on public.supplier_invoices;
create trigger trg_supplier_invoices_set_updated_at
before update on public.supplier_invoices
for each row execute function public.set_updated_at();

-- =========================================================
-- TABLE: supplier_invoice_items
-- =========================================================

create table if not exists public.supplier_invoice_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_invoice_id uuid not null references public.supplier_invoices(id) on delete cascade,
  purchase_order_item_id uuid references public.purchase_order_items(id) on delete set null,
  product_id uuid,
  description text,
  quantity numeric(15,3) not null check (quantity > 0),
  unit_cost numeric(15,2) not null default 0,
  tax_amount numeric(15,2) not null default 0,
  discount_amount numeric(15,2) not null default 0,
  line_total numeric(15,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.supplier_invoice_items
  add column if not exists tenant_id uuid,
  add column if not exists supplier_invoice_id uuid,
  add column if not exists purchase_order_item_id uuid,
  add column if not exists product_id uuid,
  add column if not exists description text,
  add column if not exists quantity numeric(15,3) not null default 1,
  add column if not exists unit_cost numeric(15,2) not null default 0,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists discount_amount numeric(15,2) not null default 0,
  add column if not exists line_total numeric(15,2) not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_supplier_invoice_items_tenant on public.supplier_invoice_items(tenant_id);
create index if not exists idx_supplier_invoice_items_invoice on public.supplier_invoice_items(supplier_invoice_id);
create index if not exists idx_supplier_invoice_items_po_item on public.supplier_invoice_items(purchase_order_item_id);
create index if not exists idx_supplier_invoice_items_product on public.supplier_invoice_items(product_id);

drop trigger if exists trg_supplier_invoice_items_set_updated_at on public.supplier_invoice_items;
create trigger trg_supplier_invoice_items_set_updated_at
before update on public.supplier_invoice_items
for each row execute function public.set_updated_at();

-- =========================================================
-- CALCULATION FUNCTIONS
-- =========================================================

create or replace function public.recalculate_purchase_order_totals(p_purchase_order_id uuid)
returns public.purchase_orders
language plpgsql
as $fn$
declare
  v_po public.purchase_orders%rowtype;
  v_subtotal numeric(15,2) := 0;
  v_tax_total numeric(15,2) := 0;
  v_discount_total numeric(15,2) := 0;
  v_total_amount numeric(15,2) := 0;
begin
  update public.purchase_order_items
  set line_total = greatest((quantity * unit_cost) - discount_amount + tax_amount, 0)
  where purchase_order_id = p_purchase_order_id;

  select
    coalesce(sum(quantity * unit_cost), 0),
    coalesce(sum(tax_amount), 0),
    coalesce(sum(discount_amount), 0)
  into
    v_subtotal,
    v_tax_total,
    v_discount_total
  from public.purchase_order_items
  where purchase_order_id = p_purchase_order_id;

  v_total_amount := greatest(v_subtotal - v_discount_total + v_tax_total, 0);

  update public.purchase_orders
  set
    subtotal = v_subtotal,
    tax_total = v_tax_total,
    discount_total = v_discount_total,
    total_amount = v_total_amount,
    updated_at = now()
  where id = p_purchase_order_id
  returning * into v_po;

  return v_po;
end;
$fn$;

create or replace function public.recalculate_supplier_invoice_totals(p_supplier_invoice_id uuid)
returns public.supplier_invoices
language plpgsql
as $fn$
declare
  v_invoice public.supplier_invoices%rowtype;
  v_subtotal numeric(15,2) := 0;
  v_tax_total numeric(15,2) := 0;
  v_discount_total numeric(15,2) := 0;
  v_total_amount numeric(15,2) := 0;
  v_balance_due numeric(15,2) := 0;
begin
  update public.supplier_invoice_items
  set line_total = greatest((quantity * unit_cost) - discount_amount + tax_amount, 0)
  where supplier_invoice_id = p_supplier_invoice_id;

  select
    coalesce(sum(quantity * unit_cost), 0),
    coalesce(sum(tax_amount), 0),
    coalesce(sum(discount_amount), 0)
  into
    v_subtotal,
    v_tax_total,
    v_discount_total
  from public.supplier_invoice_items
  where supplier_invoice_id = p_supplier_invoice_id;

  select * into v_invoice
  from public.supplier_invoices
  where id = p_supplier_invoice_id;

  v_total_amount := greatest(v_subtotal - v_discount_total + v_tax_total, 0);
  v_balance_due := greatest(v_total_amount - coalesce(v_invoice.amount_paid, 0), 0);

  update public.supplier_invoices
  set
    subtotal = v_subtotal,
    tax_total = v_tax_total,
    discount_total = v_discount_total,
    total_amount = v_total_amount,
    balance_due = v_balance_due,
    updated_at = now()
  where id = p_supplier_invoice_id
  returning * into v_invoice;

  return v_invoice;
end;
$fn$;

create or replace function public.submit_purchase_order_record(p_purchase_order_id uuid)
returns public.purchase_orders
language plpgsql
as $fn$
declare
  v_po public.purchase_orders%rowtype;
begin
  update public.purchase_orders
  set
    status = 'submitted',
    updated_at = now()
  where id = p_purchase_order_id
    and status = 'draft'
  returning * into v_po;

  if not found then
    raise exception 'Purchase order not found or not in draft status';
  end if;

  return v_po;
end;
$fn$;

create or replace function public.approve_purchase_order_record(p_purchase_order_id uuid)
returns public.purchase_orders
language plpgsql
as $fn$
declare
  v_po public.purchase_orders%rowtype;
begin
  update public.purchase_orders
  set
    status = 'approved',
    updated_at = now()
  where id = p_purchase_order_id
    and status in ('submitted','draft')
  returning * into v_po;

  if not found then
    raise exception 'Purchase order not found or not in submittable status';
  end if;

  return v_po;
end;
$fn$;

create or replace function public.receive_purchase_order_record(
  p_purchase_order_id uuid,
  p_items jsonb
)
returns public.purchase_orders
language plpgsql
as $fn$
declare
  v_po public.purchase_orders%rowtype;
  v_item record;
  v_all_received boolean := true;
begin
  for v_item in
    select
      (value ->> 'purchase_order_item_id')::uuid as purchase_order_item_id,
      coalesce((value ->> 'received_quantity')::numeric, 0) as received_quantity
    from jsonb_array_elements(p_items)
  loop
    update public.purchase_order_items
    set
      received_quantity = least(quantity, coalesce(received_quantity, 0) + v_item.received_quantity),
      updated_at = now()
    where id = v_item.purchase_order_item_id
      and purchase_order_id = p_purchase_order_id;
  end loop;

  if exists (
    select 1
    from public.purchase_order_items
    where purchase_order_id = p_purchase_order_id
      and coalesce(received_quantity, 0) < quantity
  ) then
    v_all_received := false;
  end if;

  update public.purchase_orders
  set
    status = case when v_all_received then 'received' else 'partially_received' end,
    updated_at = now()
  where id = p_purchase_order_id
  returning * into v_po;

  return v_po;
end;
$fn$;

create or replace function public.post_supplier_invoice_record(p_supplier_invoice_id uuid)
returns public.supplier_invoices
language plpgsql
as $fn$
declare
  v_invoice public.supplier_invoices%rowtype;
begin
  perform public.recalculate_supplier_invoice_totals(p_supplier_invoice_id);

  update public.supplier_invoices
  set
    status = case
      when amount_paid >= total_amount and total_amount > 0 then 'paid'
      when amount_paid > 0 and amount_paid < total_amount then 'partially_paid'
      else 'posted'
    end,
    updated_at = now()
  where id = p_supplier_invoice_id
    and status = 'draft'
  returning * into v_invoice;

  if not found then
    raise exception 'Supplier invoice not found or not in draft status';
  end if;

  return v_invoice;
end;
$fn$;

-- =========================================================
-- RLS
-- =========================================================

alter table public.suppliers enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.supplier_invoices enable row level security;
alter table public.supplier_invoice_items enable row level security;

drop policy if exists suppliers_select_policy on public.suppliers;
create policy suppliers_select_policy on public.suppliers
for select using (
  public.procurement_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists suppliers_write_policy on public.suppliers;
create policy suppliers_write_policy on public.suppliers
for all using (
  public.procurement_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.procurement_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists purchase_orders_select_policy on public.purchase_orders;
create policy purchase_orders_select_policy on public.purchase_orders
for select using (
  public.procurement_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists purchase_orders_write_policy on public.purchase_orders;
create policy purchase_orders_write_policy on public.purchase_orders
for all using (
  public.procurement_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.procurement_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists purchase_order_items_select_policy on public.purchase_order_items;
create policy purchase_order_items_select_policy on public.purchase_order_items
for select using (
  public.procurement_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists purchase_order_items_write_policy on public.purchase_order_items;
create policy purchase_order_items_write_policy on public.purchase_order_items
for all using (
  public.procurement_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.procurement_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists supplier_invoices_select_policy on public.supplier_invoices;
create policy supplier_invoices_select_policy on public.supplier_invoices
for select using (
  public.procurement_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists supplier_invoices_write_policy on public.supplier_invoices;
create policy supplier_invoices_write_policy on public.supplier_invoices
for all using (
  public.procurement_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.procurement_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists supplier_invoice_items_select_policy on public.supplier_invoice_items;
create policy supplier_invoice_items_select_policy on public.supplier_invoice_items
for select using (
  public.procurement_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists supplier_invoice_items_write_policy on public.supplier_invoice_items;
create policy supplier_invoice_items_write_policy on public.supplier_invoice_items
for all using (
  public.procurement_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.procurement_can_write() and tenant_id = public.current_company_id()
);

commit;
