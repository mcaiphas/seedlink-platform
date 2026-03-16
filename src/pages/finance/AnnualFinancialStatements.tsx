import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfitAndLoss from './ProfitAndLoss';
import BalanceSheet from './BalanceSheet';
import TrialBalance from './TrialBalance';
import CashMovementSummary from './CashMovementSummary';
import RevenueByBusinessLine from './RevenueByBusinessLine';
import ExpenseAnalysis from './ExpenseAnalysis';

export default function AnnualFinancialStatements() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Annual Financial Statements</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive annual report for the selected financial year</p>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Financial Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pnl" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="pnl">Income Statement</TabsTrigger>
          <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
          <TabsTrigger value="tb">Trial Balance</TabsTrigger>
          <TabsTrigger value="cash">Cash Movement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl"><ProfitAndLoss /></TabsContent>
        <TabsContent value="bs"><BalanceSheet /></TabsContent>
        <TabsContent value="tb"><TrialBalance /></TabsContent>
        <TabsContent value="cash"><CashMovementSummary /></TabsContent>
        <TabsContent value="revenue"><RevenueByBusinessLine /></TabsContent>
        <TabsContent value="expenses"><ExpenseAnalysis /></TabsContent>
      </Tabs>
    </div>
  );
}
