begin;

-- 1) Normalize legacy dot-format permission codes to colon-format
-- Direct row-by-row updates removed because some colon-format codes already exist.
-- Safe deduplication and normalization now happens in section 2b.

-- 2) Recreate helper functions so any embedded dot-format references are removed
-- Keep wrappers stable and standardized.

create or replace function public.current_user_has_permission(p_permission_code text)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select public.user_has_permission(auth.uid(), p_permission_code);
$$;

create or replace function public.current_user_has_permission(p_permission text, p_org_id uuid default null::uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select public.user_has_permission(p_permission, p_org_id, auth.uid());
$$
;

create or replace function public.current_user_has_role(p_role_name text)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select public.user_has_role(auth.uid(), p_role_name);
$$;

create or replace function public.current_user_has_role(p_role_name text, p_org_id uuid default null::uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select public.user_has_role_in_org(auth.uid(), p_role_name, p_org_id);
$$;

create or replace function public.current_user_has_any_role(p_role_names text[])
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    where ura.user_id = auth.uid()
      and ura.is_active = true
      and r.name = any(p_role_names)
  );
$$;

create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select public.current_user_has_role(role_name, null::uuid);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path to 'public'
as $$
  select public.current_user_has_role('super_admin', null::uuid)
      or public.current_user_has_role('admin', null::uuid);
$$;

-- 2b) Deduplicate dot-format permissions against existing colon-format permissions
with duplicates as (
  select
    dot.id as dot_id,
    colon.id as colon_id
  from public.permissions dot
  join public.permissions colon
    on colon.code = replace(dot.code, '.', ':')
  where dot.code like '%.%'
)
update public.role_permissions rp
set permission_id = d.colon_id
from duplicates d
where rp.permission_id = d.dot_id
  and not exists (
    select 1
    from public.role_permissions rp2
    where rp2.role_id = rp.role_id
      and rp2.permission_id = d.colon_id
  );

with duplicates as (
  select dot.id as dot_id
  from public.permissions dot
  join public.permissions colon
    on colon.code = replace(dot.code, '.', ':')
  where dot.code like '%.%'
)
delete from public.role_permissions rp
using duplicates d
where rp.permission_id = d.dot_id;

with duplicates as (
  select dot.id as dot_id
  from public.permissions dot
  join public.permissions colon
    on colon.code = replace(dot.code, '.', ':')
  where dot.code like '%.%'
)
delete from public.permissions p
using duplicates d
where p.id = d.dot_id;

-- Final sweep for any remaining dot-format permission codes without colon twins
update public.permissions p
set code = replace(p.code, '.', ':')
where p.code like '%.%'
  and not exists (
    select 1
    from public.permissions p2
    where p2.code = replace(p.code, '.', ':')
      and p2.id <> p.id
  );

-- 3) Verification guards
do $$
declare
  remaining_count integer;
begin
  select count(*)
  into remaining_count
  from public.permissions
  where code like '%.%';

  if remaining_count > 0 then
    raise exception 'RBAC normalization incomplete: % dot-format permission codes remain', remaining_count;
  end if;
end $$;

commit;
