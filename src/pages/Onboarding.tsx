import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sprout, Tractor, Store, ShoppingCart, GraduationCap, Truck, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ROLES = [
  { name: "farmer", label: "Farmer", description: "Manage farms, crops, and sell produce", icon: Tractor },
  { name: "supplier", label: "Supplier", description: "Supply products and manage inventory", icon: Store },
  { name: "buyer", label: "Buyer", description: "Browse and purchase agricultural products", icon: ShoppingCart },
  { name: "trainer", label: "Trainer", description: "Create courses and train farmers", icon: GraduationCap },
  { name: "logistics_partner", label: "Logistics Partner", description: "Handle deliveries and logistics", icon: Truck },
];

export default function Onboarding() {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (!selectedRole || !user) return;
    setLoading(true);

    try {
      // 1. Ensure profile exists (trigger should have created it, but be safe)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          role: selectedRole,
        });
      } else {
        await supabase.from("profiles").update({ role: selectedRole }).eq("id", user.id);
      }

      // 2. Find the role id
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", selectedRole)
        .maybeSingle();

      if (roleError || !roleData) {
        toast({ title: "Error", description: "Role not found. Please contact support.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // 3. Create role assignment
      await supabase.from("user_role_assignments").insert({
        user_id: user.id,
        role_id: roleData.id,
        is_active: true,
      });

      toast({ title: "Welcome to Seedlink!", description: "Your account has been set up successfully." });
      navigate("/");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
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
            <div className="grid gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.name}
                  onClick={() => setSelectedRole(role.name)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                    selectedRole === role.name
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
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
