
-- Training Programs
CREATE TABLE public.training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  description text,
  category text DEFAULT 'general',
  start_date date,
  end_date date,
  enrollment_type text DEFAULT 'individual' CHECK (enrollment_type IN ('individual','group','cohort')),
  status text DEFAULT 'draft' CHECK (status IN ('draft','active','completed','archived')),
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Link table: program ↔ courses
CREATE TABLE public.program_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.training_programs(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  sort_order int DEFAULT 0,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(program_id, course_id)
);

-- Advisory Services catalog
CREATE TABLE public.advisory_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  description text,
  service_category text DEFAULT 'agronomy',
  pricing_model text DEFAULT 'per_session' CHECK (pricing_model IN ('per_session','subscription','free')),
  price numeric(12,2) DEFAULT 0,
  currency_code text DEFAULT 'ZAR',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Advisory Sessions
CREATE TABLE public.advisory_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_number text,
  customer_id uuid REFERENCES public.customers(id),
  farm_id uuid REFERENCES public.farms(id),
  advisor_id uuid REFERENCES public.profiles(id),
  service_id uuid REFERENCES public.advisory_services(id),
  session_date timestamptz DEFAULT now(),
  session_type text DEFAULT 'consultation',
  duration_minutes int,
  notes text,
  recommendations text,
  linked_recommendation_id uuid REFERENCES public.agro_recommendations(id),
  linked_crop_plan_id uuid REFERENCES public.crop_plans(id),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support Tickets
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text,
  customer_id uuid REFERENCES public.customers(id),
  user_id uuid REFERENCES public.profiles(id),
  category text DEFAULT 'general',
  priority text DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  subject text NOT NULL,
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting','resolved','closed')),
  assigned_advisor_id uuid REFERENCES public.profiles(id),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sequences for numbering
CREATE SEQUENCE IF NOT EXISTS public.advisory_session_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS public.support_ticket_seq START 1000;

-- Auto-number triggers
CREATE OR REPLACE FUNCTION public.set_advisory_session_number()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  IF NEW.session_number IS NULL THEN
    NEW.session_number := 'AS-' || lpad(nextval('public.advisory_session_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_advisory_session_number
  BEFORE INSERT ON public.advisory_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_advisory_session_number();

CREATE OR REPLACE FUNCTION public.set_support_ticket_number()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := 'TK-' || lpad(nextval('public.support_ticket_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_support_ticket_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_support_ticket_number();

-- RLS
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can read, admins can write
CREATE POLICY "Authenticated users can view training_programs" ON public.training_programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage training_programs" ON public.training_programs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view program_courses" ON public.program_courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage program_courses" ON public.program_courses FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view advisory_services" ON public.advisory_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage advisory_services" ON public.advisory_services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view advisory_sessions" ON public.advisory_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage advisory_sessions" ON public.advisory_sessions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view support_tickets" ON public.support_tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create support_tickets" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage support_tickets" ON public.support_tickets FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Permissions
INSERT INTO public.permissions (id, code, name, module, description) VALUES
  (gen_random_uuid(), 'training:view', 'View Training', 'training', 'View courses and programs'),
  (gen_random_uuid(), 'training:manage', 'Manage Training', 'training', 'Create and edit courses and programs'),
  (gen_random_uuid(), 'training:learners', 'Manage Learners', 'training', 'Manage learner enrollments'),
  (gen_random_uuid(), 'advisory:view', 'View Advisory', 'advisory', 'View advisory services and sessions'),
  (gen_random_uuid(), 'advisory:manage', 'Manage Advisory', 'advisory', 'Provide advisory services'),
  (gen_random_uuid(), 'support:view', 'View Support Tickets', 'support', 'View support tickets'),
  (gen_random_uuid(), 'support:manage', 'Manage Support Tickets', 'support', 'Manage and resolve support tickets')
ON CONFLICT DO NOTHING;
