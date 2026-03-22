import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Award, HeadphonesIcon, TicketIcon } from 'lucide-react';

export default function TrainingDashboard() {
  const [stats, setStats] = useState({ courses: 0, enrollments: 0, programs: 0, certificates: 0, sessions: 0, tickets: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('courses').select('id', { count: 'exact', head: true }),
      supabase.from('enrollments').select('id', { count: 'exact', head: true }),
      supabase.from('training_programs').select('id', { count: 'exact', head: true }),
      supabase.from('certificates').select('id', { count: 'exact', head: true }),
      supabase.from('advisory_sessions').select('id', { count: 'exact', head: true }),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    ]).then(([c, e, p, cert, s, t]) => {
      setStats({
        courses: c.count ?? 0,
        enrollments: e.count ?? 0,
        programs: p.count ?? 0,
        certificates: cert.count ?? 0,
        sessions: s.count ?? 0,
        tickets: t.count ?? 0,
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Training & Advisory" description="Manage courses, programs, advisory services, and farmer support." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Courses" value={stats.courses} icon={BookOpen} />
        <StatCard title="Programs" value={stats.programs} icon={GraduationCap} />
        <StatCard title="Enrollments" value={stats.enrollments} icon={Users} />
        <StatCard title="Certificates" value={stats.certificates} icon={Award} />
        <StatCard title="Advisory Sessions" value={stats.sessions} icon={HeadphonesIcon} />
        <StatCard title="Open Tickets" value={stats.tickets} icon={TicketIcon} />
      </div>
    </div>
  );
}
