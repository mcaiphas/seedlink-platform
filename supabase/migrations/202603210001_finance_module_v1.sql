begin;

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create or replace function public.current_company_id()
returns uuid
language sql
stable
as $fn$
  select coalesce(
    nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'company_id'), '')::uuid,
    nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'), '')::uuid
  );
$fn$;

create or replace function public.jwt_has_role(role_name text)
returns boolean
language sql
stable
as $fn$
  select
    coalesce(
      (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' -> 'roles') ? role_name,
      false
    )
    or coalesce(
      current_setting('request.jwt.claims', true)::jsonb ->> 'role' = role_name,
      false
    );
$fn$;

create or replace function public.finance_can_write()
returns boolean
language sql
stable
as $fn$
  select
    public.jwt_has_role('superuser')
    or public.jwt_has_role('admin')
    or public.jwt_has_role('finance_admin')
    or public.jwt_has_role('finance_manager');
$fn$;

create or replace function public.finance_can_read()
returns boolean
language sql
stable
as $fn$
  select auth.uid() is not null;
$fn$;

create table if not exists public.credit_control (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid not null,
  customer_name text,
  credit_limit numeric(15,2) not null default 0,
  credit_used numeric(15,2) not null default 0,
  available_credit numeric(15,2) generated always as (credit_limit - credit_used) stored,
  status text not null default 'active' check (status in ('active', 'on_hold', 'suspended', 'closed')),
  risk_rating text default 'medium' check (risk_rating in ('low', 'medium', 'high', 'critical')),
  hold_orders boolean not null default false,
  notes text,
  last_reviewed_at timestamptz,
  reviewed_by uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, customer_id)
);

create index if not exists idx_credit_control_tenant on public.credit_control(tenant_id);
create index if not exists idx_credit_control_customer on public.credit_control(customer_id);
create index if not exists idx_credit_control_status on public.credit_control(status);
create index if not exists idx_credit_control_risk_rating on public.credit_control(risk_rating);
create index if not exists idx_credit_control_hold_orders on public.credit_control(hold_orders);
create index if not exists idx_credit_control_customer_name_trgm on public.credit_control using gin (customer_name gin_trgm_ops);

drop trigger if exists trg_credit_control_set_updated_at on public.credit_control;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_credit_control_set_updated_at
before') then create trigger trg_credit_control_set_updated_at
before update on public.credit_control
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.credit_control enable row level security;

