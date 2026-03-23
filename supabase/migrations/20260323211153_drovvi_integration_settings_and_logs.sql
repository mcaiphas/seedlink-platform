-- ============================================================================
-- Drovvi Integration Settings + Logs
-- Enterprise-grade Supabase migration
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 0) Extensions
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1) Utility: updated_at trigger function
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2) current_company_id() already exists in earlier migrations
--    Reuse the platform helper from 202603210200_commerce_cycle_v1.sql
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- 3) Fallback helper: current user is authenticated
-- ----------------------------------------------------------------------------
create or replace function public.current_user_is_authenticated()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null
$$;

-- ----------------------------------------------------------------------------
-- 4) Fallback helper: conservative admin check
--
--    IMPORTANT:
--    If you already have RBAC helpers such as
--    public.current_user_has_permission(text) or
--    public.current_user_has_any_role(text[])
--    then replace policy usage below with your real helpers.
--
--    This fallback only allows:
--    - service_role bypasses RLS automatically
--    - authenticated users whose email matches a small allowlist
--
--    Replace the emails below with your real super/admin users if needed.
-- ----------------------------------------------------------------------------
create or replace function public.current_user_is_platform_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email, '')) in (
        lower('mcaiphas@gmail.com')
      )
  )
$$;

-- ----------------------------------------------------------------------------
-- 5) Helper: company-scoped admin access
--
--    For now:
--    - platform admin passes
--    - any authenticated user with a company_id can read their own company data
--
--    You should tighten this later to actual RBAC permissions such as:
--    settings.integrations.view
--    settings.integrations.manage
--    settings.integrations.logs.view
-- ----------------------------------------------------------------------------
create or replace function public.can_view_company_integrations(p_company_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.current_user_is_platform_admin()
    or (
      public.current_user_is_authenticated()
      and public.current_company_id() is not null
      and public.current_company_id() = p_company_id
    )
$$;

create or replace function public.can_manage_company_integrations(p_company_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.current_user_is_platform_admin()
    or (
      public.current_user_is_authenticated()
      and public.current_company_id() is not null
      and public.current_company_id() = p_company_id
    )
$$;

-- ----------------------------------------------------------------------------
-- 6) Main table: integration_drovvi_settings
-- ----------------------------------------------------------------------------
create table if not exists public.integration_drovvi_settings (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,
  provider_name text not null default 'drovvi',

  is_enabled boolean not null default false,
  environment text not null default 'sandbox',
  api_base_url text,

  -- store encrypted values only; never expose to client select queries
  api_key_encrypted text,
  webhook_secret_encrypted text,

  -- UI-safe flags
  has_api_key boolean not null default false,
  has_webhook_secret boolean not null default false,

  tenant_mapping_code text,
  default_shipment_mode text,

  auto_create_shipment boolean not null default false,
  auto_request_quote boolean not null default false,
  auto_sync_tracking boolean not null default false,
  auto_sync_pod boolean not null default false,
  auto_sync_settlement boolean not null default false,

  connection_status text not null default 'disconnected',
  connection_message text,
  last_tested_at timestamptz,
  last_test_result text,

  last_successful_sync_at timestamptz,
  last_failed_sync_at timestamptz,
  failed_sync_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,

  constraint integration_drovvi_settings_company_provider_unique
    unique (company_id, provider_name),

  constraint integration_drovvi_settings_environment_check
    check (environment in ('sandbox', 'production')),

  constraint integration_drovvi_settings_connection_status_check
    check (connection_status in ('connected', 'disconnected', 'error', 'sandbox', 'testing')),

  constraint integration_drovvi_settings_failed_sync_count_check
    check (failed_sync_count >= 0),

  constraint integration_drovvi_settings_provider_name_check
    check (provider_name = 'drovvi'),

  constraint integration_drovvi_settings_default_shipment_mode_check
    check (
      default_shipment_mode is null
      or default_shipment_mode in (
        'marketplace',
        'tenant_dedicated',
        'supplier_delivery',
        'manual_dispatch'
      )
    ),

  constraint integration_drovvi_settings_company_id_not_nil
    check (company_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);

-- ----------------------------------------------------------------------------
-- 7) Logs table: integration_drovvi_logs
-- ----------------------------------------------------------------------------
create table if not exists public.integration_drovvi_logs (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,
  settings_id uuid references public.integration_drovvi_settings(id) on delete set null,

  event_type text not null,
  module_source text,
  status text not null,
  message text not null,

  request_payload jsonb,
  response_payload jsonb,
  http_status_code integer,

  retryable boolean not null default false,
  retry_count integer not null default 0,

  occurred_at timestamptz not null default now(),
  created_by uuid,

  constraint integration_drovvi_logs_status_check
    check (status in ('success', 'warning', 'error', 'info')),

  constraint integration_drovvi_logs_retry_count_check
    check (retry_count >= 0),

  constraint integration_drovvi_logs_event_type_check
    check (
      event_type in (
        'config_saved',
        'connection_test',
        'disconnect',
        'quote_request',
        'shipment_create',
        'tracking_sync',
        'pod_sync',
        'settlement_sync',
        'webhook_received',
        'webhook_failed',
        'retry'
      )
    ),

  constraint integration_drovvi_logs_company_id_not_nil
    check (company_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);

-- ----------------------------------------------------------------------------
-- 8) Helpful indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_integration_drovvi_settings_company_id
  on public.integration_drovvi_settings(company_id);

create index if not exists idx_integration_drovvi_settings_connection_status
  on public.integration_drovvi_settings(connection_status);

create index if not exists idx_integration_drovvi_settings_environment
  on public.integration_drovvi_settings(environment);

create index if not exists idx_integration_drovvi_logs_company_id
  on public.integration_drovvi_logs(company_id);

create index if not exists idx_integration_drovvi_logs_settings_id
  on public.integration_drovvi_logs(settings_id);

create index if not exists idx_integration_drovvi_logs_occurred_at_desc
  on public.integration_drovvi_logs(occurred_at desc);

create index if not exists idx_integration_drovvi_logs_status
  on public.integration_drovvi_logs(status);

create index if not exists idx_integration_drovvi_logs_event_type
  on public.integration_drovvi_logs(event_type);

create index if not exists idx_integration_drovvi_logs_company_status_occurred
  on public.integration_drovvi_logs(company_id, status, occurred_at desc);

-- ----------------------------------------------------------------------------
-- 9) Trigger: updated_at on settings
-- ----------------------------------------------------------------------------
drop trigger if exists trg_integration_drovvi_settings_updated_at
on public.integration_drovvi_settings;

