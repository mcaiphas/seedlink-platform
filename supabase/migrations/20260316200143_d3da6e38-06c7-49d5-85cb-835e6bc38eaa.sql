
-- ============================================================
-- Approval Requests table for centralized approval workflow
-- ============================================================
create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null, -- stock_adjustment, depot_transfer, purchase_order, price_change, inventory_writeoff
  reference_id uuid not null,
  reference_number text,
  requested_by uuid references public.profiles(id),
  requested_at timestamptz not null default now(),
  approval_status text not null default 'pending', -- pending, approved, rejected, cancelled
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  rejection_reason text,
  value_impact numeric(14,2) default 0,
  description text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.approval_requests enable row level security;

-- RLS policies
create policy "Authenticated users can view approval requests"
  on public.approval_requests for select to authenticated using (true);

create policy "Authenticated users can insert approval requests"
  on public.approval_requests for insert to authenticated with check (true);

create policy "Authenticated users can update approval requests"
  on public.approval_requests for update to authenticated using (true);

-- Indexes
create index if not exists idx_approval_requests_status on public.approval_requests(approval_status);
create index if not exists idx_approval_requests_type on public.approval_requests(request_type);
create index if not exists idx_approval_requests_ref on public.approval_requests(reference_id);

-- Add cost_price to depot_inventory for valuation if not exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'depot_inventory' and column_name = 'unit_cost') then
    alter table public.depot_inventory add column unit_cost numeric(14,4) default 0;
  end if;
end $$;
