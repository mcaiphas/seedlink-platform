begin;

alter table public.payments
add column if not exists payment_type text not null default 'order_payment';

commit;
