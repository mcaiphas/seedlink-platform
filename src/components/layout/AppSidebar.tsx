import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdmin } from '@/hooks/useAdmin';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard, ShoppingCart, FileText, CreditCard, AlertTriangle,
  Package, Building2, Receipt, FileSpreadsheet, PackageCheck,
  Warehouse, Boxes, MoveHorizontal, ClipboardList, ArrowLeftRight,
  Notebook, Scale, BarChart3, Users, Shield, Settings, Sprout,
  LogOut, Truck, Wallet, SlidersHorizontal,
  Layers, Ruler, Tags, FolderTree, FolderOpen, DollarSign,
  ChevronRight, Lock, Send, TrendingUp, TrendingDown,
  ShoppingBag, UserCheck, Megaphone, PieChart,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface NavLeaf {
  title: string;
  url: string;
  icon: any;
  adminOnly?: boolean;
}

interface NavBranch {
  title: string;
  icon: any;
  adminOnly?: boolean;
  children: NavLeaf[];
}

type NavEntry = NavLeaf | NavBranch;

interface NavSection {
  label: string;
  items: NavEntry[];
  adminOnly?: boolean;
}

function isBranch(e: NavEntry): e is NavBranch {
  return 'children' in e;
}

/* ------------------------------------------------------------------ */
/*  Navigation definition                                              */
/* ------------------------------------------------------------------ */
const sections: NavSection[] = [
  {
    label: 'Seedlink',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { title: 'Orders', url: '/orders', icon: ShoppingCart },
      { title: 'Customer Invoices', url: '/customer-invoices', icon: FileText },
      { title: 'Payments', url: '/payments', icon: CreditCard },
      { title: 'Abandoned Carts', url: '/abandoned-carts', icon: AlertTriangle },
      { title: 'Carts', url: '/carts', icon: ShoppingBag },
      { title: 'Credit Accounts', url: '/credit-accounts', icon: Wallet },
      { title: 'Delivery Logs', url: '/document-delivery-logs', icon: Send },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { title: 'Products', url: '/products', icon: Package },
      { title: 'Categories', url: '/categories', icon: Tags },
      { title: 'Subcategories', url: '/subcategories', icon: FolderTree },
      { title: 'Collections', url: '/collections', icon: FolderOpen },
      { title: 'Attributes', url: '/attributes', icon: SlidersHorizontal },
      { title: 'Variants', url: '/variants', icon: Layers },
      { title: 'Pack Sizes', url: '/pack-sizes', icon: Ruler },
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
      { title: 'Stock Movements', url: '/stock-movements', icon: MoveHorizontal },
      { title: 'Stock Adjustments', url: '/stock-adjustments', icon: ClipboardList },
      { title: 'Stock Transfers', url: '/stock-transfers', icon: ArrowLeftRight },
      { title: 'Depots', url: '/depots', icon: Warehouse },
      { title: 'Inventory Batches', url: '/inventory-batches', icon: Boxes },
    ],
  },
  {
    label: 'Logistics',
    items: [
      { title: 'Delivery Requests', url: '/delivery-requests', icon: Truck },
      { title: 'Delivery Status', url: '/delivery-status', icon: PackageCheck },
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
    label: 'Reports',
    items: [
      {
        title: 'Reports', icon: PieChart,
        children: [
          { title: 'Sales Analytics', url: '/reports/sales', icon: TrendingUp },
          { title: 'Inventory Snapshot', url: '/reports/inventory', icon: Boxes },
          { title: 'Finance Summary', url: '/reports/finance', icon: TrendingDown },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    adminOnly: true,
    items: [
      { title: 'Users', url: '/users', icon: Users },
      { title: 'Roles', url: '/roles', icon: Shield },
      { title: 'Permissions', url: '/permissions', icon: Lock },
      { title: 'Organizations', url: '/organizations', icon: Building2 },
      { title: 'Settings', url: '/settings', icon: Settings },
      { title: 'Payment Gateways', url: '/settings/payment-gateways', icon: DollarSign },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();
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
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const isActive = (url: string) =>
    url === '/' ? location.pathname === '/' : location.pathname === url || location.pathname.startsWith(url + '/');

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* ---- Brand ---- */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0 shadow-sm">
            <Sprout className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-sidebar-foreground leading-none">
                Seedlink
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 mt-0.5 font-medium">
                Commerce
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ---- Nav ---- */}
      <SidebarContent className="px-2 py-1">
        {visibleSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/35 font-semibold px-3 mb-0.5">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  if (isBranch(item)) {
                    const anyChildActive = item.children.some((c) => isActive(c.url));
                    return (
                      <Collapsible key={item.title} defaultOpen={anyChildActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="h-8 text-[13px] justify-between">
                              <span className="flex items-center gap-2">
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.title}</span>
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map((child) => (
                                <SidebarMenuSubItem key={child.url}>
                                  <SidebarMenuSubButton asChild isActive={isActive(child.url)}>
                                    <NavLink to={child.url} className="text-[12px]" activeClassName="text-sidebar-primary font-medium">
                                      <child.icon className="h-3.5 w-3.5 shrink-0" />
                                      <span>{child.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
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

      {/* ---- User footer ---- */}
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
              <p className="text-[11px] text-sidebar-foreground/45 truncate capitalize">
                {roleName?.replace(/_/g, ' ') || '—'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="text-sidebar-foreground/35 hover:text-sidebar-foreground transition-colors"
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
