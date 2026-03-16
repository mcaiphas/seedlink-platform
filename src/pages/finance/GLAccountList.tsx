import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Notebook } from 'lucide-react';

export default function GLAccountList() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    supabase.from('gl_accounts').select('*').order('account_code', { ascending: true })
      .then(({ data }) => { setAccounts(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    accounts.filter(a => {
      if (search && !(a.account_code || '').includes(search) && !(a.account_name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && a.account_type !== typeFilter) return false;
      return true;
    }), [accounts, search, typeFilter]);

  return (
    <PageShell title="GL Accounts" subtitle="Chart of accounts" loading={loading} search={search} onSearchChange={setSearch} searchPlaceholder="Search by code or name..."
      filters={
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="asset">Asset</SelectItem>
            <SelectItem value="liability">Liability</SelectItem>
            <SelectItem value="equity">Equity</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Notebook} title="No GL accounts" description="GL accounts will appear once configured." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sub-type</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="pl-6 font-mono font-medium">{a.account_code}</TableCell>
                  <TableCell className="font-medium">{a.account_name}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{a.account_type}</Badge></TableCell>
                  <TableCell className="text-sm capitalize">{a.account_sub_type || '—'}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant={a.is_active !== false ? 'default' : 'secondary'} className={`text-xs ${a.is_active !== false ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}`}>
                      {a.is_active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