drop policy if exists credit_control_select_policy on public.credit_control;
create policy credit_control_select_policy on public.credit_control
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists credit_control_insert_policy on public.credit_control;
create policy credit_control_insert_policy on public.credit_control
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists credit_control_update_policy on public.credit_control;
create policy credit_control_update_policy on public.credit_control
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists credit_control_delete_policy on public.credit_control;
create policy credit_control_delete_policy on public.credit_control
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.customer_aging (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid not null,
  customer_name text,
  invoice_id uuid,
  invoice_number text,
  invoice_date date not null,
  due_date date not null,
  days_overdue integer not null default 0,
  aging_bucket text not null default '0-30' check (aging_bucket in ('current', '0-30', '31-60', '61-90', '90+')),
  amount_due numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  status text not null default 'open' check (status in ('open', 'partial', 'paid', 'disputed', 'written_off')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customer_aging_tenant on public.customer_aging(tenant_id);
create index if not exists idx_customer_aging_customer on public.customer_aging(customer_id);
create index if not exists idx_customer_aging_status on public.customer_aging(status);
create index if not exists idx_customer_aging_bucket on public.customer_aging(aging_bucket);
create index if not exists idx_customer_aging_due_date on public.customer_aging(due_date);
create index if not exists idx_customer_aging_invoice_date on public.customer_aging(invoice_date);
create index if not exists idx_customer_aging_customer_name_trgm on public.customer_aging using gin (customer_name gin_trgm_ops);
create index if not exists idx_customer_aging_invoice_number_trgm on public.customer_aging using gin (invoice_number gin_trgm_ops);

drop trigger if exists trg_customer_aging_set_updated_at on public.customer_aging;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_customer_aging_set_updated_at
before') then create trigger trg_customer_aging_set_updated_at
before update on public.customer_aging
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.customer_aging enable row level security;

drop policy if exists customer_aging_select_policy on public.customer_aging;
create policy customer_aging_select_policy on public.customer_aging
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists customer_aging_insert_policy on public.customer_aging;
create policy customer_aging_insert_policy on public.customer_aging
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists customer_aging_update_policy on public.customer_aging;
create policy customer_aging_update_policy on public.customer_aging
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists customer_aging_delete_policy on public.customer_aging;
create policy customer_aging_delete_policy on public.customer_aging
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.supplier_aging (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null,
  supplier_name text,
  invoice_id uuid,
  invoice_number text,
  invoice_date date not null,
  due_date date not null,
  days_overdue integer not null default 0,
  aging_bucket text not null default '0-30' check (aging_bucket in ('current', '0-30', '31-60', '61-90', '90+')),
  amount_due numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  status text not null default 'open' check (status in ('open', 'partial', 'paid', 'disputed', 'written_off')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_supplier_aging_tenant on public.supplier_aging(tenant_id);
create index if not exists idx_supplier_aging_supplier on public.supplier_aging(supplier_id);
create index if not exists idx_supplier_aging_status on public.supplier_aging(status);
create index if not exists idx_supplier_aging_bucket on public.supplier_aging(aging_bucket);
create index if not exists idx_supplier_aging_due_date on public.supplier_aging(due_date);
create index if not exists idx_supplier_aging_invoice_date on public.supplier_aging(invoice_date);
create index if not exists idx_supplier_aging_supplier_name_trgm on public.supplier_aging using gin (supplier_name gin_trgm_ops);
create index if not exists idx_supplier_aging_invoice_number_trgm on public.supplier_aging using gin (invoice_number gin_trgm_ops);

drop trigger if exists trg_supplier_aging_set_updated_at on public.supplier_aging;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_supplier_aging_set_updated_at
before') then create trigger trg_supplier_aging_set_updated_at
before update on public.supplier_aging
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.supplier_aging enable row level security;

drop policy if exists supplier_aging_select_policy on public.supplier_aging;
create policy supplier_aging_select_policy on public.supplier_aging
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists supplier_aging_insert_policy on public.supplier_aging;
create policy supplier_aging_insert_policy on public.supplier_aging
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_aging_update_policy on public.supplier_aging;
create policy supplier_aging_update_policy on public.supplier_aging
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_aging_delete_policy on public.supplier_aging;
create policy supplier_aging_delete_policy on public.supplier_aging
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.customer_credit_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid not null,
  customer_name text,
  credit_note_number text,
  reference text,
  source_invoice_id uuid,
  reason text,
  amount numeric(15,2) not null default 0,
  tax_amount numeric(15,2) not null default 0,
  total_amount numeric(15,2) generated always as (amount + tax_amount) stored,
  currency_code text not null default 'ZAR',
  status text not null default 'draft' check (status in ('draft', 'approved', 'issued', 'applied', 'cancelled')),
  issued_at timestamptz,
  approved_at timestamptz,
  approved_by uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $fn$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customer_credit_notes' and column_name = 'tenant_id'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customer_credit_notes' and column_name = 'credit_note_number'
  ) then
    create unique index if not exists uq_customer_credit_notes_number
      on public.customer_credit_notes(tenant_id, credit_note_number)
      where credit_note_number is not null;
  end if;
end
$fn$;


alter table public.customer_credit_notes
  add column if not exists tenant_id uuid,
  add column if not exists customer_name text,
  add column if not exists credit_note_number text,
  add column if not exists reference text,
  add column if not exists source_invoice_id uuid,
  add column if not exists reason text,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists updated_at timestamptz not null default now();

do $fn$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'supplier_credit_notes'
  ) then
    alter table public.supplier_credit_notes
      add column if not exists tenant_id uuid,
      add column if not exists supplier_name text,
      add column if not exists credit_note_number text,
      add column if not exists reference text,
      add column if not exists source_invoice_id uuid,
      add column if not exists reason text,
      add column if not exists tax_amount numeric(15,2) not null default 0,
      add column if not exists currency_code text not null default 'ZAR',
      add column if not exists approved_at timestamptz,
      add column if not exists approved_by uuid,
      add column if not exists created_by uuid,
      add column if not exists updated_by uuid,
      add column if not exists updated_at timestamptz not null default now();
  end if;
end
$fn$;

do $fn$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'refunds'
  ) then
    alter table public.refunds
      add column if not exists tenant_id uuid,
      add column if not exists customer_name text,
      add column if not exists order_id uuid,
      add column if not exists payment_id uuid,
      add column if not exists refund_number text,
      add column if not exists reference text,
      add column if not exists currency_code text not null default 'ZAR',
      add column if not exists refund_method text,
      add column if not exists approved_by uuid,
      add column if not exists processed_by uuid,
      add column if not exists created_by uuid,
      add column if not exists updated_by uuid,
      add column if not exists updated_at timestamptz not null default now();
  end if;
end
$fn$;

do $fn$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'supplier_payments'
  ) then
    alter table public.supplier_payments
      add column if not exists tenant_id uuid,
      add column if not exists supplier_name text,
      add column if not exists payment_number text,
      add column if not exists bill_id uuid,
      add column if not exists currency_code text not null default 'ZAR',
      add column if not exists payment_method text,
      add column if not exists reference text,
      add column if not exists status text not null default 'pending',
      add column if not exists payment_date date not null default current_date,
      add column if not exists bank_account_id uuid,
      add column if not exists created_by uuid,
      add column if not exists updated_by uuid,
      add column if not exists updated_at timestamptz not null default now();
  end if;
