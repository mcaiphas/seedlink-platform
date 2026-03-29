-- supabase/migrations/<timestamp>_create_cms_hero_table.sql

create table public.cms_hero (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text,
  cta_label text not null default 'Shop Seeds',
  cta_link text not null default '/products',
  background_image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_hero enable row level security;

create policy "Anyone can read active hero banners"
  on public.cms_hero for select
  using (is_active = true);

insert into public.cms_hero (headline, subheadline, cta_label, cta_link)
values (
  'Grow with Confidence',
  'Premium seeds, expert agronomy advice, and everything your farm needs — delivered.',
  'Shop Seeds',
  '/products'
);
