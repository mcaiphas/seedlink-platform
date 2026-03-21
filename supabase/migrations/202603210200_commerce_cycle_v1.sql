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

create or replace function public.commerce_can_write()
returns boolean
language sql
stable
as $fn$
  select
    public.jwt_has_role('superuser')
    or public.jwt_has_role('admin')
    or public.jwt_has_role('commerce_admin')
    or public.jwt_has_role('commerce_manager');
$fn$;

create or replace function public.commerce_can_read()
returns boolean
language sql
stable
as $fn$
  select auth.uid() is not null;
$fn$;

create or replace function public.current_customer_user_id()
returns uuid
language sql
stable
as $fn$
  select auth.uid();
$fn$;

-- =========================================================
-- TABLES
-- =========================================================

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  user_id uuid null,
  customer_code text,
  full_name text not null,
  email text,
  phone text,
  status text not null default 'active'
    check (status in ('active','inactive','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers
  add column if not exists tenant_id uuid,
  add column if not exists user_id uuid,
  add column if not exists customer_code text,
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_customers_tenant_code
  on public.customers(tenant_id, customer_code)
  where customer_code is not null;

create index if not exists idx_customers_tenant on public.customers(tenant_id);
create index if not exists idx_customers_user_id on public.customers(user_id);
create index if not exists idx_customers_status on public.customers(status);
create index if not exists idx_customers_name_trgm on public.customers using gin (full_name gin_trgm_ops);
create index if not exists idx_customers_email_trgm on public.customers using gin (email gin_trgm_ops);

drop trigger if exists trg_customers_set_updated_at on public.customers;
create trigger trg_customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid not null references public.customers(id) on delete cascade,
  address_type text not null
    check (address_type in ('billing','shipping')),
  recipient_name text,
  phone text,
  line1 text not null,
  line2 text,
  suburb text,
  city text,
  province text,
  postal_code text,
  country_code text not null default 'ZA',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.addresses
  add column if not exists tenant_id uuid,
  add column if not exists customer_id uuid,
  add column if not exists address_type text,
  add column if not exists recipient_name text,
  add column if not exists phone text,
  add column if not exists line1 text,
  add column if not exists line2 text,
  add column if not exists suburb text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country_code text not null default 'ZA',
  add column if not exists is_default boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_addresses_tenant on public.addresses(tenant_id);
create index if not exists idx_addresses_customer on public.addresses(customer_id);
create index if not exists idx_addresses_type on public.addresses(address_type);

drop trigger if exists trg_addresses_set_updated_at on public.addresses;
create trigger trg_addresses_set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  name text not null,
  discount_type text not null
    check (discount_type in ('percentage','fixed_amount','free_shipping')),
  discount_value numeric(15,2) not null default 0,
  minimum_order_value numeric(15,2) not null default 0,
  max_usage integer,
  usage_count integer not null default 0,
  per_customer_limit integer,
  valid_from timestamptz,
  valid_to timestamptz,
  status text not null default 'draft'
    check (status in ('draft','active','expired','disabled')),
  applies_to jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_discounts_tenant_code
  on public.discounts(tenant_id, code);

create index if not exists idx_discounts_tenant on public.discounts(tenant_id);
create index if not exists idx_discounts_status on public.discounts(status);
create index if not exists idx_discounts_code_trgm on public.discounts using gin (code gin_trgm_ops);
create index if not exists idx_discounts_name_trgm on public.discounts using gin (name gin_trgm_ops);

drop trigger if exists trg_discounts_set_updated_at on public.discounts;
create trigger trg_discounts_set_updated_at
before update on public.discounts
for each row execute function public.set_updated_at();

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid references public.customers(id) on delete set null,
  session_id text,
  status text not null default 'active'
    check (status in ('active','converted','abandoned','expired')),
  currency_code text not null default 'ZAR',
  subtotal numeric(15,2) not null default 0,
  discount_total numeric(15,2) not null default 0,
  tax_total numeric(15,2) not null default 0,
  shipping_total numeric(15,2) not null default 0,
  grand_total numeric(15,2) not null default 0,
  discount_code text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint carts_customer_or_session_chk check (customer_id is not null or session_id is not null)
);

alter table public.carts
  add column if not exists tenant_id uuid,
  add column if not exists customer_id uuid,
  add column if not exists session_id text,
  add column if not exists status text not null default 'active',
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists subtotal numeric(15,2) not null default 0,
  add column if not exists discount_total numeric(15,2) not null default 0,
  add column if not exists tax_total numeric(15,2) not null default 0,
  add column if not exists shipping_total numeric(15,2) not null default 0,
  add column if not exists grand_total numeric(15,2) not null default 0,
  add column if not exists discount_code text,
  add column if not exists expires_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_carts_tenant on public.carts(tenant_id);
create index if not exists idx_carts_customer on public.carts(customer_id);
create index if not exists idx_carts_session on public.carts(session_id);
create index if not exists idx_carts_status on public.carts(status);

drop trigger if exists trg_carts_set_updated_at on public.carts;
create trigger trg_carts_set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null,
  sku text,
  product_name text not null,
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(15,2) not null default 0,
  discount_amount numeric(15,2) not null default 0,
  tax_amount numeric(15,2) not null default 0,
  line_total numeric(15,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_cart_items_cart_product
  on public.cart_items(cart_id, product_id);

alter table public.cart_items
  add column if not exists tenant_id uuid,
  add column if not exists cart_id uuid,
  add column if not exists product_id uuid,
  add column if not exists sku text,
  add column if not exists product_name text,
  add column if not exists quantity numeric(12,3) not null default 1,
  add column if not exists unit_price numeric(15,2) not null default 0,
  add column if not exists discount_amount numeric(15,2) not null default 0,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists line_total numeric(15,2) not null default 0,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_cart_items_tenant on public.cart_items(tenant_id);
create index if not exists idx_cart_items_cart on public.cart_items(cart_id);
create index if not exists idx_cart_items_product on public.cart_items(product_id);

drop trigger if exists trg_cart_items_set_updated_at on public.cart_items;
create trigger trg_cart_items_set_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  cart_id uuid not null references public.carts(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  billing_address_id uuid references public.addresses(id) on delete set null,
  shipping_address_id uuid references public.addresses(id) on delete set null,
  delivery_method text,
  payment_method text,
  checkout_status text not null default 'started'
    check (checkout_status in ('started','address_captured','discount_applied','payment_pending','completed','failed','expired')),
  subtotal numeric(15,2) not null default 0,
  discount_total numeric(15,2) not null default 0,
  tax_total numeric(15,2) not null default 0,
  shipping_total numeric(15,2) not null default 0,
  grand_total numeric(15,2) not null default 0,
  discount_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_checkout_sessions_tenant on public.checkout_sessions(tenant_id);
create index if not exists idx_checkout_sessions_cart on public.checkout_sessions(cart_id);
create index if not exists idx_checkout_sessions_customer on public.checkout_sessions(customer_id);
create index if not exists idx_checkout_sessions_status on public.checkout_sessions(checkout_status);

drop trigger if exists trg_checkout_sessions_set_updated_at on public.checkout_sessions;
create trigger trg_checkout_sessions_set_updated_at
before update on public.checkout_sessions
for each row execute function public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_number text not null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  customer_email text,
  customer_phone text,
  cart_id uuid references public.carts(id) on delete set null,
  checkout_session_id uuid references public.checkout_sessions(id) on delete set null,
  billing_address_id uuid references public.addresses(id) on delete set null,
  shipping_address_id uuid references public.addresses(id) on delete set null,
  currency_code text not null default 'ZAR',
  subtotal numeric(15,2) not null default 0,
  discount_total numeric(15,2) not null default 0,
  tax_total numeric(15,2) not null default 0,
  shipping_total numeric(15,2) not null default 0,
  total_amount numeric(15,2) not null default 0,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  order_status text not null default 'cart'
    check (order_status in ('cart','checkout_started','pending_payment','paid','confirmed','packed','dispatched','delivered','cancelled','refunded')),
  discount_code text,
  notes text,
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists tenant_id uuid,
  add column if not exists order_number text,
  add column if not exists customer_id uuid,
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists cart_id uuid,
  add column if not exists checkout_session_id uuid,
  add column if not exists billing_address_id uuid,
  add column if not exists shipping_address_id uuid,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists subtotal numeric(15,2) not null default 0,
  add column if not exists discount_total numeric(15,2) not null default 0,
  add column if not exists tax_total numeric(15,2) not null default 0,
  add column if not exists shipping_total numeric(15,2) not null default 0,
  add column if not exists total_amount numeric(15,2) not null default 0,
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists order_status text not null default 'cart',
  add column if not exists discount_code text,
  add column if not exists notes text,
  add column if not exists placed_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_orders_tenant_order_number
  on public.orders(tenant_id, order_number);

create index if not exists idx_orders_tenant on public.orders(tenant_id);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_order_status on public.orders(order_status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_order_number_trgm on public.orders using gin (order_number gin_trgm_ops);
create index if not exists idx_orders_customer_name_trgm on public.orders using gin (customer_name gin_trgm_ops);
create index if not exists idx_orders_customer_email_trgm on public.orders using gin (customer_email gin_trgm_ops);

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null,
  sku text,
  product_name text not null,
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(15,2) not null default 0,
  discount_amount numeric(15,2) not null default 0,
  tax_amount numeric(15,2) not null default 0,
  line_total numeric(15,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.order_items
  add column if not exists tenant_id uuid,
  add column if not exists order_id uuid,
  add column if not exists product_id uuid,
  add column if not exists sku text,
  add column if not exists product_name text,
  add column if not exists quantity numeric(12,3) not null default 1,
  add column if not exists unit_price numeric(15,2) not null default 0,
  add column if not exists discount_amount numeric(15,2) not null default 0,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists line_total numeric(15,2) not null default 0,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_order_items_tenant on public.order_items(tenant_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

drop trigger if exists trg_order_items_set_updated_at on public.order_items;
create trigger trg_order_items_set_updated_at
before update on public.order_items
for each row execute function public.set_updated_at();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_id uuid references public.orders(id) on delete set null,
  checkout_session_id uuid references public.checkout_sessions(id) on delete set null,
  payment_reference text,
  provider text,
  payment_method text,
  amount numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  provider_transaction_id text,
  provider_response jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments
  add column if not exists tenant_id uuid,
  add column if not exists order_id uuid,
  add column if not exists checkout_session_id uuid,
  add column if not exists payment_reference text,
  add column if not exists provider text,
  add column if not exists payment_method text,
  add column if not exists amount numeric(15,2) not null default 0,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists provider_transaction_id text,
  add column if not exists provider_response jsonb not null default '{}'::jsonb,
  add column if not exists paid_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_payments_tenant on public.payments(tenant_id);
create index if not exists idx_payments_order on public.payments(order_id);
create index if not exists idx_payments_checkout_session on public.payments(checkout_session_id);
create index if not exists idx_payments_status on public.payments(payment_status);

drop trigger if exists trg_payments_set_updated_at on public.payments;
create trigger trg_payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  comment text,
  changed_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_status_history_tenant on public.order_status_history(tenant_id);
create index if not exists idx_order_status_history_order on public.order_status_history(order_id, created_at);

create table if not exists public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_id uuid references public.orders(id) on delete set null,
  cart_id uuid references public.carts(id) on delete set null,
  product_id uuid not null,
  quantity numeric(12,3) not null check (quantity > 0),
  status text not null default 'reserved'
    check (status in ('reserved','allocated','released','consumed')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_reservations_tenant on public.inventory_reservations(tenant_id);
create index if not exists idx_inventory_reservations_order on public.inventory_reservations(order_id);
create index if not exists idx_inventory_reservations_cart on public.inventory_reservations(cart_id);
create index if not exists idx_inventory_reservations_product on public.inventory_reservations(product_id);

drop trigger if exists trg_inventory_reservations_set_updated_at on public.inventory_reservations;
create trigger trg_inventory_reservations_set_updated_at
before update on public.inventory_reservations
for each row execute function public.set_updated_at();

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  subscription_code text not null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  plan_name text not null,
  billing_interval text not null
    check (billing_interval in ('monthly','quarterly','annual')),
  amount numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  status text not null default 'trial'
    check (status in ('trial','active','paused','cancelled','expired')),
  next_billing_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions
  add column if not exists tenant_id uuid,
  add column if not exists subscription_code text,
  add column if not exists customer_id uuid,
  add column if not exists customer_name text,
  add column if not exists plan_name text,
  add column if not exists billing_interval text,
  add column if not exists amount numeric(15,2) not null default 0,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists status text not null default 'trial',
  add column if not exists next_billing_date date,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_subscriptions_tenant_code
  on public.subscriptions(tenant_id, subscription_code);

create index if not exists idx_subscriptions_tenant on public.subscriptions(tenant_id);
create index if not exists idx_subscriptions_customer on public.subscriptions(customer_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

drop trigger if exists trg_subscriptions_set_updated_at on public.subscriptions;
create trigger trg_subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- =========================================================
-- CALCULATION / WORKFLOW FUNCTIONS
-- =========================================================

create or replace function public.recalculate_cart_totals(p_cart_id uuid)
returns public.carts
language plpgsql
as $fn$
declare
  v_cart public.carts%rowtype;
  v_subtotal numeric(15,2) := 0;
  v_discount_total numeric(15,2) := 0;
  v_tax_total numeric(15,2) := 0;
  v_shipping_total numeric(15,2) := 0;
  v_grand_total numeric(15,2) := 0;
begin
  select * into v_cart
  from public.carts
  where id = p_cart_id;

  if not found then
    raise exception 'Cart not found';
  end if;

  update public.cart_items
  set line_total = greatest((quantity * unit_price) - discount_amount + tax_amount, 0)
  where cart_id = p_cart_id;

  select
    coalesce(sum(quantity * unit_price), 0),
    coalesce(sum(discount_amount), 0),
    coalesce(sum(tax_amount), 0)
  into
    v_subtotal,
    v_discount_total,
    v_tax_total
  from public.cart_items
  where cart_id = p_cart_id;

  if v_cart.discount_code is not null then
    select * into v_cart
    from public.apply_discount_code_to_cart(p_cart_id, v_cart.discount_code);
  else
    v_shipping_total := coalesce(v_cart.shipping_total, 0);
    v_grand_total := greatest(v_subtotal - v_discount_total + v_tax_total + v_shipping_total, 0);

    update public.carts
    set
      subtotal = v_subtotal,
      discount_total = v_discount_total,
      tax_total = v_tax_total,
      grand_total = v_grand_total,
      updated_at = now()
    where id = p_cart_id
    returning * into v_cart;
  end if;

  return v_cart;
end;
$fn$;

create or replace function public.apply_discount_code_to_cart(p_cart_id uuid, p_code text)
returns public.carts
language plpgsql
as $fn$
declare
  v_cart public.carts%rowtype;
  v_discount public.discounts%rowtype;
  v_subtotal numeric(15,2) := 0;
  v_item_discount_total numeric(15,2) := 0;
  v_tax_total numeric(15,2) := 0;
  v_discount_total numeric(15,2) := 0;
  v_shipping_total numeric(15,2) := 0;
  v_grand_total numeric(15,2) := 0;
begin
  select * into v_cart
  from public.carts
  where id = p_cart_id;

  if not found then
    raise exception 'Cart not found';
  end if;

  select * into v_discount
  from public.discounts
  where tenant_id = v_cart.tenant_id
    and upper(code) = upper(p_code)
    and status = 'active'
    and (valid_from is null or valid_from <= now())
    and (valid_to is null or valid_to >= now());

  if not found then
    raise exception 'Discount code is invalid or inactive';
  end if;

  select
    coalesce(sum(quantity * unit_price), 0),
    coalesce(sum(discount_amount), 0),
    coalesce(sum(tax_amount), 0)
  into
    v_subtotal,
    v_item_discount_total,
    v_tax_total
  from public.cart_items
  where cart_id = p_cart_id;

  if v_subtotal < coalesce(v_discount.minimum_order_value, 0) then
    raise exception 'Minimum order value not met';
  end if;

  if v_discount.discount_type = 'percentage' then
    v_discount_total := round((v_subtotal * v_discount.discount_value / 100.0)::numeric, 2);
  elsif v_discount.discount_type = 'fixed_amount' then
    v_discount_total := least(v_discount.discount_value, v_subtotal);
  elsif v_discount.discount_type = 'free_shipping' then
    v_discount_total := 0;
    v_shipping_total := 0;
  end if;

  if v_discount.discount_type <> 'free_shipping' then
    v_shipping_total := coalesce(v_cart.shipping_total, 0);
  end if;

  v_grand_total := greatest(v_subtotal - v_item_discount_total - v_discount_total + v_tax_total + v_shipping_total, 0);

  update public.carts
  set
    discount_code = v_discount.code,
    subtotal = v_subtotal,
    discount_total = v_item_discount_total + v_discount_total,
    tax_total = v_tax_total,
    shipping_total = v_shipping_total,
    grand_total = v_grand_total,
    updated_at = now()
  where id = p_cart_id
  returning * into v_cart;

  return v_cart;
end;
$fn$;

create or replace function public.start_checkout_session(p_cart_id uuid, p_customer_id uuid default null)
returns public.checkout_sessions
language plpgsql
as $fn$
declare
  v_cart public.carts%rowtype;
  v_checkout public.checkout_sessions%rowtype;
begin
  select * into v_cart
  from public.carts
  where id = p_cart_id;

  if not found then
    raise exception 'Cart not found';
  end if;

  perform public.recalculate_cart_totals(p_cart_id);

  insert into public.checkout_sessions (
    tenant_id,
    cart_id,
    customer_id,
    checkout_status,
    subtotal,
    discount_total,
    tax_total,
    shipping_total,
    grand_total,
    discount_code
  )
  values (
    v_cart.tenant_id,
    v_cart.id,
    coalesce(p_customer_id, v_cart.customer_id),
    'started',
    v_cart.subtotal,
    v_cart.discount_total,
    v_cart.tax_total,
    v_cart.shipping_total,
    v_cart.grand_total,
    v_cart.discount_code
  )
  returning * into v_checkout;

  return v_checkout;
end;
$fn$;

create or replace function public.submit_checkout_session(p_checkout_session_id uuid)
returns jsonb
language plpgsql
as $fn$
declare
  v_checkout public.checkout_sessions%rowtype;
  v_cart public.carts%rowtype;
  v_customer public.customers%rowtype;
  v_order public.orders%rowtype;
  v_order_number text;
begin
  select * into v_checkout
  from public.checkout_sessions
  where id = p_checkout_session_id;

  if not found then
    raise exception 'Checkout session not found';
  end if;

  select * into v_cart
  from public.carts
  where id = v_checkout.cart_id;

  if not found then
    raise exception 'Cart not found for checkout';
  end if;

  if v_checkout.billing_address_id is null or v_checkout.shipping_address_id is null then
    raise exception 'Billing and shipping address are required';
  end if;

  if v_cart.grand_total <= 0 then
    raise exception 'Cart total must be greater than zero';
  end if;

  if v_cart.customer_id is not null then
    select * into v_customer
    from public.customers
    where id = v_cart.customer_id;
  end if;

  v_order_number := 'ORD-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  insert into public.orders (
    tenant_id,
    order_number,
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    cart_id,
    checkout_session_id,
    billing_address_id,
    shipping_address_id,
    currency_code,
    subtotal,
    discount_total,
    tax_total,
    shipping_total,
    total_amount,
    payment_status,
    order_status,
    discount_code,
    placed_at
  )
  values (
    v_checkout.tenant_id,
    v_order_number,
    v_checkout.customer_id,
    v_customer.full_name,
    v_customer.email,
    v_customer.phone,
    v_checkout.cart_id,
    v_checkout.id,
    v_checkout.billing_address_id,
    v_checkout.shipping_address_id,
    v_cart.currency_code,
    v_cart.subtotal,
    v_cart.discount_total,
    v_cart.tax_total,
    v_cart.shipping_total,
    v_cart.grand_total,
    'pending',
    'pending_payment',
    v_cart.discount_code,
    now()
  )
  returning * into v_order;

  insert into public.order_items (
    tenant_id,
    order_id,
    product_id,
    sku,
    product_name,
    quantity,
    unit_price,
    discount_amount,
    tax_amount,
    line_total,
    metadata
  )
  select
    tenant_id,
    v_order.id,
    product_id,
    sku,
    product_name,
    quantity,
    unit_price,
    discount_amount,
    tax_amount,
    line_total,
    metadata
  from public.cart_items
  where cart_id = v_cart.id;

  insert into public.order_status_history (
    tenant_id,
    order_id,
    status,
    comment,
    changed_by
  )
  values (
    v_order.tenant_id,
    v_order.id,
    'pending_payment',
    'Order created from checkout session',
    auth.uid()
  );

  insert into public.inventory_reservations (
    tenant_id,
    order_id,
    cart_id,
    product_id,
    quantity,
    status,
    expires_at
  )
  select
    tenant_id,
    v_order.id,
    cart_id,
    product_id,
    quantity,
    'reserved',
    now() + interval '2 days'
  from public.cart_items
  where cart_id = v_cart.id;

  insert into public.payments (
    tenant_id,
    order_id,
    checkout_session_id,
    payment_reference,
    provider,
    payment_method,
    amount,
    currency_code,
    payment_status
  )
  values (
    v_order.tenant_id,
    v_order.id,
    v_checkout.id,
    'PAY-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
    null,
    v_checkout.payment_method,
    v_order.total_amount,
    v_order.currency_code,
    'pending'
  );

  update public.carts
  set status = 'converted', updated_at = now()
  where id = v_cart.id;

  update public.checkout_sessions
  set checkout_status = 'payment_pending', updated_at = now()
  where id = v_checkout.id;

  return jsonb_build_object(
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'payment_status', v_order.payment_status,
    'order_status', v_order.order_status
  );
end;
$fn$;

create or replace function public.confirm_payment_for_order(
  p_order_id uuid,
  p_provider text,
  p_provider_transaction_id text,
  p_provider_response jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
as $fn$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  update public.payments
  set
    provider = p_provider,
    provider_transaction_id = p_provider_transaction_id,
    provider_response = coalesce(p_provider_response, '{}'::jsonb),
    payment_status = 'paid',
    paid_at = now(),
    updated_at = now()
  where order_id = p_order_id;

  update public.orders
  set
    payment_status = 'paid',
    order_status = 'paid',
    updated_at = now()
  where id = p_order_id
  returning * into v_order;

  insert into public.order_status_history (
    tenant_id,
    order_id,
    status,
    comment,
    changed_by
  )
  values (
    v_order.tenant_id,
    v_order.id,
    'paid',
    'Payment confirmed',
    auth.uid()
  );

  update public.inventory_reservations
  set status = 'allocated', updated_at = now()
  where order_id = p_order_id
    and status = 'reserved';

  return jsonb_build_object(
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'payment_status', v_order.payment_status,
    'order_status', v_order.order_status
  );
end;
$fn$;

create or replace function public.fail_payment_for_order(
  p_order_id uuid,
  p_provider text,
  p_provider_response jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
as $fn$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  update public.payments
  set
    provider = p_provider,
    provider_response = coalesce(p_provider_response, '{}'::jsonb),
    payment_status = 'failed',
    failed_at = now(),
    updated_at = now()
  where order_id = p_order_id;

  update public.orders
  set
    payment_status = 'failed',
    order_status = 'pending_payment',
    updated_at = now()
  where id = p_order_id
  returning * into v_order;

  insert into public.order_status_history (
    tenant_id,
    order_id,
    status,
    comment,
    changed_by
  )
  values (
    v_order.tenant_id,
    v_order.id,
    'pending_payment',
    'Payment failed',
    auth.uid()
  );

  return jsonb_build_object(
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'payment_status', v_order.payment_status,
    'order_status', v_order.order_status
  );
end;
$fn$;

-- =========================================================
-- RLS
-- =========================================================

alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.discounts enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.order_status_history enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.subscriptions enable row level security;

-- customers
drop policy if exists customers_select_policy on public.customers;
create policy customers_select_policy on public.customers
for select using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or user_id = public.current_customer_user_id()
  )
);

drop policy if exists customers_write_policy on public.customers;
create policy customers_write_policy on public.customers
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

-- addresses
drop policy if exists addresses_select_policy on public.addresses;
create policy addresses_select_policy on public.addresses
for select using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or customer_id in (
      select id from public.customers where user_id = auth.uid()
    )
  )
);

drop policy if exists addresses_write_policy on public.addresses;
create policy addresses_write_policy on public.addresses
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

-- admin-managed tables
drop policy if exists discounts_select_policy on public.discounts;
create policy discounts_select_policy on public.discounts
for select using (
  public.commerce_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists discounts_write_policy on public.discounts;
create policy discounts_write_policy on public.discounts
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists subscriptions_select_policy on public.subscriptions;
create policy subscriptions_select_policy on public.subscriptions
for select using (
  public.commerce_can_read() and tenant_id = public.current_company_id()
);

drop policy if exists subscriptions_write_policy on public.subscriptions;
create policy subscriptions_write_policy on public.subscriptions
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

-- customer/admin hybrid tables
drop policy if exists carts_select_policy on public.carts;
create policy carts_select_policy on public.carts
for select using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or customer_id in (
      select id from public.customers where user_id = auth.uid()
    )
  )
);

drop policy if exists carts_write_policy on public.carts;
create policy carts_write_policy on public.carts
for all using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or customer_id in (
      select id from public.customers where user_id = auth.uid()
    )
  )
)
with check (
  tenant_id = public.current_company_id()
);

drop policy if exists cart_items_select_policy on public.cart_items;
create policy cart_items_select_policy on public.cart_items
for select using (
  cart_id in (select id from public.carts)
);

drop policy if exists cart_items_write_policy on public.cart_items;
create policy cart_items_write_policy on public.cart_items
for all using (
  cart_id in (select id from public.carts)
)
with check (
  tenant_id = public.current_company_id()
);

drop policy if exists checkout_sessions_select_policy on public.checkout_sessions;
create policy checkout_sessions_select_policy on public.checkout_sessions
for select using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or customer_id in (
      select id from public.customers where user_id = auth.uid()
    )
  )
);

