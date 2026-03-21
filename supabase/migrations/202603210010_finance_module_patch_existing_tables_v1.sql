begin;

-- =========================================================
-- PATCH EXISTING FINANCE TABLES SO THEY MATCH THE NEW MODEL
-- =========================================================

-- -----------------------------
-- customer_credit_notes
-- -----------------------------
alter table public.customer_credit_notes
  add column if not exists tenant_id uuid,
  add column if not exists customer_name text,
  add column if not exists credit_note_number text,
  add column if not exists source_invoice_id uuid,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists updated_at timestamptz not null default now();

update public.customer_credit_notes
set tenant_id = '00000000-0000-0000-0000-000000000000'
where tenant_id is null;

alter table public.customer_credit_notes
  alter column tenant_id set not null;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'customer_credit_notes'
      and column_name = 'total_amount'
  ) then
    alter table public.customer_credit_notes
      add column total_amount numeric(15,2);
    update public.customer_credit_notes
      set total_amount = coalesce(amount,0) + coalesce(tax_amount,0);
  end if;
end $$;

create unique index if not exists uq_customer_credit_notes_number
  on public.customer_credit_notes(tenant_id, credit_note_number)
  where credit_note_number is not null;

create index if not exists idx_customer_credit_notes_tenant
  on public.customer_credit_notes(tenant_id);
create index if not exists idx_customer_credit_notes_customer
  on public.customer_credit_notes(customer_id);
create index if not exists idx_customer_credit_notes_status
  on public.customer_credit_notes(status);
create index if not exists idx_customer_credit_notes_created_at
  on public.customer_credit_notes(created_at desc);

-- -----------------------------
-- supplier_credit_notes
-- -----------------------------
alter table public.supplier_credit_notes
  add column if not exists tenant_id uuid,
  add column if not exists supplier_name text,
  add column if not exists credit_note_number text,
  add column if not exists source_invoice_id uuid,
  add column if not exists tax_amount numeric(15,2) not null default 0,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists updated_at timestamptz not null default now();

update public.supplier_credit_notes
set tenant_id = '00000000-0000-0000-0000-000000000000'
where tenant_id is null;

alter table public.supplier_credit_notes
  alter column tenant_id set not null;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'supplier_credit_notes'
      and column_name = 'total_amount'
  ) then
    alter table public.supplier_credit_notes
      add column total_amount numeric(15,2);
    update public.supplier_credit_notes
      set total_amount = coalesce(amount,0) + coalesce(tax_amount,0);
  end if;
end $$;

create unique index if not exists uq_supplier_credit_notes_number
  on public.supplier_credit_notes(tenant_id, credit_note_number)
  where credit_note_number is not null;

create index if not exists idx_supplier_credit_notes_tenant
  on public.supplier_credit_notes(tenant_id);
create index if not exists idx_supplier_credit_notes_supplier
  on public.supplier_credit_notes(supplier_id);
create index if not exists idx_supplier_credit_notes_status
  on public.supplier_credit_notes(status);
create index if not exists idx_supplier_credit_notes_created_at
  on public.supplier_credit_notes(created_at desc);

-- -----------------------------
-- refunds
-- -----------------------------
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

update public.refunds
set tenant_id = '00000000-0000-0000-0000-000000000000'
where tenant_id is null;

alter table public.refunds
  alter column tenant_id set not null;

create unique index if not exists uq_refunds_number
  on public.refunds(tenant_id, refund_number)
  where refund_number is not null;

create index if not exists idx_refunds_tenant on public.refunds(tenant_id);
create index if not exists idx_refunds_customer on public.refunds(customer_id);
create index if not exists idx_refunds_status on public.refunds(status);

-- -----------------------------
-- supplier_payments
-- -----------------------------
alter table public.supplier_payments
  add column if not exists tenant_id uuid,
  add column if not exists supplier_name text,
  add column if not exists payment_number text,
  add column if not exists bill_id uuid,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists payment_method text,
  add column if not exists bank_account_id uuid,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists updated_at timestamptz not null default now();

update public.supplier_payments
set tenant_id = '00000000-0000-0000-0000-000000000000'
where tenant_id is null;

alter table public.supplier_payments
  alter column tenant_id set not null;

create unique index if not exists uq_supplier_payments_number
  on public.supplier_payments(tenant_id, payment_number)
  where payment_number is not null;

create index if not exists idx_supplier_payments_tenant on public.supplier_payments(tenant_id);
create index if not exists idx_supplier_payments_supplier on public.supplier_payments(supplier_id);
create index if not exists idx_supplier_payments_status on public.supplier_payments(status);

commit;
