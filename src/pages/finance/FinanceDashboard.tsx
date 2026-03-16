import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KpiCard } from '@/components/commerce/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, TrendingDown, Landmark, Package, Users, Building2, Scale, Receipt } from 'lucide-react';
import { CurrencyDisplay } from '@/components/commerce/StatusBadge';

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    revenue: 0, cos: 0, grossProfit: 0, opex: 0, operatingProfit: 0, netProfit: 0,
    totalAssets: 0, totalLiabilities: 0, cashAtBank: 0, tradeDebtors: 0, tradeCreditors: 0, inventory: 0,
    vatPayable: 0,
  });

  useEffect(() => {
    async function load() {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const today = now.toISOString().slice(0, 10);

      const [{ data: accounts }, { data: allLines }] = await Promise.all([
        supabase.from('gl_accounts').select('id,account_code,account_name,account_type').eq('is_active', true),
        supabase.from('journal_entry_lines').select('gl_account_id,debit_amount,credit_amount,journal_entries!inner(entry_date,status)'),
      ]);
      if (!accounts) { setLoading(false); return; }

      const posted = (allLines || []).filter((l: any) => l.journal_entries?.status === 'posted');
      const monthLines = posted.filter((l: any) => l.journal_entries.entry_date >= startOfMonth && l.journal_entries.entry_date <= today);

      const acctMap = Object.fromEntries(accounts.map(a => [a.id, a]));

      function sumByType(lines: any[], types: string[], isCredit: boolean) {
        return lines.reduce((s: number, l: any) => {
          const acct = acctMap[l.gl_account_id];
          if (!acct || !types.includes(acct.account_type)) return s;
          return s + (isCredit ? (l.credit_amount || 0) - (l.debit_amount || 0) : (l.debit_amount || 0) - (l.credit_amount || 0));
        }, 0);
      }

      const revenue = sumByType(monthLines, ['revenue', 'other_income'], true);
      const cos = sumByType(monthLines, ['cost_of_sales'], false);
      const opex = sumByType(monthLines, ['expense', 'other_expense'], false);
      const grossProfit = revenue - cos;
      const operatingProfit = grossProfit - opex;

      function balanceByCode(code: string) {
        const acct = accounts.find(a => a.account_code === code);
        if (!acct) return 0;
        return posted.filter((l: any) => l.gl_account_id === acct.id && l.journal_entries.entry_date <= today)
          .reduce((s: number, l: any) => s + (l.debit_amount || 0) - (l.credit_amount || 0), 0);
      }

      const totalAssets = sumByType(posted.filter((l: any) => l.journal_entries.entry_date <= today), ['asset'], false);
      const totalLiabilities = sumByType(posted.filter((l: any) => l.journal_entries.entry_date <= today), ['liability'], true);

      // VAT payable = net of VAT control accounts
      const vatAccounts = accounts.filter(a => a.account_name.toLowerCase().includes('vat') || a.account_code.startsWith('2300'));
      const vatPayable = vatAccounts.reduce((s, acct) => {
        const acctLines = posted.filter((l: any) => l.gl_account_id === acct.id && l.journal_entries.entry_date <= today);
        return s + acctLines.reduce((ss: number, l: any) => ss + (l.credit_amount || 0) - (l.debit_amount || 0), 0);
      }, 0);

      setKpis({
        revenue, cos, grossProfit, opex, operatingProfit, netProfit: operatingProfit,
        totalAssets, totalLiabilities,
        cashAtBank: balanceByCode('1000'),
        tradeDebtors: balanceByCode('1200'),
        tradeCreditors: Math.abs(balanceByCode('2200')),
        inventory: balanceByCode('1100'),
        vatPayable,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time financial overview from the general ledger</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue (This Month)" value={`ZAR ${kpis.revenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={TrendingUp} />
        <KpiCard label="Gross Profit" value={`ZAR ${kpis.grossProfit.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={DollarSign} />
        <KpiCard label="Operating Profit" value={`ZAR ${kpis.operatingProfit.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={Scale} />
        <KpiCard label="Cash at Bank" value={`ZAR ${kpis.cashAtBank.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={Landmark} />
        <KpiCard label="Trade Debtors" value={`ZAR ${kpis.tradeDebtors.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={Users} />
        <KpiCard label="Trade Creditors" value={`ZAR ${kpis.tradeCreditors.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={Building2} />
        <KpiCard label="Inventory Value" value={`ZAR ${kpis.inventory.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={Package} />
        <KpiCard label="VAT Payable" value={`ZAR ${kpis.vatPayable.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} icon={Receipt} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm">P&L Summary (This Month)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Revenue', kpis.revenue],
              ['Cost of Sales', -kpis.cos],
              ['Gross Profit', kpis.grossProfit],
              ['Operating Expenses', -kpis.opex],
              ['Operating Profit', kpis.operatingProfit],
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label as string}</span>
                <CurrencyDisplay amount={val as number} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-sm">Balance Sheet Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Total Assets', kpis.totalAssets],
              ['Total Liabilities', kpis.totalLiabilities],
              ['Cash at Bank', kpis.cashAtBank],
              ['Trade Debtors', kpis.tradeDebtors],
              ['Trade Creditors', kpis.tradeCreditors],
              ['Inventory', kpis.inventory],
              ['VAT Payable', kpis.vatPayable],
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label as string}</span>
                <CurrencyDisplay amount={val as number} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
