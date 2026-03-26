-- =========================================================
-- Seedlink RBAC v1
-- Roles, permissions, helper functions, and default mappings
-- =========================================================

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- 1) ROLES
-- =========================================================

alter table public.roles
  add column if not exists scope text;

update public.roles
set scope = case
  when name in ('super_admin', 'platform_admin', 'platform_support', 'platform_finance', 'platform_analytics')
    then 'platform'
  else 'organization'
end
where scope is null;

alter table public.roles
  alter column scope set default 'organization';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'roles_scope_check'
  ) then
    alter table public.roles
      add constraint roles_scope_check
      check (scope in ('platform', 'organization'));
  end if;
end
$$;

-- Seed / normalize system roles
insert into public.roles (id, name, description, scope, is_system_role, created_at, updated_at)
values
  (gen_random_uuid(), 'super_admin',        'Full platform control across all organizations', 'platform', true, now(), now()),
  (gen_random_uuid(), 'platform_admin',     'Platform-wide administration',                   'platform', true, now(), now()),
  (gen_random_uuid(), 'platform_support',   'Platform support operations',                    'platform', true, now(), now()),
  (gen_random_uuid(), 'platform_finance',   'Platform billing and finance operations',        'platform', true, now(), now()),
  (gen_random_uuid(), 'platform_analytics', 'Platform analytics and reporting',               'platform', true, now(), now()),

  (gen_random_uuid(), 'org_owner',          'Organization owner',                             'organization', true, now(), now()),
  (gen_random_uuid(), 'org_admin',          'Organization administrator',                     'organization', true, now(), now()),
  (gen_random_uuid(), 'org_manager',        'Organization manager',                           'organization', true, now(), now()),
  (gen_random_uuid(), 'sales_manager',      'Sales manager',                                  'organization', true, now(), now()),
  (gen_random_uuid(), 'sales_rep',          'Sales representative',                           'organization', true, now(), now()),
  (gen_random_uuid(), 'procurement_manager','Procurement manager',                            'organization', true, now(), now()),
  (gen_random_uuid(), 'inventory_manager',  'Inventory manager',                              'organization', true, now(), now()),
  (gen_random_uuid(), 'finance_manager',    'Finance manager',                                'organization', true, now(), now()),
  (gen_random_uuid(), 'advisor',            'Advisor / agronomy advisor',                     'organization', true, now(), now()),
  (gen_random_uuid(), 'trainer',            'Trainer / learning facilitator',                 'organization', true, now(), now()),
  (gen_random_uuid(), 'logistics_manager',  'Logistics manager',                              'organization', true, now(), now()),
  (gen_random_uuid(), 'dispatcher',         'Shipment dispatcher',                            'organization', true, now(), now()),
  (gen_random_uuid(), 'driver',             'Driver',                                         'organization', true, now(), now()),
  (gen_random_uuid(), 'customer_service',   'Customer service',                               'organization', true, now(), now()),
  (gen_random_uuid(), 'viewer',             'Read-only viewer',                               'organization', true, now(), now())
on conflict (name) do update
set
  description = excluded.description,
  scope = excluded.scope,
  is_system_role = excluded.is_system_role,
  updated_at = now();

-- Backward compatibility aliases if you still use these names in parts of the system
insert into public.roles (id, name, description, scope, is_system_role, created_at, updated_at)
values
  (gen_random_uuid(), 'admin',              'Legacy admin role (mapped as organization role)', 'organization', true, now(), now()),
  (gen_random_uuid(), 'farmer',             'Legacy farmer role',                               'organization', true, now(), now()),
  (gen_random_uuid(), 'supplier',           'Legacy supplier role',                             'organization', true, now(), now()),
  (gen_random_uuid(), 'buyer',              'Legacy buyer role',                                'organization', true, now(), now()),
  (gen_random_uuid(), 'logistics_partner',  'Legacy logistics partner role',                    'organization', true, now(), now())
on conflict (name) do update
set
  description = excluded.description,
  scope = excluded.scope,
  is_system_role = excluded.is_system_role,
  updated_at = now();

-- =========================================================
-- 2) PERMISSIONS
-- =========================================================

