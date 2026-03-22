import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

const ROLE_ROUTES: Record<string, string> = {
  super_admin: "/",
  admin: "/",
  farmer: "/farms",
  supplier: "/products",
  buyer: "/orders",
  trainer: "/courses",
  logistics_partner: "/delivery-requests",
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

  // super_admin and admin go to Dashboard (/ which renders Dashboard component)
  // Other roles go to their primary module
  const route = ROLE_ROUTES[roleName || ""] || "/farms";
  return <Navigate to={route} replace />;
}
