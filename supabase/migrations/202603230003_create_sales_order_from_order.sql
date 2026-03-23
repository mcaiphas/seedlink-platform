begin;

create or replace function public.create_sales_order_from_order(
  p_order_id uuid
)
returns public.sales_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_sales_order public.sales_orders%rowtype;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id;

  if v_order.id is null then
    raise exception 'Order not found: %', p_order_id;
  end if;

  if v_order.sales_order_id is not null then
    select *
    into v_sales_order
    from public.sales_orders
    where id = v_order.sales_order_id;

    return v_sales_order;
  end if;

  insert into public.sales_orders (
    sales_order_number,
    source_order_id,
    customer_id,
    total_amount,
    currency_code,
    status,
    payment_status,
    created_at,
    updated_at
  )
  values (
    public.generate_sales_order_number(),
    v_order.id,
    v_order.customer_id,
    v_order.total_amount,
    coalesce(v_order.currency_code, 'ZAR'),
    'confirmed',
    coalesce(v_order.payment_status, 'pending'),
    now(),
    now()
  )
  returning *
  into v_sales_order;

  update public.orders
  set sales_order_id = v_sales_order.id
  where id = v_order.id;

  return v_sales_order;
end;
$$;

commit;