insert into public.permissions (id, code, module, description, created_at, updated_at)
values
  -- org / setup
  (gen_random_uuid(), 'org:view',                 'organization', 'View organization details',                     now(), now()),
  (gen_random_uuid(), 'org:create',               'organization', 'Create organizations',                           now(), now()),
  (gen_random_uuid(), 'org:update',               'organization', 'Update organization details',                    now(), now()),
  (gen_random_uuid(), 'org:delete',               'organization', 'Delete organizations',                           now(), now()),
  (gen_random_uuid(), 'org:manage_branding',      'organization', 'Manage organization branding and logos',         now(), now()),
  (gen_random_uuid(), 'org:manage_users',         'organization', 'Manage organization users and memberships',      now(), now()),
  (gen_random_uuid(), 'org:manage_roles',         'organization', 'Assign organization roles',                      now(), now()),
  (gen_random_uuid(), 'org:manage_settings',      'organization', 'Manage organization settings',                   now(), now()),
  (gen_random_uuid(), 'org:view_subscriptions',   'organization', 'View organization subscriptions',                now(), now()),
  (gen_random_uuid(), 'org:manage_subscriptions', 'organization', 'Manage organization subscriptions',              now(), now()),

  -- products / catalog
  (gen_random_uuid(), 'products:view',            'products',     'View products',                                  now(), now()),
  (gen_random_uuid(), 'products:create',          'products',     'Create products',                                now(), now()),
  (gen_random_uuid(), 'products:update',          'products',     'Update products',                                now(), now()),
  (gen_random_uuid(), 'products:delete',          'products',     'Delete products',                                now(), now()),
  (gen_random_uuid(), 'products:import',          'products',     'Import products',                                now(), now()),
  (gen_random_uuid(), 'products:export',          'products',     'Export products',                                now(), now()),
  (gen_random_uuid(), 'products:publish',         'products',     'Publish products',                               now(), now()),
  (gen_random_uuid(), 'categories:view',          'products',     'View categories',                                now(), now()),
  (gen_random_uuid(), 'categories:manage',        'products',     'Manage categories and subcategories',            now(), now()),
  (gen_random_uuid(), 'pricing:view',             'products',     'View pricing',                                   now(), now()),
  (gen_random_uuid(), 'pricing:manage',           'products',     'Manage pricing',                                 now(), now()),

  -- sales / orders
  (gen_random_uuid(), 'quotes:view',              'sales',        'View quotes',                                    now(), now()),
  (gen_random_uuid(), 'quotes:create',            'sales',        'Create quotes',                                  now(), now()),
  (gen_random_uuid(), 'quotes:update',            'sales',        'Update quotes',                                  now(), now()),
  (gen_random_uuid(), 'quotes:approve',           'sales',        'Approve quotes',                                 now(), now()),
  (gen_random_uuid(), 'proformas:view',           'sales',        'View proforma invoices',                         now(), now()),
  (gen_random_uuid(), 'proformas:create',         'sales',        'Create proforma invoices',                       now(), now()),
  (gen_random_uuid(), 'proformas:update',         'sales',        'Update proforma invoices',                       now(), now()),
  (gen_random_uuid(), 'sales_orders:view',        'sales',        'View sales orders',                              now(), now()),
  (gen_random_uuid(), 'sales_orders:create',      'sales',        'Create sales orders',                            now(), now()),
  (gen_random_uuid(), 'sales_orders:update',      'sales',        'Update sales orders',                            now(), now()),
  (gen_random_uuid(), 'sales_orders:approve',     'sales',        'Approve sales orders',                           now(), now()),
  (gen_random_uuid(), 'sales_orders:cancel',      'sales',        'Cancel sales orders',                            now(), now()),
  (gen_random_uuid(), 'customers:view',           'sales',        'View customers',                                 now(), now()),
  (gen_random_uuid(), 'customers:manage',         'sales',        'Manage customers',                               now(), now()),

  -- procurement
  (gen_random_uuid(), 'suppliers:view',           'procurement',  'View suppliers',                                 now(), now()),
  (gen_random_uuid(), 'suppliers:manage',         'procurement',  'Manage suppliers',                               now(), now()),
  (gen_random_uuid(), 'purchase_orders:view',     'procurement',  'View purchase orders',                           now(), now()),
  (gen_random_uuid(), 'purchase_orders:create',   'procurement',  'Create purchase orders',                         now(), now()),
  (gen_random_uuid(), 'purchase_orders:update',   'procurement',  'Update purchase orders',                         now(), now()),
  (gen_random_uuid(), 'purchase_orders:approve',  'procurement',  'Approve purchase orders',                        now(), now()),
  (gen_random_uuid(), 'goods_receipts:view',      'procurement',  'View goods receipts',                            now(), now()),
  (gen_random_uuid(), 'goods_receipts:create',    'procurement',  'Create goods receipts',                          now(), now()),

  -- inventory
  (gen_random_uuid(), 'inventory:view',           'inventory',    'View inventory',                                 now(), now()),
  (gen_random_uuid(), 'inventory:adjust',         'inventory',    'Adjust inventory',                               now(), now()),
  (gen_random_uuid(), 'inventory:transfer',       'inventory',    'Transfer inventory',                             now(), now()),
  (gen_random_uuid(), 'depots:view',              'inventory',    'View depots',                                    now(), now()),
  (gen_random_uuid(), 'depots:manage',            'inventory',    'Manage depots',                                  now(), now()),
  (gen_random_uuid(), 'stock_counts:manage',      'inventory',    'Manage stock counts',                            now(), now()),

  -- finance
  (gen_random_uuid(), 'invoices:view',            'finance',      'View invoices',                                  now(), now()),
  (gen_random_uuid(), 'invoices:create',          'finance',      'Create invoices',                                now(), now()),
  (gen_random_uuid(), 'payments:view',            'finance',      'View payments',                                  now(), now()),
  (gen_random_uuid(), 'payments:manage',          'finance',      'Manage payments',                                now(), now()),
  (gen_random_uuid(), 'credit_control:view',      'finance',      'View credit control',                            now(), now()),
  (gen_random_uuid(), 'credit_control:manage',    'finance',      'Manage credit control',                          now(), now()),
  (gen_random_uuid(), 'journal_entries:view',     'finance',      'View journal entries',                           now(), now()),
  (gen_random_uuid(), 'journal_entries:manage',   'finance',      'Manage journal entries',                         now(), now()),
  (gen_random_uuid(), 'finance_reports:view',     'finance',      'View finance reports',                           now(), now()),

  -- training / advisory
  (gen_random_uuid(), 'courses:view',             'training',     'View courses',                                   now(), now()),
  (gen_random_uuid(), 'courses:create',           'training',     'Create courses',                                 now(), now()),
  (gen_random_uuid(), 'courses:update',           'training',     'Update courses',                                 now(), now()),
  (gen_random_uuid(), 'courses:publish',          'training',     'Publish courses',                                now(), now()),
  (gen_random_uuid(), 'advisory:view',            'advisory',     'View advisory items',                            now(), now()),
  (gen_random_uuid(), 'advisory:create',          'advisory',     'Create advisory items',                          now(), now()),
  (gen_random_uuid(), 'advisory:update',          'advisory',     'Update advisory items',                          now(), now()),
  (gen_random_uuid(), 'advisory:execute_ai',      'advisory',     'Execute AI advisory tools',                      now(), now()),

  -- logistics / drovvi
  (gen_random_uuid(), 'shipments:view',           'logistics',    'View shipments',                                 now(), now()),
  (gen_random_uuid(), 'shipments:create',         'logistics',    'Create shipments',                               now(), now()),
  (gen_random_uuid(), 'shipments:update',         'logistics',    'Update shipments',                               now(), now()),
  (gen_random_uuid(), 'shipments:assign',         'logistics',    'Assign shipments',                               now(), now()),
  (gen_random_uuid(), 'shipments:track',          'logistics',    'Track shipments',                                now(), now()),
  (gen_random_uuid(), 'drivers:view',             'logistics',    'View drivers',                                   now(), now()),
  (gen_random_uuid(), 'drivers:manage',           'logistics',    'Manage drivers',                                 now(), now()),
  (gen_random_uuid(), 'vehicles:view',            'logistics',    'View vehicles',                                  now(), now()),
  (gen_random_uuid(), 'vehicles:manage',          'logistics',    'Manage vehicles',                                now(), now()),
  (gen_random_uuid(), 'dispatch:manage',          'logistics',    'Manage dispatch operations',                     now(), now()),

  -- reporting / analytics
  (gen_random_uuid(), 'reports:view',             'analytics',    'View reports',                                   now(), now()),
  (gen_random_uuid(), 'analytics:view',           'analytics',    'View analytics dashboards',                      now(), now()),
  (gen_random_uuid(), 'analytics:export',         'analytics',    'Export analytics and reports',                   now(), now()),

  -- notifications / communications
  (gen_random_uuid(), 'notifications:view',       'communications','View notifications',                           now(), now()),
  (gen_random_uuid(), 'notifications:send',       'communications','Send notifications',                           now(), now()),
  (gen_random_uuid(), 'communications:manage',    'communications','Manage communication channels/templates',      now(), now())
