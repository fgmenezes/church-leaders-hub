
import React from 'react';
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
import { Search, UserPlus, MoreHorizontal, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Membros = () => {
  const { toast } = useToast();
  
  // Dados de exemplo para demonstração
  const membros = [
    { id: '1', nome: 'Ana Silva', email: 'ana.silva@email.com', telefone: '(11) 98765-4321', funcao: 'Vocal', status: 'ativo' },
    { id: '2', nome: 'Bruno Santos', email: 'bruno.santos@email.com', telefone: '(11) 91234-5678', funcao: 'Tecladista', status: 'ativo' },
    { id: '3', nome: 'Carla Oliveira', email: 'carla.oliveira@email.com', telefone: '(11) 99876-5432', funcao: 'Baixista', status: 'ativo' },
    { id: '4', nome: 'Daniel Pereira', email: 'daniel.pereira@email.com', telefone: '(11) 95678-1234', funcao: 'Guitarrista', status: 'inativo' },
    { id: '5', nome: 'Eduardo Costa', email: 'eduardo.costa@email.com', telefone: '(11) 92345-6789', funcao: 'Baterista', status: 'ativo' },
  ];
  
  const handleAction = (action: string, id: string) => {
    toast({
      title: "Ação solicitada",
      description: `Ação "${action}" para o membro ID: ${id} será implementada em breve.`,
    });
  };
  
  const handleAddMembro = () => {
    toast({
      title: "Adicionar membro",
      description: "Funcionalidade será implementada em breve.",
    });
  };
  
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
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membros.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell className="font-medium">{membro.nome}</TableCell>
                    <TableCell>{membro.email}</TableCell>
                    <TableCell>{membro.telefone}</TableCell>
                    <TableCell>{membro.funcao}</TableCell>
                    <TableCell>
                      <Badge variant={membro.status === 'ativo' ? 'default' : 'outline'}>
                        {membro.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('editar', membro.id)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('detalhes', membro.id)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction('desativar', membro.id)}
                            className="text-red-600"
                          >
                            {membro.status === 'ativo' ? 'Desativar' : 'Ativar'}
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
    </div>
  );
};

export default Membros;
