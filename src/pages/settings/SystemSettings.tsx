import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { DataPageShell } from '@/components/DataPageShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Store, Package, DollarSign, CreditCard, Truck, Bell, Shield, Users, Plug, Palette, ClipboardList } from 'lucide-react';
import { GeneralSettingsTab } from '@/components/settings/tabs/GeneralSettingsTab';
import { StoreSettingsTab } from '@/components/settings/tabs/StoreSettingsTab';
import { InventorySettingsTab } from '@/components/settings/tabs/InventorySettingsTab';
import { PricingSettingsTab } from '@/components/settings/tabs/PricingSettingsTab';
import { PaymentSettingsTab } from '@/components/settings/tabs/PaymentSettingsTab';
import { LogisticsSettingsTab } from '@/components/settings/tabs/LogisticsSettingsTab';
import { NotificationSettingsTab } from '@/components/settings/tabs/NotificationSettingsTab';
import { SecuritySettingsTab } from '@/components/settings/tabs/SecuritySettingsTab';
import { UserAccessSettingsTab } from '@/components/settings/tabs/UserAccessSettingsTab';
import { IntegrationSettingsTab } from '@/components/settings/tabs/IntegrationSettingsTab';
import { BrandingSettingsTab } from '@/components/settings/tabs/BrandingSettingsTab';
import { AuditSettingsTab } from '@/components/settings/tabs/AuditSettingsTab';

const TABS = [
  { value: 'general', label: 'General', icon: Building2 },
  { value: 'store', label: 'Store', icon: Store },
  { value: 'inventory', label: 'Inventory', icon: Package },
  { value: 'pricing', label: 'Pricing', icon: DollarSign },
  { value: 'payment', label: 'Payment', icon: CreditCard },
  { value: 'logistics', label: 'Logistics', icon: Truck },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'user_access', label: 'User Access', icon: Users },
  { value: 'integrations', label: 'Integrations', icon: Plug },
  { value: 'branding', label: 'Branding', icon: Palette },
  { value: 'audit', label: 'Audit & Compliance', icon: ClipboardList },
] as const;

export default function SystemSettings() {
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (adminLoading) return <DataPageShell title="Settings" loading={true}><div /></DataPageShell>;

  if (!isAdmin) {
    return (
      <DataPageShell title="Settings" loading={false}>
        <AccessRestricted variant="admin" title="Admin Access Required" message="Only administrators can manage system settings." />
      </DataPageShell>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform behaviour, branding, integrations, and security policies.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0 mb-6">
            {TABS.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-3 py-2 text-sm gap-1.5 border border-transparent data-[state=active]:border-primary/20"
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="general"><GeneralSettingsTab /></TabsContent>
        <TabsContent value="store"><StoreSettingsTab /></TabsContent>
        <TabsContent value="inventory"><InventorySettingsTab /></TabsContent>
        <TabsContent value="pricing"><PricingSettingsTab /></TabsContent>
        <TabsContent value="payment"><PaymentSettingsTab /></TabsContent>
        <TabsContent value="logistics"><LogisticsSettingsTab /></TabsContent>
        <TabsContent value="notifications"><NotificationSettingsTab /></TabsContent>
        <TabsContent value="security"><SecuritySettingsTab /></TabsContent>
        <TabsContent value="user_access"><UserAccessSettingsTab /></TabsContent>
        <TabsContent value="integrations"><IntegrationSettingsTab /></TabsContent>
        <TabsContent value="branding"><BrandingSettingsTab /></TabsContent>
        <TabsContent value="audit"><AuditSettingsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
