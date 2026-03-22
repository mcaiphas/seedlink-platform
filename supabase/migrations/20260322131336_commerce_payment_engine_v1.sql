-- =========================================================
-- Seedlink Commerce: Payment Engine v1
-- =========================================================

-- ---------------------------------------------------------
-- 1. Align existing payments table for checkout flow
-- ---------------------------------------------------------
alter table public.payments
  add column if not exists checkout_url text null,
  add column if not exists initiated_at timestamptz not null default now(),
  add column if not exists authorized_at timestamptz null,
  add column if not exists cancelled_at timestamptz null,
  add column if not exists refunded_at timestamptz null,
  add column if not exists failure_reason text null;

create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_payment_status on public.payments(payment_status);
create index if not exists idx_payments_payment_reference on public.payments(payment_reference);
create index if not exists idx_payments_provider_transaction_id on public.payments(provider_transaction_id);

-- keep provider/payment provider fields synchronized where useful
update public.payments
set provider = coalesce(provider, payment_provider)
where provider is null and payment_provider is not null;

update public.payments
set payment_provider = coalesce(payment_provider, provider)
where payment_provider is null and provider is not null;

-- ---------------------------------------------------------
-- 2. Align payment_transactions for order-linked checkout logging
-- ---------------------------------------------------------
alter table public.payment_transactions
  add column if not exists payment_id uuid null references public.payments(id) on delete cascade,
  add column if not exists event_type text null,
  add column if not exists payment_method text null,
  add column if not exists notes text null,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_payment_transactions_payment_id on public.payment_transactions(payment_id);
create index if not exists idx_payment_transactions_order_id on public.payment_transactions(order_id);
create index if not exists idx_payment_transactions_status on public.payment_transactions(status);
create index if not exists idx_payment_transactions_provider_reference on public.payment_transactions(provider_reference);

