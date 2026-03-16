import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdmin } from '@/hooks/useAdmin';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard, ShoppingCart, FileText, CreditCard, AlertTriangle,
  Package, Building2, Receipt, FileSpreadsheet, PackageCheck,
  Warehouse, Boxes, MoveHorizontal, ClipboardList, ArrowLeftRight,
  Notebook, Scale, BarChart3, Users, Shield, Settings, Sprout,
  LogOut, Truck, PackageSearch, Send, Wallet, SlidersHorizontal,
  Layers, Ruler, Tags, FolderTree, FolderOpen, DollarSign,
} from 'lucide-react';

interface NavItem {
  title: string;
  url: string;
  icon: any;
  adminOnly?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const sections: NavSection[] = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Overview', url: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { title: 'Orders', url: '/orders', icon: ShoppingCart },
      { title: 'Customer Invoices', url: '/customer-invoices', icon: FileText },
      { title: 'Abandoned Carts', url: '/abandoned-carts', icon: AlertTriangle },
      { title: 'Carts', url: '/carts', icon: ShoppingCart },
      { title: 'Payments', url: '/payments', icon: CreditCard },
      { title: 'Credit Accounts', url: '/credit-accounts', icon: Wallet },
      { title: 'Delivery Logs', url: '/document-delivery-logs', icon: Send },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { title: 'Suppliers', url: '/suppliers', icon: Building2 },
      { title: 'Purchase Orders', url: '/purchase-orders', icon: FileSpreadsheet },
      { title: 'Goods Receipts', url: '/goods-receipts', icon: PackageCheck },
      { title: 'Supplier Invoices', url: '/supplier-invoices', icon: Receipt },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { title: 'Products', url: '/products', icon: Package },
      { title: 'Categories', url: '/categories', icon: Tags },
      { title: 'Subcategories', url: '/subcategories', icon: FolderTree },
      { title: 'Collections', url: '/collections', icon: FolderOpen },
      { title: 'Attributes', url: '/attributes', icon: SlidersHorizontal },
      { title: 'Variants', url: '/variants', icon: Layers },
      { title: 'Pack Sizes', url: '/pack-sizes', icon: Ruler },
      { title: 'Stock Movements', url: '/stock-movements', icon: MoveHorizontal },
      { title: 'Stock Adjustments', url: '/stock-adjustments', icon: ClipboardList },
      { title: 'Stock Transfers', url: '/stock-transfers', icon: ArrowLeftRight },
      { title: 'Depots', url: '/depots', icon: Warehouse },
      { title: 'Inventory Batches', url: '/inventory-batches', icon: Boxes },
    ],
  },
  {
    label: 'Finance',
    adminOnly: true,
    items: [
      { title: 'Journal Entries', url: '/journal-entries', icon: Scale },
      { title: 'GL Accounts', url: '/gl-accounts', icon: Notebook },
      { title: 'Commerce Accounting', url: '/commerce-accounting', icon: BarChart3 },
    ],
  },
  {
    label: 'Administration',
    adminOnly: true,
    items: [
      { title: 'Users', url: '/users', icon: Users },
      { title: 'Roles', url: '/roles', icon: Shield },
      { title: 'Organizations', url: '/organizations', icon: Building2 },
      { title: 'Settings', url: '/settings', icon: Settings },
      { title: 'Payment Gateways', url: '/settings/payment-gateways', icon: DollarSign },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, roleName } = useUserRole();
  const { isAdmin } = useAdmin();

  const visibleSections = sections
    .filter((s) => !s.adminOnly || isAdmin)
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => !i.adminOnly || isAdmin),
    }))
    .filter((s) => s.items.length > 0);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Sprout className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-sidebar-foreground leading-none">
                Seedlink
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mt-0.5">
                Commerce
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        {visibleSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold px-3 mb-1">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = item.url === '/'
                    ? location.pathname === '/'
                    : location.pathname === item.url || location.pathname.startsWith(item.url + '/');
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="h-8 text-[13px]"
                      >
                        <NavLink
                          to={item.url}
                          end={item.url === '/'}
                          className="hover:bg-sidebar-accent/50"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate capitalize">
                {roleName?.replace(/_/g, ' ') || '—'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
