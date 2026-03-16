
-- ============================================================
-- AR/AP Foundation: Credit Notes, Supplier Payments, Debtor/Creditor Ledgers
-- ============================================================

-- 1. Customer Credit Notes
CREATE TABLE IF NOT EXISTS public.customer_credit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_number text NOT NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES public.customer_invoices(id) ON DELETE SET NULL,
  issue_date date NOT NULL DEFAULT current_date,
  reason_code text NOT NULL DEFAULT 'other',
  notes text,
  subtotal_amount numeric(14,2) NOT NULL DEFAULT 0,
  tax_amount numeric(14,2) NOT NULL DEFAULT 0,
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  currency_code text NOT NULL DEFAULT 'ZAR',
  status text NOT NULL DEFAULT 'draft',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_credit_note_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_id uuid NOT NULL REFERENCES public.customer_credit_notes(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit_price numeric(14,2) NOT NULL DEFAULT 0,
  line_total numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Supplier Credit Notes
CREATE TABLE IF NOT EXISTS public.supplier_credit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_number text NOT NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_invoice_id uuid REFERENCES public.supplier_invoices(id) ON DELETE SET NULL,
  issue_date date NOT NULL DEFAULT current_date,
  reason_code text NOT NULL DEFAULT 'other',
  notes text,
  subtotal_amount numeric(14,2) NOT NULL DEFAULT 0,
  tax_amount numeric(14,2) NOT NULL DEFAULT 0,
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  currency_code text NOT NULL DEFAULT 'ZAR',
  status text NOT NULL DEFAULT 'draft',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supplier_credit_note_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_id uuid NOT NULL REFERENCES public.supplier_credit_notes(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit_price numeric(14,2) NOT NULL DEFAULT 0,
  line_total numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Supplier Payments
CREATE TABLE IF NOT EXISTS public.supplier_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number text NOT NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_invoice_id uuid REFERENCES public.supplier_invoices(id) ON DELETE SET NULL,
  payment_date date NOT NULL DEFAULT current_date,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  currency_code text NOT NULL DEFAULT 'ZAR',
  payment_method text NOT NULL DEFAULT 'bank_transfer',
  payment_reference text,
  notes text,
  payment_status text NOT NULL DEFAULT 'pending',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Add paid_amount to supplier_invoices
ALTER TABLE public.supplier_invoices ADD COLUMN IF NOT EXISTS paid_amount numeric(14,2) NOT NULL DEFAULT 0;
ALTER TABLE public.supplier_invoices ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id);

-- 5. Document number sequences
CREATE SEQUENCE IF NOT EXISTS public.ccn_number_seq START 100001;
CREATE SEQUENCE IF NOT EXISTS public.scn_number_seq START 100001;
CREATE SEQUENCE IF NOT EXISTS public.sp_number_seq START 100001;

CREATE OR REPLACE FUNCTION public.generate_ccn_number() RETURNS text LANGUAGE sql AS $$
  SELECT 'CCN-' || nextval('public.ccn_number_seq')::text;
$$;

CREATE OR REPLACE FUNCTION public.generate_scn_number() RETURNS text LANGUAGE sql AS $$
  SELECT 'SCN-' || nextval('public.scn_number_seq')::text;
$$;

CREATE OR REPLACE FUNCTION public.generate_sp_number() RETURNS text LANGUAGE sql AS $$
  SELECT 'SP-' || nextval('public.sp_number_seq')::text;
$$;

-- 6. RLS policies
ALTER TABLE public.customer_credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_credit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_credit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_payments ENABLE ROW LEVEL SECURITY;

-- Customer credit notes - admin + sales
CREATE POLICY "ccn_select" ON public.customer_credit_notes FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('sales_manager') OR public.has_role('accountant'));
CREATE POLICY "ccn_insert" ON public.customer_credit_notes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('sales_manager') OR public.has_role('accountant'));
CREATE POLICY "ccn_update" ON public.customer_credit_notes FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.has_role('accountant'));

CREATE POLICY "ccni_select" ON public.customer_credit_note_items FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('sales_manager') OR public.has_role('accountant'));
CREATE POLICY "ccni_insert" ON public.customer_credit_note_items FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('sales_manager') OR public.has_role('accountant'));

-- Supplier credit notes - admin + procurement
CREATE POLICY "scn_select" ON public.supplier_credit_notes FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('procurement_officer') OR public.has_role('accountant'));
CREATE POLICY "scn_insert" ON public.supplier_credit_notes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('procurement_officer') OR public.has_role('accountant'));
CREATE POLICY "scn_update" ON public.supplier_credit_notes FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.has_role('accountant'));

CREATE POLICY "scni_select" ON public.supplier_credit_note_items FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('procurement_officer') OR public.has_role('accountant'));
CREATE POLICY "scni_insert" ON public.supplier_credit_note_items FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('procurement_officer') OR public.has_role('accountant'));

-- Supplier payments
CREATE POLICY "sp_select" ON public.supplier_payments FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role('procurement_officer') OR public.has_role('accountant'));
CREATE POLICY "sp_insert" ON public.supplier_payments FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role('accountant'));
CREATE POLICY "sp_update" ON public.supplier_payments FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.has_role('accountant'));
