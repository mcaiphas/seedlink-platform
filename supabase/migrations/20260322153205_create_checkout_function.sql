begin;

create or replace function public.create_checkout(
    p_checkout_type text,
    p_order_id uuid default null,
    p_course_id uuid default null,
    p_subscription_plan_id uuid default null,
    p_digital_product_id uuid default null,
    p_delivery_request_id uuid default null,
    p_payment_method text default 'card',
    p_provider text default 'manual',
    p_metadata jsonb default '{}'::jsonb
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
    v_payment public.payments%rowtype;
    v_amount numeric;
    v_payment_type text;
begin

    -- ========================================
    -- DETERMINE PAYMENT TYPE
    -- ========================================
    if p_checkout_type = 'order' then
        v_payment_type := 'order_payment';

        select total_amount
        into v_amount
        from public.sales_orders
        where id = p_order_id;

        if v_amount is null then
            raise exception 'Order not found: %', p_order_id;
        end if;

        select *
        into v_payment
        from public.create_payment_for_order(
            p_order_id,
            p_payment_method,
            p_provider,
            'checkout-' || p_order_id::text,
            null,
            'Checkout initiated'
        );

        return v_payment;
    end if;

    -- ========================================
    -- COURSE
    -- ========================================
    if p_checkout_type = 'course' then
        v_payment_type := 'course_payment';

        v_amount := (p_metadata->>'price')::numeric;

    elsif p_checkout_type = 'subscription' then
        v_payment_type := 'subscription_payment';

        v_amount := (p_metadata->>'price')::numeric;

    elsif p_checkout_type = 'digital_product' then
        v_payment_type := 'digital_product_payment';

        v_amount := (p_metadata->>'price')::numeric;

    elsif p_checkout_type = 'delivery' then
        v_payment_type := 'delivery_payment';

        v_amount := (p_metadata->>'price')::numeric;

    else
        raise exception 'Unsupported checkout type: %', p_checkout_type;
    end if;

    -- ========================================
    -- GENERIC PAYMENT CREATION
    -- ========================================
    insert into public.payments (
        payment_number,
        payment_method,
        payment_provider,
        provider,
        payment_reference,
        amount,
        currency_code,
        payment_status,
        payment_type,
        provider_checkout_session_id,
        metadata,
        initiated_at
    )
    values (
        public.generate_payment_number(),
        p_payment_method,
        p_provider,
        p_provider,
        public.generate_payment_reference(),
        v_amount,
        'ZAR',
        'pending',
        v_payment_type,
        'checkout-' || gen_random_uuid()::text,
        p_metadata,
        now()
    )
    returning *
    into v_payment;

    return v_payment;

end;
$$;

commit;
