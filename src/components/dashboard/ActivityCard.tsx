
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'default' | 'success' | 'warning' | 'error';
};

type ActivityCardProps = {
  activities: Activity[];
  className?: string;
};

export function ActivityCard({ activities, className }: ActivityCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-6 px-6 pb-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <div className={cn(
                "absolute left-0 top-1 h-3 w-3 rounded-full",
                activity.type === 'success' && "bg-green-500",
                activity.type === 'warning' && "bg-amber-500",
                activity.type === 'error' && "bg-red-500",
                activity.type === 'default' && "bg-primary",
              )} />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma atividade recente.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
