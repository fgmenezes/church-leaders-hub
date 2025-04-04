
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useSmallGroups } from '@/contexts/SmallGroupsContext';
import { useMembers } from '@/contexts/MembersContext';
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const PequenoGrupoMembros = () => {
  const { id } = useParams<{ id: string }>();
  const { getSmallGroup, addMemberToGroup, removeMemberFromGroup } = useSmallGroups();
  const { members } = useMembers();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [smallGroup, setSmallGroup] = useState(id ? getSmallGroup(id) : null);
  
  // Redirect if group not found
  useEffect(() => {
    if (!smallGroup) {
      navigate('/pequenos-grupos');
    }
  }, [smallGroup, navigate]);
  
  // Update local state when small group changes
  useEffect(() => {
    if (id) {
      setSmallGroup(getSmallGroup(id));
    }
  }, [id, getSmallGroup]);
  
  if (!smallGroup) return null;
  
  // Get current group members
  const groupMemberIds = smallGroup.membros || [];
  
  // Filter active members by search term
  const filteredMembers = members
    .filter(member => member.status === 'ativo')
    .filter(member => 
      member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  // Handle member toggle
  const handleMemberToggle = (memberId: string, isInGroup: boolean) => {
    if (isInGroup) {
      removeMemberFromGroup(smallGroup.id, memberId);
    } else {
      addMemberToGroup(smallGroup.id, memberId);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Gerenciar Membros: ${smallGroup.nome}`}
        description="Adicione ou remova membros deste pequeno grupo"
      >
        <Button variant="outline" onClick={() => navigate(`/pequenos-grupos/${smallGroup.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>
      
      <div className="mb-6">
        <Input
          placeholder="Buscar membro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Membros Disponíveis</CardTitle>
          <CardDescription>
            Selecione os membros que participam deste pequeno grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum membro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => {
                    const isInGroup = groupMemberIds.includes(member.id);
                    
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Checkbox
                            checked={isInGroup}
                            onCheckedChange={() => handleMemberToggle(member.id, isInGroup)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{member.nome}</TableCell>
                        <TableCell>{member.telefone}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.funcao}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMemberToggle(member.id, isInGroup)}
                          >
                            {isInGroup ? (
                              <>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remover
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Adicionar
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PequenoGrupoMembros;
