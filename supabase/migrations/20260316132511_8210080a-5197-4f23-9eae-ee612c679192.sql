-- Stock Adjustment number sequence
CREATE SEQUENCE IF NOT EXISTS public.sa_number_seq START WITH 500001 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_sa_number()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'SA-' || nextval('public.sa_number_seq')::text;
$$;

-- Journal Entry number sequence
CREATE SEQUENCE IF NOT EXISTS public.je_number_seq START WITH 600001 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_je_number()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'JE-' || nextval('public.je_number_seq')::text;
$$;