import { Outlet, Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Loader2, Bell, Sprout, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  const { loading, hasRole, error, refetch } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Sprout className="h-7 w-7 text-primary-foreground" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!hasRole) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
