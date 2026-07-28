-- Local development seed. Create a user in Supabase Studio first, then replace
-- 00000000-0000-0000-0000-000000000001 with that user's auth.users id.
do $$
declare
  demo_user uuid := '00000000-0000-0000-0000-000000000001';
  org_id uuid := gen_random_uuid();
  pipeline_id uuid := gen_random_uuid();
begin
  if not exists (select 1 from auth.users where id = demo_user) then
    raise notice 'Seed skipped: create the demo auth user and update demo_user first.';
    return;
  end if;

  insert into public.organizations (id, name, slug, created_by)
  values (org_id, 'Northstar Labs', 'northstar-labs', demo_user);
  insert into public.organization_members (organization_id, user_id, role)
  values (org_id, demo_user, 'owner');
  insert into public.pipelines (id, organization_id, name, is_default)
  values (pipeline_id, org_id, 'New Business', true);
  insert into public.pipeline_stages (pipeline_id, organization_id, name, position, probability, color)
  values
    (pipeline_id, org_id, 'New lead', 0, 10, '#8e969d'),
    (pipeline_id, org_id, 'Qualified', 1, 30, '#4388d2'),
    (pipeline_id, org_id, 'Proposal', 2, 55, '#7157db'),
    (pipeline_id, org_id, 'Negotiation', 3, 75, '#e27b4b');
  insert into public.pipeline_stages (pipeline_id, organization_id, name, position, probability, color, is_won)
  values (pipeline_id, org_id, 'Won', 4, 100, '#50a32c', true);
end $$;