drop policy if exists checkout_sessions_write_policy on public.checkout_sessions;
create policy checkout_sessions_write_policy on public.checkout_sessions
for all using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or customer_id in (
      select id from public.customers where user_id = auth.uid()
    )
  )
)
with check (
  tenant_id = public.current_company_id()
);

drop policy if exists orders_select_policy on public.orders;
create policy orders_select_policy on public.orders
for select using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or customer_id in (
      select id from public.customers where user_id = auth.uid()
    )
  )
);

drop policy if exists orders_write_policy on public.orders;
create policy orders_write_policy on public.orders
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists order_items_select_policy on public.order_items;
create policy order_items_select_policy on public.order_items
for select using (
  order_id in (select id from public.orders)
);

drop policy if exists order_items_write_policy on public.order_items;
create policy order_items_write_policy on public.order_items
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists payments_select_policy on public.payments;
create policy payments_select_policy on public.payments
for select using (
  public.commerce_can_read()
  and (
    tenant_id = public.current_company_id()
    or order_id in (
      select id from public.orders
      where customer_id in (select id from public.customers where user_id = auth.uid())
    )
  )
);

drop policy if exists payments_write_policy on public.payments;
create policy payments_write_policy on public.payments
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists order_status_history_select_policy on public.order_status_history;
create policy order_status_history_select_policy on public.order_status_history
for select using (
  order_id in (select id from public.orders)
);

drop policy if exists order_status_history_write_policy on public.order_status_history;
create policy order_status_history_write_policy on public.order_status_history
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists inventory_reservations_select_policy on public.inventory_reservations;
create policy inventory_reservations_select_policy on public.inventory_reservations
for select using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

drop policy if exists inventory_reservations_write_policy on public.inventory_reservations;
create policy inventory_reservations_write_policy on public.inventory_reservations
for all using (
  public.commerce_can_write() and tenant_id = public.current_company_id()
)
with check (
  public.commerce_can_write() and tenant_id = public.current_company_id()
);

commit;
