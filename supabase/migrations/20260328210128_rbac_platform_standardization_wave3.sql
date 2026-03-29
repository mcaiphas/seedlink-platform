begin;

-- =====================================================
-- WAVE 3: FINANCE + COMMERCE RBAC STANDARDIZATION
-- =====================================================

-- -----------------------------------------------------
-- addresses
-- -----------------------------------------------------
drop policy if exists addresses_manage_own_or_admin on public.addresses;
drop policy if exists addresses_select_own_or_admin on public.addresses;
drop policy if exists addresses_select_policy on public.addresses;
drop policy if exists addresses_write_policy on public.addresses;
drop policy if exists addresses_select_rbac on public.addresses;
drop policy if exists addresses_insert_rbac on public.addresses;
drop policy if exists addresses_update_rbac on public.addresses;
drop policy if exists addresses_delete_rbac on public.addresses;

create policy addresses_select_rbac
on public.addresses
for select
to authenticated
using (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

create policy addresses_insert_rbac
on public.addresses
for insert
to authenticated
with check (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

create policy addresses_update_rbac
on public.addresses
for update
to authenticated
using (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
)
with check (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

create policy addresses_delete_rbac
on public.addresses
for delete
to authenticated
using (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

-- -----------------------------------------------------
-- cart_items
-- -----------------------------------------------------
drop policy if exists cart_items_delete on public.cart_items;
drop policy if exists cart_items_insert on public.cart_items;
drop policy if exists cart_items_manage_own_or_admin on public.cart_items;
drop policy if exists cart_items_select on public.cart_items;
drop policy if exists cart_items_select_own_or_admin on public.cart_items;
drop policy if exists cart_items_select_policy on public.cart_items;
drop policy if exists cart_items_update on public.cart_items;
drop policy if exists cart_items_write_policy on public.cart_items;
drop policy if exists cart_items_select_rbac on public.cart_items;
drop policy if exists cart_items_insert_rbac on public.cart_items;
drop policy if exists cart_items_update_rbac on public.cart_items;
drop policy if exists cart_items_delete_rbac on public.cart_items;

create policy cart_items_select_rbac
on public.cart_items
for select
to authenticated
using (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

create policy cart_items_insert_rbac
on public.cart_items
for insert
to authenticated
with check (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

create policy cart_items_update_rbac
on public.cart_items
for update
to authenticated
using (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
)
with check (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

create policy cart_items_delete_rbac
on public.cart_items
for delete
to authenticated
using (
  public.is_admin() or public.current_user_has_permission('cart_items:view'::text, null::uuid)
);

-- -----------------------------------------------------
-- approval_requests
-- -----------------------------------------------------
drop policy if exists approval_requests_select on public.approval_requests;
drop policy if exists approval_requests_insert on public.approval_requests;
drop policy if exists approval_requests_update on public.approval_requests;
drop policy if exists approval_requests_delete on public.approval_requests;
drop policy if exists approval_requests_select_rbac on public.approval_requests;
drop policy if exists approval_requests_insert_rbac on public.approval_requests;
drop policy if exists approval_requests_update_rbac on public.approval_requests;
drop policy if exists approval_requests_delete_rbac on public.approval_requests;

create policy approval_requests_select_rbac
on public.approval_requests
for select
to authenticated
using (
  public.is_admin()
  or requested_by = auth.uid()
);

create policy approval_requests_insert_rbac
on public.approval_requests
for insert
to authenticated
with check (
  public.is_admin()
  or requested_by = auth.uid()
);

create policy approval_requests_update_rbac
on public.approval_requests
for update
to authenticated
using (
  public.is_admin()
  or requested_by = auth.uid()
)
with check (
  public.is_admin()
  or requested_by = auth.uid()
);

create policy approval_requests_delete_rbac
on public.approval_requests
for delete
to authenticated
using (
  public.is_admin()
  or requested_by = auth.uid()
);

-- -----------------------------------------------------
-- bank_accounts
-- -----------------------------------------------------
drop policy if exists "Admin and finance access bank_accounts" on public.bank_accounts;
drop policy if exists bank_accounts_select_rbac on public.bank_accounts;
drop policy if exists bank_accounts_insert_rbac on public.bank_accounts;
drop policy if exists bank_accounts_update_rbac on public.bank_accounts;
drop policy if exists bank_accounts_delete_rbac on public.bank_accounts;

create policy bank_accounts_select_rbac
on public.bank_accounts
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_accounts:view'::text, null::uuid)
);

create policy bank_accounts_insert_rbac
on public.bank_accounts
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_accounts:create'::text, null::uuid)
);

create policy bank_accounts_update_rbac
on public.bank_accounts
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_accounts:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_accounts:update'::text, null::uuid)
);

create policy bank_accounts_delete_rbac
on public.bank_accounts
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_accounts:delete'::text, null::uuid)
);

-- -----------------------------------------------------
-- bank_transactions
-- -----------------------------------------------------
drop policy if exists "Admin and finance access bank_transactions" on public.bank_transactions;
drop policy if exists bank_transactions_select_rbac on public.bank_transactions;
drop policy if exists bank_transactions_insert_rbac on public.bank_transactions;
drop policy if exists bank_transactions_update_rbac on public.bank_transactions;
drop policy if exists bank_transactions_delete_rbac on public.bank_transactions;

create policy bank_transactions_select_rbac
on public.bank_transactions
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_transactions:view'::text, null::uuid)
);

create policy bank_transactions_insert_rbac
on public.bank_transactions
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_transactions:create'::text, null::uuid)
);

create policy bank_transactions_update_rbac
on public.bank_transactions
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_transactions:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_transactions:update'::text, null::uuid)
);

