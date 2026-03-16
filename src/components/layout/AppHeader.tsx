import { Bell, LogOut, Search, User, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/customer-invoices': 'Customer Invoices',
  '/abandoned-carts': 'Abandoned Carts',
  '/carts': 'Carts',
  '/payments': 'Payments',
  '/credit-accounts': 'Credit Accounts',
  '/document-delivery-logs': 'Delivery Logs',
  '/suppliers': 'Suppliers',
  '/purchase-orders': 'Purchase Orders',
  '/goods-receipts': 'Goods Receipts',
  '/supplier-invoices': 'Supplier Invoices',
  '/products': 'Products',
  '/categories': 'Categories',
  '/subcategories': 'Subcategories',
  '/collections': 'Collections',
  '/attributes': 'Attributes',
  '/variants': 'Variants',
  '/pack-sizes': 'Pack Sizes',
  '/stock-movements': 'Stock Movements',
  '/stock-adjustments': 'Stock Adjustments',
  '/stock-transfers': 'Stock Transfers',
  '/depots': 'Depots',
  '/inventory-batches': 'Inventory Batches',
  '/journal-entries': 'Journal Entries',
  '/gl-accounts': 'GL Accounts',
  '/commerce-accounting': 'Commerce Accounting',
  '/users': 'Users',
  '/roles': 'Roles',
  '/organizations': 'Organizations',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
};

export function AppHeader() {
  const { user, signOut } = useAuth();
  const { profile } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const email = profile?.email || user?.email || '';
  const initials = displayName.slice(0, 2).toUpperCase();

  // Build breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentLabel = BREADCRUMB_MAP[location.pathname] ||
    BREADCRUMB_MAP['/' + pathSegments[0]] ||
    pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <nav className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground">Seedlink</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="font-medium text-foreground capitalize">{currentLabel}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
              <User className="mr-2 h-4 w-4" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
