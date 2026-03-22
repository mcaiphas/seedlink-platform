
-- =====================================================
-- Procurement & Supplier Management Layer
-- =====================================================

-- 1. Extend suppliers table with commercial/category fields
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS supplier_type text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS company_registration text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'ZA',
  ADD COLUMN IF NOT EXISTS province text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS physical_address text,
  ADD COLUMN IF NOT EXISTS postal_address text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS lead_time_days integer,
  ADD COLUMN IF NOT EXISTS supplier_category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS contract_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS is_preferred boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text;

-- 2. Supplier contacts table
CREATE TABLE IF NOT EXISTS public.supplier_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  contact_name text NOT NULL,
  role_title text,
  email text,
  phone text,
  mobile text,
  is_primary boolean DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supplier_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage supplier contacts" ON public.supplier_contacts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Supplier-product relationships
CREATE TABLE IF NOT EXISTS public.supplier_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  supplier_product_code text,
  is_preferred boolean DEFAULT false,
  standard_cost numeric(14,2),
  minimum_order_qty numeric(14,2),
  lead_time_days integer,
  last_purchase_price numeric(14,2),
  contract_price numeric(14,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(supplier_id, product_id)
);

ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage supplier products" ON public.supplier_products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Extend purchase_order_items with pack_size and weight
ALTER TABLE public.purchase_order_items
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id),
  ADD COLUMN IF NOT EXISTS pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  ADD COLUMN IF NOT EXISTS weight_equivalent_kg numeric(14,4),
  ADD COLUMN IF NOT EXISTS quantity_received numeric(14,4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supplier_product_code text;

-- 5. Extend purchase_orders with payment_terms and approval
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS payment_terms text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

-- 6. Add accepted_quantity to goods_receipt_items if missing
ALTER TABLE public.goods_receipt_items
  ADD COLUMN IF NOT EXISTS accepted_quantity numeric(14,4);

-- Default accepted_quantity to quantity_received where null
UPDATE public.goods_receipt_items 
SET accepted_quantity = quantity_received 
WHERE accepted_quantity IS NULL;
