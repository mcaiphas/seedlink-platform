begin;

-- customer_invoices
drop policy if exists customer_invoices_admin_manage on public.customer_invoices;
drop policy if exists customer_invoices_select_owner_or_admin on public.customer_invoices;

-- delivery_requests
drop policy if exists delivery_requests_insert_owner_or_admin on public.delivery_requests;
drop policy if exists delivery_requests_select_owner_or_admin on public.delivery_requests;
drop policy if exists delivery_requests_update_admin_or_logistics on public.delivery_requests;

-- delivery_status_logs
drop policy if exists delivery_status_logs_manage_admin_or_logistics on public.delivery_status_logs;
drop policy if exists delivery_status_logs_select_owner_admin_logistics on public.delivery_status_logs;

-- depots / receipts / inventory / orgs
drop policy if exists depots_admin_only on public.depots;
drop policy if exists goods_receipts_admin_only on public.goods_receipts;
drop policy if exists inventory_batches_admin_only on public.inventory_batches;
drop policy if exists organizations_manage_admin on public.organizations;
drop policy if exists organizations_select_member_or_admin on public.organizations;
drop policy if exists org_admins_update_own on public.organizations;

-- payment_requests
drop policy if exists payment_requests_select on public.payment_requests;
drop policy if exists payment_requests_insert on public.payment_requests;
drop policy if exists payment_requests_update on public.payment_requests;
drop policy if exists payment_requests_delete on public.payment_requests;

-- payments
drop policy if exists "Admin/finance can manage payments" on public.payments;
drop policy if exists "Authenticated can read payments" on public.payments;
drop policy if exists payments_select_policy on public.payments;
drop policy if exists payments_write_policy on public.payments;

-- permissions
drop policy if exists permissions_manage_admin on public.permissions;
drop policy if exists permissions_select_admin on public.permissions;

-- proforma_invoices
drop policy if exists proforma_select on public.proforma_invoices;
drop policy if exists proforma_insert on public.proforma_invoices;
drop policy if exists proforma_update on public.proforma_invoices;
drop policy if exists proforma_delete on public.proforma_invoices;

-- purchase_orders
drop policy if exists purchase_orders_admin_only on public.purchase_orders;
drop policy if exists purchase_orders_select_policy on public.purchase_orders;
drop policy if exists purchase_orders_write_policy on public.purchase_orders;

-- quotes
drop policy if exists quotes_select on public.quotes;
drop policy if exists quotes_insert on public.quotes;
drop policy if exists quotes_update on public.quotes;
drop policy if exists quotes_delete on public.quotes;

-- roles
drop policy if exists roles_read_authenticated on public.roles;

-- sales_orders
drop policy if exists sales_orders_select on public.sales_orders;
drop policy if exists sales_orders_insert on public.sales_orders;
drop policy if exists sales_orders_update on public.sales_orders;

-- stock_adjustments
drop policy if exists "Admin/warehouse can manage stock_adjustments" on public.stock_adjustments;
drop policy if exists "Authenticated can read stock_adjustments" on public.stock_adjustments;

-- stock_counts
drop policy if exists "Authenticated can view stock_counts" on public.stock_counts;
drop policy if exists "Authenticated can insert stock_counts" on public.stock_counts;
drop policy if exists "Authenticated can update stock_counts" on public.stock_counts;

-- stock_movements / transfers
drop policy if exists stock_movements_admin_only on public.stock_movements;
drop policy if exists stock_transfers_admin_only on public.stock_transfers;

-- supplier_invoices / suppliers
drop policy if exists supplier_invoices_admin_only on public.supplier_invoices;
drop policy if exists supplier_invoices_select_policy on public.supplier_invoices;
drop policy if exists supplier_invoices_write_policy on public.supplier_invoices;
drop policy if exists suppliers_admin_only on public.suppliers;
drop policy if exists suppliers_select_policy on public.suppliers;
drop policy if exists suppliers_write_policy on public.suppliers;

commit;
