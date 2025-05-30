import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth.js';

import { RegisterPage } from '@/app/register/page.js';

import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { useToast } from '@/components/ui/use-toast.js';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  if (showRegister) {
    return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast({
        title: 'error',
        description: 'email is required',
        variant: 'destructive'
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: 'error',
        description: 'password is required',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'success',
        description: 'login successful'
      });
      // Navigation will be handled by the app based on auth state
    } catch (error: unknown) {
      let errorMessage = 'login failed. please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'login failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>login to switch.ai</CardTitle>
          <CardDescription>enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'logging in...' : 'login'}
            </Button>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowRegister(true)}
                className="text-sm"
              >
                don't have an account? sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
