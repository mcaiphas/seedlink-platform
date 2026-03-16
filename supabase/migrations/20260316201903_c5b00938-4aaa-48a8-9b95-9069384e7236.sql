
-- ============================================================
-- HARDEN RLS: supplier_contacts & approval_requests
-- ============================================================

ALTER TABLE public.supplier_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

-- A. supplier_contacts
DROP POLICY IF EXISTS "Authenticated users can manage supplier contacts" ON public.supplier_contacts;

CREATE POLICY "supplier_contacts_select"
  ON public.supplier_contacts FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_role('procurement_officer')
    OR public.has_role('supplier')
  );

CREATE POLICY "supplier_contacts_insert"
  ON public.supplier_contacts FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR public.has_role('procurement_officer')
  );

CREATE POLICY "supplier_contacts_update"
  ON public.supplier_contacts FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR public.has_role('procurement_officer')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_role('procurement_officer')
  );

CREATE POLICY "supplier_contacts_delete"
  ON public.supplier_contacts FOR DELETE TO authenticated
  USING (public.is_admin());

-- B. approval_requests
DROP POLICY IF EXISTS "Authenticated users can view approval requests" ON public.approval_requests;
DROP POLICY IF EXISTS "Authenticated users can insert approval requests" ON public.approval_requests;
DROP POLICY IF EXISTS "Authenticated users can update approval requests" ON public.approval_requests;

CREATE POLICY "approval_requests_select"
  ON public.approval_requests FOR SELECT TO authenticated
  USING (
    requested_by = auth.uid()
    OR public.is_admin()
    OR public.has_role('procurement_officer')
    OR public.has_role('warehouse_officer')
    OR public.has_role('accountant')
  );

CREATE POLICY "approval_requests_insert"
  ON public.approval_requests FOR INSERT TO authenticated
  WITH CHECK (
    requested_by = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "approval_requests_update"
  ON public.approval_requests FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR (
      (public.has_role('procurement_officer') OR public.has_role('warehouse_officer') OR public.has_role('accountant'))
      AND requested_by <> auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR (
      (public.has_role('procurement_officer') OR public.has_role('warehouse_officer') OR public.has_role('accountant'))
      AND requested_by <> auth.uid()
    )
  );

CREATE POLICY "approval_requests_delete"
  ON public.approval_requests FOR DELETE TO authenticated
  USING (public.is_admin());

-- C. Trigger to block self-approval
CREATE OR REPLACE FUNCTION public.prevent_self_approval()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  IF (NEW.approval_status IN ('approved', 'rejected'))
     AND (OLD.approval_status IS DISTINCT FROM NEW.approval_status)
     AND (NEW.requested_by = auth.uid())
     AND NOT public.is_admin()
  THEN
    RAISE EXCEPTION 'Users cannot approve or reject their own requests';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_self_approval ON public.approval_requests;
CREATE TRIGGER trg_prevent_self_approval
  BEFORE UPDATE ON public.approval_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_approval();
