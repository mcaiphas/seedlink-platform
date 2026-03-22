begin;

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
        provider_checkout_session_id,
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

commit;
