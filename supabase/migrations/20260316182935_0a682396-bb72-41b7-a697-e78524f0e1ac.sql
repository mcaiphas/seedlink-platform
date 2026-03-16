
-- ============================================================
-- FIX: security_definer_view on public.user_effective_permissions
--
-- Problem:  The view runs with the creator's privileges (DEFINER),
--           bypassing RLS on user_role_assignments, roles,
--           role_permissions, and permissions for anon/authenticated.
--
-- Solution: Recreate with security_invoker = true so the view
--           respects the querying user's RLS policies.
-- ============================================================

-- 1. Drop the unsafe view
DROP VIEW IF EXISTS public.user_effective_permissions;

-- 2. Recreate with SECURITY INVOKER
CREATE VIEW public.user_effective_permissions
WITH (security_invoker = true)
AS
SELECT DISTINCT
  ura.user_id,
  r.name   AS role_name,
  p.code   AS permission_code,
  p.name   AS permission_name,
  p.module
FROM public.user_role_assignments ura
JOIN public.roles r             ON r.id  = ura.role_id
JOIN public.role_permissions rp ON rp.role_id = r.id
JOIN public.permissions p       ON p.id  = rp.permission_id;

-- 3. Grant access only to authenticated (not anon)
REVOKE ALL ON public.user_effective_permissions FROM anon;
GRANT SELECT ON public.user_effective_permissions TO authenticated;

-- ============================================================
-- VERIFICATION: Confirm no SECURITY DEFINER views remain exposed
-- ============================================================
-- Run after migration to verify:
--
-- SELECT c.relname AS view_name,
--        CASE WHEN 'security_invoker=true' = ANY(coalesce(c.reloptions,'{}'))
--             THEN 'INVOKER' ELSE 'DEFINER' END AS security_mode,
--        array_to_string(c.relacl, ', ') AS acl
-- FROM pg_class c
-- JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE c.relkind = 'v' AND n.nspname = 'public';
