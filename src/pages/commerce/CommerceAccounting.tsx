import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/PageHeader';
import { TrendingUp, TrendingDown, DollarSign, Landmark, Package, Receipt, Truck, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const fmt = (v: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);
const FLOWS = [
  { title: 'Goods Receipt', icon: Package, debit: 'Inventory', credit: 'GRNI (Goods Received Not Invoiced)', desc: 'When goods are received against a PO, inventory increases and a GRNI liability is created.' },
  { title: 'Supplier Invoice', icon: Receipt, debit: 'GRNI / Inventory / Expense', credit: 'Accounts Payable', desc: 'Supplier invoice clears GRNI and creates an accounts payable obligation.' },
  { title: 'Customer Invoice', icon: TrendingUp, debit: 'Accounts Receivable', credit: 'Sales Revenue', desc: 'Revenue is recognized and an accounts receivable asset is created.' },
  { title: 'Fulfillment / Stock Issue', icon: Truck, debit: 'Cost of Goods Sold', credit: 'Inventory', desc: 'When goods ship, COGS increases and inventory decreases.' },
  { title: 'Supplier Payment', icon: CreditCard, debit: 'Accounts Payable', credit: 'Bank', desc: 'Payment to supplier reduces payable liability and bank balance.' },
  { title: 'Customer Payment', icon: DollarSign, debit: 'Bank', credit: 'Accounts Receivable', desc: 'Customer payment increases bank and clears the receivable.' },
];

export default function CommerceAccounting() {
  const [payable, setPayable] = useState(0);
  const [receivable, setReceivable] = useState(0);
  const [grCount, setGrCount] = useState(0);
  const [siCount, setSiCount] = useState(0);
  const [ciCount, setCiCount] = useState(0);

  useEffect(() => {
    Promise.allSettled([
      supabase.from('supplier_invoices').select('total_amount, status'),
      supabase.from('customer_invoices').select('total_amount, status'),
      supabase.from('goods_receipts').select('id'),
      supabase.from('supplier_invoices').select('id'),
      supabase.from('customer_invoices').select('id'),
    ]).then(([siRes, ciRes, grRes, siCntRes, ciCntRes]) => {
      if (siRes.status === 'fulfilled' && siRes.value.data) setPayable(siRes.value.data.filter((i: any) => i.status !== 'paid').reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0));
      if (ciRes.status === 'fulfilled' && ciRes.value.data) setReceivable(ciRes.value.data.filter((i: any) => i.status !== 'paid').reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0));
      if (grRes.status === 'fulfilled') setGrCount(grRes.value.data?.length || 0);
      if (siCntRes.status === 'fulfilled') setSiCount(siCntRes.value.data?.length || 0);
      if (ciCntRes.status === 'fulfilled') setCiCount(ciCntRes.value.data?.length || 0);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Commerce Accounting" description="Financial visibility for procurement and sales operations" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Accounts Payable', value: fmt(payable), icon: TrendingDown, color: 'text-destructive' },
          { label: 'Accounts Receivable', value: fmt(receivable), icon: TrendingUp, color: 'text-primary' },
          { label: 'Goods Receipts', value: grCount, icon: Package, color: 'text-foreground' },
          { label: 'Invoices', value: siCount + ciCount, icon: Receipt, color: 'text-foreground' },
        ].map(s => (
          <Card key={s.label}><CardContent className="pt-5"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p></div><div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center"><s.icon className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Landmark className="h-5 w-5 text-primary" />Accounting Flow Reference</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FLOWS.map(flow => (
            <Card key={flow.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><flow.icon className="h-4 w-4 text-primary" /></div><CardTitle className="text-sm font-semibold">{flow.title}</CardTitle></div></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 font-mono">DR</Badge><span className="font-medium">{flow.debit}</span></div>
                <div className="flex items-center gap-2 text-sm"><Badge variant="outline" className="text-xs bg-muted font-mono">CR</Badge><span className="font-medium">{flow.credit}</span></div>
                <Separator /><p className="text-xs text-muted-foreground leading-relaxed">{flow.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
