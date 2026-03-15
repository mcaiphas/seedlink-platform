import {
  LayoutDashboard, Tractor, Store, ShoppingCart, GraduationCap, Truck,
  Settings, LogOut, Sprout, Users, BarChart3, ShieldCheck, Package, BookOpen,
  Bot, MapPin,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ROLE_NAV: Record<string, { title: string; url: string; icon: any }[]> = {
  super_admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Roles", url: "/admin/roles", icon: ShieldCheck },
  ],
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  ],
  farmer: [
    { title: "Dashboard", url: "/farmer", icon: LayoutDashboard },
    { title: "My Farms", url: "/farmer/farms", icon: MapPin },
    { title: "Crops", url: "/farmer/crops", icon: Tractor },
    { title: "Marketplace", url: "/farmer/marketplace", icon: Store },
    { title: "Learning", url: "/farmer/learning", icon: BookOpen },
    { title: "AI Advisor", url: "/farmer/advisor", icon: Bot },
  ],
  supplier: [
    { title: "Dashboard", url: "/supplier", icon: LayoutDashboard },
    { title: "Products", url: "/supplier/products", icon: Package },
    { title: "Orders", url: "/supplier/orders", icon: ShoppingCart },
  ],
  buyer: [
    { title: "Dashboard", url: "/buyer", icon: LayoutDashboard },
    { title: "Browse", url: "/buyer/browse", icon: Store },
    { title: "Orders", url: "/buyer/orders", icon: ShoppingCart },
  ],
  trainer: [
    { title: "Dashboard", url: "/trainer", icon: LayoutDashboard },
    { title: "Courses", url: "/trainer/courses", icon: GraduationCap },
    { title: "Students", url: "/trainer/students", icon: Users },
  ],
  logistics_partner: [
    { title: "Dashboard", url: "/logistics", icon: LayoutDashboard },
    { title: "Deliveries", url: "/logistics/deliveries", icon: Truck },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { roleName, profile } = useUserRole();

  const navItems = ROLE_NAV[roleName || "farmer"] || ROLE_NAV.farmer;
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Sprout className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-display font-bold text-sidebar-foreground">
              Seedlink
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/settings"}>
                  <NavLink to="/settings" className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <Settings className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">
                {roleName?.replace("_", " ") || "—"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button onClick={signOut} className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
