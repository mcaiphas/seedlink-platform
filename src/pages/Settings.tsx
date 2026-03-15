import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>
      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <SettingsIcon className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-display text-lg mb-2">Settings coming soon</CardTitle>
          <CardDescription>Profile editing, preferences, and account management will be available here.</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
