begin;

alter table public.payment_allocations
alter column customer_invoice_id drop not null;

commit;
