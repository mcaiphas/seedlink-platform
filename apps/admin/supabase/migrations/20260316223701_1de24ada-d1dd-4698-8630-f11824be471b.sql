
-- VAT Codes master table
CREATE TABLE IF NOT EXISTS public.vat_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_name text NOT NULL UNIQUE,
  rate_percent numeric(5,2) NOT NULL DEFAULT 15.00,
  vat_direction text NOT NULL DEFAULT 'output' CHECK (vat_direction IN ('input', 'output', 'both')),
  gl_account_id uuid REFERENCES public.gl_accounts(id),
  is_active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed default VAT codes
INSERT INTO public.vat_codes (code_name, rate_percent, vat_direction, description) VALUES
  ('Standard (15%)', 15.00, 'both', 'Standard rated VAT at 15%'),
  ('Zero Rated', 0.00, 'both', 'Zero rated supplies'),
  ('Exempt', 0.00, 'both', 'VAT exempt supplies'),
  ('Out of Scope', 0.00, 'both', 'Outside the scope of VAT');

-- VAT periods table
CREATE TABLE IF NOT EXISTS public.vat_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'submitted')),
  submitted_at timestamptz,
  submitted_by uuid REFERENCES public.profiles(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.vat_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read vat_codes" ON public.vat_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage vat_codes" ON public.vat_codes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can read vat_periods" ON public.vat_periods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage vat_periods" ON public.vat_periods FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
