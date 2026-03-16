
-- Bank accounts
CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  branch_code text,
  swift_code text,
  currency_code text NOT NULL DEFAULT 'ZAR',
  country_code text NOT NULL DEFAULT 'ZA',
  account_type text NOT NULL DEFAULT 'operating',
  opening_balance numeric(14,2) NOT NULL DEFAULT 0,
  opening_balance_date date NOT NULL DEFAULT current_date,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Bank transactions
CREATE TABLE public.bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id uuid NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  transaction_date date NOT NULL,
  description text,
  reference_number text,
  debit_amount numeric(14,2) NOT NULL DEFAULT 0,
  credit_amount numeric(14,2) NOT NULL DEFAULT 0,
  running_balance numeric(14,2),
  source text NOT NULL DEFAULT 'manual',
  reconciliation_status text NOT NULL DEFAULT 'unmatched',
  matched_entity_type text,
  matched_entity_id uuid,
  matched_by uuid REFERENCES public.profiles(id),
  matched_at timestamptz,
  statement_import_id uuid,
  category text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_txn_account ON public.bank_transactions(bank_account_id);
CREATE INDEX idx_bank_txn_date ON public.bank_transactions(transaction_date);
CREATE INDEX idx_bank_txn_status ON public.bank_transactions(reconciliation_status);

-- Bank statement imports
CREATE TABLE public.bank_statement_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id uuid NOT NULL REFERENCES public.bank_accounts(id),
  file_name text NOT NULL,
  file_format text NOT NULL DEFAULT 'csv',
  total_rows integer NOT NULL DEFAULT 0,
  imported_rows integer NOT NULL DEFAULT 0,
  duplicate_rows integer NOT NULL DEFAULT 0,
  import_status text NOT NULL DEFAULT 'pending',
  imported_by uuid REFERENCES public.profiles(id),
  imported_at timestamptz,
  error_log jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add FK from bank_transactions to statement_imports
ALTER TABLE public.bank_transactions
  ADD CONSTRAINT bank_transactions_statement_import_fk
  FOREIGN KEY (statement_import_id) REFERENCES public.bank_statement_imports(id);

-- RLS
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statement_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and finance access bank_accounts" ON public.bank_accounts
  FOR ALL USING (
    public.is_admin()
    OR public.current_user_has_any_role(ARRAY['accountant','finance_manager'])
  );

CREATE POLICY "Admin and finance access bank_transactions" ON public.bank_transactions
  FOR ALL USING (
    public.is_admin()
    OR public.current_user_has_any_role(ARRAY['accountant','finance_manager'])
  );

CREATE POLICY "Admin and finance access bank_statement_imports" ON public.bank_statement_imports
  FOR ALL USING (
    public.is_admin()
    OR public.current_user_has_any_role(ARRAY['accountant','finance_manager'])
  );

-- Triggers for updated_at
CREATE TRIGGER set_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_bank_transactions_updated_at BEFORE UPDATE ON public.bank_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
