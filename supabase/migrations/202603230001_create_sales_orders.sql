begin;

create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid()
);

alter table public.sales_orders
  add column if not exists sales_order_number text,
  add column if not exists source_order_id uuid,
  add column if not exists customer_id uuid,
  add column if not exists status text default 'draft',
  add column if not exists currency_code text default 'ZAR',
  add column if not exists subtotal_amount numeric default 0,
  add column if not exists tax_amount numeric default 0,
  add column if not exists total_amount numeric default 0,
  add column if not exists payment_status text default 'pending',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now(),
  add column if not exists approved_at timestamptz,
  add column if not exists cancelled_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sales_orders_sales_order_number_key'
  ) then
    alter table public.sales_orders
      add constraint sales_orders_sales_order_number_key unique (sales_order_number);
  end if;
end
$$;

create index if not exists idx_sales_orders_customer_id
on public.sales_orders(customer_id);

create index if not exists idx_sales_orders_source_order
on public.sales_orders(source_order_id);

commit;
