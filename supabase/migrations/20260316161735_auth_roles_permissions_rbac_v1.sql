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
-- 1) ROLES
-- uses existing roles table if present, otherwise creates it
-- =========================================================
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_system_role boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.roles
  add column if not exists description text,
  add column if not exists is_system_role boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists trg_roles_updated_at on public.roles;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_roles_updated_at
before') then create trigger trg_roles_updated_at
before update on public.roles
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 2) PERMISSIONS
-- =========================================================
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  module text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.permissions
  add column if not exists name text;

create index if not exists idx_permissions_module
  on public.permissions(module);

drop trigger if exists trg_permissions_updated_at on public.permissions;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_permissions_updated_at
before') then create trigger trg_permissions_updated_at
before update on public.permissions
for each row
 execute function public.set_updated_at(); end if; end
$$;

-- =========================================================
-- 3) ROLE PERMISSIONS
-- =========================================================
create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(role_id, permission_id)
);

create index if not exists idx_role_permissions_role_id
  on public.role_permissions(role_id);

create index if not exists idx_role_permissions_permission_id
  on public.role_permissions(permission_id);

-- =========================================================
-- 4) USER ROLE ASSIGNMENTS
-- enrich existing table if present
-- =========================================================
create table if not exists public.user_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(user_id, role_id, organization_id)
);

alter table public.user_role_assignments
  add column if not exists organization_id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'organizations'
  ) then
    if not exists (
      select 1
      from pg_constraint
      where conname = 'user_role_assignments_organization_id_fkey'
    ) then
      alter table public.user_role_assignments
        add constraint user_role_assignments_organization_id_fkey
        foreign key (organization_id)
        references public.organizations(id)
        on delete set null;
    end if;
  end if;
end $$;

create index if not exists idx_user_role_assignments_user_id
  on public.user_role_assignments(user_id);

create index if not exists idx_user_role_assignments_role_id
  on public.user_role_assignments(role_id);

create index if not exists idx_user_role_assignments_org_id
  on public.user_role_assignments(organization_id);

-- =========================================================
-- 5) OPTIONAL USER PERMISSION OVERRIDES
-- useful for exceptions outside role defaults
-- =========================================================
create table if not exists public.user_permission_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  is_allowed boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, permission_id)
);

create index if not exists idx_user_permission_overrides_user_id
  on public.user_permission_overrides(user_id);

create index if not exists idx_user_permission_overrides_permission_id
  on public.user_permission_overrides(permission_id);

-- =========================================================
-- 6) SEED ROLES
-- preserves existing ones and adds new roles
-- =========================================================
insert into public.roles (name, description, is_system_role)
values
  ('superuser', 'Full platform control', true),
  ('admin', 'Administrative platform access', true),
  ('customer_service', 'Customer support and assisted order management', true),
  ('sales_representative', 'Sales and order capture role', true),
  ('accountant', 'Finance, invoices, journals, payments, receivables, payables', true),
  ('procurement_officer', 'Supplier, purchase order, and procurement operations', true),
  ('warehouse_officer', 'Warehouse, stock, goods receipt, and stock adjustment operations', true),
  ('logistics_coordinator', 'Dispatch and logistics coordination', true),
  ('supplier', 'Supplier or input partner', true),
  ('buyer', 'Produce or marketplace buyer', true),
  ('farmer', 'Farmer platform user', true),
  ('trainer', 'Training facilitator or agronomist', true)
on conflict (name) do update
set
  description = excluded.description,
  is_system_role = excluded.is_system_role;

