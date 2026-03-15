import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

const ROLE_ROUTES: Record<string, string> = {
  super_admin: "/admin",
  admin: "/admin",
  farmer: "/farmer",
  supplier: "/supplier",
  buyer: "/buyer",
  trainer: "/trainer",
  logistics_partner: "/logistics",
};

export default function DashboardRouter() {
  const { roleName, loading, hasRole } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasRole) {
    return <Navigate to="/onboarding" replace />;
  }

  const route = ROLE_ROUTES[roleName || ""] || "/farmer";
  return <Navigate to={route} replace />;
}
