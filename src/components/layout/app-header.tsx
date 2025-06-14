"use client";

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-provider';
import { APP_NAME } from '@/lib/constants';
import { LogOut, CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-headline text-2xl font-bold text-accent">{APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-6"> {/* Group nav and user dropdown */}
          <nav className="hidden items-center space-x-4 md:flex lg:space-x-6">
            <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary">
              Home
            </Link>
            <Link href="/dashboard/manage" className="text-sm font-medium text-foreground hover:text-primary">
              Manage
            </Link>
            <Link href="/dashboard/report" className="text-sm font-medium text-foreground hover:text-primary">
              Transaction Report
            </Link>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <CircleUserRound className="h-6 w-6 text-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={logout} className="text-card-foreground hover:bg-muted focus:bg-muted">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
