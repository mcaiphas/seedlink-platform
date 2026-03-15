create extension if not exists pgcrypto;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'farmer'),
    now()
  )
  on conflict (id) do nothing;

  insert into public.notification_preferences (
    user_id,
    email_enabled,
    sms_enabled,
    whatsapp_enabled,
    in_app_enabled,
    order_updates,
    payment_updates,
    training_updates,
    agronomy_updates,
    marketing_updates,
    created_at,
    updated_at
  )
  values (
    new.id,
    true,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    now(),
    now()
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.roles r on r.id = ura.role_id
    where ura.user_id = auth.uid()
      and ura.is_active = true
      and r.name = role_name
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select
    public.has_role('super_admin')
    or public.has_role('admin');
$$;

create or replace function public.belongs_to_organization(org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.is_active = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.user_role_assignments enable row level security;

alter table public.teams enable row level security;
alter table public.farms enable row level security;
alter table public.crops enable row level security;
alter table public.fields enable row level security;
alter table public.planting_records enable row level security;
alter table public.harvest_records enable row level security;
alter table public.soil_tests enable row level security;
alter table public.weather_snapshots enable row level security;
alter table public.crop_recommendations enable row level security;
alter table public.farm_activities enable row level security;

alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_collections enable row level security;
alter table public.product_collection_items enable row level security;
alter table public.product_images enable row level security;
alter table public.product_category_assignments enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.enrollments enable row level security;
alter table public.certificates enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;

alter table public.payment_gateways enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.delivery_requests enable row level security;
alter table public.delivery_status_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
)
with check (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "profiles_insert_self_or_admin" on public.profiles;
create policy "profiles_insert_self_or_admin"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "organizations_select_member_or_admin" on public.organizations;
create policy "organizations_select_member_or_admin"
on public.organizations
for select
to authenticated
using (
  public.belongs_to_organization(id)
  or public.is_admin()
);

drop policy if exists "organizations_manage_admin" on public.organizations;
create policy "organizations_manage_admin"
on public.organizations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "organization_members_select_member_or_admin" on public.organization_members;
create policy "organization_members_select_member_or_admin"
on public.organization_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.belongs_to_organization(organization_id)
  or public.is_admin()
);

drop policy if exists "organization_members_manage_admin" on public.organization_members;
create policy "organization_members_manage_admin"
on public.organization_members
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "user_role_assignments_select_self_or_admin" on public.user_role_assignments;
create policy "user_role_assignments_select_self_or_admin"
on public.user_role_assignments
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "user_role_assignments_manage_admin" on public.user_role_assignments;
create policy "user_role_assignments_manage_admin"
on public.user_role_assignments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "teams_select_owner_or_admin" on public.teams;
create policy "teams_select_owner_or_admin"
on public.teams
for select
to authenticated
using (
  owner_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "teams_manage_owner_or_admin" on public.teams;
create policy "teams_manage_owner_or_admin"
on public.teams
for all
to authenticated
using (
  owner_id = auth.uid()
  or public.is_admin()
)
with check (
  owner_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "farms_select_team_owner_or_admin" on public.farms;
create policy "farms_select_team_owner_or_admin"
on public.farms
for select
to authenticated
using (
  exists (
    select 1
    from public.teams t
    where t.id = farms.team_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "farms_manage_team_owner_or_admin" on public.farms;
create policy "farms_manage_team_owner_or_admin"
on public.farms
for all
to authenticated
using (
  exists (
    select 1
    from public.teams t
    where t.id = farms.team_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1
    from public.teams t
    where t.id = farms.team_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "crops_select_farm_owner_or_admin" on public.crops;
create policy "crops_select_farm_owner_or_admin"
on public.crops
for select
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where f.id = crops.farm_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "crops_manage_farm_owner_or_admin" on public.crops;
create policy "crops_manage_farm_owner_or_admin"
on public.crops
for all
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where f.id = crops.farm_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where f.id = crops.farm_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "fields_select_farm_owner_or_admin" on public.fields;
create policy "fields_select_farm_owner_or_admin"
on public.fields
for select
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where f.id = fields.farm_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "fields_manage_farm_owner_or_admin" on public.fields;
create policy "fields_manage_farm_owner_or_admin"
on public.fields
for all
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where f.id = fields.farm_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where f.id = fields.farm_id
      and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "soil_tests_select_field_or_farm_owner_or_admin" on public.soil_tests;
create policy "soil_tests_select_field_or_farm_owner_or_admin"
on public.soil_tests
for select
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = soil_tests.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = soil_tests.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "soil_tests_manage_field_or_farm_owner_or_admin" on public.soil_tests;
create policy "soil_tests_manage_field_or_farm_owner_or_admin"
on public.soil_tests
for all
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = soil_tests.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = soil_tests.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = soil_tests.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = soil_tests.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products
for select
to authenticated
using (true);

drop policy if exists "products_manage_admin_or_supplier" on public.products;
create policy "products_manage_admin_or_supplier"
on public.products
for all
to authenticated
using (
  public.is_admin()
  or public.has_role('supplier')
)
with check (
  public.is_admin()
  or public.has_role('supplier')
);

drop policy if exists "product_categories_public_read" on public.product_categories;
create policy "product_categories_public_read"
on public.product_categories
for select
to authenticated
using (true);

drop policy if exists "product_categories_manage_admin" on public.product_categories;
create policy "product_categories_manage_admin"
on public.product_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "product_collections_public_read" on public.product_collections;
create policy "product_collections_public_read"
on public.product_collections
for select
to authenticated
using (true);

drop policy if exists "product_collections_manage_admin" on public.product_collections;
create policy "product_collections_manage_admin"
on public.product_collections
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read"
on public.courses
for select
to authenticated
using (true);

drop policy if exists "courses_manage_admin_or_trainer" on public.courses;
create policy "courses_manage_admin_or_trainer"
on public.courses
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

drop policy if exists "course_modules_public_read" on public.course_modules;
create policy "course_modules_public_read"
on public.course_modules
for select
to authenticated
using (true);

drop policy if exists "course_modules_manage_admin_or_trainer" on public.course_modules;
create policy "course_modules_manage_admin_or_trainer"
on public.course_modules
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

drop policy if exists "lessons_public_read" on public.lessons;
create policy "lessons_public_read"
on public.lessons
for select
to authenticated
using (true);

drop policy if exists "lessons_manage_admin_or_trainer" on public.lessons;
create policy "lessons_manage_admin_or_trainer"
on public.lessons
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

drop policy if exists "lesson_resources_public_read" on public.lesson_resources;
create policy "lesson_resources_public_read"
on public.lesson_resources
for select
to authenticated
using (true);

drop policy if exists "lesson_resources_manage_admin_or_trainer" on public.lesson_resources;
create policy "lesson_resources_manage_admin_or_trainer"
on public.lesson_resources
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

drop policy if exists "enrollments_select_own_or_admin" on public.enrollments;
create policy "enrollments_select_own_or_admin"
on public.enrollments
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "enrollments_insert_own_or_admin" on public.enrollments;
create policy "enrollments_insert_own_or_admin"
on public.enrollments
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "enrollments_update_own_or_admin" on public.enrollments;
create policy "enrollments_update_own_or_admin"
on public.enrollments
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

drop policy if exists "subscriptions_select_own_or_admin" on public.subscriptions;
create policy "subscriptions_select_own_or_admin"
on public.subscriptions
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "subscriptions_manage_admin" on public.subscriptions;
create policy "subscriptions_manage_admin"
on public.subscriptions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "subscription_plans_public_read" on public.subscription_plans;
create policy "subscription_plans_public_read"
on public.subscription_plans
for select
to authenticated
using (true);

drop policy if exists "subscription_plans_manage_admin" on public.subscription_plans;
create policy "subscription_plans_manage_admin"
on public.subscription_plans
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "carts_select_own_or_admin" on public.carts;
create policy "carts_select_own_or_admin"
on public.carts
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "carts_manage_own_or_admin" on public.carts;
create policy "carts_manage_own_or_admin"
on public.carts
for all
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "cart_items_select_own_or_admin" on public.cart_items;
create policy "cart_items_select_own_or_admin"
on public.cart_items
for select
to authenticated
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_items.cart_id
      and c.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "cart_items_manage_own_or_admin" on public.cart_items;
create policy "cart_items_manage_own_or_admin"
on public.cart_items
for all
to authenticated
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_items.cart_id
      and c.user_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1
    from public.carts c
    where c.id = cart_items.cart_id
      and c.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "orders_insert_own_or_admin" on public.orders;
create policy "orders_insert_own_or_admin"
on public.orders
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "orders_update_admin_only" on public.orders;
create policy "orders_update_admin_only"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "order_items_select_order_owner_or_admin" on public.order_items;
create policy "order_items_select_order_owner_or_admin"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "order_items_manage_admin_only" on public.order_items;
create policy "order_items_manage_admin_only"
on public.order_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "payment_gateways_admin_only" on public.payment_gateways;
create policy "payment_gateways_admin_only"
on public.payment_gateways
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "payment_transactions_select_own_or_admin" on public.payment_transactions;
create policy "payment_transactions_select_own_or_admin"
on public.payment_transactions
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "payment_transactions_manage_admin_only" on public.payment_transactions;
create policy "payment_transactions_manage_admin_only"
on public.payment_transactions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "wallets_select_owner_or_admin" on public.wallets;
create policy "wallets_select_owner_or_admin"
on public.wallets
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "wallets_manage_admin_only" on public.wallets;
create policy "wallets_manage_admin_only"
on public.wallets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "wallet_transactions_select_wallet_owner_or_admin" on public.wallet_transactions;
create policy "wallet_transactions_select_wallet_owner_or_admin"
on public.wallet_transactions
for select
to authenticated
using (
  exists (
    select 1
    from public.wallets w
    where w.id = wallet_transactions.wallet_id
      and w.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "wallet_transactions_manage_admin_only" on public.wallet_transactions;
create policy "wallet_transactions_manage_admin_only"
on public.wallet_transactions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "delivery_requests_select_owner_or_admin" on public.delivery_requests;
create policy "delivery_requests_select_owner_or_admin"
on public.delivery_requests
for select
to authenticated
using (
  requested_by = auth.uid()
  or public.is_admin()
);

drop policy if exists "delivery_requests_insert_owner_or_admin" on public.delivery_requests;
create policy "delivery_requests_insert_owner_or_admin"
on public.delivery_requests
for insert
to authenticated
with check (
  requested_by = auth.uid()
  or public.is_admin()
);

drop policy if exists "delivery_requests_update_admin_or_logistics" on public.delivery_requests;
create policy "delivery_requests_update_admin_or_logistics"
on public.delivery_requests
for update
to authenticated
using (
  public.is_admin()
  or public.has_role('logistics_partner')
)
with check (
  public.is_admin()
  or public.has_role('logistics_partner')
);

drop policy if exists "delivery_status_logs_select_owner_admin_logistics" on public.delivery_status_logs;
create policy "delivery_status_logs_select_owner_admin_logistics"
on public.delivery_status_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.delivery_requests dr
    where dr.id = delivery_status_logs.delivery_request_id
      and (
        dr.requested_by = auth.uid()
        or public.is_admin()
        or public.has_role('logistics_partner')
      )
  )
);

drop policy if exists "delivery_status_logs_manage_admin_or_logistics" on public.delivery_status_logs;
create policy "delivery_status_logs_manage_admin_or_logistics"
on public.delivery_status_logs
for all
to authenticated
using (
  public.is_admin()
  or public.has_role('logistics_partner')
)
with check (
  public.is_admin()
  or public.has_role('logistics_partner')
);

drop policy if exists "notifications_select_own_or_admin" on public.notifications;
create policy "notifications_select_own_or_admin"
on public.notifications
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "notifications_manage_admin_only" on public.notifications;
create policy "notifications_manage_admin_only"
on public.notifications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "notification_preferences_select_own_or_admin" on public.notification_preferences;
create policy "notification_preferences_select_own_or_admin"
on public.notification_preferences
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "notification_preferences_manage_own_or_admin" on public.notification_preferences;
create policy "notification_preferences_manage_own_or_admin"
on public.notification_preferences
for all
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "audit_logs_admin_only" on public.audit_logs;
create policy "audit_logs_admin_only"
on public.audit_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "crop_recommendations_select_owner_or_admin" on public.crop_recommendations;
create policy "crop_recommendations_select_owner_or_admin"
on public.crop_recommendations
for select
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = crop_recommendations.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = crop_recommendations.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "crop_recommendations_manage_admin_or_trainer" on public.crop_recommendations;
create policy "crop_recommendations_manage_admin_or_trainer"
on public.crop_recommendations
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

drop policy if exists "farm_activities_select_owner_or_admin" on public.farm_activities;
create policy "farm_activities_select_owner_or_admin"
on public.farm_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = farm_activities.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = farm_activities.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists "farm_activities_manage_owner_or_admin" on public.farm_activities;
create policy "farm_activities_manage_owner_or_admin"
on public.farm_activities
for all
to authenticated
using (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = farm_activities.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = farm_activities.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1
    from public.farms f
    join public.teams t on t.id = f.team_id
    where (
      f.id = farm_activities.farm_id
      or exists (
        select 1
        from public.fields fld
        where fld.id = farm_activities.field_id
          and fld.farm_id = f.id
      )
    )
    and t.owner_id = auth.uid()
  )
  or public.is_admin()
);
