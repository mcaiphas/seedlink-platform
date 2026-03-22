import { DashboardShell } from "@/components/DashboardShell";
import { ShoppingCart } from "lucide-react";

export default function BuyerDashboard() {
  return (
    <DashboardShell
      title="Buyer Dashboard"
      description="Browse products and manage your orders."
      icon={ShoppingCart}
      roleName="Buyer"
      stats={[
        { label: "Orders", value: "—" },
        { label: "In Cart", value: "—" },
        { label: "Deliveries", value: "—" },
        { label: "Spent", value: "—" },
      ]}
    />
  );
}
