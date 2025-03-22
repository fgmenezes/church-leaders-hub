
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  badge?: string;
  subtitle?: React.ReactNode;
  className?: string;
};

export function PageHeader({ 
  title, 
  description, 
  children, 
  badge,
  subtitle,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn(
      "pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between",
      "border-b border-border/50",
      className
    )}>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {badge && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
              {badge}
            </Badge>
          )}
          {subtitle}
        </div>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {children}
        </div>
      )}
    </div>
  );
}
