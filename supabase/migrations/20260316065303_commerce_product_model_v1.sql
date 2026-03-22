create extension if not exists pgcrypto;

-- =========================================================
-- HELPER: updated_at trigger function
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
-- HELPER: margin calculation
-- =========================================================
create or replace function public.calculate_margin_percent(
  buying_price numeric,
  selling_price numeric
)
returns numeric
language sql
immutable
as $$
  select
    case
      when buying_price is null or selling_price is null or buying_price = 0 then null
      else round(((selling_price - buying_price) / buying_price) * 100, 2)
    end
$$;

-- =========================================================
-- 1) ENRICH EXISTING TABLE: product_categories
-- Current table already exists
-- Add commerce fields safely
-- =========================================================
alter table public.product_categories
  add column if not exists code text,
  add column if not exists sku_prefix text;

create unique index if not exists uq_product_categories_code
  on public.product_categories(code)
  where code is not null;

create unique index if not exists uq_product_categories_sku_prefix
  on public.product_categories(sku_prefix)
  where sku_prefix is not null;

drop trigger if exists trg_product_categories_updated_at on public.product_categories;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_categories_updated_at
before') then create trigger trg_product_categories_updated_at
before update on public.product_categories
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 2) NEW TABLE: product_subcategories
-- =========================================================
create table if not exists public.product_subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.product_categories(id) on delete cascade,
  name text not null,
  slug text,
  code text,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, name)
);

create unique index if not exists uq_product_subcategories_slug
  on public.product_subcategories(slug)
  where slug is not null;

alter table public.product_subcategories add column if not exists code text;
create unique index if not exists uq_product_subcategories_code
  on public.product_subcategories(code)
  where code is not null;

create index if not exists idx_product_subcategories_category_id
  on public.product_subcategories(category_id);

drop trigger if exists trg_product_subcategories_updated_at on public.product_subcategories;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_subcategories_updated_at
before') then create trigger trg_product_subcategories_updated_at
before update on public.product_subcategories
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 3) ENRICH EXISTING TABLE: product_collections
-- Keep existing structure, just ensure updated_at trigger
-- =========================================================
drop trigger if exists trg_product_collections_updated_at on public.product_collections;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_collections_updated_at
before') then create trigger trg_product_collections_updated_at
before update on public.product_collections
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 4) NEW TABLE: product_pack_sizes
-- Reusable pack size definitions
-- =========================================================
create table if not exists public.product_pack_sizes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  pack_type text not null check (pack_type in ('weight', 'seed_count', 'volume', 'unit')),
  quantity_value numeric(14,3),
  quantity_unit text,
  seed_count integer,
  estimated_weight_kg numeric(14,3),
  is_bulk boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_pack_sizes add column if not exists sort_order integer not null default 0;
create index if not exists idx_product_pack_sizes_sort_order
  on public.product_pack_sizes(sort_order);

drop trigger if exists trg_product_pack_sizes_updated_at on public.product_pack_sizes;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_pack_sizes_updated_at
before') then create trigger trg_product_pack_sizes_updated_at
before update on public.product_pack_sizes
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 5) ENRICH EXISTING TABLE: products
-- Current table already exists, so add fields safely
-- =========================================================
alter table public.products
  add column if not exists category_id uuid references public.product_categories(id) on delete set null,
  add column if not exists sku_base text,
  add column if not exists short_description text,
  add column if not exists default_buying_price numeric(14,2),
  add column if not exists default_selling_price numeric(14,2),
  add column if not exists default_margin_percent numeric(8,2),
  add column if not exists depot_id uuid references public.depots(id) on delete set null,
  add column if not exists organization_id uuid references public.organizations(id) on delete set null,
  add column if not exists image_url text,
  add column if not exists is_variant_product boolean not null default true;

create index if not exists idx_products_category_id
  on public.products(category_id);

create index if not exists idx_products_subcategory_id
  on public.products(subcategory_id);

create index if not exists idx_products_supplier_id
  on public.products(supplier_id);

create index if not exists idx_products_depot_id
  on public.products(depot_id);

create index if not exists idx_products_organization_id
  on public.products(organization_id);

drop trigger if exists trg_products_updated_at on public.products;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_products_updated_at
before') then create trigger trg_products_updated_at
before update on public.products
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 6) NEW TABLE: product_variants
-- Real sellable SKU-level records
-- =========================================================
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_name text not null,
  sku text not null unique,
  pack_size_id uuid references public.product_pack_sizes(id) on delete set null,
  buying_price numeric(14,2),
  selling_price numeric(14,2),
  margin_percent numeric(8,2),
  barcode text,
  weight_kg numeric(14,3),
  length_cm numeric(14,2),
  width_cm numeric(14,2),
  height_cm numeric(14,2),
  is_bulk boolean not null default false,
  is_active boolean not null default true,
  depot_id uuid references public.depots(id) on delete set null,
  variant_status text not null default 'active' check (variant_status in ('draft', 'active', 'inactive', 'archived')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_product_variants_product_id
  on public.product_variants(product_id);

create index if not exists idx_product_variants_pack_size_id
  on public.product_variants(pack_size_id);

alter table public.product_variants add column if not exists depot_id uuid references public.depots(id) on delete set null;

create index if not exists idx_product_variants_depot_id
  on public.product_variants(depot_id);

drop trigger if exists trg_product_variants_updated_at on public.product_variants;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_variants_updated_at
before') then create trigger trg_product_variants_updated_at
before update on public.product_variants
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 7) ENRICH EXISTING TABLE: product_attributes
-- Align to existing field names, do not recreate
-- =========================================================
alter table public.product_attributes
  add column if not exists applies_to_category_id uuid references public.product_categories(id) on delete set null;

