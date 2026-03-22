import { DashboardShell } from "@/components/DashboardShell";
import { Tractor } from "lucide-react";

export default function FarmerDashboard() {
  return (
    <DashboardShell
      title="Farmer Dashboard"
      description="Manage your farms, crops, and access the marketplace."
      icon={Tractor}
      roleName="Farmer"
      stats={[
        { label: "Farms", value: "—" },
        { label: "Active Crops", value: "—" },
        { label: "Pending Orders", value: "—" },
        { label: "Advisor Sessions", value: "—" },
      ]}
    />
  );
}
