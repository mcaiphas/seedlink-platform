import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PageHeader } from '@/components/PageHeader';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, DollarSign, Landmark, Package, Receipt, Truck, CreditCard, ArrowRight, BookOpen, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);

const FLOWS = [
  { title: 'Goods Receipt', icon: Package, debit: 'Inventory', credit: 'GRNI (Goods Received Not Invoiced)', desc: 'When goods are received against a PO, inventory increases and a GRNI liability is created.', color: 'bg-primary/10 text-primary' },
  { title: 'Supplier Invoice', icon: Receipt, debit: 'GRNI / Inventory / Expense', credit: 'Accounts Payable', desc: 'Supplier invoice clears GRNI and creates an accounts payable obligation.', color: 'bg-amber-500/10 text-amber-600' },
  { title: 'Customer Invoice', icon: TrendingUp, debit: 'Accounts Receivable', credit: 'Sales Revenue', desc: 'Revenue is recognized and an accounts receivable asset is created.', color: 'bg-emerald-500/10 text-emerald-600' },
  { title: 'Fulfillment / Stock Issue', icon: Truck, debit: 'Cost of Goods Sold', credit: 'Inventory', desc: 'When goods ship, COGS increases and inventory decreases.', color: 'bg-blue-500/10 text-blue-600' },
  { title: 'Supplier Payment', icon: CreditCard, debit: 'Accounts Payable', credit: 'Bank', desc: 'Payment to supplier reduces payable liability and bank balance.', color: 'bg-purple-500/10 text-purple-600' },
  { title: 'Customer Payment', icon: DollarSign, debit: 'Bank', credit: 'Accounts Receivable', desc: 'Customer payment increases bank and clears the receivable.', color: 'bg-emerald-500/10 text-emerald-600' },
];

