
-- Add RLS policy for document_delivery_logs (missing)
CREATE POLICY "Admin and finance can manage document delivery logs"
  ON public.document_delivery_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant','sales_manager']));

-- Add missing columns to bank_transaction_reviews for revenue/expense reporting
ALTER TABLE public.bank_transaction_reviews
  ADD COLUMN IF NOT EXISTS transaction_date date,
  ADD COLUMN IF NOT EXISTS amount numeric(14,2);

-- Auto-populate transaction_date and amount from bank_transactions via trigger
CREATE OR REPLACE FUNCTION public.populate_review_from_transaction()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.transaction_date IS NULL OR NEW.amount IS NULL THEN
    SELECT
      bt.transaction_date,
      GREATEST(COALESCE(bt.debit_amount, 0), COALESCE(bt.credit_amount, 0))
    INTO NEW.transaction_date, NEW.amount
    FROM public.bank_transactions bt
    WHERE bt.id = NEW.bank_transaction_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_populate_review_fields ON public.bank_transaction_reviews;
CREATE TRIGGER trg_populate_review_fields
  BEFORE INSERT OR UPDATE ON public.bank_transaction_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_review_from_transaction();

-- Backfill existing reviews
UPDATE public.bank_transaction_reviews btr
SET
  transaction_date = bt.transaction_date,
  amount = GREATEST(COALESCE(bt.debit_amount, 0), COALESCE(bt.credit_amount, 0))
FROM public.bank_transactions bt
WHERE bt.id = btr.bank_transaction_id
  AND (btr.transaction_date IS NULL OR btr.amount IS NULL);
