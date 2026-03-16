import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from '@/components/AccessRestricted';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminRouteProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminRoute({ children, title = 'This Page' }: AdminRouteProps) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Access restricted</p>
        </div>
        <AccessRestricted
          variant="admin"
          title="Admin Access Required"
          message="You don't have permission to access this area. Contact your administrator."
        />
      </div>
    );
  }

  return <>{children}</>;
}
