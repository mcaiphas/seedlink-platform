begin;

create or replace function public.confirm_checkout(
    p_payment_id uuid,
    p_provider_transaction_id text default null,
    p_response_payload jsonb default '{}'::jsonb
)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
    v_payment public.payments%rowtype;
    v_attempt public.payment_attempts%rowtype;
begin
    select *
    into v_payment
    from public.payments
    where id = p_payment_id
    for update;

    if v_payment.id is null then
        raise exception 'Payment not found: %', p_payment_id;
    end if;

    if v_payment.payment_status = 'paid' then
        return v_payment;
    end if;

    select *
    into v_attempt
    from public.payment_attempts
    where payment_id = p_payment_id
    order by attempt_number desc
    limit 1;

    if v_attempt.id is null then
        select *
        into v_attempt
        from public.create_payment_attempt(
            p_payment_id,
            coalesce(v_payment.provider, v_payment.payment_provider, 'manual'),
            v_payment.payment_method,
            v_payment.amount,
            v_payment.currency_code,
            '{}'::jsonb
        );
    end if;

    select *
    into v_payment
    from public.mark_payment_paid(
        p_payment_id,
        v_attempt.id,
        coalesce(p_provider_transaction_id, 'MANUAL-' || p_payment_id::text),
        v_payment.provider_payment_intent_id,
        v_payment.provider_checkout_session_id,
        v_payment.amount,
        coalesce(p_response_payload, '{}'::jsonb)
    );

    return v_payment;
end;
$$;

commit;