create policy bank_transactions_delete_rbac
on public.bank_transactions
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_transactions:delete'::text, null::uuid)
);

-- -----------------------------------------------------
-- bank_statement_imports
-- -----------------------------------------------------
drop policy if exists "Admin and finance access bank_statement_imports" on public.bank_statement_imports;
drop policy if exists bank_statement_imports_select_authenticated on public.bank_statement_imports;
drop policy if exists bank_statement_imports_write_authenticated on public.bank_statement_imports;
drop policy if exists bank_statement_imports_select_rbac on public.bank_statement_imports;
drop policy if exists bank_statement_imports_insert_rbac on public.bank_statement_imports;
drop policy if exists bank_statement_imports_update_rbac on public.bank_statement_imports;
drop policy if exists bank_statement_imports_delete_rbac on public.bank_statement_imports;

create policy bank_statement_imports_select_rbac
on public.bank_statement_imports
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_statement_imports:view'::text, null::uuid)
);

create policy bank_statement_imports_insert_rbac
on public.bank_statement_imports
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_statement_imports:create'::text, null::uuid)
);

create policy bank_statement_imports_update_rbac
on public.bank_statement_imports
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_statement_imports:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_statement_imports:update'::text, null::uuid)
);

create policy bank_statement_imports_delete_rbac
on public.bank_statement_imports
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_statement_imports:delete'::text, null::uuid)
);

-- -----------------------------------------------------
-- bank_transaction_reviews
-- -----------------------------------------------------
drop policy if exists "Admin/finance access bank_transaction_reviews" on public.bank_transaction_reviews;
drop policy if exists bank_transaction_reviews_select_rbac on public.bank_transaction_reviews;
drop policy if exists bank_transaction_reviews_insert_rbac on public.bank_transaction_reviews;
drop policy if exists bank_transaction_reviews_update_rbac on public.bank_transaction_reviews;
drop policy if exists bank_transaction_reviews_delete_rbac on public.bank_transaction_reviews;

create policy bank_transaction_reviews_select_rbac
on public.bank_transaction_reviews
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_transaction_reviews:view'::text, null::uuid)
);

