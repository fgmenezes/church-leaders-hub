
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSmallGroups } from '@/contexts/SmallGroupsContext';
import { useMembers } from '@/contexts/MembersContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPhoneNumber } from '@/utils/formatters';
import { Calendar, Clock, UserPlus } from 'lucide-react';

type Visitante = {
  nome: string;
  telefone: string;
  convidadoPor: string;
};

export const AttendanceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { smallGroups, registerAttendance, getSmallGroupById } = useSmallGroups();
  const { members } = useMembers();
  
  const [smallGroup, setSmallGroup] = useState<SmallGroup | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [membrosPresentes, setMembrosPresentes] = useState<string[]>([]);
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [novoVisitante, setNovoVisitante] = useState<Visitante>({
    nome: '',
    telefone: '',
    convidadoPor: '',
  });
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Carregar dados do pequeno grupo
  useEffect(() => {
    if (id) {
      const group = getSmallGroupById(id);
      if (group) {
        setSmallGroup(group);
      } else {
        navigate('/pequenos-grupos');
        toast({
          title: "Grupo não encontrado",
          description: "O pequeno grupo solicitado não foi encontrado.",
          variant: "destructive",
        });
      }
    }
  }, [id, smallGroups, navigate, toast, getSmallGroupById]);
  
  // Membros filtrados que pertencem a este pequeno grupo
  const membrosDoPequenoGrupo = members.filter(membro => 
    smallGroup?.membros.includes(membro.id)
  );
  
  // Manipular alteração da seleção de membros presentes
  const handleMembroChange = (membroId: string, checked: boolean) => {
    if (checked) {
      setMembrosPresentes(prev => [...prev, membroId]);
    } else {
      setMembrosPresentes(prev => prev.filter(id => id !== membroId));
    }
  };
  
  // Adicionar novo visitante
  const handleAddVisitante = () => {
    if (novoVisitante.nome.trim() === '') {
      toast({
        title: "Nome obrigatório",
        description: "O nome do visitante é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    setVisitantes(prev => [...prev, { ...novoVisitante }]);
    setNovoVisitante({
      nome: '',
      telefone: '',
      convidadoPor: '',
    });
  };
  
  // Remover visitante
  const handleRemoveVisitante = (index: number) => {
    setVisitantes(prev => prev.filter((_, i) => i !== index));
  };
  
  // Salvar registro de presença
  const handleSaveAttendance = () => {
    if (!smallGroup || !id) return;
    
    if (membrosPresentes.length === 0 && visitantes.length === 0) {
      toast({
        title: "Nenhum participante",
        description: "Adicione pelo menos um membro ou visitante presente.",
        variant: "destructive",
      });
      return;
    }
    
    const novoRegistro = {
      id: `${Date.now()}`,
      data: date,
      membrosPresentes,
      visitantes,
    };
    
    registerAttendance(id, novoRegistro);
    toast({
      title: "Presença registrada",
      description: `Registro de presença para ${formatDate(date)} salvo com sucesso.`,
    });
    
    // Retornar para a página de detalhes do grupo
    navigate(`/pequenos-grupos/${id}`);
  };
  
  // Format phone input
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(value);
    setNovoVisitante({...novoVisitante, telefone: formattedValue});
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registro de Presença - {smallGroup?.nome}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date">Data do Encontro</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Membros Presentes</h3>
            {membrosDoPequenoGrupo.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {membrosDoPequenoGrupo.map((membro) => (
                  <div key={membro.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`membro-${membro.id}`}
                      checked={membrosPresentes.includes(membro.id)}
                      onCheckedChange={(checked) => 
                        handleMembroChange(membro.id, checked === true)
                      }
                    />
                    <Label htmlFor={`membro-${membro.id}`}>{membro.nome}</Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Não há membros vinculados a este pequeno grupo.
              </p>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Visitantes</h3>
            
            {visitantes.length > 0 && (
              <div className="space-y-4 mb-4">
                {visitantes.map((visitante, index) => (
                  <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                    <div>
                      <p className="font-medium">{visitante.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {visitante.telefone} • Convidado por: {visitante.convidadoPor || "Não informado"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVisitante(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border rounded-md p-4 space-y-3">
              <h4 className="font-medium flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Adicionar Visitante
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visitor-name">Nome</Label>
                  <Input
                    id="visitor-name"
                    value={novoVisitante.nome}
                    onChange={(e) => setNovoVisitante({...novoVisitante, nome: e.target.value})}
                    placeholder="Nome do visitante"
                  />
                </div>
                
                <div>
                  <Label htmlFor="visitor-phone">Telefone</Label>
                  <Input
                    id="visitor-phone"
                    value={novoVisitante.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="invited-by">Convidado por</Label>
                  <Input
                    id="invited-by"
                    value={novoVisitante.convidadoPor}
                    onChange={(e) => setNovoVisitante({...novoVisitante, convidadoPor: e.target.value})}
                    placeholder="Nome de quem convidou"
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddVisitante}
                variant="outline"
                className="mt-2"
              >
                Adicionar Visitante
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/pequenos-grupos/${id}`)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveAttendance}>
            Salvar Registro de Presença
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
