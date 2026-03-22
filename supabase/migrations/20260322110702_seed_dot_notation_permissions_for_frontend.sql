-- Seed missing dot-notation permissions used by the frontend
-- and assign them to super_admin.

with desired_permissions(code, name, description, module) as (
  values
    ('advisory.view', 'Advisory View', 'View advisory services and sessions', 'advisory'),
    ('categories.view', 'Categories View', 'View categories', 'catalog'),
    ('collections.view', 'Collections View', 'View collections', 'catalog'),
    ('executive.view', 'Executive View', 'View executive dashboards and insights', 'executive'),
    ('executive.financial', 'Executive Financial', 'View executive financial performance', 'executive'),
    ('inventory.view', 'Inventory View', 'View inventory dashboards and stock operations', 'inventory'),
    ('logistics.view', 'Logistics View', 'View logistics dashboards and delivery operations', 'logistics'),
    ('orders.view', 'Orders View', 'View customers, quotes, invoices and orders', 'orders'),
    ('payments.view', 'Payments View', 'View payments, requests and credit accounts', 'payments'),
    ('permissions.view', 'Permissions View', 'View permissions', 'system'),
    ('products.view', 'Products View', 'View products', 'catalog'),
    ('roles.view', 'Roles View', 'View roles', 'system'),
    ('support.view', 'Support View', 'View support tickets', 'support'),
    ('training.view', 'Training View', 'View training dashboards and courses', 'training'),
    ('training.learners', 'Training Learners', 'View learners and enrollments', 'training'),
    ('training.manage', 'Training Manage', 'Manage training plans and subscriptions', 'training')
),
inserted_permissions as (
  insert into public.permissions (code, name, description, module)
  select dp.code, dp.name, dp.description, dp.module
  from desired_permissions dp
  where not exists (
    select 1
    from public.permissions p
    where p.code = dp.code
  )
  returning id, code
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'advisory.view',
  'categories.view',
  'collections.view',
  'executive.view',
  'executive.financial',
  'inventory.view',
  'logistics.view',
  'orders.view',
  'payments.view',
  'permissions.view',
  'products.view',
  'roles.view',
  'support.view',
  'training.view',
  'training.learners',
  'training.manage'
)
where r.name = 'super_admin'
and not exists (
  select 1
  from public.role_permissions rp
  where rp.role_id = r.id
    and rp.permission_id = p.id
);
