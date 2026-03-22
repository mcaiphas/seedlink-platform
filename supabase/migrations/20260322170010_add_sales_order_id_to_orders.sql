begin;

alter table public.orders
add column if not exists sales_order_id uuid;

alter table public.orders
drop constraint if exists orders_sales_order_id_fkey;

alter table public.orders
add constraint orders_sales_order_id_fkey
foreign key (sales_order_id)
references public.sales_orders(id)
on delete set null;

create index if not exists idx_orders_sales_order_id
on public.orders(sales_order_id);

commit;
