begin;

-- =========================================================
-- 1) PAYMENT STATUS CHECK CONSTRAINT
-- =========================================================
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payments_payment_status_check'
  ) then
    alter table public.payments
      add constraint payments_payment_status_check
      check (
        payment_status in (
          'draft',
          'pending',
          'requires_action',
          'authorized',
          'paid',
          'failed',
          'cancelled',
          'expired',
          'partially_refunded',
          'refunded'
        )
      );
  end if;
end
$$;

-- =========================================================
-- 2) ENHANCE PAYMENTS TABLE
-- =========================================================
alter table public.payments
  add column if not exists status_reason text,
  add column if not exists provider_payment_intent_id text,
  add column if not exists provider_checkout_session_id text,
  add column if not exists provider_customer_id text,
  add column if not exists authorization_amount numeric(18,2),
  add column if not exists captured_amount numeric(18,2),
  add column if not exists refunded_amount numeric(18,2) not null default 0,
  add column if not exists expired_at timestamptz;

-- Keep payment_type if it already exists from your prior migration
alter table public.payments
  alter column payment_type set default 'order_payment';

-- =========================================================
-- 3) PAYMENT ATTEMPTS
-- =========================================================
create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  attempt_number integer not null,
  provider text,
  payment_method text,
  provider_payment_intent_id text,
  provider_checkout_session_id text,
  provider_reference text,
  status text not null default 'pending',
  amount numeric(18,2) not null,
  currency_code text not null default 'ZAR',
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  error_message text,
  initiated_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(payment_id, attempt_number)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payment_attempts_status_check'
  ) then
    alter table public.payment_attempts
      add constraint payment_attempts_status_check
      check (
        status in (
          'pending',
          'requires_action',
          'authorized',
          'paid',
          'failed',
          'cancelled',
          'expired'
        )
      );
  end if;
end
$$;

-- =========================================================
-- 4) PAYMENT EVENTS
-- =========================================================
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete set null,
  payment_attempt_id uuid references public.payment_attempts(id) on delete set null,
  provider text not null,
  event_type text not null,
  event_id text,
  event_created_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payment_events_provider_event_id_unique'
  ) then
    alter table public.payment_events
      add constraint payment_events_provider_event_id_unique
      unique (provider, event_id);
  end if;
exception
  when duplicate_table then null;
  when duplicate_object then null;
end
$$;

-- =========================================================
-- 5) PAYMENT ALLOCATIONS
-- =========================================================
create table if not exists public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  customer_invoice_id uuid references public.customer_invoices(id) on delete set null,
  order_id uuid references public.sales_orders(id) on delete set null,
  allocated_amount numeric(18,2) not null,
  created_at timestamptz not null default now(),
  created_by uuid
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payment_allocations_positive_amount_check'
  ) then
    alter table public.payment_allocations
      add constraint payment_allocations_positive_amount_check
      check (allocated_amount > 0);
  end if;
end
$$;

-- =========================================================
-- 6) PAYMENT REFUNDS
-- =========================================================
create table if not exists public.payment_refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  provider text,
  provider_refund_id text,
  refund_number text not null,
  refund_status text not null default 'pending',
  amount numeric(18,2) not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  initiated_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payment_refunds_refund_number_unique'
  ) then
    alter table public.payment_refunds
      add constraint payment_refunds_refund_number_unique
      unique (refund_number);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'payment_refunds_status_check'
  ) then
    alter table public.payment_refunds
      add constraint payment_refunds_status_check
      check (
        refund_status in (
          'pending',
          'processing',
          'completed',
          'failed',
          'cancelled'
        )
      );
  end if;
end
$$;

-- =========================================================
-- 7) ENTITLEMENTS
--    For courses, subscriptions, digital products, tools
-- =========================================================
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  entitlement_type text not null,
  resource_type text not null,
  resource_id uuid,
  access_level text not null default 'full',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'entitlements_type_check'
  ) then
    alter table public.entitlements
      add constraint entitlements_type_check
      check (
        entitlement_type in (
          'course_access',
          'subscription_access',
          'digital_download',
          'advisory_tool_access'
        )
      );
  end if;
end
$$;

-- =========================================================
-- 8) INDEXES
-- =========================================================
create unique index if not exists idx_payments_payment_number_unique
  on public.payments(payment_number);

create index if not exists idx_payments_order_id
  on public.payments(order_id);

