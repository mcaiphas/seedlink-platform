create extension if not exists pgcrypto;

create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  channel text not null check (channel in ('in_app', 'email', 'sms', 'whatsapp')),
  subject text,
  title text,
  body text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  address_type text not null default 'shipping' check (address_type in ('billing', 'shipping', 'pickup', 'dropoff', 'office', 'farm')),
  label text,
  line1 text not null,
  line2 text,
  suburb text,
  city text,
  province text,
  postal_code text,
  country_code text not null default 'ZA',
  latitude numeric,
  longitude numeric,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or organization_id is not null)
);

create table if not exists public.coupon_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed_amount')),
  discount_value numeric not null default 0,
  currency_code text not null default 'ZAR',
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses
  add column if not exists category_id uuid references public.course_categories(id) on delete set null;

create index if not exists idx_addresses_user_id on public.addresses(user_id);
create index if not exists idx_addresses_organization_id on public.addresses(organization_id);
create index if not exists idx_coupon_codes_code on public.coupon_codes(code);
create index if not exists idx_courses_category_id on public.courses(category_id);

drop trigger if exists trg_system_settings_updated_at on public.system_settings;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_system_settings_updated_at
before') then create trigger trg_system_settings_updated_at
before update on public.system_settings
for each row
 execute function public.set_updated_at(); end if; end 8999;

drop trigger if exists trg_notification_templates_updated_at on public.notification_templates;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_notification_templates_updated_at
before') then create trigger trg_notification_templates_updated_at
before update on public.notification_templates
for each row
 execute function public.set_updated_at(); end if; end 8999;

drop trigger if exists trg_addresses_updated_at on public.addresses;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_addresses_updated_at
before') then create trigger trg_addresses_updated_at
before update on public.addresses
for each row
 execute function public.set_updated_at(); end if; end 8999;

drop trigger if exists trg_coupon_codes_updated_at on public.coupon_codes;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_coupon_codes_updated_at
before') then create trigger trg_coupon_codes_updated_at
before update on public.coupon_codes
for each row
 execute function public.set_updated_at(); end if; end 8999;

drop trigger if exists trg_course_categories_updated_at on public.course_categories;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_course_categories_updated_at
before') then create trigger trg_course_categories_updated_at
before update on public.course_categories
for each row
 execute function public.set_updated_at(); end if; end 8999;

alter table public.system_settings enable row level security;
alter table public.notification_templates enable row level security;
alter table public.addresses enable row level security;
alter table public.coupon_codes enable row level security;
alter table public.course_categories enable row level security;

drop policy if exists "system_settings_admin_only" on public.system_settings;
create policy "system_settings_admin_only"
on public.system_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "notification_templates_admin_only" on public.notification_templates;
create policy "notification_templates_admin_only"
on public.notification_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "addresses_select_own_or_admin" on public.addresses;
create policy "addresses_select_own_or_admin"
on public.addresses
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "addresses_manage_own_or_admin" on public.addresses;
create policy "addresses_manage_own_or_admin"
on public.addresses
for all
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "coupon_codes_public_read" on public.coupon_codes;
create policy "coupon_codes_public_read"
on public.coupon_codes
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "coupon_codes_admin_only" on public.coupon_codes;
create policy "coupon_codes_admin_only"
on public.coupon_codes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "course_categories_public_read" on public.course_categories;
create policy "course_categories_public_read"
on public.course_categories
for select
to authenticated
using (true);

drop policy if exists "course_categories_admin_or_trainer_manage" on public.course_categories;
create policy "course_categories_admin_or_trainer_manage"
on public.course_categories
for all
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
)
with check (
  public.is_admin()
  or public.has_role('trainer')
);

