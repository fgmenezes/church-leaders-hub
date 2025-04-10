
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';

export function MainLayout() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isMobile ? "px-4" : "px-8",
        "py-6 relative"
      )}>
        <div className="absolute top-6 right-8 z-10 flex items-center gap-4">
          <ThemeToggle />
          <UserAvatar />
        </div>
        <div className="container max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
