begin;

-- =====================================================
-- WAVE 1: DROP LEGACY POLICIES
-- =====================================================

-- customer_invoices
drop policy if exists customer_invoices_admin_manage on public.customer_invoices;
drop policy if exists customer_invoices_select_owner_or_admin on public.customer_invoices;

-- payments
drop policy if exists "Admin/finance can manage payments" on public.payments;
drop policy if exists "Authenticated can read payments" on public.payments;
drop policy if exists payments_select_policy on public.payments;
drop policy if exists payments_write_policy on public.payments;

-- proforma_invoices
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'proforma_invoices'
  ) then
    drop policy if exists proforma_select on public.proforma_invoices;
    drop policy if exists proforma_insert on public.proforma_invoices;
    drop policy if exists proforma_update on public.proforma_invoices;
    drop policy if exists proforma_delete on public.proforma_invoices;

    drop policy if exists proformas_select_rbac on public.proforma_invoices;
    drop policy if exists proformas_insert_rbac on public.proforma_invoices;
    drop policy if exists proformas_update_rbac on public.proforma_invoices;
    drop policy if exists proformas_delete_rbac on public.proforma_invoices;
  end if;
end $$;

-- quotes
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'quotes'
  ) then
    drop policy if exists quotes_select on public.quotes;
    drop policy if exists quotes_insert on public.quotes;
    drop policy if exists quotes_update on public.quotes;
    drop policy if exists quotes_delete on public.quotes;

    drop policy if exists quotes_select_rbac on public.quotes;
    drop policy if exists quotes_insert_rbac on public.quotes;
    drop policy if exists quotes_update_rbac on public.quotes;
    drop policy if exists quotes_delete_rbac on public.quotes;
  end if;
end $$;


