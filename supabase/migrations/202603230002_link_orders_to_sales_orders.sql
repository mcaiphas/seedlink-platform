begin;

alter table public.orders
add column if not exists sales_order_id uuid references public.sales_orders(id);

commit;
