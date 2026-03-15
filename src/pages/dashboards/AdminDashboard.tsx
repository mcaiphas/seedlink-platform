import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ShieldCheck, Building2, Package, GraduationCap, Store, AlertTriangle, RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableData {
  profiles: any[];
  roleAssignments: any[];
  organizations: any[];
  products: any[];
  courses: any[];
}

interface Counts {
  profiles: number;
  roleAssignments: number;
  organizations: number;
  products: number;
  courses: number;
}

function EmptyState({ label }: { label: string }) {
  return (
    <TableRow>
      <TableCell colSpan={10} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Inbox className="h-5 w-5" />
          <p className="text-sm">No {label} found</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<TableData>({ profiles: [], roleAssignments: [], organizations: [], products: [], courses: [] });
  const [counts, setCounts] = useState<Counts>({ profiles: 0, roleAssignments: 0, organizations: 0, products: 0, courses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profilesRes, rolesRes, orgsRes, productsRes, coursesRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("user_role_assignments").select("id, user_id, is_active, created_at, roles(name), profiles(full_name)").order("created_at", { ascending: false }).limit(20),
        supabase.from("organizations").select("id, name, organization_type, country_code, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("products").select("id, name, sku, price, currency_code, status, stock_quantity, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("courses").select("id, title, status, level, is_active, created_at").order("created_at", { ascending: false }).limit(20),
      ]);

      // Check for errors
      const errors = [profilesRes.error, rolesRes.error, orgsRes.error, productsRes.error, coursesRes.error].filter(Boolean);
      if (errors.length > 0) {
        console.error("Admin fetch errors:", errors);
        setError("Some tables could not be loaded. Check RLS policies.");
      }

      setData({
        profiles: profilesRes.data || [],
        roleAssignments: rolesRes.data || [],
        organizations: orgsRes.data || [],
        products: productsRes.data || [],
        courses: coursesRes.data || [],
      });

      setCounts({
        profiles: profilesRes.data?.length || 0,
        roleAssignments: rolesRes.data?.length || 0,
        organizations: orgsRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        courses: coursesRes.data?.length || 0,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const statCards = [
    { label: "Profiles", value: counts.profiles, icon: Users },
    { label: "Role Assignments", value: counts.roleAssignments, icon: ShieldCheck },
    { label: "Organizations", value: counts.organizations, icon: Building2 },
    { label: "Products", value: counts.products, icon: Package },
    { label: "Courses", value: counts.courses, icon: GraduationCap },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Dev environment verification — live Supabase data</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profiles table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Profiles</CardTitle>
          <CardDescription>Users registered in the system</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role (legacy)</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.profiles.length === 0 ? <EmptyState label="profiles" /> : data.profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{p.role || "none"}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{p.id.slice(0, 8)}…</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role assignments table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">User Role Assignments</CardTitle>
          <CardDescription>Active role assignments from user_role_assignments + roles</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.roleAssignments.length === 0 ? <EmptyState label="role assignments" /> : data.roleAssignments.map((ra) => {
                const roleName = (ra.roles as any)?.name || "—";
                const userName = (ra.profiles as any)?.full_name || ra.user_id?.slice(0, 8) + "…";
                return (
                  <TableRow key={ra.id}>
                    <TableCell className="font-medium">{userName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{roleName}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={ra.is_active ? "default" : "secondary"} className="text-xs">
                        {ra.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(ra.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Organizations table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Organizations</CardTitle>
          <CardDescription>Registered organizations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.organizations.length === 0 ? <EmptyState label="organizations" /> : data.organizations.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{o.organization_type}</Badge></TableCell>
                  <TableCell className="text-xs">{o.country_code || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Products table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Products</CardTitle>
          <CardDescription>Marketplace products</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.length === 0 ? <EmptyState label="products" /> : data.products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-xs font-mono">{p.sku || "—"}</TableCell>
                  <TableCell className="text-xs">{p.price != null ? `${p.currency_code} ${p.price.toFixed(2)}` : "—"}</TableCell>
                  <TableCell className="text-xs">{p.stock_quantity}</TableCell>
                  <TableCell><Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Courses table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Courses</CardTitle>
          <CardDescription>LMS courses</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.courses.length === 0 ? <EmptyState label="courses" /> : data.courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="text-xs capitalize">{c.level || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{c.status}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? "default" : "secondary"} className="text-xs">
                      {c.is_active ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
