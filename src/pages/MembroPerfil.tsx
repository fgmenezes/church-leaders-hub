
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Mail, Phone, UserRound, Music, CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  funcao: string;
  status: string;
  dataNascimento?: string;
  dataIngresso?: string;
  endereco?: string;
  habilidades?: string[];
  observacoes?: string;
}

const MembroPerfil = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [membro, setMembro] = useState<Membro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando busca de dados do membro
    const buscarMembro = () => {
      setLoading(true);
      
      // Dados de exemplo - em produção, estes dados viriam de uma API
      const membrosData: Membro[] = [
        { 
          id: '1', 
          nome: 'Ana Silva', 
          email: 'ana.silva@email.com', 
          telefone: '(11) 98765-4321', 
          funcao: 'Vocal', 
          status: 'ativo',
          dataNascimento: '15/05/1992',
          dataIngresso: '10/01/2020',
          endereco: 'Rua das Flores, 123 - São Paulo/SP',
          habilidades: ['Canto', 'Violão', 'Piano'],
          observacoes: 'Participa do ministério aos domingos e quartas-feiras.'
        },
        { 
          id: '2', 
          nome: 'Bruno Santos', 
          email: 'bruno.santos@email.com', 
          telefone: '(11) 91234-5678', 
          funcao: 'Tecladista', 
          status: 'ativo',
          dataNascimento: '22/07/1988',
          dataIngresso: '05/03/2019',
          endereco: 'Av. Paulista, 1000 - São Paulo/SP',
          habilidades: ['Teclado', 'Arranjos'],
          observacoes: 'Responsável pelos arranjos do ministério.'
        },
        { 
          id: '3', 
          nome: 'Carla Oliveira', 
          email: 'carla.oliveira@email.com', 
          telefone: '(11) 99876-5432', 
          funcao: 'Baixista', 
          status: 'ativo',
          dataNascimento: '30/10/1995',
          dataIngresso: '15/06/2021',
          endereco: 'Rua Augusta, 500 - São Paulo/SP',
          habilidades: ['Baixo', 'Contrabaixo'],
          observacoes: 'Disponível aos finais de semana.'
        },
        { 
          id: '4', 
          nome: 'Daniel Pereira', 
          email: 'daniel.pereira@email.com', 
          telefone: '(11) 95678-1234', 
          funcao: 'Guitarrista', 
          status: 'inativo',
          dataNascimento: '12/12/1990',
          dataIngresso: '20/07/2018',
          endereco: 'Rua Consolação, 750 - São Paulo/SP',
          habilidades: ['Guitarra', 'Violão'],
          observacoes: 'Afastado temporariamente por motivos de saúde.'
        },
        { 
          id: '5', 
          nome: 'Eduardo Costa', 
          email: 'eduardo.costa@email.com', 
          telefone: '(11) 92345-6789', 
          funcao: 'Baterista', 
          status: 'ativo',
          dataNascimento: '05/03/1993',
          dataIngresso: '17/09/2020',
          endereco: 'Alameda Santos, 400 - São Paulo/SP',
          habilidades: ['Bateria', 'Percussão'],
          observacoes: 'Também atua como técnico de som.'
        },
      ];
      
      const membroEncontrado = membrosData.find(m => m.id === id);
      
      setTimeout(() => {
        setMembro(membroEncontrado || null);
        setLoading(false);
      }, 500); // Simula um delay de rede
    };
    
    buscarMembro();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Carregando..." description="Buscando informações do membro" />
        <Card>
          <CardContent className="p-10 flex justify-center">
            <p>Carregando dados do membro...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!membro) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Membro não encontrado" description="O membro solicitado não existe" />
        <Card>
          <CardContent className="p-10 flex flex-col items-center justify-center gap-4">
            <p>Não foi possível encontrar o membro com o ID: {id}</p>
            <Button onClick={() => navigate('/membros')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Lista de Membros
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={membro.nome} 
        description={`Perfil do membro - ${membro.funcao}`}
        subtitle={
          <Badge variant={membro.status === 'ativo' ? 'default' : 'outline'} className="ml-2">
            {membro.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </Badge>
        }
      >
        <Button variant="outline" onClick={() => navigate('/membros')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center my-4">
                <UserRound className="h-16 w-16 text-primary" />
              </div>
              
              <h3 className="text-xl font-medium mt-2">{membro.nome}</h3>
              <p className="text-muted-foreground">{membro.funcao}</p>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{membro.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{membro.telefone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5">
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="hist">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Endereço</dt>
                      <dd className="text-sm mt-1">{membro.endereco || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Data de Nascimento</dt>
                      <dd className="text-sm mt-1">{membro.dataNascimento || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Data de Ingresso</dt>
                      <dd className="text-sm mt-1">{membro.dataIngresso || 'Não informado'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {membro.habilidades?.length ? (
                      membro.habilidades.map((habilidade, index) => (
                        <Badge variant="secondary" key={index} className="flex items-center gap-1">
                          <Music className="h-3 w-3" />
                          {habilidade}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma habilidade registrada</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{membro.observacoes || 'Nenhuma observação registrada'}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hist">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Participação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border-l-2 border-primary pl-4 pb-4">
                      <CalendarClock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Participação em Evento</p>
                        <p className="text-xs text-muted-foreground">Culto de Domingo - 15/10/2023</p>
                        <p className="text-sm mt-1">Participou como {membro.funcao}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 border-l-2 border-primary pl-4 pb-4">
                      <CalendarClock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Participação em Evento</p>
                        <p className="text-xs text-muted-foreground">Culto de Quarta - 11/10/2023</p>
                        <p className="text-sm mt-1">Participou como {membro.funcao}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                      <CalendarClock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Participação em Evento</p>
                        <p className="text-xs text-muted-foreground">Culto de Domingo - 08/10/2023</p>
                        <p className="text-sm mt-1">Participou como {membro.funcao}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MembroPerfil;
