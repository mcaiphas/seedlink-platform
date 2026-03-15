import { DashboardShell } from "@/components/DashboardShell";
import { Truck } from "lucide-react";

export default function LogisticsDashboard() {
  return (
    <DashboardShell
      title="Logistics Dashboard"
      description="Manage deliveries and track shipments."
      icon={Truck}
      roleName="Logistics"
      stats={[
        { label: "Active Deliveries", value: "—" },
        { label: "Completed", value: "—" },
        { label: "Pending Pickup", value: "—" },
        { label: "Issues", value: "—" },
      ]}
    />
  );
}
