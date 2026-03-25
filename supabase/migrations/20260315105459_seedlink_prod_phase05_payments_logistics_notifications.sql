create extension if not exists pgcrypto;

create table public.payment_gateways (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  provider_type text not null,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  supported_currencies jsonb not null default '["ZAR"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  gateway_id uuid references public.payment_gateways(id) on delete set null,
  transaction_type text not null check (transaction_type in ('payment', 'refund', 'payout', 'subscription')),
  amount numeric not null default 0,
  currency_code text not null default 'ZAR',
  status text not null default 'pending' check (status in ('pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded')),
  provider_reference text,
  provider_response jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  wallet_type text not null default 'general' check (wallet_type in ('general', 'supplier', 'logistics', 'marketplace')),
  balance numeric not null default 0,
  currency_code text not null default 'ZAR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or organization_id is not null)
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  payment_transaction_id uuid references public.payment_transactions(id) on delete set null,
  transaction_type text not null check (transaction_type in ('credit', 'debit', 'hold', 'release', 'payout')),
  amount numeric not null default 0,
  balance_before numeric,
  balance_after numeric,
  reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.delivery_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  requested_by uuid references public.profiles(id) on delete set null,
  pickup_address text not null,
  dropoff_address text not null,
  pickup_lat numeric,
  pickup_lng numeric,
  dropoff_lat numeric,
  dropoff_lng numeric,
  cargo_type text,
  weight_kg numeric,
  delivery_status text not null default 'pending' check (
    delivery_status in ('pending', 'quoted', 'assigned', 'in_transit', 'delivered', 'cancelled')
  ),
  logistics_provider text default 'drovvi',
  external_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_status_logs (
  id uuid primary key default gen_random_uuid(),
  delivery_request_id uuid not null references public.delivery_requests(id) on delete cascade,
  status text not null,
  notes text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  channel text not null check (channel in ('in_app', 'email', 'sms', 'whatsapp')),
  notification_type text not null,
  title text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'delivered', 'read', 'failed')),
  sent_at timestamptz,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (user_id is not null or organization_id is not null)
);

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  whatsapp_enabled boolean not null default false,
  in_app_enabled boolean not null default true,
  order_updates boolean not null default true,
  payment_updates boolean not null default true,
  training_updates boolean not null default true,
  agronomy_updates boolean not null default true,
  marketing_updates boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_payment_transactions_order_id on public.payment_transactions(order_id);
create index idx_payment_transactions_subscription_id on public.payment_transactions(subscription_id);
create index idx_payment_transactions_user_id on public.payment_transactions(user_id);
create index idx_payment_transactions_gateway_id on public.payment_transactions(gateway_id);
create index idx_wallets_user_id on public.wallets(user_id);
create index idx_wallets_organization_id on public.wallets(organization_id);
create index idx_wallet_transactions_wallet_id on public.wallet_transactions(wallet_id);
create index idx_wallet_transactions_payment_transaction_id on public.wallet_transactions(payment_transaction_id);
create index idx_delivery_requests_order_id on public.delivery_requests(order_id);
create index idx_delivery_requests_requested_by on public.delivery_requests(requested_by);
create index idx_delivery_status_logs_delivery_request_id on public.delivery_status_logs(delivery_request_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_organization_id on public.notifications(organization_id);
create index idx_notification_preferences_user_id on public.notification_preferences(user_id);
create index idx_audit_logs_actor_user_id on public.audit_logs(actor_user_id);
create index idx_audit_logs_entity_type on public.audit_logs(entity_type);

do $$
begin
  if to_regclass('public.payment_gateways') is not null
     and not exists (select 1 from pg_trigger where tgname = 'trg_payment_gateways_updated_at') then
    create trigger trg_payment_gateways_updated_at
    before update on public.payment_gateways
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.payments') is not null
     and not exists (select 1 from pg_trigger where tgname = 'trg_payments_updated_at') then
    create trigger trg_payments_updated_at
    before update on public.payments
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.shipments') is not null
     and not exists (select 1 from pg_trigger where tgname = 'trg_shipments_updated_at') then
    create trigger trg_shipments_updated_at
    before update on public.shipments
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.notifications') is not null
     and not exists (select 1 from pg_trigger where tgname = 'trg_notifications_updated_at') then
    create trigger trg_notifications_updated_at
    before update on public.notifications
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

insert into public.payment_gateways (name, code, provider_type, supported_currencies, is_active)
values
  ('PayFast', 'payfast', 'gateway', '["ZAR"]'::jsonb, true),
  ('Ozow', 'ozow', 'gateway', '["ZAR"]'::jsonb, true),
  ('Stripe', 'stripe', 'gateway', '["ZAR","USD","EUR"]'::jsonb, true),
  ('Yoco', 'yoco', 'gateway', '["ZAR"]'::jsonb, true)
on conflict (code) do nothing;
