alter table public.cart_items
  add column if not exists product_sku text null,
  add column if not exists variant_id uuid null,
  add column if not exists variant_name text null,
  add column if not exists uom text null,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.sales_order_lines
  add column if not exists product_sku text null,
  add column if not exists variant_id uuid null,
  add column if not exists variant_name text null,
  add column if not exists uom text null,
  add column if not exists shipping_amount numeric(18,2) not null default 0,
  add column if not exists metadata jsonb not null default '{}'::jsonb;
