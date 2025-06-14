"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid username or password.');
      }

      // If login is successful, pass the user data to the login function
      login(data.user); // The API returns the user object on success

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="insert username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-input rounded-lg"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="insert password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-input rounded-lg"
        />
        <div className="flex justify-end pt-1">
          <a href="#" className="text-xs text-destructive hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2.5 rounded-lg mt-4" 
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        LOGIN
      </Button>
    </form>
  );
}