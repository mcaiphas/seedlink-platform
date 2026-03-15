create extension if not exists pgcrypto;

create table public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (
    source_type in ('pdf', 'website', 'manual', 'article', 'course', 'internal_note', 'api', 'other')
  ),
  description text,
  source_url text,
  language_code text default 'en',
  country_code text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.knowledge_sources(id) on delete cascade,
  title text not null,
  slug text unique,
  document_type text not null default 'reference' check (
    document_type in ('reference', 'training', 'faq', 'research', 'policy', 'crop_guide', 'spray_program', 'fertiliser_guide', 'other')
  ),
  storage_path text,
  original_url text,
  plain_text text,
  summary text,
  language_code text default 'en',
  country_code text,
  access_level text not null default 'public' check (
    access_level in ('public', 'authenticated', 'premium', 'admin')
  ),
  is_published boolean not null default true,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  chunk_text text not null,
  token_count integer,
  embedding_status text not null default 'pending' check (
    embedding_status in ('pending', 'processed', 'failed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table public.advisor_profiles (
  id uuid primary key default gen_random_uuid(),
  advisor_code text not null unique,
  name text not null,
  description text,
  advisor_type text not null default 'general' check (
    advisor_type in ('general', 'agronomy', 'commerce', 'training', 'logistics', 'finance')
  ),
  model_provider text,
  model_name text,
  system_prompt text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  advisor_profile_id uuid references public.advisor_profiles(id) on delete set null,
  title text,
  status text not null default 'active' check (
    status in ('active', 'archived', 'closed')
  ),
  last_message_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.advisor_conversations(id) on delete cascade,
  sender_type text not null check (
    sender_type in ('user', 'assistant', 'system')
  ),
  message_text text not null,
  message_format text not null default 'text' check (
    message_format in ('text', 'markdown', 'json')
  ),
  model_provider text,
  model_name text,
  token_input integer,
  token_output integer,
  message_order integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.advisor_message_sources (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.advisor_messages(id) on delete cascade,
  document_id uuid references public.knowledge_documents(id) on delete set null,
  chunk_id uuid references public.knowledge_document_chunks(id) on delete set null,
  source_label text,
  excerpt text,
  citation_url text,
  created_at timestamptz not null default now()
);

create table public.advisor_query_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  conversation_id uuid references public.advisor_conversations(id) on delete set null,
  message_id uuid references public.advisor_messages(id) on delete set null,
  advisor_profile_id uuid references public.advisor_profiles(id) on delete set null,
  query_text text not null,
  response_status text not null default 'success' check (
    response_status in ('success', 'error', 'blocked', 'timeout')
  ),
  response_time_ms integer,
  model_provider text,
  model_name text,
  tool_usage jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.advisor_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.advisor_messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer check (rating between 1 and 5),
  feedback_type text check (
    feedback_type in ('helpful', 'not_helpful', 'incorrect', 'unsafe', 'other')
  ),
  comments text,
  created_at timestamptz not null default now(),
  unique (message_id, user_id)
);

create index idx_knowledge_sources_created_by on public.knowledge_sources(created_by);
create index idx_knowledge_documents_source_id on public.knowledge_documents(source_id);
create index idx_knowledge_documents_access_level on public.knowledge_documents(access_level);
create index idx_knowledge_document_chunks_document_id on public.knowledge_document_chunks(document_id);
create index idx_advisor_profiles_advisor_code on public.advisor_profiles(advisor_code);
create index idx_advisor_conversations_user_id on public.advisor_conversations(user_id);
create index idx_advisor_conversations_advisor_profile_id on public.advisor_conversations(advisor_profile_id);
create index idx_advisor_messages_conversation_id on public.advisor_messages(conversation_id);
create index idx_advisor_message_sources_message_id on public.advisor_message_sources(message_id);
create index idx_advisor_query_logs_user_id on public.advisor_query_logs(user_id);
create index idx_advisor_query_logs_conversation_id on public.advisor_query_logs(conversation_id);
create index idx_advisor_feedback_message_id on public.advisor_feedback(message_id);

create trigger trg_knowledge_sources_updated_at
before update on public.knowledge_sources
for each row
execute function public.set_updated_at();

create trigger trg_knowledge_documents_updated_at
before update on public.knowledge_documents
for each row
execute function public.set_updated_at();

create trigger trg_advisor_profiles_updated_at
before update on public.advisor_profiles
for each row
execute function public.set_updated_at();

create trigger trg_advisor_conversations_updated_at
before update on public.advisor_conversations
for each row
execute function public.set_updated_at();

alter table public.knowledge_sources enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_document_chunks enable row level security;
alter table public.advisor_profiles enable row level security;
alter table public.advisor_conversations enable row level security;
alter table public.advisor_messages enable row level security;
alter table public.advisor_message_sources enable row level security;
alter table public.advisor_query_logs enable row level security;
alter table public.advisor_feedback enable row level security;

drop policy if exists "knowledge_sources_read_authenticated_or_admin" on public.knowledge_sources;
create policy "knowledge_sources_read_authenticated_or_admin"
on public.knowledge_sources
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "knowledge_sources_manage_admin_or_trainer" on public.knowledge_sources;
create policy "knowledge_sources_manage_admin_or_trainer"
on public.knowledge_sources
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

drop policy if exists "knowledge_documents_read_by_access_level" on public.knowledge_documents;
create policy "knowledge_documents_read_by_access_level"
on public.knowledge_documents
for select
to authenticated
using (
  public.is_admin()
  or (
    is_published = true
    and (
      access_level = 'public'
      or access_level = 'authenticated'
      or (
        access_level = 'premium'
        and exists (
          select 1
          from public.subscriptions s
          where s.user_id = auth.uid()
            and s.status in ('trialing', 'active')
        )
      )
    )
  )
);

drop policy if exists "knowledge_documents_manage_admin_or_trainer" on public.knowledge_documents;
create policy "knowledge_documents_manage_admin_or_trainer"
on public.knowledge_documents
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

drop policy if exists "knowledge_document_chunks_read_via_document_access" on public.knowledge_document_chunks;
create policy "knowledge_document_chunks_read_via_document_access"
on public.knowledge_document_chunks
for select
to authenticated
using (
  exists (
    select 1
    from public.knowledge_documents d
    where d.id = knowledge_document_chunks.document_id
      and (
        public.is_admin()
        or (
          d.is_published = true
          and (
            d.access_level = 'public'
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
        )
      )
  )
);

drop policy if exists "knowledge_document_chunks_manage_admin_or_trainer" on public.knowledge_document_chunks;
create policy "knowledge_document_chunks_manage_admin_or_trainer"
on public.knowledge_document_chunks
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

drop policy if exists "advisor_profiles_read_authenticated" on public.advisor_profiles;
create policy "advisor_profiles_read_authenticated"
on public.advisor_profiles
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "advisor_profiles_manage_admin" on public.advisor_profiles;
create policy "advisor_profiles_manage_admin"
on public.advisor_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_conversations_select_own_or_admin" on public.advisor_conversations;
create policy "advisor_conversations_select_own_or_admin"
on public.advisor_conversations
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_conversations_insert_own_or_admin" on public.advisor_conversations;
create policy "advisor_conversations_insert_own_or_admin"
on public.advisor_conversations
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_conversations_update_own_or_admin" on public.advisor_conversations;
create policy "advisor_conversations_update_own_or_admin"
on public.advisor_conversations
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_messages_select_own_conversation_or_admin" on public.advisor_messages;
create policy "advisor_messages_select_own_conversation_or_admin"
on public.advisor_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.advisor_conversations c
    where c.id = advisor_messages.conversation_id
      and (c.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "advisor_messages_insert_own_conversation_or_admin" on public.advisor_messages;
create policy "advisor_messages_insert_own_conversation_or_admin"
on public.advisor_messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.advisor_conversations c
    where c.id = advisor_messages.conversation_id
      and (c.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "advisor_message_sources_select_own_message_or_admin" on public.advisor_message_sources;
create policy "advisor_message_sources_select_own_message_or_admin"
on public.advisor_message_sources
for select
to authenticated
using (
  exists (
    select 1
    from public.advisor_messages m
    join public.advisor_conversations c on c.id = m.conversation_id
    where m.id = advisor_message_sources.message_id
      and (c.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "advisor_message_sources_manage_admin_only" on public.advisor_message_sources;
create policy "advisor_message_sources_manage_admin_only"
on public.advisor_message_sources
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_query_logs_select_own_or_admin" on public.advisor_query_logs;
create policy "advisor_query_logs_select_own_or_admin"
on public.advisor_query_logs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_query_logs_manage_admin_only" on public.advisor_query_logs;
create policy "advisor_query_logs_manage_admin_only"
on public.advisor_query_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_feedback_select_own_or_admin" on public.advisor_feedback;
create policy "advisor_feedback_select_own_or_admin"
on public.advisor_feedback
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_feedback_insert_own" on public.advisor_feedback;
create policy "advisor_feedback_insert_own"
on public.advisor_feedback
for insert
to authenticated
with check (
  user_id = auth.uid()
);

drop policy if exists "advisor_feedback_update_own_or_admin" on public.advisor_feedback;
create policy "advisor_feedback_update_own_or_admin"
on public.advisor_feedback
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

insert into public.advisor_profiles (
  advisor_code,
  name,
  description,
  advisor_type,
  model_provider,
  model_name,
  system_prompt,
  is_active
)
values
  (
    'seedlink-general',
    'Seedlink General Advisor',
    'General Seedlink platform assistant for commerce, training and support',
    'general',
    'openai',
    'gpt-4.1',
    'You are Seedlink Advisor. Help users with Seedlink platform navigation, products, training, farming support and logistics guidance. Use available knowledge base sources and stay professional.',
    true
  ),
  (
    'seedlink-agronomy',
    'Seedlink Agronomy Advisor',
    'Specialized agronomy assistant for crop production, soil, fertiliser and spray guidance',
    'agronomy',
    'openai',
    'gpt-4.1',
    'You are Seedlink Agronomy Advisor. Provide practical agronomic support grounded in Seedlink knowledge sources, crop production logic and best practices. Be careful, professional and context-aware.',
    true
  )
on conflict (advisor_code) do nothing;

insert into public.knowledge_sources (
  name,
  source_type,
  description,
  source_url,
  language_code,
  country_code,
  is_active
)
values
  (
    'Seedlink Internal Knowledge Base',
    'internal_note',
    'Primary internal advisory and training knowledge base',
    null,
    'en',
    'ZA',
    true
  ),
  (
    'Seedlink Agronomy Guides',
    'manual',
    'Internal agronomy reference guides and crop production manuals',
    null,
    'en',
    'ZA',
    true
  )
on conflict do nothing;
