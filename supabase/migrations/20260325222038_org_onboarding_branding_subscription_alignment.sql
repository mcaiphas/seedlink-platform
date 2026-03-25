create or replace function public.user_is_org_admin(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = _org_id
      and om.user_id = auth.uid()
      and coalesce(om.is_active, true) = true
      and om.membership_role in ('owner', 'admin', 'super_admin')
  );
$$;

-- =========================================================
-- org_onboarding_branding_subscription_alignment
-- =========================================================

-- ---------------------------------------------------------
-- 1. Organizations: representative fields
-- ---------------------------------------------------------
alter table public.organizations
  add column if not exists representative_name text,
  add column if not exists representative_email text,
  add column if not exists representative_phone text;

-- ---------------------------------------------------------
-- 2. Update onboard_organization(...)
-- - supports representative fields
-- - auto-generates org_code if missing
-- ---------------------------------------------------------
create or replace function public.onboard_organization(
  p_name text,
  p_org_code text default null,
  p_organization_type text default 'company',
  p_country_code text default 'ZA',
  p_email text default null,
  p_phone text default null,
  p_currency_code text default 'ZAR',
  p_owner_user_id uuid default null,
  p_representative_name text default null,
  p_representative_email text default null,
  p_representative_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_admin_role_id uuid;
  v_org_code text;
begin
  v_org_code :=
    coalesce(
      nullif(trim(p_org_code), ''),
      upper(left(regexp_replace(coalesce(p_name, 'ORG'), '[^A-Za-z0-9]', '', 'g'), 3))
      || '-'
      || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 5))
    );

  insert into public.organizations (
    name,
    slug,
    organization_type,
    country_code,
    created_by,
    org_code,
    email,
    phone,
    currency_code,
    is_active,
    representative_name,
    representative_email,
    representative_phone
  )
  values (
    p_name,
    lower(regexp_replace(trim(p_name), '\s+', '-', 'g')) || '-' || substring(gen_random_uuid()::text, 1, 8),
    p_organization_type,
    p_country_code,
    p_owner_user_id,
    v_org_code,
    p_email,
    p_phone,
    p_currency_code,
    true,
    p_representative_name,
    p_representative_email,
    p_representative_phone
  )
  returning id into v_org_id;

  insert into public.organization_branding (
    organization_id,
    company_name,
    country_code,
    email,
    phone
  )
  values (
    v_org_id,
    p_name,
    p_country_code,
    p_email,
    p_phone
  )
  on conflict (organization_id) do nothing;

  insert into public.org_doc_number_sequences (organization_id, doc_type, prefix, last_number) values
    (v_org_id, 'invoice',  'INV', 0),
    (v_org_id, 'quote',    'QT',  0),
    (v_org_id, 'proforma', 'PFI', 0),
    (v_org_id, 'statement','STM', 0)
  on conflict (organization_id, doc_type) do nothing;

  if p_owner_user_id is not null then
    update public.profiles
    set organization_id = v_org_id,
        updated_at = now()
    where id = p_owner_user_id;

    select id into v_admin_role_id
    from public.roles
    where name = 'admin'
    limit 1;

    if v_admin_role_id is not null then
      insert into public.user_role_assignments (
        user_id,
        role_id,
        organization_id,
        assigned_by,
        is_active
      )
      values (
        p_owner_user_id,
        v_admin_role_id,
        v_org_id,
        p_owner_user_id,
        true
      )
      on conflict do nothing;
    end if;
  end if;

  return v_org_id;
end;
$$;

create or replace function public.user_belongs_to_org(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = _org_id
      and om.user_id = auth.uid()
      and coalesce(om.is_active, true) = true
  );
$$;

-- ---------------------------------------------------------
-- 3. Storage bucket for organization logos
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('organization-logos', 'organization-logos', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 4. Safe storage policies for organization logos
-- Upload path format must be:
-- organizations/{organization_id}/logo/{filename}
-- ---------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'org logos public read'
  ) then
    create policy "org logos public read"
    on storage.objects
    for select
    to public
    using (bucket_id = 'organization-logos');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'org admins upload own logo'
  ) then
    create policy "org admins upload own logo"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'organization-logos'
      and (storage.foldername(name))[1] = 'organizations'
      and user_is_org_admin(((storage.foldername(name))[2])::uuid)
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'org admins update own logo'
  ) then
    create policy "org admins update own logo"
    on storage.objects
    for update
    to authenticated
    using (
      bucket_id = 'organization-logos'
      and (storage.foldername(name))[1] = 'organizations'
      and user_is_org_admin(((storage.foldername(name))[2])::uuid)
    )
    with check (
      bucket_id = 'organization-logos'
      and (storage.foldername(name))[1] = 'organizations'
      and user_is_org_admin(((storage.foldername(name))[2])::uuid)
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'org admins delete own logo'
  ) then
    create policy "org admins delete own logo"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'organization-logos'
      and (storage.foldername(name))[1] = 'organizations'
      and user_is_org_admin(((storage.foldername(name))[2])::uuid)
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'superadmin manage all org logos'
  ) then
    create policy "superadmin manage all org logos"
    on storage.objects
    for all
    to authenticated
    using (
      bucket_id = 'organization-logos'
      and public.is_admin()
    )
    with check (
      bucket_id = 'organization-logos'
      and public.is_admin()
    );
  end if;
