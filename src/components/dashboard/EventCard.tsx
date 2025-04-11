
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants?: number;
  status?: 'upcoming' | 'ongoing' | 'completed';
};

type EventCardProps = {
  event: Event;
  className?: string;
  onViewDetails?: (id: string) => void;
};

export function EventCard({ event, className, onViewDetails }: EventCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle 
            className="text-lg font-semibold cursor-pointer hover:text-primary hover:underline transition-colors"
            onClick={() => onViewDetails?.(event.id)}
          >
            {event.title}
          </CardTitle>
          {event.status && (
            <Badge className={cn(
              event.status === 'upcoming' && "bg-blue-500",
              event.status === 'ongoing' && "bg-green-500",
              event.status === 'completed' && "bg-muted",
            )}>
              {event.status === 'upcoming' && 'Próximo'}
              {event.status === 'ongoing' && 'Em andamento'}
              {event.status === 'completed' && 'Concluído'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className="space-y-3">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
          {event.participants !== undefined && (
            <div className="mt-4">
              <span className="text-sm font-medium">{event.participants} participantes</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => onViewDetails?.(event.id)}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
