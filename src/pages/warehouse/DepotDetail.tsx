import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin, Phone, Mail, Star, Warehouse, Boxes, MoveHorizontal, Users, Package } from 'lucide-react';

export default function DepotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [depot, setDepot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [invLoading, setInvLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('depots').select('*').eq('id', id).single(),
      supabase.from('depot_inventory').select('*, products(name), product_pack_sizes(name)').eq('depot_id', id).order('created_at', { ascending: false }).limit(100),
      supabase.from('stock_movements').select('*').eq('depot_id', id).order('created_at', { ascending: false }).limit(50),
    ]).then(([depotRes, invRes, movRes]) => {
      setDepot(depotRes.data);
      setInventory(invRes.data || []);
      setMovements(movRes.data || []);
      setLoading(false);
      setInvLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <AdminPage>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AdminPage>
    );
  }

  if (!depot) {
    return (
      <AdminPage>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Depot not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/depots')}>Back to Depots</Button>
        </div>
      </AdminPage>
    );
  }

  const formatType = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—';
  const locationStr = [depot.city, depot.province, depot.country].filter(Boolean).join(', ');

  return (
    <AdminPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/depots')}><ArrowLeft className="h-4 w-4" /></Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{depot.name}</h1>
              {depot.is_default && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
              <Badge variant={depot.is_active ? 'default' : 'secondary'}>{depot.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{depot.depot_code} · {formatType(depot.depot_type)}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><MapPin className="h-3.5 w-3.5" />Location</div>
              <p className="text-sm font-medium">{locationStr || '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Phone className="h-3.5 w-3.5" />Contact</div>
              <p className="text-sm font-medium">{depot.contact_person || '—'}</p>
              <p className="text-xs text-muted-foreground">{depot.contact_phone || ''}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Boxes className="h-3.5 w-3.5" />Stock Items</div>
              <p className="text-sm font-medium">{inventory.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Warehouse className="h-3.5 w-3.5" />Storage</div>
              <p className="text-sm font-medium capitalize">{depot.storage_category?.replace(/_/g, ' ') || 'General'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock in Depot</TabsTrigger>
            <TabsTrigger value="movements">Recent Movements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{formatType(depot.depot_type)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Storage Category</span><span className="capitalize">{depot.storage_category?.replace(/_/g, ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{depot.country || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Default</span><span>{depot.is_default ? 'Yes' : 'No'}</span></div>
                  {depot.physical_address && <div><span className="text-muted-foreground block mb-1">Address</span><span>{depot.physical_address}</span></div>}
                  {depot.gps_lat && <div className="flex justify-between"><span className="text-muted-foreground">GPS</span><span>{depot.gps_lat}, {depot.gps_lng}</span></div>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Contact</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Person</span><span>{depot.contact_person || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{depot.contact_phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{depot.contact_email || '—'}</span></div>
                </CardContent>
              </Card>
            </div>
            {depot.notes && (
              <Card>
                <CardHeader><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{depot.notes}</p></CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stock" className="mt-4">
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Pack Size</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">On Hand</TableHead>
                    <TableHead className="text-right">Reserved</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Reorder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map(row => (
                    <TableRow key={row.id}>
                      <td className="p-4 font-medium">{(row as any).products?.name || '—'}</td>
                      <td className="p-4">{(row as any).product_pack_sizes?.name || '—'}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{row.sku || '—'}</td>
                      <td className="p-4 text-right tabular-nums">{row.quantity_on_hand}</td>
                      <td className="p-4 text-right tabular-nums">{row.quantity_reserved}</td>
                      <td className="p-4 text-right tabular-nums font-medium">{row.quantity_available}</td>
                      <td className="p-4 text-right tabular-nums">{row.reorder_level}</td>
                    </TableRow>
                  ))}
                  {inventory.length === 0 && <TableRow><td colSpan={7} className="p-8 text-center text-muted-foreground">No stock records in this depot</td></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="movements" className="mt-4">
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map(row => (
                    <TableRow key={row.id}>
                      <td className="p-4 text-sm">{new Date(row.created_at).toLocaleDateString()}</td>
                      <td className="p-4"><Badge variant="outline" className="text-xs capitalize">{row.movement_type}</Badge></td>
                      <td className="p-4 font-mono text-xs">{row.reference_number || '—'}</td>
                      <td className="p-4 text-right tabular-nums">{row.quantity}</td>
                      <td className="p-4"><Badge variant={row.status === 'completed' ? 'default' : 'secondary'} className="text-xs">{row.status}</Badge></td>
                    </TableRow>
                  ))}
                  {movements.length === 0 && <TableRow><td colSpan={5} className="p-8 text-center text-muted-foreground">No recent movements</td></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(depot.created_at).toLocaleString()}<br />
                  Last Updated: {new Date(depot.updated_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPage>
  );
}
