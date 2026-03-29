create table public.cms_cta (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text,
  cta_label text not null default 'Get Started',
  cta_link text not null default '/',
  background_color text default '#1D1D1B',
  text_color text default '#FFFFFF',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_cta enable row level security;

create policy "Anyone can read active CTA"
  on public.cms_cta for select
  using (is_active = true);

insert into public.cms_cta (headline, subheadline)
values
  ('Start Growing Today', 'Access premium seeds, tools, and advice now.');
