import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdmin } from '@/hooks/useAdmin';
import { usePermissions } from '@/hooks/usePermission';
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
  ShoppingBag, PieChart, CheckCircle, Activity, FilePlus2, Link2,
  BookOpen, FileDown, Banknote, ShieldAlert, RotateCcw, MessageSquare, Bell, User,
  Landmark, ArrowDownUp, Upload, PieChart as PieChartIcon,
  Zap, MapPin, Mountain, Tractor, History, Beaker, Gauge, Brain,
  GraduationCap, HeadphonesIcon, TicketIcon, Award, Briefcase,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface NavLeaf {
  title: string;
  url: string;
  icon: any;
  adminOnly?: boolean;
  permission?: string;
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
    label: 'Executive Intelligence',
    adminOnly: true,
    items: [
      { title: 'Management Cockpit', url: '/executive', icon: Gauge, permission: 'executive:view' },
      { title: 'Sales Performance', url: '/executive/sales-performance', icon: TrendingUp, permission: 'executive:view' },
      { title: 'Product Performance', url: '/executive/product-performance', icon: Package, permission: 'executive:view' },
      { title: 'Customer Intelligence', url: '/executive/customer-intelligence', icon: Users, permission: 'executive:view' },
      { title: 'Supplier Intelligence', url: '/executive/supplier-intelligence', icon: Building2, permission: 'executive:view' },
      { title: 'Logistics Intelligence', url: '/executive/logistics-intelligence', icon: Truck, permission: 'executive:view' },
      { title: 'Financial Performance', url: '/executive/financial-performance', icon: DollarSign, permission: 'executive:financial' },
      { title: 'Strategic Reports', url: '/executive/strategic-reports', icon: Brain, permission: 'executive:view' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { title: 'Customers', url: '/customers', icon: Users, permission: 'orders:view' },
      { title: 'Quotes', url: '/quotes', icon: FilePlus2, permission: 'orders:view' },
      { title: 'Proforma Invoices', url: '/proforma-invoices', icon: FileText, permission: 'orders:view' },
      { title: 'Orders', url: '/orders', icon: ShoppingCart, permission: 'orders:view' },
      { title: 'Customer Invoices', url: '/customer-invoices', icon: Receipt, permission: 'orders:view' },
      { title: 'Payments', url: '/payments', icon: CreditCard, permission: 'payments:view' },
      { title: 'Payment Requests', url: '/payment-requests', icon: Link2, permission: 'payments:view' },
      { title: 'Credit Accounts', url: '/credit-accounts', icon: Wallet, permission: 'payments:view' },
      { title: 'Abandoned Carts', url: '/abandoned-carts', icon: AlertTriangle },
      { title: 'Carts', url: '/carts', icon: ShoppingBag },
      { title: 'Delivery Logs', url: '/document-delivery-logs', icon: Send },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { title: 'Products', url: '/products', icon: Package, permission: 'products:view' },
      { title: 'Categories', url: '/categories', icon: Tags, permission: 'categories:view' },
      { title: 'Subcategories', url: '/subcategories', icon: FolderTree, permission: 'categories:view' },
      { title: 'Collections', url: '/collections', icon: FolderOpen, permission: 'collections:view' },
      { title: 'Attributes', url: '/attributes', icon: SlidersHorizontal },
      { title: 'Variants', url: '/variants', icon: Layers },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { title: 'Dashboard', url: '/procurement', icon: BarChart3 },
      { title: 'Suppliers', url: '/suppliers', icon: Building2 },
      { title: 'Purchase Orders', url: '/purchase-orders', icon: FileSpreadsheet },
      { title: 'Goods Receipts', url: '/goods-receipts', icon: PackageCheck },
      { title: 'Supplier Invoices', url: '/supplier-invoices', icon: Receipt },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { title: 'Stock Overview', url: '/stock-overview', icon: Boxes, permission: 'inventory:view' },
      { title: 'Depots', url: '/depots', icon: Warehouse, permission: 'inventory:view' },
      { title: 'Pack Sizes', url: '/pack-sizes', icon: Ruler, permission: 'inventory:view' },
      { title: 'Goods Receiving', url: '/goods-receiving', icon: PackageCheck, permission: 'inventory:view' },
      { title: 'Stock Movements', url: '/stock-movements', icon: MoveHorizontal, permission: 'inventory:view' },
      { title: 'Stock Adjustments', url: '/stock-adjustments', icon: ClipboardList, permission: 'inventory:view' },
      { title: 'Stock Transfers', url: '/stock-transfers', icon: ArrowLeftRight, permission: 'inventory:view' },
      { title: 'Stock Counts', url: '/stock-counts', icon: ClipboardList, permission: 'inventory:view' },
    ],
  },
  {
    label: 'Logistics',
    items: [
      { title: 'Dashboard', url: '/logistics', icon: LayoutDashboard, permission: 'logistics:view' },
      { title: 'Delivery Requests', url: '/logistics/deliveries', icon: Truck, permission: 'logistics:view' },
      { title: 'Delivery Planning', url: '/logistics/planning', icon: ClipboardList, permission: 'logistics:view' },
      { title: 'Vehicle Matching', url: '/logistics/vehicle-matching', icon: Truck, permission: 'logistics:view' },
      { title: 'Dispatch Board', url: '/logistics/dispatch', icon: Send, permission: 'logistics:view' },
      { title: 'In Progress', url: '/logistics/in-progress', icon: Activity, permission: 'logistics:view' },
      { title: 'Completed', url: '/logistics/completed', icon: CheckCircle, permission: 'logistics:view' },
      { title: 'Reports', url: '/logistics/reports', icon: BarChart3, permission: 'logistics:view' },
    ],
  },
  {
    label: 'Agronomy Intelligence',
    items: [
      { title: 'Agronomy Dashboard', url: '/agronomy', icon: Sprout },
      { title: 'Recommendation Engine', url: '/agronomy/recommend', icon: Zap },
      {
        title: 'Intelligence', icon: Beaker,
        children: [
          { title: 'Region Profiles', url: '/agronomy/regions', icon: MapPin },
          { title: 'Soil Profiles', url: '/agronomy/soils', icon: Mountain },
          { title: 'Farming Systems', url: '/agronomy/farming-systems', icon: Tractor },
          { title: 'Advisory Rules', url: '/agronomy/advisory-rules', icon: BookOpen },
          { title: 'Solution Bundles', url: '/agronomy/bundles', icon: Package },
          { title: 'History', url: '/agronomy/history', icon: History },
        ],
      },
    ],
  },
  {
    label: 'Training & Advisory',
    items: [
      { title: 'Dashboard', url: '/training', icon: GraduationCap, permission: 'training:view' },
      { title: 'Courses', url: '/courses', icon: BookOpen, permission: 'training:view' },
      { title: 'Programs', url: '/training-programs', icon: Briefcase, permission: 'training:view' },
      { title: 'Learners', url: '/learners', icon: Users, permission: 'training:learners' },
      { title: 'Enrollments', url: '/enrollments', icon: Users, permission: 'training:learners' },
      { title: 'Certificates', url: '/certificates', icon: Award, permission: 'training:view' },
      { title: 'Advisory Services', url: '/advisory-services', icon: HeadphonesIcon, permission: 'advisory:view' },
      { title: 'Advisory Sessions', url: '/advisory-sessions', icon: HeadphonesIcon, permission: 'advisory:view' },
      { title: 'Support Tickets', url: '/support-tickets', icon: TicketIcon, permission: 'support:view' },
      { title: 'Knowledge Base', url: '/advisor/knowledge', icon: BookOpen, permission: 'training:view' },
      { title: 'Subscription Plans', url: '/subscription-plans', icon: CreditCard, permission: 'training:manage' },
    ],
  },
  {
    label: 'Farm Planning',
    items: [
      { title: 'Planning Dashboard', url: '/planning', icon: LayoutDashboard },
      { title: 'Farms', url: '/farms', icon: Tractor },
      { title: 'Fields', url: '/fields', icon: MapPin },
      { title: 'Seasons', url: '/planning/seasons', icon: Activity },
      { title: 'Crop Plans', url: '/planning/crop-plans', icon: Sprout },
      { title: 'Input Budgets', url: '/planning/input-budgets', icon: DollarSign },
    ],
  },
  {
    label: 'Finance',
    adminOnly: true,
    items: [
      { title: 'Finance Dashboard', url: '/finance-dashboard', icon: PieChart },
      { title: 'Credit Control', url: '/credit-control', icon: ShieldAlert },
      { title: 'Debtors (AR)', url: '/debtors', icon: TrendingUp },
      { title: 'Creditors (AP)', url: '/creditors', icon: TrendingDown },
      { title: 'Customer Aging', url: '/customer-aging', icon: BarChart3 },
      { title: 'Supplier Aging', url: '/supplier-aging', icon: BarChart3 },
      { title: 'Customer Credit Notes', url: '/customer-credit-notes', icon: FileDown },
      { title: 'Supplier Credit Notes', url: '/supplier-credit-notes', icon: FileDown },
      { title: 'Refunds', url: '/refunds', icon: RotateCcw },
      { title: 'Supplier Payments', url: '/supplier-payments', icon: Banknote },
      { title: 'Customer Statements', url: '/customer-statements', icon: BookOpen },
      { title: 'Supplier Statements', url: '/supplier-statements', icon: BookOpen },
      { title: 'Communication Logs', url: '/communication-logs', icon: MessageSquare },
      { title: 'Notification Templates', url: '/notification-templates', icon: Bell },
      { title: 'Operations Finance', url: '/reports/operations-finance', icon: Activity },
      { title: 'Inventory Valuation', url: '/reports/valuation', icon: DollarSign },
      { title: 'Commerce Accounting', url: '/commerce-accounting', icon: BarChart3 },
    ],
  },
  {
    label: 'Accounting',
    adminOnly: true,
    items: [
      { title: 'Chart of Accounts', url: '/gl-accounts', icon: Notebook },
      { title: 'Accounting Periods', url: '/accounting-periods', icon: Activity },
      { title: 'Posting Rules', url: '/posting-rules', icon: SlidersHorizontal },
      { title: 'Manual Journals', url: '/manual-journals', icon: Scale },
      { title: 'Journal Entries', url: '/journal-entries', icon: Scale },
      { title: 'Journal Listing', url: '/journal-listing', icon: FileText },
      { title: 'General Ledger', url: '/general-ledger-report', icon: Notebook },
      { title: 'Trial Balance', url: '/trial-balance', icon: Scale },
      { title: 'Profit & Loss', url: '/profit-and-loss', icon: TrendingUp },
      { title: 'Balance Sheet', url: '/balance-sheet', icon: DollarSign },
      { title: 'Account Activity', url: '/account-activity', icon: Activity },
      { title: 'Cash Movement', url: '/cash-movement', icon: ArrowDownUp },
      { title: 'Revenue by Line', url: '/revenue-by-business-line', icon: BarChart3 },
      { title: 'Expense Analysis', url: '/expense-analysis', icon: PieChart },
      { title: 'Annual Statements', url: '/annual-financial-statements', icon: FileSpreadsheet },
    ],
  },
  {
    label: 'VAT & Tax',
    adminOnly: true,
    items: [
      { title: 'VAT Codes', url: '/vat-codes', icon: Tags },
      { title: 'VAT Transactions', url: '/vat-transactions', icon: Receipt },
      { title: 'VAT Control', url: '/vat-control', icon: CheckCircle },
      { title: 'VAT201 Report', url: '/vat201-report', icon: FileDown },
    ],
  },
  {
    label: 'Banking',
    adminOnly: true,
    items: [
      { title: 'Reconciliation', url: '/bank-reconciliation', icon: CheckCircle },
      { title: 'Transaction Review', url: '/transaction-review', icon: ClipboardList },
      { title: 'Bank Accounts', url: '/bank-accounts', icon: Landmark },
      { title: 'Transactions', url: '/bank-transactions', icon: ArrowDownUp },
      { title: 'Statement Import', url: '/bank-statement-import', icon: Upload },
    ],
  },
  {
    label: 'Customer Portal',
    items: [
      { title: 'Portal Dashboard', url: '/portal', icon: User },
      { title: 'My Invoices', url: '/portal/invoices', icon: Receipt },
      { title: 'My Quotes', url: '/portal/quotes', icon: FileText },
      { title: 'My Statement', url: '/portal/statements', icon: BookOpen },
    ],
  },
  {
    label: 'Approvals',
    adminOnly: true,
    items: [
      { title: 'Approval Center', url: '/approvals', icon: CheckCircle },
    ],
  },
  {
    label: 'Reports',
    items: [
      {
        title: 'Reports', icon: PieChart,
        children: [
          { title: 'Executive Dashboard', url: '/reports/executive', icon: LayoutDashboard, permission: 'reports:view' },
          { title: 'Sales Analytics', url: '/reports/sales', icon: TrendingUp, permission: 'reports:view' },
          { title: 'Inventory Snapshot', url: '/reports/inventory', icon: Boxes, permission: 'reports:view' },
          { title: 'Slow-Moving Stock', url: '/reports/slow-moving', icon: AlertTriangle, permission: 'reports:view' },
          { title: 'Finance Summary', url: '/reports/finance', icon: TrendingDown, permission: 'reports:view' },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    adminOnly: true,
    items: [
      { title: 'Users', url: '/users', icon: Users, permission: 'users:view' },
      { title: 'Roles', url: '/roles', icon: Shield, permission: 'roles:view' },
      { title: 'Permissions', url: '/permissions', icon: Lock, permission: 'permissions:view' },
      { title: 'Organizations', url: '/organizations', icon: Building2 },
      { title: 'Settings', url: '/settings', icon: Settings, permission: 'settings:view' },
      { title: 'Payment Gateways', url: '/settings/payment-gateways', icon: DollarSign },
      { title: 'Backend Diagnostics', url: '/settings/diagnostics', icon: Settings, permission: 'settings:view' },
    ],
  },
];

// Collect all permission codes used in sidebar for batch loading
const allPermCodes: string[] = [];
sections.forEach((s) =>
  s.items.forEach((item) => {
    if (isBranch(item)) {
      item.children.forEach((c) => { if (c.permission) allPermCodes.push(c.permission); });
    } else if (item.permission) {
      allPermCodes.push(item.permission);
    }
  })
);
const uniquePermCodes = [...new Set(allPermCodes)];

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
  const { perms, loading: permsLoading } = usePermissions(uniquePermCodes);

  const canAccess = (entry: NavLeaf): boolean => {
    if (entry.adminOnly && !isAdmin) return false;
    // Admins bypass permission checks
    if (isAdmin) return true;
    // If no permission specified, visible to all authenticated
    if (!entry.permission) return true;
    // Check loaded permission
    return perms[entry.permission] ?? false;
  };

  const visibleSections = sections
    .filter((s) => !s.adminOnly || isAdmin)
    .map((s) => ({
      ...s,
      items: s.items
        .map((item) => {
          if (isBranch(item)) {
            const visibleChildren = item.children.filter(canAccess);
            if (visibleChildren.length === 0) return null;
            return { ...item, children: visibleChildren };
          }
          return canAccess(item) ? item : null;
        })
        .filter(Boolean) as NavEntry[],
    }))
    .filter((s) => s.items.length > 0);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const isActivePath = (url: string) =>
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
                    const anyChildActive = item.children.some((c) => isActivePath(c.url));
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
                                  <SidebarMenuSubButton asChild isActive={isActivePath(child.url)}>
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
                        isActive={isActivePath(item.url)}
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
