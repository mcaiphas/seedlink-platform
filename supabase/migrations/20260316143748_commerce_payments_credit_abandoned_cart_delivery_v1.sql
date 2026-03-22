create extension if not exists pgcrypto;

-- =========================================================
-- HELPER
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- 1) CUSTOMER CREDIT ACCOUNTS
-- one account per customer
-- =========================================================
create table if not exists public.customer_credit_accounts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  account_number text unique,
  credit_limit numeric(14,2) not null default 0,
  credit_used numeric(14,2) not null default 0,
  credit_available numeric(14,2) not null default 0,
  payment_terms_days integer not null default 30,
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'closed')),
  notes text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(customer_id)
);

create index if not exists idx_customer_credit_accounts_customer_id
  on public.customer_credit_accounts(customer_id);

create index if not exists idx_customer_credit_accounts_status
  on public.customer_credit_accounts(account_status);

drop trigger if exists trg_customer_credit_accounts_updated_at on public.customer_credit_accounts;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_customer_credit_accounts_updated_at
before') then create trigger trg_customer_credit_accounts_updated_at
before update on public.customer_credit_accounts
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 2) CUSTOMER ACCOUNT LEDGER
-- tracks credit usage and repayments
-- =========================================================
create table if not exists public.customer_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  credit_account_id uuid not null references public.customer_credit_accounts(id) on delete cascade,
  transaction_type text not null
    check (transaction_type in (
      'invoice_charge',
      'payment_receipt',
      'credit_limit_adjustment',
      'credit_note',
      'manual_adjustment'
    )),
  reference_type text,
  reference_id uuid,
  amount numeric(14,2) not null,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_customer_credit_ledger_account_id
  on public.customer_credit_ledger(credit_account_id);

create index if not exists idx_customer_credit_ledger_reference
  on public.customer_credit_ledger(reference_type, reference_id);

-- =========================================================
-- 3) PAYMENTS
-- for online, EFT, cash, credit-account settlement, etc.
-- =========================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_number text not null unique,
  customer_id uuid,
  order_id uuid references public.orders(id) on delete set null,
  customer_invoice_id uuid references public.customer_invoices(id) on delete set null,
  payment_method text not null
    check (payment_method in (
      'card',
      'eft',
      'cash',
      'credit_account',
      'wallet',
      'other'
    )),
  payment_provider text,
  provider_transaction_id text,
  payment_reference text,
  amount numeric(14,2) not null,
  currency_code text not null default 'ZAR',
  payment_status text not null default 'pending'
    check (payment_status in (
      'pending',
      'authorized',
      'paid',
      'failed',
      'cancelled',
      'refunded',
      'partially_refunded'
    )),
  paid_at timestamptz,
  notes text,
  metadata jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_order_id
  on public.payments(order_id);

create index if not exists idx_payments_customer_invoice_id
  on public.payments(customer_invoice_id);

create index if not exists idx_payments_status
  on public.payments(payment_status);

create index if not exists idx_payments_provider_txn
  on public.payments(provider_transaction_id);

drop trigger if exists trg_payments_updated_at on public.payments;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_payments_updated_at
before') then create trigger trg_payments_updated_at
before update on public.payments
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 4) PAYMENT ALLOCATIONS
-- allows one payment to settle one or more invoices
-- =========================================================
create table if not exists public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  customer_invoice_id uuid not null references public.customer_invoices(id) on delete cascade,
  allocated_amount numeric(14,2) not null,
  created_at timestamptz not null default now(),
  unique(payment_id, customer_invoice_id)
);

create index if not exists idx_payment_allocations_payment_id
  on public.payment_allocations(payment_id);

create index if not exists idx_payment_allocations_invoice_id
  on public.payment_allocations(customer_invoice_id);

