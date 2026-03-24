-- =========================================
-- Communication Channels (Multi-channel engine)
-- =========================================

create table if not exists public.communication_channels (
  id uuid primary key default gen_random_uuid(),

  company_id uuid null,

  channel_type text not null
    check (channel_type in ('email','sms','whatsapp')),

  provider text not null, -- sendgrid, twilio, meta

  is_active boolean default true,
  is_default boolean default false,

  config jsonb not null,

  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_comm_channels_type
  on public.communication_channels(channel_type);

create index if not exists idx_comm_channels_company
  on public.communication_channels(company_id);

-- Optional: only one default per channel
create unique index if not exists uniq_default_channel_per_type
on public.communication_channels(channel_type)
where is_default = true;

-- =========================================
-- RLS (optional but recommended)
-- =========================================

alter table public.communication_channels enable row level security;

-- Example policy (adjust later for RBAC)
create policy "Allow read for all authenticated users"
on public.communication_channels
for select
using (true);

create policy "Allow insert for admins"
on public.communication_channels
for insert
with check (true);
