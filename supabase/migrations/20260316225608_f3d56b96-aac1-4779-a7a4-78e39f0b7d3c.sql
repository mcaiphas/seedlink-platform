
-- Notification channel configurations table
CREATE TABLE IF NOT EXISTS public.notification_channel_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL UNIQUE CHECK (channel IN ('email','sms','whatsapp','in_app','push')),
  is_active boolean NOT NULL DEFAULT false,
  provider_name text,
  sender_identity text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  auth_status text NOT NULL DEFAULT 'not_configured' CHECK (auth_status IN ('not_configured','configured','verified','error')),
  retry_enabled boolean NOT NULL DEFAULT true,
  max_retries int NOT NULL DEFAULT 3,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed default channels
INSERT INTO public.notification_channel_configs (channel, is_active, provider_name, config) VALUES
  ('email', false, null, '{"from_name":"Seedlink Commerce","from_email":"","reply_to":"","signature":""}'::jsonb),
  ('sms', false, null, '{"sender_id":"","country_format":"+27"}'::jsonb),
  ('in_app', true, 'internal', '{"retention_days":90,"priority":"normal"}'::jsonb),
  ('whatsapp', false, null, '{"business_phone":""}'::jsonb),
  ('push', false, null, '{}'::jsonb)
ON CONFLICT (channel) DO NOTHING;

-- Document storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('document-files', 'document-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: only authenticated users can upload
CREATE POLICY "Auth users can upload documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'document-files');

-- Storage RLS: users with admin/finance/sales roles can read
CREATE POLICY "Authorized users can read documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'document-files');

-- Add communication_history tab columns if not exist
ALTER TABLE public.notification_templates ADD COLUMN IF NOT EXISTS variables text[];
ALTER TABLE public.notification_templates ADD COLUMN IF NOT EXISTS default_recipients text;
