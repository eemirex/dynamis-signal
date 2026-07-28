-- Dynamis Signal: multi-tenant CRM foundation
-- Apply with `supabase db push` after linking a Supabase project.

create extension if not exists pgcrypto with schema extensions;

create type public.member_role as enum ('owner', 'admin', 'manager', 'member');
create type public.contact_status as enum ('lead', 'opportunity', 'customer', 'inactive');
create type public.deal_health as enum ('high', 'medium', 'low');
create type public.activity_kind as enum ('note', 'call', 'email', 'meeting', 'task', 'stage_change');
create type public.email_direction as enum ('inbound', 'outbound');
create type public.delivery_status as enum ('pending', 'succeeded', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  job_title text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  logo_url text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'member',
  invited_by uuid references auth.users(id),
  joined_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  domain text,
  industry text,
  employee_count integer check (employee_count is null or employee_count >= 0),
  annual_revenue numeric(16,2) check (annual_revenue is null or annual_revenue >= 0),
  owner_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (organization_id, domain)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  title text,
  status public.contact_status not null default 'lead',
  source text,
  last_contacted_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index contacts_org_email_unique
  on public.contacts (organization_id, lower(email))
  where email is not null and deleted_at is null;

create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create unique index one_default_pipeline_per_org
  on public.pipelines (organization_id)
  where is_default;

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  position smallint not null check (position >= 0),
  probability smallint not null default 0 check (probability between 0 and 100),
  color text not null default '#8e969d',
  is_won boolean not null default false,
  is_lost boolean not null default false,
  unique (pipeline_id, position)
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id),
  stage_id uuid not null references public.pipeline_stages(id),
  company_id uuid references public.companies(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null,
  title text not null,
  value numeric(16,2) not null default 0 check (value >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  health public.deal_health not null default 'medium',
  expected_close_date date,
  position numeric not null default 0,
  won_at timestamptz,
  lost_at timestamptz,
  loss_reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.deal_contacts (
  deal_id uuid not null references public.deals(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  is_primary boolean not null default false,
  primary key (deal_id, contact_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete cascade,
  kind public.activity_kind not null,
  subject text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.email_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  provider_message_id text,
  direction public.email_direction not null,
  from_address text not null,
  to_addresses text[] not null default '{}',
  cc_addresses text[] not null default '{}',
  subject text not null default '',
  body_preview text,
  sent_at timestamptz,
  received_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (organization_id, provider_message_id)
);

create table public.email_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email_message_id uuid not null references public.email_messages(id) on delete cascade,
  event_type text not null check (event_type in ('delivered', 'opened', 'clicked', 'replied', 'bounced')),
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  provider text,
  provider_event_id text,
  recording_url text,
  transcript_storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meeting_attendees (
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  email text not null,
  display_name text,
  attended boolean,
  primary key (meeting_id, email)
);

create table public.meeting_summaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  meeting_id uuid not null unique references public.meetings(id) on delete cascade,
  executive_summary text not null,
  decisions jsonb not null default '[]'::jsonb,
  action_items jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  model text,
  generated_by uuid references auth.users(id) on delete set null,
  generated_at timestamptz not null default now()
);

create table public.ai_generations (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  feature text not null,
  model text not null,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  succeeded boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  url text not null check (url ~ '^https://'),
  description text,
  event_types text[] not null default '{}',
  signing_secret_hash text not null,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  endpoint_id uuid not null references public.webhook_endpoints(id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  status public.delivery_status not null default 'pending',
  response_status smallint,
  response_body text,
  attempt_count smallint not null default 0,
  next_attempt_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  changes jsonb not null default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index org_members_user_idx on public.organization_members (user_id, organization_id);
create index contacts_org_updated_idx on public.contacts (organization_id, updated_at desc) where deleted_at is null;
create index contacts_search_idx on public.contacts using gin (
  to_tsvector('simple', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(email, ''))
);
create index companies_org_name_idx on public.companies (organization_id, name) where deleted_at is null;
create index deals_org_stage_position_idx on public.deals (organization_id, stage_id, position) where deleted_at is null;
create index deals_org_close_idx on public.deals (organization_id, expected_close_date) where deleted_at is null;
create index activities_org_occurred_idx on public.activities (organization_id, occurred_at desc);
create index email_messages_org_sent_idx on public.email_messages (organization_id, sent_at desc);
create index email_events_message_idx on public.email_events (email_message_id, occurred_at desc);
create index meetings_org_starts_idx on public.meetings (organization_id, starts_at desc);
create index webhook_deliveries_pending_idx on public.webhook_deliveries (next_attempt_at)
  where status in ('pending', 'failed');
create index audit_log_org_created_idx on public.audit_log (organization_id, created_at desc);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.is_org_member(org_id uuid)
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = org_id and user_id = (select auth.uid())
  );
$$;

create or replace function private.has_org_role(org_id uuid, allowed public.member_role[])
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = org_id
      and user_id = (select auth.uid())
      and role = any(allowed)
  );
$$;

create or replace function private.touch_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

create trigger profiles_touch before update on public.profiles
  for each row execute procedure private.touch_updated_at();
create trigger organizations_touch before update on public.organizations
  for each row execute procedure private.touch_updated_at();
create trigger companies_touch before update on public.companies
  for each row execute procedure private.touch_updated_at();
create trigger contacts_touch before update on public.contacts
  for each row execute procedure private.touch_updated_at();
create trigger deals_touch before update on public.deals
  for each row execute procedure private.touch_updated_at();
create trigger meetings_touch before update on public.meetings
  for each row execute procedure private.touch_updated_at();
create trigger webhook_endpoints_touch before update on public.webhook_endpoints
  for each row execute procedure private.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.deals enable row level security;
alter table public.deal_contacts enable row level security;
alter table public.activities enable row level security;
alter table public.email_messages enable row level security;
alter table public.email_events enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_attendees enable row level security;
alter table public.meeting_summaries enable row level security;
alter table public.ai_generations enable row level security;
alter table public.webhook_endpoints enable row level security;
alter table public.webhook_deliveries enable row level security;
alter table public.audit_log enable row level security;

create policy "profiles are visible to signed-in users" on public.profiles
  for select to authenticated using (true);
create policy "users update their profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "members view organizations" on public.organizations
  for select to authenticated using (private.is_org_member(id));
create policy "users create organizations" on public.organizations
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "admins update organizations" on public.organizations
  for update to authenticated using (private.has_org_role(id, array['owner','admin']::public.member_role[]));

create policy "members view memberships" on public.organization_members
  for select to authenticated using (private.is_org_member(organization_id));
create policy "creator claims ownership" on public.organization_members
  for insert to authenticated with check (
    user_id = (select auth.uid()) and role = 'owner' and exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.created_by = (select auth.uid())
    )
  );
create policy "admins manage memberships" on public.organization_members
  for all to authenticated using (
    private.has_org_role(organization_id, array['owner','admin']::public.member_role[])
  ) with check (
    private.has_org_role(organization_id, array['owner','admin']::public.member_role[])
  );

-- Organization-scoped operational tables use the same membership boundary.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'companies', 'contacts', 'pipelines', 'pipeline_stages', 'deals',
    'deal_contacts', 'activities', 'email_messages', 'email_events',
    'meetings', 'meeting_attendees', 'meeting_summaries', 'ai_generations'
  ]
  loop
    execute format(
      'create policy "members read %1$s" on public.%1$I for select to authenticated using (private.is_org_member(organization_id))',
      table_name
    );
    execute format(
      'create policy "members create %1$s" on public.%1$I for insert to authenticated with check (private.is_org_member(organization_id))',
      table_name
    );
    execute format(
      'create policy "members update %1$s" on public.%1$I for update to authenticated using (private.is_org_member(organization_id)) with check (private.is_org_member(organization_id))',
      table_name
    );
    execute format(
      'create policy "managers delete %1$s" on public.%1$I for delete to authenticated using (private.has_org_role(organization_id, array[''owner'',''admin'',''manager'']::public.member_role[]))',
      table_name
    );
  end loop;
end $$;

create policy "members read webhook endpoints" on public.webhook_endpoints
  for select to authenticated using (private.is_org_member(organization_id));
create policy "admins manage webhook endpoints" on public.webhook_endpoints
  for all to authenticated using (
    private.has_org_role(organization_id, array['owner','admin']::public.member_role[])
  ) with check (
    private.has_org_role(organization_id, array['owner','admin']::public.member_role[])
  );
create policy "members read webhook deliveries" on public.webhook_deliveries
  for select to authenticated using (private.is_org_member(organization_id));
create policy "admins manage webhook deliveries" on public.webhook_deliveries
  for all to authenticated using (
    private.has_org_role(organization_id, array['owner','admin']::public.member_role[])
  ) with check (
    private.has_org_role(organization_id, array['owner','admin']::public.member_role[])
  );
create policy "members read audit log" on public.audit_log
  for select to authenticated using (private.is_org_member(organization_id));

revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Realtime is useful for pipeline movement, activities, and notifications.
alter publication supabase_realtime add table public.deals;
alter publication supabase_realtime add table public.activities;
alter table public.deals replica identity full;
alter table public.activities replica identity full;

-- Private meeting transcripts belong in the `meeting-transcripts` Storage bucket.
insert into storage.buckets (id, name, public)
values ('meeting-transcripts', 'meeting-transcripts', false)
on conflict (id) do nothing;

create policy "members read organization transcripts" on storage.objects
  for select to authenticated using (
    bucket_id = 'meeting-transcripts'
    and private.is_org_member(((storage.foldername(name))[1])::uuid)
  );
create policy "members upload organization transcripts" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'meeting-transcripts'
    and private.is_org_member(((storage.foldername(name))[1])::uuid)
  );
create policy "members update organization transcripts" on storage.objects
  for update to authenticated using (
    bucket_id = 'meeting-transcripts'
    and private.is_org_member(((storage.foldername(name))[1])::uuid)
  );
create policy "managers delete organization transcripts" on storage.objects
  for delete to authenticated using (
    bucket_id = 'meeting-transcripts'
    and private.has_org_role(
      ((storage.foldername(name))[1])::uuid,
      array['owner','admin','manager']::public.member_role[]
    )
  );
