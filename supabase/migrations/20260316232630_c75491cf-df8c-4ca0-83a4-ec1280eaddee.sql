
-- Region Profiles
CREATE TABLE public.agro_region_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL DEFAULT 'South Africa',
  province text NOT NULL,
  production_zone text NOT NULL,
  rainfall_class text,
  dominant_soil_patterns text[],
  common_crops text[],
  preferred_planting_windows text,
  agronomic_notes text,
  risk_notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_soil_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_name text NOT NULL,
  texture_class text NOT NULL,
  drainage text,
  water_holding text,
  leaching_risk text,
  nutrient_holding text,
  agronomic_notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_farming_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name text NOT NULL,
  system_code text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_advisory_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  crop text NOT NULL,
  region_profile_id uuid REFERENCES public.agro_region_profiles(id) ON DELETE SET NULL,
  soil_profile_id uuid REFERENCES public.agro_soil_profiles(id) ON DELETE SET NULL,
  farming_system_id uuid REFERENCES public.agro_farming_systems(id) ON DELETE SET NULL,
  season text,
  product_category text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  application_rate_per_ha numeric(12,4),
  application_rate_unit text,
  priority integer NOT NULL DEFAULT 0,
  rationale text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_solution_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_name text NOT NULL,
  crop text NOT NULL,
  target_context text,
  agronomic_objective text,
  notes text,
  estimated_area_ha numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_solution_bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid NOT NULL REFERENCES public.agro_solution_bundles(id) ON DELETE CASCADE,
  product_category text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  application_rate_per_ha numeric(12,4),
  application_rate_unit text,
  sort_order integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_number text,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  farm_id uuid REFERENCES public.farms(id) ON DELETE SET NULL,
  crop text NOT NULL,
  area_ha numeric(10,2),
  region_profile_id uuid REFERENCES public.agro_region_profiles(id) ON DELETE SET NULL,
  soil_profile_id uuid REFERENCES public.agro_soil_profiles(id) ON DELETE SET NULL,
  farming_system_id uuid REFERENCES public.agro_farming_systems(id) ON DELETE SET NULL,
  province text,
  rainfall_zone text,
  soil_type text,
  irrigation_type text,
  production_scale text,
  production_goal text,
  planting_window text,
  yield_target text,
  assumptions text,
  status text NOT NULL DEFAULT 'draft',
  converted_to_type text,
  converted_to_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agro_recommendation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id uuid NOT NULL REFERENCES public.agro_recommendations(id) ON DELETE CASCADE,
  product_category text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name text,
  rationale text,
  application_rate_per_ha numeric(12,4),
  application_rate_unit text,
  total_quantity numeric(12,2),
  pack_size_id uuid REFERENCES public.product_pack_sizes(id) ON DELETE SET NULL,
  packs_needed integer,
  unit_price numeric(14,2),
  line_total numeric(14,2),
  sort_order integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.agro_rec_number_seq START 1000;
CREATE OR REPLACE FUNCTION public.generate_agro_rec_number()
RETURNS text LANGUAGE sql SET search_path TO 'public' AS $$
  SELECT 'REC-' || lpad(nextval('public.agro_rec_number_seq')::text, 6, '0');
$$;