-- =========================================================
-- 5) CARTS ENRICHMENT
-- assumes carts table already exists
-- adds lifecycle fields for online flow
-- =========================================================
alter table public.carts
  add column if not exists cart_status text default 'active'
    check (cart_status in ('active', 'abandoned', 'converted', 'cancelled')),
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists last_activity_at timestamptz default now(),
  add column if not exists abandoned_at timestamptz,
  add column if not exists converted_order_id uuid,
  add column if not exists recovered_by uuid references auth.users(id) on delete set null,
  add column if not exists recovery_notes text,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'carts_converted_order_id_fkey'
  ) then
    alter table public.carts
      add constraint carts_converted_order_id_fkey
      foreign key (converted_order_id)
      references public.orders(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_carts_status
  on public.carts(cart_status);

create index if not exists idx_carts_abandoned_at
  on public.carts(abandoned_at);

drop trigger if exists trg_carts_updated_at on public.carts;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_carts_updated_at
before') then create trigger trg_carts_updated_at
before update on public.carts
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 6) ABANDONED CART FOLLOW-UP LOG
-- =========================================================
create table if not exists public.abandoned_cart_followups (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  followup_channel text not null
    check (followup_channel in ('email', 'sms', 'whatsapp', 'phone_call', 'manual')),
  followup_status text not null default 'pending'
    check (followup_status in ('pending', 'sent', 'completed', 'failed')),
  contact_target text,
  notes text,
  performed_by uuid references auth.users(id) on delete set null,
  performed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_abandoned_cart_followups_cart_id
  on public.abandoned_cart_followups(cart_id);

-- =========================================================
-- 7) DOCUMENT DELIVERY LOGS
-- for invoice emails, statements, quotes, etc.
-- =========================================================
create table if not exists public.document_delivery_logs (
  id uuid primary key default gen_random_uuid(),
  document_type text not null
    check (document_type in (
      'customer_invoice',
      'supplier_invoice',
      'purchase_order',
      'goods_receipt',
      'quote',
      'statement',
      'other'
    )),
  document_id uuid not null,
  recipient_email text,
  recipient_phone text,
  delivery_channel text not null
    check (delivery_channel in ('email', 'sms', 'whatsapp', 'manual', 'other')),
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  subject text,
  provider_message_id text,
  sent_at timestamptz,
  delivered_at timestamptz,
  error_message text,
  metadata jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_document_delivery_logs_doc
  on public.document_delivery_logs(document_type, document_id);

create index if not exists idx_document_delivery_logs_status
  on public.document_delivery_logs(delivery_status);

-- =========================================================
-- 8) ORDER WORKFLOW ENRICHMENT
-- assumes orders table already exists
-- =========================================================
alter table public.orders
  add column if not exists order_source text default 'manual'
    check (order_source in ('online_store', 'customer_service', 'abandoned_cart_recovery', 'marketplace', 'manual')),
  add column if not exists approval_status text default 'not_required'
    check (approval_status in ('not_required', 'pending', 'approved', 'rejected')),
  add column if not exists payment_status text default 'pending'
    check (payment_status in ('pending', 'authorized', 'paid', 'partially_paid', 'failed', 'cancelled')),
  add column if not exists fulfillment_status text default 'draft'
    check (fulfillment_status in ('draft', 'reserved', 'ready', 'fulfilled', 'partially_fulfilled', 'cancelled')),
  add column if not exists cart_id uuid,
  add column if not exists approved_by uuid references auth.users(id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists invoice_generated boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_cart_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_cart_id_fkey
      foreign key (cart_id)
      references public.carts(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_orders_order_source
  on public.orders(order_source);

create index if not exists idx_orders_payment_status
  on public.orders(payment_status);

create index if not exists idx_orders_approval_status
  on public.orders(approval_status);

drop trigger if exists trg_orders_updated_at on public.orders;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_orders_updated_at
before') then create trigger trg_orders_updated_at
before update on public.orders
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 9) HELPER FUNCTION: RECALCULATE CREDIT AVAILABLE
-- =========================================================
create or replace function public.recalculate_credit_available(p_credit_account_id uuid)
returns void
language plpgsql
as $$
begin
  update public.customer_credit_accounts
  set credit_available = greatest(credit_limit - credit_used, 0),
      updated_at = now()
  where id = p_credit_account_id;
end;
$$;

-- =========================================================
-- 10) AUTO-UPDATE CREDIT USED FROM LEDGER
-- =========================================================
create or replace function public.apply_credit_ledger_effect()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.transaction_type = 'invoice_charge' then
      update public.customer_credit_accounts
      set credit_used = credit_used + new.amount
      where id = new.credit_account_id;

    elsif new.transaction_type in ('payment_receipt', 'credit_note') then
      update public.customer_credit_accounts
      set credit_used = greatest(credit_used - new.amount, 0)
      where id = new.credit_account_id;
    end if;

    perform public.recalculate_credit_available(new.credit_account_id);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_apply_credit_ledger_effect on public.customer_credit_ledger;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_apply_credit_ledger_effect
after') then create trigger trg_apply_credit_ledger_effect
after insert on public.customer_credit_ledger
for each row
 execute function public.apply_credit_ledger_effect(); end if; end 8999;
