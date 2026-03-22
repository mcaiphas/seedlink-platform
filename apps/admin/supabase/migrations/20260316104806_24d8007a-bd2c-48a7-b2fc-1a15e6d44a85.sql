
-- Create sequences for document numbering
CREATE SEQUENCE IF NOT EXISTS public.po_number_seq START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.gr_number_seq START WITH 200001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.si_number_seq START WITH 300001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.ci_number_seq START WITH 400001 INCREMENT BY 1;

-- Create helper functions to generate document numbers
CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'PO-' || nextval('public.po_number_seq')::text;
$$;

CREATE OR REPLACE FUNCTION public.generate_gr_number()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'GR-' || nextval('public.gr_number_seq')::text;
$$;

CREATE OR REPLACE FUNCTION public.generate_si_number()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'SI-' || nextval('public.si_number_seq')::text;
$$;

CREATE OR REPLACE FUNCTION public.generate_ci_number()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'INV-' || nextval('public.ci_number_seq')::text;
$$;
