import { DashboardShell } from "@/components/DashboardShell";
import { GraduationCap } from "lucide-react";

export default function TrainerDashboard() {
  return (
    <DashboardShell
      title="Trainer Dashboard"
      description="Create courses and manage students."
      icon={GraduationCap}
      roleName="Trainer"
      stats={[
        { label: "Courses", value: "—" },
        { label: "Enrolled Students", value: "—" },
        { label: "Certificates Issued", value: "—" },
        { label: "Completion Rate", value: "—" },
      ]}
    />
  );
}
