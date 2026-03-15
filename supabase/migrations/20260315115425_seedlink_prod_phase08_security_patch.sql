create extension if not exists pgcrypto;

-- 1) Ensure RLS is enabled on the tables involved in the warnings
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.coupon_codes enable row level security;

-- Optional but recommended: also ensure related LMS tables are protected
alter table public.course_modules enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

-- 2) Helper: check whether the current user is enrolled in a course
create or replace function public.is_enrolled_in_course(target_course_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.course_id = target_course_id
      and e.user_id = auth.uid()
      and e.status in ('active', 'completed')
  );
$$;

-- 3) Remove overly-open LMS read policies
drop policy if exists "course_modules_public_read" on public.course_modules;
drop policy if exists "lessons_public_read" on public.lessons;
drop policy if exists "lesson_resources_public_read" on public.lesson_resources;

-- 4) Replace with enrollment-aware read policies
create policy "course_modules_read_if_enrolled_or_admin_or_trainer"
on public.course_modules
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
  or exists (
    select 1
    from public.courses c
    where c.id = course_modules.course_id
      and (
        public.is_enrolled_in_course(c.id)
        or c.price = 0
        or c.status = 'published'
      )
  )
);

create policy "lessons_read_if_enrolled_or_admin_or_trainer"
on public.lessons
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
  or exists (
    select 1
    from public.course_modules cm
    join public.courses c on c.id = cm.course_id
    where cm.id = lessons.module_id
      and (
        public.is_enrolled_in_course(c.id)
        or (c.price = 0 and lessons.is_preview = true)
      )
  )
);

create policy "lesson_resources_read_if_enrolled_or_admin_or_trainer"
on public.lesson_resources
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
  or exists (
    select 1
    from public.lessons l
    join public.course_modules cm on cm.id = l.module_id
    join public.courses c on c.id = cm.course_id
    where l.id = lesson_resources.lesson_id
      and (
        public.is_enrolled_in_course(c.id)
        or (c.price = 0 and l.is_preview = true)
      )
  )
);

-- 5) Tighten coupon-code visibility
drop policy if exists "coupon_codes_public_read" on public.coupon_codes;

create policy "coupon_codes_admin_only_read"
on public.coupon_codes
for select
to authenticated
using (public.is_admin());

-- keep admin full management
drop policy if exists "coupon_codes_admin_only" on public.coupon_codes;
create policy "coupon_codes_admin_only"
on public.coupon_codes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
