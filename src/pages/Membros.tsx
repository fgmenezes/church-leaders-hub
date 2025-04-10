
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, MoreHorizontal, Filter, Pencil, Eye, Trash, UserMinus, UserCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useMembers } from '@/contexts/MembersContext';

const Membros = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use members context
  const { members, deleteMember, toggleMemberStatus } = useMembers();
  
  // Estado para controlar a busca de membros
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members);
  
  // Atualiza os membros filtrados quando a busca ou membros mudam
  useEffect(() => {
    if (!searchTerm) {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member => 
        member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.funcao.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);
  
  // Estado para controlar diálogos de confirmação
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'deactivate' | 'activate';
    memberId: string;
    membroNome: string;
  }>({ isOpen: false, type: 'delete', memberId: '', membroNome: '' });
  
  // Função para editar membro
  const handleEdit = (id: string) => {
    navigate(`/membros/editar/${id}`);
    
    toast({
      title: "Editando membro",
      description: `Redirecionando para a página de edição do membro`,
    });
  };
  
  // Função para ver detalhes do membro
  const handleViewDetails = (id: string) => {
    navigate(`/membros/${id}`);
  };
  
  // Função para abrir diálogo de confirmação
  const handleConfirmationDialog = (type: 'delete' | 'deactivate' | 'activate', id: string, nome: string) => {
    setConfirmDialog({
      isOpen: true,
      type,
      memberId: id,
      membroNome: nome
    });
  };
  
  // Função para excluir membro
  const handleDelete = (id: string) => {
    deleteMember(id);
    
    toast({
      title: "Membro excluído",
      description: "O membro foi excluído com sucesso.",
      variant: "default"
    });
    
    // Fechar o diálogo
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  // Função para alterar o status do membro
  const handleToggleStatus = (id: string) => {
    toggleMemberStatus(id);
    
    toast({
      title: "Status alterado",
      description: "O status do membro foi alterado com sucesso.",
      variant: "default"
    });
    
    // Fechar o diálogo
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  const handleAddMembro = () => {
    navigate('/membros/novo');
    toast({
      title: "Adicionar membro",
      description: "Redirecionando para página de cadastro de novo membro.",
    });
  };

  // Navigation function to go to member profile
  const navigateToMemberProfile = (id: string) => {
    if (id) {
      navigate(`/membros/${id}`);
    }
  };
  
  const getDialogContent = () => {
    const { type, memberId, membroNome } = confirmDialog;
    
    if (type === 'delete') {
      return {
        title: "Excluir membro",
        description: `Tem certeza que deseja excluir ${membroNome}? Esta ação não pode ser desfeita.`,
        confirmAction: () => handleDelete(memberId),
        confirmText: "Excluir",
        confirmVariant: "destructive" as const
      };
    } else if (type === 'deactivate') {
      return {
        title: "Desativar membro",
        description: `Tem certeza que deseja desativar ${membroNome}?`,
        confirmAction: () => handleToggleStatus(memberId),
        confirmText: "Desativar",
        confirmVariant: "default" as const
      };
    } else {
      return {
        title: "Ativar membro",
        description: `Tem certeza que deseja ativar ${membroNome}?`,
        confirmAction: () => handleToggleStatus(memberId),
        confirmText: "Ativar",
        confirmVariant: "default" as const
      };
    }
  };
  
  const dialogContent = getDialogContent();
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Membros" 
        description="Gerencie os membros da sua organização"
        badge={`${members.length} membros`}
      >
        <Button onClick={handleAddMembro}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </PageHeader>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar membros..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden md:table-cell">Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors" 
                      onClick={() => navigateToMemberProfile(membro.id)}
                    >
                      {membro.nome}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{membro.telefone}</TableCell>
                    <TableCell className="hidden md:table-cell">{membro.funcao}</TableCell>
                    <TableCell>
                      <Badge variant={membro.status === 'ativo' ? 'default' : 'outline'}>
                        {membro.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-accent focus:bg-accent"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(membro.id)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleViewDetails(membro.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {membro.status === 'ativo' ? (
                            <DropdownMenuItem 
                              onClick={() => handleConfirmationDialog('deactivate', membro.id, membro.nome)}
                              className="cursor-pointer text-amber-600"
                            >
                              <UserMinus className="mr-2 h-4 w-4" /> Desativar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleConfirmationDialog('activate', membro.id, membro.nome)}
                              className="cursor-pointer text-emerald-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" /> Ativar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleConfirmationDialog('delete', membro.id, membro.nome)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmação */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </Button>
            <Button
              variant={dialogContent.confirmVariant}
              onClick={dialogContent.confirmAction}
            >
              {dialogContent.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Membros;
