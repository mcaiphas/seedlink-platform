alter table public.profiles
add column if not exists email text,
add column if not exists phone text,
add column if not exists avatar_url text,
add column if not exists job_title text,
add column if not exists organization_id uuid,
add column if not exists is_active boolean default true,
add column if not exists updated_at timestamp with time zone default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_organization_id_fkey'
  ) then
    alter table public.profiles
    add constraint profiles_organization_id_fkey
    foreign key (organization_id)
    references public.organizations(id)
    on delete set null;
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_profiles_updated_at
before') then create trigger trg_profiles_updated_at
before update on public.profiles
for each row
 execute function public.set_updated_at(); end if; end
$$;
