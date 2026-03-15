create extension if not exists pgcrypto;

create table public.agronomy_tools (
  id uuid primary key default gen_random_uuid(),
  tool_code text not null unique,
  name text not null,
  description text,
  category text not null check (
    category in (
      'fertiliser',
      'lime',
      'spray',
      'yield',
      'irrigation',
      'crop_calendar',
      'soil_interpretation',
      'other'
    )
  ),
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agronomy_tool_runs (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.agronomy_tools(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  run_name text,
  input_data jsonb not null default '{}'::jsonb,
  output_data jsonb not null default '{}'::jsonb,
  status text not null default 'completed' check (
    status in ('draft', 'completed', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fertiliser_recommendations (
  id uuid primary key default gen_random_uuid(),
  tool_run_id uuid references public.agronomy_tool_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  season_label text,
  target_yield numeric,
  target_yield_unit text default 't/ha',
  nitrogen_kg_ha numeric,
  phosphorus_kg_ha numeric,
  potassium_kg_ha numeric,
  sulphur_kg_ha numeric,
  calcium_kg_ha numeric,
  magnesium_kg_ha numeric,
  zinc_kg_ha numeric,
  boron_kg_ha numeric,
  recommendation_notes text,
  assumptions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fertiliser_plan_items (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references public.fertiliser_recommendations(id) on delete cascade,
  application_stage text not null,
  product_name text,
  nutrient_ratio text,
  application_rate_kg_ha numeric,
  application_timing text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.lime_recommendations (
  id uuid primary key default gen_random_uuid(),
  tool_run_id uuid references public.agronomy_tool_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  soil_test_id uuid references public.soil_tests(id) on delete set null,
  current_ph_kcl numeric,
  target_ph_kcl numeric,
  acid_saturation_percent numeric,
  target_acid_saturation_percent numeric,
  lime_requirement_t_ha numeric,
  lime_type text,
  recommendation_notes text,
  assumptions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.spray_programs (
  id uuid primary key default gen_random_uuid(),
  tool_run_id uuid references public.agronomy_tool_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  program_name text not null,
  crop_stage text,
  season_label text,
  objective text,
  notes text,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.spray_program_items (
  id uuid primary key default gen_random_uuid(),
  spray_program_id uuid not null references public.spray_programs(id) on delete cascade,
  application_stage text,
  timing_label text,
  product_name text,
  active_ingredient text,
  target_pest_or_weed text,
  rate_per_ha numeric,
  rate_unit text,
  water_volume_l_ha numeric,
  adjuvant text,
  withholding_period_days integer,
  reentry_interval_hours integer,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.crop_calendar_plans (
  id uuid primary key default gen_random_uuid(),
  tool_run_id uuid references public.agronomy_tool_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  plan_name text not null,
  planting_window_start date,
  planting_window_end date,
  expected_harvest_start date,
  expected_harvest_end date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.crop_calendar_events (
  id uuid primary key default gen_random_uuid(),
  crop_calendar_plan_id uuid not null references public.crop_calendar_plans(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'land_preparation',
      'planting',
      'fertiliser',
      'spraying',
      'scouting',
      'irrigation',
      'harvest',
      'other'
    )
  ),
  event_title text not null,
  planned_date date,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.yield_estimator_runs (
  id uuid primary key default gen_random_uuid(),
  tool_run_id uuid references public.agronomy_tool_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  plant_population integer,
  ears_or_plants_per_ha integer,
  kernels_per_ear numeric,
  kernel_mass_g numeric,
  moisture_percent numeric,
  estimated_yield_t_ha numeric,
  methodology text,
  assumptions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.irrigation_plans (
  id uuid primary key default gen_random_uuid(),
  tool_run_id uuid references public.agronomy_tool_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  plan_name text not null,
  soil_water_holding_capacity_mm numeric,
  rooting_depth_cm numeric,
  irrigation_trigger_percent numeric,
  target_refill_mm numeric,
  application_efficiency_percent numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.irrigation_plan_events (
  id uuid primary key default gen_random_uuid(),
  irrigation_plan_id uuid not null references public.irrigation_plans(id) on delete cascade,
  event_date date,
  growth_stage text,
  et_mm numeric,
  rainfall_mm numeric,
  irrigation_mm numeric,
  deficit_mm numeric,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.agronomy_tool_templates (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.agronomy_tools(id) on delete cascade,
  name text not null,
  description text,
  access_level text not null default 'authenticated' check (
    access_level in ('public', 'authenticated', 'premium', 'admin')
  ),
  template_data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_agronomy_tool_runs_tool_id on public.agronomy_tool_runs(tool_id);
create index idx_agronomy_tool_runs_user_id on public.agronomy_tool_runs(user_id);
create index idx_agronomy_tool_runs_farm_id on public.agronomy_tool_runs(farm_id);
create index idx_agronomy_tool_runs_field_id on public.agronomy_tool_runs(field_id);
create index idx_fertiliser_recommendations_user_id on public.fertiliser_recommendations(user_id);
create index idx_fertiliser_recommendations_farm_id on public.fertiliser_recommendations(farm_id);
create index idx_fertiliser_recommendations_field_id on public.fertiliser_recommendations(field_id);
create index idx_fertiliser_plan_items_recommendation_id on public.fertiliser_plan_items(recommendation_id);
create index idx_lime_recommendations_user_id on public.lime_recommendations(user_id);
create index idx_lime_recommendations_field_id on public.lime_recommendations(field_id);
create index idx_spray_programs_user_id on public.spray_programs(user_id);
create index idx_spray_programs_field_id on public.spray_programs(field_id);
create index idx_spray_program_items_program_id on public.spray_program_items(spray_program_id);
create index idx_crop_calendar_plans_user_id on public.crop_calendar_plans(user_id);
create index idx_crop_calendar_plans_field_id on public.crop_calendar_plans(field_id);
create index idx_crop_calendar_events_plan_id on public.crop_calendar_events(crop_calendar_plan_id);
create index idx_yield_estimator_runs_user_id on public.yield_estimator_runs(user_id);
create index idx_yield_estimator_runs_field_id on public.yield_estimator_runs(field_id);
create index idx_irrigation_plans_user_id on public.irrigation_plans(user_id);
create index idx_irrigation_plans_field_id on public.irrigation_plans(field_id);
create index idx_irrigation_plan_events_plan_id on public.irrigation_plan_events(irrigation_plan_id);
create index idx_agronomy_tool_templates_tool_id on public.agronomy_tool_templates(tool_id);

create trigger trg_agronomy_tools_updated_at
before update on public.agronomy_tools
for each row
execute function public.set_updated_at();

create trigger trg_agronomy_tool_runs_updated_at
before update on public.agronomy_tool_runs
for each row
execute function public.set_updated_at();

create trigger trg_fertiliser_recommendations_updated_at
before update on public.fertiliser_recommendations
for each row
execute function public.set_updated_at();

create trigger trg_lime_recommendations_updated_at
before update on public.lime_recommendations
for each row
execute function public.set_updated_at();

create trigger trg_spray_programs_updated_at
before update on public.spray_programs
for each row
execute function public.set_updated_at();

create trigger trg_crop_calendar_plans_updated_at
before update on public.crop_calendar_plans
for each row
execute function public.set_updated_at();

create trigger trg_yield_estimator_runs_updated_at
before update on public.yield_estimator_runs
for each row
execute function public.set_updated_at();

create trigger trg_irrigation_plans_updated_at
before update on public.irrigation_plans
for each row
execute function public.set_updated_at();

create trigger trg_agronomy_tool_templates_updated_at
before update on public.agronomy_tool_templates
for each row
execute function public.set_updated_at();

alter table public.agronomy_tools enable row level security;
alter table public.agronomy_tool_runs enable row level security;
alter table public.fertiliser_recommendations enable row level security;
alter table public.fertiliser_plan_items enable row level security;
alter table public.lime_recommendations enable row level security;
alter table public.spray_programs enable row level security;
alter table public.spray_program_items enable row level security;
alter table public.crop_calendar_plans enable row level security;
alter table public.crop_calendar_events enable row level security;
alter table public.yield_estimator_runs enable row level security;
alter table public.irrigation_plans enable row level security;
alter table public.irrigation_plan_events enable row level security;
alter table public.agronomy_tool_templates enable row level security;

drop policy if exists "agronomy_tools_read_authenticated" on public.agronomy_tools;
create policy "agronomy_tools_read_authenticated"
on public.agronomy_tools
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "agronomy_tools_manage_admin_or_trainer" on public.agronomy_tools;
create policy "agronomy_tools_manage_admin_or_trainer"
on public.agronomy_tools
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

drop policy if exists "agronomy_tool_runs_select_own_or_admin" on public.agronomy_tool_runs;
create policy "agronomy_tool_runs_select_own_or_admin"
on public.agronomy_tool_runs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "agronomy_tool_runs_insert_own_or_admin" on public.agronomy_tool_runs;
create policy "agronomy_tool_runs_insert_own_or_admin"
on public.agronomy_tool_runs
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "agronomy_tool_runs_update_own_or_admin" on public.agronomy_tool_runs;
create policy "agronomy_tool_runs_update_own_or_admin"
on public.agronomy_tool_runs
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "fertiliser_recommendations_select_own_or_admin" on public.fertiliser_recommendations;
create policy "fertiliser_recommendations_select_own_or_admin"
on public.fertiliser_recommendations
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "fertiliser_recommendations_manage_own_or_admin" on public.fertiliser_recommendations;
create policy "fertiliser_recommendations_manage_own_or_admin"
on public.fertiliser_recommendations
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

drop policy if exists "fertiliser_plan_items_select_via_recommendation_owner" on public.fertiliser_plan_items;
create policy "fertiliser_plan_items_select_via_recommendation_owner"
on public.fertiliser_plan_items
for select
to authenticated
using (
  exists (
    select 1
    from public.fertiliser_recommendations fr
    where fr.id = fertiliser_plan_items.recommendation_id
      and (fr.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "fertiliser_plan_items_manage_via_recommendation_owner" on public.fertiliser_plan_items;
create policy "fertiliser_plan_items_manage_via_recommendation_owner"
on public.fertiliser_plan_items
for all
to authenticated
using (
  exists (
    select 1
    from public.fertiliser_recommendations fr
    where fr.id = fertiliser_plan_items.recommendation_id
      and (fr.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.fertiliser_recommendations fr
    where fr.id = fertiliser_plan_items.recommendation_id
      and (fr.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "lime_recommendations_select_own_or_admin" on public.lime_recommendations;
create policy "lime_recommendations_select_own_or_admin"
on public.lime_recommendations
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "lime_recommendations_manage_own_or_admin" on public.lime_recommendations;
create policy "lime_recommendations_manage_own_or_admin"
on public.lime_recommendations
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

drop policy if exists "spray_programs_select_own_or_admin" on public.spray_programs;
create policy "spray_programs_select_own_or_admin"
on public.spray_programs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "spray_programs_manage_own_or_admin" on public.spray_programs;
create policy "spray_programs_manage_own_or_admin"
on public.spray_programs
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

drop policy if exists "spray_program_items_select_via_program_owner" on public.spray_program_items;
create policy "spray_program_items_select_via_program_owner"
on public.spray_program_items
for select
to authenticated
using (
  exists (
    select 1
    from public.spray_programs sp
    where sp.id = spray_program_items.spray_program_id
      and (sp.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "spray_program_items_manage_via_program_owner" on public.spray_program_items;
create policy "spray_program_items_manage_via_program_owner"
on public.spray_program_items
for all
to authenticated
using (
  exists (
    select 1
    from public.spray_programs sp
    where sp.id = spray_program_items.spray_program_id
      and (sp.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.spray_programs sp
    where sp.id = spray_program_items.spray_program_id
      and (sp.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "crop_calendar_plans_select_own_or_admin" on public.crop_calendar_plans;
create policy "crop_calendar_plans_select_own_or_admin"
on public.crop_calendar_plans
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "crop_calendar_plans_manage_own_or_admin" on public.crop_calendar_plans;
create policy "crop_calendar_plans_manage_own_or_admin"
on public.crop_calendar_plans
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

drop policy if exists "crop_calendar_events_select_via_plan_owner" on public.crop_calendar_events;
create policy "crop_calendar_events_select_via_plan_owner"
on public.crop_calendar_events
for select
to authenticated
using (
  exists (
    select 1
    from public.crop_calendar_plans cp
    where cp.id = crop_calendar_events.crop_calendar_plan_id
      and (cp.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "crop_calendar_events_manage_via_plan_owner" on public.crop_calendar_events;
create policy "crop_calendar_events_manage_via_plan_owner"
on public.crop_calendar_events
for all
to authenticated
using (
  exists (
    select 1
    from public.crop_calendar_plans cp
    where cp.id = crop_calendar_events.crop_calendar_plan_id
      and (cp.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.crop_calendar_plans cp
    where cp.id = crop_calendar_events.crop_calendar_plan_id
      and (cp.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "yield_estimator_runs_select_own_or_admin" on public.yield_estimator_runs;
create policy "yield_estimator_runs_select_own_or_admin"
on public.yield_estimator_runs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "yield_estimator_runs_manage_own_or_admin" on public.yield_estimator_runs;
create policy "yield_estimator_runs_manage_own_or_admin"
on public.yield_estimator_runs
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

drop policy if exists "irrigation_plans_select_own_or_admin" on public.irrigation_plans;
create policy "irrigation_plans_select_own_or_admin"
on public.irrigation_plans
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "irrigation_plans_manage_own_or_admin" on public.irrigation_plans;
create policy "irrigation_plans_manage_own_or_admin"
on public.irrigation_plans
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

drop policy if exists "irrigation_plan_events_select_via_plan_owner" on public.irrigation_plan_events;
create policy "irrigation_plan_events_select_via_plan_owner"
on public.irrigation_plan_events
for select
to authenticated
using (
  exists (
    select 1
    from public.irrigation_plans ip
    where ip.id = irrigation_plan_events.irrigation_plan_id
      and (ip.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "irrigation_plan_events_manage_via_plan_owner" on public.irrigation_plan_events;
create policy "irrigation_plan_events_manage_via_plan_owner"
on public.irrigation_plan_events
for all
to authenticated
using (
  exists (
    select 1
    from public.irrigation_plans ip
    where ip.id = irrigation_plan_events.irrigation_plan_id
      and (ip.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.irrigation_plans ip
    where ip.id = irrigation_plan_events.irrigation_plan_id
      and (ip.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "agronomy_tool_templates_read_by_access_level" on public.agronomy_tool_templates;
create policy "agronomy_tool_templates_read_by_access_level"
on public.agronomy_tool_templates
for select
to authenticated
using (
  public.is_admin()
  or access_level = 'public'
  or access_level = 'authenticated'
  or (
    access_level = 'premium'
    and exists (
      select 1
      from public.subscriptions s
      where s.user_id = auth.uid()
        and s.status in ('trialing', 'active')
    )
  )
);

drop policy if exists "agronomy_tool_templates_manage_admin_or_trainer" on public.agronomy_tool_templates;
create policy "agronomy_tool_templates_manage_admin_or_trainer"
on public.agronomy_tool_templates
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

insert into public.agronomy_tools (
  tool_code,
  name,
  description,
  category,
  is_active,
  config
)
values
  (
    'fertiliser_planner',
    'Fertiliser Planner',
    'Builds crop nutrient recommendations and application plans',
    'fertiliser',
    true,
    '{"units":"kg/ha","supports_multi_stage":true}'::jsonb
  ),
  (
    'lime_requirement_calculator',
    'Lime Requirement Calculator',
    'Estimates lime requirements based on soil acidity and target pH',
    'lime',
    true,
    '{"units":"t/ha"}'::jsonb
  ),
  (
    'spray_program_builder',
    'Spray Program Builder',
    'Creates spray program schedules for crop protection',
    'spray',
    true,
    '{"supports_growth_stages":true}'::jsonb
  ),
  (
    'yield_estimator',
    'Yield Estimator',
    'Estimates crop yield using field observations and crop parameters',
    'yield',
    true,
    '{"default_unit":"t/ha"}'::jsonb
  ),
  (
    'irrigation_planner',
    'Irrigation Planner',
    'Plans irrigation intervals and refill amounts',
    'irrigation',
    true,
    '{"default_unit":"mm"}'::jsonb
  ),
  (
    'crop_calendar_planner',
    'Crop Calendar Planner',
    'Builds a crop activity calendar from planting to harvest',
    'crop_calendar',
    true,
    '{"supports_multiple_events":true}'::jsonb
  )
on conflict (tool_code) do nothing;

insert into public.agronomy_tool_templates (
  tool_id,
  name,
  description,
  access_level,
  template_data,
  is_active
)
select
  t.id,
  'Maize Base Template',
  'Starter template for maize production planning',
  'authenticated',
  '{"crop":"maize","season":"summer","region":"South Africa"}'::jsonb,
  true
from public.agronomy_tools t
where t.tool_code in ('fertiliser_planner', 'spray_program_builder', 'crop_calendar_planner')
on conflict do nothing;
