create or replace function public.user_has_role(p_user_id uuid, p_role_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $function$
begin
  if p_user_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    where ura.user_id = p_user_id
      and r.name = p_role_name
  );
end;
$function$;

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

  if public.user_has_role(p_user_id, 'superuser') then
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

create or replace function public.current_user_has_permission(p_permission_code text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $function$
begin
  if auth.uid() is null then
    return false;
  end if;

  return public.user_has_permission(auth.uid(), p_permission_code);
end;
$function$;

grant execute on function public.user_has_role(uuid, text) to anon, authenticated;
grant execute on function public.user_has_permission(uuid, text) to anon, authenticated;
grant execute on function public.current_user_has_permission(text) to anon, authenticated;