-- ---------------------------------------------------------
-- 3. Create payment record for an order
-- ---------------------------------------------------------
create or replace function public.create_payment_for_order(
  p_order_id uuid,
  p_payment_method text default 'card',
  p_payment_provider text default 'manual',
  p_checkout_url text default null,
  p_checkout_session_id uuid default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.sales_orders;
  v_payment public.payments;
begin
  select *
  into v_order
  from public.sales_orders
  where id = p_order_id;

  if v_order.id is null then
    raise exception 'Order not found';
  end if;

  if v_order.total_amount is null or v_order.total_amount <= 0 then
    raise exception 'Order total must be greater than zero';
  end if;

  -- prevent duplicate active payment records for the same order unless failed/cancelled/refunded
  select *
  into v_payment
  from public.payments
  where order_id = v_order.id
    and payment_status in ('pending', 'authorized', 'paid')
  order by created_at desc
  limit 1;

  if v_payment.id is null then
    insert into public.payments (
      customer_id,
      order_id,
      payment_method,
      payment_provider,
      provider,
      payment_reference,
      amount,
      currency_code,
      payment_status,
      checkout_session_id,
      checkout_url,
      notes,
      metadata,
      created_by,
      initiated_at
    )
    values (
      v_order.customer_id,
      v_order.id,
      coalesce(p_payment_method, 'card'),
      coalesce(p_payment_provider, 'manual'),
      coalesce(p_payment_provider, 'manual'),
      public.generate_payment_reference(),
      v_order.total_amount,
      v_order.currency_code,
      'pending',
      p_checkout_session_id,
      p_checkout_url,
      p_notes,
      jsonb_build_object(
        'source', 'create_payment_for_order',
        'sales_order_id', v_order.id,
        'order_number', v_order.order_number
      ),
      auth.uid(),
      now()
    )
    returning * into v_payment;
  end if;

  update public.sales_orders
  set
    payment_method = coalesce(p_payment_method, payment_method),
    payment_provider = coalesce(p_payment_provider, payment_provider),
    payment_status = case when payment_status = 'unpaid' then 'pending' else payment_status end,
    status = case when status = 'draft' then 'pending_payment' else status end,
    updated_at = now()
  where id = v_order.id;

  insert into public.payment_transactions (
    payment_id,
    order_id,
    user_id,
    transaction_type,
    event_type,
    payment_method,
    amount,
    currency_code,
    status,
    provider_reference,
    provider_response,
    notes,
    metadata
  )
  values (
    v_payment.id,
    v_order.id,
    auth.uid(),
    'payment_initiated',
    'payment_initiated',
    coalesce(p_payment_method, 'card'),
    v_payment.amount,
    v_payment.currency_code,
    'pending',
    v_payment.payment_reference,
    jsonb_build_object(
      'checkout_url', p_checkout_url,
      'checkout_session_id', p_checkout_session_id
    ),
    p_notes,
    jsonb_build_object(
      'payment_id', v_payment.id,
      'order_id', v_order.id
    )
  );

  return jsonb_build_object(
    'payment', to_jsonb(v_payment),
    'order', (
      select to_jsonb(so)
      from public.sales_orders so
      where so.id = v_order.id
    )
  );
end;
$$;

grant execute on function public.create_payment_for_order(uuid, text, text, text, uuid, text) to authenticated;

-- ---------------------------------------------------------
-- 4. Mark payment successful
-- ---------------------------------------------------------
create or replace function public.mark_payment_paid(
  p_payment_id uuid,
  p_provider_transaction_id text default null,
  p_provider_response jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments;
  v_order public.sales_orders;
begin
  select *
  into v_payment
  from public.payments
  where id = p_payment_id;

  if v_payment.id is null then
    raise exception 'Payment not found';
  end if;

  update public.payments
  set
    payment_status = 'paid',
    provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
    provider_response = coalesce(provider_response, '{}'::jsonb) || coalesce(p_provider_response, '{}'::jsonb),
    paid_at = now(),
    updated_at = now()
  where id = p_payment_id
  returning * into v_payment;

  update public.sales_orders
  set
    payment_status = 'paid',
    status = case when status in ('draft', 'pending_payment') then 'paid' else status end,
    updated_at = now()
  where id = v_payment.order_id
  returning * into v_order;

  insert into public.payment_transactions (
    payment_id,
    order_id,
    user_id,
    transaction_type,
    event_type,
    payment_method,
    amount,
    currency_code,
    status,
    provider_reference,
    provider_response,
    metadata
  )
  values (
    v_payment.id,
    v_payment.order_id,
    auth.uid(),
    'payment_paid',
    'payment_paid',
    v_payment.payment_method,
    v_payment.amount,
    v_payment.currency_code,
    'paid',
    coalesce(p_provider_transaction_id, v_payment.payment_reference),
    p_provider_response,
    jsonb_build_object(
      'payment_id', v_payment.id,
      'order_id', v_payment.order_id
    )
  );

  return jsonb_build_object(
    'payment', to_jsonb(v_payment),
    'order', to_jsonb(v_order)
  );
end;
$$;

grant execute on function public.mark_payment_paid(uuid, text, jsonb) to authenticated;

-- ---------------------------------------------------------
-- 5. Mark payment failed
-- ---------------------------------------------------------
create or replace function public.mark_payment_failed(
  p_payment_id uuid,
  p_failure_reason text default null,
  p_provider_response jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments;
  v_order public.sales_orders;
begin
  select *
  into v_payment
  from public.payments
  where id = p_payment_id;

  if v_payment.id is null then
    raise exception 'Payment not found';
  end if;

  update public.payments
  set
    payment_status = 'failed',
    failure_reason = p_failure_reason,
    provider_response = coalesce(provider_response, '{}'::jsonb) || coalesce(p_provider_response, '{}'::jsonb),
    failed_at = now(),
    updated_at = now()
  where id = p_payment_id
  returning * into v_payment;

  update public.sales_orders
  set
    payment_status = 'failed',
    status = case when status = 'pending_payment' then 'pending_payment' else status end,
    updated_at = now()
  where id = v_payment.order_id
  returning * into v_order;

  insert into public.payment_transactions (
    payment_id,
    order_id,
    user_id,
    transaction_type,
    event_type,
    payment_method,
    amount,
    currency_code,
    status,
    provider_reference,
    provider_response,
    notes,
    metadata
  )
  values (
    v_payment.id,
    v_payment.order_id,
    auth.uid(),
    'payment_failed',
    'payment_failed',
    v_payment.payment_method,
    v_payment.amount,
    v_payment.currency_code,
    'failed',
    v_payment.payment_reference,
    p_provider_response,
    p_failure_reason,
    jsonb_build_object(
      'payment_id', v_payment.id,
      'order_id', v_payment.order_id
    )
  );

  return jsonb_build_object(
    'payment', to_jsonb(v_payment),
    'order', to_jsonb(v_order)
  );
end;
$$;

grant execute on function public.mark_payment_failed(uuid, text, jsonb) to authenticated;
