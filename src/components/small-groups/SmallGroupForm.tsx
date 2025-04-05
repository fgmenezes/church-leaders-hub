import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSmallGroups } from '@/contexts/SmallGroupsContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { estadosBrasileiros } from '@/utils/estados-brasileiros';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPhoneNumber } from '@/utils/formatters';

// Schema para validação do formulário
const formSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  descricao: z.string().optional(),
  endereco: z.object({
    rua: z.string().min(3, { message: 'A rua deve ter pelo menos 3 caracteres' }),
    numero: z.string(),
    cep: z.string().min(8, { message: 'CEP inválido' }).max(9),
    bairro: z.string().min(2, { message: 'O bairro deve ter pelo menos 2 caracteres' }),
    cidade: z.string().min(2, { message: 'A cidade deve ter pelo menos 2 caracteres' }),
    estado: z.string().min(2, { message: 'Selecione um estado' }),
  }),
  responsavel: z.object({
    nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    telefone: z.string().min(8, { message: 'Telefone inválido' }),
    email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  }),
  frequencia: z.enum(['diaria', 'semanal', 'quinzenal', 'mensal']),
  diaSemana: z.enum(['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']).optional(),
  horario: z.string().optional(),
});

interface SmallGroupFormProps {
  smallGroup?: SmallGroup;
  onSuccess?: () => void;
}

export const SmallGroupForm = ({ smallGroup, onSuccess }: SmallGroupFormProps) => {
  const { addSmallGroup, updateSmallGroup } = useSmallGroups();
  const isEditing = !!smallGroup;
  
  // Inicializar o form com os valores do grupo sendo editado, se houver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
          nome: smallGroup.nome,
          descricao: smallGroup.descricao || '',
          endereco: {
            rua: smallGroup.endereco.rua,
            numero: smallGroup.endereco.numero,
            cep: smallGroup.endereco.cep,
            bairro: smallGroup.endereco.bairro,
            cidade: smallGroup.endereco.cidade,
            estado: smallGroup.endereco.estado,
          },
          responsavel: {
            nome: smallGroup.responsavel.nome,
            telefone: smallGroup.responsavel.telefone,
            email: smallGroup.responsavel.email || '',
          },
          frequencia: smallGroup.frequencia || 'semanal',
          diaSemana: smallGroup.diaSemana || 'domingo',
          horario: smallGroup.horario || '',
        }
      : {
          nome: '',
          descricao: '',
          endereco: {
            rua: '',
            numero: '',
            cep: '',
            bairro: '',
            cidade: '',
            estado: '',
          },
          responsavel: {
            nome: '',
            telefone: '',
            email: '',
          },
          frequencia: 'semanal',
          diaSemana: 'domingo',
          horario: '',
        },
  });
  
  // Formatar telefone durante digitação
  const formatarTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(value);
    form.setValue('responsavel.telefone', formattedValue);
  };
  
  // Formatar CEP durante digitação
  const formatarCEP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.length > 5 
      ? `${value.slice(0, 5)}-${value.slice(5, 8)}`
      : value;
    form.setValue('endereco.cep', formattedValue);
  };
  
  // Enviar dados do formulário
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Create or update the small group
    if (isEditing && smallGroup) {
      // Certifique-se de que todos os campos requeridos do smallGroup sejam preservados
      updateSmallGroup({
        ...smallGroup,
        nome: data.nome,
        endereco: {
          rua: data.endereco.rua,
          numero: data.endereco.numero,
          cep: data.endereco.cep,
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
          estado: data.endereco.estado,
        },
        responsavel: {
          nome: data.responsavel.nome,
          telefone: data.responsavel.telefone,
          email: data.responsavel.email,
        },
        frequencia: data.frequencia,
        diaSemana: data.diaSemana,
        horario: data.horario,
        descricao: data.descricao,
      });
    } else {
      // Criar um novo pequeno grupo com os campos obrigatórios
      const novoGrupo: SmallGroup = {
        id: `${Date.now()}`,
        nome: data.nome,
        endereco: {
          rua: data.endereco.rua,
          numero: data.endereco.numero,
          cep: data.endereco.cep,
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
          estado: data.endereco.estado,
        },
        responsavel: {
          nome: data.responsavel.nome,
          telefone: data.responsavel.telefone,
          email: data.responsavel.email,
        },
        frequencia: data.frequencia,
        diaSemana: data.diaSemana,
        horario: data.horario,
        descricao: data.descricao,
        membros: [],
        chamadas: []
      };
      
      addSmallGroup(novoGrupo);
    }
    
    // Call the success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Pequeno Grupo' : 'Novo Pequeno Grupo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Pequeno Grupo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do grupo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva brevemente o objetivo ou foco deste grupo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-muted/50 p-4 rounded-md space-y-4">
                <h3 className="font-medium">Encontros</h3>
                
                <FormField
                  control={form.control}
                  name="frequencia"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Frequência</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="diaria" id="diaria" />
                            <FormLabel htmlFor="diaria" className="font-normal">Diária</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="semanal" id="semanal" />
                            <FormLabel htmlFor="semanal" className="font-normal">Semanal</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quinzenal" id="quinzenal" />
                            <FormLabel htmlFor="quinzenal" className="font-normal">Quinzenal</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mensal" id="mensal" />
                            <FormLabel htmlFor="mensal" className="font-normal">Mensal</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="diaSemana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia da Semana</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o dia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="domingo">Domingo</SelectItem>
                            <SelectItem value="segunda">Segunda-feira</SelectItem>
                            <SelectItem value="terca">Terça-feira</SelectItem>
                            <SelectItem value="quarta">Quarta-feira</SelectItem>
                            <SelectItem value="quinta">Quinta-feira</SelectItem>
                            <SelectItem value="sexta">Sexta-feira</SelectItem>
                            <SelectItem value="sabado">Sábado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="horario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md space-y-4">
                <h3 className="font-medium">Endereço</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.rua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endereco.numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input 
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              formatarCEP(e);
                            }}
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endereco.bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endereco.estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadosBrasileiros.map((estado) => (
                              <SelectItem 
                                key={estado.value} 
                                value={estado.value}
                              >
                                {estado.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md space-y-4">
                <h3 className="font-medium">Responsável pelo Local</h3>
                
                <FormField
                  control={form.control}
                  name="responsavel.nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsavel.telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input 
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              formatarTelefone(e);
                            }}
                            maxLength={15}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="responsavel.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (opcional)</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <CardFooter className="px-0 pb-0">
              <Button type="submit">
                {isEditing ? 'Salvar Alterações' : 'Criar Pequeno Grupo'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
