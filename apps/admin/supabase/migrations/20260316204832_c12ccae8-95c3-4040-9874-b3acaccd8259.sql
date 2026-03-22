
-- ============================================================
-- MASTER DATA: customers, customer_documents, supplier banking, supplier_documents
-- ============================================================

-- 1. Customers table
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_code text,
  customer_type text NOT NULL DEFAULT 'farmer',
  customer_category text NOT NULL DEFAULT 'commercial_farmer',
  registration_number text,
  vat_number text,
  country text DEFAULT 'ZA',
  province text,
  city text,
  physical_address text,
  postal_address text,
  contact_name text,
  contact_email text,
  contact_phone text,
  contact_mobile text,
  account_manager text,
  payment_terms text DEFAULT 'net_30',
  credit_limit numeric(14,2) DEFAULT 0,
  currency_code text DEFAULT 'ZAR',
  account_status text DEFAULT 'active',
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_select" ON public.customers FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('sales_manager') OR public.has_role('procurement_officer') OR public.has_role('accountant'));

CREATE POLICY "customers_insert" ON public.customers FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('sales_manager'));

CREATE POLICY "customers_update" ON public.customers FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.has_role('sales_manager'))
  WITH CHECK (public.is_admin() OR public.has_role('sales_manager'));

CREATE POLICY "customers_delete" ON public.customers FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Customer documents
CREATE TABLE public.customer_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL DEFAULT 'general',
  file_url text,
  uploaded_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_documents_select" ON public.customer_documents FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('sales_manager'));

CREATE POLICY "customer_documents_insert" ON public.customer_documents FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('sales_manager'));

CREATE POLICY "customer_documents_delete" ON public.customer_documents FOR DELETE TO authenticated
  USING (public.is_admin());

-- 3. Supplier documents
CREATE TABLE public.supplier_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL DEFAULT 'general',
  file_url text,
  uploaded_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supplier_documents_select" ON public.supplier_documents FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('procurement_officer'));

CREATE POLICY "supplier_documents_insert" ON public.supplier_documents FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('procurement_officer'));

CREATE POLICY "supplier_documents_delete" ON public.supplier_documents FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. Add banking fields to suppliers
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS bank_account_name text,
  ADD COLUMN IF NOT EXISTS bank_account_number text,
  ADD COLUMN IF NOT EXISTS bank_branch_code text,
  ADD COLUMN IF NOT EXISTS bank_swift_code text,
  ADD COLUMN IF NOT EXISTS bank_country text,
  ADD COLUMN IF NOT EXISTS default_payment_method text DEFAULT 'eft',
  ADD COLUMN IF NOT EXISTS supplier_credit_limit numeric(14,2) DEFAULT 0;
