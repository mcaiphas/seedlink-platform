create extension if not exists pgcrypto;

-- =========================================================
-- HELPER: CREATE JOURNAL HEADER
-- =========================================================
create or replace function public.create_journal_entry(
  p_entry_date date,
  p_reference_type text,
  p_reference_id uuid,
  p_description text,
  p_created_by uuid
)
returns uuid
language plpgsql
as $$
declare
  v_journal_id uuid;
  v_journal_number text;
begin
  v_journal_number := 'JE-' || lpad(nextval('journal_entry_seq')::text, 6, '0');

  insert into public.journal_entries (
    id,
    journal_number,
    entry_date,
    reference_type,
    reference_id,
    description,
    status,
    created_by
  )
  values (
    gen_random_uuid(),
    v_journal_number,
    p_entry_date,
    p_reference_type,
    p_reference_id,
    p_description,
    'posted',
    p_created_by
  )
  returning id into v_journal_id;

  return v_journal_id;
end;
$$;

-- =========================================================
-- HELPER: ADD JOURNAL LINE
-- =========================================================
create or replace function public.add_journal_line(
  p_journal_entry_id uuid,
  p_account_code text,
  p_debit numeric,
  p_credit numeric,
  p_line_description text,
  p_depot_id uuid,
  p_variant_id uuid
)
returns void
language plpgsql
as $$
declare
  v_gl_account_id uuid;
begin
  select id
  into v_gl_account_id
  from public.gl_accounts
  where account_code = p_account_code;

  if v_gl_account_id is null then
    raise exception 'GL account with code % not found', p_account_code;
  end if;

  insert into public.journal_entry_lines (
    id,
    journal_entry_id,
    gl_account_id,
    debit_amount,
    credit_amount,
    line_description,
    depot_id,
    variant_id
  )
  values (
    gen_random_uuid(),
    p_journal_entry_id,
    v_gl_account_id,
    coalesce(p_debit, 0),
    coalesce(p_credit, 0),
    p_line_description,
    p_depot_id,
    p_variant_id
  );
end;
$$;

-- =========================================================
-- HELPER: PREVENT DUPLICATE JOURNAL POSTING
-- =========================================================
create or replace function public.journal_already_exists(
  p_reference_type text,
  p_reference_id uuid
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.journal_entries
    where reference_type = p_reference_type
      and reference_id = p_reference_id
      and status = 'posted'
  );
$$;

-- =========================================================
-- GOODS RECEIPT POSTING
-- Dr Inventory / Cr GRNI
-- fires when status changes to 'posted'
-- =========================================================
create or replace function public.post_goods_receipt_journal()
returns trigger
language plpgsql
as $$
declare
  v_journal_id uuid;
  v_total numeric(14,2);
  v_created_by uuid;
