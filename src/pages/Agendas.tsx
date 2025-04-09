
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ListTodo, 
  Plus 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Agendas = () => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<'mes' | 'dia'>('mes');
  
  // Dados de exemplo para demonstração
  const events = [
    { id: '1', title: 'Ensaio de Cordas', start: '09:00', end: '11:00', type: 'ensaio' },
    { id: '2', title: 'Reunião de Planejamento', start: '14:00', end: '15:30', type: 'reuniao' },
    { id: '3', title: 'Ensaio Geral', start: '19:00', end: '21:00', type: 'ensaio' },
  ];
  
  // Dias com eventos (para destacar no calendário)
  const daysWithEvents = [
    new Date(2024, 5, 10),
    new Date(2024, 5, 15),
    new Date(2024, 5, 20),
    new Date(2024, 5, 25),
    new Date(2024, 5, 30),
  ];
  
  const handleAddAgenda = () => {
    toast({
      title: "Adicionar agenda",
      description: "Funcionalidade será implementada em breve.",
    });
  };
  
  const handlePrevDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    setDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay);
  };
  
  const handleEventClick = (id: string) => {
    toast({
      title: "Detalhes do evento",
      description: `Os detalhes do evento ID: ${id} serão implementados em breve.`,
    });
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Agendas" 
        description="Gerencie as agendas da sua organização"
      >
        <Button onClick={handleAddAgenda}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Agenda
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <Select value={view} onValueChange={(v) => setView(v as 'mes' | 'dia')}>
                <SelectTrigger>
                  <SelectValue placeholder="Visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Mensal</SelectItem>
                  <SelectItem value="dia">Diária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="pointer-events-auto"
                modifiers={{
                  hasEvent: daysWithEvents,
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/10 font-medium text-primary",
                }}
                locale={ptBR}
              />
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">Ensaio</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Reunião</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {view === 'dia' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-medium">
                    {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={handleNextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {events.map((event) => (
                    <div 
                      key={event.id}
                      className="p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center mt-1 text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            <span className="text-sm">{event.start} - {event.end}</span>
                          </div>
                        </div>
                        <Badge className={cn(
                          event.type === 'ensaio' && 'bg-blue-500',
                          event.type === 'reuniao' && 'bg-green-500',
                        )}>
                          {event.type === 'ensaio' ? 'Ensaio' : 'Reunião'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {events.length === 0 && (
                    <div className="text-center py-8">
                      <ListTodo className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">Nenhum evento para hoje</h3>
                      <p className="text-muted-foreground mt-1">
                        Não há eventos agendados para esta data.
                      </p>
                      <Button className="mt-4" onClick={handleAddAgenda}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Evento
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Visualização do Mês</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Selecione um dia no calendário para ver os detalhes.
                </p>
                <Separator className="my-4" />
                <h4 className="font-medium mt-4">Resumo do Mês</h4>
                <div className="flex justify-center gap-8 mt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Eventos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">8</p>
                    <p className="text-sm text-muted-foreground">Ensaios</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">4</p>
                    <p className="text-sm text-muted-foreground">Reuniões</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agendas;
