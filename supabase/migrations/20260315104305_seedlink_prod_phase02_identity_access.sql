create extension if not exists pgcrypto;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  organization_type text not null default 'farmer_group',
  country_code text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  membership_role text not null default 'member',
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_system_role boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  module text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (role_id, permission_id)
);

create table public.user_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role_id, organization_id)
);

create index idx_organizations_created_by on public.organizations(created_by);
create index idx_organization_members_organization_id on public.organization_members(organization_id);
create index idx_organization_members_user_id on public.organization_members(user_id);
create index idx_role_permissions_role_id on public.role_permissions(role_id);
create index idx_role_permissions_permission_id on public.role_permissions(permission_id);
create index idx_user_role_assignments_user_id on public.user_role_assignments(user_id);
create index idx_user_role_assignments_role_id on public.user_role_assignments(role_id);
create index idx_user_role_assignments_organization_id on public.user_role_assignments(organization_id);

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
  if not exists (select 1 from pg_trigger where tgname = 'trg_organizations_updated_at') then
    create trigger trg_organizations_updated_at
    before update on public.organizations
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_organization_members_updated_at') then
    create trigger trg_organization_members_updated_at
    before update on public.organization_members
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_roles_updated_at') then
    create trigger trg_roles_updated_at
    before update on public.roles
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_permissions_updated_at') then
    create trigger trg_permissions_updated_at
    before update on public.permissions
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_user_role_assignments_updated_at') then
    create trigger trg_user_role_assignments_updated_at
    before update on public.user_role_assignments
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

insert into public.roles (name, description, is_system_role)
values
  ('super_admin', 'Full Seedlink platform control', true),
  ('admin', 'Administrative platform access', true),
  ('farmer', 'Farmer platform user', true),
  ('supplier', 'Supplier or input partner', true),
  ('buyer', 'Produce or marketplace buyer', true),
  ('trainer', 'Training facilitator or agronomist', true),
  ('logistics_partner', 'Transport or logistics operator', true)
on conflict (name) do nothing;

insert into public.permissions (code, description, module)
values
  ('users.manage', 'Manage platform users', 'users'),
  ('organizations.manage', 'Manage organizations', 'organizations'),
  ('roles.manage', 'Manage roles and assignments', 'access_control'),
  ('products.manage', 'Manage products and catalog', 'commerce'),
  ('orders.manage', 'Manage orders', 'commerce'),
  ('courses.manage', 'Manage courses and LMS content', 'lms'),
  ('farms.manage', 'Manage farms and field data', 'agronomy'),
  ('marketplace.manage', 'Manage marketplace listings and trades', 'marketplace'),
  ('logistics.manage', 'Manage logistics operations', 'logistics'),
  ('reports.view', 'View reports and analytics', 'analytics')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'super_admin'
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'users.manage',
  'organizations.manage',
  'products.manage',
  'orders.manage',
  'courses.manage',
  'farms.manage',
  'marketplace.manage',
  'logistics.manage',
  'reports.view'
)
where r.name = 'admin'
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'farms.manage',
  'orders.manage',
  'reports.view'
)
where r.name = 'farmer'
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'products.manage',
  'orders.manage',
  'reports.view'
)
where r.name = 'supplier'
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'orders.manage',
  'reports.view'
)
where r.name = 'buyer'
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'courses.manage',
  'reports.view'
)
where r.name = 'trainer'
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'logistics.manage',
  'orders.manage',
  'reports.view'
)
where r.name = 'logistics_partner'
on conflict (role_id, permission_id) do nothing;
