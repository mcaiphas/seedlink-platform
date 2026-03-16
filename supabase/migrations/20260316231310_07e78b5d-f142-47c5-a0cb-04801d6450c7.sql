
-- =============================================
-- 1. RLS policies for uncovered tables
-- =============================================

-- abandoned_cart_followups: admin/sales access
CREATE POLICY "Admin and sales can manage abandoned cart followups"
  ON public.abandoned_cart_followups FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_role('sales'));

-- course_classifications: read for authenticated, manage for admin/trainer
CREATE POLICY "Authenticated users can read course classifications"
  ON public.course_classifications FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin and trainers can manage course classifications"
  ON public.course_classifications FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_role('trainer'));

-- marketplace_commodity_grades: read for authenticated, manage for admin
CREATE POLICY "Authenticated users can read commodity grades"
  ON public.marketplace_commodity_grades FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin can manage commodity grades"
  ON public.marketplace_commodity_grades FOR ALL TO authenticated
  USING (public.is_admin());

-- =============================================
-- 2. Harden ALL functions with search_path
-- =============================================

ALTER FUNCTION public.add_journal_line(uuid, text, numeric, numeric, text, uuid, uuid) SET search_path = public;
ALTER FUNCTION public.apply_credit_ledger_effect() SET search_path = public;
ALTER FUNCTION public.auto_generate_invoice_from_order() SET search_path = public;
ALTER FUNCTION public.auto_generate_invoice_from_payment() SET search_path = public;
ALTER FUNCTION public.belongs_to_organization(uuid) SET search_path = public;
ALTER FUNCTION public.calculate_margin_percent(numeric, numeric) SET search_path = public;
ALTER FUNCTION public.create_credit_ledger_for_invoice(uuid, uuid, uuid, numeric) SET search_path = public;
ALTER FUNCTION public.create_customer_invoice_from_order(uuid) SET search_path = public;
ALTER FUNCTION public.create_customer_invoice_items_from_order(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.create_document_delivery_log(text, uuid, text, text, text, text, uuid) SET search_path = public;
ALTER FUNCTION public.create_invoice_delivery_log(uuid, uuid, uuid) SET search_path = public;
ALTER FUNCTION public.create_journal_entry(date, text, uuid, text, uuid) SET search_path = public;
ALTER FUNCTION public.current_profile_id() SET search_path = public;
ALTER FUNCTION public.current_user_has_any_role(text[]) SET search_path = public;
ALTER FUNCTION public.current_user_has_permission(text) SET search_path = public;
ALTER FUNCTION public.current_user_has_role(text) SET search_path = public;
ALTER FUNCTION public.generate_ccn_number() SET search_path = public;
ALTER FUNCTION public.generate_ci_number() SET search_path = public;
ALTER FUNCTION public.generate_gr_number() SET search_path = public;
ALTER FUNCTION public.generate_je_number() SET search_path = public;
ALTER FUNCTION public.generate_pi_number() SET search_path = public;
ALTER FUNCTION public.generate_po_number() SET search_path = public;
ALTER FUNCTION public.generate_pr_number() SET search_path = public;
ALTER FUNCTION public.generate_qt_number() SET search_path = public;
ALTER FUNCTION public.generate_refund_number() SET search_path = public;
ALTER FUNCTION public.generate_sa_number() SET search_path = public;
ALTER FUNCTION public.generate_sc_number() SET search_path = public;
ALTER FUNCTION public.generate_scn_number() SET search_path = public;
ALTER FUNCTION public.generate_si_number() SET search_path = public;
ALTER FUNCTION public.generate_sp_number() SET search_path = public;
ALTER FUNCTION public.has_role(text) SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.is_enrolled_in_course(uuid) SET search_path = public;
ALTER FUNCTION public.journal_already_exists(text, uuid) SET search_path = public;
ALTER FUNCTION public.match_knowledge_chunks(vector, integer, text) SET search_path = public;
ALTER FUNCTION public.next_customer_invoice_number() SET search_path = public;
ALTER FUNCTION public.next_journal_number() SET search_path = public;
ALTER FUNCTION public.order_has_customer_invoice(uuid) SET search_path = public;
ALTER FUNCTION public.populate_review_from_transaction() SET search_path = public;
ALTER FUNCTION public.post_customer_invoice_cogs_journal() SET search_path = public;
ALTER FUNCTION public.post_customer_invoice_journal() SET search_path = public;
ALTER FUNCTION public.post_goods_receipt_journal() SET search_path = public;
ALTER FUNCTION public.post_supplier_invoice_journal() SET search_path = public;
ALTER FUNCTION public.recalculate_credit_available(uuid) SET search_path = public;
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.user_has_any_role(uuid, text[]) SET search_path = public;
ALTER FUNCTION public.user_has_permission(uuid, text) SET search_path = public;
ALTER FUNCTION public.user_has_role(uuid, text) SET search_path = public;

-- =============================================
-- 3. Performance indexes for reporting
-- =============================================

CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_gl_account ON public.journal_entry_lines (gl_account_id);
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_journal_entry ON public.journal_entry_lines (journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status ON public.journal_entries (status);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON public.journal_entries (entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_reference ON public.journal_entries (reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_bank_transaction_reviews_classification ON public.bank_transaction_reviews (classification);
CREATE INDEX IF NOT EXISTS idx_bank_transaction_reviews_date ON public.bank_transaction_reviews (transaction_date);
CREATE INDEX IF NOT EXISTS idx_gl_accounts_type ON public.gl_accounts (account_type);
CREATE INDEX IF NOT EXISTS idx_gl_accounts_code ON public.gl_accounts (account_code);
CREATE INDEX IF NOT EXISTS idx_document_delivery_logs_doc ON public.document_delivery_logs (document_type, document_id);
CREATE INDEX IF NOT EXISTS idx_customer_invoices_customer ON public.customer_invoices (customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_invoices_status ON public.customer_invoices (status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_stock_movements_variant ON public.stock_movements (variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_depot ON public.stock_movements (depot_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments (order_id);
