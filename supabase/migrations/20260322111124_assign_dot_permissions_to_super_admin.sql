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
