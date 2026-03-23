begin;

create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid(),

  sales_order_number text unique,
  source_order_id uuid,
  customer_id uuid,

  status text default 'draft',
  currency_code text default 'ZAR',

  subtotal_amount numeric default 0,
  tax_amount numeric default 0,
  total_amount numeric default 0,

  payment_status text default 'pending',

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  approved_at timestamptz,
  cancelled_at timestamptz
);

alter table public.orders
add column if not exists sales_order_id uuid;

create index if not exists idx_sales_orders_customer_id
on public.sales_orders(customer_id);

create index if not exists idx_sales_orders_source_order
on public.sales_orders(source_order_id);

create or replace function public.create_sales_order_from_order(
  p_order_id uuid
)
returns public.sales_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_sales_order public.sales_orders%rowtype;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id;

  if v_order.id is null then
    raise exception 'Order not found: %', p_order_id;
  end if;

  if v_order.sales_order_id is not null then
    select *
    into v_sales_order
    from public.sales_orders
    where id = v_order.sales_order_id;

    return v_sales_order;
  end if;

  insert into public.sales_orders (
    sales_order_number,
    source_order_id,
    customer_id,
    total_amount,
    currency_code,
    status,
    payment_status,
    created_at,
    updated_at
  )
  values (
    public.generate_sales_order_number(),
    v_order.id,
    v_order.customer_id,
    v_order.total_amount,
    coalesce(v_order.currency_code, 'ZAR'),
    'confirmed',
    coalesce(v_order.payment_status, 'pending'),
    now(),
    now()
  )
  returning *
  into v_sales_order;

  update public.orders
  set sales_order_id = v_sales_order.id
  where id = v_order.id;

  return v_sales_order;
end;
$$;

commit;
