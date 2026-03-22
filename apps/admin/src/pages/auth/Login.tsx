import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Leaf } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) toast.error(error.message);
    else navigate('/');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Leaf className="h-10 w-10 text-primary" /></div>
          <CardTitle className="text-2xl">Seedlink Platform</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </form>
          <div className="mt-4 text-center text-sm"><Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link></div>
          <div className="mt-2 text-center text-sm text-muted-foreground">Don't have an account?{' '}<Link to="/signup" className="text-primary hover:underline">Sign up</Link></div>
        </CardContent>
      </Card>
    </div>
  );
}
