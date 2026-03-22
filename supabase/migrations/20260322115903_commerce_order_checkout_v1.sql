-- =========================================================
-- Seedlink Commerce: Order-to-Checkout Backend Foundation
-- =========================================================

-- ---------- Extensions ----------
create extension if not exists pgcrypto;

-- ---------- Sequences ----------
create sequence if not exists public.cart_number_seq start 1000;
create sequence if not exists public.sales_order_number_seq start 1000;
create sequence if not exists public.payment_reference_seq start 1000;

-- ---------- Generic updated_at trigger ----------
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Number generators ----------
create or replace function public.generate_cart_number()
returns text
language plpgsql
as $$
declare
  v_seq bigint;
begin
  v_seq := nextval('public.cart_number_seq');
  return 'CART-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(v_seq::text, 6, '0');
end;
$$;

create or replace function public.generate_sales_order_number()
returns text
language plpgsql
as $$
declare
  v_seq bigint;
begin
  v_seq := nextval('public.sales_order_number_seq');
  return 'SO-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(v_seq::text, 6, '0');
end;
$$;

create or replace function public.generate_payment_reference()
returns text
language plpgsql
as $$
declare
  v_seq bigint;
begin
  v_seq := nextval('public.payment_reference_seq');
  return 'PAY-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(v_seq::text, 6, '0');
end;
$$;

