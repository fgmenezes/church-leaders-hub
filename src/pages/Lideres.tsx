
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Tipo para os líderes
interface Lider {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataEntrada: string;
}

// Dados de exemplo (podem ser substituídos por um contexto real posteriormente)
const lideresIniciais: Lider[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@exemplo.com",
    telefone: "(11) 98765-4321",
    cargo: "Líder Principal",
    dataEntrada: "2022-01-15",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    telefone: "(11) 91234-5678",
    cargo: "Líder de Louvor",
    dataEntrada: "2022-03-10",
  },
  {
    id: "3",
    nome: "Pedro Santos",
    email: "pedro.santos@exemplo.com",
    telefone: "(11) 99876-5432",
    cargo: "Líder de Jovens",
    dataEntrada: "2022-05-20",
  },
];

export default function Lideres() {
  const [lideres, setLideres] = useState<Lider[]>(lideresIniciais);
  const [searchTerm, setSearchTerm] = useState("");
  const [liderParaExcluir, setLiderParaExcluir] = useState<Lider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Filtrar líderes baseado no termo de busca
  const lideresFiltrados = lideres.filter(
    (lider) =>
      lider.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lider.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para editar um líder
  const editarLider = (id: string) => {
    navigate(`/lideres/${id}`);
  };

  // Função para excluir um líder
  const excluirLider = () => {
    if (liderParaExcluir) {
      setLideres(lideres.filter((lider) => lider.id !== liderParaExcluir.id));
      setLiderParaExcluir(null);
      setDialogOpen(false);
    }
  };

  // Função para confirmar exclusão
  const confirmarExclusao = (lider: Lider) => {
    setLiderParaExcluir(lider);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Líderes"
        description="Gerencie os líderes da sua organização."
      >
        <Button onClick={() => navigate("/lideres/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Líder
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Líderes</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar líderes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lideresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum líder encontrado
                  </TableCell>
                </TableRow>
              ) : (
                lideresFiltrados.map((lider) => (
                  <TableRow key={lider.id}>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors"
                      onClick={() => editarLider(lider.id)}
                    >
                      {lider.nome}
                    </TableCell>
                    <TableCell>{lider.cargo}</TableCell>
                    <TableCell>{lider.email}</TableCell>
                    <TableCell>{lider.telefone}</TableCell>
                    <TableCell>
                      {new Date(lider.dataEntrada).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editarLider(lider.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmarExclusao(lider)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o líder{" "}
              <strong>{liderParaExcluir?.nome}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={excluirLider}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
