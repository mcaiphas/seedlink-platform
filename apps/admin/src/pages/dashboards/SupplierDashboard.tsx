import { DashboardShell } from "@/components/DashboardShell";
import { Store } from "lucide-react";

export default function SupplierDashboard() {
  return (
    <DashboardShell
      title="Supplier Dashboard"
      description="Manage your products and track orders."
      icon={Store}
      roleName="Supplier"
      stats={[
        { label: "Products", value: "—" },
        { label: "Active Orders", value: "—" },
        { label: "Revenue", value: "—" },
        { label: "Pending Shipments", value: "—" },
      ]}
    />
  );
}
