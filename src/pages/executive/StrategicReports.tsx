import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, Users, Building2, Package, Truck, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reports = [
  { title: "Annual Business Performance", description: "Comprehensive yearly revenue, margins, and growth analysis", icon: TrendingUp, url: "/annual-financial-statements" },
  { title: "Revenue by Region", description: "Geographic distribution of sales revenue", icon: BarChart3, url: "/reports/sales" },
  { title: "Product Category Profitability", description: "Margin analysis across product categories", icon: Package, url: "/executive/product-performance" },
  { title: "Customer Segment Performance", description: "Revenue and order patterns by customer type", icon: Users, url: "/executive/customer-intelligence" },
  { title: "Supplier Dependency Report", description: "Procurement concentration and risk analysis", icon: Building2, url: "/executive/supplier-intelligence" },
  { title: "Logistics Cost Analysis", description: "Delivery cost trends and vehicle utilization", icon: Truck, url: "/executive/logistics-intelligence" },
  { title: "Financial Summary", description: "P&L, Balance Sheet, and cash position overview", icon: DollarSign, url: "/executive/financial-performance" },
  { title: "Business Line Revenue", description: "Performance across Inputs, Advisory, Training, Logistics", icon: BarChart3, url: "/revenue-by-business-line" },
];

export default function StrategicReports() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Strategic Reports" description="Executive-level analysis and exportable reports" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <Card key={r.title} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate(r.url)}>
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <r.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-semibold">{r.title}</CardTitle>
                <CardDescription className="text-xs mt-1">{r.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
