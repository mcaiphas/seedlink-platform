
INSERT INTO public.permissions (id, code, name, description, module)
VALUES
  (gen_random_uuid(), 'executive:view', 'View Executive Dashboard', 'View the management cockpit and executive analytics', 'Executive Intelligence'),
  (gen_random_uuid(), 'executive:financial', 'View Financial Analytics', 'View financial performance dashboards', 'Executive Intelligence'),
  (gen_random_uuid(), 'executive:export', 'Export Executive Reports', 'Export strategic reports to PDF/Excel', 'Executive Intelligence')
ON CONFLICT (code) DO NOTHING;