-- =========================================================
-- 7) SEED PERMISSIONS
-- =========================================================
insert into public.permissions (code, name, description, module)
values
  -- Catalog
  ('catalog:view', 'View catalog', 'View product catalog and product master data', 'catalog'),
  ('catalog:manage', 'Manage catalog', 'Create and edit product catalog records', 'catalog'),
  ('categories:view', 'View categories', 'View product categories', 'catalog'),
  ('categories:manage', 'Manage categories', 'Create and edit product categories', 'catalog'),
  ('subcategories:view', 'View subcategories', 'View product subcategories', 'catalog'),
  ('subcategories:manage', 'Manage subcategories', 'Create and edit product subcategories', 'catalog'),
  ('collections:view', 'View collections', 'View product collections', 'catalog'),
  ('collections:manage', 'Manage collections', 'Create and edit product collections', 'catalog'),
  ('pack_sizes:view', 'View pack sizes', 'View available pack sizes', 'catalog'),
  ('pack_sizes:manage', 'Manage pack sizes', 'Create and edit pack sizes', 'catalog'),
  ('variants:view', 'View variants', 'View product variants', 'catalog'),
  ('variants:manage', 'Manage variants', 'Create and edit product variants', 'catalog'),
  ('attributes:view', 'View attributes', 'View product attributes', 'catalog'),
  ('attributes:manage', 'Manage attributes', 'Create and edit product attributes', 'catalog'),

  -- Orders and sales
  ('orders:view', 'View orders', 'View customer orders', 'sales'),
  ('orders:create', 'Create orders', 'Create customer orders', 'sales'),
  ('orders:manage', 'Manage orders', 'Edit and manage customer orders', 'sales'),
  ('orders:approve', 'Approve orders', 'Approve customer orders', 'sales'),
  ('orders:recover_abandoned', 'Recover abandoned carts', 'Recover abandoned carts into orders', 'sales'),
  ('customer_invoices:view', 'View customer invoices', 'View customer invoices', 'sales'),
  ('customer_invoices:create', 'Create customer invoices', 'Create customer invoices', 'sales'),
  ('customer_invoices:post', 'Post customer invoices', 'Post/finalize customer invoices', 'sales'),
  ('customer_invoices:email', 'Email customer invoices', 'Trigger or manage customer invoice delivery', 'sales'),

  -- Payments and customer finance
  ('payments:view', 'View payments', 'View payments and allocations', 'finance'),
  ('payments:create', 'Create payments', 'Create or record payments', 'finance'),
  ('payments:manage', 'Manage payments', 'Manage payment records and allocations', 'finance'),
  ('credit_accounts:view', 'View credit accounts', 'View customer credit accounts', 'finance'),
  ('credit_accounts:manage', 'Manage credit accounts', 'Manage customer credit accounts and ledgers', 'finance'),

  -- Procurement
  ('suppliers:view', 'View suppliers', 'View supplier records', 'procurement'),
  ('suppliers:manage', 'Manage suppliers', 'Create and edit supplier records', 'procurement'),
  ('purchase_orders:view', 'View purchase orders', 'View purchase orders', 'procurement'),
  ('purchase_orders:create', 'Create purchase orders', 'Create purchase orders', 'procurement'),
  ('purchase_orders:approve', 'Approve purchase orders', 'Approve purchase orders', 'procurement'),
  ('purchase_orders:manage', 'Manage purchase orders', 'Edit purchase orders', 'procurement'),
  ('goods_receipts:view', 'View goods receipts', 'View goods receipts', 'procurement'),
  ('goods_receipts:create', 'Create goods receipts', 'Create goods receipts', 'procurement'),
  ('goods_receipts:post', 'Post goods receipts', 'Post/finalize goods receipts', 'procurement'),
  ('supplier_invoices:view', 'View supplier invoices', 'View supplier invoices', 'procurement'),
  ('supplier_invoices:create', 'Create supplier invoices', 'Create supplier invoices', 'procurement'),
  ('supplier_invoices:post', 'Post supplier invoices', 'Post/finalize supplier invoices', 'procurement'),

  -- Inventory
  ('stock:view', 'View stock', 'View stock balances and inventory', 'inventory'),
  ('stock_movements:view', 'View stock movements', 'View stock movements', 'inventory'),
  ('stock_adjustments:create', 'Create stock adjustments', 'Create stock adjustments', 'inventory'),
  ('stock_adjustments:post', 'Post stock adjustments', 'Post/finalize stock adjustments', 'inventory'),
  ('inventory:manage', 'Manage inventory', 'Manage inventory and warehouse actions', 'inventory'),

  -- Finance and accounting
  ('journal_entries:view', 'View journal entries', 'View finance journal entries', 'finance'),
  ('journal_entries:manage', 'Manage journal entries', 'Create or manage journal entries', 'finance'),
  ('gl_accounts:view', 'View GL accounts', 'View chart of accounts', 'finance'),
  ('gl_accounts:manage', 'Manage GL accounts', 'Manage chart of accounts', 'finance'),
  ('commerce_accounting:view', 'View commerce accounting', 'View commerce accounting dashboards and summaries', 'finance'),

  -- User administration
  ('users:view', 'View users', 'View platform users', 'admin'),
  ('users:manage', 'Manage users', 'Manage users and access', 'admin'),
  ('roles:view', 'View roles', 'View role definitions', 'admin'),
  ('roles:manage', 'Manage roles', 'Manage role definitions', 'admin'),
  ('permissions:view', 'View permissions', 'View permission definitions', 'admin'),
  ('permissions:manage', 'Manage permissions', 'Manage permission definitions', 'admin')
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  module = excluded.module;

