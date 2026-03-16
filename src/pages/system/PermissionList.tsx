import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, Lock, Shield } from 'lucide-react';

export default function PermissionList() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('permissions')
      .select('*')
      .order('permission_code')
      .then(({ data }) => {
        setPermissions(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = permissions.filter(
    (p) =>
      p.permission_code?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">System permission definitions and access control codes</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">All Permissions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search permissions…"
                className="h-8 pl-8 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 text-xs">Code</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Module</TableHead>
                  <TableHead className="pr-5 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                      <div className="flex flex-col items-center gap-2">
                        <Lock className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm">No permissions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((p) => {
                  const module = p.permission_code?.split(':')[0] || '—';
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="pl-5">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{p.permission_code}</code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.description || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{module}</Badge>
                      </TableCell>
                      <TableCell className="pr-5">
                        <Badge variant={p.is_active !== false ? 'default' : 'secondary'} className="text-xs">
                          {p.is_active !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
