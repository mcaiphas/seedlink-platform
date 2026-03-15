import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserRoleData {
  profile: { id: string; full_name: string | null; role: string | null } | null;
  roleName: string | null;
  loading: boolean;
  hasProfile: boolean;
  hasRole: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserRole(): UserRoleData {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserRoleData["profile"]>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (authLoading) return; // Wait for auth to be ready
    
    if (!user) {
      setProfile(null);
      setRoleName(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile. Please refresh.");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch role assignment using roles.name
      const { data: roleAssignment, error: roleError } = await supabase
        .from("user_role_assignments")
        .select("role_id, roles(name)")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (roleError) {
        console.error("Error fetching role:", roleError);
        setError("Failed to load role. Please refresh.");
        setLoading(false);
        return;
      }

      if (roleAssignment && roleAssignment.roles) {
        const roles = roleAssignment.roles as unknown as { name: string };
        setRoleName(roles.name);
      } else {
        setRoleName(null);
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    roleName,
    loading: authLoading || loading,
    hasProfile: !!profile,
    hasRole: !!roleName,
    error,
    refetch: fetchData,
  };
}
