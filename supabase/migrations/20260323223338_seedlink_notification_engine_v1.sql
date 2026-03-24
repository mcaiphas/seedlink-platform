-- ============================================================================
-- Seedlink Notification Architecture
-- Supabase SQL Schema + RLS Policies
-- Channels: email, sms, whatsapp, in_app
-- ============================================================================
begin;

-- ----------------------------------------------------------------------------
-- 0) Extensions
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1) Shared helper: updated_at trigger
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
-- 2) Shared helper: current_company_id()
--    Reuse if already defined in your project. This version is safe.
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 3) Shared helper: current authenticated user
-- ----------------------------------------------------------------------------
create or replace function public.current_user_is_authenticated()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null
$$;

-- ----------------------------------------------------------------------------
-- 4) Shared helper: platform admin fallback
--    Replace with your real RBAC helper later if available.
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
-- 5) Shared helper: generic company-scoped read/manage access
--    Replace with permission-based helpers later if you have them.
-- ----------------------------------------------------------------------------
create or replace function public.can_view_company_notifications(p_company_id uuid)
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

create or replace function public.can_manage_company_notifications(p_company_id uuid)
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
-- 6) Shared helper: user can read/update own in-app notifications
-- ----------------------------------------------------------------------------
create or replace function public.can_access_own_notification(p_user_id uuid, p_company_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.current_user_is_platform_admin()
    or (
      auth.uid() = p_user_id
      and public.current_company_id() is not null
      and public.current_company_id() = p_company_id
    )
$$;

-- ----------------------------------------------------------------------------
-- 7) notification_events
-- ----------------------------------------------------------------------------
create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,

  event_type text not null,
  entity_type text not null,
  entity_id uuid not null,

  triggered_by_user_id uuid null references auth.users(id) on delete set null,
  source_module text not null,
  payload jsonb not null default '{}'::jsonb,

  status text not null default 'pending',

  created_at timestamptz not null default now(),
  processed_at timestamptz null,

  constraint notification_events_status_check
    check (status in ('pending', 'processed', 'partially_processed', 'failed')),

  constraint notification_events_company_id_not_nil
    check (company_id <> '00000000-0000-0000-0000-000000000000'::uuid),

  constraint notification_events_event_type_not_blank
    check (length(trim(event_type)) > 0),

  constraint notification_events_entity_type_not_blank
    check (length(trim(entity_type)) > 0),

  constraint notification_events_source_module_not_blank
    check (length(trim(source_module)) > 0)
);

create index if not exists idx_notification_events_company_id
  on public.notification_events(company_id);

create index if not exists idx_notification_events_event_type
  on public.notification_events(event_type);

create index if not exists idx_notification_events_entity
  on public.notification_events(entity_type, entity_id);

create index if not exists idx_notification_events_status
  on public.notification_events(status);

create index if not exists idx_notification_events_created_at_desc
  on public.notification_events(created_at desc);

-- ----------------------------------------------------------------------------
-- 8) notification_logs
-- ----------------------------------------------------------------------------
create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.notification_events(id) on delete cascade,
  company_id uuid not null,

  entity_type text not null,
  entity_id uuid not null,
  event_type text not null,

  recipient_type text not null,
  recipient_id uuid null,
  recipient_name text null,
  recipient_address text not null,

  channel text not null,
  template_key text not null,

  subject text null,
  message_preview text null,

  status text not null default 'queued',

  provider text null,
  provider_message_id text null,
  provider_response jsonb null,

  error_message text null,
  retry_count integer not null default 0,

  sent_at timestamptz null,
  failed_at timestamptz null,
  read_at timestamptz null,
  created_at timestamptz not null default now(),

  constraint notification_logs_channel_check
    check (channel in ('email', 'sms', 'whatsapp', 'in_app')),

  constraint notification_logs_status_check
    check (status in ('queued', 'sent', 'failed', 'delivered', 'read')),

  constraint notification_logs_recipient_type_check
    check (recipient_type in ('customer', 'user', 'admin', 'sales', 'finance', 'warehouse', 'supplier', 'system')),

  constraint notification_logs_retry_count_check
    check (retry_count >= 0),

  constraint notification_logs_company_id_not_nil
    check (company_id <> '00000000-0000-0000-0000-000000000000'::uuid),

  constraint notification_logs_entity_type_not_blank
    check (length(trim(entity_type)) > 0),

  constraint notification_logs_event_type_not_blank
    check (length(trim(event_type)) > 0),

  constraint notification_logs_recipient_address_not_blank
    check (length(trim(recipient_address)) > 0),

  constraint notification_logs_template_key_not_blank
    check (length(trim(template_key)) > 0)
);

create index if not exists idx_notification_logs_event_id
  on public.notification_logs(event_id);

