create extension if not exists pgcrypto;

create table public.fields (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  field_name text not null,
  field_code text,
  area_hectares numeric not null default 0,
  soil_type text,
  irrigation_type text,
  gps_lat numeric,
  gps_lng numeric,
  boundary_geojson jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, field_name)
);

create table public.planting_records (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.fields(id) on delete cascade,
  crop_id uuid references public.crops(id) on delete set null,
  planting_date date not null,
  crop_type text not null,
  variety text,
  seed_rate numeric,
  plant_population integer,
  row_spacing_cm numeric,
  planting_depth_cm numeric,
  area_planted_hectares numeric,
  expected_harvest_date date,
  status text not null default 'planned' check (status in ('planned', 'planted', 'cancelled', 'completed')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.harvest_records (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.fields(id) on delete cascade,
  crop_id uuid references public.crops(id) on delete set null,
  planting_record_id uuid references public.planting_records(id) on delete set null,
  harvest_date date not null,
  harvested_area_hectares numeric,
  total_yield_tons numeric,
  yield_per_hectare numeric,
  moisture_percent numeric,
  quality_grade text,
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'cancelled')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.soil_tests (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete cascade,
  sample_code text,
  sample_date date not null,
  lab_name text,
  depth_cm text,
  ph_kcl numeric,
  ph_h2o numeric,
  organic_matter_percent numeric,
  cec numeric,
  acid_saturation_percent numeric,
  sand_percent numeric,
  silt_percent numeric,
  clay_percent numeric,
  calcium numeric,
  magnesium numeric,
  potassium numeric,
  sodium numeric,
  phosphorus numeric,
  zinc numeric,
  copper numeric,
  manganese numeric,
  boron numeric,
  sulphur numeric,
  nitrate_n numeric,
  ammonium_n numeric,
  raw_results jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete cascade,
  snapshot_date date not null,
  min_temp_c numeric,
  max_temp_c numeric,
  rainfall_mm numeric,
  humidity_percent numeric,
  wind_speed_kmh numeric,
  evapotranspiration_mm numeric,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (field_id, snapshot_date)
);

create table public.crop_recommendations (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete cascade,
  crop_id uuid references public.crops(id) on delete set null,
  recommendation_type text not null check (
    recommendation_type in (
      'fertiliser',
      'lime',
      'seed',
      'spray_program',
      'irrigation',
      'planting_window',
      'general'
    )
  ),
  title text not null,
  recommendation_text text not null,
  basis text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  generated_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.farm_activities (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete cascade,
  activity_type text not null check (
    activity_type in (
      'land_preparation',
      'planting',
      'fertiliser',
      'spraying',
      'scouting',
      'irrigation',
      'harvest',
      'soil_sampling',
      'other'
    )
  ),
  activity_date date not null,
  title text not null,
  description text,
  performed_by uuid references public.profiles(id) on delete set null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  cost_amount numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_fields_farm_id on public.fields(farm_id);
create index idx_planting_records_field_id on public.planting_records(field_id);
create index idx_planting_records_crop_id on public.planting_records(crop_id);
create index idx_harvest_records_field_id on public.harvest_records(field_id);
create index idx_harvest_records_crop_id on public.harvest_records(crop_id);
create index idx_harvest_records_planting_record_id on public.harvest_records(planting_record_id);
create index idx_soil_tests_farm_id on public.soil_tests(farm_id);
create index idx_soil_tests_field_id on public.soil_tests(field_id);
create index idx_weather_snapshots_farm_id on public.weather_snapshots(farm_id);
create index idx_weather_snapshots_field_id on public.weather_snapshots(field_id);
create index idx_crop_recommendations_farm_id on public.crop_recommendations(farm_id);
create index idx_crop_recommendations_field_id on public.crop_recommendations(field_id);
create index idx_crop_recommendations_crop_id on public.crop_recommendations(crop_id);
create index idx_farm_activities_farm_id on public.farm_activities(farm_id);
create index idx_farm_activities_field_id on public.farm_activities(field_id);
create index idx_farm_activities_performed_by on public.farm_activities(performed_by);

do $$
begin
  if to_regclass('public.fields') is not null and not exists (select 1 from pg_trigger where tgname = 'trg_fields_updated_at') then
    create trigger trg_fields_updated_at
    before update on public.fields
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.field_seasons') is not null and not exists (select 1 from pg_trigger where tgname = 'trg_field_seasons_updated_at') then
    create trigger trg_field_seasons_updated_at
    before update on public.field_seasons
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.crop_plans') is not null and not exists (select 1 from pg_trigger where tgname = 'trg_crop_plans_updated_at') then
    create trigger trg_crop_plans_updated_at
    before update on public.crop_plans
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.soil_samples') is not null and not exists (select 1 from pg_trigger where tgname = 'trg_soil_samples_updated_at') then
    create trigger trg_soil_samples_updated_at
    before update on public.soil_samples
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if to_regclass('public.recommendations') is not null and not exists (select 1 from pg_trigger where tgname = 'trg_recommendations_updated_at') then
    create trigger trg_recommendations_updated_at
    before update on public.recommendations
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;
