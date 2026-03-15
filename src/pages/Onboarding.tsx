import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sprout, Tractor, Store, ShoppingCart, GraduationCap, Truck, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Navigate } from "react-router-dom";

const ROLES = [
  { name: "farmer", label: "Farmer", description: "Manage farms, crops, and sell produce", icon: Tractor },
  { name: "supplier", label: "Supplier", description: "Supply products and manage inventory", icon: Store },
  { name: "buyer", label: "Buyer", description: "Browse and purchase agricultural products", icon: ShoppingCart },
  { name: "trainer", label: "Trainer", description: "Create courses and train farmers", icon: GraduationCap },
  { name: "logistics_partner", label: "Logistics Partner", description: "Handle deliveries and logistics", icon: Truck },
];

export default function Onboarding() {
  const { user } = useAuth();
  const { hasRole, loading: roleLoading } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // If user already has a role, redirect to dashboard
  if (!roleLoading && hasRole) {
    return <Navigate to="/" replace />;
  }

  const handleComplete = async () => {
    if (!selectedRole || !user) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure profile exists (trigger should have created it, but be safe)
      const { data: existingProfile, error: profileFetchErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileFetchErr) {
        setError("Failed to check profile. Please try again.");
        setLoading(false);
        return;
      }

      if (!existingProfile) {
        const { error: insertErr } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          role: selectedRole,
        });
        if (insertErr) {
          console.error("Profile insert error:", insertErr);
          setError("Failed to create profile: " + insertErr.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({ role: selectedRole })
          .eq("id", user.id);
        if (updateErr) {
          console.error("Profile update error:", updateErr);
          setError("Failed to update profile: " + updateErr.message);
          setLoading(false);
          return;
        }
      }

      // 2. Find the role id using roles.name
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id, name")
        .eq("name", selectedRole)
        .maybeSingle();

      if (roleError || !roleData) {
        console.error("Role lookup error:", roleError);
        setError(`Role "${selectedRole}" not found in the system. Please contact support.`);
        setLoading(false);
        return;
      }

      // 3. Create role assignment
      const { error: assignErr } = await supabase.from("user_role_assignments").insert({
        user_id: user.id,
        role_id: roleData.id,
        is_active: true,
      });

      if (assignErr) {
        console.error("Role assignment error:", assignErr);
        setError("Failed to assign role: " + assignErr.message);
        setLoading(false);
        return;
      }

      toast({ title: "Welcome to Seedlink!", description: "Your account has been set up successfully." });
      
      // Navigate to home, DashboardRouter will redirect to correct dashboard
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-display font-bold text-foreground">Seedlink</span>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Choose your role</CardTitle>
            <CardDescription>Select how you'll use Seedlink. You can change this later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.name}
                  onClick={() => setSelectedRole(role.name)}
                  disabled={loading}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                    selectedRole === role.name
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted/50",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    selectedRole === role.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <role.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{role.label}</p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  {selectedRole === role.name && (
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <Button onClick={handleComplete} className="w-full mt-6" disabled={!selectedRole || loading} size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
