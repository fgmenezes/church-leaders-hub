
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatDateInput, formatPhoneNumber } from '@/utils/formatters';
import { useSmallGroups, Visitor } from '@/contexts/SmallGroupsContext';
import { Membro } from '@/contexts/MembersContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Check } from 'lucide-react';

const visitanteSchema = z.object({
  nome: z.string().min(2, { message: 'Nome é obrigatório' }),
  telefone: z.string().min(10, { message: 'Telefone deve ter no mínimo 10 dígitos' }),
  convidadoPor: z.string().min(2, { message: 'Informe quem convidou o visitante' }),
});

const formSchema = z.object({
  data: z.string().min(10, { message: 'Data é obrigatória' }),
  membrosPresentes: z.array(z.string()).min(1, { message: 'Marque pelo menos um membro presente' }),
});

interface AttendanceFormProps {
  groupId: string;
  membros: Membro[];
  onSuccess?: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ 
  groupId,
  membros,
  onSuccess
}) => {
  const { addAttendance } = useSmallGroups();
  const [visitantes, setVisitantes] = useState<Visitor[]>([]);
  const [novoVisitante, setNovoVisitante] = useState({
    nome: '',
    telefone: '',
    convidadoPor: '',
  });
  const [visitanteError, setVisitanteError] = useState<string | null>(null);
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date().toLocaleDateString('pt-BR'),
      membrosPresentes: [],
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Create a new attendance record
    addAttendance(groupId, {
      data: data.data,
      membrosPresentes: data.membrosPresentes,
      visitantes: visitantes,
    });
    
    // Reset form
    form.reset({
      data: new Date().toLocaleDateString('pt-BR'),
      membrosPresentes: [],
    });
    setVisitantes([]);
    
    // Call the success callback if provided
    if (onSuccess) onSuccess();
  };
  
  // Handle add visitor
  const handleAddVisitante = () => {
    // Validate visitor data
    try {
      visitanteSchema.parse(novoVisitante);
      
      // Add to visitors list
      const newVisitor: Visitor = {
        ...novoVisitante,
        id: `v-${Date.now()}`,
      };
      
      setVisitantes(prev => [...prev, newVisitor]);
      
      // Reset form
      setNovoVisitante({
        nome: '',
        telefone: '',
        convidadoPor: '',
      });
      setVisitanteError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        setVisitanteError(firstError.message);
      }
    }
  };
  
  // Handle remove visitor
  const handleRemoveVisitante = (id: string) => {
    setVisitantes(prev => prev.filter(v => v.id !== id));
  };
  
  // Format date input
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const formattedValue = formatDateInput(e.target.value);
    onChange(formattedValue);
  };
  
  // Format phone input - corrigido para não usar SetStateAction
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
          <CardTitle>Registrar Presença</CardTitle>
          <CardDescription>
            Marque os membros presentes e registre visitantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="data"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Data do Encontro</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="dd/mm/aaaa"
                        {...rest}
                        onChange={(e) => handleDateChange(e, onChange)}
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel className="block mb-3">Membros Presentes</FormLabel>
                {membros.length === 0 ? (
                  <p className="text-muted-foreground py-2">
                    Este grupo não tem membros cadastrados.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                    {membros.map(membro => (
                      <FormField
                        key={membro.id}
                        control={form.control}
                        name="membrosPresentes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(membro.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  
                                  if (checked) {
                                    field.onChange([...currentValue, membro.id]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter((value) => value !== membro.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {membro.nome}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}
                <FormMessage>
                  {form.formState.errors.membrosPresentes?.message}
                </FormMessage>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-medium mb-2">Visitantes</h3>
                  
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <FormLabel htmlFor="visitor-name">Nome</FormLabel>
                        <Input
                          id="visitor-name"
                          value={novoVisitante.nome}
                          onChange={(e) => setNovoVisitante({...novoVisitante, nome: e.target.value})}
                          placeholder="Nome do visitante"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor="visitor-phone">Telefone</FormLabel>
                        <Input
                          id="visitor-phone"
                          value={novoVisitante.telefone}
                          onChange={handlePhoneChange}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor="visitor-invitedBy">Convidado por</FormLabel>
                        <Input
                          id="visitor-invitedBy"
                          value={novoVisitante.convidadoPor}
                          onChange={(e) => setNovoVisitante({...novoVisitante, convidadoPor: e.target.value})}
                          placeholder="Quem convidou?"
                        />
                      </div>
                    </div>
                    
                    {visitanteError && (
                      <p className="text-sm font-medium text-destructive mb-3">{visitanteError}</p>
                    )}
                    
                    <Button 
                      type="button" 
                      onClick={handleAddVisitante}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Visitante
                    </Button>
                    
                    {visitantes.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Visitantes adicionados:</h4>
                        <div className="space-y-2">
                          {visitantes.map(visitante => (
                            <div key={visitante.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                              <div>
                                <span className="font-medium">{visitante.nome}</span>
                                <span className="text-muted-foreground text-sm ml-2">
                                  {visitante.telefone}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveVisitante(visitante.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  Registrar Presença
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
