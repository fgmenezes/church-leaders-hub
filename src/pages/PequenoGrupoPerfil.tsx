
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

const PequenoGrupoPerfil = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'novo';
  const { getSmallGroup, smallGroups } = useSmallGroups();
  const { members } = useMembers();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('detalhes');
  
  // If we're not creating a new group, get the existing one
  const smallGroup = !isNew && id ? getSmallGroup(id) : null;
  
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
          </TabsList>
          
          <TabsContent value="detalhes" className="space-y-4">
            <SmallGroupForm smallGroup={smallGroup} onSuccess={() => navigate('/pequenos-grupos')} />
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
        </Tabs>
      ) : (
        <SmallGroupForm onSuccess={() => navigate('/pequenos-grupos')} />
      )}
    </div>
  );
};

export default PequenoGrupoPerfil;