end
$fn$;

create index if not exists idx_customer_credit_notes_tenant on public.customer_credit_notes(tenant_id);
create index if not exists idx_customer_credit_notes_customer on public.customer_credit_notes(customer_id);
create index if not exists idx_customer_credit_notes_status on public.customer_credit_notes(status);
create index if not exists idx_customer_credit_notes_created_at on public.customer_credit_notes(created_at desc);
create index if not exists idx_customer_credit_notes_customer_name_trgm on public.customer_credit_notes using gin (customer_name gin_trgm_ops);
create index if not exists idx_customer_credit_notes_reference_trgm on public.customer_credit_notes using gin (reference gin_trgm_ops);

drop trigger if exists trg_customer_credit_notes_set_updated_at on public.customer_credit_notes;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_customer_credit_notes_set_updated_at
before') then create trigger trg_customer_credit_notes_set_updated_at
before update on public.customer_credit_notes
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.customer_credit_notes enable row level security;

drop policy if exists customer_credit_notes_select_policy on public.customer_credit_notes;
create policy customer_credit_notes_select_policy on public.customer_credit_notes
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists customer_credit_notes_insert_policy on public.customer_credit_notes;
create policy customer_credit_notes_insert_policy on public.customer_credit_notes
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists customer_credit_notes_update_policy on public.customer_credit_notes;
create policy customer_credit_notes_update_policy on public.customer_credit_notes
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists customer_credit_notes_delete_policy on public.customer_credit_notes;
create policy customer_credit_notes_delete_policy on public.customer_credit_notes
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.supplier_credit_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null,
  supplier_name text,
  credit_note_number text,
  reference text,
  source_invoice_id uuid,
  reason text,
  amount numeric(15,2) not null default 0,
  tax_amount numeric(15,2) not null default 0,
  total_amount numeric(15,2) generated always as (amount + tax_amount) stored,
  currency_code text not null default 'ZAR',
  status text not null default 'draft' check (status in ('draft', 'approved', 'issued', 'applied', 'cancelled')),
  issued_at timestamptz,
  approved_at timestamptz,
  approved_by uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $fn$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'supplier_credit_notes' and column_name = 'tenant_id'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'supplier_credit_notes' and column_name = 'credit_note_number'
  ) then
    create unique index if not exists uq_supplier_credit_notes_number
      on public.supplier_credit_notes(tenant_id, credit_note_number)
      where credit_note_number is not null;
  end if;
end
$fn$;

create index if not exists idx_supplier_credit_notes_tenant on public.supplier_credit_notes(tenant_id);
create index if not exists idx_supplier_credit_notes_supplier on public.supplier_credit_notes(supplier_id);
create index if not exists idx_supplier_credit_notes_status on public.supplier_credit_notes(status);
create index if not exists idx_supplier_credit_notes_created_at on public.supplier_credit_notes(created_at desc);
create index if not exists idx_supplier_credit_notes_supplier_name_trgm on public.supplier_credit_notes using gin (supplier_name gin_trgm_ops);
create index if not exists idx_supplier_credit_notes_reference_trgm on public.supplier_credit_notes using gin (reference gin_trgm_ops);

