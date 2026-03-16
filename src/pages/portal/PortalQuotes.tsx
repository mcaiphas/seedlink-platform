import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageShell, EmptyState } from '@/components/commerce/PageShell';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function PortalQuotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    supabase.from('customers').select('id').eq('contact_email', user.email).limit(1).single().then(async ({ data: cust }) => {
      if (cust) {
        const { data } = await supabase.from('quotes').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }).limit(200);
        setQuotes(data || []);
      }
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() =>
    quotes.filter(q => !search || (q.quote_number || '').toLowerCase().includes(search.toLowerCase())),
  [quotes, search]);

  return (
    <PageShell title="My Quotes" subtitle="View price quotations" loading={loading}
      search={search} onSearchChange={setSearch} searchPlaceholder="Search quotes...">
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No quotes" description="You don't have any quotes yet." />
      ) : (
        <Card className="shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Quote #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="pl-6 font-medium">{q.quote_number}</TableCell>
                  <TableCell><DateDisplay date={q.quote_date} /></TableCell>
                  <TableCell><DateDisplay date={q.expiry_date} /></TableCell>
                  <TableCell><StatusBadge type="document" value={q.status} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={q.total_amount} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </PageShell>
  );
}