-- =========================================================
-- 8) ROLE -> PERMISSION MAPPING
-- helper CTEs for clean inserts
-- =========================================================

-- superuser gets everything
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'superuser'
on conflict (role_id, permission_id) do nothing;

-- admin gets almost everything except maybe hard superuser-only semantics
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on true
where r.name = 'admin'
on conflict (role_id, permission_id) do nothing;

-- customer_service
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on p.code in (
    'catalog:view',
    'categories:view',
    'subcategories:view',
    'collections:view',
    'pack_sizes:view',
    'variants:view',
    'attributes:view',
    'orders:view',
    'orders:create',
    'orders:manage',
    'orders:recover_abandoned',
    'customer_invoices:view',
    'customer_invoices:create',
    'customer_invoices:email',
    'payments:view',
    'payments:create',
    'credit_accounts:view'
  )
where r.name = 'customer_service'
on conflict (role_id, permission_id) do nothing;

-- sales_representative
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on p.code in (
    'catalog:view',
    'categories:view',
    'subcategories:view',
    'collections:view',
    'pack_sizes:view',
    'variants:view',
    'orders:view',
    'orders:create',
    'orders:manage',
    'customer_invoices:view',
    'customer_invoices:create',
    'credit_accounts:view'
  )
where r.name = 'sales_representative'
on conflict (role_id, permission_id) do nothing;

-- accountant
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on p.code in (
    'customer_invoices:view',
    'customer_invoices:create',
    'customer_invoices:post',
    'customer_invoices:email',
    'supplier_invoices:view',
    'supplier_invoices:create',
    'supplier_invoices:post',
    'payments:view',
    'payments:create',
    'payments:manage',
    'credit_accounts:view',
    'credit_accounts:manage',
    'journal_entries:view',
    'journal_entries:manage',
    'gl_accounts:view',
    'gl_accounts:manage',
    'commerce_accounting:view'
  )
where r.name = 'accountant'
on conflict (role_id, permission_id) do nothing;

-- procurement_officer
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on p.code in (
    'suppliers:view',
    'suppliers:manage',
    'purchase_orders:view',
    'purchase_orders:create',
    'purchase_orders:approve',
    'purchase_orders:manage',
    'goods_receipts:view',
    'goods_receipts:create',
    'goods_receipts:post',
    'supplier_invoices:view'
  )
where r.name = 'procurement_officer'
on conflict (role_id, permission_id) do nothing;

-- warehouse_officer
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on p.code in (
    'stock:view',
    'stock_movements:view',
    'stock_adjustments:create',
    'stock_adjustments:post',
    'inventory:manage',
    'goods_receipts:view',
    'goods_receipts:create',
    'goods_receipts:post'
  )
where r.name = 'warehouse_officer'
on conflict (role_id, permission_id) do nothing;

-- logistics_coordinator
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on p.code in (
    'orders:view',
    'orders:manage',
    'stock:view',
    'stock_movements:view'
  )
where r.name = 'logistics_coordinator'
on conflict (role_id, permission_id) do nothing;

-- =========================================================
-- 9) HELPER FUNCTIONS
-- =========================================================

create or replace function public.user_has_role(p_user_id uuid, p_role_name text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    where ura.user_id = p_user_id
      and r.name = p_role_name
  );
$$;

