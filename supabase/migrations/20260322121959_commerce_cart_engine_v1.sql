-- =========================================================
-- Seedlink Commerce: Cart Engine v1
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. Get or create active cart
-- ---------------------------------------------------------
create or replace function public.get_or_create_active_cart(
  p_customer_id uuid default null,
  p_currency_code text default 'ZAR'
)
returns public.shopping_carts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart public.shopping_carts;
begin
  -- try user-owned active cart first
  if auth.uid() is not null then
    select *
    into v_cart
    from public.shopping_carts
    where user_id = auth.uid()
      and status = 'active'
    order by updated_at desc
    limit 1;
  end if;

  -- fallback to customer-owned cart if user cart not found
  if v_cart.id is null and p_customer_id is not null then
    select *
    into v_cart
    from public.shopping_carts
    where customer_id = p_customer_id
      and status = 'active'
    order by updated_at desc
    limit 1;
  end if;

  -- create if still missing
  if v_cart.id is null then
    insert into public.shopping_carts (
      customer_id,
      user_id,
      status,
      currency_code
    )
    values (
      p_customer_id,
      auth.uid(),
      'active',
      coalesce(p_currency_code, 'ZAR')
    )
    returning * into v_cart;
  end if;

  return v_cart;
end;
$$;

grant execute on function public.get_or_create_active_cart(uuid, text) to authenticated;

