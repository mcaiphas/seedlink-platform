create extension if not exists pgcrypto;

create table public.ai_providers (
  id uuid primary key default gen_random_uuid(),
  provider_code text not null unique,
  name text not null,
  description text,
  base_url text,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_models (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.ai_providers(id) on delete cascade,
  model_code text not null unique,
  display_name text not null,
  model_type text not null check (
    model_type in ('chat', 'embedding', 'vision', 'audio', 'other')
  ),
  context_window integer,
  max_output_tokens integer,
  pricing_input_per_million numeric,
  pricing_output_per_million numeric,
  currency_code text not null default 'USD',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  prompt_code text not null unique,
  name text not null,
  description text,
  prompt_type text not null check (
    prompt_type in ('system', 'retrieval', 'guardrail', 'classification', 'tool', 'fallback')
  ),
  content text not null,
  version integer not null default 1,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_profile_model_configs (
  id uuid primary key default gen_random_uuid(),
  advisor_profile_id uuid not null references public.advisor_profiles(id) on delete cascade,
  provider_id uuid references public.ai_providers(id) on delete set null,
  primary_model_id uuid references public.ai_models(id) on delete set null,
  embedding_model_id uuid references public.ai_models(id) on delete set null,
  system_prompt_template_id uuid references public.advisor_prompt_templates(id) on delete set null,
  fallback_prompt_template_id uuid references public.advisor_prompt_templates(id) on delete set null,
  temperature numeric,
  top_p numeric,
  max_output_tokens integer,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (advisor_profile_id)
);

create table public.advisor_guardrails (
  id uuid primary key default gen_random_uuid(),
  guardrail_code text not null unique,
  name text not null,
  description text,
  guardrail_type text not null check (
    guardrail_type in (
      'blocked_topic',
      'blocked_term',
      'domain_allowlist',
      'domain_blocklist',
      'source_requirement',
      'response_style',
      'escalation_rule',
      'other'
    )
  ),
  rule_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_profile_guardrails (
  id uuid primary key default gen_random_uuid(),
  advisor_profile_id uuid not null references public.advisor_profiles(id) on delete cascade,
  guardrail_id uuid not null references public.advisor_guardrails(id) on delete cascade,
  is_required boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (advisor_profile_id, guardrail_id)
);

create table public.advisor_source_rules (
  id uuid primary key default gen_random_uuid(),
  advisor_profile_id uuid references public.advisor_profiles(id) on delete cascade,
  rule_type text not null check (
    rule_type in ('domain_allowlist', 'domain_blocklist', 'source_type_allowlist', 'source_type_blocklist')
  ),
  rule_value text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (advisor_profile_id, rule_type, rule_value)
);

create table public.advisor_execution_runs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.advisor_conversations(id) on delete set null,
  message_id uuid references public.advisor_messages(id) on delete set null,
  advisor_profile_id uuid references public.advisor_profiles(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  provider_id uuid references public.ai_providers(id) on delete set null,
  model_id uuid references public.ai_models(id) on delete set null,
  run_status text not null default 'pending' check (
    run_status in ('pending', 'running', 'completed', 'failed', 'blocked', 'escalated')
  ),
  input_text text,
  output_text text,
  finish_reason text,
  started_at timestamptz,
  completed_at timestamptz,
  response_time_ms integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_usage_records (
  id uuid primary key default gen_random_uuid(),
  execution_run_id uuid not null references public.advisor_execution_runs(id) on delete cascade,
  provider_id uuid references public.ai_providers(id) on delete set null,
  model_id uuid references public.ai_models(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  token_input integer not null default 0,
  token_output integer not null default 0,
  total_tokens integer generated always as (coalesce(token_input, 0) + coalesce(token_output, 0)) stored,
  estimated_cost numeric,
  currency_code text not null default 'USD',
  created_at timestamptz not null default now()
);

create table public.advisor_escalation_rules (
  id uuid primary key default gen_random_uuid(),
  advisor_profile_id uuid references public.advisor_profiles(id) on delete cascade,
  rule_code text not null unique,
  name text not null,
  description text,
  trigger_type text not null check (
    trigger_type in ('low_confidence', 'unsafe_topic', 'manual_request', 'high_value_customer', 'no_source_found', 'other')
  ),
  rule_config jsonb not null default '{}'::jsonb,
  escalation_target text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.advisor_run_events (
  id uuid primary key default gen_random_uuid(),
  execution_run_id uuid not null references public.advisor_execution_runs(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'run_started',
      'retrieval_started',
      'retrieval_completed',
      'tool_called',
      'tool_completed',
      'guardrail_triggered',
      'response_generated',
      'run_completed',
      'run_failed',
      'run_escalated'
    )
  ),
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_ai_models_provider_id on public.ai_models(provider_id);
create index idx_advisor_profile_model_configs_advisor_profile_id on public.advisor_profile_model_configs(advisor_profile_id);
create index idx_advisor_profile_guardrails_advisor_profile_id on public.advisor_profile_guardrails(advisor_profile_id);
create index idx_advisor_profile_guardrails_guardrail_id on public.advisor_profile_guardrails(guardrail_id);
create index idx_advisor_source_rules_advisor_profile_id on public.advisor_source_rules(advisor_profile_id);
create index idx_advisor_execution_runs_conversation_id on public.advisor_execution_runs(conversation_id);
create index idx_advisor_execution_runs_message_id on public.advisor_execution_runs(message_id);
create index idx_advisor_execution_runs_user_id on public.advisor_execution_runs(user_id);
create index idx_advisor_execution_runs_advisor_profile_id on public.advisor_execution_runs(advisor_profile_id);
create index idx_advisor_execution_runs_run_status on public.advisor_execution_runs(run_status);
create index idx_advisor_usage_records_execution_run_id on public.advisor_usage_records(execution_run_id);
create index idx_advisor_usage_records_user_id on public.advisor_usage_records(user_id);
create index idx_advisor_escalation_rules_advisor_profile_id on public.advisor_escalation_rules(advisor_profile_id);
create index idx_advisor_run_events_execution_run_id on public.advisor_run_events(execution_run_id);

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_ai_providers_updated_at
before') then create trigger trg_ai_providers_updated_at
before update on public.ai_providers
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_ai_models_updated_at
before') then create trigger trg_ai_models_updated_at
before update on public.ai_models
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_advisor_prompt_templates_updated_at
before') then create trigger trg_advisor_prompt_templates_updated_at
before update on public.advisor_prompt_templates
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_advisor_profile_model_configs_updated_at
before') then create trigger trg_advisor_profile_model_configs_updated_at
before update on public.advisor_profile_model_configs
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_advisor_guardrails_updated_at
before') then create trigger trg_advisor_guardrails_updated_at
before update on public.advisor_guardrails
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_advisor_execution_runs_updated_at
before') then create trigger trg_advisor_execution_runs_updated_at
before update on public.advisor_execution_runs
for each row
 execute function public.set_updated_at(); end if; end
$$;

do $$
begin if not exists (select 1 from pg_trigger where tgname = 'trg_advisor_escalation_rules_updated_at
before') then create trigger trg_advisor_escalation_rules_updated_at
before update on public.advisor_escalation_rules
for each row
 execute function public.set_updated_at(); end if; end
$$;

alter table public.ai_providers enable row level security;
alter table public.ai_models enable row level security;
alter table public.advisor_prompt_templates enable row level security;
alter table public.advisor_profile_model_configs enable row level security;
alter table public.advisor_guardrails enable row level security;
alter table public.advisor_profile_guardrails enable row level security;
alter table public.advisor_source_rules enable row level security;
alter table public.advisor_execution_runs enable row level security;
alter table public.advisor_usage_records enable row level security;
alter table public.advisor_escalation_rules enable row level security;
alter table public.advisor_run_events enable row level security;

drop policy if exists "ai_providers_admin_only" on public.ai_providers;
create policy "ai_providers_admin_only"
on public.ai_providers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "ai_models_admin_only" on public.ai_models;
create policy "ai_models_admin_only"
on public.ai_models
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_prompt_templates_admin_or_trainer_read" on public.advisor_prompt_templates;
create policy "advisor_prompt_templates_admin_or_trainer_read"
on public.advisor_prompt_templates
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "advisor_prompt_templates_admin_only_manage" on public.advisor_prompt_templates;
create policy "advisor_prompt_templates_admin_only_manage"
on public.advisor_prompt_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_profile_model_configs_admin_read" on public.advisor_profile_model_configs;
create policy "advisor_profile_model_configs_admin_read"
on public.advisor_profile_model_configs
for select
to authenticated
using (public.is_admin());

drop policy if exists "advisor_profile_model_configs_admin_manage" on public.advisor_profile_model_configs;
create policy "advisor_profile_model_configs_admin_manage"
on public.advisor_profile_model_configs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_guardrails_admin_or_trainer_read" on public.advisor_guardrails;
create policy "advisor_guardrails_admin_or_trainer_read"
on public.advisor_guardrails
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "advisor_guardrails_admin_manage" on public.advisor_guardrails;
create policy "advisor_guardrails_admin_manage"
on public.advisor_guardrails
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_profile_guardrails_admin_or_trainer_read" on public.advisor_profile_guardrails;
create policy "advisor_profile_guardrails_admin_or_trainer_read"
on public.advisor_profile_guardrails
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "advisor_profile_guardrails_admin_manage" on public.advisor_profile_guardrails;
create policy "advisor_profile_guardrails_admin_manage"
on public.advisor_profile_guardrails
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_source_rules_admin_or_trainer_read" on public.advisor_source_rules;
create policy "advisor_source_rules_admin_or_trainer_read"
on public.advisor_source_rules
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "advisor_source_rules_admin_manage" on public.advisor_source_rules;
create policy "advisor_source_rules_admin_manage"
on public.advisor_source_rules
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_execution_runs_select_own_or_admin" on public.advisor_execution_runs;
create policy "advisor_execution_runs_select_own_or_admin"
on public.advisor_execution_runs
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_execution_runs_insert_own_or_admin" on public.advisor_execution_runs;
create policy "advisor_execution_runs_insert_own_or_admin"
on public.advisor_execution_runs
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_execution_runs_update_admin_only" on public.advisor_execution_runs;
create policy "advisor_execution_runs_update_admin_only"
on public.advisor_execution_runs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_usage_records_select_own_or_admin" on public.advisor_usage_records;
create policy "advisor_usage_records_select_own_or_admin"
on public.advisor_usage_records
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "advisor_usage_records_manage_admin_only" on public.advisor_usage_records;
create policy "advisor_usage_records_manage_admin_only"
on public.advisor_usage_records
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_escalation_rules_admin_or_trainer_read" on public.advisor_escalation_rules;
create policy "advisor_escalation_rules_admin_or_trainer_read"
on public.advisor_escalation_rules
for select
to authenticated
using (
  public.is_admin()
  or public.has_role('trainer')
);

drop policy if exists "advisor_escalation_rules_admin_manage" on public.advisor_escalation_rules;
create policy "advisor_escalation_rules_admin_manage"
on public.advisor_escalation_rules
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "advisor_run_events_select_own_or_admin" on public.advisor_run_events;
create policy "advisor_run_events_select_own_or_admin"
on public.advisor_run_events
for select
to authenticated
using (
  exists (
    select 1
    from public.advisor_execution_runs r
    where r.id = advisor_run_events.execution_run_id
      and (r.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "advisor_run_events_manage_admin_only" on public.advisor_run_events;
create policy "advisor_run_events_manage_admin_only"
on public.advisor_run_events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.ai_providers (
  provider_code,
  name,
  description,
  base_url,
  is_active,
  config
)
values
  (
    'openai',
    'OpenAI',
    'OpenAI model provider for chat and embeddings',
    'https://api.openai.com/v1',
    true,
    '{}'::jsonb
  ),
  (
    'anthropic',
    'Anthropic',
    'Anthropic provider for assistant responses',
    'https://api.anthropic.com',
    true,
    '{}'::jsonb
  )
on conflict (provider_code) do nothing;

insert into public.ai_models (
  provider_id,
  model_code,
  display_name,
  model_type,
  context_window,
  max_output_tokens,
  pricing_input_per_million,
  pricing_output_per_million,
  currency_code,
  is_active
)
select
  p.id,
  'gpt-4.1',
  'GPT-4.1',
  'chat',
  1000000,
  32768,
  2.00,
  8.00,
  'USD',
  true
from public.ai_providers p
where p.provider_code = 'openai'
on conflict (model_code) do nothing;

insert into public.ai_models (
  provider_id,
  model_code,
  display_name,
  model_type,
  context_window,
  max_output_tokens,
  pricing_input_per_million,
  pricing_output_per_million,
  currency_code,
  is_active
)
select
  p.id,
  'text-embedding-3-small',
  'text-embedding-3-small',
  'embedding',
  null,
  null,
  0.02,
  0,
  'USD',
  true
from public.ai_providers p
where p.provider_code = 'openai'
on conflict (model_code) do nothing;

insert into public.advisor_prompt_templates (
  prompt_code,
  name,
  description,
  prompt_type,
  content,
  version,
  is_active
)
values
  (
    'seedlink_general_system_v1',
    'Seedlink General System Prompt',
    'Default system prompt for the general advisor',
    'system',
    'You are Seedlink Advisor. Be professional, practical, and helpful. Use Seedlink knowledge sources when available, cite sources where possible, and avoid making unsupported claims.',
    1,
    true
  ),
  (
    'seedlink_agronomy_system_v1',
    'Seedlink Agronomy System Prompt',
    'Default system prompt for the agronomy advisor',
    'system',
    'You are Seedlink Agronomy Advisor. Provide practical agronomy support grounded in knowledge base sources, farm context, soil data, crop data, and current trusted information where required.',
    1,
    true
  ),
  (
    'seedlink_fallback_v1',
    'Seedlink Fallback Prompt',
    'Fallback response template when confidence is low or a safer response is needed',
    'fallback',
    'If you are not confident, say so clearly, explain what is missing, and recommend a safe next step.',
    1,
    true
  )
on conflict (prompt_code) do nothing;

insert into public.advisor_guardrails (
  guardrail_code,
  name,
  description,
  guardrail_type,
  rule_config,
  is_active
)
values
  (
    'require_sources_for_agronomy',
    'Require sources for agronomy',
    'Agronomy answers should prefer cited internal or trusted external sources when available',
    'source_requirement',
    '{"min_sources": 1}'::jsonb,
    true
  ),
  (
    'block_unsafe_recommendations',
    'Block unsafe recommendations',
    'Prevent unsafe or unsupported agronomy and chemical guidance',
    'blocked_topic',
    '{"topics": ["unsafe chemical mixing", "illegal use instructions", "hazardous misuse"]}'::jsonb,
    true
  ),
  (
    'trusted_domains_only',
    'Trusted domains only',
    'Restrict web results to trusted domains when web search is used',
    'domain_allowlist',
    '{"domains": ["seedlink.co.za", "arc.agric.za", "grain.org.za"]}'::jsonb,
    true
  )
on conflict (guardrail_code) do nothing;

insert into public.advisor_profile_model_configs (
  advisor_profile_id,
  provider_id,
  primary_model_id,
  embedding_model_id,
  system_prompt_template_id,
  fallback_prompt_template_id,
  temperature,
  top_p,
  max_output_tokens,
  is_active
)
select
  ap.id,
  p.id,
  pm.id,
  em.id,
  spt.id,
  fpt.id,
  0.2,
  1.0,
  3000,
  true
from public.advisor_profiles ap
join public.ai_providers p on p.provider_code = 'openai'
join public.ai_models pm on pm.model_code = 'gpt-4.1'
join public.ai_models em on em.model_code = 'text-embedding-3-small'
join public.advisor_prompt_templates spt
  on (
    (ap.advisor_code = 'seedlink-general' and spt.prompt_code = 'seedlink_general_system_v1')
    or
    (ap.advisor_code = 'seedlink-agronomy' and spt.prompt_code = 'seedlink_agronomy_system_v1')
  )
join public.advisor_prompt_templates fpt on fpt.prompt_code = 'seedlink_fallback_v1'
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id) do nothing;

insert into public.advisor_profile_guardrails (
  advisor_profile_id,
  guardrail_id,
  is_required,
  sort_order
)
select ap.id, g.id, true, 1
from public.advisor_profiles ap
join public.advisor_guardrails g on g.guardrail_code = 'block_unsafe_recommendations'
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, guardrail_id) do nothing;

insert into public.advisor_profile_guardrails (
  advisor_profile_id,
  guardrail_id,
  is_required,
  sort_order
)
select ap.id, g.id, true, 2
from public.advisor_profiles ap
join public.advisor_guardrails g on g.guardrail_code = 'trusted_domains_only'
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, guardrail_id) do nothing;

insert into public.advisor_profile_guardrails (
  advisor_profile_id,
  guardrail_id,
  is_required,
  sort_order
)
select ap.id, g.id, true, 3
from public.advisor_profiles ap
join public.advisor_guardrails g on g.guardrail_code = 'require_sources_for_agronomy'
where ap.advisor_code = 'seedlink-agronomy'
on conflict (advisor_profile_id, guardrail_id) do nothing;

insert into public.advisor_escalation_rules (
  advisor_profile_id,
  rule_code,
  name,
  description,
  trigger_type,
  rule_config,
  escalation_target,
  is_active
)
select
  ap.id,
  ap.advisor_code || '_low_confidence_escalation',
  ap.name || ' Low Confidence Escalation',
  'Escalate when the advisor has insufficient confidence or no reliable source base.',
  'low_confidence',
  '{"threshold": 0.4}'::jsonb,
  'human_agronomist',
  true
from public.advisor_profiles ap
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (rule_code) do nothing;

insert into public.advisor_source_rules (
  advisor_profile_id,
  rule_type,
  rule_value,
  is_active
)
select ap.id, 'domain_allowlist', 'seedlink.co.za', true
from public.advisor_profiles ap
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, rule_type, rule_value) do nothing;

insert into public.advisor_source_rules (
  advisor_profile_id,
  rule_type,
  rule_value,
  is_active
)
select ap.id, 'domain_allowlist', 'arc.agric.za', true
from public.advisor_profiles ap
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, rule_type, rule_value) do nothing;

insert into public.advisor_source_rules (
  advisor_profile_id,
  rule_type,
  rule_value,
  is_active
)
select ap.id, 'domain_allowlist', 'grain.org.za', true
from public.advisor_profiles ap
where ap.advisor_code in ('seedlink-general', 'seedlink-agronomy')
on conflict (advisor_profile_id, rule_type, rule_value) do nothing;
