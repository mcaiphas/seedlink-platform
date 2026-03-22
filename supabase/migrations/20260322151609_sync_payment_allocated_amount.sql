begin;

create or replace function public.refresh_payment_allocated_amount(p_payment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.payments
  set
    allocated_amount = coalesce((
      select sum(pa.allocated_amount)
      from public.payment_allocations pa
      where pa.payment_id = p_payment_id
    ), 0),
    updated_at = now()
  where id = p_payment_id;
end;
$$;

create or replace function public.trg_refresh_payment_allocated_amount()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_payment_allocated_amount(old.payment_id);
    return old;
  else
    perform public.refresh_payment_allocated_amount(new.payment_id);
    return new;
  end if;
end;
$$;

drop trigger if exists trg_payment_allocations_refresh_payment on public.payment_allocations;

create trigger trg_payment_allocations_refresh_payment
after insert or update or delete on public.payment_allocations
for each row
execute function public.trg_refresh_payment_allocated_amount();

-- backfill existing rows
update public.payments p
set allocated_amount = coalesce((
  select sum(pa.allocated_amount)
  from public.payment_allocations pa
  where pa.payment_id = p.id
), 0);

commit;
