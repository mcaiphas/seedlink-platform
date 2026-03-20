begin;

-- =========================================================
-- FINANCE FOUNDATION V1
-- =========================================================

-- 1) FINANCE ACCOUNTS
create table if not exists public.finance_accounts (
  id uuid primary key default gen_random_uuid(),
  account_code text not null unique,
  account_name text not null,
  account_type text not null,
  parent_account_id uuid references public.finance_accounts(id) on delete set null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint finance_accounts_type_check
    check (account_type in ('asset','liability','equity','income','expense'))
);

create index if not exists idx_finance_accounts_type
  on public.finance_accounts(account_type);

create index if not exists idx_finance_accounts_active
  on public.finance_accounts(is_active);

-- 2) JOURNAL ENTRIES
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  entry_number text not null unique,
  entry_date date not null,
  reference text,
  description text,
  status text not null default 'draft',
  total_debit numeric(18,2) not null default 0,
  total_credit numeric(18,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entries_status_check
    check (status in ('draft','posted','reversed'))
);

create index if not exists idx_journal_entries_date
  on public.journal_entries(entry_date desc);

create index if not exists idx_journal_entries_status
  on public.journal_entries(status);

-- 3) JOURNAL ENTRY LINES
create table if not exists public.journal_entry_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  finance_account_id uuid not null references public.finance_accounts(id) on delete restrict,
  line_description text,
  debit_amount numeric(18,2) not null default 0,
  credit_amount numeric(18,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entry_lines_nonnegative_check
    check (debit_amount >= 0 and credit_amount >= 0),
  constraint journal_entry_lines_one_sided_check
    check (
      (debit_amount > 0 and credit_amount = 0)
      or (credit_amount > 0 and debit_amount = 0)
      or (credit_amount = 0 and debit_amount = 0)
    )
);

create index if not exists idx_journal_entry_lines_entry
  on public.journal_entry_lines(journal_entry_id);

alter table public.journal_entry_lines add column if not exists finance_account_id uuid references public.finance_accounts(id) on delete restrict;

create index if not exists idx_journal_entry_lines_account
  on public.journal_entry_lines(finance_account_id);

-- 4) BANK STATEMENT IMPORTS
create table if not exists public.bank_statement_imports (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  import_status text not null default 'pending',
  imported_rows integer not null default 0,
  failed_rows integer not null default 0,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bank_statement_imports_status_check
    check (import_status in ('pending','processing','completed','failed'))
);

create index if not exists idx_bank_statement_imports_status
  on public.bank_statement_imports(import_status);

create index if not exists idx_bank_statement_imports_created_at
  on public.bank_statement_imports(created_at desc);

-- 5) DIAGNOSTICS VIEW
create or replace view public.finance_diagnostics_summary as
select
  (select count(*) from public.finance_accounts where is_active = true) as chart_of_accounts_count,
  (select count(*) from public.journal_entries where status = 'posted') as posted_journal_count,
  (select count(*) from public.bank_statement_imports) as bank_import_count,
  0::integer as failed_dispatch_count,
  'healthy'::text as storage_health;

-- 6) UPDATED_AT TRIGGERS
do $$
begin
  if exists (
    select 1
    from pg_proc
    where proname = 'set_updated_at'
  ) then
    if not exists (
      select 1 from pg_trigger where tgname = 'trg_finance_accounts_updated_at'
    ) then
      create trigger trg_finance_accounts_updated_at
      before update on public.finance_accounts
      for each row execute function public.set_updated_at();
    end if;

    if not exists (
      select 1 from pg_trigger where tgname = 'trg_journal_entries_updated_at'
    ) then
      create trigger trg_journal_entries_updated_at
      before update on public.journal_entries
      for each row execute function public.set_updated_at();
    end if;

    if not exists (
      select 1 from pg_trigger where tgname = 'trg_journal_entry_lines_updated_at'
    ) then
      create trigger trg_journal_entry_lines_updated_at
      before update on public.journal_entry_lines
      for each row execute function public.set_updated_at();
    end if;

    if not exists (
      select 1 from pg_trigger where tgname = 'trg_bank_statement_imports_updated_at'
    ) then
      create trigger trg_bank_statement_imports_updated_at
      before update on public.bank_statement_imports
      for each row execute function public.set_updated_at();
    end if;
  end if;
end $$;

-- 7) RLS
alter table public.finance_accounts enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_entry_lines enable row level security;
alter table public.bank_statement_imports enable row level security;

drop policy if exists finance_accounts_select_authenticated on public.finance_accounts;
create policy finance_accounts_select_authenticated
on public.finance_accounts
for select
to authenticated
using (true);

drop policy if exists journal_entries_select_authenticated on public.journal_entries;
create policy journal_entries_select_authenticated
on public.journal_entries
for select
to authenticated
using (true);

drop policy if exists journal_entry_lines_select_authenticated on public.journal_entry_lines;
create policy journal_entry_lines_select_authenticated
on public.journal_entry_lines
for select
to authenticated
using (true);

drop policy if exists bank_statement_imports_select_authenticated on public.bank_statement_imports;
create policy bank_statement_imports_select_authenticated
on public.bank_statement_imports
for select
to authenticated
using (true);

-- Prototype-friendly write policies; tighten later for production roles.
drop policy if exists finance_accounts_write_authenticated on public.finance_accounts;
create policy finance_accounts_write_authenticated
on public.finance_accounts
for all
to authenticated
using (true)
with check (true);

drop policy if exists journal_entries_write_authenticated on public.journal_entries;
create policy journal_entries_write_authenticated
on public.journal_entries
for all
to authenticated
using (true)
with check (true);

drop policy if exists journal_entry_lines_write_authenticated on public.journal_entry_lines;
create policy journal_entry_lines_write_authenticated
on public.journal_entry_lines
for all
to authenticated
using (true)
with check (true);

drop policy if exists bank_statement_imports_write_authenticated on public.bank_statement_imports;
create policy bank_statement_imports_write_authenticated
on public.bank_statement_imports
for all
to authenticated
using (true)
with check (true);

commit;
