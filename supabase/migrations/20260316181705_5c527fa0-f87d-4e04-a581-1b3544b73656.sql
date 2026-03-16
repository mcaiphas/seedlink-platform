
-- Extend depots table with operational fields
ALTER TABLE public.depots
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS province text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'ZA',
  ADD COLUMN IF NOT EXISTS physical_address text,
  ADD COLUMN IF NOT EXISTS gps_lat numeric(10,7),
  ADD COLUMN IF NOT EXISTS gps_lng numeric(10,7),
  ADD COLUMN IF NOT EXISTS contact_person text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS storage_category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false;

-- Extend product_pack_sizes with seed-count and conversion fields
ALTER TABLE public.product_pack_sizes
  ADD COLUMN IF NOT EXISTS display_label text,
  ADD COLUMN IF NOT EXISTS packaging_type text DEFAULT 'bag',
  ADD COLUMN IF NOT EXISTS seed_count_label text,
  ADD COLUMN IF NOT EXISTS conversion_factor_kg numeric(10,4),
  ADD COLUMN IF NOT EXISTS crop_type text,
  ADD COLUMN IF NOT EXISTS description text;

-- Create depot_inventory table: tracks stock by product + pack_size + depot
CREATE TABLE IF NOT EXISTS public.depot_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  pack_size_id uuid REFERENCES public.product_pack_sizes(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  depot_id uuid NOT NULL REFERENCES public.depots(id) ON DELETE CASCADE,
  sku text,
  quantity_on_hand numeric(14,2) NOT NULL DEFAULT 0,
  quantity_reserved numeric(14,2) NOT NULL DEFAULT 0,
  quantity_available numeric(14,2) GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  reorder_level numeric(14,2) DEFAULT 0,
  weight_equivalent_kg numeric(10,4),
  last_movement_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, pack_size_id, depot_id)
);

-- RLS for depot_inventory
ALTER TABLE public.depot_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage depot_inventory"
  ON public.depot_inventory FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view depot_inventory"
  ON public.depot_inventory FOR SELECT TO authenticated
  USING (true);

-- Trigger for updated_at on depot_inventory
CREATE TRIGGER set_depot_inventory_updated_at
  BEFORE UPDATE ON public.depot_inventory
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