create or replace function public.user_has_any_role(p_user_id uuid, p_role_names text[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    where ura.user_id = p_user_id
      and r.name = any(p_role_names)
  );
$$;

create or replace function public.user_has_permission(p_user_id uuid, p_permission_code text)
returns boolean
language plpgsql
stable
as $$
declare
  v_override boolean;
begin
  -- superuser shortcut
  if public.user_has_role(p_user_id, 'superuser') then
    return true;
  end if;

  -- explicit user override first
  select upo.is_allowed
  into v_override
  from public.user_permission_overrides upo
  join public.permissions p on p.id = upo.permission_id
  where upo.user_id = p_user_id
    and p.code = p_permission_code
  limit 1;

  if v_override is not null then
    return v_override;
  end if;

  return exists (
    select 1
    from public.user_role_assignments ura
    join public.role_permissions rp on rp.role_id = ura.role_id
    join public.permissions p on p.id = rp.permission_id
    where ura.user_id = p_user_id
      and p.code = p_permission_code
  );
end;
$$;

create or replace function public.current_user_has_permission(p_permission_code text)
returns boolean
language sql
stable
as $$
  select public.user_has_permission(auth.uid(), p_permission_code);
$$;

create or replace function public.current_user_has_role(p_role_name text)
returns boolean
language sql
stable
as $$
  select public.user_has_role(auth.uid(), p_role_name);
$$;

-- =========================================================
-- 10) OPTIONAL VIEW FOR EASIER ADMIN UI
-- =========================================================
create or replace view public.user_effective_permissions as
select distinct
  ura.user_id,
  r.name as role_name,
  p.code as permission_code,
  p.name as permission_name,
  p.module
from public.user_role_assignments ura
join public.roles r on r.id = ura.role_id
join public.role_permissions rp on rp.role_id = r.id
join public.permissions p on p.id = rp.permission_id;

-- =========================================================
-- 11) BASIC RLS ENABLEMENT FOR NEW ACCESS TABLES
-- =========================================================
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_permission_overrides enable row level security;

-- permissions: view/manage only by admin-like users
drop policy if exists permissions_select_admin on public.permissions;
create policy permissions_select_admin
on public.permissions
for select
using (
  public.current_user_has_permission('permissions:view')
  or public.user_has_any_role(auth.uid(), array['admin','superuser'])
);

drop policy if exists permissions_manage_admin on public.permissions;
create policy permissions_manage_admin
on public.permissions
for all
using (
  public.current_user_has_permission('permissions:manage')
  or public.current_user_has_role('superuser')
)
with check (
  public.current_user_has_permission('permissions:manage')
  or public.current_user_has_role('superuser')
);

-- role_permissions: view/manage only by admin-like users
drop policy if exists role_permissions_select_admin on public.role_permissions;
create policy role_permissions_select_admin
on public.role_permissions
for select
using (
  public.current_user_has_permission('roles:view')
  or public.current_user_has_role('superuser')
);

drop policy if exists role_permissions_manage_admin on public.role_permissions;
create policy role_permissions_manage_admin
on public.role_permissions
for all
using (
  public.current_user_has_permission('roles:manage')
  or public.current_user_has_role('superuser')
)
with check (
  public.current_user_has_permission('roles:manage')
  or public.current_user_has_role('superuser')
);

-- user_permission_overrides: only admins manage
drop policy if exists user_permission_overrides_select_admin on public.user_permission_overrides;
create policy user_permission_overrides_select_admin
on public.user_permission_overrides
for select
using (
  public.current_user_has_permission('users:view')
  or public.current_user_has_role('superuser')
);

drop policy if exists user_permission_overrides_manage_admin on public.user_permission_overrides;
create policy user_permission_overrides_manage_admin
on public.user_permission_overrides
for all
using (
  public.current_user_has_permission('users:manage')
  or public.current_user_has_role('superuser')
)
with check (
  public.current_user_has_permission('users:manage')
  or public.current_user_has_role('superuser')
);

-- =========================================================
-- 12) SMALL HELPER FOR current_user_has_any_role
-- =========================================================
create or replace function public.current_user_has_any_role(p_role_names text[])
returns boolean
language sql
stable
as $$
  select public.user_has_any_role(auth.uid(), p_role_names);
$$;
