
-- GL Accounts: read by all authenticated, manage by admin/accountant
CREATE POLICY "Authenticated users can read gl_accounts"
  ON public.gl_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/accountant can manage gl_accounts"
  ON public.gl_accounts FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant']));

-- Journal entries: read by finance roles, manage by admin/accountant
CREATE POLICY "Finance roles can read journal_entries"
  ON public.journal_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/accountant can manage journal_entries"
  ON public.journal_entries FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant']));

-- Journal entry lines: same as journal_entries
CREATE POLICY "Finance roles can read journal_entry_lines"
  ON public.journal_entry_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/accountant can manage journal_entry_lines"
  ON public.journal_entry_lines FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant']));

-- Payments: read by authenticated, manage by admin/finance
CREATE POLICY "Authenticated can read payments"
  ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/finance can manage payments"
  ON public.payments FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant','sales_manager']));

-- Stock adjustments: read by warehouse/admin, manage by admin/warehouse
CREATE POLICY "Authenticated can read stock_adjustments"
  ON public.stock_adjustments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/warehouse can manage stock_adjustments"
  ON public.stock_adjustments FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','warehouse_officer']));

CREATE POLICY "Authenticated can read stock_adjustment_items"
  ON public.stock_adjustment_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/warehouse can manage stock_adjustment_items"
  ON public.stock_adjustment_items FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','warehouse_officer']));

-- Product tables: read by all authenticated, manage by admin/product roles
CREATE POLICY "Authenticated can read product_pack_sizes"
  ON public.product_pack_sizes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_pack_sizes"
  ON public.product_pack_sizes FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_variants"
  ON public.product_variants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_variants"
  ON public.product_variants FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_variant_attribute_values"
  ON public.product_variant_attribute_values FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_variant_attribute_values"
  ON public.product_variant_attribute_values FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_images"
  ON public.product_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_images"
  ON public.product_images FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_category_assignments"
  ON public.product_category_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_category_assignments"
  ON public.product_category_assignments FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_collection_items"
  ON public.product_collection_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_collection_items"
  ON public.product_collection_items FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read seed_product_details"
  ON public.seed_product_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage seed_product_details"
  ON public.seed_product_details FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_subcategories"
  ON public.product_subcategories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_subcategories"
  ON public.product_subcategories FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_pricing_history"
  ON public.product_pricing_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_pricing_history"
  ON public.product_pricing_history FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_import_jobs"
  ON public.product_import_jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_import_jobs"
  ON public.product_import_jobs FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

CREATE POLICY "Authenticated can read product_import_rows"
  ON public.product_import_rows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage product_import_rows"
  ON public.product_import_rows FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','product_manager']));

-- Other missing tables
CREATE POLICY "Authenticated can read customer_credit_accounts"
  ON public.customer_credit_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/finance can manage customer_credit_accounts"
  ON public.customer_credit_accounts FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant','sales_manager']));

CREATE POLICY "Authenticated can read customer_credit_ledger"
  ON public.customer_credit_ledger FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/finance can manage customer_credit_ledger"
  ON public.customer_credit_ledger FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant']));

CREATE POLICY "Authenticated can read payment_allocations"
  ON public.payment_allocations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/finance can manage payment_allocations"
  ON public.payment_allocations FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','accountant']));

CREATE POLICY "Authenticated can read certificates"
  ON public.certificates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/trainer can manage certificates"
  ON public.certificates FOR ALL TO authenticated
  USING (public.is_admin() OR public.current_user_has_any_role(ARRAY['admin','super_admin','trainer']));

CREATE POLICY "Authenticated can read harvest_records"
  ON public.harvest_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage harvest_records"
  ON public.harvest_records FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can read planting_records"
  ON public.planting_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage planting_records"
  ON public.planting_records FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can read weather_snapshots"
  ON public.weather_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage weather_snapshots"
  ON public.weather_snapshots FOR ALL TO authenticated
  USING (public.is_admin());
