import { useAdmin } from '@/hooks/useAdmin';
import { AccessRestricted } from './AccessRestricted';
import { Leaf } from 'lucide-react';
import { ReactNode } from 'react';

export function AdminPage({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Leaf className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AccessRestricted
        variant="admin"
        title="Admin Access Required"
        message="You need administrator privileges to view this page. Contact your organization admin for access."
      />
    );
  }

  return <>{children}</>;
}
