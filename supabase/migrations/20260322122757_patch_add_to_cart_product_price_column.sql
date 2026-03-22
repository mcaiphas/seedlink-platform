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
    coalesce(p.price, 0)::numeric(18,2) as unit_price
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
