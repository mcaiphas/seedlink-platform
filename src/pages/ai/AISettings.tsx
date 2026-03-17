import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, Brain, Sprout, DollarSign, Truck, BookOpen } from 'lucide-react';

const assistants = [
  { key: 'general', label: 'General AI Assistant', desc: 'Full platform assistant', icon: Sprout },
  { key: 'agronomy', label: 'Agronomy Assistant', desc: 'Crop and soil advisory', icon: Brain },
  { key: 'operations', label: 'Operations Assistant', desc: 'Orders, logistics, inventory', icon: Truck },
  { key: 'finance', label: 'Finance Assistant', desc: 'Revenue, receivables, profitability', icon: DollarSign },
  { key: 'knowledge', label: 'Knowledge Assistant', desc: 'Training and learning support', icon: BookOpen },
];

export default function AISettings() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Settings" description="Configure Seedlink AI assistants and access controls" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> AI Assistants</CardTitle>
          <CardDescription>Enable or disable AI assistants for your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assistants.map((a) => (
            <div key={a.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <a.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="text-sm font-medium">{a.label}</Label>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Access</CardTitle>
          <CardDescription>AI assistants respect your role-based access controls and RLS policies. No data leaks across users.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All AI queries are processed through secure edge functions. Conversation history is stored per-user and not shared across accounts. The AI cannot modify data without explicit user confirmation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
