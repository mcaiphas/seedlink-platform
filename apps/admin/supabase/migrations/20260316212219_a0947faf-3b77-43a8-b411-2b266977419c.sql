
-- Customer communication logs
CREATE TABLE IF NOT EXISTS public.customer_communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  action text NOT NULL,
  action_type text NOT NULL DEFAULT 'general',
  reference_type text,
  reference_id uuid,
  notes text,
  performed_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_communication_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and sales can manage communication logs"
  ON public.customer_communication_logs
  FOR ALL TO authenticated
  USING (public.current_user_has_any_role(ARRAY['super_admin','admin','sales_manager','accountant']));

-- Refunds table
CREATE TABLE IF NOT EXISTS public.customer_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_number text NOT NULL,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  credit_note_id uuid REFERENCES public.customer_credit_notes(id),
  invoice_id uuid,
  refund_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  refund_method text NOT NULL DEFAULT 'bank_transfer',
  payment_reference text,
  gateway_transaction_id text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and finance can manage refunds"
  ON public.customer_refunds
  FOR ALL TO authenticated
  USING (public.current_user_has_any_role(ARRAY['super_admin','admin','accountant','sales_manager']));

-- Refund number sequence
CREATE SEQUENCE IF NOT EXISTS public.refund_number_seq START WITH 1100001;

CREATE OR REPLACE FUNCTION public.generate_refund_number()
RETURNS text LANGUAGE sql AS $$
  SELECT 'RF-' || nextval('public.refund_number_seq')::text;
$$;

-- Add applied_to_invoice and refunded status support to credit notes
ALTER TABLE public.customer_credit_notes
  ADD COLUMN IF NOT EXISTS applied_invoice_id uuid,
  ADD COLUMN IF NOT EXISTS refund_id uuid;

-- Payment gateway transactions table for online payment tracking
CREATE TABLE IF NOT EXISTS public.payment_gateway_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES public.payments(id),
  payment_request_id uuid REFERENCES public.payment_requests(id),
  gateway_code text NOT NULL,
  gateway_transaction_id text,
  gateway_status text NOT NULL DEFAULT 'initiated',
  amount numeric(14,2) NOT NULL,
  currency_code text NOT NULL DEFAULT 'ZAR',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_gateway_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and finance can manage gateway transactions"
  ON public.payment_gateway_transactions
  FOR ALL TO authenticated
  USING (public.current_user_has_any_role(ARRAY['super_admin','admin','accountant','sales_manager']));

-- Reminder templates
CREATE TABLE IF NOT EXISTS public.reminder_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code text NOT NULL UNIQUE,
  template_name text NOT NULL,
  subject_template text NOT NULL,
  body_template text NOT NULL,
  reminder_type text NOT NULL DEFAULT 'invoice_due',
  days_offset integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminder_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage reminder templates"
  ON public.reminder_templates
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Seed default reminder templates
INSERT INTO public.reminder_templates (template_code, template_name, subject_template, body_template, reminder_type, days_offset)
VALUES
  ('invoice_due_7', 'Invoice Due in 7 Days', 'Payment Reminder: Invoice {{invoice_number}} due in 7 days', 'Dear {{customer_name}}, your invoice {{invoice_number}} for {{amount}} is due on {{due_date}}.', 'invoice_due', -7),
  ('invoice_due_1', 'Invoice Due Tomorrow', 'Payment Reminder: Invoice {{invoice_number}} due tomorrow', 'Dear {{customer_name}}, your invoice {{invoice_number}} for {{amount}} is due tomorrow.', 'invoice_due', -1),
  ('invoice_overdue_7', 'Invoice Overdue 7 Days', 'Overdue Notice: Invoice {{invoice_number}}', 'Dear {{customer_name}}, your invoice {{invoice_number}} for {{amount}} is now 7 days overdue.', 'overdue', 7),
  ('invoice_overdue_30', 'Invoice Overdue 30 Days', 'Urgent: Invoice {{invoice_number}} - 30 days overdue', 'Dear {{customer_name}}, your invoice {{invoice_number}} for {{amount}} is now 30 days overdue.', 'overdue', 30),
  ('statement_monthly', 'Monthly Statement', 'Your Monthly Account Statement', 'Dear {{customer_name}}, please find your monthly account statement attached.', 'statement', 0)
ON CONFLICT (template_code) DO NOTHING;
