
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useSmallGroups, SmallGroup } from '@/contexts/SmallGroupsContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatPhoneNumber, formatCep, estados } from '@/utils/formatters';

const formSchema = z.object({
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  endereco: z.object({
    rua: z.string().min(2, { message: 'Rua é obrigatória' }),
    numero: z.string(),
    cep: z.string().min(8, { message: 'CEP deve ter 8 dígitos' }).max(9),
    bairro: z.string().min(2, { message: 'Bairro é obrigatório' }),
    cidade: z.string().min(2, { message: 'Cidade é obrigatória' }),
    estado: z.string().min(2, { message: 'Estado é obrigatório' }),
  }),
  responsavel: z.object({
    nome: z.string().min(2, { message: 'Nome do responsável é obrigatório' }),
    telefone: z.string().min(10, { message: 'Telefone deve ter no mínimo 10 dígitos' }),
    email: z.string().email({ message: 'Email inválido' }),
  }),
  frequencia: z.string().min(1, { message: 'Frequência é obrigatória' }),
  diaSemana: z.string().min(1, { message: 'Dia da semana é obrigatório' }),
  horario: z.string().min(1, { message: 'Horário é obrigatório' }),
  descricao: z.string().optional(),
});

interface SmallGroupFormProps {
  smallGroup?: SmallGroup;
  onSuccess?: () => void;
}

export const SmallGroupForm: React.FC<SmallGroupFormProps> = ({ 
  smallGroup,
  onSuccess 
}) => {
  const { addSmallGroup, updateSmallGroup } = useSmallGroups();
  const isEditing = !!smallGroup;
  
  // Initialize form with existing data or defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: smallGroup?.nome || '',
      endereco: {
        rua: smallGroup?.endereco?.rua || '',
        numero: smallGroup?.endereco?.numero || '',
        cep: smallGroup?.endereco?.cep || '',
        bairro: smallGroup?.endereco?.bairro || '',
        cidade: smallGroup?.endereco?.cidade || '',
        estado: smallGroup?.endereco?.estado || '',
      },
      responsavel: {
        nome: smallGroup?.responsavel?.nome || '',
        telefone: smallGroup?.responsavel?.telefone || '',
        email: smallGroup?.responsavel?.email || '',
      },
      frequencia: smallGroup?.frequencia || '',
      diaSemana: smallGroup?.diaSemana || '',
      horario: smallGroup?.horario || '',
      descricao: smallGroup?.descricao || '',
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Create or update the small group
    if (isEditing && smallGroup) {
      updateSmallGroup({
        ...smallGroup,
        ...data,
      });
    } else {
      addSmallGroup({
        ...data,
        id: `${Date.now()}`,
        membros: [],
        chamadas: []
      });
    }
    
    // Call the success callback if provided
    if (onSuccess) onSuccess();
  };
  
  // Format phone number as user types
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(value);
    onChange(formattedValue);
  };
  
  // Format CEP as user types
  const handleCepChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = formatCep(value);
    onChange(formattedValue);
  };
  
  const diasSemana = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  
  const frequencias = [
    'diario', 'semanal', 'quinzenal', 'mensal'
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="frequencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência dos Encontros</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="" disabled>Selecione a frequência</option>
                          {frequencias.map((frequencia) => (
                            <option key={frequencia} value={frequencia}>
                              {frequencia.charAt(0).toUpperCase() + frequencia.slice(1)}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diaSemana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia da Semana</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="" disabled>Selecione um dia</option>
                          {diasSemana.map((dia) => (
                            <option key={dia} value={dia}>{dia}</option>
                          ))}
                        </select>
                      </FormControl>
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
                        <Input
                          type="time"
                          placeholder="19:00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do pequeno grupo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informações do Responsável</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="responsavel.nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsavel.telefone"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Telefone do Responsável</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          {...rest}
                          onChange={(e) => handlePhoneChange(e, onChange)}
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
                      <FormLabel>Email do Responsável</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@exemplo.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Endereço do Encontro</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endereco.cep"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...rest}
                          onChange={(e) => handleCepChange(e, onChange)}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="endereco.rua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua/Avenida" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="endereco.numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endereco.cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
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
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="" disabled>Selecione um estado</option>
                          {estados.map((estado) => (
                            <option key={estado.sigla} value={estado.sigla}>
                              {estado.sigla}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">
            {isEditing ? 'Atualizar Pequeno Grupo' : 'Adicionar Pequeno Grupo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