create policy bank_transaction_reviews_insert_rbac
on public.bank_transaction_reviews
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_transaction_reviews:create'::text, null::uuid)
);

create policy bank_transaction_reviews_update_rbac
on public.bank_transaction_reviews
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_transaction_reviews:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('bank_transaction_reviews:update'::text, null::uuid)
);

create policy bank_transaction_reviews_delete_rbac
on public.bank_transaction_reviews
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('bank_transaction_reviews:delete'::text, null::uuid)
);

-- -----------------------------------------------------
-- accounting_periods
-- -----------------------------------------------------
drop policy if exists "Admin/accountant can manage accounting_periods" on public.accounting_periods;
drop policy if exists accounting_periods_select_rbac on public.accounting_periods;
drop policy if exists accounting_periods_insert_rbac on public.accounting_periods;
drop policy if exists accounting_periods_update_rbac on public.accounting_periods;
drop policy if exists accounting_periods_delete_rbac on public.accounting_periods;

create policy accounting_periods_select_rbac
on public.accounting_periods
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('accounting_periods:view'::text, null::uuid)
);

create policy accounting_periods_insert_rbac
on public.accounting_periods
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('accounting_periods:create'::text, null::uuid)
);

create policy accounting_periods_update_rbac
on public.accounting_periods
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('accounting_periods:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('accounting_periods:update'::text, null::uuid)
);

create policy accounting_periods_delete_rbac
on public.accounting_periods
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('accounting_periods:delete'::text, null::uuid)
);

-- -----------------------------------------------------
-- abandoned_cart_followups
-- -----------------------------------------------------
drop policy if exists "Admin and sales can manage abandoned cart followups" on public.abandoned_cart_followups;
drop policy if exists abandoned_cart_followups_select_rbac on public.abandoned_cart_followups;
drop policy if exists abandoned_cart_followups_insert_rbac on public.abandoned_cart_followups;
drop policy if exists abandoned_cart_followups_update_rbac on public.abandoned_cart_followups;
drop policy if exists abandoned_cart_followups_delete_rbac on public.abandoned_cart_followups;

create policy abandoned_cart_followups_select_rbac
on public.abandoned_cart_followups
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('abandoned_cart_followups:view'::text, null::uuid)
);

create policy abandoned_cart_followups_insert_rbac
on public.abandoned_cart_followups
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('abandoned_cart_followups:create'::text, null::uuid)
);

create policy abandoned_cart_followups_update_rbac
on public.abandoned_cart_followups
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('abandoned_cart_followups:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('abandoned_cart_followups:update'::text, null::uuid)
);

create policy abandoned_cart_followups_delete_rbac
on public.abandoned_cart_followups
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('abandoned_cart_followups:delete'::text, null::uuid)
);

-- -----------------------------------------------------
-- audit_logs
-- -----------------------------------------------------
drop policy if exists audit_logs_admin_only on public.audit_logs;
drop policy if exists audit_logs_select_rbac on public.audit_logs;
drop policy if exists audit_logs_insert_rbac on public.audit_logs;
drop policy if exists audit_logs_update_rbac on public.audit_logs;
drop policy if exists audit_logs_delete_rbac on public.audit_logs;

create policy audit_logs_select_rbac
on public.audit_logs
for select
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('audit_logs:view'::text, null::uuid)
);

create policy audit_logs_insert_rbac
on public.audit_logs
for insert
to authenticated
with check (
  public.is_admin()
  or public.current_user_has_permission('audit_logs:create'::text, null::uuid)
);

create policy audit_logs_update_rbac
on public.audit_logs
for update
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('audit_logs:update'::text, null::uuid)
)
with check (
  public.is_admin()
  or public.current_user_has_permission('audit_logs:update'::text, null::uuid)
);

create policy audit_logs_delete_rbac
on public.audit_logs
for delete
to authenticated
using (
  public.is_admin()
  or public.current_user_has_permission('audit_logs:delete'::text, null::uuid)
);

commit;
