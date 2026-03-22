begin;

alter table public.payment_allocations
add column if not exists created_by uuid;

commit;
