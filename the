create extension if not exists pgcrypto;
create extension if not exists vector;

create table public.knowledge_ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.knowledge_sources(id) on delete set null,
  document_id uuid references public.knowledge_documents(id) on delete set null,
  job_type text not null check (
    job_type in ('upload', 'parse', 'chunk', 'embed', 'crawl', 'reindex', 'sync')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'completed', 'failed', 'cancelled')
  ),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.website_crawl_targets (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.knowledge_sources(id) on delete cascade,
  base_url text not null,
  allowed_paths jsonb not null default '[]'::jsonb,
  blocked_paths jsonb not null default '[]'::jsonb,
  crawl_depth integer not null default 2,
  crawl_frequency text not null default 'manual' check (
    crawl_frequency in ('manual', 'daily', 'weekly', 'monthly')
  ),
  is_active boolean not null default true,
  last_crawled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (base_url)
);

create table public.website_crawl_pages (
  id uuid primary key default gen_random_uuid(),
  crawl_target_id uuid not null references public.website_crawl_targets(id) on delete cascade,
  source_id uuid references public.knowledge_sources(id) on delete set null,
  document_id uuid references public.knowledge_documents(id) on delete set null,
  page_url text not null,
  page_title text,
  http_status integer,
  page_hash text,
  crawled_at timestamptz not null default now(),
  content_extracted boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  unique (page_url)
);

alter table public.knowledge_document_chunks
  add column if not exists embedding vector(1536),
  add column if not exists embedding_model text,
  add column if not exists embedding_provider text,
  add column if not exists embedded_at timestamptz,
  add column if not exists chunk_hash text;

