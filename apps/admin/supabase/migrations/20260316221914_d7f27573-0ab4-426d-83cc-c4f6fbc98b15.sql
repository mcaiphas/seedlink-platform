
-- Extend notification_templates with needed columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_templates' AND column_name='description') THEN
    ALTER TABLE public.notification_templates ADD COLUMN description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_templates' AND column_name='trigger_event') THEN
    ALTER TABLE public.notification_templates ADD COLUMN trigger_event text NOT NULL DEFAULT 'manual';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_templates' AND column_name='recipient_type') THEN
    ALTER TABLE public.notification_templates ADD COLUMN recipient_type text NOT NULL DEFAULT 'customer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_templates' AND column_name='recipient_config') THEN
    ALTER TABLE public.notification_templates ADD COLUMN recipient_config jsonb DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_templates' AND column_name='sort_order') THEN
    ALTER TABLE public.notification_templates ADD COLUMN sort_order int NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_templates' AND column_name='created_by') THEN
    ALTER TABLE public.notification_templates ADD COLUMN created_by uuid REFERENCES public.profiles(id);
  END IF;
END$$;

-- Bank Transaction Review / Classification
CREATE TABLE IF NOT EXISTS public.bank_transaction_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_transaction_id uuid NOT NULL REFERENCES public.bank_transactions(id) ON DELETE CASCADE,
  classification text NOT NULL DEFAULT 'unknown',
  income_category text,
  expense_category text,
  business_line text,
  branch text,
  depot_id uuid REFERENCES public.depots(id),
  segment text,
  gl_account_id uuid REFERENCES public.gl_accounts(id),
  notes text,
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  review_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bank_transaction_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='bank_transaction_reviews' AND policyname='Admin/finance access bank_transaction_reviews') THEN
    CREATE POLICY "Admin/finance access bank_transaction_reviews"
      ON public.bank_transaction_reviews FOR ALL TO authenticated
      USING (public.current_user_has_any_role(ARRAY['super_admin','admin','finance_manager','accountant']));
  END IF;
END$$;

-- Add product_id to line item tables that lack it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customer_invoice_items' AND column_name='product_id') THEN
    ALTER TABLE public.customer_invoice_items ADD COLUMN product_id uuid REFERENCES public.products(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customer_invoice_items' AND column_name='variant_id') THEN
    ALTER TABLE public.customer_invoice_items ADD COLUMN variant_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proforma_invoice_items' AND column_name='product_id') THEN
    ALTER TABLE public.proforma_invoice_items ADD COLUMN product_id uuid REFERENCES public.products(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proforma_invoice_items' AND column_name='variant_id') THEN
    ALTER TABLE public.proforma_invoice_items ADD COLUMN variant_id uuid;
  END IF;
END$$;
