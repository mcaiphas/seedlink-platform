create extension if not exists pgcrypto;

-- =========================================================
-- SEQUENCES
-- =========================================================
create sequence if not exists public.customer_invoice_seq start 400001;
create sequence if not exists public.journal_entry_seq start 600001;

-- =========================================================
-- ORDER ITEMS ENRICHMENT
-- current order_items is product-level only
-- this makes it more commerce-ready without breaking existing data
-- =========================================================
alter table public.order_items
  add column if not exists variant_id uuid,
  add column if not exists quantity_uom text default 'unit',
  add column if not exists description text,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'order_items_variant_id_fkey'
  ) then
    alter table public.order_items
      add constraint order_items_variant_id_fkey
      foreign key (variant_id)
      references public.product_variants(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_order_items_order_id
  on public.order_items(order_id);

create index if not exists idx_order_items_variant_id
  on public.order_items(variant_id);

-- Backfill friendly values
update public.order_items
set description = coalesce(description, product_name)
where description is null;

update public.order_items
set quantity_uom = coalesce(quantity_uom, 'unit')
where quantity_uom is null;

-- =========================================================
-- HELPER: NEXT CUSTOMER INVOICE NUMBER
-- =========================================================
create or replace function public.next_customer_invoice_number()
returns text
language sql
as $$
  select 'INV-' || lpad(nextval('public.customer_invoice_seq')::text, 6, '0');
$$;

-- =========================================================
-- HELPER: NEXT JOURNAL NUMBER
-- =========================================================
create or replace function public.next_journal_number()
returns text
language sql
as $$
  select 'JE-' || lpad(nextval('public.journal_entry_seq')::text, 6, '0');
$$;

-- =========================================================
-- HELPER: CHECK IF ORDER ALREADY HAS AN INVOICE
-- =========================================================
create or replace function public.order_has_customer_invoice(p_order_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.customer_invoices ci
    where ci.order_id = p_order_id
  );
$$;

-- =========================================================
-- HELPER: CREATE DOCUMENT DELIVERY LOG
-- =========================================================
create or replace function public.create_document_delivery_log(
  p_document_type text,
  p_document_id uuid,
  p_recipient_email text,
  p_recipient_phone text,
  p_delivery_channel text,
  p_subject text,
  p_created_by uuid
)
returns uuid
language plpgsql
as $$
declare
  v_log_id uuid;
begin
  insert into public.document_delivery_logs (
    id,
    document_type,
    document_id,
    recipient_email,
    recipient_phone,
    delivery_channel,
    delivery_status,
    subject,
    created_by
  )
  values (
    gen_random_uuid(),
    p_document_type,
    p_document_id,
    p_recipient_email,
    p_recipient_phone,
    p_delivery_channel,
    'pending',
    p_subject,
    p_created_by
  )
  returning id into v_log_id;

  return v_log_id;
end;
$$;

-- =========================================================
-- HELPER: CREATE JOURNAL ENTRY HEADER
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
  v_journal_number := public.next_journal_number();

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
-- HELPER: PREVENT DUPLICATE JOURNALS
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
-- HELPER: CREATE CUSTOMER INVOICE HEADER FROM ORDER
-- =========================================================
create or replace function public.create_customer_invoice_from_order(
  p_order_id uuid
)
returns uuid
language plpgsql
as $$
declare
  v_invoice_id uuid;
  v_invoice_number text;
  v_customer_id uuid;
  v_depot_id uuid;
  v_currency_code text;
  v_created_by uuid;
  v_subtotal numeric(14,2);
  v_tax numeric(14,2);
  v_total numeric(14,2);
begin
  if public.order_has_customer_invoice(p_order_id) then
    select id
    into v_invoice_id
    from public.customer_invoices
    where order_id = p_order_id
    limit 1;

    return v_invoice_id;
  end if;

  select
    o.customer_id,
    o.depot_id,
    coalesce(o.currency_code, 'ZAR'),
    o.approved_by
  into
    v_customer_id,
    v_depot_id,
    v_currency_code,
    v_created_by
  from public.orders o
  where o.id = p_order_id;

  select
    coalesce(sum(coalesce(oi.line_total, coalesce(oi.quantity, 0) * coalesce(oi.unit_price, 0))), 0),
    0,
    coalesce(sum(coalesce(oi.line_total, coalesce(oi.quantity, 0) * coalesce(oi.unit_price, 0))), 0)
  into
    v_subtotal,
    v_tax,
    v_total
  from public.order_items oi
  where oi.order_id = p_order_id;

  v_invoice_number := public.next_customer_invoice_number();

  insert into public.customer_invoices (
    id,
    invoice_number,
    customer_id,
    order_id,
    depot_id,
    invoice_date,
    due_date,
    currency_code,
    subtotal_amount,
    tax_amount,
    total_amount,
    status,
    notes,
    created_by
  )
  values (
    gen_random_uuid(),
    v_invoice_number,
    v_customer_id,
    p_order_id,
    v_depot_id,
    current_date,
    current_date,
    v_currency_code,
    v_subtotal,
    v_tax,
    v_total,
    'posted',
    'Auto-generated from order',
    v_created_by
  )
  returning id into v_invoice_id;

  return v_invoice_id;
end;
$$;

-- =========================================================
-- HELPER: CREATE CUSTOMER INVOICE ITEMS FROM ORDER
-- =========================================================
create or replace function public.create_customer_invoice_items_from_order(
  p_order_id uuid,
  p_customer_invoice_id uuid
)
returns void
language plpgsql
as $$
begin
  insert into public.customer_invoice_items (
    id,
    customer_invoice_id,
    order_item_id,
    variant_id,
    description,
    quantity,
    quantity_uom,
    unit_price,
    line_total
  )
  select
    gen_random_uuid(),
    p_customer_invoice_id,
    oi.id,
    oi.variant_id,
    coalesce(oi.description, oi.product_name, 'Order item'),
    coalesce(oi.quantity, 0),
    coalesce(oi.quantity_uom, 'unit'),
    coalesce(oi.unit_price, 0),
    coalesce(oi.line_total, coalesce(oi.quantity, 0) * coalesce(oi.unit_price, 0))
  from public.order_items oi
  where oi.order_id = p_order_id;
end;
$$;

-- =========================================================
-- HELPER: CREATE CREDIT LEDGER ENTRY
-- =========================================================
create or replace function public.create_credit_ledger_for_invoice(
  p_order_id uuid,
  p_invoice_id uuid,
  p_customer_id uuid,
  p_invoice_total numeric
)
returns void
language plpgsql
as $$
declare
  v_credit_account_id uuid;
begin
  select cca.id
  into v_credit_account_id
  from public.customer_credit_accounts cca
  where cca.customer_id = p_customer_id
    and cca.account_status = 'active'
  limit 1;

  if v_credit_account_id is null then
    return;
  end if;

  insert into public.customer_credit_ledger (
    id,
    credit_account_id,
    transaction_type,
    reference_type,
    reference_id,
    amount,
    notes,
    created_at
  )
  values (
    gen_random_uuid(),
    v_credit_account_id,
    'invoice_charge',
    'customer_invoice',
    p_invoice_id,
    p_invoice_total,
    'Auto charge from credit-approved order',
    now()
  );
end;
$$;

-- =========================================================
-- HELPER: CREATE DELIVERY LOG FOR INVOICE
-- =========================================================
create or replace function public.create_invoice_delivery_log(
  p_invoice_id uuid,
  p_customer_id uuid,
  p_created_by uuid
)
returns void
language plpgsql
as $$
declare
  v_email text;
  v_phone text;
  v_subject text;
begin
  select
    c.customer_email,
    c.customer_phone
  into
    v_email,
    v_phone
  from public.customer_invoices ci
  left join public.orders o on o.id = ci.order_id
  left join public.carts c on c.id = o.cart_id
  where ci.id = p_invoice_id
  limit 1;

  select 'Invoice ' || ci.invoice_number
  into v_subject
  from public.customer_invoices ci
  where ci.id = p_invoice_id;

  perform public.create_document_delivery_log(
    'customer_invoice',
    p_invoice_id,
    v_email,
    v_phone,
    'email',
    v_subject,
    p_created_by
  );
end;
$$;

-- =========================================================
-- HELPER: AUTO-INVOICE FROM ORDER
-- CASE 1: payment_status changes to paid
-- CASE 2: approval_status changes to approved for credit_account orders
-- =========================================================
create or replace function public.auto_generate_invoice_from_order()
returns trigger
language plpgsql
as $$
declare
  v_invoice_id uuid;
  v_invoice_total numeric(14,2);
  v_is_credit_order boolean := false;
begin
  if coalesce(new.invoice_generated, false) = true then
    return new;
  end if;

  if exists (
    select 1
    from public.payments p
    where p.order_id = new.id
      and p.payment_method = 'credit_account'
      and p.payment_status in ('paid', 'authorized', 'pending')
  ) then
    v_is_credit_order := true;
  end if;

  -- Paid order flow
  if new.payment_status = 'paid'
     and coalesce(old.payment_status, '') <> 'paid'
  then
    v_invoice_id := public.create_customer_invoice_from_order(new.id);
    perform public.create_customer_invoice_items_from_order(new.id, v_invoice_id);

    update public.orders
    set invoice_generated = true,
        updated_at = now()
    where id = new.id;

    perform public.create_invoice_delivery_log(v_invoice_id, new.customer_id, new.approved_by);

    return new;
  end if;

  -- Credit-approved order flow
  if new.approval_status = 'approved'
     and coalesce(old.approval_status, '') <> 'approved'
     and v_is_credit_order = true
  then
    v_invoice_id := public.create_customer_invoice_from_order(new.id);
    perform public.create_customer_invoice_items_from_order(new.id, v_invoice_id);

    select total_amount
    into v_invoice_total
    from public.customer_invoices
    where id = v_invoice_id;

    perform public.create_credit_ledger_for_invoice(
      new.id,
      v_invoice_id,
      new.customer_id,
      coalesce(v_invoice_total, 0)
    );

    update public.orders
    set invoice_generated = true,
        payment_status = case
          when payment_status = 'pending' then 'authorized'
          else payment_status
        end,
        updated_at = now()
    where id = new.id;

    perform public.create_invoice_delivery_log(v_invoice_id, new.customer_id, new.approved_by);

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_auto_generate_invoice_from_order on public.orders;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_auto_generate_invoice_from_order
after') then create trigger trg_auto_generate_invoice_from_order
after update on public.orders
for each row
 execute function public.auto_generate_invoice_from_order(); end if; end
$$;

-- =========================================================
-- HELPER: PAYMENT CALLBACK UPDATES ORDER
-- useful for online payments
-- =========================================================
create or replace function public.auto_generate_invoice_from_payment()
returns trigger
language plpgsql
as $$
declare
  v_order_id uuid;
begin
  if new.payment_status = 'paid'
     and coalesce(old.payment_status, '') <> 'paid'
     and new.order_id is not null
  then
    v_order_id := new.order_id;

    update public.orders
    set payment_status = 'paid',
        approval_status = case
          when approval_status = 'pending' then 'approved'
          else approval_status
        end,
        updated_at = now()
    where id = v_order_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_auto_generate_invoice_from_payment on public.payments;
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_auto_generate_invoice_from_payment
after') then create trigger trg_auto_generate_invoice_from_payment
after update on public.payments
for each row
 execute function public.auto_generate_invoice_from_payment(); end if; end
$$;

-- =========================================================
-- HELPER: AUTO-POST COGS WHEN CUSTOMER INVOICE BECOMES PAID
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
  if new.status = 'paid'
     and coalesce(old.status, '') <> 'paid'
  then
    if public.journal_already_exists('customer_invoice_cogs', new.id) then
      return new;
    end if;

    select coalesce(sum(coalesce(cii.quantity, 0) * coalesce(cii.cost_of_sale_unit, 0)), 0)
    into v_total_cost
    from public.customer_invoice_items cii
    where cii.customer_invoice_id = new.id;

    if coalesce(v_total_cost, 0) = 0 then
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
do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_post_customer_invoice_cogs_journal
after') then create trigger trg_post_customer_invoice_cogs_journal
after update on public.customer_invoices
for each row
 execute function public.post_customer_invoice_cogs_journal(); end if; end
$$;