-- =========================================================
-- 1. SHOPPING CARTS
-- =========================================================
create table if not exists public.shopping_carts (
  id uuid primary key default gen_random_uuid(),
  cart_number text not null unique default public.generate_cart_number(),

  tenant_id uuid null,
  customer_id uuid null references public.customers(id) on delete set null,
  user_id uuid null references auth.users(id) on delete set null,

  status text not null default 'active'
    check (status in ('active', 'converted', 'abandoned', 'expired', 'cancelled')),

  currency_code text not null default 'ZAR',
  subtotal numeric(18,2) not null default 0,
  tax_amount numeric(18,2) not null default 0,
  discount_amount numeric(18,2) not null default 0,
  total_amount numeric(18,2) not null default 0,
  item_count integer not null default 0,

  notes text null,
  metadata jsonb not null default '{}'::jsonb,

  expires_at timestamptz null,
  converted_to_order_id uuid null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_shopping_carts_customer_id on public.shopping_carts(customer_id);
create index if not exists idx_shopping_carts_user_id on public.shopping_carts(user_id);
create index if not exists idx_shopping_carts_status on public.shopping_carts(status);
create index if not exists idx_shopping_carts_tenant_id on public.shopping_carts(tenant_id);

create unique index if not exists uq_shopping_carts_active_user
on public.shopping_carts(user_id)
where status = 'active' and user_id is not null;

create unique index if not exists uq_shopping_carts_active_customer
on public.shopping_carts(customer_id)
where status = 'active' and customer_id is not null;

do $$ begin if not exists (select 1 from pg_trigger where tgname = 'trg_shopping_carts_updated_at
before') then create trigger trg_shopping_carts_updated_at
before update on public.shopping_carts
for each row
 execute function public.set_current_timestamp_updated_at(); end if; end $$;

-- =========================================================
-- 2. CART ITEMS
-- =========================================================
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.shopping_carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,

  -- product snapshot fields for checkout stability
  product_name text not null,
  product_sku text null,
  variant_id uuid null,
  variant_name text null,
  uom text null,

  quantity numeric(18,3) not null check (quantity > 0),
  unit_price numeric(18,2) not null default 0 check (unit_price >= 0),
  tax_rate numeric(8,4) not null default 0 check (tax_rate >= 0),
  tax_amount numeric(18,2) not null default 0 check (tax_amount >= 0),
  discount_amount numeric(18,2) not null default 0 check (discount_amount >= 0),
  line_total numeric(18,2) not null default 0 check (line_total >= 0),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
create index if not exists idx_cart_items_product_id on public.cart_items(product_id);

do $$ begin if not exists (select 1 from pg_trigger where tgname = 'trg_cart_items_updated_at') then create trigger trg_cart_items_updated_at before update on public.cart_items for each row execute function public.set_current_timestamp_updated_at(); end if; end $$;;

-- =========================================================
-- 3. SALES ORDERS
-- =========================================================
create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_sales_order_number(),

  tenant_id uuid null,
  cart_id uuid null references public.shopping_carts(id) on delete set null,
  customer_id uuid null references public.customers(id) on delete set null,
  user_id uuid null references auth.users(id) on delete set null,

  status text not null default 'draft'
    check (status in (
      'draft',
      'pending_payment',
      'awaiting_approval',
      'paid',
      'confirmed',
      'processing',
      'fulfilled',
      'cancelled'
    )),

  payment_status text not null default 'unpaid'
    check (payment_status in (
      'unpaid',
      'pending',
      'paid',
      'failed',
      'cancelled',
      'partially_paid',
      'refunded'
    )),

  fulfillment_status text not null default 'unallocated'
    check (fulfillment_status in (
      'unallocated',
      'reserved',
      'picking',
      'packed',
      'dispatched',
      'delivered',
      'cancelled'
    )),

  payment_method text not null default 'unknown'
    check (payment_method in (
      'unknown',
      'card',
      'eft',
      'credit_account',
      'cash',
      'manual'
    )),

  payment_provider text null,

  currency_code text not null default 'ZAR',
  subtotal numeric(18,2) not null default 0,
  tax_amount numeric(18,2) not null default 0,
  discount_amount numeric(18,2) not null default 0,
  shipping_amount numeric(18,2) not null default 0,
  total_amount numeric(18,2) not null default 0,

  billing_address jsonb not null default '{}'::jsonb,
  delivery_address jsonb not null default '{}'::jsonb,

  notes text null,
  metadata jsonb not null default '{}'::jsonb,

  placed_at timestamptz null,
  confirmed_at timestamptz null,
  cancelled_at timestamptz null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sales_orders_customer_id on public.sales_orders(customer_id);
create index if not exists idx_sales_orders_user_id on public.sales_orders(user_id);
create index if not exists idx_sales_orders_status on public.sales_orders(status);
create index if not exists idx_sales_orders_payment_status on public.sales_orders(payment_status);
create index if not exists idx_sales_orders_fulfillment_status on public.sales_orders(fulfillment_status);
create index if not exists idx_sales_orders_tenant_id on public.sales_orders(tenant_id);
create index if not exists idx_sales_orders_cart_id on public.sales_orders(cart_id);

do $$ begin if not exists (select 1 from pg_trigger where tgname = 'trg_sales_orders_updated_at
before') then create trigger trg_sales_orders_updated_at
before update on public.sales_orders
for each row
 execute function public.set_current_timestamp_updated_at(); end if; end $$;

-- now that sales_orders exists, wire converted_to_order_id FK if not already present
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'shopping_carts'
      and constraint_name = 'shopping_carts_converted_to_order_id_fkey'
  ) then
    alter table public.shopping_carts
      add constraint shopping_carts_converted_to_order_id_fkey
      foreign key (converted_to_order_id) references public.sales_orders(id) on delete set null;
  end if;
end $$;

-- =========================================================
-- 4. SALES ORDER LINES
-- =========================================================
create table if not exists public.sales_order_lines (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references public.sales_orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,

  -- immutable pricing/product snapshot
  product_name text not null,
  product_sku text null,
  variant_id uuid null,
  variant_name text null,
  uom text null,

  quantity numeric(18,3) not null check (quantity > 0),
  unit_price numeric(18,2) not null default 0 check (unit_price >= 0),
  tax_rate numeric(8,4) not null default 0 check (tax_rate >= 0),
  tax_amount numeric(18,2) not null default 0 check (tax_amount >= 0),
  discount_amount numeric(18,2) not null default 0 check (discount_amount >= 0),
  shipping_amount numeric(18,2) not null default 0 check (shipping_amount >= 0),
  line_total numeric(18,2) not null default 0 check (line_total >= 0),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sales_order_lines_order_id on public.sales_order_lines(sales_order_id);
create index if not exists idx_sales_order_lines_product_id on public.sales_order_lines(product_id);

do $$ begin if not exists (select 1 from pg_trigger where tgname = 'trg_sales_order_lines_updated_at
before') then create trigger trg_sales_order_lines_updated_at
before update on public.sales_order_lines
for each row
 execute function public.set_current_timestamp_updated_at(); end if; end $$;

-- =========================================================
-- 7. TOTAL RECALCULATION HELPERS
-- =========================================================
drop function if exists public.recalculate_cart_totals(uuid);

create or replace function public.recalculate_cart_totals(p_cart_id uuid)
returns void
language plpgsql
set search_path = public
as $$
begin
  update public.shopping_carts c
  set
    subtotal = coalesce(agg.subtotal, 0),
    tax_amount = coalesce(agg.tax_amount, 0),
    discount_amount = coalesce(agg.discount_amount, 0),
    total_amount = coalesce(agg.total_amount, 0),
    item_count = coalesce(agg.item_count, 0),
    updated_at = now()
  from (
    select
      ci.cart_id,
      coalesce(sum(ci.unit_price * ci.quantity), 0)::numeric(18,2) as subtotal,
      coalesce(sum(ci.tax_amount), 0)::numeric(18,2) as tax_amount,
      coalesce(sum(ci.discount_amount), 0)::numeric(18,2) as discount_amount,
      coalesce(sum(ci.line_total), 0)::numeric(18,2) as total_amount,
      count(*)::integer as item_count
    from public.cart_items ci
    where ci.cart_id = p_cart_id
    group by ci.cart_id
  ) agg
  where c.id = agg.cart_id;

  update public.shopping_carts c
  set
    subtotal = 0,
    tax_amount = 0,
    discount_amount = 0,
    total_amount = 0,
    item_count = 0,
    updated_at = now()
  where c.id = p_cart_id
    and not exists (
      select 1
      from public.cart_items ci
      where ci.cart_id = p_cart_id
    );
end;
$$;

create or replace function public.trg_recalculate_cart_totals()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.recalculate_cart_totals(coalesce(new.cart_id, old.cart_id));
  return null;
end;
$$;

do $$ begin if not exists (select 1 from pg_trigger where tgname = 'trg_cart_items_recalculate_totals
after') then create trigger trg_cart_items_recalculate_totals
after insert or update or delete on public.cart_items
for each row
 execute function public.trg_recalculate_cart_totals(); end if; end $$;

drop function if exists public.recalculate_sales_order_totals(uuid);

create or replace function public.recalculate_sales_order_totals(p_sales_order_id uuid)
returns void
language plpgsql
set search_path = public
as $$
begin
  update public.sales_orders so
  set
    subtotal = coalesce(agg.subtotal, 0),
    tax_amount = coalesce(agg.tax_amount, 0),
    discount_amount = coalesce(agg.discount_amount, 0),
    shipping_amount = coalesce(agg.shipping_amount, 0),
    total_amount = coalesce(agg.total_amount, 0),
    updated_at = now()
  from (
    select
      sol.sales_order_id,
      coalesce(sum(sol.unit_price * sol.quantity), 0)::numeric(18,2) as subtotal,
      coalesce(sum(sol.tax_amount), 0)::numeric(18,2) as tax_amount,
      coalesce(sum(sol.discount_amount), 0)::numeric(18,2) as discount_amount,
      coalesce(sum(sol.shipping_amount), 0)::numeric(18,2) as shipping_amount,
      coalesce(sum(sol.line_total), 0)::numeric(18,2) as total_amount
    from public.sales_order_lines sol
    where sol.sales_order_id = p_sales_order_id
    group by sol.sales_order_id
  ) agg
  where so.id = agg.sales_order_id;

  update public.sales_orders so
  set
    subtotal = 0,
    tax_amount = 0,
    discount_amount = 0,
    shipping_amount = 0,
    total_amount = 0,
    updated_at = now()
  where so.id = p_sales_order_id
    and not exists (
      select 1
      from public.sales_order_lines sol
      where sol.sales_order_id = p_sales_order_id
    );
end;
$$;

create or replace function public.trg_recalculate_sales_order_totals()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.recalculate_sales_order_totals(coalesce(new.sales_order_id, old.sales_order_id));
  return null;
end;
$$;

do $$ begin if not exists (select 1 from pg_trigger where tgname = 'trg_sales_order_lines_recalculate_totals
after') then create trigger trg_sales_order_lines_recalculate_totals
after insert or update or delete on public.sales_order_lines
for each row
 execute function public.trg_recalculate_sales_order_totals(); end if; end $$;

-- =========================================================
-- 9. OPTIONAL CHECKOUT HELPERS
-- =========================================================
create or replace function public.mark_cart_converted(p_cart_id uuid, p_sales_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.shopping_carts
  set
    status = 'converted',
    converted_to_order_id = p_sales_order_id,
    updated_at = now()
  where id = p_cart_id;
end;
$$;

grant execute on function public.mark_cart_converted(uuid, uuid) to authenticated;

-- =========================================================
-- 10. RLS
-- =========================================================
alter table public.shopping_carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.sales_orders enable row level security;
alter table public.sales_order_lines enable row level security;
alter table public.payments enable row level security;
alter table public.payment_transactions enable row level security;

-- ---------- shopping_carts ----------
drop policy if exists shopping_carts_select on public.shopping_carts;
create policy shopping_carts_select
on public.shopping_carts
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.customers c
    where c.id = customer_id
      and c.user_id = auth.uid()
  )
  or public.current_user_has_permission('orders.view')
  or public.current_user_has_permission('orders.manage')
);

drop policy if exists shopping_carts_insert on public.shopping_carts;
create policy shopping_carts_insert
on public.shopping_carts
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.current_user_has_permission('orders.create')
  or public.current_user_has_permission('orders.manage')
);

drop policy if exists shopping_carts_update on public.shopping_carts;
create policy shopping_carts_update
on public.shopping_carts
for update
to authenticated
using (
  (
    user_id = auth.uid()
    or exists (
      select 1
      from public.customers c
      where c.id = customer_id
        and c.user_id = auth.uid()
    )
  )
  or public.current_user_has_permission('orders.create')
  or public.current_user_has_permission('orders.manage')
)
with check (
  (
    user_id = auth.uid()
    or exists (
      select 1
      from public.customers c
      where c.id = customer_id
        and c.user_id = auth.uid()
    )
  )
  or public.current_user_has_permission('orders.create')
  or public.current_user_has_permission('orders.manage')
);

-- ---------- cart_items ----------
drop policy if exists cart_items_select on public.cart_items;
create policy cart_items_select
on public.cart_items
for select
to authenticated
using (
  exists (
    select 1
    from public.shopping_carts sc
    where sc.id = cart_id
      and (
        sc.user_id = auth.uid()
        or exists (
          select 1
          from public.customers c
          where c.id = sc.customer_id
            and c.user_id = auth.uid()
        )
        or public.current_user_has_permission('orders.view')
        or public.current_user_has_permission('orders.manage')
      )
  )
);

drop policy if exists cart_items_insert on public.cart_items;
create policy cart_items_insert
on public.cart_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.shopping_carts sc
    where sc.id = cart_id
      and (
        sc.user_id = auth.uid()
        or exists (
          select 1
          from public.customers c
          where c.id = sc.customer_id
            and c.user_id = auth.uid()
        )
        or public.current_user_has_permission('orders.create')
        or public.current_user_has_permission('orders.manage')
      )
  )
);

drop policy if exists cart_items_update on public.cart_items;
create policy cart_items_update
on public.cart_items
for update
to authenticated
using (
  exists (
    select 1
    from public.shopping_carts sc
    where sc.id = cart_id
      and (
        sc.user_id = auth.uid()
        or exists (
          select 1
          from public.customers c
          where c.id = sc.customer_id
            and c.user_id = auth.uid()
        )
        or public.current_user_has_permission('orders.create')
        or public.current_user_has_permission('orders.manage')
      )
  )
)
with check (
  exists (
    select 1
    from public.shopping_carts sc
    where sc.id = cart_id
      and (
        sc.user_id = auth.uid()
        or exists (
          select 1
          from public.customers c
          where c.id = sc.customer_id
            and c.user_id = auth.uid()
        )
        or public.current_user_has_permission('orders.create')
        or public.current_user_has_permission('orders.manage')
      )
  )
);

drop policy if exists cart_items_delete on public.cart_items;
create policy cart_items_delete
on public.cart_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.shopping_carts sc
    where sc.id = cart_id
      and (
        sc.user_id = auth.uid()
        or exists (
          select 1
          from public.customers c
          where c.id = sc.customer_id
            and c.user_id = auth.uid()
        )
        or public.current_user_has_permission('orders.create')
        or public.current_user_has_permission('orders.manage')
      )
  )
);

