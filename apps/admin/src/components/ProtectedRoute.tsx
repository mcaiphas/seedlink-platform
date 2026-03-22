import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Leaf } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <Leaf className="h-10 w-10 text-primary animate-pulse" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
