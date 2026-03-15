import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, GraduationCap, Tractor, MapPin, Bell } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, courses: 0, farms: 0, fields: 0, notifications: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, o, c, f, fl, n, ro, rc, ra] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('farms').select('*', { count: 'exact', head: true }),
        supabase.from('fields').select('*', { count: 'exact', head: true }),
        supabase.from('notifications').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('farm_activities').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({
        products: p.count || 0, orders: o.count || 0, courses: c.count || 0,
        farms: f.count || 0, fields: fl.count || 0, notifications: n.count || 0,
      });
      setRecentOrders(ro.data || []);
      setRecentCourses(rc.data || []);
      setRecentActivities(ra.data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Seedlink Platform (Dev)</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Products" value={stats.products} icon={Package} />
        <StatCard title="Orders" value={stats.orders} icon={ShoppingCart} />
        <StatCard title="Courses" value={stats.courses} icon={GraduationCap} />
        <StatCard title="Farms" value={stats.farms} icon={Tractor} />
        <StatCard title="Fields" value={stats.fields} icon={MapPin} />
        <StatCard title="Notifications" value={stats.notifications} icon={Bell} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>Order #</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {recentOrders.map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.order_number || o.id.slice(0, 8)}</TableCell>
                      <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
                      <TableCell className="text-right">{o.currency_code} {o.total_amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Courses</CardTitle></CardHeader>
          <CardContent>
            {recentCourses.length === 0 ? <p className="text-sm text-muted-foreground">No courses yet</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {recentCourses.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell><Badge variant="secondary">{c.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Farm Activity</CardTitle></CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? <p className="text-sm text-muted-foreground">No activities yet</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Type</TableHead></TableRow></TableHeader>
                <TableBody>
                  {recentActivities.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell><Badge variant="secondary">{a.activity_type}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
