
-- =====================================================
-- Order-to-Cash Schema: Quotes, Proformas, Payment Requests
-- =====================================================

-- 1. Enhance orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id),
  ADD COLUMN IF NOT EXISTS depot_id uuid REFERENCES public.depots(id),
  ADD COLUMN IF NOT EXISTS sales_rep_id uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS payment_terms text DEFAULT 'net_30',
  ADD COLUMN IF NOT EXISTS delivery_terms text,
  ADD COLUMN IF NOT EXISTS order_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS quote_id uuid;

-- 2. Enhance customer_invoices
ALTER TABLE public.customer_invoices
  ADD COLUMN IF NOT EXISTS paid_amount numeric DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS sales_rep_id uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS payment_terms text DEFAULT 'net_30',
  ADD COLUMN IF NOT EXISTS tax_rate numeric DEFAULT 15;

-- 3. Enhance payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id),
  ADD COLUMN IF NOT EXISTS customer_invoice_id uuid REFERENCES public.customer_invoices(id),
  ADD COLUMN IF NOT EXISTS allocated_amount numeric DEFAULT 0;

-- 4. Quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text NOT NULL,
  customer_id uuid REFERENCES public.customers(id),
  quote_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  sales_rep_id uuid REFERENCES public.profiles(id),
  currency_code text NOT NULL DEFAULT 'ZAR',
  payment_terms text DEFAULT 'net_30',
  delivery_terms text,
  subtotal_amount numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  tax_rate numeric DEFAULT 15,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Quote line items
CREATE TABLE IF NOT EXISTS public.quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  description text,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  weight_kg numeric DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Proforma invoices
CREATE TABLE IF NOT EXISTS public.proforma_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proforma_number text NOT NULL,
  customer_id uuid REFERENCES public.customers(id),
  quote_id uuid REFERENCES public.quotes(id),
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  sales_rep_id uuid REFERENCES public.profiles(id),
  currency_code text NOT NULL DEFAULT 'ZAR',
  payment_terms text DEFAULT 'net_30',
  subtotal_amount numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  tax_rate numeric DEFAULT 15,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  converted_order_id uuid REFERENCES public.orders(id),
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Proforma invoice line items
CREATE TABLE IF NOT EXISTS public.proforma_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proforma_invoice_id uuid NOT NULL REFERENCES public.proforma_invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  pack_size_id uuid REFERENCES public.product_pack_sizes(id),
  description text,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  weight_kg numeric DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Payment requests
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text NOT NULL,
  customer_id uuid REFERENCES public.customers(id),
  reference_type text NOT NULL,
  reference_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency_code text NOT NULL DEFAULT 'ZAR',
  due_date date,
  status text NOT NULL DEFAULT 'pending',
  payment_link text,
  gateway_code text,
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Add quote_id FK on orders
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'orders_quote_id_fkey') THEN
    ALTER TABLE public.orders ADD CONSTRAINT orders_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id);
  END IF;
END $$;

-- 10. Document number generators
CREATE OR REPLACE FUNCTION public.generate_qt_number()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE next_val bigint;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(quote_number, '[^0-9]', '', 'g'), '')::bigint), 700000) + 1
    INTO next_val FROM public.quotes;
  RETURN 'QT-' || next_val;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_pi_number()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE next_val bigint;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(proforma_number, '[^0-9]', '', 'g'), '')::bigint), 800000) + 1
    INTO next_val FROM public.proforma_invoices;
  RETURN 'PI-' || next_val;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_pr_number()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE next_val bigint;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(request_number, '[^0-9]', '', 'g'), '')::bigint), 900000) + 1
    INTO next_val FROM public.payment_requests;
  RETURN 'PR-' || next_val;
END;
$$;

-- 11. RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proforma_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proforma_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes_select" ON public.quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "quotes_insert" ON public.quotes FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "quotes_update" ON public.quotes FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "quotes_delete" ON public.quotes FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "quote_items_select" ON public.quote_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "quote_items_insert" ON public.quote_items FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "quote_items_update" ON public.quote_items FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "quote_items_delete" ON public.quote_items FOR DELETE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);

CREATE POLICY "proforma_select" ON public.proforma_invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "proforma_insert" ON public.proforma_invoices FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "proforma_update" ON public.proforma_invoices FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "proforma_delete" ON public.proforma_invoices FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "proforma_items_select" ON public.proforma_invoice_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "proforma_items_insert" ON public.proforma_invoice_items FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "proforma_items_update" ON public.proforma_invoice_items FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);
CREATE POLICY "proforma_items_delete" ON public.proforma_invoice_items FOR DELETE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer')
);

CREATE POLICY "payment_requests_select" ON public.payment_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "payment_requests_insert" ON public.payment_requests FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer') OR public.has_role('accountant')
);
CREATE POLICY "payment_requests_update" ON public.payment_requests FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.has_role('sales_manager') OR public.has_role('accountant')
);
CREATE POLICY "payment_requests_delete" ON public.payment_requests FOR DELETE TO authenticated USING (public.is_admin());
