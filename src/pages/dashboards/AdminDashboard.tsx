import { DashboardShell } from "@/components/DashboardShell";
import { ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      description="Manage users, roles, and platform operations."
      icon={ShieldCheck}
      roleName="Admin"
      stats={[
        { label: "Total Users", value: "—" },
        { label: "Active Roles", value: "—" },
        { label: "Organizations", value: "—" },
        { label: "Audit Events", value: "—" },
      ]}
    />
  );
}
