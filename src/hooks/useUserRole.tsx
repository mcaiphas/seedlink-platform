import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserRoleData {
  profile: { id: string; full_name: string | null; role: string | null } | null;
  roleName: string | null;
  loading: boolean;
  hasProfile: boolean;
  hasRole: boolean;
  refetch: () => Promise<void>;
}

export function useUserRole(): UserRoleData {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRoleData["profile"]>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setProfile(null);
      setRoleName(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileData);

      // Fetch role assignment
      const { data: roleAssignment } = await supabase
        .from("user_role_assignments")
        .select("role_id, roles(name)")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (roleAssignment && roleAssignment.roles) {
        const roles = roleAssignment.roles as unknown as { name: string };
        setRoleName(roles.name);
      } else {
        setRoleName(null);
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  return {
    profile,
    roleName,
    loading,
    hasProfile: !!profile,
    hasRole: !!roleName,
    refetch: fetchData,
  };
}
