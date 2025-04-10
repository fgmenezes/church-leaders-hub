import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useSmallGroups } from '@/contexts/SmallGroupsContext';
import { useMembers } from '@/contexts/MembersContext';
import { ArrowLeft } from 'lucide-react';
import { SmallGroupForm } from '@/components/small-groups/SmallGroupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AttendanceForm } from '@/components/small-groups/AttendanceForm';

const PequenoGrupoPerfil = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'novo';
  const { getSmallGroup, smallGroups } = useSmallGroups();
  const { members } = useMembers();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('detalhes');
  
  // If we're not creating a new group, get the existing one
  // Make sure to handle undefined ID case properly
  const smallGroup = !isNew && id ? getSmallGroup(id) : null;
  
  console.log("Small Group Profile - ID:", id);
  console.log("Small Group Data:", smallGroup);
  console.log("Current path:", window.location.pathname);
  console.log("Is new group:", isNew);
  
  // Redirect if group not found and not creating a new one
  useEffect(() => {
    if (!isNew && !smallGroup) {
      navigate('/pequenos-grupos');
    }
  }, [isNew, smallGroup, navigate]);
  
  // Get member details for this group
  const groupMembers = smallGroup 
    ? members.filter(member => smallGroup.membros.includes(member.id))
    : [];
  
  // Get attendance records
  const attendanceRecords = smallGroup?.chamadas || [];
  
  const handleFormSuccess = () => {
    navigate('/pequenos-grupos');
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader
        title={isNew ? "Novo Pequeno Grupo" : smallGroup?.nome || ""}
        description={isNew ? "Adicione um novo pequeno grupo" : "Gerencie os detalhes do pequeno grupo"}
      >
        <Button variant="outline" onClick={() => navigate('/pequenos-grupos')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>
      
      {!isNew && smallGroup ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="membros">Membros</TabsTrigger>
            <TabsTrigger value="chamada">Lista de Presença</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Presença</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalhes" className="space-y-4">
            <SmallGroupForm smallGroup={smallGroup} onSuccess={handleFormSuccess} />
          </TabsContent>
          
          <TabsContent value="membros" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Membros do Grupo</CardTitle>
                <CardDescription>
                  Lista de membros que participam deste pequeno grupo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupMembers.length === 0 ? (
                  <p className="text-muted-foreground py-4">
                    Este pequeno grupo não tem membros ainda.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupMembers.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <Button
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => navigate(`/membros/${member.id}`)}
                            >
                              {member.nome}
                            </Button>
                          </TableCell>
                          <TableCell>{member.telefone}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.funcao}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                <div className="mt-4">
                  <Button onClick={() => navigate(`/pequenos-grupos/membros/${smallGroup.id}`)}>
                    Gerenciar Membros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chamada" className="space-y-4">
            <AttendanceForm 
              smallGroupId={smallGroup.id} 
              groupMembers={groupMembers} 
              onSuccess={() => setActiveTab('historico')}
            />
          </TabsContent>
          
          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Presenças</CardTitle>
                <CardDescription>
                  Registro de presenças e visitantes em encontros passados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <p className="text-muted-foreground py-4">
                    Ainda não há registros de presença para este grupo.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {attendanceRecords.map((record) => (
                      <Card key={record.id} className="border-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Encontro em {record.data}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Membros Presentes ({record.membrosPresentes.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {record.membrosPresentes.map(membroId => {
                                const membro = members.find(m => m.id === membroId);
                                return (
                                  <div key={membroId} className="text-sm">
                                    {membro ? membro.nome : 'Membro desconhecido'}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {record.visitantes && record.visitantes.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Visitantes ({record.visitantes.length})</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Convidado por</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {record.visitantes.map(visitante => (
                                    <TableRow key={visitante.id}>
                                      <TableCell>{visitante.nome}</TableCell>
                                      <TableCell>{visitante.telefone}</TableCell>
                                      <TableCell>{visitante.convidadoPor}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <SmallGroupForm onSuccess={handleFormSuccess} />
      )}
    </div>
  );
};

export default PequenoGrupoPerfil;
