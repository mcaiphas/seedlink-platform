create table public.cms_footer_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon_name text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_footer_links enable row level security;

create policy "Anyone can read active footer links"
  on public.cms_footer_links for select
  using (is_active = true);

insert into public.cms_footer_links (label, url)
values
  ('Home', '/'),
  ('Shop', '/shop'),
  ('About Us', '/about'),
  ('Contact', '/contact');