drop trigger if exists trg_supplier_credit_notes_set_updated_at on public.supplier_credit_notes;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_supplier_credit_notes_set_updated_at
before') then create trigger trg_supplier_credit_notes_set_updated_at
before update on public.supplier_credit_notes
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.supplier_credit_notes enable row level security;

drop policy if exists supplier_credit_notes_select_policy on public.supplier_credit_notes;
create policy supplier_credit_notes_select_policy on public.supplier_credit_notes
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists supplier_credit_notes_insert_policy on public.supplier_credit_notes;
create policy supplier_credit_notes_insert_policy on public.supplier_credit_notes
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_credit_notes_update_policy on public.supplier_credit_notes;
create policy supplier_credit_notes_update_policy on public.supplier_credit_notes
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_credit_notes_delete_policy on public.supplier_credit_notes;
create policy supplier_credit_notes_delete_policy on public.supplier_credit_notes
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid,
  customer_name text,
  order_id uuid,
  payment_id uuid,
  refund_number text,
  reference text,
  amount numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  reason text,
  refund_method text check (refund_method in ('cash', 'eft', 'card', 'wallet', 'store_credit')),
  refund_date date,
  status text not null default 'pending' check (status in ('pending', 'approved', 'processed', 'failed', 'cancelled')),
  approved_by uuid,
  processed_by uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $fn$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'refunds' and column_name = 'tenant_id'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'refunds' and column_name = 'refund_number'
  ) then
    create unique index if not exists uq_refunds_number
      on public.refunds(tenant_id, refund_number)
      where refund_number is not null;
  end if;
end
$fn$;

create index if not exists idx_refunds_tenant on public.refunds(tenant_id);
create index if not exists idx_refunds_customer on public.refunds(customer_id);
create index if not exists idx_refunds_status on public.refunds(status);
create index if not exists idx_refunds_refund_date on public.refunds(refund_date);
create index if not exists idx_refunds_customer_name_trgm on public.refunds using gin (customer_name gin_trgm_ops);
create index if not exists idx_refunds_reference_trgm on public.refunds using gin (reference gin_trgm_ops);

drop trigger if exists trg_refunds_set_updated_at on public.refunds;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_refunds_set_updated_at
before') then create trigger trg_refunds_set_updated_at
before update on public.refunds
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.refunds enable row level security;

drop policy if exists refunds_select_policy on public.refunds;
create policy refunds_select_policy on public.refunds
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists refunds_insert_policy on public.refunds;
create policy refunds_insert_policy on public.refunds
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists refunds_update_policy on public.refunds;
create policy refunds_update_policy on public.refunds
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists refunds_delete_policy on public.refunds;
create policy refunds_delete_policy on public.refunds
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.supplier_payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null,
  supplier_name text,
  payment_number text,
  bill_id uuid,
  amount numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  payment_method text check (payment_method in ('cash', 'eft', 'card', 'cheque', 'wallet')),
  payment_date date not null,
  bank_account_id uuid,
  reference text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'failed', 'cancelled')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $fn$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'supplier_payments' and column_name = 'tenant_id'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'supplier_payments' and column_name = 'payment_number'
  ) then
    create unique index if not exists uq_supplier_payments_number
      on public.supplier_payments(tenant_id, payment_number)
      where payment_number is not null;
  end if;
end
$fn$;

create index if not exists idx_supplier_payments_tenant on public.supplier_payments(tenant_id);
create index if not exists idx_supplier_payments_supplier on public.supplier_payments(supplier_id);
create index if not exists idx_supplier_payments_status on public.supplier_payments(status);
create index if not exists idx_supplier_payments_payment_date on public.supplier_payments(payment_date desc);
create index if not exists idx_supplier_payments_supplier_name_trgm on public.supplier_payments using gin (supplier_name gin_trgm_ops);
create index if not exists idx_supplier_payments_reference_trgm on public.supplier_payments using gin (reference gin_trgm_ops);

drop trigger if exists trg_supplier_payments_set_updated_at on public.supplier_payments;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_supplier_payments_set_updated_at
before') then create trigger trg_supplier_payments_set_updated_at
before update on public.supplier_payments
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.supplier_payments enable row level security;

