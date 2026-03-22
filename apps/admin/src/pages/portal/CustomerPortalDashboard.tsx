import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge, CurrencyDisplay, DateDisplay } from '@/components/commerce/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { FileText, Receipt, CreditCard, Download, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';

export default function CustomerPortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    // Find customer linked to this user's profile email
    supabase.from('profiles').select('id').eq('id', user.id).single().then(async ({ data: profile }) => {
      // Try to find customer by email
      const { data: cust } = await supabase.from('customers').select('id').eq('contact_email', user.email).limit(1).single();
      if (cust) {
        setCustomerId(cust.id);
        const [{ data: inv }, { data: qt }, { data: ord }, { data: pr }] = await Promise.all([
          supabase.from('customer_invoices').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('quotes').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('orders').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('payment_requests').select('*').eq('customer_id', cust.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(10),
        ]);
        setInvoices(inv || []);
        setQuotes(qt || []);
        setOrders(ord || []);
        setPaymentRequests(pr || []);
      }
      setLoading(false);
    });
  }, [user]);

  const outstandingBalance = useMemo(() =>
    invoices.filter(i => ['issued', 'partially_paid', 'overdue'].includes(i.status))
      .reduce((sum, i) => sum + (Number(i.total_amount) - Number(i.paid_amount || 0)), 0),
  [invoices]);

  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground">No Customer Account Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">Your login email is not linked to a customer account. Please contact your account manager.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">View your documents, invoices, and account information</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><DollarSign className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground"><CurrencyDisplay amount={outstandingBalance} /></p>
                <p className="text-xs text-muted-foreground">Outstanding Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overdueCount}</p>
                <p className="text-xs text-muted-foreground">Overdue Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2.5"><Receipt className="h-5 w-5 text-accent-foreground" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
                <p className="text-xs text-muted-foreground">Recent Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2.5"><CreditCard className="h-5 w-5 text-secondary-foreground" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{paymentRequests.length}</p>
                <p className="text-xs text-muted-foreground">Pending Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => navigate('/portal/invoices')}><Receipt className="h-4 w-4 mr-2" />View Invoices</Button>
        <Button variant="outline" onClick={() => navigate('/portal/quotes')}><FileText className="h-4 w-4 mr-2" />View Quotes</Button>
        <Button variant="outline" onClick={() => navigate('/portal/statements')}><Download className="h-4 w-4 mr-2" />Download Statement</Button>
      </div>

      {/* Payment Requests */}
      {paymentRequests.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Pending Payment Requests</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Request #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {paymentRequests.map(pr => (
                  <TableRow key={pr.id}>
                    <TableCell className="pl-6 font-medium">{pr.request_number}</TableCell>
                    <TableCell><DateDisplay date={pr.due_date} /></TableCell>
                    <TableCell className="text-right"><CurrencyDisplay amount={pr.amount} /></TableCell>
                    <TableCell className="text-right pr-6">
                      {pr.payment_link && (
                        <Button size="sm" className="h-7 text-xs" onClick={() => window.open(pr.payment_link, '_blank')}>
                          <CreditCard className="h-3 w-3 mr-1" />Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Invoices</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right pr-6">Outstanding</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No invoices yet</TableCell></TableRow>
              ) : invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="pl-6 font-medium">{inv.invoice_number}</TableCell>
                  <TableCell><DateDisplay date={inv.invoice_date} /></TableCell>
                  <TableCell><StatusBadge type="document" value={inv.status} /></TableCell>
                  <TableCell className="text-right"><CurrencyDisplay amount={inv.total_amount} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={Number(inv.total_amount) - Number(inv.paid_amount || 0)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Quotes */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Quotes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Quote #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Expiry</TableHead>
              <TableHead className="text-right pr-6">Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {quotes.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No quotes yet</TableCell></TableRow>
              ) : quotes.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="pl-6 font-medium">{q.quote_number}</TableCell>
                  <TableCell><DateDisplay date={q.quote_date} /></TableCell>
                  <TableCell><StatusBadge type="document" value={q.status} /></TableCell>
                  <TableCell className="text-right"><DateDisplay date={q.expiry_date} /></TableCell>
                  <TableCell className="text-right pr-6"><CurrencyDisplay amount={q.total_amount} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
