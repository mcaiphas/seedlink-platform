import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminPage } from '@/components/AdminPage';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, TrendingDown, ArrowRight, FileSpreadsheet, Receipt, PackageCheck, ShoppingCart } from 'lucide-react';

export default function CommerceAccounting() {
  const [loading, setLoading] = useState(true);
  const [supplierInvoices, setSupplierInvoices] = useState<any[]>([]);
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('supplier_invoices').select('id, supplier_invoice_number, total_amount, currency_code, status, invoice_date, suppliers(supplier_name)').order('invoice_date', { ascending: false }).limit(50),
      supabase.from('customer_invoices').select('id, invoice_number, total_amount, currency_code, status, invoice_date, profiles(full_name)').order('invoice_date', { ascending: false }).limit(50),
      supabase.from('goods_receipts').select('id, receipt_number, status, receipt_date, suppliers(supplier_name)').order('receipt_date', { ascending: false }).limit(50),
      supabase.from('purchase_orders').select('id, po_number, total_amount, currency_code, status, order_date, suppliers(supplier_name)').order('order_date', { ascending: false }).limit(50),
    ]).then(([siR, ciR, grR, poR]) => {
      setSupplierInvoices(siR.data || []);
      setCustomerInvoices(ciR.data || []);
      setGoodsReceipts(grR.data || []);
      setPurchaseOrders(poR.data || []);
      setLoading(false);
    });
  }, []);

  const payable = useMemo(() => supplierInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + Number(i.total_amount || 0), 0), [supplierInvoices]);
  const receivable = useMemo(() => customerInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + Number(i.total_amount || 0), 0), [customerInvoices]);
  const paidOut = useMemo(() => supplierInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.total_amount || 0), 0), [supplierInvoices]);
  const collected = useMemo(() => customerInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.total_amount || 0), 0), [customerInvoices]);

  if (loading) return <AdminPage><div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div></AdminPage>;

  const FlowRow = ({ label, debit, credit }: { label: string; debit: string; credit: string }) => (
    <TableRow>
      <TableCell className="font-medium text-sm">{label}</TableCell>
      <TableCell className="text-right"><Badge variant="outline" className="text-xs font-mono">{debit}</Badge></TableCell>
      <TableCell className="text-right"><Badge variant="outline" className="text-xs font-mono">{credit}</Badge></TableCell>
    </TableRow>
  );

  return (
    <AdminPage>
      <div className="space-y-6 pb-10">
        <PageHeader title="Commerce Accounting" description="Payables, receivables, and transaction flow overview" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-destructive" /></div>
            <div><p className="text-xs text-muted-foreground">Accounts Payable</p><p className="text-xl font-bold tabular-nums">ZAR {payable.toFixed(2)}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Accounts Receivable</p><p className="text-xl font-bold tabular-nums">ZAR {receivable.toFixed(2)}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><DollarSign className="h-5 w-5 text-muted-foreground" /></div>
            <div><p className="text-xs text-muted-foreground">Paid to Suppliers</p><p className="text-xl font-bold tabular-nums">ZAR {paidOut.toFixed(2)}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Collected Revenue</p><p className="text-xl font-bold tabular-nums">ZAR {collected.toFixed(2)}</p></div>
          </CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileSpreadsheet className="h-4 w-4 text-primary" />Procurement Flow</CardTitle><CardDescription>Debit/Credit effect of procurement transactions</CardDescription></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Transaction</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead></TableRow></TableHeader>
                <TableBody>
                  <FlowRow label="Goods Receipt → Inventory" debit="Inventory" credit="GRNI" />
                  <FlowRow label="Supplier Invoice → Payable" debit="GRNI" credit="Accounts Payable" />
                  <FlowRow label="Payment → Supplier" debit="Accounts Payable" credit="Bank / Cash" />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="h-4 w-4 text-primary" />Sales Flow</CardTitle><CardDescription>Debit/Credit effect of sales transactions</CardDescription></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Transaction</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead></TableRow></TableHeader>
                <TableBody>
                  <FlowRow label="Customer Invoice → Revenue" debit="Accounts Receivable" credit="Revenue" />
                  <FlowRow label="Fulfillment → COGS" debit="COGS" credit="Inventory" />
                  <FlowRow label="Payment Received" debit="Bank / Cash" credit="Accounts Receivable" />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Supplier Invoices</CardTitle></CardHeader>
            <CardContent>
              {supplierInvoices.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No supplier invoices yet</p> : (
                <div className="space-y-2">{supplierInvoices.slice(0, 8).map(i => (
                  <div key={i.id} className="flex items-center justify-between p-2 rounded border text-sm">
                    <div><span className="font-mono text-xs text-primary">{i.supplier_invoice_number}</span><span className="text-muted-foreground ml-2">{(i.suppliers as any)?.supplier_name}</span></div>
                    <div className="flex items-center gap-2"><span className="tabular-nums font-medium">{i.currency_code} {Number(i.total_amount).toFixed(2)}</span><Badge variant={i.status === 'paid' ? 'default' : 'secondary'} className="text-[10px] capitalize">{i.status}</Badge></div>
                  </div>
                ))}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Customer Invoices</CardTitle></CardHeader>
            <CardContent>
              {customerInvoices.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No customer invoices yet</p> : (
                <div className="space-y-2">{customerInvoices.slice(0, 8).map(i => (
                  <div key={i.id} className="flex items-center justify-between p-2 rounded border text-sm">
                    <div><span className="font-mono text-xs text-primary">{i.invoice_number}</span><span className="text-muted-foreground ml-2">{(i.profiles as any)?.full_name || 'Customer'}</span></div>
                    <div className="flex items-center gap-2"><span className="tabular-nums font-medium">{i.currency_code} {Number(i.total_amount).toFixed(2)}</span><Badge variant={i.status === 'paid' ? 'default' : 'secondary'} className="text-[10px] capitalize">{i.status}</Badge></div>
                  </div>
                ))}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPage>
  );
}
