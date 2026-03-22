alter table public.cart_items
  add column if not exists tax_rate numeric(8,4) not null default 0,
  add column if not exists tax_amount numeric(18,2) not null default 0,
  add column if not exists discount_amount numeric(18,2) not null default 0,
  add column if not exists line_total numeric(18,2) not null default 0,
  add column if not exists updated_at timestamptz not null default now();

alter table public.sales_order_lines
  add column if not exists tax_rate numeric(8,4) not null default 0,
  add column if not exists tax_amount numeric(18,2) not null default 0,
  add column if not exists discount_amount numeric(18,2) not null default 0,
  add column if not exists line_total numeric(18,2) not null default 0,
  add column if not exists updated_at timestamptz not null default now();