begin
  if new.status = 'posted' and coalesce(old.status, '') <> 'posted' then
    if public.journal_already_exists('goods_receipt', new.id) then
      return new;
    end if;

    v_created_by := new.received_by;

    select coalesce(sum(coalesce(gri.accepted_quantity, 0) * coalesce(gri.unit_cost, 0)), 0)
    into v_total
    from public.goods_receipt_items gri
    where gri.goods_receipt_id = new.id;

    v_journal_id := public.create_journal_entry(
      new.receipt_date,
      'goods_receipt',
      new.id,
      'Goods Receipt ' || new.receipt_number,
      v_created_by
    );

    perform public.add_journal_line(
      v_journal_id,
      '1100', -- Inventory
      v_total,
      0,
      'Inventory increase from Goods Receipt ' || new.receipt_number,
      new.depot_id,
      null
    );

    perform public.add_journal_line(
      v_journal_id,
      '2100', -- GRNI
      0,
      v_total,
      'GRNI for Goods Receipt ' || new.receipt_number,
      new.depot_id,
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_post_goods_receipt_journal on public.goods_receipts;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_post_goods_receipt_journal
after') then create trigger trg_post_goods_receipt_journal
after update on public.goods_receipts
for each row
 execute function public.post_goods_receipt_journal(); end if; end 8999;

-- =========================================================
-- SUPPLIER INVOICE POSTING
-- Dr GRNI / Cr Accounts Payable
-- fires when status changes to 'posted'
-- =========================================================
create or replace function public.post_supplier_invoice_journal()
returns trigger
language plpgsql
as $$
declare
  v_journal_id uuid;
  v_total numeric(14,2);
begin
  if new.status = 'posted' and coalesce(old.status, '') <> 'posted' then
    if public.journal_already_exists('supplier_invoice', new.id) then
      return new;
    end if;

    v_total := coalesce(new.total_amount, 0);

    v_journal_id := public.create_journal_entry(
      new.invoice_date,
      'supplier_invoice',
      new.id,
      'Supplier Invoice ' || coalesce(new.supplier_invoice_number, new.id::text),
      new.created_by
    );

    perform public.add_journal_line(
      v_journal_id,
      '2100', -- GRNI
      v_total,
      0,
      'Reverse GRNI for Supplier Invoice ' || coalesce(new.supplier_invoice_number, ''),
      null,
      null
    );

    perform public.add_journal_line(
      v_journal_id,
      '2200', -- Accounts Payable
      0,
      v_total,
      'Accounts Payable for Supplier Invoice ' || coalesce(new.supplier_invoice_number, ''),
      null,
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_post_supplier_invoice_journal on public.supplier_invoices;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_post_supplier_invoice_journal
after') then create trigger trg_post_supplier_invoice_journal
after update on public.supplier_invoices
for each row
 execute function public.post_supplier_invoice_journal(); end if; end 8999;

-- =========================================================
-- CUSTOMER INVOICE POSTING
-- Dr Accounts Receivable / Cr Sales Revenue
-- fires when status changes to 'posted'
-- =========================================================
create or replace function public.post_customer_invoice_journal()
returns trigger
language plpgsql
as $$
declare
  v_journal_id uuid;
  v_total numeric(14,2);
begin
  if new.status = 'posted' and coalesce(old.status, '') <> 'posted' then
    if public.journal_already_exists('customer_invoice', new.id) then
      return new;
    end if;

    v_total := coalesce(new.total_amount, 0);

    v_journal_id := public.create_journal_entry(
      new.invoice_date,
      'customer_invoice',
      new.id,
      'Customer Invoice ' || new.invoice_number,
      new.created_by
    );

    perform public.add_journal_line(
      v_journal_id,
      '1200', -- Accounts Receivable
      v_total,
      0,
      'Accounts Receivable for Invoice ' || new.invoice_number,
      new.depot_id,
      null
    );

    perform public.add_journal_line(
      v_journal_id,
      '4100', -- Sales Revenue
      0,
      v_total,
      'Sales Revenue for Invoice ' || new.invoice_number,
      new.depot_id,
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_post_customer_invoice_journal on public.customer_invoices;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_post_customer_invoice_journal
after') then create trigger trg_post_customer_invoice_journal
after update on public.customer_invoices
for each row
 execute function public.post_customer_invoice_journal(); end if; end 8999;

-- =========================================================
-- CUSTOMER INVOICE FULFILLMENT / COGS POSTING
-- Assumes status changes to 'paid' OR another fulfillment status you may add later
-- Dr COGS / Cr Inventory
-- =========================================================
create or replace function public.post_customer_invoice_cogs_journal()
returns trigger
language plpgsql
as $$
declare
  v_journal_id uuid;
  v_total_cost numeric(14,2);
begin
  if new.status = 'paid' and coalesce(old.status, '') <> 'paid' then
    if public.journal_already_exists('customer_invoice_cogs', new.id) then
      return new;
    end if;

    select coalesce(sum(coalesce(cii.quantity, 0) * coalesce(cii.cost_of_sale_unit, 0)), 0)
    into v_total_cost
    from public.customer_invoice_items cii
    where cii.customer_invoice_id = new.id;

    if v_total_cost = 0 then
      return new;
    end if;

    v_journal_id := public.create_journal_entry(
      new.invoice_date,
      'customer_invoice_cogs',
      new.id,
      'COGS for Invoice ' || new.invoice_number,
      new.created_by
    );

    perform public.add_journal_line(
      v_journal_id,
      '5100', -- Cost of Goods Sold
      v_total_cost,
      0,
      'COGS for Invoice ' || new.invoice_number,
      new.depot_id,
      null
    );

    perform public.add_journal_line(
      v_journal_id,
      '1100', -- Inventory
      0,
      v_total_cost,
      'Inventory reduction for Invoice ' || new.invoice_number,
      new.depot_id,
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_post_customer_invoice_cogs_journal on public.customer_invoices;
do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_post_customer_invoice_cogs_journal
after') then create trigger trg_post_customer_invoice_cogs_journal
after update on public.customer_invoices
for each row
 execute function public.post_customer_invoice_cogs_journal(); end if; end 8999;
