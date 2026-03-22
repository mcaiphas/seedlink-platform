import { Bell, LogOut, Search, User, ChevronRight, Plus, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

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
  '/permissions': 'Permissions',
  '/organizations': 'Organizations',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
  '/delivery-requests': 'Delivery Requests',
  '/delivery-status': 'Delivery Status',
  '/reports/sales': 'Sales Analytics',
  '/reports/inventory': 'Inventory Snapshot',
  '/reports/finance': 'Finance Summary',
};

const QUICK_ACTIONS = [
  { label: 'New Order', url: '/orders', icon: Plus },
  { label: 'New Product', url: '/products/new', icon: Plus },
  { label: 'New Purchase Order', url: '/purchase-orders/new', icon: Plus },
  { label: 'New Supplier', url: '/suppliers', icon: Plus },
];

export function AppHeader() {
  const { user, signOut } = useAuth();
  const { profile } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const email = profile?.email || user?.email || '';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // Breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentLabel = BREADCRUMB_MAP[location.pathname] ||
    BREADCRUMB_MAP['/' + pathSegments[0]] ||
    pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Dashboard';

  // Parent breadcrumb for nested routes
  const parentPath = pathSegments.length > 1 ? '/' + pathSegments[0] : null;
  const parentLabel = parentPath ? BREADCRUMB_MAP[parentPath] : null;

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left: trigger + breadcrumbs */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <nav className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground font-medium">Seedlink</span>
          {parentLabel && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              <button
                onClick={() => navigate(parentPath!)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {parentLabel}
              </button>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          <span className="font-medium text-foreground capitalize">{currentLabel}</span>
        </nav>
      </div>

      {/* Right: search + actions + notifications + profile */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              ref={searchRef}
              placeholder="Search…"
              className="h-8 w-56 pl-8 text-sm bg-muted/50 border-border"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:text-foreground text-xs"
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        )}

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Zap className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {QUICK_ACTIONS.map((a) => (
              <DropdownMenuItem key={a.label} onClick={() => navigate(a.url)}>
                <a.icon className="mr-2 h-3.5 w-3.5" /> {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Profile */}
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
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
              <User className="mr-2 h-4 w-4" /> Profile
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
