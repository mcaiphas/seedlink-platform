
-- =====================================================
-- Logistics Intelligence & Delivery Execution Schema
-- =====================================================

-- Vehicle types reference table
CREATE TABLE public.vehicle_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_code text NOT NULL UNIQUE,
  vehicle_name text NOT NULL,
  max_weight_kg numeric(10,2) NOT NULL DEFAULT 0,
  max_volume_m3 numeric(10,2),
  base_rate numeric(12,2) DEFAULT 0,
  per_km_rate numeric(8,2) DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vehicle types"
  ON public.vehicle_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage vehicle types"
  ON public.vehicle_types FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Seed vehicle types
INSERT INTO public.vehicle_types (vehicle_code, vehicle_name, max_weight_kg, base_rate, per_km_rate) VALUES
  ('motorbike', 'Motorbike', 50, 150, 3.50),
  ('bakkie', 'Bakkie / Pickup', 800, 350, 5.00),
  ('panel_van', 'Panel Van', 1200, 450, 5.50),
  ('1ton', '1-Ton Truck', 1000, 500, 6.00),
  ('2ton', '2-Ton Truck', 2000, 650, 7.00),
  ('4ton', '4-Ton Truck', 4000, 900, 8.50),
  ('8ton', '8-Ton Truck', 8000, 1400, 10.00),
  ('16ton', '16-Ton Truck', 16000, 2200, 12.50),
  ('34ton', '34-Ton Articulated', 34000, 4500, 15.00);

-- Logistics delivery requests
CREATE TABLE public.logistics_delivery_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text UNIQUE,
  order_id uuid REFERENCES public.orders(id),
  customer_id uuid REFERENCES public.customers(id),
  origin_depot_id uuid REFERENCES public.depots(id),
  farm_id uuid REFERENCES public.farms(id),
  crop_plan_id uuid REFERENCES public.crop_plans(id),

  -- Addresses
  pickup_address text,
  pickup_lat numeric(10,7),
  pickup_lng numeric(10,7),
  delivery_address text,
  delivery_lat numeric(10,7),
  delivery_lng numeric(10,7),

  -- Cargo
  total_weight_kg numeric(12,2) DEFAULT 0,
  total_volume_m3 numeric(10,2),
  cargo_description text,
  special_requirements text,

  -- Scheduling
  preferred_date date,
  preferred_window text,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent','normal','scheduled')),

  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','planning','dispatched','vehicle_assigned','in_transit',
    'delivered','delivery_failed','cancelled'
  )),

  -- Cost
  estimated_distance_km numeric(10,2),
  estimated_cost numeric(12,2),
  actual_cost numeric(12,2),

  -- Tracking
  vehicle_type_id uuid REFERENCES public.vehicle_types(id),
  assigned_vehicle_reg text,
  driver_name text,
  driver_phone text,
  drovvi_request_id text,

  -- POD
  pod_type text,
  pod_file_path text,
  pod_notes text,
  delivered_at timestamptz,

  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.logistics_delivery_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view delivery requests"
  ON public.logistics_delivery_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized users can create delivery requests"
  ON public.logistics_delivery_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage delivery requests"
  ON public.logistics_delivery_requests FOR UPDATE TO authenticated
  USING (public.is_admin() OR created_by = auth.uid());
CREATE POLICY "Admins can delete delivery requests"
  ON public.logistics_delivery_requests FOR DELETE TO authenticated
  USING (public.is_admin());

-- Delivery request items (what products are in the shipment)
CREATE TABLE public.logistics_delivery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_request_id uuid NOT NULL REFERENCES public.logistics_delivery_requests(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  variant_id uuid REFERENCES public.product_variants(id),
  pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  description text,
  quantity numeric(12,2) NOT NULL DEFAULT 1,
  weight_per_unit_kg numeric(10,2) DEFAULT 0,
  total_weight_kg numeric(12,2) GENERATED ALWAYS AS (quantity * COALESCE(weight_per_unit_kg, 0)) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.logistics_delivery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view delivery items"
  ON public.logistics_delivery_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage delivery items"
  ON public.logistics_delivery_items FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Delivery status tracking log
CREATE TABLE public.logistics_status_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_request_id uuid NOT NULL REFERENCES public.logistics_delivery_requests(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text,
  location_lat numeric(10,7),
  location_lng numeric(10,7),
  recorded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.logistics_status_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view status log"
  ON public.logistics_status_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert status log"
  ON public.logistics_status_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Vehicle rate table for logistics cost calculation
CREATE TABLE public.logistics_rate_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type_id uuid NOT NULL REFERENCES public.vehicle_types(id),
  route_type text NOT NULL DEFAULT 'standard',
  min_distance_km numeric(10,2) DEFAULT 0,
  max_distance_km numeric(10,2),
  base_rate numeric(12,2) NOT NULL DEFAULT 0,
  per_km_rate numeric(8,2) NOT NULL DEFAULT 0,
  per_ton_rate numeric(8,2) DEFAULT 0,
  waiting_fee_per_hour numeric(8,2) DEFAULT 0,
  handling_fee numeric(8,2) DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.logistics_rate_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view rate cards"
  ON public.logistics_rate_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage rate cards"
  ON public.logistics_rate_cards FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Delivery request number sequence
CREATE SEQUENCE IF NOT EXISTS public.logistics_delivery_seq START 100001;

CREATE OR REPLACE FUNCTION public.generate_delivery_number()
  RETURNS text
  LANGUAGE sql
  SET search_path TO 'public'
AS $$
  SELECT 'DEL-' || lpad(nextval('public.logistics_delivery_seq')::text, 6, '0');
$$;

-- Auto-set request number on insert
CREATE OR REPLACE FUNCTION public.set_delivery_request_number()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.request_number IS NULL THEN
    NEW.request_number := public.generate_delivery_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_delivery_request_number
  BEFORE INSERT ON public.logistics_delivery_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_delivery_request_number();

-- Indexes for performance
CREATE INDEX idx_logistics_delivery_status ON public.logistics_delivery_requests(status);
CREATE INDEX idx_logistics_delivery_order ON public.logistics_delivery_requests(order_id);
CREATE INDEX idx_logistics_delivery_depot ON public.logistics_delivery_requests(origin_depot_id);
CREATE INDEX idx_logistics_delivery_customer ON public.logistics_delivery_requests(customer_id);
CREATE INDEX idx_logistics_delivery_date ON public.logistics_delivery_requests(preferred_date);
CREATE INDEX idx_logistics_items_request ON public.logistics_delivery_items(delivery_request_id);
CREATE INDEX idx_logistics_status_log_request ON public.logistics_status_log(delivery_request_id);
CREATE INDEX idx_logistics_rate_cards_vehicle ON public.logistics_rate_cards(vehicle_type_id);
