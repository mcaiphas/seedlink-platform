create or replace function public.user_has_permission(p_user_id uuid, p_permission_code text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $function$
declare
  v_override boolean;
begin
  if p_user_id is null then
    return false;
  end if;

  if public.user_has_role(p_user_id, 'super_admin') then
    return true;
  end if;

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
$function$;
