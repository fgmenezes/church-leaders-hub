
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { EventCard } from '@/components/dashboard/EventCard';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Activity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  
  // Dados de exemplo para demonstração
  const stats = [
    {
      title: 'Membros Ativos',
      value: 152,
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Novos Membros',
      value: 24,
      icon: UserPlus,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Eventos do Mês',
      value: 7,
      icon: Calendar,
      trend: { value: 2, isPositive: true }
    },
    {
      title: 'Taxa de Participação',
      value: '85%',
      icon: Activity,
      trend: { value: 5, isPositive: true }
    },
  ];
  
  const recentActivities = [
    {
      id: '1',
      title: 'Novo membro adicionado',
      description: 'Pedro Silva foi adicionado ao ministério de louvor',
      time: '10 minutos atrás',
      type: 'success' as const,
    },
    {
      id: '2',
      title: 'Evento atualizado',
      description: 'Ensaio de domingo foi remarcado para às 19h',
      time: '2 horas atrás',
      type: 'warning' as const,
    },
    {
      id: '3',
      title: 'Lembrete automático',
      description: 'Reunião de liderança amanhã às 20h',
      time: '5 horas atrás',
      type: 'default' as const,
    },
  ];
  
  const upcomingEvents = [
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
  ];
  
  const handleViewEventDetails = (id: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Detalhes do evento ${id} estarão disponíveis em breve.`,
    });
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do seu ministério"
      >
        <Button>Nova Atividade</Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            className="card-hover"
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                onViewDetails={handleViewEventDetails}
                className="card-hover"
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <ActivityCard activities={recentActivities} className="card-hover" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
