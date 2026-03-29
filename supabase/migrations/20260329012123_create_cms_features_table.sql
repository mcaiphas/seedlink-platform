create table public.cms_features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon_name text,
  icon_color text default '#6DBE45',
  link text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_features enable row level security;

create policy "Anyone can read active features"
  on public.cms_features for select
  using (is_active = true);

insert into public.cms_features (title, description, icon_name)
values
  ('Learn', 'Interactive courses to upskill farmers', 'BookOpen'),
  ('Shop', 'Premium seeds and inputs available online', 'ShoppingCart'),
  ('Agronomy Tools', 'Expert calculators and recommendations', 'TrendingUp'),
  ('Marketplace', 'Buy and sell seeds, inputs, and crops', 'Users'),
  ('Seedlink AI', 'AI-powered crop and operational insights', 'Cpu');
