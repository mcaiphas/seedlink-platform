begin;

-- Drop old FK from payments.order_id -> orders.id
alter table public.payments
drop constraint if exists payments_order_id_fkey;

-- Recreate FK from payments.order_id -> sales_orders.id
alter table public.payments
add constraint payments_order_id_fkey
foreign key (order_id)
references public.sales_orders(id)
on delete set null;

commit;
