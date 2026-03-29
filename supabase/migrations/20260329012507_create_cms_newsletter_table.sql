create table public.cms_newsletter (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_newsletter enable row level security;

create policy "Anyone can read active newsletter section"
  on public.cms_newsletter for select
  using (is_active = true);

insert into public.cms_newsletter (headline, subheadline)
values
  ('Subscribe to Our Newsletter', 'Get the latest updates and offers from Seedlink.');
