create table public.cms_about (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_about enable row level security;

create policy "Anyone can read active about section"
  on public.cms_about for select
  using (is_active = true);

insert into public.cms_about (title, content)
values
  ('Our Mission', 'Delivering premium seeds, knowledge, and logistics solutions across Africa.');