create table public.advisor_tools (
  id uuid primary key default gen_random_uuid(),
  tool_code text not null unique,
  name text not null,
  description text,
  tool_type text not null check (
    tool_type in ('retrieval', 'web_search', 'calculator', 'api', 'workflow', 'internal')
  ),
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_profile_tools (
  id uuid primary key default gen_random_uuid(),
  advisor_profile_id uuid not null references public.advisor_profiles(id) on delete cascade,
  tool_id uuid not null references public.advisor_tools(id) on delete cascade,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (advisor_profile_id, tool_id)
);

create table public.advisor_retrieval_logs (
  id uuid primary key default gen_random_uuid(),
  query_log_id uuid references public.advisor_query_logs(id) on delete cascade,
  conversation_id uuid references public.advisor_conversations(id) on delete set null,
  message_id uuid references public.advisor_messages(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  advisor_profile_id uuid references public.advisor_profiles(id) on delete set null,
  query_text text not null,
  retrieval_type text not null check (
    retrieval_type in ('semantic', 'keyword', 'hybrid', 'web', 'manual')
  ),
  top_k integer not null default 5,
  total_results integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.advisor_retrieval_results (
  id uuid primary key default gen_random_uuid(),
  retrieval_log_id uuid not null references public.advisor_retrieval_logs(id) on delete cascade,
  document_id uuid references public.knowledge_documents(id) on delete set null,
  chunk_id uuid references public.knowledge_document_chunks(id) on delete set null,
  source_type text,
  source_label text,
  score numeric,
  rank_order integer,
  snippet text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.advisor_web_search_logs (
  id uuid primary key default gen_random_uuid(),
  query_log_id uuid references public.advisor_query_logs(id) on delete cascade,
  advisor_profile_id uuid references public.advisor_profiles(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  search_query text not null,
  provider text,
  status text not null default 'success' check (
    status in ('success', 'error', 'blocked')
  ),
  result_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.advisor_web_search_results (
  id uuid primary key default gen_random_uuid(),
  web_search_log_id uuid not null references public.advisor_web_search_logs(id) on delete cascade,
  title text,
  url text,
  domain text,
  snippet text,
  rank_order integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_knowledge_ingestion_jobs_source_id on public.knowledge_ingestion_jobs(source_id);
create index idx_knowledge_ingestion_jobs_document_id on public.knowledge_ingestion_jobs(document_id);
create index idx_knowledge_ingestion_jobs_status on public.knowledge_ingestion_jobs(status);
create index idx_website_crawl_targets_source_id on public.website_crawl_targets(source_id);
create index idx_website_crawl_pages_crawl_target_id on public.website_crawl_pages(crawl_target_id);
create index idx_website_crawl_pages_source_id on public.website_crawl_pages(source_id);
create index idx_website_crawl_pages_document_id on public.website_crawl_pages(document_id);
create index idx_advisor_profile_tools_advisor_profile_id on public.advisor_profile_tools(advisor_profile_id);
create index idx_advisor_profile_tools_tool_id on public.advisor_profile_tools(tool_id);
create index idx_advisor_retrieval_logs_query_log_id on public.advisor_retrieval_logs(query_log_id);
create index idx_advisor_retrieval_logs_conversation_id on public.advisor_retrieval_logs(conversation_id);
create index idx_advisor_retrieval_logs_user_id on public.advisor_retrieval_logs(user_id);
create index idx_advisor_retrieval_results_retrieval_log_id on public.advisor_retrieval_results(retrieval_log_id);
create index idx_advisor_retrieval_results_document_id on public.advisor_retrieval_results(document_id);
create index idx_advisor_retrieval_results_chunk_id on public.advisor_retrieval_results(chunk_id);
create index idx_advisor_web_search_logs_query_log_id on public.advisor_web_search_logs(query_log_id);
create index idx_advisor_web_search_results_web_search_log_id on public.advisor_web_search_results(web_search_log_id);

create index if not exists idx_knowledge_document_chunks_embedding
on public.knowledge_document_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_count integer default 5,
  filter_access_level text default null
)
returns table (
  chunk_id uuid,
  document_id uuid,
  chunk_text text,
  similarity float,
  access_level text,
  document_title text
)
language sql
stable
as $$
  select
    c.id as chunk_id,
    c.document_id,
    c.chunk_text,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.access_level,
    d.title as document_title
  from public.knowledge_document_chunks c
  join public.knowledge_documents d on d.id = c.document_id
  where c.embedding is not null
    and d.is_published = true
    and (
      filter_access_level is null
      or d.access_level = filter_access_level
    )
    and (
      public.is_admin()
      or d.access_level = 'public'
      or d.access_level = 'authenticated'
      or (
        d.access_level = 'premium'
        and exists (
          select 1
          from public.subscriptions s
          where s.user_id = auth.uid()
            and s.status in ('trialing', 'active')
        )
      )
    )
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

create trigger trg_knowledge_ingestion_jobs_updated_at
before update on public.knowledge_ingestion_jobs
for each row
execute function public.set_updated_at();

create trigger trg_website_crawl_targets_updated_at
before update on public.website_crawl_targets
for each row
execute function public.set_updated_at();

create trigger trg_advisor_tools_updated_at
before update on public.advisor_tools
for each row
execute function public.set_updated_at();

alter table public.knowledge_ingestion_jobs enable row level security;
alter table public.website_crawl_targets enable row level security;
alter table public.website_crawl_pages enable row level security;
alter table public.advisor_tools enable row level security;
alter table public.advisor_profile_tools enable row level security;
alter table public.advisor_retrieval_logs enable row level security;
alter table public.advisor_retrieval_results enable row level security;
alter table public.advisor_web_search_logs enable row level security;
alter table public.advisor_web_search_results enable row level security;

drop policy if exists "knowledge_ingestion_jobs_admin_or_trainer_manage" on public.knowledge_ingestion_jobs;
create policy "knowledge_ingestion_jobs_admin_or_trainer_manage"
on public.knowledge_ingestion_jobs
for all
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
)
with check (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "website_crawl_targets_admin_or_trainer_manage" on public.website_crawl_targets;
create policy "website_crawl_targets_admin_or_trainer_manage"
on public.website_crawl_targets
for all
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
)
with check (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "website_crawl_pages_admin_or_trainer_read" on public.website_crawl_pages;
create policy "website_crawl_pages_admin_or_trainer_read"
on public.website_crawl_pages
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "website_crawl_pages_admin_manage" on public.website_crawl_pages;
create policy "website_crawl_pages_admin_manage"
on public.website_crawl_pages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_tools_read_authenticated" on public.advisor_tools;
create policy "advisor_tools_read_authenticated"
on public.advisor_tools
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "advisor_tools_manage_admin" on public.advisor_tools;
create policy "advisor_tools_manage_admin"
on public.advisor_tools
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_profile_tools_read_authenticated" on public.advisor_profile_tools;
create policy "advisor_profile_tools_read_authenticated"
on public.advisor_profile_tools
for select
to authenticated
using (true);

drop policy if exists "advisor_profile_tools_manage_admin" on public.advisor_profile_tools;
create policy "advisor_profile_tools_manage_admin"
on public.advisor_profile_tools
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_retrieval_logs_select_own_or_admin" on public.advisor_retrieval_logs;
create policy "advisor_retrieval_logs_select_own_or_admin"
on public.advisor_retrieval_logs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_retrieval_logs_manage_admin_only" on public.advisor_retrieval_logs;
create policy "advisor_retrieval_logs_manage_admin_only"
on public.advisor_retrieval_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_retrieval_results_select_own_or_admin" on public.advisor_retrieval_results;
create policy "advisor_retrieval_results_select_own_or_admin"
on public.advisor_retrieval_results
for select
to authenticated
using (
  exists (
    select 1
    from public.advisor_retrieval_logs rl
    where rl.id = advisor_retrieval_results.retrieval_log_id
      and (rl.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "advisor_retrieval_results_manage_admin_only" on public.advisor_retrieval_results;
create policy "advisor_retrieval_results_manage_admin_only"
on public.advisor_retrieval_results
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_web_search_logs_select_own_or_admin" on public.advisor_web_search_logs;
create policy "advisor_web_search_logs_select_own_or_admin"
on public.advisor_web_search_logs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_web_search_logs_manage_admin_only" on public.advisor_web_search_logs;
create policy "advisor_web_search_logs_manage_admin_only"
on public.advisor_web_search_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_web_search_results_select_own_or_admin" on public.advisor_web_search_results;
create policy "advisor_web_search_results_select_own_or_admin"
on public.advisor_web_search_results
for select
to authenticated
using (
  exists (
    select 1
    from public.advisor_web_search_logs wl
    where wl.id = advisor_web_search_results.web_search_log_id
      and (wl.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "advisor_web_search_results_manage_admin_only" on public.advisor_web_search_results;
create policy "advisor_web_search_results_manage_admin_only"
on public.advisor_web_search_results
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.advisor_tools (
  tool_code,
  name,
  description,
  tool_type,
  is_active,
  config
)
values
  (
    'knowledge_retrieval',
    'Knowledge Retrieval',
    'Retrieves relevant Seedlink knowledge base chunks using semantic or hybrid search',
    'retrieval',
    true,
    '{"default_top_k": 5, "strategy": "hybrid"}'::jsonb
  ),
  (
    'web_search',
    'Web Search',
    'Searches trusted public web sources for current information when needed',
    'web_search',
    true,
    '{"allowed_domains": [], "mode": "on_demand"}'::jsonb
  ),
  (
    'fertiliser_calculator',
    'Fertiliser Calculator',
    'Runs fertiliser recommendation logic based on crop, yield target and soil data',
    'calculator',
    true,
    '{"module": "agronomy"}'::jsonb
  ),
  (
    'spray_program_builder',
    'Spray Program Builder',
    'Helps construct crop protection and spray program recommendations',
    'calculator',
    true,
    '{"module": "agronomy"}'::jsonb
  )
on conflict (tool_code) do nothing;

insert into public.advisor_profile_tools (
  advisor_profile_id,
  tool_id,
  is_required,
  sort_order
)
select ap.id, t.id, false, 1
from public.advisor_profiles ap
join public.advisor_tools t on t.tool_code = 'knowledge_retrieval'
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, tool_id) do nothing;

insert into public.advisor_profile_tools (
  advisor_profile_id,
  tool_id,
  is_required,
  sort_order
)
select ap.id, t.id, false, 2
from public.advisor_profiles ap
join public.advisor_tools t on t.tool_code = 'web_search'
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, tool_id) do nothing;

insert into public.advisor_profile_tools (
  advisor_profile_id,
  tool_id,
  is_required,
  sort_order
)
select ap.id, t.id, false, 3
from public.advisor_profiles ap
join public.advisor_tools t on t.tool_code = 'fertiliser_calculator'
where ap.advisor_code = 'seedlink-agronomy'
on conflict (advisor_profile_id, tool_id) do nothing;

insert into public.advisor_profile_tools (
  advisor_profile_id,
  tool_id,
  is_required,
  sort_order
)
select ap.id, t.id, false, 4
from public.advisor_profiles ap
join public.advisor_tools t on t.tool_code = 'spray_program_builder'
where ap.advisor_code = 'seedlink-agronomy'
on conflict (advisor_profile_id, tool_id) do nothing;