drop policy if exists supplier_payments_select_policy on public.supplier_payments;
create policy supplier_payments_select_policy on public.supplier_payments
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists supplier_payments_insert_policy on public.supplier_payments;
create policy supplier_payments_insert_policy on public.supplier_payments
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_payments_update_policy on public.supplier_payments;
create policy supplier_payments_update_policy on public.supplier_payments
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_payments_delete_policy on public.supplier_payments;
create policy supplier_payments_delete_policy on public.supplier_payments
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.customer_statements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_id uuid not null,
  customer_name text,
  statement_date date not null,
  opening_balance numeric(15,2) not null default 0,
  total_debits numeric(15,2) not null default 0,
  total_credits numeric(15,2) not null default 0,
  closing_balance numeric(15,2) not null default 0,
  transactions_count integer not null default 0,
  status text not null default 'generated' check (status in ('generated', 'sent', 'reviewed', 'archived')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, customer_id, statement_date)
);

create index if not exists idx_customer_statements_tenant on public.customer_statements(tenant_id);
create index if not exists idx_customer_statements_customer on public.customer_statements(customer_id);
create index if not exists idx_customer_statements_status on public.customer_statements(status);
create index if not exists idx_customer_statements_statement_date on public.customer_statements(statement_date desc);
create index if not exists idx_customer_statements_customer_name_trgm on public.customer_statements using gin (customer_name gin_trgm_ops);

drop trigger if exists trg_customer_statements_set_updated_at on public.customer_statements;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_customer_statements_set_updated_at
before') then create trigger trg_customer_statements_set_updated_at
before update on public.customer_statements
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.customer_statements enable row level security;

drop policy if exists customer_statements_select_policy on public.customer_statements;
create policy customer_statements_select_policy on public.customer_statements
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists customer_statements_insert_policy on public.customer_statements;
create policy customer_statements_insert_policy on public.customer_statements
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists customer_statements_update_policy on public.customer_statements;
create policy customer_statements_update_policy on public.customer_statements
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists customer_statements_delete_policy on public.customer_statements;
create policy customer_statements_delete_policy on public.customer_statements
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.supplier_statements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null,
  supplier_name text,
  statement_date date not null,
  opening_balance numeric(15,2) not null default 0,
  total_debits numeric(15,2) not null default 0,
  total_credits numeric(15,2) not null default 0,
  closing_balance numeric(15,2) not null default 0,
  transactions_count integer not null default 0,
  status text not null default 'generated' check (status in ('generated', 'sent', 'reviewed', 'archived')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, supplier_id, statement_date)
);

create index if not exists idx_supplier_statements_tenant on public.supplier_statements(tenant_id);
create index if not exists idx_supplier_statements_supplier on public.supplier_statements(supplier_id);
create index if not exists idx_supplier_statements_status on public.supplier_statements(status);
create index if not exists idx_supplier_statements_statement_date on public.supplier_statements(statement_date desc);
create index if not exists idx_supplier_statements_supplier_name_trgm on public.supplier_statements using gin (supplier_name gin_trgm_ops);

drop trigger if exists trg_supplier_statements_set_updated_at on public.supplier_statements;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_supplier_statements_set_updated_at
before') then create trigger trg_supplier_statements_set_updated_at
before update on public.supplier_statements
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.supplier_statements enable row level security;

drop policy if exists supplier_statements_select_policy on public.supplier_statements;
create policy supplier_statements_select_policy on public.supplier_statements
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists supplier_statements_insert_policy on public.supplier_statements;
create policy supplier_statements_insert_policy on public.supplier_statements
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_statements_update_policy on public.supplier_statements;
create policy supplier_statements_update_policy on public.supplier_statements
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists supplier_statements_delete_policy on public.supplier_statements;
create policy supplier_statements_delete_policy on public.supplier_statements
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.communication_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  related_entity_type text,
  related_entity_id uuid,
  contact_type text not null check (contact_type in ('email', 'sms', 'call', 'whatsapp')),
  recipient text not null,
  subject text,
  message text,
  template_id uuid,
  status text not null default 'queued' check (status in ('queued', 'sent', 'delivered', 'failed', 'cancelled')),
  external_provider text,
  external_message_id text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_communication_logs_tenant on public.communication_logs(tenant_id);
