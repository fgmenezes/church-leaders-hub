
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, LineChart, Download, CalendarRange, Calendar } from 'lucide-react';

const Relatorios = () => {
  // Dados simulados para os gráficos
  const attendanceData = [
    { name: 'Janeiro', valor: 85 },
    { name: 'Fevereiro', valor: 78 },
    { name: 'Março', valor: 92 },
    { name: 'Abril', valor: 88 },
    { name: 'Maio', valor: 90 },
    { name: 'Junho', valor: 95 },
  ];

  const membershipData = [
    { name: 'Novos', valor: 24 },
    { name: 'Ativos', valor: 152 },
    { name: 'Inativos', valor: 18 },
  ];

  const downloadReport = (reportType: string) => {
    // Simulação de download
    alert(`Download do relatório de ${reportType} iniciado (demonstração)`);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Relatórios" 
        description="Visualize dados e estatísticas da sua organização"
      >
        <Button variant="outline" className="mr-2">
          <CalendarRange className="mr-2 h-4 w-4" />
          Filtrar período
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="presenca" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="presenca">Presença</TabsTrigger>
          <TabsTrigger value="membros">Membros</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presenca">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Taxa de Presença Mensal
                </CardTitle>
                <CardDescription>
                  Visualização da presença nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de barras da presença mensal seria exibido aqui</p>
                    <p className="text-sm mt-1">Dados baseados em {attendanceData.length} meses</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => downloadReport('presença')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar relatório de presença
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Tendência de Participação
                </CardTitle>
                <CardDescription>
                  Análise de tendências de participação ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de linha com tendências seria exibido aqui</p>
                    <p className="text-sm mt-1">Baseado em dados históricos de participação</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => downloadReport('tendências')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar análise de tendências
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="membros">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Distribuição de Membros
                </CardTitle>
                <CardDescription>
                  Classificação dos membros por status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de pizza com distribuição seria exibido aqui</p>
                    <p className="text-sm mt-1">Total de {membershipData.reduce((acc, item) => acc + item.valor, 0)} membros</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => downloadReport('membros')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar relatório de membros
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Crescimento Mensal
                </CardTitle>
                <CardDescription>
                  Novos membros por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de crescimento mensal seria exibido aqui</p>
                    <p className="text-sm mt-1">Comparação com meses anteriores</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => downloadReport('crescimento')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar relatório de crescimento
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro">
          <div className="flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">Relatórios financeiros em desenvolvimento</h3>
              <p>Esta funcionalidade estará disponível em breve.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="eventos">
          <div className="flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">Relatórios de eventos em desenvolvimento</h3>
              <p>Esta funcionalidade estará disponível em breve.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
