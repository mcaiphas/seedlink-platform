import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { classifyError, QueryStatus } from '@/lib/supabase-helpers';
import { QueryStatusBanner } from '@/components/QueryStatusBanner';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ShoppingCart, GraduationCap, Tractor, MapPin, Bell } from 'lucide-react';

interface SectionState<T = any> {
  data: T[];
  status: QueryStatus;
  error: string | null;
  count: number | null;
}

const empty = <T,>(): SectionState<T> => ({ data: [], status: 'loading', error: null, count: null });

async function safeCount(table: string): Promise<{ count: number; status: QueryStatus; error: string | null }> {
  const { count, error } = await supabase.from(table as any).select('*', { count: 'exact', head: true });
  if (error) {
    const c = classifyError(error);
    return { count: 0, status: c.status, error: c.message };
  }
  return { count: count || 0, status: count === 0 ? 'empty' : 'success', error: null };
}

async function safeQuery<T = any>(table: string, select = '*', limit = 5): Promise<SectionState<T>> {
  const { data, error } = await supabase.from(table as any).select(select).order('created_at', { ascending: false }).limit(limit);
  if (error) {
    const c = classifyError(error);
    return { data: [], status: c.status, error: c.message, count: null };
  }
  return { data: (data || []) as T[], status: data && data.length > 0 ? 'success' : 'empty', error: null, count: data?.length || 0 };
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, { count: number; status: QueryStatus; error: string | null }>>({});
  const [orders, setOrders] = useState<SectionState>(empty());
  const [courses, setCourses] = useState<SectionState>(empty());
  const [activities, setActivities] = useState<SectionState>(empty());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const tables = ['products', 'orders', 'courses', 'farms', 'fields', 'notifications'];
      const [countResults, o, c, a] = await Promise.all([
        Promise.all(tables.map(t => safeCount(t).then(r => [t, r] as const))),
        safeQuery('orders'),
        safeQuery('courses'),
        safeQuery('farm_activities'),
      ]);
      setCounts(Object.fromEntries(countResults));
      setOrders(o);
      setCourses(c);
      setActivities(a);
      setLoading(false);
    }
    load();
  }, []);

  const icons: Record<string, typeof Package> = { products: Package, orders: ShoppingCart, courses: GraduationCap, farms: Tractor, fields: MapPin, notifications: Bell };
  const labels: Record<string, string> = { products: 'Products', orders: 'Orders', courses: 'Courses', farms: 'Farms', fields: 'Fields', notifications: 'Notifications' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Seedlink Platform (Dev)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : Object.entries(labels).map(([key, label]) => {
              const c = counts[key];
              if (!c || c.status === 'error' || c.status === 'rls_denied' || c.status === 'table_unavailable') {
                return <StatCard key={key} title={label} value="—" icon={icons[key]} />;
              }
              return <StatCard key={key} title={label} value={c.count} icon={icons[key]} />;
            })
        }
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardSection title="Recent Orders" section={orders} tableName="orders"
          columns={['Order #', 'Status', 'Total']}
          renderRow={(o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.order_number || o.id.slice(0, 8)}</TableCell>
              <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
              <TableCell className="text-right">{o.currency_code} {o.total_amount}</TableCell>
            </TableRow>
          )}
        />
        <DashboardSection title="Recent Courses" section={courses} tableName="courses"
          columns={['Title', 'Status']}
          renderRow={(c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.title}</TableCell>
              <TableCell><Badge variant="secondary">{c.status}</Badge></TableCell>
            </TableRow>
          )}
        />
        <DashboardSection title="Recent Farm Activity" section={activities} tableName="farm_activities"
          columns={['Activity', 'Type']}
          renderRow={(a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.title}</TableCell>
              <TableCell><Badge variant="secondary">{a.activity_type}</Badge></TableCell>
            </TableRow>
          )}
        />
      </div>
    </div>
  );
}

function DashboardSection({ title, section, tableName, columns, renderRow }: {
  title: string;
  section: SectionState;
  tableName: string;
  columns: string[];
  renderRow: (row: any) => React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        {section.status === 'loading' ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : section.status !== 'success' ? (
          section.status === 'empty' ? (
            <p className="text-sm text-muted-foreground">No records yet</p>
          ) : (
            <QueryStatusBanner status={section.status} message={section.error || undefined} tableName={tableName} />
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => <TableHead key={i} className={i === columns.length - 1 && columns.length > 2 ? 'text-right' : ''}>{col}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>{section.data.map(renderRow)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
