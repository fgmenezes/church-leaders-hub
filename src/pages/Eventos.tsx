
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EventCard } from '@/components/dashboard/EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarPlus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Eventos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Dados de exemplo para demonstração
  const eventos = {
    proximos: [
      {
        id: '1',
        title: 'Ensaio Geral',
        date: '20 Jun, 2024',
        time: '19:00',
        location: 'Salão Principal',
        participants: 18,
        status: 'upcoming' as const,
      },
      {
        id: '2',
        title: 'Reunião de Liderança',
        date: '22 Jun, 2024',
        time: '20:00',
        location: 'Sala de Reuniões',
        participants: 8,
        status: 'upcoming' as const,
      },
      {
        id: '3',
        title: 'Workshop de Vocais',
        date: '25 Jun, 2024',
        time: '18:30',
        location: 'Sala de Música',
        participants: 12,
        status: 'upcoming' as const,
      },
    ],
    andamento: [
      {
        id: '4',
        title: 'Treinamento de Som',
        date: 'Hoje',
        time: 'Até 18:00',
        location: 'Auditório',
        participants: 5,
        status: 'ongoing' as const,
      },
    ],
    concluidos: [
      {
        id: '5',
        title: 'Ensaio de Cordas',
        date: '15 Jun, 2024',
        time: '19:00',
        location: 'Sala de Música',
        participants: 6,
        status: 'completed' as const,
      },
      {
        id: '6',
        title: 'Reunião de Planejamento',
        date: '10 Jun, 2024',
        time: '20:00',
        location: 'Sala de Reuniões',
        participants: 10,
        status: 'completed' as const,
      },
    ],
  };
  
  const handleViewEventDetails = (id: string) => {
    navigate(`/eventos/${id}/detalhes`);
  };
  
  const handleEditEvent = (id: string) => {
    navigate(`/eventos/${id}`);
  };
  
  const handleDeleteEvent = (id: string) => {
    toast({
      title: "Excluir evento",
      description: `A exclusão do evento ID: ${id} será implementada em breve.`,
    });
  };
  
  const handleAddEvento = () => {
    toast({
      title: "Adicionar evento",
      description: "Funcionalidade será implementada em breve.",
    });
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Eventos" 
        description="Gerencie os eventos da sua organização"
      >
        <Button onClick={handleAddEvento}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </PageHeader>
      
      <div className="mb-6 flex justify-end">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>
      
      <Tabs defaultValue="proximos">
        <TabsList className="mb-4">
          <TabsTrigger value="proximos">Próximos</TabsTrigger>
          <TabsTrigger value="andamento">Em andamento</TabsTrigger>
          <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proximos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.proximos.map((evento) => (
              <EventCard 
                key={evento.id}
                event={evento}
                onViewDetails={handleViewEventDetails}
                className="card-hover"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="andamento">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.andamento.map((evento) => (
              <EventCard 
                key={evento.id}
                event={evento}
                onViewDetails={handleViewEventDetails}
                className="card-hover"
              />
            ))}
            
            {eventos.andamento.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhum evento em andamento.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="concluidos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.concluidos.map((evento) => (
              <EventCard 
                key={evento.id}
                event={evento}
                onViewDetails={handleViewEventDetails}
                className="card-hover"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Eventos;
