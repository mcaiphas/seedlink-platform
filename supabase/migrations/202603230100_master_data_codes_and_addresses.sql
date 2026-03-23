begin;

alter table public.customers
  add column if not exists customer_code text,
  add column if not exists sales_rep_id uuid,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists suburb text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country text default 'South Africa';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'customers_sales_rep_id_fkey'
  ) then
    alter table public.customers
      add constraint customers_sales_rep_id_fkey
      foreign key (sales_rep_id) references public.profiles(id) on delete set null;
  end if;
end $$;

update public.customers
set customer_code = null
where customer_code is not null and btrim(customer_code) = '';

update public.customers c
set customer_code = 'CUST-' || lpad(x.rn::text, 6, '0')
from (
  select id, row_number() over (order by created_at, id) as rn
  from public.customers
  where customer_code is null
) x
where c.id = x.id;

create unique index if not exists customers_customer_code_key
  on public.customers(customer_code)
  where customer_code is not null;

alter table public.suppliers
  add column if not exists supplier_code text,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists suburb text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country text default 'South Africa';

update public.suppliers
set supplier_code = null
where supplier_code is not null and btrim(supplier_code) = '';

update public.suppliers s
set supplier_code = 'SUP-' || lpad(x.rn::text, 6, '0')
from (
  select id, row_number() over (order by created_at, id) as rn
  from public.suppliers
  where supplier_code is null
) x
where s.id = x.id;

create unique index if not exists suppliers_supplier_code_key
  on public.suppliers(supplier_code)
  where supplier_code is not null;

alter table public.depots
  add column if not exists depot_code text,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists suburb text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country text default 'South Africa';

update public.depots
set depot_code = null
where depot_code is not null and btrim(depot_code) = '';

update public.depots d
set depot_code = 'DEP-' || lpad(x.rn::text, 6, '0')
from (
  select id, row_number() over (order by created_at, id) as rn
  from public.depots
  where depot_code is null
) x
where d.id = x.id;

create unique index if not exists depots_depot_code_key
  on public.depots(depot_code)
  where depot_code is not null;

alter table public.profiles
  add column if not exists staff_code text,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists suburb text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country text default 'South Africa';

update public.profiles
set staff_code = null
where staff_code is not null and btrim(staff_code) = '';

update public.profiles p
set staff_code = 'STF-' || lpad(x.rn::text, 6, '0')
from (
  select id, row_number() over (order by created_at, id) as rn
  from public.profiles
  where staff_code is null
) x
where p.id = x.id;

create unique index if not exists profiles_staff_code_key
  on public.profiles(staff_code)
  where staff_code is not null;

create or replace function public.generate_entity_code(p_prefix text, p_table text, p_column text)
returns text
language plpgsql
as $$
declare
  next_num bigint;
begin
  execute format(
    'select coalesce(max(nullif(regexp_replace(%I, ''\D'', '''', ''g''), '''')::bigint), 0) + 1 from %s',
    p_column,
    p_table
  )
  into next_num;

  return p_prefix || '-' || lpad(next_num::text, 6, '0');
end;
$$;

create or replace function public.set_customer_code()
returns trigger
language plpgsql
as $$
begin
  if new.customer_code is null or btrim(new.customer_code) = '' then
    new.customer_code := public.generate_entity_code('CUST', 'public.customers', 'customer_code');
  end if;
  return new;
end;
$$;

create or replace function public.set_supplier_code()
returns trigger
language plpgsql
as $$
begin
  if new.supplier_code is null or btrim(new.supplier_code) = '' then
    new.supplier_code := public.generate_entity_code('SUP', 'public.suppliers', 'supplier_code');
  end if;
  return new;
end;
$$;

create or replace function public.set_depot_code()
returns trigger
language plpgsql
as $$
begin
  if new.depot_code is null or btrim(new.depot_code) = '' then
    new.depot_code := public.generate_entity_code('DEP', 'public.depots', 'depot_code');
  end if;
  return new;
end;
$$;

create or replace function public.set_staff_code()
returns trigger
language plpgsql
as $$
begin
  if new.staff_code is null or btrim(new.staff_code) = '' then
    new.staff_code := public.generate_entity_code('STF', 'public.profiles', 'staff_code');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_customer_code on public.customers;
create trigger trg_set_customer_code
before insert on public.customers
for each row
execute function public.set_customer_code();

drop trigger if exists trg_set_supplier_code on public.suppliers;
create trigger trg_set_supplier_code
before insert on public.suppliers
for each row
execute function public.set_supplier_code();

drop trigger if exists trg_set_depot_code on public.depots;
create trigger trg_set_depot_code
before insert on public.depots
for each row
execute function public.set_depot_code();

drop trigger if exists trg_set_staff_code on public.profiles;
create trigger trg_set_staff_code
before insert on public.profiles
for each row
execute function public.set_staff_code();

commit;