create index if not exists idx_product_attributes_applies_to_category_id
  on public.product_attributes(applies_to_category_id);

drop trigger if exists trg_product_attributes_updated_at on public.product_attributes;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_product_attributes_updated_at
before') then create trigger trg_product_attributes_updated_at
before update on public.product_attributes
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 8) NEW TABLE: product_variant_attribute_values
-- Variant-level flexible attributes
-- =========================================================
create table if not exists public.product_variant_attribute_values (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  attribute_id uuid not null references public.product_attributes(id) on delete cascade,
  attribute_option_id uuid references public.product_attribute_options(id) on delete set null,
  attribute_value_text text,
  attribute_value_number numeric(14,3),
  attribute_value_boolean boolean,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_variant_attribute_values_variant_id
  on public.product_variant_attribute_values(variant_id);

create index if not exists idx_product_variant_attribute_values_attribute_id
  on public.product_variant_attribute_values(attribute_id);

-- =========================================================
-- 9) NEW TABLE: seed_product_details
-- Seed-specific extension of products
-- =========================================================
create table if not exists public.seed_product_details (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  crop_name text,
  variety_name text,
  hybrid_name text,
  maturity_classification text check (maturity_classification in ('Ultra Early', 'Early', 'Medium', 'Late')),
  maturity_days integer,
  seed_class text,
  treatment_name text,
  germination_percent numeric(6,2),
  purity_percent numeric(6,2),
  thousand_kernel_weight_g numeric(10,2),
  seeds_per_kg numeric(14,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_seed_product_details_updated_at on public.seed_product_details;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_seed_product_details_updated_at
before') then create trigger trg_seed_product_details_updated_at
before update on public.seed_product_details
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 10) NEW TABLE: product_pricing_history
-- =========================================================
create table if not exists public.product_pricing_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  old_buying_price numeric(14,2),
  new_buying_price numeric(14,2),
  old_selling_price numeric(14,2),
  new_selling_price numeric(14,2),
  old_margin_percent numeric(8,2),
  new_margin_percent numeric(8,2),
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists idx_product_pricing_history_product_id
  on public.product_pricing_history(product_id);

create index if not exists idx_product_pricing_history_variant_id
  on public.product_pricing_history(variant_id);

-- =========================================================
-- 11) NEW TABLE: inventory_batches
-- Variant stock by depot/batch
-- =========================================================
create table if not exists public.inventory_batches (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  depot_id uuid not null references public.depots(id) on delete cascade,
  batch_number text,
  quantity_on_hand numeric(14,3) not null default 0,
  quantity_reserved numeric(14,3) not null default 0,
  unit_of_measure text,
  expiry_date date,
  manufacture_date date,
  status text not null default 'available' check (status in ('available', 'quarantine', 'expired', 'damaged', 'reserved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_batches_variant_id
  on public.inventory_batches(variant_id);

create index if not exists idx_inventory_batches_depot_id
  on public.inventory_batches(depot_id);

create index if not exists idx_inventory_batches_batch_number
  on public.inventory_batches(batch_number);

drop trigger if exists trg_inventory_batches_updated_at on public.inventory_batches;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_inventory_batches_updated_at
before') then create trigger trg_inventory_batches_updated_at
before update on public.inventory_batches
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 12) NEW TABLE: product_import_jobs
-- =========================================================
create table if not exists public.product_import_jobs (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references auth.users(id) on delete set null,
  file_name text not null,
  file_type text not null check (file_type in ('csv', 'xlsx', 'pdf')),
  import_source text default 'manual',
  status text not null default 'uploaded' check (status in ('uploaded', 'processing', 'validated', 'completed', 'failed')),
  total_rows integer not null default 0,
  success_rows integer not null default 0,
  failed_rows integer not null default 0,
  error_report_url text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- =========================================================
-- 13) NEW TABLE: product_import_rows
-- =========================================================
create table if not exists public.product_import_rows (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.product_import_jobs(id) on delete cascade,
  row_number integer not null,
  raw_data_json jsonb,
  validation_status text not null default 'pending' check (validation_status in ('pending', 'valid', 'invalid', 'imported')),
  error_message text,
  created_product_id uuid references public.products(id) on delete set null,
  created_variant_id uuid references public.product_variants(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_import_rows_import_job_id
  on public.product_import_rows(import_job_id);

-- =========================================================
-- 14) NEW TABLE: course_classifications
-- =========================================================
create table if not exists public.course_classifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  classification_type text not null check (classification_type in ('delivery_mode', 'course_level')),
  code text,
  created_at timestamptz not null default now(),
  unique (classification_type, name)
);

create unique index if not exists uq_course_classifications_code
  on public.course_classifications(code)
  where code is not null;

-- =========================================================
-- 15) ENRICH EXISTING TABLE: marketplace_commodities
-- Keep current field names, add updated_at trigger only
-- =========================================================
drop trigger if exists trg_marketplace_commodities_updated_at on public.marketplace_commodities;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_commodities_updated_at
before') then create trigger trg_marketplace_commodities_updated_at
before update on public.marketplace_commodities
for each row
 execute function public.set_updated_at(); end if; end 8999;

-- =========================================================
-- 16) NEW TABLE: marketplace_commodity_grades
-- =========================================================
create table if not exists public.marketplace_commodity_grades (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references public.marketplace_commodities(id) on delete cascade,
  name text not null,
  code text,
  description text,
  created_at timestamptz not null default now(),
  unique (commodity_id, name)
);

create unique index if not exists uq_marketplace_commodity_grades_code
  on public.marketplace_commodity_grades(code)
  where code is not null;
