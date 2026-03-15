import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Leaf } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) toast.error(error.message);
    else { toast.success('Account created! Please check your email to verify.'); navigate('/login'); }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Leaf className="h-10 w-10 text-primary" /></div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join the Seedlink Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">Already have an account?{' '}<Link to="/login" className="text-primary hover:underline">Sign in</Link></div>
        </CardContent>
      </Card>
    </div>
  );
}