-- ---------- sales_orders ----------
drop policy if exists sales_orders_select on public.sales_orders;
create policy sales_orders_select
on public.sales_orders
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.customers c
    where c.id = customer_id
      and c.user_id = auth.uid()
  )
  or public.current_user_has_permission('orders.view')
  or public.current_user_has_permission('orders.manage')
);

drop policy if exists sales_orders_insert on public.sales_orders;
create policy sales_orders_insert
on public.sales_orders
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.current_user_has_permission('orders.create')
  or public.current_user_has_permission('orders.manage')
);

drop policy if exists sales_orders_update on public.sales_orders;
create policy sales_orders_update
on public.sales_orders
for update
to authenticated
using (
  user_id = auth.uid()
  or public.current_user_has_permission('orders.manage')
)
with check (
  user_id = auth.uid()
  or public.current_user_has_permission('orders.manage')
);

-- ---------- sales_order_lines ----------
drop policy if exists sales_order_lines_select on public.sales_order_lines;
create policy sales_order_lines_select
on public.sales_order_lines
for select
to authenticated
using (
  exists (
    select 1
    from public.sales_orders so
    where so.id = sales_order_id
      and (
        so.user_id = auth.uid()
        or exists (
          select 1
          from public.customers c
          where c.id = so.customer_id
            and c.user_id = auth.uid()
        )
        or public.current_user_has_permission('orders.view')
        or public.current_user_has_permission('orders.manage')
      )
  )
);