end
$$;

-- ---------------------------------------------------------
-- 5. subscription_plans
-- ---------------------------------------------------------
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text,
  price numeric(12,2) not null default 0,
  billing_frequency text not null default 'monthly',
  is_active boolean not null default true,
  can_buy_inputs boolean not null default false,
  can_sell_products boolean not null default false,
  can_access_courses boolean not null default false,
  can_issue_documents boolean not null default false,
  can_use_marketplace boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscription_plans_billing_frequency_check
    check (billing_frequency in ('monthly', 'quarterly', 'annual', 'once_off'))
);

alter table public.subscription_plans enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'subscription_plans'
      and policyname = 'subscription_plans_read_authenticated'
  ) then
    create policy "subscription_plans_read_authenticated"
    on public.subscription_plans
    for select
    to authenticated
    using (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'subscription_plans'
      and policyname = 'subscription_plans_manage_admin'
  ) then
    create policy "subscription_plans_manage_admin"
    on public.subscription_plans
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());
  end if;
end
$$;

-- ---------------------------------------------------------
-- 6. organization_subscriptions
-- ---------------------------------------------------------
create table if not exists public.organization_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subscription_plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  status text not null default 'active',
  start_date date not null default current_date,
  end_date date,
  trial_end_date date,
  auto_renew boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_subscriptions_status_check
    check (status in ('trial', 'active', 'past_due', 'suspended', 'cancelled', 'expired'))
);

create index if not exists idx_org_subscriptions_org_id
  on public.organization_subscriptions(organization_id);

create index if not exists idx_org_subscriptions_plan_id
  on public.organization_subscriptions(subscription_plan_id);

alter table public.organization_subscriptions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'organization_subscriptions'
      and policyname = 'org_subscriptions_select_own_or_admin'
  ) then
    create policy "org_subscriptions_select_own_or_admin"
    on public.organization_subscriptions
    for select
    to authenticated
    using (
      user_belongs_to_org(organization_id)
      or public.is_admin()
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'organization_subscriptions'
      and policyname = 'org_subscriptions_manage_admin'
  ) then
    create policy "org_subscriptions_manage_admin"
    on public.organization_subscriptions
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());
  end if;
end
$$;

-- ---------------------------------------------------------
-- 7. Sync helper from active subscription to organizations
-- ---------------------------------------------------------
create or replace function public.sync_organization_subscription_summary(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_plan_code text;
begin
  select os.status, sp.code
  into v_status, v_plan_code
  from public.organization_subscriptions os
  join public.subscription_plans sp
    on sp.id = os.subscription_plan_id
  where os.organization_id = p_organization_id
  order by os.created_at desc
  limit 1;

  update public.organizations
  set subscription_plan = v_plan_code,
      subscription_status = v_status,
      can_buy_inputs = coalesce((
        select sp.can_buy_inputs
        from public.organization_subscriptions os
        join public.subscription_plans sp on sp.id = os.subscription_plan_id
        where os.organization_id = p_organization_id
        order by os.created_at desc
        limit 1
      ), false),
      can_sell_products = coalesce((
        select sp.can_sell_products
        from public.organization_subscriptions os
        join public.subscription_plans sp on sp.id = os.subscription_plan_id
        where os.organization_id = p_organization_id
        order by os.created_at desc
        limit 1
      ), false),
      can_access_courses = coalesce((
        select sp.can_access_courses
        from public.organization_subscriptions os
        join public.subscription_plans sp on sp.id = os.subscription_plan_id
        where os.organization_id = p_organization_id
        order by os.created_at desc
        limit 1
      ), false),
      can_issue_documents = coalesce((
        select sp.can_issue_documents
        from public.organization_subscriptions os
        join public.subscription_plans sp on sp.id = os.subscription_plan_id
        where os.organization_id = p_organization_id
        order by os.created_at desc
        limit 1
      ), false),
      can_use_marketplace = coalesce((
        select sp.can_use_marketplace
        from public.organization_subscriptions os
        join public.subscription_plans sp on sp.id = os.subscription_plan_id
        where os.organization_id = p_organization_id
        order by os.created_at desc
        limit 1
      ), false),
      updated_at = now()
  where id = p_organization_id;
end;
$$;
