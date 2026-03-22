create extension if not exists pgcrypto;

create table public.marketplace_commodities (
  id uuid primary key default gen_random_uuid(),
  commodity_code text not null unique,
  name text not null,
  category text not null check (
    category in ('grain', 'oilseed', 'vegetable', 'seed', 'other')
  ),
  description text,
  unit_of_measure text not null default 'kg',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketplace_listing_statuses (
  id uuid primary key default gen_random_uuid(),
  status_code text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  listing_number text not null unique,
  seller_user_id uuid references public.profiles(id) on delete set null,
  seller_organization_id uuid references public.organizations(id) on delete set null,
  farm_id uuid references public.farms(id) on delete set null,
  field_id uuid references public.fields(id) on delete set null,
  commodity_id uuid not null references public.marketplace_commodities(id) on delete restrict,
  title text not null,
  description text,
  harvest_season text,
  harvest_date date,
  quantity_available numeric not null default 0,
  quantity_reserved numeric not null default 0,
  quantity_unit text not null default 'kg',
  minimum_order_quantity numeric,
  price_type text not null default 'fixed' check (
    price_type in ('fixed', 'negotiable', 'market_linked', 'request_offer')
  ),
  price_per_unit numeric,
  currency_code text not null default 'ZAR',
  quality_grade text,
  moisture_percent numeric,
  protein_percent numeric,
  oil_content_percent numeric,
  foreign_matter_percent numeric,
  packaging_type text,
  pickup_location text,
  pickup_lat numeric,
  pickup_lng numeric,
  region_name text,
  country_code text default 'ZA',
  visibility_scope text not null default 'public' check (
    visibility_scope in ('public', 'authenticated', 'private')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'reserved', 'sold', 'expired', 'archived', 'cancelled')
  ),
  available_from date,
  available_until date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (seller_user_id is not null or seller_organization_id is not null)
);

create table public.marketplace_listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.marketplace_listing_documents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  document_type text not null check (
    document_type in ('quality_report', 'lab_result', 'inspection', 'certificate', 'photo_sheet', 'other')
  ),
  title text not null,
  file_url text not null,
  issued_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.marketplace_listing_lots (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  lot_code text not null,
  quantity_available numeric not null default 0,
  quantity_reserved numeric not null default 0,
  quantity_unit text not null default 'kg',
  batch_reference text,
  quality_grade text,
  moisture_percent numeric,
  storage_location text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (listing_id, lot_code)
);

create table public.marketplace_quality_attributes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  attribute_name text not null,
  attribute_value_text text,
  attribute_value_number numeric,
  unit text,
  created_at timestamptz not null default now()
);

create table public.marketplace_buyer_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  buyer_user_id uuid references public.profiles(id) on delete set null,
  buyer_organization_id uuid references public.organizations(id) on delete set null,
  commodity_id uuid not null references public.marketplace_commodities(id) on delete restrict,
  title text not null,
  description text,
  required_quantity numeric not null,
  quantity_unit text not null default 'kg',
  minimum_quality_grade text,
  target_price_per_unit numeric,
  currency_code text not null default 'ZAR',
  delivery_location text,
  delivery_lat numeric,
  delivery_lng numeric,
  region_name text,
  country_code text default 'ZA',
  required_from date,
  required_until date,
  status text not null default 'open' check (
    status in ('draft', 'open', 'matched', 'closed', 'cancelled')
  ),
  visibility_scope text not null default 'authenticated' check (
    visibility_scope in ('public', 'authenticated', 'private')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (buyer_user_id is not null or buyer_organization_id is not null)
);