on conflict (code) do update
set
  module = excluded.module,
  description = excluded.description,
  updated_at = now();

-- =========================================================
-- 3) DEFAULT ROLE → PERMISSION MAPPINGS
-- =========================================================

-- helper CTEs for easier mapping
with role_map as (
  select id, name from public.roles
),
permission_map as (
  select id, code from public.permissions
),
role_permission_seed as (
  select 'super_admin' as role_name, p.code
  from public.permissions p

  union all
  select 'platform_admin', p.code
  from public.permissions p
  where p.code not in ('org:delete')

  union all
  select 'platform_support', unnest(array[
    'org:view',
    'org:manage_users',
    'org:manage_branding',
    'products:view',
    'quotes:view',
    'sales_orders:view',
    'customers:view',
    'shipments:view',
    'drivers:view',
    'vehicles:view',
    'notifications:view',
    'reports:view'
  ])

  union all
  select 'platform_finance', unnest(array[
    'org:view_subscriptions',
    'org:manage_subscriptions',
    'invoices:view',
    'payments:view',
    'payments:manage',
    'credit_control:view',
    'credit_control:manage',
    'finance_reports:view',
    'reports:view',
    'analytics:view',
    'analytics:export'
  ])

  union all
  select 'platform_analytics', unnest(array[
    'reports:view',
    'analytics:view',
    'analytics:export'
  ])

  union all
  select 'org_owner', unnest(array[
    'org:view','org:update','org:manage_branding','org:manage_users','org:manage_roles','org:manage_settings','org:view_subscriptions',
    'products:view','products:create','products:update','products:delete','products:import','products:export','products:publish',
    'categories:view','categories:manage','pricing:view','pricing:manage',
    'quotes:view','quotes:create','quotes:update','quotes:approve',
    'proformas:view','proformas:create','proformas:update',
    'sales_orders:view','sales_orders:create','sales_orders:update','sales_orders:approve','sales_orders:cancel',
    'customers:view','customers:manage',
    'suppliers:view','suppliers:manage','purchase_orders:view','purchase_orders:create','purchase_orders:update','purchase_orders:approve',
    'goods_receipts:view','goods_receipts:create',
    'inventory:view','inventory:adjust','inventory:transfer','depots:view','depots:manage','stock_counts:manage',
    'invoices:view','invoices:create','payments:view','payments:manage','credit_control:view','credit_control:manage',
    'journal_entries:view','journal_entries:manage','finance_reports:view',
    'courses:view','courses:create','courses:update','courses:publish',
    'advisory:view','advisory:create','advisory:update','advisory:execute_ai',
    'shipments:view','shipments:create','shipments:update','shipments:assign','shipments:track',
    'drivers:view','drivers:manage','vehicles:view','vehicles:manage','dispatch:manage',
    'reports:view','analytics:view','analytics:export',
    'notifications:view','notifications:send','communications:manage'
  ])

  union all
  select 'org_admin', unnest(array[
    'org:view','org:update','org:manage_branding','org:manage_users','org:manage_roles','org:manage_settings','org:view_subscriptions',
    'products:view','products:create','products:update','products:import','products:export','products:publish',
    'categories:view','categories:manage','pricing:view','pricing:manage',
    'quotes:view','quotes:create','quotes:update','quotes:approve',
    'proformas:view','proformas:create','proformas:update',
    'sales_orders:view','sales_orders:create','sales_orders:update','sales_orders:approve','sales_orders:cancel',
    'customers:view','customers:manage',
    'suppliers:view','suppliers:manage','purchase_orders:view','purchase_orders:create','purchase_orders:update','purchase_orders:approve',
    'goods_receipts:view','goods_receipts:create',
    'inventory:view','inventory:adjust','inventory:transfer','depots:view','depots:manage','stock_counts:manage',
    'invoices:view','invoices:create','payments:view','payments:manage','credit_control:view','credit_control:manage',
    'journal_entries:view','journal_entries:manage','finance_reports:view',
    'courses:view','courses:create','courses:update','courses:publish',
    'advisory:view','advisory:create','advisory:update','advisory:execute_ai',
    'shipments:view','shipments:create','shipments:update','shipments:assign','shipments:track',
    'drivers:view','drivers:manage','vehicles:view','vehicles:manage','dispatch:manage',
    'reports:view','analytics:view','analytics:export',
    'notifications:view','notifications:send','communications:manage'
  ])

  union all
  select 'org_manager', unnest(array[
    'org:view',
    'products:view','products:create','products:update','products:import','products:export',
    'categories:view','pricing:view',
    'quotes:view','quotes:create','quotes:update',
    'proformas:view','proformas:create','proformas:update',
    'sales_orders:view','sales_orders:create','sales_orders:update',
    'customers:view','customers:manage',
    'suppliers:view','purchase_orders:view',
    'inventory:view','depots:view',
    'invoices:view','payments:view',
    'courses:view',
    'advisory:view',
    'shipments:view','shipments:track',
    'reports:view','analytics:view',
    'notifications:view'
  ])

  union all
  select 'sales_manager', unnest(array[
    'products:view','products:export','pricing:view','pricing:manage',
    'quotes:view','quotes:create','quotes:update','quotes:approve',
    'proformas:view','proformas:create','proformas:update',
    'sales_orders:view','sales_orders:create','sales_orders:update','sales_orders:approve',
    'customers:view','customers:manage',
    'reports:view','analytics:view',
    'notifications:view','notifications:send'
  ])

  union all
  select 'sales_rep', unnest(array[
    'products:view','pricing:view',
    'quotes:view','quotes:create','quotes:update',
    'proformas:view','proformas:create','proformas:update',
    'sales_orders:view','sales_orders:create','sales_orders:update',
    'customers:view','customers:manage',
    'notifications:view'
  ])

  union all
  select 'procurement_manager', unnest(array[
    'products:view',
    'suppliers:view','suppliers:manage',
    'purchase_orders:view','purchase_orders:create','purchase_orders:update','purchase_orders:approve',
    'goods_receipts:view','goods_receipts:create',
    'inventory:view',
    'reports:view'
  ])

  union all
  select 'inventory_manager', unnest(array[
    'products:view','categories:view',
    'inventory:view','inventory:adjust','inventory:transfer',
    'depots:view','depots:manage',
    'stock_counts:manage',
    'reports:view'
  ])

  union all
  select 'finance_manager', unnest(array[
    'quotes:view','proformas:view','sales_orders:view',
    'invoices:view','invoices:create',
    'payments:view','payments:manage',
    'credit_control:view','credit_control:manage',
    'journal_entries:view','journal_entries:manage',
    'finance_reports:view','reports:view','analytics:view'
  ])

  union all
  select 'advisor', unnest(array[
    'advisory:view','advisory:create','advisory:update','advisory:execute_ai',
    'courses:view',
    'reports:view'
  ])

  union all
  select 'trainer', unnest(array[
    'courses:view','courses:create','courses:update','courses:publish',
    'advisory:view'
  ])

  union all
  select 'logistics_manager', unnest(array[
    'shipments:view','shipments:create','shipments:update','shipments:assign','shipments:track',
    'drivers:view','drivers:manage',
    'vehicles:view','vehicles:manage',
    'dispatch:manage',
    'reports:view','analytics:view'
  ])

  union all
  select 'dispatcher', unnest(array[
    'shipments:view','shipments:create','shipments:update','shipments:assign','shipments:track',
    'drivers:view',
    'vehicles:view',
    'dispatch:manage'
  ])

  union all
  select 'driver', unnest(array[
    'shipments:view','shipments:update','shipments:track'
  ])

  union all
  select 'customer_service', unnest(array[
    'customers:view','customers:manage',
    'quotes:view',
    'proformas:view',
    'sales_orders:view',
    'notifications:view','notifications:send'
  ])

  union all
  select 'viewer', unnest(array[
    'org:view',
    'products:view',
    'categories:view',
    'quotes:view',
    'proformas:view',
    'sales_orders:view',
    'customers:view',
    'suppliers:view',
    'inventory:view',
    'depots:view',
    'invoices:view',
    'payments:view',
    'courses:view',
    'advisory:view',
    'shipments:view','shipments:track',
    'reports:view','analytics:view',
    'notifications:view'
  ])
)
insert into public.role_permissions (id, role_id, permission_id, created_at)
select
  gen_random_uuid(),
  r.id,
  p.id,
  now()
