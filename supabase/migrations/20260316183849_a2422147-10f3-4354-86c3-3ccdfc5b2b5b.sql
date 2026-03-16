-- ============================================================
-- Warehouse Operations Layer
-- ============================================================

-- 1. Extend stock_movements
ALTER TABLE public.stock_movements
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id),
  ADD COLUMN IF NOT EXISTS pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  ADD COLUMN IF NOT EXISTS weight_equivalent_kg numeric(12,4),
  ADD COLUMN IF NOT EXISTS source_depot_id uuid REFERENCES public.depots(id),
  ADD COLUMN IF NOT EXISTS destination_depot_id uuid REFERENCES public.depots(id),
  ADD COLUMN IF NOT EXISTS reference_number text,
  ADD COLUMN IF NOT EXISTS reason_code text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed';

ALTER TABLE public.stock_movements ALTER COLUMN variant_id DROP NOT NULL;

-- 2. Extend stock_adjustment_items
ALTER TABLE public.stock_adjustment_items
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id),
  ADD COLUMN IF NOT EXISTS pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  ADD COLUMN IF NOT EXISTS adjustment_type text NOT NULL DEFAULT 'increase',
  ADD COLUMN IF NOT EXISTS weight_equivalent_kg numeric(12,4),
  ADD COLUMN IF NOT EXISTS quantity numeric(14,4) NOT NULL DEFAULT 0;

ALTER TABLE public.stock_adjustments
  ADD COLUMN IF NOT EXISTS reason_code text,
  ADD COLUMN IF NOT EXISTS adjustment_type text NOT NULL DEFAULT 'increase',
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS posted_at timestamptz;

-- 3. Extend stock_transfers
ALTER TABLE public.stock_transfers
  ADD COLUMN IF NOT EXISTS transfer_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS transfer_reason text,
  ADD COLUMN IF NOT EXISTS dispatched_at timestamptz,
  ADD COLUMN IF NOT EXISTS received_at timestamptz;

ALTER TABLE public.stock_transfer_items
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id),
  ADD COLUMN IF NOT EXISTS pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  ADD COLUMN IF NOT EXISTS weight_equivalent_kg numeric(12,4);

ALTER TABLE public.stock_transfer_items ALTER COLUMN variant_id DROP NOT NULL;

-- 4. Extend goods_receipts
ALTER TABLE public.goods_receipts
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'supplier_delivery';

ALTER TABLE public.goods_receipt_items
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id),
  ADD COLUMN IF NOT EXISTS pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  ADD COLUMN IF NOT EXISTS weight_equivalent_kg numeric(12,4);

-- 5. Create stock_counts
CREATE TABLE IF NOT EXISTS public.stock_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count_number text NOT NULL,
  depot_id uuid REFERENCES public.depots(id) NOT NULL,
  count_type text NOT NULL DEFAULT 'full',
  count_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  approved_by uuid REFERENCES public.profiles(id),
  posted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view stock_counts" ON public.stock_counts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert stock_counts" ON public.stock_counts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update stock_counts" ON public.stock_counts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 6. Create stock_count_items
CREATE TABLE IF NOT EXISTS public.stock_count_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_count_id uuid NOT NULL REFERENCES public.stock_counts(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  system_quantity numeric(14,4) NOT NULL DEFAULT 0,
  counted_quantity numeric(14,4),
  variance numeric(14,4) GENERATED ALWAYS AS (COALESCE(counted_quantity, 0) - system_quantity) STORED,
  weight_equivalent_kg numeric(12,4),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_count_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view stock_count_items" ON public.stock_count_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert stock_count_items" ON public.stock_count_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update stock_count_items" ON public.stock_count_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 7. Sequences
CREATE SEQUENCE IF NOT EXISTS public.stock_count_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_sc_number()
RETURNS text LANGUAGE sql AS $$
  SELECT 'SC-' || lpad(nextval('public.stock_count_seq')::text, 6, '0');
$$;

-- 8. Updated_at trigger
CREATE TRIGGER set_stock_counts_updated_at
  BEFORE UPDATE ON public.stock_counts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();