create trigger trg_integration_drovvi_settings_updated_at
before update on public.integration_drovvi_settings
for each row
execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 10) Trigger: auto-set created_by / updated_by where possible
-- ----------------------------------------------------------------------------
create or replace function public.set_audit_user_columns()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by = auth.uid();
    end if;
    if new.updated_by is null then
      new.updated_by = auth.uid();
    end if;
  elsif tg_op = 'UPDATE' then
    new.updated_by = auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_integration_drovvi_settings_audit_user
on public.integration_drovvi_settings;

create trigger trg_integration_drovvi_settings_audit_user
before insert or update on public.integration_drovvi_settings
for each row
execute function public.set_audit_user_columns();

drop trigger if exists trg_integration_drovvi_logs_audit_user
on public.integration_drovvi_logs;

create trigger trg_integration_drovvi_logs_audit_user
before insert on public.integration_drovvi_logs
for each row
execute function public.set_audit_user_columns();

-- ----------------------------------------------------------------------------
-- 11) Optional view: safe read model for frontend
--
--     This intentionally excludes encrypted secret columns.
-- ----------------------------------------------------------------------------
create or replace view public.v_integration_drovvi_settings_safe as
select
  s.id,
  s.company_id,
  s.provider_name,
  s.is_enabled,
  s.environment,
  s.api_base_url,
  s.has_api_key,
  s.has_webhook_secret,
  s.tenant_mapping_code,
  s.default_shipment_mode,
  s.auto_create_shipment,
  s.auto_request_quote,
  s.auto_sync_tracking,
  s.auto_sync_pod,
  s.auto_sync_settlement,
  s.connection_status,
  s.connection_message,
  s.last_tested_at,
  s.last_test_result,
  s.last_successful_sync_at,
  s.last_failed_sync_at,
  s.failed_sync_count,
  s.created_at,
  s.updated_at,
  s.created_by,
  s.updated_by
