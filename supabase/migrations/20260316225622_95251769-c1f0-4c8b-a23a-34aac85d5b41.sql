
-- RLS for notification_channel_configs: admins only
CREATE POLICY "Admins can manage channel configs" ON public.notification_channel_configs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS for notification_channel_configs: read for authenticated
CREATE POLICY "Auth users can read channel configs" ON public.notification_channel_configs
  FOR SELECT TO authenticated
  USING (true);
