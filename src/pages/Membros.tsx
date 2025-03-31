
import React, { useState } from 'react';
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

const Membros = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estado para controlar diálogos de confirmação
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'deactivate' | 'activate';
    memberId: string;
    membroNome: string;
  }>({ isOpen: false, type: 'delete', memberId: '', membroNome: '' });
  
  // Dados de exemplo para demonstração
  const [membros, setMembros] = useState([
    { id: '1', nome: 'Ana Silva', email: 'ana.silva@email.com', telefone: '(11) 98765-4321', funcao: 'Vocal', status: 'ativo' },
    { id: '2', nome: 'Bruno Santos', email: 'bruno.santos@email.com', telefone: '(11) 91234-5678', funcao: 'Tecladista', status: 'ativo' },
    { id: '3', nome: 'Carla Oliveira', email: 'carla.oliveira@email.com', telefone: '(11) 99876-5432', funcao: 'Baixista', status: 'ativo' },
    { id: '4', nome: 'Daniel Pereira', email: 'daniel.pereira@email.com', telefone: '(11) 95678-1234', funcao: 'Guitarrista', status: 'inativo' },
    { id: '5', nome: 'Eduardo Costa', email: 'eduardo.costa@email.com', telefone: '(11) 92345-6789', funcao: 'Baterista', status: 'ativo' },
  ]);
  
  // Função para editar membro (redireciona para uma página de edição temporária)
  const handleEdit = (id: string) => {
    // TODO: Criar uma página de edição real em vez de usar a página de perfil
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
    setMembros(prev => prev.filter(membro => membro.id !== id));
    
    toast({
      title: "Membro excluído",
      description: "O membro foi excluído com sucesso.",
      variant: "default"
    });
    
    // Fechar o diálogo
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  // Função para alterar o status do membro
  const handleToggleStatus = (id: string, currentStatus: string) => {
    setMembros(prev => prev.map(membro => {
      if (membro.id === id) {
        return {
          ...membro,
          status: currentStatus === 'ativo' ? 'inativo' : 'ativo'
        };
      }
      return membro;
    }));
    
    const newStatus = currentStatus === 'ativo' ? 'Inativo' : 'Ativo';
    
    toast({
      title: `Status alterado para ${newStatus}`,
      description: `O membro agora está ${newStatus.toLowerCase()}.`,
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

  const navigateToMemberProfile = (id: string) => {
    navigate(`/membros/${id}`);
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
        confirmAction: () => handleToggleStatus(memberId, 'ativo'),
        confirmText: "Desativar",
        confirmVariant: "default" as const
      };
    } else {
      return {
        title: "Ativar membro",
        description: `Tem certeza que deseja ativar ${membroNome}?`,
        confirmAction: () => handleToggleStatus(memberId, 'inativo'),
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
        description="Gerencie os membros do seu ministério"
        badge={`${membros.length} membros`}
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
              <Input placeholder="Buscar membros..." className="pl-9" />
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
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membros.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors" 
                      onClick={() => navigateToMemberProfile(membro.id)}
                    >
                      {membro.nome}
                    </TableCell>
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
