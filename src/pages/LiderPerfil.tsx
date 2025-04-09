
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LiderForm } from "@/components/lideres/LiderForm";
import { toast } from "@/components/ui/use-toast";

// Tipo para o líder
interface Lider {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataEntrada: string;
  dataNascimento?: string;
  cpf?: string;
  rg?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
}

// Dados de exemplo - em um caso real, isso viria de um contexto ou API
const lideresIniciais: Lider[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@exemplo.com",
    telefone: "(11) 98765-4321",
    cargo: "Líder Principal",
    dataEntrada: "2022-01-15",
    dataNascimento: "1985-05-20",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    endereco: {
      cep: "01234-567",
      logradouro: "Rua Exemplo",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
    },
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    telefone: "(11) 91234-5678",
    cargo: "Líder de Louvor",
    dataEntrada: "2022-03-10",
    dataNascimento: "1990-07-15",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    endereco: {
      cep: "04321-765",
      logradouro: "Avenida Teste",
      numero: "456",
      bairro: "Jardim",
      cidade: "São Paulo",
      estado: "SP",
    },
  },
  {
    id: "3",
    nome: "Pedro Santos",
    email: "pedro.santos@exemplo.com",
    telefone: "(11) 99876-5432",
    cargo: "Líder de Jovens",
    dataEntrada: "2022-05-20",
    dataNascimento: "1988-12-10",
    cpf: "456.789.123-00",
    rg: "45.678.912-3",
    endereco: {
      cep: "05678-321",
      logradouro: "Rua das Flores",
      numero: "789",
      complemento: "Casa",
      bairro: "Jardim Europa",
      cidade: "São Paulo",
      estado: "SP",
    },
  },
];

export default function LiderPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lider, setLider] = useState<Lider | null>(null);
  const isNewLider = id === "novo";

  useEffect(() => {
    if (!isNewLider && id) {
      // Em um caso real, buscaríamos os dados do líder de um contexto ou API
      const liderEncontrado = lideresIniciais.find((l) => l.id === id);
      if (liderEncontrado) {
        setLider(liderEncontrado);
      } else {
        // Líder não encontrado, redirecionar para a lista
        navigate("/lideres");
        toast({
          title: "Líder não encontrado",
          description: "O líder que você está procurando não existe.",
          variant: "destructive",
        });
      }
    } else {
      // Novo líder, inicializar com valores padrão
      setLider({
        id: Date.now().toString(), // ID temporário
        nome: "",
        email: "",
        telefone: "",
        cargo: "",
        dataEntrada: new Date().toISOString().split("T")[0],
        endereco: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
        },
      });
    }
  }, [id, isNewLider, navigate]);

  const handleSave = (dadosLider: Lider) => {
    // Em um caso real, salvaríamos os dados em um contexto ou API
    console.log("Salvando líder:", dadosLider);
    
    toast({
      title: isNewLider ? "Líder criado" : "Líder atualizado",
      description: `O líder ${dadosLider.nome} foi ${
        isNewLider ? "criado" : "atualizado"
      } com sucesso.`,
      variant: "default",
    });
    
    // Redirecionar para a lista de líderes
    navigate("/lideres");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={isNewLider ? "Novo Líder" : "Editar Líder"}
        description={
          isNewLider
            ? "Cadastre um novo líder no sistema"
            : `Editando o líder ${lider?.nome || ""}`
        }
      >
        <Button variant="outline" onClick={() => navigate("/lideres")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button type="submit" form="lider-form">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          {lider && <LiderForm lider={lider} onSave={handleSave} />}
        </CardContent>
      </Card>
    </div>
  );
}
