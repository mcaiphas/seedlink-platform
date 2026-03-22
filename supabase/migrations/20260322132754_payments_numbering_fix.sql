begin;

-- =========================================================
-- 1) PAYMENT NUMBER GENERATOR
-- =========================================================
create or replace function public.generate_payment_number()
returns text
language plpgsql
as $$
declare
    v_date_part text;
    v_next_number bigint;
begin
    v_date_part := to_char(now(), 'YYYYMMDD');

    select coalesce(
        max(
            case
                when payment_number ~ '^PMT-[0-9]{8}-[0-9]+$'
                then regexp_replace(payment_number, '^PMT-[0-9]{8}-', '')::bigint
                else null
            end
        ),
        999
    ) + 1
    into v_next_number
    from public.payments
    where payment_number like 'PMT-' || v_date_part || '-%';

    return 'PMT-' || v_date_part || '-' || lpad(v_next_number::text, 6, '0');
end;
$$;


-- =========================================================
-- 2) PAYMENT REFERENCE GENERATOR
--    create or replace so it is guaranteed to exist
-- =========================================================
create or replace function public.generate_payment_reference()
returns text
language plpgsql
as $$
declare
    v_date_part text;
    v_next_number bigint;
begin
    v_date_part := to_char(now(), 'YYYYMMDD');

    select coalesce(
        max(
            case
                when payment_reference ~ '^PAY-[0-9]{8}-[0-9]+$'
                then regexp_replace(payment_reference, '^PAY-[0-9]{8}-', '')::bigint
                else null
            end
        ),
        999
    ) + 1
    into v_next_number
    from public.payments
    where payment_reference like 'PAY-' || v_date_part || '-%';

    return 'PAY-' || v_date_part || '-' || lpad(v_next_number::text, 6, '0');
end;
$$;


-- =========================================================
-- 3) TABLE DEFAULTS
-- =========================================================
alter table public.payments
    alter column payment_number set default public.generate_payment_number();

alter table public.payments
    alter column payment_reference set default public.generate_payment_reference();


-- =========================================================
-- 4) BACKFILL OLD ROWS IF NEEDED
-- =========================================================
update public.payments
set payment_number = public.generate_payment_number()
where payment_number is null;

update public.payments
set payment_reference = public.generate_payment_reference()
where payment_reference is null;


-- =========================================================
-- 5) REBUILD create_payment_for_order(...)
--    Signature from your error:
--    create_payment_for_order(uuid,text,text,text,uuid,text)
--
--    p_order_id uuid
--    p_payment_method text
--    p_payment_provider text
--    p_checkout_session_id text
--    p_created_by uuid
--    p_notes text
-- =========================================================
drop function if exists public.create_payment_for_order(uuid,text,text,text,uuid,text);

create or replace function public.create_payment_for_order(
    p_order_id uuid,
    p_payment_method text default 'card',
    p_payment_provider text default 'manual',
    p_checkout_session_id text default null,
    p_created_by uuid default null,
    p_notes text default null
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
    v_order public.sales_orders%rowtype;
    v_payment public.payments%rowtype;
    v_actor uuid;
begin
    select *
    into v_order
    from public.sales_orders
    where id = p_order_id;

    if v_order.id is null then
        raise exception 'Sales order not found for id: %', p_order_id;
    end if;

    v_actor := coalesce(p_created_by, auth.uid());

    insert into public.payments (
        payment_number,
        customer_id,
        order_id,
        payment_method,
        payment_provider,
        provider,
        payment_reference,
        amount,
        currency_code,
        payment_status,
        checkout_session_id,
        notes,
        metadata,
        created_by,
        initiated_at
    )
    values (
        public.generate_payment_number(),
        v_order.customer_id,
        v_order.id,
        coalesce(p_payment_method, 'card'),
        coalesce(p_payment_provider, 'manual'),
        coalesce(p_payment_provider, 'manual'),
        public.generate_payment_reference(),
        v_order.total_amount,
        coalesce(v_order.currency_code, 'ZAR'),
        'pending',
        p_checkout_session_id,
        p_notes,
        jsonb_build_object(
            'source', 'create_payment_for_order',
            'sales_order_id', v_order.id,
            'order_number', v_order.order_number
        ),
        v_actor,
        now()
    )
    returning *
    into v_payment;

    return v_payment;
end;
$$;


-- =========================================================
-- 6) OPTIONAL: updated_at trigger helper
--    only include this if your project already uses it pattern-wide
-- =========================================================
-- create or replace function public.set_updated_at()
-- returns trigger
-- language plpgsql
-- as $$
-- begin
--   new.updated_at = now();
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists trg_payments_updated_at on public.payments;
--
-- create trigger trg_payments_updated_at
-- before update on public.payments
-- for each row
-- execute function public.set_updated_at();

commit;