create index if not exists idx_communication_logs_contact_type on public.communication_logs(contact_type);
create index if not exists idx_communication_logs_status on public.communication_logs(status);
create index if not exists idx_communication_logs_created_at on public.communication_logs(created_at desc);
create index if not exists idx_communication_logs_recipient_trgm on public.communication_logs using gin (recipient gin_trgm_ops);
create index if not exists idx_communication_logs_subject_trgm on public.communication_logs using gin (subject gin_trgm_ops);

drop trigger if exists trg_communication_logs_set_updated_at on public.communication_logs;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_communication_logs_set_updated_at
before') then create trigger trg_communication_logs_set_updated_at
before update on public.communication_logs
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.communication_logs enable row level security;

drop policy if exists communication_logs_select_policy on public.communication_logs;
create policy communication_logs_select_policy on public.communication_logs
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists communication_logs_insert_policy on public.communication_logs;
create policy communication_logs_insert_policy on public.communication_logs
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists communication_logs_update_policy on public.communication_logs;
create policy communication_logs_update_policy on public.communication_logs
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists communication_logs_delete_policy on public.communication_logs;
create policy communication_logs_delete_policy on public.communication_logs
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  name text not null,
  type text not null check (type in ('email', 'sms', 'whatsapp')),
  subject text,
  body text not null,
  variables_json jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive', 'draft')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);

alter table public.notification_templates
  add column if not exists tenant_id uuid,
  add column if not exists code text,
  add column if not exists name text,
  add column if not exists type text,
  add column if not exists subject text,
  add column if not exists body text not null default '',
  add column if not exists variables_json jsonb not null default '[]'::jsonb,
  add column if not exists status text not null default 'active',
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_notification_templates_tenant on public.notification_templates(tenant_id);
create index if not exists idx_notification_templates_type on public.notification_templates(type);
create index if not exists idx_notification_templates_status on public.notification_templates(status);
create index if not exists idx_notification_templates_name_trgm on public.notification_templates using gin (name gin_trgm_ops);
create index if not exists idx_notification_templates_code_trgm on public.notification_templates using gin (code gin_trgm_ops);

drop trigger if exists trg_notification_templates_set_updated_at on public.notification_templates;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_notification_templates_set_updated_at
before') then create trigger trg_notification_templates_set_updated_at
before update on public.notification_templates
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.notification_templates enable row level security;

