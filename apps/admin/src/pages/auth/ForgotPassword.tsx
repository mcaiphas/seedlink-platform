import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sprout, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center border-border/50 shadow-lg animate-fade-in">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Check your email</CardTitle>
            <CardDescription>If an account exists for <strong>{email}</strong>, we sent a password reset link.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/sign-in" className="text-sm text-primary hover:underline">Back to sign in</Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-display font-bold text-foreground">Seedlink</span>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Forgot password?</CardTitle>
            <CardDescription>Enter your email and we'll send a reset link</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send reset link
              </Button>
              <Link to="/sign-in" className="text-sm text-muted-foreground hover:underline">Back to sign in</Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
