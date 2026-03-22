begin;

alter table public.payment_allocations
add column if not exists order_id uuid;

alter table public.payment_allocations
drop constraint if exists payment_allocations_order_id_fkey;

alter table public.payment_allocations
add constraint payment_allocations_order_id_fkey
foreign key (order_id)
references public.sales_orders(id)
on delete set null;

create index if not exists idx_payment_allocations_order_id
on public.payment_allocations(order_id);

commit;
