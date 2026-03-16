import {
  LayoutDashboard, Package, Tags, FolderOpen, ShoppingCart,
  GraduationCap, BookOpen, FileText, Users, Tractor, MapPin,
  Sprout, Wheat, FlaskConical, Lightbulb, Truck, Bell, Settings, Leaf,
  MessageSquare, Database, MessagesSquare, Shield, Warehouse, Box,
  ArrowLeftRight, ClipboardList, PackageCheck, Layers, Grid3X3,
  Building2, Receipt, FileSpreadsheet, Award, CreditCard, DollarSign,
  Boxes, MoveHorizontal, ListChecks, PackageSearch,
  Beaker, Calculator, Bug, Calendar, TrendingUp, Droplets,
  Wrench, Brain, Library, Ruler, SlidersHorizontal,
  FolderTree, Scale, Notebook, BarChart3,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';

interface NavItem {
  title: string;
  url: string;
  icon: any;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { title: 'Products', url: '/products', icon: Package },
      { title: 'Categories', url: '/categories', icon: Tags },
      { title: 'Subcategories', url: '/subcategories', icon: FolderTree },
      { title: 'Collections', url: '/collections', icon: FolderOpen },
      { title: 'Attributes', url: '/attributes', icon: SlidersHorizontal },
      { title: 'Variants', url: '/variants', icon: Layers },
      { title: 'Pack Sizes', url: '/pack-sizes', icon: Ruler },
      { title: 'Orders', url: '/orders', icon: ShoppingCart },
      { title: 'Customer Invoices', url: '/customer-invoices', icon: Receipt },
      { title: 'Suppliers', url: '/suppliers', icon: Building2 },
      { title: 'Purchase Orders', url: '/purchase-orders', icon: FileSpreadsheet },
      { title: 'Goods Receipts', url: '/goods-receipts', icon: PackageCheck },
      { title: 'Supplier Invoices', url: '/supplier-invoices', icon: Receipt },
      { title: 'Import Jobs', url: '/import-jobs', icon: FileSpreadsheet },
    ],
  },
  {
    label: 'Finance',
    adminOnly: true,
    items: [
      { title: 'Commerce Accounting', url: '/commerce-accounting', icon: DollarSign },
    ],
  },
  {
    label: 'Inventory & Warehousing',
    adminOnly: true,
    items: [
      { title: 'Depots', url: '/depots', icon: Warehouse },
      { title: 'Zones', url: '/depot-zones', icon: Grid3X3 },
      { title: 'Storage Bins', url: '/storage-bins', icon: Box },
      { title: 'Inventory Batches', url: '/inventory-batches', icon: Boxes },
      { title: 'Stock Movements', url: '/stock-movements', icon: MoveHorizontal },
      { title: 'Stock Transfers', url: '/stock-transfers', icon: ArrowLeftRight },
      { title: 'Pick Waves', url: '/pick-waves', icon: ListChecks },
      { title: 'Pick Tasks', url: '/pick-tasks', icon: ClipboardList },
      { title: 'Fulfillment Batches', url: '/fulfillment-batches', icon: PackageCheck },
      { title: 'Shipment Packages', url: '/shipment-packages', icon: PackageSearch },
    ],
  },
  {
    label: 'Training',
    items: [
      { title: 'Courses', url: '/courses', icon: GraduationCap },
      { title: 'Course Categories', url: '/course-categories', icon: Tags },
      { title: 'Modules', url: '/modules', icon: BookOpen },
      { title: 'Lessons', url: '/lessons', icon: FileText },
      { title: 'Enrollments', url: '/enrollments', icon: Users },
      { title: 'Certificates', url: '/certificates', icon: Award },
      { title: 'Subscription Plans', url: '/subscription-plans', icon: CreditCard },
    ],
  },
  {
    label: 'Farm Management',
    items: [
      { title: 'Farms', url: '/farms', icon: Tractor },
      { title: 'Fields', url: '/fields', icon: MapPin },
      { title: 'Planting Records', url: '/planting-records', icon: Sprout },
      { title: 'Harvest Records', url: '/harvest-records', icon: Wheat },
      { title: 'Soil Tests', url: '/soil-tests', icon: FlaskConical },
      { title: 'Crop Recommendations', url: '/crop-recommendations', icon: Lightbulb },
      { title: 'Farm Activities', url: '/farm-activities', icon: ClipboardList },
    ],
  },
  {
    label: 'Seedlink Advisor',
    items: [
      { title: 'AI Chat', url: '/advisor/chat', icon: MessageSquare },
      { title: 'Knowledge Base', url: '/advisor/knowledge', icon: Database },
      { title: 'Conversations', url: '/advisor/conversations', icon: MessagesSquare },
      { title: 'Advisor Profiles', url: '/advisor/profiles', icon: Brain, adminOnly: true },
      { title: 'Knowledge Sources', url: '/advisor/sources', icon: Library, adminOnly: true },
      { title: 'Knowledge Documents', url: '/advisor/documents', icon: FileText, adminOnly: true },
    ],
  },
  {
    label: 'Agronomy Tools',
    items: [
      { title: 'Tool Dashboard', url: '/agronomy', icon: Wrench },
      { title: 'Fertiliser Planner', url: '/agronomy/fertiliser', icon: Beaker },
      { title: 'Lime Calculator', url: '/agronomy/lime', icon: Calculator },
      { title: 'Spray Programs', url: '/agronomy/spray', icon: Bug },
      { title: 'Crop Calendar', url: '/agronomy/calendar', icon: Calendar },
      { title: 'Yield Estimator', url: '/agronomy/yield', icon: TrendingUp },
      { title: 'Irrigation Planner', url: '/agronomy/irrigation', icon: Droplets },
    ],
  },
  {
    label: 'Logistics',
    items: [
      { title: 'Delivery Requests', url: '/delivery-requests', icon: Truck },
      { title: 'Delivery Status', url: '/delivery-status', icon: PackageSearch },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Notifications', url: '/notifications', icon: Bell },
      { title: 'Settings', url: '/settings', icon: Settings },
      { title: 'Users', url: '/users', icon: Users, adminOnly: true },
      { title: 'Roles', url: '/roles', icon: Shield, adminOnly: true },
      { title: 'Organizations', url: '/organizations', icon: Building2, adminOnly: true },
      { title: 'Payment Gateways', url: '/settings/payment-gateways', icon: CreditCard, adminOnly: true },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const visibleGroups = navGroups
    .filter(g => !g.adminOnly || isAdmin)
    .map(g => ({
      ...g,
      items: g.items.filter(item => !item.adminOnly || isAdmin),
    }))
    .filter(g => g.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-sidebar-primary shrink-0" />
          {!collapsed && <span className="text-lg font-bold text-sidebar-foreground">Seedlink</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url))}>
                      <NavLink to={item.url} end={item.url === '/'}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
