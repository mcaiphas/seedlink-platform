-- Fix duplicate function ambiguity for user_has_role

drop function if exists public.user_has_role(uuid, text, uuid);

create or replace function public.user_has_role_in_org(
  p_user_id uuid,
  p_role_name text,
  p_org_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $function$
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
$function$;
