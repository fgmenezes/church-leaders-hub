
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useSmallGroups } from '@/contexts/SmallGroupsContext';
import { formatPhoneNumber } from '@/utils/formatters';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash } from 'lucide-react';

// Define los esquemas para validación
const visitanteSchema = z.object({
  nome: z.string().min(2, { message: 'Nome obrigatório' }),
  telefone: z.string().min(8, { message: 'Telefone inválido' }),
  convidadoPor: z.string().min(2, { message: 'Indique quem convidou' }),
});

const chamadaSchema = z.object({
  data: z.string().min(1, { message: 'Data obrigatória' }),
  membrosPresentes: z.array(z.string()),
  visitantes: z.array(visitanteSchema).optional(),
});

interface Membro {
  id: string;
  nome: string;
}

interface AttendanceFormProps {
  smallGroupId: string;
  groupMembers: Membro[];
  onSuccess?: () => void;
}

export const AttendanceForm = ({ smallGroupId, groupMembers, onSuccess }: AttendanceFormProps) => {
  const { toast } = useToast();
  const { registerAttendance } = useSmallGroups();
  const [visitantes, setVisitantes] = useState<{id: string; nome: string; telefone: string; convidadoPor: string;}[]>([]);
  
  // Configurar formulário com react-hook-form
  const form = useForm<z.infer<typeof chamadaSchema>>({
    resolver: zodResolver(chamadaSchema),
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      membrosPresentes: [],
      visitantes: [],
    },
  });
  
  // Adicionar um novo visitante vazio
  const addVisitante = () => {
    const newVisitante = {
      id: `visitante-${Date.now()}`,
      nome: '',
      telefone: '',
      convidadoPor: '',
    };
    setVisitantes(prev => [...prev, newVisitante]);
  };
  
  // Remover um visitante
  const removeVisitante = (id: string) => {
    setVisitantes(prev => prev.filter(v => v.id !== id));
  };
  
  // Atualizar os dados de um visitante
  const updateVisitante = (id: string, field: string, value: string) => {
    setVisitantes(prev => 
      prev.map(v => {
        if (v.id === id) {
          if (field === 'telefone') {
            // Formatar telefone
            const formattedPhone = formatPhoneNumber(value.replace(/\D/g, ''));
            return { ...v, [field]: formattedPhone };
          }
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };
  
  // Registrar a chamada
  const onSubmit = (data: z.infer<typeof chamadaSchema>) => {
    // Filtrar visitantes com nome preenchido
    const validVisitantes = visitantes.filter(v => v.nome.trim() !== '');
    
    // Criar registro de chamada
    const attendanceRecord = {
      id: `chamada-${Date.now()}`,
      data: data.data,
      membrosPresentes: data.membrosPresentes,
      visitantes: validVisitantes,
    };
    
    // Registrar no contexto
    registerAttendance(smallGroupId, attendanceRecord);
    
    // Mostrar confirmação
    toast({
      title: "Presença registrada",
      description: `Registro de presença adicionado com sucesso.`,
    });
    
    // Resetar formulário
    form.reset({
      data: new Date().toISOString().split('T')[0],
      membrosPresentes: [],
      visitantes: [],
    });
    setVisitantes([]);
    
    // Chamar callback de sucesso
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Presença</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Data do encontro */}
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Encontro</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Lista de membros para marcar presença */}
            <div className="space-y-4">
              <FormLabel>Membros Presentes</FormLabel>
              
              {groupMembers.length === 0 ? (
                <p className="text-muted-foreground">
                  Este grupo não possui membros. Adicione membros ao grupo primeiro.
                </p>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {groupMembers.map(member => (
                    <FormField
                      key={member.id}
                      control={form.control}
                      name="membrosPresentes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(member.id)}
                              onCheckedChange={(checked) => {
                                const updatedList = checked
                                  ? [...field.value, member.id]
                                  : field.value?.filter((value) => value !== member.id);
                                
                                field.onChange(updatedList);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {member.nome}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Seção de visitantes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Visitantes</FormLabel>
                <Button 
                  type="button" 
                  onClick={addVisitante} 
                  variant="outline" 
                  size="sm"
                >
                  Adicionar Visitante
                </Button>
              </div>
              
              {visitantes.length === 0 ? (
                <p className="text-muted-foreground">
                  Nenhum visitante adicionado. Clique em "Adicionar Visitante" se houver visitantes.
                </p>
              ) : (
                <div className="space-y-6">
                  {visitantes.map((visitante, idx) => (
                    <div key={visitante.id} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Visitante {idx + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVisitante(visitante.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-2">
                          <FormLabel>Nome</FormLabel>
                          <Input
                            value={visitante.nome}
                            onChange={(e) => updateVisitante(visitante.id, 'nome', e.target.value)}
                            placeholder="Nome do visitante"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <FormLabel>Telefone</FormLabel>
                          <Input
                            value={visitante.telefone}
                            onChange={(e) => updateVisitante(visitante.id, 'telefone', e.target.value)}
                            placeholder="Telefone para contato"
                            maxLength={15}
                          />
                        </div>
                        
                        <div className="space-y-2 sm:col-span-2">
                          <FormLabel>Convidado por</FormLabel>
                          <Input
                            value={visitante.convidadoPor}
                            onChange={(e) => updateVisitante(visitante.id, 'convidadoPor', e.target.value)}
                            placeholder="Quem convidou este visitante?"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit">
              Registrar Presença
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