create index if not exists idx_notification_logs_company_id
  on public.notification_logs(company_id);

create index if not exists idx_notification_logs_entity
  on public.notification_logs(entity_type, entity_id);

create index if not exists idx_notification_logs_event_type
  on public.notification_logs(event_type);

create index if not exists idx_notification_logs_channel
  on public.notification_logs(channel);

create index if not exists idx_notification_logs_status
  on public.notification_logs(status);

create index if not exists idx_notification_logs_recipient_id
  on public.notification_logs(recipient_id);

create index if not exists idx_notification_logs_created_at_desc
  on public.notification_logs(created_at desc);

create index if not exists idx_notification_logs_company_status_created
  on public.notification_logs(company_id, status, created_at desc);

-- ----------------------------------------------------------------------------
-- 9) user_notifications
-- ----------------------------------------------------------------------------
create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,

  notification_log_id uuid null references public.notification_logs(id) on delete set null,

  event_type text not null,
  entity_type text not null,
  entity_id uuid not null,

  title text not null,
  message text not null,
  action_url text null,

  priority text not null default 'normal',
  status text not null default 'unread',

  created_at timestamptz not null default now(),
  read_at timestamptz null,
  archived_at timestamptz null,

  constraint user_notifications_priority_check
    check (priority in ('low', 'normal', 'high', 'critical')),

  constraint user_notifications_status_check
    check (status in ('unread', 'read', 'archived')),

  constraint user_notifications_company_id_not_nil
    check (company_id <> '00000000-0000-0000-0000-000000000000'::uuid),

  constraint user_notifications_title_not_blank
    check (length(trim(title)) > 0),

  constraint user_notifications_message_not_blank
    check (length(trim(message)) > 0),

  constraint user_notifications_event_type_not_blank
    check (length(trim(event_type)) > 0),

  constraint user_notifications_entity_type_not_blank
    check (length(trim(entity_type)) > 0)
);

create index if not exists idx_user_notifications_company_id
  on public.user_notifications(company_id);

create index if not exists idx_user_notifications_user_id
  on public.user_notifications(user_id);

create index if not exists idx_user_notifications_status
  on public.user_notifications(status);

create index if not exists idx_user_notifications_event_type
  on public.user_notifications(event_type);

create index if not exists idx_user_notifications_created_at_desc
  on public.user_notifications(created_at desc);

create index if not exists idx_user_notifications_user_status_created
  on public.user_notifications(user_id, status, created_at desc);

-- ----------------------------------------------------------------------------
-- 10) notification_preferences
-- ----------------------------------------------------------------------------
create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  user_id uuid null references auth.users(id) on delete cascade,

  event_type text not null,
  recipient_type text not null,

  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  whatsapp_enabled boolean not null default false,
  in_app_enabled boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint notification_preferences_recipient_type_check
    check (recipient_type in ('customer', 'user', 'admin', 'sales', 'finance', 'warehouse', 'supplier', 'system')),

  constraint notification_preferences_company_id_not_nil
    check (company_id <> '00000000-0000-0000-0000-000000000000'::uuid),

  constraint notification_preferences_event_type_not_blank
    check (length(trim(event_type)) > 0)
);

-- Repair existing notification_preferences table if it already exists with an older schema
alter table if exists public.notification_preferences
  add column if not exists company_id uuid,
  add column if not exists user_id uuid null references auth.users(id) on delete cascade,
  add column if not exists event_type text,
  add column if not exists recipient_type text,
  add column if not exists email_enabled boolean not null default true,
  add column if not exists sms_enabled boolean not null default false,
  add column if not exists whatsapp_enabled boolean not null default false,
  add column if not exists in_app_enabled boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_notification_preferences_company_user_event_recipient
  on public.notification_preferences(company_id, coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid), event_type, recipient_type);

create index if not exists idx_notification_preferences_company_id
  on public.notification_preferences(company_id);

create index if not exists idx_notification_preferences_user_id
  on public.notification_preferences(user_id);

create index if not exists idx_notification_preferences_event_type
  on public.notification_preferences(event_type);

drop trigger if exists trg_notification_preferences_updated_at
on public.notification_preferences;

create trigger trg_notification_preferences_updated_at
before update on public.notification_preferences
for each row
execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 11) notification_templates
-- ----------------------------------------------------------------------------
create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),

  company_id uuid null,

  template_key text not null,
  channel text not null,
  event_type text not null,
  language_code text not null default 'en',

  subject_template text null,
  body_template text not null,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint notification_templates_channel_check
    check (channel in ('email', 'sms', 'whatsapp', 'in_app')),

  constraint notification_templates_template_key_not_blank
    check (length(trim(template_key)) > 0),

  constraint notification_templates_event_type_not_blank
    check (length(trim(event_type)) > 0),

  constraint notification_templates_language_code_not_blank
    check (length(trim(language_code)) > 0),

  constraint notification_templates_body_template_not_blank
    check (length(trim(body_template)) > 0)
);

