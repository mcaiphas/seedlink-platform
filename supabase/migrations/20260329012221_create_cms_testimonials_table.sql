create table public.cms_testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  quote text not null,
  rating int default 5,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_testimonials enable row level security;

create policy "Anyone can read active testimonials"
  on public.cms_testimonials for select
  using (is_active = true);

insert into public.cms_testimonials (customer_name, quote)
values
  ('Farmer John', 'Seedlink transformed my yields this season!'),
  ('Farmer Mary', 'Excellent service and high-quality seeds.');