drop policy if exists sales_order_lines_insert on public.sales_order_lines;
create policy sales_order_lines_insert
on public.sales_order_lines
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sales_orders so
    where so.id = sales_order_id
      and (
        so.user_id = auth.uid()
        or public.current_user_has_permission('orders.create')
        or public.current_user_has_permission('orders.manage')
      )
  )
);

drop policy if exists sales_order_lines_update on public.sales_order_lines;
create policy sales_order_lines_update
on public.sales_order_lines
for update
to authenticated
using (
  exists (
    select 1
    from public.sales_orders so
    where so.id = sales_order_id
      and (
        so.user_id = auth.uid()
        or public.current_user_has_permission('orders.manage')
      )
  )
)
with check (
  exists (
    select 1
    from public.sales_orders so
    where so.id = sales_order_id
      and (
        so.user_id = auth.uid()
        or public.current_user_has_permission('orders.manage')
      )
  )
);

-- ---------- payments ----------
-- skipped in commerce_order_checkout_v1 because existing payments schema differs

-- ---------- payment_transactions ----------
-- skipped in commerce_order_checkout_v1 because existing payment_transactions schema differs

-- =========================================================
-- 11. Helpful comments
-- =========================================================
comment on table public.shopping_carts is 'Customer or user shopping carts for online ordering.';
comment on table public.cart_items is 'Cart line items with product and pricing snapshot.';
comment on table public.sales_orders is 'Sales order header records created at checkout.';
comment on table public.sales_order_lines is 'Immutable line snapshots for confirmed order pricing.';
comment on table public.payments is 'Payment intents and payment state for sales orders.';
comment on table public.payment_transactions is 'Webhook/event log from payment providers.';
