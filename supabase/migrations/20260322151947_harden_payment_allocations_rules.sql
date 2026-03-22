begin;

-- Ensure at least one target document exists
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payment_allocations_target_check'
  ) then
    alter table public.payment_allocations
      add constraint payment_allocations_target_check
      check (
        customer_invoice_id is not null
        or order_id is not null
      );
  end if;
end
$$;

-- Prevent over-allocation beyond payment amount
create or replace function public.validate_payment_allocation_total()
returns trigger
language plpgsql
as $$
declare
  v_payment_id uuid;
  v_payment_amount numeric(18,2);
  v_total_allocated numeric(18,2);
begin
  v_payment_id := coalesce(new.payment_id, old.payment_id);

  select amount
  into v_payment_amount
  from public.payments
  where id = v_payment_id;

  select coalesce(sum(allocated_amount), 0)
  into v_total_allocated
  from public.payment_allocations
  where payment_id = v_payment_id;

  if v_total_allocated > v_payment_amount then
    raise exception 'Allocated amount (%) exceeds payment amount (%) for payment %',
      v_total_allocated, v_payment_amount, v_payment_id;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_validate_payment_allocation_total on public.payment_allocations;

create trigger trg_validate_payment_allocation_total
after insert or update or delete on public.payment_allocations
for each row
execute function public.validate_payment_allocation_total();

commit;