create index if not exists idx_payments_customer_id
  on public.payments(customer_id);

create index if not exists idx_payments_status
  on public.payments(payment_status);

create index if not exists idx_payments_payment_type
  on public.payments(payment_type);

create index if not exists idx_payment_attempts_payment_id
  on public.payment_attempts(payment_id);

create index if not exists idx_payment_attempts_status
  on public.payment_attempts(status);

create index if not exists idx_payment_events_payment_id
  on public.payment_events(payment_id);

create index if not exists idx_payment_events_processed
  on public.payment_events(processed);

create index if not exists idx_payment_allocations_payment_id
  on public.payment_allocations(payment_id);

create index if not exists idx_payment_refunds_payment_id
  on public.payment_refunds(payment_id);

create index if not exists idx_entitlements_user_id
  on public.entitlements(user_id);

create index if not exists idx_entitlements_payment_id
  on public.entitlements(payment_id);

create index if not exists idx_entitlements_active
  on public.entitlements(is_active);

-- =========================================================
-- 9) UPDATED_AT TRIGGER HELPER
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

drop trigger if exists trg_payment_attempts_updated_at on public.payment_attempts;
create trigger trg_payment_attempts_updated_at
before update on public.payment_attempts
for each row
execute function public.set_updated_at();

-- =========================================================
-- 10) REFUND NUMBER GENERATOR
-- =========================================================
create or replace function public.generate_refund_number()
returns text
language plpgsql
as $$
declare
  v_date_part text;
  v_next_number bigint;
begin
  v_date_part := to_char(now(), 'YYYYMMDD');

  select coalesce(
    max(
      case
        when refund_number ~ '^RFD-[0-9]{8}-[0-9]+$'
        then regexp_replace(refund_number, '^RFD-[0-9]{8}-', '')::bigint
        else null
      end
    ),
    999
  ) + 1
  into v_next_number
  from public.payment_refunds
  where refund_number like 'RFD-' || v_date_part || '-%';

  return 'RFD-' || v_date_part || '-' || lpad(v_next_number::text, 6, '0');
end;
$$;

-- =========================================================
-- 11) STATE TRANSITION VALIDATOR
-- =========================================================
create or replace function public.is_valid_payment_status_transition(
  p_old_status text,
  p_new_status text
)
returns boolean
language plpgsql
immutable
as $$
begin
  if p_old_status is null then
    return p_new_status in ('draft', 'pending');
  end if;

  if p_old_status = p_new_status then
    return true;
  end if;

  return (
    (p_old_status = 'draft' and p_new_status in ('pending', 'cancelled', 'expired'))
    or
    (p_old_status = 'pending' and p_new_status in ('requires_action', 'authorized', 'paid', 'failed', 'cancelled', 'expired'))
    or
    (p_old_status = 'requires_action' and p_new_status in ('pending', 'authorized', 'paid', 'failed', 'cancelled', 'expired'))
    or
    (p_old_status = 'authorized' and p_new_status in ('paid', 'failed', 'cancelled'))
    or
    (p_old_status = 'paid' and p_new_status in ('partially_refunded', 'refunded'))
    or
    (p_old_status = 'partially_refunded' and p_new_status in ('refunded'))
  );
end;
$$;

-- =========================================================
-- 12) GENERIC STATUS UPDATE FUNCTION
-- =========================================================
create or replace function public.update_payment_status(
  p_payment_id uuid,
  p_new_status text,
  p_status_reason text default null
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
  v_updated public.payments%rowtype;
begin
  select *
  into v_payment
  from public.payments
  where id = p_payment_id
  for update;

  if v_payment.id is null then
    raise exception 'Payment not found: %', p_payment_id;
  end if;

  if not public.is_valid_payment_status_transition(v_payment.payment_status, p_new_status) then
    raise exception 'Invalid payment status transition from % to % for payment %',
      v_payment.payment_status, p_new_status, p_payment_id;
  end if;

  update public.payments
  set
    payment_status = p_new_status,
    status_reason = coalesce(p_status_reason, status_reason),
    updated_at = now(),
    paid_at = case when p_new_status = 'paid' then coalesce(paid_at, now()) else paid_at end,
    failed_at = case when p_new_status = 'failed' then coalesce(failed_at, now()) else failed_at end,
    cancelled_at = case when p_new_status = 'cancelled' then coalesce(cancelled_at, now()) else cancelled_at end,
    refunded_at = case when p_new_status = 'refunded' then coalesce(refunded_at, now()) else refunded_at end
  where id = p_payment_id
  returning *
  into v_updated;

  return v_updated;
end;
$$;

-- =========================================================
-- 13) CREATE PAYMENT ATTEMPT
-- =========================================================
create or replace function public.create_payment_attempt(
  p_payment_id uuid,
  p_provider text default null,
  p_payment_method text default null,
  p_amount numeric default null,
  p_currency_code text default null,
  p_request_payload jsonb default '{}'::jsonb
)
returns public.payment_attempts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
  v_attempt public.payment_attempts%rowtype;
  v_attempt_number integer;
