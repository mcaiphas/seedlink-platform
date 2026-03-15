insert into public.roles (name, description, is_system_role)
values
('super_admin','Full Seedlink platform control',true),
('admin','Administrative platform access',true),
('farmer','Farmer platform user',true),
('supplier','Supplier or input partner',true),
('buyer','Produce or marketplace buyer',true),
('trainer','Training facilitator or agronomist',true),
('logistics_partner','Transport or logistics operator',true)
on conflict (name) do nothing;