from public.integration_drovvi_settings s;

-- ----------------------------------------------------------------------------
-- 12) Enable RLS
-- ----------------------------------------------------------------------------
alter table public.integration_drovvi_settings enable row level security;
alter table public.integration_drovvi_logs enable row level security;

-- ----------------------------------------------------------------------------
-- 13) RLS Policies: integration_drovvi_settings
-- ----------------------------------------------------------------------------

-- Read settings for own company (or platform admin)
drop policy if exists integration_drovvi_settings_select_policy
on public.integration_drovvi_settings;

create policy integration_drovvi_settings_select_policy
on public.integration_drovvi_settings
for select
using (
  public.can_view_company_integrations(company_id)
);

-- Insert settings for own company (or platform admin)
drop policy if exists integration_drovvi_settings_insert_policy
on public.integration_drovvi_settings;

create policy integration_drovvi_settings_insert_policy
on public.integration_drovvi_settings
for insert
with check (
  public.can_manage_company_integrations(company_id)
);

-- Update settings for own company (or platform admin)
drop policy if exists integration_drovvi_settings_update_policy
on public.integration_drovvi_settings;

create policy integration_drovvi_settings_update_policy
on public.integration_drovvi_settings
for update
using (
  public.can_manage_company_integrations(company_id)
)
with check (
  public.can_manage_company_integrations(company_id)
);

-- Delete settings: usually restrict to platform admin only
drop policy if exists integration_drovvi_settings_delete_policy
on public.integration_drovvi_settings;

create policy integration_drovvi_settings_delete_policy
on public.integration_drovvi_settings
for delete
using (
  public.current_user_is_platform_admin()
);

-- ----------------------------------------------------------------------------
-- 14) RLS Policies: integration_drovvi_logs
-- ----------------------------------------------------------------------------

-- Read logs for own company (or platform admin)
drop policy if exists integration_drovvi_logs_select_policy
on public.integration_drovvi_logs;

create policy integration_drovvi_logs_select_policy
on public.integration_drovvi_logs
for select
using (
  public.can_view_company_integrations(company_id)
);

-- Insert logs:
-- Prefer Edge Functions / service role.
-- This policy allows only platform admin via client.
-- Service role bypasses RLS automatically.
drop policy if exists integration_drovvi_logs_insert_policy
on public.integration_drovvi_logs;

create policy integration_drovvi_logs_insert_policy
on public.integration_drovvi_logs
for insert
with check (
  public.current_user_is_platform_admin()
);

-- Update logs:
-- Normally should be service role only.
drop policy if exists integration_drovvi_logs_update_policy
on public.integration_drovvi_logs;

create policy integration_drovvi_logs_update_policy
on public.integration_drovvi_logs
for update
using (
  public.current_user_is_platform_admin()
)
with check (
  public.current_user_is_platform_admin()
);

-- Delete logs:
-- restrict tightly
drop policy if exists integration_drovvi_logs_delete_policy
on public.integration_drovvi_logs;

create policy integration_drovvi_logs_delete_policy
on public.integration_drovvi_logs
for delete
using (
  public.current_user_is_platform_admin()
);

-- ----------------------------------------------------------------------------
-- 15) Grant access to safe view
-- ----------------------------------------------------------------------------
grant select on public.v_integration_drovvi_settings_safe to authenticated;

-- ----------------------------------------------------------------------------
-- 16) Optional comments
-- ----------------------------------------------------------------------------
comment on table public.integration_drovvi_settings is
'Drovvi integration configuration per company/tenant. Encrypted secrets stored server-side only.';

comment on table public.integration_drovvi_logs is
'Audit and operational log table for Drovvi integration events such as tests, syncs, failures, and retries.';

comment on view public.v_integration_drovvi_settings_safe is
'Safe frontend-readable projection of Drovvi settings without encrypted secret fields.';

commit;