insert into public.system_settings (setting_key, setting_value, description)
values
  (
    'platform.brand',
    '{
      "name": "Seedlink",
      "tagline": "Your partner in profitable farming",
      "currency_code": "ZAR",
      "default_country_code": "ZA"
    }'::jsonb,
    'Core Seedlink brand settings'
  ),
  (
    'platform.store',
    '{
      "catalog_mode": false,
      "allow_guest_checkout": false,
      "marketplace_enabled": true,
      "training_enabled": true,
      "produce_market_enabled": true
    }'::jsonb,
    'Core commerce and marketplace feature flags'
  ),
  (
    'platform.logistics',
    '{
      "provider": "drovvi",
      "auto_create_delivery_requests": true
    }'::jsonb,
    'Default logistics settings'
  )
on conflict (setting_key) do nothing;

insert into public.notification_templates (code, channel, subject, title, body, is_active)
values
  (
    'welcome_user_email',
    'email',
    'Welcome to Seedlink',
    'Welcome to Seedlink',
    'Welcome to Seedlink. Your account has been created successfully.',
    true
  ),
  (
    'order_created_in_app',
    'in_app',
    null,
    'Order received',
    'Your order has been received and is being processed.',
    true
  ),
  (
    'payment_success_email',
    'email',
    'Payment successful',
    'Payment successful',
    'Your payment has been received successfully.',
    true
  ),
  (
    'course_enrollment_email',
    'email',
    'Course enrollment confirmed',
    'Enrollment confirmed',
    'You have been successfully enrolled in your course.',
    true
  ),
  (
    'delivery_status_in_app',
    'in_app',
    null,
    'Delivery update',
    'Your delivery status has been updated.',
    true
  )
on conflict (code) do nothing;

insert into public.course_categories (name, slug, description, sort_order)
values
  ('Grain Production', 'grain-production', 'Courses focused on maize, soybean, sunflower and sorghum production', 1),
  ('Vegetable Production', 'vegetable-production', 'Courses focused on commercial vegetable farming', 2),
  ('Seed Production', 'seed-production', 'Courses focused on seed multiplication and quality systems', 3),
  ('Farm Management', 'farm-management', 'Courses focused on budgeting, planning and enterprise management', 4),
  ('Agronomy Advisory', 'agronomy-advisory', 'Advanced agronomy and crop advisory content', 5)
on conflict (slug) do nothing;

insert into public.coupon_codes (code, description, discount_type, discount_value, currency_code, is_active)
values
  ('SEEDLINK10', 'Starter platform launch discount', 'percentage', 10, 'ZAR', true),
  ('GROW50', 'Promotional training coupon', 'fixed_amount', 50, 'ZAR', true)
on conflict (code) do nothing;

insert into public.products (name, category, price, description)
values
  ('Seedlink Demo Maize Hybrid', 'Seeds', 0, 'Demo seed product used for platform bootstrap and UI testing'),
  ('Seedlink Demo Fertiliser Plan', 'Fertiliser', 0, 'Demo fertiliser product used for catalog testing'),
  ('Seedlink Demo Training Bundle', 'Training', 0, 'Demo training-linked product used for checkout testing')
on conflict do nothing;

insert into public.courses (title, description, price, slug, status, short_description, is_featured, is_active)
values
  (
    'Grain Production Basics 101',
    'Introductory course covering the foundations of profitable grain production.',
    0,
    'grain-production-basics-101',
    'published',
    'Foundational course for grain farmers',
    true,
    true
  ),
  (
    'Seed Production Fundamentals',
    'Core principles of seed production, quality and field management.',
    0,
    'seed-production-fundamentals',
    'published',
    'Introduction to commercial seed production',
    true,
    true
  )
on conflict (slug) do nothing;

insert into public.course_modules (course_id, title, description, sort_order, is_published)
select c.id, 'Module 1: Introduction', 'Introductory module for platform bootstrap', 1, true
from public.courses c
where c.slug in ('grain-production-basics-101', 'seed-production-fundamentals')
on conflict do nothing;

insert into public.lessons (module_id, title, description, content_type, content_url, duration_minutes, sort_order, is_preview, is_published)
select cm.id,
       'Lesson 1: Welcome',
       'Welcome lesson used for LMS bootstrap',
       'text',
       null,
       10,
       1,
       true,
       true
from public.course_modules cm
where cm.title = 'Module 1: Introduction'
on conflict do nothing;