create table public.marketplace_matches (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.marketplace_listings(id) on delete cascade,
  buyer_request_id uuid references public.marketplace_buyer_requests(id) on delete cascade,
  match_score numeric,
  match_reason text,
  status text not null default 'suggested' check (
    status in ('suggested', 'contacted', 'converted', 'rejected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_request_id)
);

create table public.marketplace_offers (
  id uuid primary key default gen_random_uuid(),
  offer_number text not null unique,
  listing_id uuid references public.marketplace_listings(id) on delete set null,
  buyer_request_id uuid references public.marketplace_buyer_requests(id) on delete set null,
  seller_user_id uuid references public.profiles(id) on delete set null,
  buyer_user_id uuid references public.profiles(id) on delete set null,
  seller_organization_id uuid references public.organizations(id) on delete set null,
  buyer_organization_id uuid references public.organizations(id) on delete set null,
  initiated_by text not null check (
    initiated_by in ('seller', 'buyer', 'system')
  ),
  quantity numeric not null,
  quantity_unit text not null default 'kg',
  unit_price numeric not null,
  currency_code text not null default 'ZAR',
  total_amount numeric not null default 0,
  offer_status text not null default 'pending' check (
    offer_status in ('pending', 'countered', 'accepted', 'rejected', 'expired', 'cancelled')
  ),
  expires_at timestamptz,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketplace_offer_messages (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.marketplace_offers(id) on delete cascade,
  sender_user_id uuid references public.profiles(id) on delete set null,
  sender_role text,
  message_text text not null,
  created_at timestamptz not null default now()
);

create table public.marketplace_trades (
  id uuid primary key default gen_random_uuid(),
  trade_number text not null unique,
  offer_id uuid not null references public.marketplace_offers(id) on delete restrict,
  listing_id uuid references public.marketplace_listings(id) on delete set null,
  buyer_request_id uuid references public.marketplace_buyer_requests(id) on delete set null,
  seller_user_id uuid references public.profiles(id) on delete set null,
  buyer_user_id uuid references public.profiles(id) on delete set null,
  seller_organization_id uuid references public.organizations(id) on delete set null,
  buyer_organization_id uuid references public.organizations(id) on delete set null,
  quantity numeric not null,
  quantity_unit text not null default 'kg',
  unit_price numeric not null,
  currency_code text not null default 'ZAR',
  total_amount numeric not null,
  trade_status text not null default 'confirmed' check (
    trade_status in ('confirmed', 'in_execution', 'fulfilled', 'cancelled', 'disputed')
  ),
  contract_terms text,
  expected_pickup_date date,
  expected_delivery_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketplace_settlements (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.marketplace_trades(id) on delete cascade,
  settlement_number text not null unique,
  gross_amount numeric not null,
  commission_amount numeric not null default 0,
  logistics_amount numeric not null default 0,
  net_seller_amount numeric not null default 0,
  currency_code text not null default 'ZAR',
  settlement_status text not null default 'pending' check (
    settlement_status in ('pending', 'approved', 'paid', 'failed', 'cancelled')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketplace_payouts (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.marketplace_settlements(id) on delete cascade,
  seller_user_id uuid references public.profiles(id) on delete set null,
  seller_organization_id uuid references public.organizations(id) on delete set null,
  wallet_transaction_id uuid references public.wallet_transactions(id) on delete set null,
  payout_amount numeric not null,
  currency_code text not null default 'ZAR',
  payout_status text not null default 'pending' check (
    payout_status in ('pending', 'processing', 'paid', 'failed', 'cancelled')
  ),
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketplace_disputes (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.marketplace_trades(id) on delete cascade,
  raised_by_user_id uuid references public.profiles(id) on delete set null,
  dispute_type text not null check (
    dispute_type in ('quality', 'quantity', 'delivery', 'payment', 'documentation', 'other')
  ),
  title text not null,
  description text not null,
  status text not null default 'open' check (
    status in ('open', 'under_review', 'resolved', 'rejected', 'closed')
  ),
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marketplace_price_observations (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references public.marketplace_commodities(id) on delete cascade,
  region_name text,
  country_code text default 'ZA',
  observation_date date not null,
  price_per_unit numeric not null,
  currency_code text not null default 'ZAR',
  quantity_unit text not null default 'kg',
  source_label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_marketplace_listings_seller_user_id on public.marketplace_listings(seller_user_id);
create index idx_marketplace_listings_seller_organization_id on public.marketplace_listings(seller_organization_id);
create index idx_marketplace_listings_commodity_id on public.marketplace_listings(commodity_id);
create index idx_marketplace_listings_status on public.marketplace_listings(status);
create index idx_marketplace_listing_images_listing_id on public.marketplace_listing_images(listing_id);
create index idx_marketplace_listing_documents_listing_id on public.marketplace_listing_documents(listing_id);
create index idx_marketplace_listing_lots_listing_id on public.marketplace_listing_lots(listing_id);
create index idx_marketplace_quality_attributes_listing_id on public.marketplace_quality_attributes(listing_id);
create index idx_marketplace_buyer_requests_buyer_user_id on public.marketplace_buyer_requests(buyer_user_id);
create index idx_marketplace_buyer_requests_commodity_id on public.marketplace_buyer_requests(commodity_id);
create index idx_marketplace_buyer_requests_status on public.marketplace_buyer_requests(status);
create index idx_marketplace_matches_listing_id on public.marketplace_matches(listing_id);
create index idx_marketplace_matches_buyer_request_id on public.marketplace_matches(buyer_request_id);
create index idx_marketplace_offers_listing_id on public.marketplace_offers(listing_id);
create index idx_marketplace_offers_buyer_request_id on public.marketplace_offers(buyer_request_id);
create index idx_marketplace_offers_offer_status on public.marketplace_offers(offer_status);
create index idx_marketplace_offer_messages_offer_id on public.marketplace_offer_messages(offer_id);
create index idx_marketplace_trades_offer_id on public.marketplace_trades(offer_id);
create index idx_marketplace_trades_trade_status on public.marketplace_trades(trade_status);
create index idx_marketplace_settlements_trade_id on public.marketplace_settlements(trade_id);
create index idx_marketplace_payouts_settlement_id on public.marketplace_payouts(settlement_id);
create index idx_marketplace_disputes_trade_id on public.marketplace_disputes(trade_id);
create index idx_marketplace_price_observations_commodity_id on public.marketplace_price_observations(commodity_id);

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_commodities_updated_at
before') then create trigger trg_marketplace_commodities_updated_at
before update on public.marketplace_commodities
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_listings_updated_at
before') then create trigger trg_marketplace_listings_updated_at
before update on public.marketplace_listings
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_buyer_requests_updated_at
before') then create trigger trg_marketplace_buyer_requests_updated_at
before update on public.marketplace_buyer_requests
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_offers_updated_at
before') then create trigger trg_marketplace_offers_updated_at
before update on public.marketplace_offers
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_trades_updated_at
before') then create trigger trg_marketplace_trades_updated_at
before update on public.marketplace_trades
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_settlements_updated_at
before') then create trigger trg_marketplace_settlements_updated_at
before update on public.marketplace_settlements
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_payouts_updated_at
before') then create trigger trg_marketplace_payouts_updated_at
before update on public.marketplace_payouts
for each row
 execute function public.set_updated_at(); end if; end 8999;

do 8999 begin if not exists (select 1 from pg_trigger where tgname = 'trg_marketplace_disputes_updated_at
before') then create trigger trg_marketplace_disputes_updated_at
before update on public.marketplace_disputes
for each row
 execute function public.set_updated_at(); end if; end 8999;

alter table public.marketplace_commodities enable row level security;
alter table public.marketplace_listing_statuses enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.marketplace_listing_images enable row level security;
alter table public.marketplace_listing_documents enable row level security;
alter table public.marketplace_listing_lots enable row level security;
alter table public.marketplace_quality_attributes enable row level security;
alter table public.marketplace_buyer_requests enable row level security;
alter table public.marketplace_matches enable row level security;
alter table public.marketplace_offers enable row level security;
alter table public.marketplace_offer_messages enable row level security;
alter table public.marketplace_trades enable row level security;
alter table public.marketplace_settlements enable row level security;
alter table public.marketplace_payouts enable row level security;
alter table public.marketplace_disputes enable row level security;
alter table public.marketplace_price_observations enable row level security;

drop policy if exists "marketplace_commodities_read_authenticated" on public.marketplace_commodities;
create policy "marketplace_commodities_read_authenticated"
on public.marketplace_commodities
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "marketplace_commodities_admin_manage" on public.marketplace_commodities;
create policy "marketplace_commodities_admin_manage"
on public.marketplace_commodities
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "marketplace_listing_statuses_read_authenticated" on public.marketplace_listing_statuses;
create policy "marketplace_listing_statuses_read_authenticated"
on public.marketplace_listing_statuses
for select
to authenticated
using (true);

drop policy if exists "marketplace_listing_statuses_admin_manage" on public.marketplace_listing_statuses;
create policy "marketplace_listing_statuses_admin_manage"
on public.marketplace_listing_statuses
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "marketplace_listings_read_by_visibility" on public.marketplace_listings;
create policy "marketplace_listings_read_by_visibility"
on public.marketplace_listings
for select
to authenticated
using (
  public.is_admin()
  or seller_user_id = auth.uid()
  or (
    status = 'published'
    and (
      visibility_scope = 'public'
      or visibility_scope = 'authenticated'
    )
  )
);

drop policy if exists "marketplace_listings_manage_owner_or_admin" on public.marketplace_listings;
create policy "marketplace_listings_manage_owner_or_admin"
on public.marketplace_listings
for all
to authenticated
using (
  seller_user_id = auth.uid()
  or public.is_admin()
)
with check (
  seller_user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "marketplace_listing_images_read_via_listing" on public.marketplace_listing_images;
create policy "marketplace_listing_images_read_via_listing"
on public.marketplace_listing_images
for select
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_images.listing_id
      and (
        public.is_admin()
        or l.seller_user_id = auth.uid()
        or (
          l.status = 'published'
          and (l.visibility_scope = 'public' or l.visibility_scope = 'authenticated')
        )
      )
  )
);

drop policy if exists "marketplace_listing_images_manage_owner_or_admin" on public.marketplace_listing_images;
create policy "marketplace_listing_images_manage_owner_or_admin"
on public.marketplace_listing_images
for all
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_images.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_images.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "marketplace_listing_documents_read_owner_or_admin" on public.marketplace_listing_documents;
create policy "marketplace_listing_documents_read_owner_or_admin"
on public.marketplace_listing_documents
for select
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_documents.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "marketplace_listing_documents_manage_owner_or_admin" on public.marketplace_listing_documents;
create policy "marketplace_listing_documents_manage_owner_or_admin"
on public.marketplace_listing_documents
for all
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_documents.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_documents.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "marketplace_listing_lots_read_via_listing" on public.marketplace_listing_lots;
create policy "marketplace_listing_lots_read_via_listing"
on public.marketplace_listing_lots
for select
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_lots.listing_id
      and (
        public.is_admin()
        or l.seller_user_id = auth.uid()
        or (
          l.status = 'published'
          and (l.visibility_scope = 'public' or l.visibility_scope = 'authenticated')
        )
      )
  )
);

drop policy if exists "marketplace_listing_lots_manage_owner_or_admin" on public.marketplace_listing_lots;
create policy "marketplace_listing_lots_manage_owner_or_admin"
on public.marketplace_listing_lots
for all
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_lots.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_listing_lots.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "marketplace_quality_attributes_read_via_listing" on public.marketplace_quality_attributes;
create policy "marketplace_quality_attributes_read_via_listing"
on public.marketplace_quality_attributes
for select
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_quality_attributes.listing_id
      and (
        public.is_admin()
        or l.seller_user_id = auth.uid()
        or (
          l.status = 'published'
          and (l.visibility_scope = 'public' or l.visibility_scope = 'authenticated')
        )
      )
  )
);

drop policy if exists "marketplace_quality_attributes_manage_owner_or_admin" on public.marketplace_quality_attributes;
create policy "marketplace_quality_attributes_manage_owner_or_admin"
on public.marketplace_quality_attributes
for all
to authenticated
using (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_quality_attributes.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_quality_attributes.listing_id
      and (l.seller_user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "marketplace_buyer_requests_read_owner_or_published_or_admin" on public.marketplace_buyer_requests;
create policy "marketplace_buyer_requests_read_owner_or_published_or_admin"
on public.marketplace_buyer_requests
for select
to authenticated
using (
  public.is_admin()
  or buyer_user_id = auth.uid()
  or (
    status = 'open'
    and (visibility_scope = 'public' or visibility_scope = 'authenticated')
  )
);

drop policy if exists "marketplace_buyer_requests_manage_owner_or_admin" on public.marketplace_buyer_requests;
create policy "marketplace_buyer_requests_manage_owner_or_admin"
on public.marketplace_buyer_requests
for all
to authenticated
using (
  buyer_user_id = auth.uid()
  or public.is_admin()
)
with check (
  buyer_user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "marketplace_matches_read_related_parties_or_admin" on public.marketplace_matches;
create policy "marketplace_matches_read_related_parties_or_admin"
on public.marketplace_matches
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.marketplace_listings l
    where l.id = marketplace_matches.listing_id
      and l.seller_user_id = auth.uid()
  )
  or exists (
    select 1
    from public.marketplace_buyer_requests br
    where br.id = marketplace_matches.buyer_request_id
      and br.buyer_user_id = auth.uid()
  )
);

drop policy if exists "marketplace_matches_admin_manage" on public.marketplace_matches;
create policy "marketplace_matches_admin_manage"
on public.marketplace_matches
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "marketplace_offers_read_related_parties_or_admin" on public.marketplace_offers;
create policy "marketplace_offers_read_related_parties_or_admin"
on public.marketplace_offers
for select
to authenticated
using (
  public.is_admin()
  or seller_user_id = auth.uid()
  or buyer_user_id = auth.uid()
);

drop policy if exists "marketplace_offers_manage_related_parties_or_admin" on public.marketplace_offers;
create policy "marketplace_offers_manage_related_parties_or_admin"
on public.marketplace_offers
for all
to authenticated
using (
  public.is_admin()
  or seller_user_id = auth.uid()
  or buyer_user_id = auth.uid()
)
with check (
  public.is_admin()
  or seller_user_id = auth.uid()
  or buyer_user_id = auth.uid()
);

drop policy if exists "marketplace_offer_messages_read_related_parties_or_admin" on public.marketplace_offer_messages;
create policy "marketplace_offer_messages_read_related_parties_or_admin"
on public.marketplace_offer_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.marketplace_offers o
    where o.id = marketplace_offer_messages.offer_id
      and (
        public.is_admin()
        or o.seller_user_id = auth.uid()
        or o.buyer_user_id = auth.uid()
      )
  )
);

drop policy if exists "marketplace_offer_messages_manage_related_parties_or_admin" on public.marketplace_offer_messages;
create policy "marketplace_offer_messages_manage_related_parties_or_admin"
on public.marketplace_offer_messages
for all
to authenticated
using (
  exists (
    select 1
    from public.marketplace_offers o
    where o.id = marketplace_offer_messages.offer_id
      and (
        public.is_admin()
        or o.seller_user_id = auth.uid()
        or o.buyer_user_id = auth.uid()
      )
  )
)
with check (
  exists (
    select 1
    from public.marketplace_offers o
    where o.id = marketplace_offer_messages.offer_id
      and (
        public.is_admin()
        or o.seller_user_id = auth.uid()
        or o.buyer_user_id = auth.uid()
      )
  )
);

drop policy if exists "marketplace_trades_read_related_parties_or_admin" on public.marketplace_trades;
create policy "marketplace_trades_read_related_parties_or_admin"
on public.marketplace_trades
for select
to authenticated
using (
  public.is_admin()
  or seller_user_id = auth.uid()
  or buyer_user_id = auth.uid()
);

drop policy if exists "marketplace_trades_manage_admin_only" on public.marketplace_trades;
create policy "marketplace_trades_manage_admin_only"
on public.marketplace_trades
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "marketplace_settlements_read_related_parties_or_admin" on public.marketplace_settlements;
create policy "marketplace_settlements_read_related_parties_or_admin"
on public.marketplace_settlements
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.marketplace_trades t
    where t.id = marketplace_settlements.trade_id
      and (t.seller_user_id = auth.uid() or t.buyer_user_id = auth.uid())
  )
);

drop policy if exists "marketplace_settlements_manage_admin_only" on public.marketplace_settlements;
create policy "marketplace_settlements_manage_admin_only"
on public.marketplace_settlements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "marketplace_payouts_read_related_seller_or_admin" on public.marketplace_payouts;
create policy "marketplace_payouts_read_related_seller_or_admin"
on public.marketplace_payouts
for select
to authenticated
using (
  public.is_admin()
  or seller_user_id = auth.uid()
);

drop policy if exists "marketplace_payouts_manage_admin_only" on public.marketplace_payouts;
create policy "marketplace_payouts_manage_admin_only"
on public.marketplace_payouts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "marketplace_disputes_read_related_parties_or_admin" on public.marketplace_disputes;
create policy "marketplace_disputes_read_related_parties_or_admin"
on public.marketplace_disputes
for select
to authenticated
using (
  public.is_admin()
  or raised_by_user_id = auth.uid()
  or exists (
    select 1
    from public.marketplace_trades t
    where t.id = marketplace_disputes.trade_id
      and (t.seller_user_id = auth.uid() or t.buyer_user_id = auth.uid())
  )
);

drop policy if exists "marketplace_disputes_manage_related_parties_or_admin" on public.marketplace_disputes;
create policy "marketplace_disputes_manage_related_parties_or_admin"
on public.marketplace_disputes
for all
to authenticated
using (
  public.is_admin()
  or raised_by_user_id = auth.uid()
)
with check (
  public.is_admin()
  or raised_by_user_id = auth.uid()
);

drop policy if exists "marketplace_price_observations_read_authenticated" on public.marketplace_price_observations;
create policy "marketplace_price_observations_read_authenticated"
on public.marketplace_price_observations
for select
to authenticated
using (true);

drop policy if exists "marketplace_price_observations_admin_manage" on public.marketplace_price_observations;
create policy "marketplace_price_observations_admin_manage"
on public.marketplace_price_observations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.marketplace_commodities (
  commodity_code,
  name,
  category,
  description,
  unit_of_measure,
  is_active
)
values
  ('maize', 'Maize', 'grain', 'Maize grain or produce listings', 'kg', true),
  ('soybean', 'Soybean', 'oilseed', 'Soybean produce listings', 'kg', true),
  ('sunflower', 'Sunflower', 'oilseed', 'Sunflower produce listings', 'kg', true),
  ('sorghum', 'Sorghum', 'grain', 'Sorghum produce listings', 'kg', true)
on conflict (commodity_code) do nothing;

insert into public.marketplace_listing_statuses (
  status_code,
  name,
  description,
  sort_order
)
values
  ('draft', 'Draft', 'Listing still being prepared', 1),
  ('published', 'Published', 'Listing visible to buyers', 2),
  ('reserved', 'Reserved', 'Quantity partly or fully reserved', 3),
  ('sold', 'Sold', 'Listing fully sold', 4),
  ('expired', 'Expired', 'Listing expired', 5),
  ('archived', 'Archived', 'Listing archived', 6),
  ('cancelled', 'Cancelled', 'Listing cancelled', 7)
on conflict (status_code) do nothing;
