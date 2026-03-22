import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardShellProps {
  title: string;
  description: string;
  icon: LucideIcon;
  roleName: string;
  stats?: { label: string; value: string }[];
}

export function DashboardShell({ title, description, icon: Icon, roleName, stats }: DashboardShellProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-sm">{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-display text-lg mb-2">Welcome to your {roleName} dashboard</CardTitle>
          <CardDescription className="max-w-md">
            This is where your {roleName.toLowerCase()} tools and data will live. Features are being built — check back soon.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
