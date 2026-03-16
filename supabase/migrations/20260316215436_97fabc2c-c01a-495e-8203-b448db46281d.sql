
-- Accounting Periods
CREATE TABLE public.accounting_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_year text NOT NULL,
  period_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','locked')),
  closed_by uuid REFERENCES public.profiles(id),
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.accounting_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/accountant can manage accounting_periods" ON public.accounting_periods
  FOR ALL TO authenticated
  USING (public.current_user_has_any_role(ARRAY['super_admin','admin','accountant','finance_manager']));

-- Posting Rules
CREATE TABLE public.posting_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  source_type text NOT NULL,
  description text,
  debit_account_code text NOT NULL,
  credit_account_code text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posting_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/accountant can manage posting_rules" ON public.posting_rules
  FOR ALL TO authenticated
  USING (public.current_user_has_any_role(ARRAY['super_admin','admin','accountant','finance_manager']));

-- Enhance gl_accounts
ALTER TABLE public.gl_accounts
  ADD COLUMN IF NOT EXISTS parent_account_id uuid REFERENCES public.gl_accounts(id),
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS posting_allowed boolean NOT NULL DEFAULT true;

-- Add period_id to journal_entries
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS period_id uuid REFERENCES public.accounting_periods(id),
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS journal_type text NOT NULL DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS is_reversed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reversed_by_id uuid REFERENCES public.journal_entries(id);

-- Add dimensions to journal_entry_lines
ALTER TABLE public.journal_entry_lines
  ADD COLUMN IF NOT EXISTS customer_id uuid,
  ADD COLUMN IF NOT EXISTS supplier_id uuid,
  ADD COLUMN IF NOT EXISTS notes text;

-- Insert seed posting rules
INSERT INTO public.posting_rules (rule_name, source_type, description, debit_account_code, credit_account_code, sort_order) VALUES
  ('Customer Invoice - Revenue', 'customer_invoice', 'Debit Trade Debtors, Credit Revenue', '1200', '4100', 1),
  ('Customer Payment - Bank', 'customer_payment', 'Debit Bank, Credit Trade Debtors', '1000', '1200', 2),
  ('Supplier Invoice - Payable', 'supplier_invoice', 'Debit GRNI/Expense, Credit Trade Creditors', '2100', '2200', 3),
  ('Supplier Payment - Bank', 'supplier_payment', 'Debit Trade Creditors, Credit Bank', '2200', '1000', 4),
  ('Customer Credit Note', 'customer_credit_note', 'Debit Revenue, Credit Trade Debtors', '4100', '1200', 5),
  ('Supplier Credit Note', 'supplier_credit_note', 'Debit Trade Creditors, Credit Expense', '2200', '2100', 6),
  ('Bank Charges', 'bank_charge', 'Debit Bank Charges, Credit Bank', '6200', '1000', 7),
  ('Stock Adjustment In', 'stock_adjustment_in', 'Debit Inventory, Credit Stock Adjustments', '1100', '5200', 8),
  ('Stock Adjustment Out', 'stock_adjustment_out', 'Debit Stock Adjustments, Credit Inventory', '5200', '1100', 9),
  ('Goods Receipt', 'goods_receipt', 'Debit Inventory, Credit GRNI', '1100', '2100', 10);
