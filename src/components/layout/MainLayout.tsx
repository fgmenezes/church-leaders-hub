
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainLayout() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isMobile ? "px-4" : "px-8",
        "py-6"
      )}>
        <div className="container max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
