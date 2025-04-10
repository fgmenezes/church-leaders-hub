
import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash, Users, ClipboardCheck } from 'lucide-react';
import { useSmallGroups } from '@/contexts/SmallGroupsContext';
import { Link, useNavigate } from 'react-router-dom';
import { useMembers } from '@/contexts/MembersContext';
import { Input } from '@/components/ui/input';
import { SmallGroupForm } from '@/components/small-groups/SmallGroupForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PequenosGrupos = () => {
  const { smallGroups, deleteSmallGroup } = useSmallGroups();
  const { members } = useMembers();
  const navigate = useNavigate();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Filter small groups based on search term
  const filteredGroups = smallGroups.filter(group =>
    group.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setGroupToDelete(id);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (groupToDelete) {
      deleteSmallGroup(groupToDelete);
      setShowDeleteDialog(false);
      setGroupToDelete(null);
    }
  };
  
  // Format frequency for display
  const formatFrequency = (freq: string) => {
    const map: Record<string, string> = {
      'diaria': 'Diário',
      'semanal': 'Semanal',
      'quinzenal': 'Quinzenal',
      'mensal': 'Mensal'
    };
    return map[freq] || freq;
  };
  
  // Handle form success (redirect to the group page or refresh)
  const handleFormSuccess = () => {
    setShowAddDialog(false);
    // No need to reload the page, just close the dialog
  };
  
  // Handle navigation to small group details
  const navigateToGroupDetails = (groupId: string) => {
    console.log("Navigating to small group details:", groupId);
    navigate(`/pequenos-grupos/${groupId}`);
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Pequenos Grupos" 
        description="Gerencie os pequenos grupos da sua organização"
      >
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Pequeno Grupo
        </Button>
      </PageHeader>
      
      <div className="mb-6">
        <Input
          placeholder="Buscar pequeno grupo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>Dia/Horário</TableHead>
              <TableHead>Membros</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhum pequeno grupo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">
                    <Button 
                      variant="link"
                      className="p-0 h-auto text-left font-medium hover:underline"
                      onClick={() => {
                        console.log("Small group name clicked:", group.id);
                        navigate(`/pequenos-grupos/${group.id}`);
                      }}
                    >
                      {group.nome}
                    </Button>
                  </TableCell>
                  <TableCell>{group.responsavel.nome}</TableCell>
                  <TableCell>{formatFrequency(group.frequencia || 'semanal')}</TableCell>
                  <TableCell>{group.diaSemana}, {group.horario}</TableCell>
                  <TableCell>
                    {group.membros.length} membro(s)
                  </TableCell>
                  <TableCell>
                    {group.endereco.cidade}, {group.endereco.estado}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/pequenos-grupos/${group.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/pequenos-grupos/membros/${group.id}`)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigate(`/pequenos-grupos/${group.id}`);
                          setTimeout(() => {
                            document.querySelector('[data-value="chamada"]')?.dispatchEvent(
                              new MouseEvent('click', { bubbles: true })
                            );
                          }, 100);
                        }}
                      >
                        <ClipboardCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(group.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <div className="mt-4">
              Tem certeza que deseja excluir este pequeno grupo? Esta ação não pode ser desfeita.
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Small Group Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="w-[80vw] max-w-[1000px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Pequeno Grupo</DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            <SmallGroupForm onSuccess={handleFormSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PequenosGrupos;
