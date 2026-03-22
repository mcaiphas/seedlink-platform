-- Drop old FK if it exists
alter table public.cart_items
  drop constraint if exists cart_items_cart_id_fkey;

-- Recreate FK to shopping_carts
alter table public.cart_items
  add constraint cart_items_cart_id_fkey
  foreign key (cart_id)
  references public.shopping_carts(id)
  on delete cascade;