begin
  select *
  into v_payment
  from public.payments
  where id = p_payment_id;

  if v_payment.id is null then
    raise exception 'Payment not found: %', p_payment_id;
  end if;

  select coalesce(max(attempt_number), 0) + 1
  into v_attempt_number
  from public.payment_attempts
  where payment_id = p_payment_id;

  insert into public.payment_attempts (
    payment_id,
    attempt_number,
    provider,
    payment_method,
    status,
    amount,
    currency_code,
    request_payload
  )
  values (
    p_payment_id,
    v_attempt_number,
    coalesce(p_provider, v_payment.provider, v_payment.payment_provider),
    coalesce(p_payment_method, v_payment.payment_method),
    'pending',
    coalesce(p_amount, v_payment.amount),
    coalesce(p_currency_code, v_payment.currency_code, 'ZAR'),
    coalesce(p_request_payload, '{}'::jsonb)
  )
  returning *
  into v_attempt;

  return v_attempt;
end;
$$;

-- =========================================================
-- 14) MARK PAYMENT REQUIRES ACTION
-- =========================================================
create or replace function public.mark_payment_requires_action(
  p_payment_id uuid,
  p_payment_attempt_id uuid default null,
  p_reason text default null,
  p_response_payload jsonb default '{}'::jsonb
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  if p_payment_attempt_id is not null then
    update public.payment_attempts
    set
      status = 'requires_action',
      response_payload = coalesce(response_payload, '{}'::jsonb) || coalesce(p_response_payload, '{}'::jsonb),
      updated_at = now()
    where id = p_payment_attempt_id;
  end if;

  select * into v_payment
  from public.update_payment_status(p_payment_id, 'requires_action', p_reason);

  return v_payment;
end;
$$;

-- =========================================================
-- 15) MARK PAYMENT AUTHORIZED
-- =========================================================
create or replace function public.mark_payment_authorized(
  p_payment_id uuid,
  p_payment_attempt_id uuid default null,
  p_provider_payment_intent_id text default null,
  p_provider_checkout_session_id text default null,
  p_authorization_amount numeric default null,
  p_response_payload jsonb default '{}'::jsonb
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  if p_payment_attempt_id is not null then
    update public.payment_attempts
    set
      status = 'authorized',
      provider_payment_intent_id = coalesce(p_provider_payment_intent_id, provider_payment_intent_id),
      provider_checkout_session_id = coalesce(p_provider_checkout_session_id, provider_checkout_session_id),
      response_payload = coalesce(response_payload, '{}'::jsonb) || coalesce(p_response_payload, '{}'::jsonb),
      completed_at = now(),
      updated_at = now()
    where id = p_payment_attempt_id;
  end if;

  update public.payments
  set
    provider_payment_intent_id = coalesce(p_provider_payment_intent_id, provider_payment_intent_id),
    provider_checkout_session_id = coalesce(p_provider_checkout_session_id, provider_checkout_session_id),
    authorization_amount = coalesce(p_authorization_amount, amount),
    authorized_at = coalesce(authorized_at, now()),
    updated_at = now()
  where id = p_payment_id;

  select * into v_payment
  from public.update_payment_status(p_payment_id, 'authorized', null);

  return v_payment;
end;
$$;

-- =========================================================
-- 16) PROCESS SUCCESSFUL PAYMENT
-- =========================================================
create or replace function public.process_successful_payment(
  p_payment_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  select *
  into v_payment
  from public.payments
  where id = p_payment_id;

  if v_payment.id is null then
    raise exception 'Payment not found: %', p_payment_id;
  end if;

  if v_payment.payment_status <> 'paid' then
    raise exception 'Payment % is not in paid status', p_payment_id;
  end if;

  -- Allocate to sales order if applicable and not already allocated
  if v_payment.order_id is not null then
    if not exists (
      select 1
      from public.payment_allocations
      where payment_id = v_payment.id
        and order_id = v_payment.order_id
    ) then
      insert into public.payment_allocations (
        payment_id,
        order_id,
        allocated_amount,
        created_by
      )
      values (
        v_payment.id,
        v_payment.order_id,
        v_payment.amount,
        v_payment.created_by
      );
    end if;
  end if;

  -- Allocate to customer invoice if applicable and not already allocated
  if v_payment.customer_invoice_id is not null then
    if not exists (
      select 1
      from public.payment_allocations
      where payment_id = v_payment.id
        and customer_invoice_id = v_payment.customer_invoice_id
    ) then
      insert into public.payment_allocations (
        payment_id,
        customer_invoice_id,
        allocated_amount,
        created_by
      )
      values (
        v_payment.id,
        v_payment.customer_invoice_id,
        v_payment.amount,
        v_payment.created_by
      );
    end if;
  end if;

  -- Entitlements for learning / digital products
  if v_payment.payment_type = 'course_payment' then
    if not exists (
      select 1
      from public.entitlements
      where payment_id = v_payment.id
        and entitlement_type = 'course_access'
    ) then
      insert into public.entitlements (
        user_id,
        payment_id,
        entitlement_type,
        resource_type,
        metadata
      )
      values (
        v_payment.customer_id,
        v_payment.id,
        'course_access',
        'course',
        coalesce(v_payment.metadata, '{}'::jsonb)
      );
    end if;
  elsif v_payment.payment_type = 'subscription_payment' then
    if not exists (
      select 1
      from public.entitlements
      where payment_id = v_payment.id
        and entitlement_type = 'subscription_access'
    ) then
      insert into public.entitlements (
        user_id,
        payment_id,
        entitlement_type,
        resource_type,
        expires_at,
        metadata
      )
      values (
        v_payment.customer_id,
        v_payment.id,
        'subscription_access',
        'training_platform',
        now() + interval '30 days',
        coalesce(v_payment.metadata, '{}'::jsonb)
      );
    end if;
  elsif v_payment.payment_type = 'digital_product_payment' then
    if not exists (
      select 1
      from public.entitlements
      where payment_id = v_payment.id
        and entitlement_type = 'digital_download'
    ) then
      insert into public.entitlements (
        user_id,
        payment_id,
        entitlement_type,
        resource_type,
        metadata
      )
      values (
        v_payment.customer_id,
        v_payment.id,
        'digital_download',
        'digital_product',
        coalesce(v_payment.metadata, '{}'::jsonb)
      );
    end if;
  end if;
end;
$$;

-- =========================================================
-- 17) MARK PAYMENT PAID
-- =========================================================
create or replace function public.mark_payment_paid(
  p_payment_id uuid,
  p_payment_attempt_id uuid default null,
  p_provider_transaction_id text default null,
  p_provider_payment_intent_id text default null,
  p_provider_checkout_session_id text default null,
  p_paid_amount numeric default null,
  p_response_payload jsonb default '{}'::jsonb
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  if p_payment_attempt_id is not null then
    update public.payment_attempts
    set
      status = 'paid',
      provider_payment_intent_id = coalesce(p_provider_payment_intent_id, provider_payment_intent_id),
      provider_checkout_session_id = coalesce(p_provider_checkout_session_id, provider_checkout_session_id),
      provider_reference = coalesce(p_provider_transaction_id, provider_reference),
      response_payload = coalesce(response_payload, '{}'::jsonb) || coalesce(p_response_payload, '{}'::jsonb),
      completed_at = now(),
      updated_at = now()
    where id = p_payment_attempt_id;
  end if;

  update public.payments
  set
    provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
    provider_payment_intent_id = coalesce(p_provider_payment_intent_id, provider_payment_intent_id),
    provider_checkout_session_id = coalesce(p_provider_checkout_session_id, provider_checkout_session_id),
    captured_amount = coalesce(p_paid_amount, amount),
    paid_at = coalesce(paid_at, now()),
    updated_at = now()
  where id = p_payment_id;

  select * into v_payment
  from public.update_payment_status(p_payment_id, 'paid', null);

  perform public.process_successful_payment(p_payment_id);

  return v_payment;
end;
$$;

-- =========================================================
-- 18) MARK PAYMENT FAILED
-- =========================================================
create or replace function public.mark_payment_failed(
  p_payment_id uuid,
  p_payment_attempt_id uuid default null,
  p_failure_reason text default null,
  p_response_payload jsonb default '{}'::jsonb
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  if p_payment_attempt_id is not null then
    update public.payment_attempts
    set
      status = 'failed',
      error_message = p_failure_reason,
      response_payload = coalesce(response_payload, '{}'::jsonb) || coalesce(p_response_payload, '{}'::jsonb),
      completed_at = now(),
      updated_at = now()
    where id = p_payment_attempt_id;
  end if;

  update public.payments
  set
    failure_reason = coalesce(p_failure_reason, failure_reason),
    failed_at = coalesce(failed_at, now()),
    updated_at = now()
  where id = p_payment_id;

  select * into v_payment
  from public.update_payment_status(p_payment_id, 'failed', p_failure_reason);

  return v_payment;
end;
$$;

-- =========================================================
-- 19) CREATE REFUND RECORD
-- =========================================================
create or replace function public.create_payment_refund(
  p_payment_id uuid,
  p_amount numeric,
  p_reason text default null,
  p_provider text default null,
  p_provider_refund_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.payment_refunds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
  v_refund public.payment_refunds%rowtype;
  v_total_refunded numeric(18,2);
begin
  select *
  into v_payment
  from public.payments
  where id = p_payment_id
  for update;

  if v_payment.id is null then
    raise exception 'Payment not found: %', p_payment_id;
  end if;

  if v_payment.payment_status not in ('paid', 'partially_refunded') then
    raise exception 'Refund not allowed for payment status: %', v_payment.payment_status;
  end if;

  if p_amount <= 0 then
    raise exception 'Refund amount must be greater than zero';
  end if;

  select coalesce(sum(amount), 0)
  into v_total_refunded
  from public.payment_refunds
  where payment_id = p_payment_id
    and refund_status in ('pending', 'processing', 'completed');

  if v_total_refunded + p_amount > v_payment.amount then
    raise exception 'Refund amount exceeds payment amount';
  end if;

  insert into public.payment_refunds (
    payment_id,
    provider,
    provider_refund_id,
    refund_number,
    refund_status,
    amount,
    reason,
    metadata
  )
  values (
    p_payment_id,
    coalesce(p_provider, v_payment.provider, v_payment.payment_provider),
    p_provider_refund_id,
    public.generate_refund_number(),
    'pending',
    p_amount,
    p_reason,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning *
  into v_refund;

  return v_refund;
end;
$$;

-- =========================================================
-- 20) RLS ENABLEMENT
--    Enable now; policies can be expanded later
-- =========================================================
alter table public.payment_attempts enable row level security;
alter table public.payment_events enable row level security;
alter table public.payment_allocations enable row level security;
alter table public.payment_refunds enable row level security;
alter table public.entitlements enable row level security;

-- =========================================================
-- 21) BASIC RLS POLICIES
-- =========================================================
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'entitlements'
      and policyname = 'entitlements_select_own'
  ) then
    create policy entitlements_select_own
      on public.entitlements
      for select
      using (user_id = auth.uid());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_attempts'
      and policyname = 'payment_attempts_select_related'
  ) then
    create policy payment_attempts_select_related
      on public.payment_attempts
      for select
      using (
        exists (
          select 1
          from public.payments p
          where p.id = payment_attempts.payment_id
            and p.customer_id = auth.uid()
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_allocations'
      and policyname = 'payment_allocations_select_related'
  ) then
    create policy payment_allocations_select_related
      on public.payment_allocations
      for select
      using (
        exists (
          select 1
          from public.payments p
          where p.id = payment_allocations.payment_id
            and p.customer_id = auth.uid()
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_refunds'
      and policyname = 'payment_refunds_select_related'
  ) then
    create policy payment_refunds_select_related
      on public.payment_refunds
      for select
      using (
        exists (
          select 1
          from public.payments p
          where p.id = payment_refunds.payment_id
            and p.customer_id = auth.uid()
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_events'
      and policyname = 'payment_events_select_related'
  ) then
    create policy payment_events_select_related
      on public.payment_events
      for select
      using (
        exists (
          select 1
          from public.payments p
          where p.id = payment_events.payment_id
            and p.customer_id = auth.uid()
        )
      );
  end if;
end
$$;

commit;
