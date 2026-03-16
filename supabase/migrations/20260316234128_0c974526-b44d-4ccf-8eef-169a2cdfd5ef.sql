
-- Extend farms table with planning fields
ALTER TABLE public.farms
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id),
  ADD COLUMN IF NOT EXISTS region_profile_id uuid REFERENCES public.agro_region_profiles(id),
  ADD COLUMN IF NOT EXISTS farming_system_id uuid REFERENCES public.agro_farming_systems(id),
  ADD COLUMN IF NOT EXISTS irrigation_available boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text;

-- Extend fields table with soil profile linkage
ALTER TABLE public.fields
  ADD COLUMN IF NOT EXISTS soil_profile_id uuid REFERENCES public.agro_soil_profiles(id),
  ADD COLUMN IF NOT EXISTS region_profile_id uuid REFERENCES public.agro_region_profiles(id),
  ADD COLUMN IF NOT EXISTS notes text;

-- Seasons table
CREATE TABLE public.farm_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  crop_cycle_type text NOT NULL DEFAULT 'summer',
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.farm_seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on farm_seasons" ON public.farm_seasons FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated read farm_seasons" ON public.farm_seasons FOR SELECT TO authenticated USING (true);

-- Crop Plans table
CREATE TABLE public.crop_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  field_id uuid REFERENCES public.fields(id),
  season_id uuid NOT NULL REFERENCES public.farm_seasons(id),
  crop text NOT NULL,
  variety text,
  planting_window text,
  expected_planting_date date,
  expected_harvest_date date,
  yield_target text,
  farming_system_id uuid REFERENCES public.agro_farming_systems(id),
  irrigation_type text DEFAULT 'dryland',
  recommendation_id uuid REFERENCES public.agro_recommendations(id),
  area_hectares numeric(10,2),
  status text NOT NULL DEFAULT 'draft',
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crop_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on crop_plans" ON public.crop_plans FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated read crop_plans" ON public.crop_plans FOR SELECT TO authenticated USING (true);

-- Production Stages
CREATE TABLE public.production_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_plan_id uuid NOT NULL REFERENCES public.crop_plans(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  stage_order integer NOT NULL DEFAULT 0,
  recommended_timing text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.production_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on production_stages" ON public.production_stages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated read production_stages" ON public.production_stages FOR SELECT TO authenticated USING (true);

-- Program Activities (line items within stages)
CREATE TABLE public.program_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_plan_id uuid NOT NULL REFERENCES public.crop_plans(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES public.production_stages(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id),
  variant_id uuid REFERENCES public.product_variants(id),
  pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  activity_description text NOT NULL,
  product_category text,
  application_rate numeric(12,4),
  application_rate_unit text DEFAULT 'kg/ha',
  total_quantity numeric(12,4),
  packs_needed numeric(12,2),
  unit_price numeric(14,2),
  line_total numeric(14,2),
  recommended_timing text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.program_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on program_activities" ON public.program_activities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated read program_activities" ON public.program_activities FOR SELECT TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX idx_crop_plans_farm ON public.crop_plans(farm_id);
CREATE INDEX idx_crop_plans_season ON public.crop_plans(season_id);
CREATE INDEX idx_crop_plans_field ON public.crop_plans(field_id);
CREATE INDEX idx_production_stages_plan ON public.production_stages(crop_plan_id);
CREATE INDEX idx_program_activities_plan ON public.program_activities(crop_plan_id);
CREATE INDEX idx_program_activities_stage ON public.program_activities(stage_id);
CREATE INDEX idx_farms_customer ON public.farms(customer_id);