export default function CommerceAccounting() {
  const navigate = useNavigate();
  const [payable, setPayable] = useState(0);
  const [receivable, setReceivable] = useState(0);
  const [grCount, setGrCount] = useState(0);
  const [siCount, setSiCount] = useState(0);
  const [ciCount, setCiCount] = useState(0);
  const [movCount, setMovCount] = useState(0);
  const [recentJournals, setRecentJournals] = useState<any[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedJE, setSelectedJE] = useState<any>(null);
  const [jeLines, setJeLines] = useState<any[]>([]);

  useEffect(() => {
    Promise.allSettled([
      supabase.from('supplier_invoices').select('total_amount, status'),
      supabase.from('customer_invoices').select('total_amount, status'),
      supabase.from('goods_receipts').select('id'),
      supabase.from('supplier_invoices').select('id'),
      supabase.from('customer_invoices').select('id'),
      supabase.from('stock_movements').select('id'),
      supabase.from('journal_entries').select('*').order('created_at', { ascending: false }).limit(10),
    ]).then(([siRes, ciRes, grRes, siCntRes, ciCntRes, movRes, jeRes]) => {
      if (siRes.status === 'fulfilled' && siRes.value.data) setPayable(siRes.value.data.filter((i: any) => i.status !== 'paid').reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0));
      if (ciRes.status === 'fulfilled' && ciRes.value.data) setReceivable(ciRes.value.data.filter((i: any) => i.status !== 'paid').reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0));
      if (grRes.status === 'fulfilled') setGrCount(grRes.value.data?.length || 0);
      if (siCntRes.status === 'fulfilled') setSiCount(siCntRes.value.data?.length || 0);
      if (ciCntRes.status === 'fulfilled') setCiCount(ciCntRes.value.data?.length || 0);
      if (movRes.status === 'fulfilled') setMovCount(movRes.value.data?.length || 0);
      if (jeRes.status === 'fulfilled') setRecentJournals(jeRes.value.data || []);
    });
  }, []);

  const openJEDetail = async (je: any) => {
    setSelectedJE(je);
    setDetailOpen(true);
    const { data: lines } = await supabase.from('journal_entry_lines').select('*, gl_accounts(account_code, account_name)').eq('journal_entry_id', je.id);
    setJeLines(lines || []);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Commerce Accounting" description="Financial visibility for procurement and sales operations" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Accounts Payable', value: fmt(payable), icon: TrendingDown, color: 'text-destructive' },
          { label: 'Accounts Receivable', value: fmt(receivable), icon: TrendingUp, color: 'text-primary' },
          { label: 'Goods Receipts', value: grCount, icon: Package, color: 'text-foreground' },
          { label: 'Supplier Invoices', value: siCount, icon: Receipt, color: 'text-foreground' },
          { label: 'Customer Invoices', value: ciCount, icon: Receipt, color: 'text-foreground' },
          { label: 'Stock Movements', value: movCount, icon: Truck, color: 'text-foreground' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Purchase Orders', url: '/purchase-orders' },
          { label: 'Goods Receipts', url: '/goods-receipts' },
          { label: 'Supplier Invoices', url: '/supplier-invoices' },
          { label: 'Customer Invoices', url: '/customer-invoices' },
          { label: 'Stock Movements', url: '/stock-movements' },
          { label: 'GL Accounts', url: '/gl-accounts' },
          { label: 'Journal Entries', url: '/journal-entries' },
        ].map(l => (
          <Button key={l.label} variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => navigate(l.url)}>{l.label}<ArrowRight className="h-3 w-3" /></Button>
        ))}
      </div>

      <Separator />

      {/* Accounting Flow Reference */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Landmark className="h-5 w-5 text-primary" />Accounting Flow Reference</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FLOWS.map(flow => (
            <Card key={flow.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${flow.color}`}>
                    <flow.icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">{flow.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 font-mono">DR</Badge><span className="font-medium">{flow.debit}</span></div>
                <div className="flex items-center gap-2 text-sm"><Badge variant="outline" className="text-xs bg-muted font-mono">CR</Badge><span className="font-medium">{flow.credit}</span></div>
                <Separator /><p className="text-xs text-muted-foreground leading-relaxed">{flow.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Recent Journal Entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Recent Journal Entries</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/journal-entries')} className="gap-1.5">View All<ArrowRight className="h-3 w-3" /></Button>
        </div>
        {recentJournals.length > 0 ? (
          <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Journal #</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Reference</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow></TableHeader>
              <TableBody>
                {recentJournals.map(je => (
                  <TableRow key={je.id} className="group hover:bg-muted/20">
                    <TableCell><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><span className="font-mono font-medium text-sm">{je.journal_number}</span></div></TableCell>
                    <TableCell className="text-sm">{je.entry_date}</TableCell>
                    <TableCell><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{je.reference_type || '—'}</span></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{je.description || '—'}</TableCell>
                    <TableCell><Badge variant={je.status === 'posted' ? 'default' : 'secondary'} className="text-xs">{je.status}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => openJEDetail(je)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No journal entries recorded yet</div>
        )}
      </div>

      {/* Journal Entry Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Journal Entry — {selectedJE?.journal_number}</DialogTitle><DialogDescription>{selectedJE?.description || 'No description'}</DialogDescription></DialogHeader>
          {selectedJE && (
            <div className="space-y-4 py-2">
              <div className="flex gap-4 text-sm">
                <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{selectedJE.entry_date}</p></div>
                <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Reference</p><p className="font-medium font-mono">{selectedJE.reference_type || '—'}</p></div>
                <div className="rounded-lg border bg-muted/20 p-3 flex-1"><p className="text-xs text-muted-foreground">Status</p><Badge variant={selectedJE.status === 'posted' ? 'default' : 'secondary'} className="text-xs mt-1">{selectedJE.status}</Badge></div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <Table><TableHeader><TableRow className="bg-muted/30"><TableHead className="font-semibold">Account</TableHead><TableHead className="font-semibold">Description</TableHead><TableHead className="font-semibold text-right">Debit</TableHead><TableHead className="font-semibold text-right">Credit</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {jeLines.map(l => (
                      <TableRow key={l.id}>
                        <TableCell><div><p className="font-mono text-sm">{l.gl_accounts?.account_code}</p><p className="text-xs text-muted-foreground">{l.gl_accounts?.account_name}</p></div></TableCell>
                        <TableCell className="text-sm">{l.line_description || '—'}</TableCell>
                        <TableCell className="text-right font-mono">{Number(l.debit_amount) > 0 ? fmt(Number(l.debit_amount)) : '—'}</TableCell>
                        <TableCell className="text-right font-mono">{Number(l.credit_amount) > 0 ? fmt(Number(l.credit_amount)) : '—'}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/20 font-semibold">
                      <TableCell colSpan={2} className="text-right">Totals</TableCell>
                      <TableCell className="text-right font-mono">{fmt(jeLines.reduce((s, l) => s + Number(l.debit_amount || 0), 0))}</TableCell>
                      <TableCell className="text-right font-mono">{fmt(jeLines.reduce((s, l) => s + Number(l.credit_amount || 0), 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              {(() => { const d = jeLines.reduce((s, l) => s + Number(l.debit_amount || 0), 0); const c = jeLines.reduce((s, l) => s + Number(l.credit_amount || 0), 0); const balanced = Math.abs(d - c) < 0.01; return (
                <div className={`rounded-lg border p-3 text-sm flex items-center gap-2 ${balanced ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}>
                  <Badge variant={balanced ? 'default' : 'destructive'} className="text-xs">{balanced ? 'Balanced' : 'Unbalanced'}</Badge>
                  <span>{balanced ? 'Debits equal credits' : `Difference: ${fmt(Math.abs(d - c))}`}</span>
                </div>
              ); })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
