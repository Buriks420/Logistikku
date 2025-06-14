
"use client";

import { LoginForm } from '@/components/auth/login-form';
import { Users } from 'lucide-react'; // Changed from Package
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Removed CardTitle, CardDescription

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    // Kept loading state for UX, though not explicitly in the image
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/yagyusDSA.png')" }}
      data-ai-hint="warehouse boxes"
    >
      <Card className="w-full max-w-xs bg-card/70 backdrop-blur-sm shadow-xl rounded-lg">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          <Users className="h-16 w-16 text-foreground/80" />
        </CardHeader>
        <CardContent className="pb-8">
          <LoginForm />
        </CardContent>
      </Card>
      {/* Footer removed as per image */}
    </div>
  );
}
