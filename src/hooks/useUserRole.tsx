import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ProfileData {
  id: string;
  full_name: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  job_title: string | null;
  organization_id: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface UserRoleData {
  profile: ProfileData | null;
  roleName: string | null;
  loading: boolean;
  hasProfile: boolean;
  hasRole: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PROFILE_SELECT = "id, full_name, role, email, phone, avatar_url, job_title, organization_id, is_active, created_at, updated_at";

export function useUserRole(): UserRoleData {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (authLoading) return;

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
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile. Please refresh.");
        setLoading(false);
        return;
      }

      setProfile(profileData as ProfileData | null);

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
