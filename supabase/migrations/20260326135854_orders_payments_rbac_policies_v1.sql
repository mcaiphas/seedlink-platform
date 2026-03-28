-- =========================================================
-- Orders + Payments RBAC Enforcement Policies v1
-- =========================================================

begin;

-- ---------------------------------------------------------
-- Safety helpers
-- ---------------------------------------------------------

create or replace function public.current_user_has_permission(
  p_permission text,
  p_org_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_permission(p_permission, p_org_id, auth.uid());
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.user_has_role(auth.uid(), 'super_admin', null)
    or public.user_has_role(auth.uid(), 'platform_admin', null);
$$;

-- ---------------------------------------------------------
-- SALES ORDERS
-- ---------------------------------------------------------

alter table public.sales_orders enable row level security;

drop policy if exists sales_orders_select_rbac on public.sales_orders;
create policy sales_orders_select_rbac
on public.sales_orders
for select
to authenticated
using (
  public.current_user_has_permission('sales_orders:view', tenant_id)
  or public.is_platform_admin()
);

drop policy if exists sales_orders_insert_rbac on public.sales_orders;
create policy sales_orders_insert_rbac
on public.sales_orders
for insert
to authenticated
with check (
  public.current_user_has_permission('sales_orders:create', tenant_id)
  or public.is_platform_admin()
);

drop policy if exists sales_orders_update_rbac on public.sales_orders;
create policy sales_orders_update_rbac
on public.sales_orders
for update
to authenticated
using (
  public.current_user_has_permission('sales_orders:update', tenant_id)
  or public.current_user_has_permission('sales_orders:approve', tenant_id)
  or public.current_user_has_permission('sales_orders:cancel', tenant_id)
  or public.is_platform_admin()
)
with check (
  public.current_user_has_permission('sales_orders:update', tenant_id)
  or public.current_user_has_permission('sales_orders:approve', tenant_id)
  or public.current_user_has_permission('sales_orders:cancel', tenant_id)
  or public.is_platform_admin()
);

drop policy if exists sales_orders_delete_rbac on public.sales_orders;
create policy sales_orders_delete_rbac
on public.sales_orders
for delete
to authenticated
using (
  public.current_user_has_permission('sales_orders:cancel', tenant_id)
  or public.is_platform_admin()
);

-- ---------------------------------------------------------
-- QUOTES
-- ---------------------------------------------------------

alter table public.quotes enable row level security;

drop policy if exists quotes_select_rbac on public.quotes;
create policy quotes_select_rbac
on public.quotes
for select
to authenticated
using (
  public.current_user_has_permission('quotes:view', null)
  or public.is_platform_admin()
);

drop policy if exists quotes_insert_rbac on public.quotes;
create policy quotes_insert_rbac
on public.quotes
for insert
to authenticated
with check (
  public.current_user_has_permission('quotes:create', null)
  or public.is_platform_admin()
);

drop policy if exists quotes_update_rbac on public.quotes;
create policy quotes_update_rbac
on public.quotes
for update
to authenticated
using (
  public.current_user_has_permission('quotes:update', null)
  or public.current_user_has_permission('quotes:approve', null)
  or public.is_platform_admin()
)
with check (
  public.current_user_has_permission('quotes:update', null)
  or public.current_user_has_permission('quotes:approve', null)
  or public.is_platform_admin()
);

drop policy if exists quotes_delete_rbac on public.quotes;
create policy quotes_delete_rbac
on public.quotes
for delete
to authenticated
using (
  public.current_user_has_permission('quotes:approve', null)
  or public.is_platform_admin()
);

-- ---------------------------------------------------------
-- PROFORMA INVOICES
-- ---------------------------------------------------------

alter table public.proforma_invoices enable row level security;

drop policy if exists proformas_select_rbac on public.proforma_invoices;
create policy proformas_select_rbac
on public.proforma_invoices
for select
to authenticated
using (
  public.current_user_has_permission('proformas:view', null)
  or public.is_platform_admin()
);

drop policy if exists proformas_insert_rbac on public.proforma_invoices;
create policy proformas_insert_rbac
on public.proforma_invoices
for insert
to authenticated
with check (
  public.current_user_has_permission('proformas:create', null)
  or public.is_platform_admin()
);

drop policy if exists proformas_update_rbac on public.proforma_invoices;
create policy proformas_update_rbac
on public.proforma_invoices
for update
to authenticated
using (
  public.current_user_has_permission('proformas:update', null)
  or public.is_platform_admin()
)
with check (
  public.current_user_has_permission('proformas:update', null)
  or public.is_platform_admin()
);

drop policy if exists proformas_delete_rbac on public.proforma_invoices;
create policy proformas_delete_rbac
on public.proforma_invoices
for delete
to authenticated
using (
  public.current_user_has_permission('proformas:update', null)
  or public.is_platform_admin()
);

-- ---------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------

alter table public.payments enable row level security;

drop policy if exists payments_select_rbac on public.payments;
create policy payments_select_rbac
on public.payments
for select
to authenticated
using (
  public.current_user_has_permission('payments:view', tenant_id)
  or public.is_platform_admin()
);

drop policy if exists payments_insert_rbac on public.payments;
create policy payments_insert_rbac
on public.payments
for insert
to authenticated
with check (
  public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
);

drop policy if exists payments_update_rbac on public.payments;
create policy payments_update_rbac
on public.payments
for update
to authenticated
using (
  public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
)
with check (
  public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
);

drop policy if exists payments_delete_rbac on public.payments;
create policy payments_delete_rbac
on public.payments
for delete
to authenticated
using (
  public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
);

-- ---------------------------------------------------------
-- CUSTOMER INVOICES
-- ---------------------------------------------------------

alter table public.customer_invoices enable row level security;

drop policy if exists customer_invoices_select_rbac on public.customer_invoices;
create policy customer_invoices_select_rbac
on public.customer_invoices
for select
to authenticated
using (
  public.current_user_has_permission('invoices:view', null)
  or public.is_platform_admin()
);

drop policy if exists customer_invoices_insert_rbac on public.customer_invoices;
create policy customer_invoices_insert_rbac
on public.customer_invoices
for insert
to authenticated
with check (
  public.current_user_has_permission('invoices:create', null)
  or public.is_platform_admin()
);

drop policy if exists customer_invoices_update_rbac on public.customer_invoices;
create policy customer_invoices_update_rbac
on public.customer_invoices
for update
to authenticated
using (
  public.current_user_has_permission('invoices:create', null)
  or public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
)
with check (
  public.current_user_has_permission('invoices:create', null)
  or public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
);

drop policy if exists customer_invoices_delete_rbac on public.customer_invoices;
create policy customer_invoices_delete_rbac
on public.customer_invoices
for delete
to authenticated
using (
  public.current_user_has_permission('payments:manage', null)
  or public.is_platform_admin()
);

commit;