-- Repair existing notification_templates table if it already exists with an older schema
alter table if exists public.notification_templates
  add column if not exists company_id uuid,
  add column if not exists template_key text,
  add column if not exists channel text,
  add column if not exists event_type text,
  add column if not exists language_code text not null default 'en',
  add column if not exists subject_template text,
  add column if not exists body_template text,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_notification_templates_company_template_channel_lang
  on public.notification_templates(coalesce(company_id, '00000000-0000-0000-0000-000000000000'::uuid), template_key, channel, language_code);

create index if not exists idx_notification_templates_company_id
  on public.notification_templates(company_id);

create index if not exists idx_notification_templates_event_type
  on public.notification_templates(event_type);

create index if not exists idx_notification_templates_channel
  on public.notification_templates(channel);

create index if not exists idx_notification_templates_is_active
  on public.notification_templates(is_active);

drop trigger if exists trg_notification_templates_updated_at
on public.notification_templates;

create trigger trg_notification_templates_updated_at
before update on public.notification_templates
for each row
execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 12) Safe view: current user's unread notifications
-- ----------------------------------------------------------------------------
create or replace view public.v_my_unread_notifications as
select
  un.id,
  un.company_id,
  un.user_id,
  un.notification_log_id,
  un.event_type,
  un.entity_type,
  un.entity_id,
  un.title,
  un.message,
  un.action_url,
  un.priority,
  un.status,
  un.created_at,
  un.read_at,
  un.archived_at
from public.user_notifications un
where un.status = 'unread'
  and un.user_id = auth.uid();

-- ----------------------------------------------------------------------------
-- 13) Seed default templates
-- ----------------------------------------------------------------------------
-- Skipped for now because some environments already have a legacy
-- notification_templates schema with additional required columns
-- (for example: code). Seed templates after schema reconciliation.

-- ----------------------------------------------------------------------------
-- 14) Seed default notification preferences
-- ----------------------------------------------------------------------------
-- Skipped for now. Seed company/user notification preferences later from
-- an admin UI or Edge Function after tenant/company defaults are confirmed.

-- ----------------------------------------------------------------------------
-- 15) Enable RLS
-- ----------------------------------------------------------------------------
alter table public.notification_events enable row level security;
alter table public.notification_logs enable row level security;
alter table public.user_notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_templates enable row level security;

-- ----------------------------------------------------------------------------
-- 16) RLS: notification_events
-- ----------------------------------------------------------------------------
drop policy if exists notification_events_select_policy
on public.notification_events;

create policy notification_events_select_policy
on public.notification_events
for select
using (
  public.can_view_company_notifications(company_id)
);

drop policy if exists notification_events_insert_policy
on public.notification_events;

create policy notification_events_insert_policy
on public.notification_events
for insert
with check (
  public.current_user_is_platform_admin()
  or public.can_manage_company_notifications(company_id)
);

drop policy if exists notification_events_update_policy
on public.notification_events;

create policy notification_events_update_policy
on public.notification_events
for update
using (
  public.current_user_is_platform_admin()
)
with check (
  public.current_user_is_platform_admin()
);

drop policy if exists notification_events_delete_policy
on public.notification_events;

create policy notification_events_delete_policy
on public.notification_events
for delete
using (
  public.current_user_is_platform_admin()
);

-- ----------------------------------------------------------------------------
-- 17) RLS: notification_logs
-- ----------------------------------------------------------------------------
drop policy if exists notification_logs_select_policy
on public.notification_logs;

create policy notification_logs_select_policy
on public.notification_logs
for select
using (
  public.can_view_company_notifications(company_id)
);

drop policy if exists notification_logs_insert_policy
on public.notification_logs;

create policy notification_logs_insert_policy
on public.notification_logs
for insert
with check (
  public.current_user_is_platform_admin()
);

drop policy if exists notification_logs_update_policy
on public.notification_logs;

create policy notification_logs_update_policy
on public.notification_logs
for update
using (
  public.current_user_is_platform_admin()
)
with check (
  public.current_user_is_platform_admin()
);

drop policy if exists notification_logs_delete_policy
on public.notification_logs;

create policy notification_logs_delete_policy
on public.notification_logs
for delete
using (
  public.current_user_is_platform_admin()
);

-- ----------------------------------------------------------------------------
-- 18) RLS: user_notifications
-- ----------------------------------------------------------------------------
drop policy if exists user_notifications_select_policy
on public.user_notifications;

create policy user_notifications_select_policy
on public.user_notifications
for select
using (
  public.can_access_own_notification(user_id, company_id)
  or public.can_view_company_notifications(company_id)
);

