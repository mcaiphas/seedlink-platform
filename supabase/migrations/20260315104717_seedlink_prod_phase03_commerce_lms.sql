create extension if not exists pgcrypto;

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.product_categories(id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.product_collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (collection_id, product_id)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_category_assignments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.product_categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (product_id, category_id)
);

alter table public.products
  add column if not exists sku text unique,
  add column if not exists product_type text not null default 'physical',
  add column if not exists status text not null default 'draft',
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists compare_at_price numeric,
  add column if not exists stock_quantity integer not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists requires_shipping boolean not null default true,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'active',
  currency_code text not null default 'ZAR',
  subtotal_amount numeric not null default 0,
  discount_amount numeric not null default 0,
  tax_amount numeric not null default 0,
  total_amount numeric not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric not null default 0,
  line_total numeric not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  sku text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric not null default 0,
  line_total numeric not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists order_number text unique,
  add column if not exists currency_code text not null default 'ZAR',
  add column if not exists subtotal_amount numeric not null default 0,
  add column if not exists discount_amount numeric not null default 0,
  add column if not exists tax_amount numeric not null default 0,
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists fulfillment_status text not null default 'unfulfilled',
  add column if not exists notes text,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  billing_interval text not null check (billing_interval in ('monthly', 'quarterly', 'annually', 'once_off')),
  price numeric not null default 0,
  currency_code text not null default 'ZAR',
  is_active boolean not null default true,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  status text not null default 'active' check (status in ('trialing', 'active', 'past_due', 'cancelled', 'expired')),
  start_date timestamptz not null default now(),
  end_date timestamptz,
  auto_renew boolean not null default true,
  provider_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  description text,
  content_type text not null default 'video' check (content_type in ('video', 'text', 'pdf', 'quiz', 'assignment')),
  content_url text,
  duration_minutes integer,
  sort_order integer not null default 0,
  is_preview boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  resource_type text not null default 'file' check (resource_type in ('file', 'link', 'image')),
  resource_url text not null,
  created_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  certificate_number text not null unique,
  issued_at timestamptz not null default now(),
  certificate_url text,
  created_at timestamptz not null default now()
);

alter table public.courses
  add column if not exists slug text unique,
  add column if not exists status text not null default 'draft',
  add column if not exists thumbnail_url text,
  add column if not exists short_description text,
  add column if not exists level text,
  add column if not exists duration_hours numeric,
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

alter table public.enrollments
  add column if not exists status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  add column if not exists enrolled_at timestamptz not null default now(),
  add column if not exists completed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create index idx_product_categories_parent_id on public.product_categories(parent_id);
create index idx_product_collection_items_collection_id on public.product_collection_items(collection_id);
create index idx_product_collection_items_product_id on public.product_collection_items(product_id);
create index idx_product_images_product_id on public.product_images(product_id);
create index idx_product_category_assignments_product_id on public.product_category_assignments(product_id);
create index idx_product_category_assignments_category_id on public.product_category_assignments(category_id);
create index idx_products_status on public.products(status);
create index idx_products_product_type on public.products(product_type);
create index idx_products_is_active on public.products(is_active);
create index idx_carts_user_id on public.carts(user_id);
create index idx_cart_items_cart_id on public.cart_items(cart_id);
create index idx_cart_items_product_id on public.cart_items(product_id);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_product_id on public.order_items(product_id);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_plan_id on public.subscriptions(plan_id);
create index idx_course_modules_course_id on public.course_modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_lesson_resources_lesson_id on public.lesson_resources(lesson_id);
create index idx_certificates_user_id on public.certificates(user_id);
create index idx_certificates_course_id on public.certificates(course_id);
create index idx_enrollments_user_id on public.enrollments(user_id);
create index idx_enrollments_course_id on public.enrollments(course_id);

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_categories_updated_at
before') then create trigger trg_product_categories_updated_at
before update on public.product_categories
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_collections_updated_at
before') then create trigger trg_product_collections_updated_at
before update on public.product_collections
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_products_updated_at
before') then create trigger trg_products_updated_at
before update on public.products
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_carts_updated_at
before') then create trigger trg_carts_updated_at
before update on public.carts
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_cart_items_updated_at
before') then create trigger trg_cart_items_updated_at
before update on public.cart_items
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_orders_updated_at
before') then create trigger trg_orders_updated_at
before update on public.orders
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_subscription_plans_updated_at
before') then create trigger trg_subscription_plans_updated_at
before update on public.subscription_plans
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_subscriptions_updated_at
before') then create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_course_modules_updated_at
before') then create trigger trg_course_modules_updated_at
before update on public.course_modules
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_lessons_updated_at
before') then create trigger trg_lessons_updated_at
before update on public.lessons
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_courses_updated_at
before') then create trigger trg_courses_updated_at
before update on public.courses
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_enrollments_updated_at
before') then create trigger trg_enrollments_updated_at
before update on public.enrollments
for each row
 execute function public.set_updated_at(); end if; end 8999;

insert into public.product_categories (name, slug, description, sort_order)
values
  ('Seeds', 'seeds', 'Maize, soybean, sunflower, sorghum and vegetable seeds', 1),
  ('Fertiliser', 'fertiliser', 'Basal, top dressing and speciality fertilisers', 2),
  ('Crop Protection', 'crop-protection', 'Herbicides, fungicides, insecticides and adjuvants', 3),
  ('Equipment', 'equipment', 'Agricultural tools and production equipment', 4),
  ('Training', 'training', 'Training products and learning packages', 5)
on conflict (slug) do nothing;

insert into public.product_collections (name, slug, description, sort_order)
values
  ('Featured Products', 'featured-products', 'Highlighted Seedlink products', 1),
  ('Maize Production', 'maize-production', 'Products and learning for maize production', 2),
  ('Soybean Production', 'soybean-production', 'Products and learning for soybean production', 3),
  ('Vegetable Production', 'vegetable-production', 'Products and learning for vegetable farmers', 4)
on conflict (slug) do nothing;

insert into public.subscription_plans (name, slug, description, billing_interval, price, currency_code, features)
values
  (
    'Seedlink Grow Basic',
    'seedlink-grow-basic',
    'Basic training and advisory access',
    'monthly',
    199,
    'ZAR',
    '["Access to selected courses","Monthly advisory updates","Basic farmer dashboard"]'::jsonb
  ),
  (
    'Seedlink Grow Pro',
    'seedlink-grow-pro',
    'Advanced agronomy and training access',
    'monthly',
    499,
    'ZAR',
    '["Full course access","Advanced agronomy tools","Priority support","Certificates"]'::jsonb
  )
on conflict (slug) do nothing;