drop policy if exists notification_templates_select_policy on public.notification_templates;
create policy notification_templates_select_policy on public.notification_templates
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists notification_templates_insert_policy on public.notification_templates;
create policy notification_templates_insert_policy on public.notification_templates
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists notification_templates_update_policy on public.notification_templates;
create policy notification_templates_update_policy on public.notification_templates
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists notification_templates_delete_policy on public.notification_templates;
create policy notification_templates_delete_policy on public.notification_templates
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.operations_finance (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  operation_type text not null check (operation_type in ('warehouse','transport','fuel','labour','maintenance','utilities','rent','other')),
  amount numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  description text,
  depot_id uuid,
  reference text,
  status text not null default 'posted' check (status in ('draft', 'approved', 'posted', 'cancelled')),
  transaction_date date not null default current_date,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_operations_finance_tenant on public.operations_finance(tenant_id);
create index if not exists idx_operations_finance_operation_type on public.operations_finance(operation_type);
create index if not exists idx_operations_finance_status on public.operations_finance(status);
create index if not exists idx_operations_finance_transaction_date on public.operations_finance(transaction_date desc);
create index if not exists idx_operations_finance_reference_trgm on public.operations_finance using gin (reference gin_trgm_ops);
create index if not exists idx_operations_finance_description_trgm on public.operations_finance using gin (description gin_trgm_ops);

drop trigger if exists trg_operations_finance_set_updated_at on public.operations_finance;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_operations_finance_set_updated_at
before') then create trigger trg_operations_finance_set_updated_at
before update on public.operations_finance
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.operations_finance enable row level security;

drop policy if exists operations_finance_select_policy on public.operations_finance;
create policy operations_finance_select_policy on public.operations_finance
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists operations_finance_insert_policy on public.operations_finance;
create policy operations_finance_insert_policy on public.operations_finance
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists operations_finance_update_policy on public.operations_finance;
create policy operations_finance_update_policy on public.operations_finance
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists operations_finance_delete_policy on public.operations_finance;
create policy operations_finance_delete_policy on public.operations_finance
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.inventory_valuation (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  product_id uuid not null,
  product_name text,
  sku text,
  depot_id uuid,
  quantity numeric(15,3) not null default 0,
  unit_cost numeric(15,2) not null default 0,
  total_value numeric(15,2) generated always as (quantity * unit_cost) stored,
  valuation_method text not null default 'weighted_average' check (valuation_method in ('fifo', 'lifo', 'weighted_average', 'standard')),
  valuation_date date not null,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_valuation_tenant on public.inventory_valuation(tenant_id);
create index if not exists idx_inventory_valuation_product on public.inventory_valuation(product_id);
create index if not exists idx_inventory_valuation_depot on public.inventory_valuation(depot_id);
create index if not exists idx_inventory_valuation_date on public.inventory_valuation(valuation_date desc);
create index if not exists idx_inventory_valuation_product_name_trgm on public.inventory_valuation using gin (product_name gin_trgm_ops);
create index if not exists idx_inventory_valuation_sku_trgm on public.inventory_valuation using gin (sku gin_trgm_ops);

drop trigger if exists trg_inventory_valuation_set_updated_at on public.inventory_valuation;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_inventory_valuation_set_updated_at
before') then create trigger trg_inventory_valuation_set_updated_at
before update on public.inventory_valuation
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.inventory_valuation enable row level security;

drop policy if exists inventory_valuation_select_policy on public.inventory_valuation;
create policy inventory_valuation_select_policy on public.inventory_valuation
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists inventory_valuation_insert_policy on public.inventory_valuation;
create policy inventory_valuation_insert_policy on public.inventory_valuation
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists inventory_valuation_update_policy on public.inventory_valuation;
create policy inventory_valuation_update_policy on public.inventory_valuation
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists inventory_valuation_delete_policy on public.inventory_valuation;
create policy inventory_valuation_delete_policy on public.inventory_valuation
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

create table if not exists public.commerce_accounting (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  transaction_type text not null check (transaction_type in ('sale','payment','refund','credit_note','debit_note','adjustment','write_off','inventory_adjustment','expense')),
  source_type text,
  source_id uuid,
  amount numeric(15,2) not null default 0,
  currency_code text not null default 'ZAR',
  reference text,
  account_code text,
  account_name text,
  posting_date date not null default current_date,
  status text not null default 'posted' check (status in ('draft', 'posted', 'reversed', 'cancelled')),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_commerce_accounting_tenant on public.commerce_accounting(tenant_id);
create index if not exists idx_commerce_accounting_transaction_type on public.commerce_accounting(transaction_type);
create index if not exists idx_commerce_accounting_status on public.commerce_accounting(status);
create index if not exists idx_commerce_accounting_posting_date on public.commerce_accounting(posting_date desc);
create index if not exists idx_commerce_accounting_reference_trgm on public.commerce_accounting using gin (reference gin_trgm_ops);
create index if not exists idx_commerce_accounting_account_code on public.commerce_accounting(account_code);

drop trigger if exists trg_commerce_accounting_set_updated_at on public.commerce_accounting;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_commerce_accounting_set_updated_at
before') then create trigger trg_commerce_accounting_set_updated_at
before update on public.commerce_accounting
for each row  execute function public.set_updated_at(); end if; end
$$;

alter table public.commerce_accounting enable row level security;

drop policy if exists commerce_accounting_select_policy on public.commerce_accounting;
create policy commerce_accounting_select_policy on public.commerce_accounting
for select using (public.finance_can_read() and tenant_id = public.current_company_id());

drop policy if exists commerce_accounting_insert_policy on public.commerce_accounting;
create policy commerce_accounting_insert_policy on public.commerce_accounting
for insert with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists commerce_accounting_update_policy on public.commerce_accounting;
create policy commerce_accounting_update_policy on public.commerce_accounting
for update using (public.finance_can_write() and tenant_id = public.current_company_id())
with check (public.finance_can_write() and tenant_id = public.current_company_id());

drop policy if exists commerce_accounting_delete_policy on public.commerce_accounting;
create policy commerce_accounting_delete_policy on public.commerce_accounting
for delete using (public.finance_can_write() and tenant_id = public.current_company_id());

commit;