drop policy if exists user_notifications_insert_policy
on public.user_notifications;

create policy user_notifications_insert_policy
on public.user_notifications
for insert
with check (
  public.current_user_is_platform_admin()
  or public.can_manage_company_notifications(company_id)
);

drop policy if exists user_notifications_update_policy
on public.user_notifications;

create policy user_notifications_update_policy
on public.user_notifications
for update
using (
  public.can_access_own_notification(user_id, company_id)
  or public.current_user_is_platform_admin()
)
with check (
  public.can_access_own_notification(user_id, company_id)
  or public.current_user_is_platform_admin()
);

drop policy if exists user_notifications_delete_policy
on public.user_notifications;

create policy user_notifications_delete_policy
on public.user_notifications
for delete
using (
  public.current_user_is_platform_admin()
);

-- ----------------------------------------------------------------------------
-- 19) RLS: notification_preferences
-- ----------------------------------------------------------------------------
drop policy if exists notification_preferences_select_policy
on public.notification_preferences;

create policy notification_preferences_select_policy
on public.notification_preferences
for select
using (
  (user_id is null and public.can_view_company_notifications(company_id))
  or (user_id = auth.uid() and public.current_company_id() = company_id)
  or public.current_user_is_platform_admin()
);

drop policy if exists notification_preferences_insert_policy
on public.notification_preferences;

create policy notification_preferences_insert_policy
on public.notification_preferences
for insert
with check (
  (user_id is null and public.can_manage_company_notifications(company_id))
  or (user_id = auth.uid() and public.current_company_id() = company_id)
  or public.current_user_is_platform_admin()
);

drop policy if exists notification_preferences_update_policy
on public.notification_preferences;

create policy notification_preferences_update_policy
on public.notification_preferences
for update
using (
  (user_id is null and public.can_manage_company_notifications(company_id))
  or (user_id = auth.uid() and public.current_company_id() = company_id)
  or public.current_user_is_platform_admin()
)
with check (
  (user_id is null and public.can_manage_company_notifications(company_id))
  or (user_id = auth.uid() and public.current_company_id() = company_id)
  or public.current_user_is_platform_admin()
);

drop policy if exists notification_preferences_delete_policy
on public.notification_preferences;

create policy notification_preferences_delete_policy
on public.notification_preferences
for delete
using (
  (user_id is null and public.can_manage_company_notifications(company_id))
  or (user_id = auth.uid() and public.current_company_id() = company_id)
  or public.current_user_is_platform_admin()
);

-- ----------------------------------------------------------------------------
-- 20) RLS: notification_templates
-- ----------------------------------------------------------------------------
drop policy if exists notification_templates_select_policy
on public.notification_templates;

create policy notification_templates_select_policy
on public.notification_templates
for select
using (
  company_id is null
  or public.can_view_company_notifications(company_id)
);

drop policy if exists notification_templates_insert_policy
on public.notification_templates;

create policy notification_templates_insert_policy
on public.notification_templates
for insert
with check (
  public.current_user_is_platform_admin()
  or (company_id is not null and public.can_manage_company_notifications(company_id))
);

drop policy if exists notification_templates_update_policy
on public.notification_templates;

create policy notification_templates_update_policy
on public.notification_templates
for update
using (
  public.current_user_is_platform_admin()
  or (company_id is not null and public.can_manage_company_notifications(company_id))
)
with check (
  public.current_user_is_platform_admin()
  or (company_id is not null and public.can_manage_company_notifications(company_id))
);

drop policy if exists notification_templates_delete_policy
on public.notification_templates;

create policy notification_templates_delete_policy
on public.notification_templates
for delete
using (
  public.current_user_is_platform_admin()
  or (company_id is not null and public.can_manage_company_notifications(company_id))
);

-- ----------------------------------------------------------------------------
-- 21) Grants
-- ----------------------------------------------------------------------------
grant select on public.v_my_unread_notifications to authenticated;

-- ----------------------------------------------------------------------------
-- 22) Comments
-- ----------------------------------------------------------------------------
comment on table public.notification_events is
'Business notification events emitted by Seedlink workflows such as order creation, payment received, and cancellation.';

comment on table public.notification_logs is
'Per-channel delivery logs for notification events across email, sms, whatsapp, and in-app.';

comment on table public.user_notifications is
'In-app notifications for logged-in users, shown in notification bell and profile pages.';

comment on table public.notification_preferences is
'Company-level and optional user-level notification channel preferences by event type and recipient type.';

comment on table public.notification_templates is
'Template registry for email, sms, whatsapp, and in-app notifications.';

comment on view public.v_my_unread_notifications is
'Unread in-app notifications for the currently authenticated user.';

commit;