-- ---------------------------------------------------------
-- 2. Cart detail
-- ---------------------------------------------------------
create or replace function public.get_cart_detail(
  p_cart_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart_id uuid;
  v_result jsonb;
begin
  if p_cart_id is not null then
    v_cart_id := p_cart_id;
  else
    select id
    into v_cart_id
    from public.shopping_carts
    where user_id = auth.uid()
      and status = 'active'
    order by updated_at desc
    limit 1;
  end if;

  if v_cart_id is null then
    return jsonb_build_object(
      'cart', null,
      'items', '[]'::jsonb
    );
  end if;

  select jsonb_build_object(
    'cart', to_jsonb(sc),
    'items', coalesce((
      select jsonb_agg(to_jsonb(ci) order by ci.created_at asc)
      from public.cart_items ci
      where ci.cart_id = sc.id
    ), '[]'::jsonb)
  )
  into v_result
  from public.shopping_carts sc
  where sc.id = v_cart_id;

  return v_result;
end;
$$;

grant execute on function public.get_cart_detail(uuid) to authenticated;

-- ---------------------------------------------------------
-- 3. Add to cart
-- ---------------------------------------------------------
create or replace function public.add_to_cart(
  p_product_id uuid,
  p_quantity numeric,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart public.shopping_carts;
  v_existing public.cart_items;
  v_product record;
  v_tax_rate numeric(8,4) := 0;
  v_subtotal numeric(18,2);
  v_tax_amount numeric(18,2);
  v_line_total numeric(18,2);
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  select
    p.id,
    coalesce(p.name, 'Unnamed Product') as product_name,
    nullif(p.sku, '') as product_sku,
    coalesce(p.selling_price, p.price, 0)::numeric(18,2) as unit_price
  into v_product
  from public.products p
  where p.id = p_product_id;

  if v_product.id is null then
    raise exception 'Product not found';
  end if;

  v_cart := public.get_or_create_active_cart(p_customer_id, 'ZAR');

  select *
  into v_existing
  from public.cart_items
  where cart_id = v_cart.id
    and product_id = p_product_id
  limit 1;

  if v_existing.id is not null then
    update public.cart_items
    set
      quantity = v_existing.quantity + p_quantity,
      tax_amount = round((((unit_price * (v_existing.quantity + p_quantity)) - discount_amount) * v_tax_rate)::numeric, 2),
      line_total = round((((unit_price * (v_existing.quantity + p_quantity)) - discount_amount) * (1 + v_tax_rate))::numeric, 2),
      updated_at = now()
    where id = v_existing.id;
  else
    v_subtotal := round((v_product.unit_price * p_quantity)::numeric, 2);
    v_tax_amount := round((v_subtotal * v_tax_rate)::numeric, 2);
    v_line_total := round((v_subtotal + v_tax_amount)::numeric, 2);

    insert into public.cart_items (
      cart_id,
      product_id,
      product_name,
      product_sku,
      quantity,
      unit_price,
      tax_rate,
      tax_amount,
      discount_amount,
      line_total
    )
    values (
      v_cart.id,
      v_product.id,
      v_product.product_name,
      v_product.product_sku,
      p_quantity,
      v_product.unit_price,
      v_tax_rate,
      v_tax_amount,
      0,
      v_line_total
    );
  end if;

  perform public.recalculate_cart_totals(v_cart.id);

  return public.get_cart_detail(v_cart.id);
end;
$$;

grant execute on function public.add_to_cart(uuid, numeric, uuid) to authenticated;

-- ---------------------------------------------------------
-- 4. Update cart item quantity
-- ---------------------------------------------------------
create or replace function public.update_cart_item_quantity(
  p_cart_item_id uuid,
  p_quantity numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item public.cart_items;
  v_tax_amount numeric(18,2);
  v_line_total numeric(18,2);
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  select *
  into v_item
  from public.cart_items
  where id = p_cart_item_id;

  if v_item.id is null then
    raise exception 'Cart item not found';
  end if;

  v_tax_amount := round((((v_item.unit_price * p_quantity) - v_item.discount_amount) * v_item.tax_rate)::numeric, 2);
  v_line_total := round((((v_item.unit_price * p_quantity) - v_item.discount_amount) * (1 + v_item.tax_rate))::numeric, 2);

  update public.cart_items
  set
    quantity = p_quantity,
    tax_amount = v_tax_amount,
    line_total = v_line_total,
    updated_at = now()
  where id = p_cart_item_id;

  perform public.recalculate_cart_totals(v_item.cart_id);

  return public.get_cart_detail(v_item.cart_id);
end;
$$;

grant execute on function public.update_cart_item_quantity(uuid, numeric) to authenticated;

-- ---------------------------------------------------------
-- 5. Remove cart item
-- ---------------------------------------------------------
create or replace function public.remove_cart_item(
  p_cart_item_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item public.cart_items;
begin
  select *
  into v_item
  from public.cart_items
  where id = p_cart_item_id;

  if v_item.id is null then
    raise exception 'Cart item not found';
  end if;

  delete from public.cart_items
  where id = p_cart_item_id;

  perform public.recalculate_cart_totals(v_item.cart_id);

  return public.get_cart_detail(v_item.cart_id);
end;
$$;

grant execute on function public.remove_cart_item(uuid) to authenticated;

-- ---------------------------------------------------------
-- 6. Create order from cart
-- ---------------------------------------------------------
create or replace function public.create_order_from_cart(
  p_cart_id uuid,
  p_customer_id uuid default null,
  p_payment_method text default 'card',
  p_billing_address jsonb default '{}'::jsonb,
  p_delivery_address jsonb default '{}'::jsonb,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart public.shopping_carts;
  v_order public.sales_orders;
begin
  select *
  into v_cart
  from public.shopping_carts
  where id = p_cart_id;

  if v_cart.id is null then
    raise exception 'Cart not found';
  end if;

  if v_cart.status <> 'active' then
    raise exception 'Only active carts can be checked out';
  end if;

  if coalesce(v_cart.item_count, 0) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.sales_orders (
    cart_id,
    customer_id,
    user_id,
    status,
    payment_status,
    fulfillment_status,
    payment_method,
    currency_code,
    subtotal,
    tax_amount,
    discount_amount,
    total_amount,
    billing_address,
    delivery_address,
    notes,
    placed_at
  )
  values (
    v_cart.id,
    coalesce(p_customer_id, v_cart.customer_id),
    auth.uid(),
    case when p_payment_method = 'credit_account' then 'awaiting_approval' else 'pending_payment' end,
    case when p_payment_method = 'credit_account' then 'pending' else 'unpaid' end,
    'unallocated',
    coalesce(p_payment_method, 'card'),
    v_cart.currency_code,
    v_cart.subtotal,
    v_cart.tax_amount,
    v_cart.discount_amount,
    v_cart.total_amount,
    coalesce(p_billing_address, '{}'::jsonb),
    coalesce(p_delivery_address, '{}'::jsonb),
    p_notes,
    now()
  )
  returning * into v_order;

  insert into public.sales_order_lines (
    sales_order_id,
    product_id,
    product_name,
    product_sku,
    variant_id,
    variant_name,
    uom,
    quantity,
    unit_price,
    tax_rate,
    tax_amount,
    discount_amount,
    shipping_amount,
    line_total,
    metadata
  )
  select
    v_order.id,
    ci.product_id,
    ci.product_name,
    ci.product_sku,
    ci.variant_id,
    ci.variant_name,
    ci.uom,
    ci.quantity,
    ci.unit_price,
    ci.tax_rate,
    ci.tax_amount,
    ci.discount_amount,
    0,
    ci.line_total,
    ci.metadata
  from public.cart_items ci
  where ci.cart_id = v_cart.id;

  perform public.recalculate_sales_order_totals(v_order.id);
  perform public.mark_cart_converted(v_cart.id, v_order.id);

  return jsonb_build_object(
    'order', to_jsonb(v_order),
    'order_lines', (
      select coalesce(jsonb_agg(to_jsonb(sol) order by sol.created_at asc), '[]'::jsonb)
      from public.sales_order_lines sol
      where sol.sales_order_id = v_order.id
    )
  );
end;
$$;

grant execute on function public.create_order_from_cart(uuid, uuid, text, jsonb, jsonb, text) to authenticated;