-- RLS
ALTER TABLE public.agro_region_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_soil_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_farming_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_advisory_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_solution_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_solution_bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agro_recommendation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read region profiles" ON public.agro_region_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read soil profiles" ON public.agro_soil_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read farming systems" ON public.agro_farming_systems FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read advisory rules" ON public.agro_advisory_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read solution bundles" ON public.agro_solution_bundles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read bundle items" ON public.agro_solution_bundle_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage region profiles" ON public.agro_region_profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage soil profiles" ON public.agro_soil_profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage farming systems" ON public.agro_farming_systems FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage advisory rules" ON public.agro_advisory_rules FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage solution bundles" ON public.agro_solution_bundles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage bundle items" ON public.agro_solution_bundle_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Users read own recommendations" ON public.agro_recommendations FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users create own recommendations" ON public.agro_recommendations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own recommendations" ON public.agro_recommendations FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users read own rec items" ON public.agro_recommendation_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.agro_recommendations r WHERE r.id = recommendation_id AND (r.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Users manage own rec items" ON public.agro_recommendation_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.agro_recommendations r WHERE r.id = recommendation_id AND (r.user_id = auth.uid() OR public.is_admin()))) WITH CHECK (EXISTS (SELECT 1 FROM public.agro_recommendations r WHERE r.id = recommendation_id AND (r.user_id = auth.uid() OR public.is_admin())));

CREATE INDEX idx_agro_advisory_rules_crop ON public.agro_advisory_rules(crop);
CREATE INDEX idx_agro_advisory_rules_region ON public.agro_advisory_rules(region_profile_id);
CREATE INDEX idx_agro_recommendations_user ON public.agro_recommendations(user_id);
CREATE INDEX idx_agro_recommendations_status ON public.agro_recommendations(status);
CREATE INDEX idx_agro_recommendation_items_rec ON public.agro_recommendation_items(recommendation_id);
CREATE INDEX idx_agro_solution_bundle_items_bundle ON public.agro_solution_bundle_items(bundle_id);

INSERT INTO public.agro_farming_systems (system_name, system_code, description) VALUES
  ('Dryland Grain', 'dryland_grain', 'Rain-fed grain production'),
  ('Irrigated Grain', 'irrigated_grain', 'Irrigated grain production'),
  ('Dryland Oilseed', 'dryland_oilseed', 'Rain-fed oilseed production'),
  ('Irrigated Vegetables', 'irrigated_vegetables', 'Irrigated vegetable production'),
  ('Conservation Agriculture', 'conservation_ag', 'Minimum tillage conservation farming'),
  ('Conventional Tillage', 'conventional_tillage', 'Standard tillage grain production'),
  ('Emerging Farmer', 'emerging_farmer', 'Smallholder and emerging farmer production'),
  ('Commercial Large-Scale', 'commercial_large', 'Large-scale commercial production');

INSERT INTO public.agro_soil_profiles (profile_name, texture_class, drainage, water_holding, leaching_risk, nutrient_holding, agronomic_notes) VALUES
  ('Sandy Soil', 'sandy', 'good', 'low', 'high', 'low', 'Requires more frequent fertilization. Prone to leaching. Consider split applications.'),
  ('Sandy Loam', 'sandy_loam', 'good', 'medium', 'medium', 'medium', 'Good all-round soil for most crops. Moderate fertility retention.'),
  ('Loam', 'loam', 'moderate', 'medium', 'low', 'medium', 'Ideal texture for most crops. Good balance of drainage and retention.'),
  ('Clay Loam', 'clay_loam', 'moderate', 'high', 'low', 'high', 'Good nutrient retention. Watch for waterlogging in wet seasons.'),
  ('Heavy Clay', 'heavy_clay', 'poor', 'high', 'low', 'high', 'High fertility but drainage concerns. Avoid planting too early after rain.');

INSERT INTO public.agro_region_profiles (country, province, production_zone, rainfall_class, dominant_soil_patterns, common_crops, preferred_planting_windows, agronomic_notes) VALUES
  ('South Africa', 'Mpumalanga', 'Mpumalanga Highveld', 'medium', ARRAY['sandy_loam', 'loam'], ARRAY['maize', 'soybean', 'sunflower'], 'October–November', 'Strong maize and soybean area. Watch for late frost.'),
  ('South Africa', 'Free State', 'Eastern Free State', 'medium', ARRAY['loam', 'clay_loam'], ARRAY['maize', 'soybean', 'sorghum'], 'November–December', 'Primary grain belt. Variable rainfall.'),
  ('South Africa', 'Limpopo', 'Limpopo Dryland', 'low', ARRAY['sandy', 'sandy_loam'], ARRAY['maize', 'sunflower', 'sorghum'], 'November–December', 'Hot and dry. Drought-tolerant varieties recommended.'),
  ('South Africa', 'Gauteng', 'Gauteng Grain', 'medium', ARRAY['loam', 'clay_loam'], ARRAY['maize', 'soybean'], 'October–November', 'Urban-fringe production. Good infrastructure access.'),
  ('South Africa', 'KwaZulu-Natal', 'KZN Midlands', 'high', ARRAY['loam', 'clay_loam'], ARRAY['maize', 'soybean', 'dry_beans'], 'October–November', 'Higher rainfall. Disease pressure higher. Fungicide programs important.');