from role_permission_seed s
join role_map r on r.name = s.role_name
join permission_map p on p.code = s.code
on conflict (role_id, permission_id) do nothing;

-- =========================================================
-- 4) MEMBERSHIP / ROLE ASSIGNMENT NORMALIZATION
-- =========================================================

-- unique index already likely exists; keep if present
create unique index if not exists idx_user_role_assignments_unique
on public.user_role_assignments (user_id, role_id, organization_id);

-- assign role rows updated_at trigger if missing
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_user_role_assignments_updated_at'
  ) then
    create trigger trg_user_role_assignments_updated_at
    before update on public.user_role_assignments
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

-- =========================================================
-- 5) HELPER FUNCTIONS
-- =========================================================

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

create or replace function public.user_has_role(
  p_user_id uuid,
  p_role_name text,
  p_org_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    where ura.user_id = p_user_id
      and ura.is_active = true
      and r.name = p_role_name
      and (
        (p_org_id is null and ura.organization_id is null)
        or ura.organization_id = p_org_id
      )
  );
$$;

create or replace function public.current_user_has_role(
  p_role_name text,
  p_org_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_role(auth.uid(), p_role_name, p_org_id);
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.user_has_role(auth.uid(), 'super_admin', null)
    or public.user_has_role(auth.uid(), 'platform_admin', null);
$$;

create or replace function public.user_has_permission(
  p_permission text,
  p_org_id uuid default null,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where ura.user_id = p_user_id
      and ura.is_active = true
      and p.code = p_permission
      and (
        ura.organization_id = p_org_id
        or ura.organization_id is null
      )
  );
$$;

create or replace function public.current_user_has_permission(
  p_permission text,
  p_org_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_permission(p_permission, p_org_id, auth.uid());
$$;

-- =========================================================
-- 6) OPTIONAL BACKWARD-COMPATIBILITY GRANTS / MAPPINGS
-- =========================================================

-- If you still rely on organization_members.membership_role = admin/owner,
-- mirror that to RBAC helper-friendly roles via a bootstrap insert.

insert into public.user_role_assignments (
  id, user_id, role_id, organization_id, assigned_by, is_active, created_at, updated_at
)
select
  gen_random_uuid(),
  om.user_id,
  r.id,
  om.organization_id,
  om.user_id,
  true,
  now(),
  now()
from public.organization_members om
join public.roles r
  on r.name = case
    when om.membership_role = 'owner' then 'org_owner'
    when om.membership_role = 'admin' then 'org_admin'
    else 'viewer'
  end
where coalesce(om.is_active, true) = true
on conflict (user_id, role_id, organization_id) do nothing;

-- If legacy role name 'admin' is still used heavily, map it close to org_admin
insert into public.role_permissions (id, role_id, permission_id, created_at)
select
  gen_random_uuid(),
  legacy_role.id,
  rp.permission_id,
  now()
from public.roles legacy_role
join public.roles org_admin_role on org_admin_role.name = 'org_admin'
join public.role_permissions rp on rp.role_id = org_admin_role.id
where legacy_role.name = 'admin'
on conflict (role_id, permission_id) do nothing;

commit;
