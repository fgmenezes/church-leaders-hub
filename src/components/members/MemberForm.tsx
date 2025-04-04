
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Membro } from "@/contexts/MembersContext";
import { estadosBrasileiros } from "@/utils/estados-brasileiros";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the schema for form validation
const memberFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  funcao: z.string().min(1, "Função é obrigatória"),
  status: z.string().default("ativo"),
  dataNascimento: z.string().optional(),
  dataIngresso: z.string().optional(),
  localNascimento: z.string().optional(),
  batizado: z.boolean().optional(),
  endereco: z.object({
    rua: z.string().optional(),
    numero: z.string().optional(),
    cep: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
  }).optional(),
  responsaveis: z.object({
    pai: z.object({
      nome: z.string().optional(),
      telefone: z.string().optional(),
    }).optional(),
    mae: z.object({
      nome: z.string().optional(),
      telefone: z.string().optional(),
    }).optional(),
  }).optional(),
  habilidades: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

interface MemberFormProps {
  defaultValues?: Partial<Membro>;
  isEditing: boolean;
  onSubmit: (data: Membro) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ defaultValues, isEditing, onSubmit }) => {
  const navigate = useNavigate();
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      nome: defaultValues?.nome || "",
      email: defaultValues?.email || "",
      telefone: defaultValues?.telefone || "",
      funcao: defaultValues?.funcao || "",
      status: defaultValues?.status || "ativo", // Default to active
      dataNascimento: defaultValues?.dataNascimento || "",
      dataIngresso: defaultValues?.dataIngresso || new Date().toLocaleDateString('pt-BR'),
      localNascimento: defaultValues?.localNascimento || "",
      batizado: defaultValues?.batizado || false,
      endereco: {
        rua: defaultValues?.endereco?.rua || "",
        numero: defaultValues?.endereco?.numero || "",
        cep: defaultValues?.endereco?.cep || "",
        bairro: defaultValues?.endereco?.bairro || "",
        cidade: defaultValues?.endereco?.cidade || "",
        estado: defaultValues?.endereco?.estado || "",
      },
      responsaveis: {
        pai: {
          nome: defaultValues?.responsaveis?.pai?.nome || "",
          telefone: defaultValues?.responsaveis?.pai?.telefone || "",
        },
        mae: {
          nome: defaultValues?.responsaveis?.mae?.nome || "",
          telefone: defaultValues?.responsaveis?.mae?.telefone || "",
        },
      },
      habilidades: defaultValues?.habilidades || [],
      observacoes: defaultValues?.observacoes || "",
    },
  });

  const handleFormSubmit = (values: MemberFormValues) => {
    const memberData: Membro = {
      id: defaultValues?.id || `new-${Date.now()}`,
      nome: values.nome,
      email: values.email || "",
      telefone: values.telefone,
      funcao: values.funcao,
      status: values.status,
      dataNascimento: values.dataNascimento,
      dataIngresso: values.dataIngresso,
      localNascimento: values.localNascimento,
      batizado: values.batizado,
      endereco: values.endereco,
      responsaveis: values.responsaveis,
      habilidades: values.habilidades,
      observacoes: values.observacoes,
    };
    
    onSubmit(memberData);
  };

  // Format date input as dd/mm/yyyy
  const formatDate = (value: string) => {
    // Remove non-numeric characters
    let numbers = value.replace(/\D/g, '');
    
    // Limit to 8 digits (ddmmyyyy)
    numbers = numbers.substring(0, 8);
    
    // Format as dd/mm/yyyy
    if (numbers.length > 4) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4)}`;
    } else if (numbers.length > 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
    }
    return numbers;
  };

  // Format phone number as (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    // Remove non-numeric characters
    let numbers = value.replace(/\D/g, '');
    
    // Limit to 11 digits
    numbers = numbers.substring(0, 11);
    
    // Format as (XX) XXXXX-XXXX
    if (numbers.length > 7) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    } else if (numbers.length > 2) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    } else if (numbers.length > 0) {
      return `(${numbers}`;
    }
    return numbers;
  };

  // Format CEP as XXXXX-XXX
  const formatCEP = (value: string) => {
    // Remove non-numeric characters
    let numbers = value.replace(/\D/g, '');
    
    // Limit to 8 digits
    numbers = numbers.substring(0, 8);
    
    // Format as XXXXX-XXX
    if (numbers.length > 5) {
      return `${numbers.substring(0, 5)}-${numbers.substring(5)}`;
    }
    return numbers;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-semibold mb-6">Dados Pessoais</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome completo */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Data de nascimento */}
              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento (DD/MM/AAAA)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="DD/MM/AAAA" 
                        {...field} 
                        value={field.value || ""} 
                        onChange={(e) => {
                          const formattedDate = formatDate(e.target.value);
                          field.onChange(formattedDate);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Local de nascimento */}
              <FormField
                control={form.control}
                name="localNascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Nascimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade natal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status do membro - ACTIVE/INACTIVE toggle */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Status do Membro</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value === "ativo" ? "Membro Ativo" : "Membro Inativo"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "ativo"}
                        onCheckedChange={(checked) => field.onChange(checked ? "ativo" : "inativo")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Telefone */}
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => {
                          const formattedPhone = formatPhone(e.target.value);
                          field.onChange(formattedPhone);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Batizado */}
              <FormField
                control={form.control}
                name="batizado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Batizado
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Função */}
              <FormField
                control={form.control}
                name="funcao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função no Ministério*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Vocal, Guitarrista, Pastor..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Data de ingresso */}
              <FormField
                control={form.control}
                name="dataIngresso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Ingresso (DD/MM/AAAA)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="DD/MM/AAAA"
                        {...field} 
                        value={field.value || ""} 
                        onChange={(e) => {
                          const formattedDate = formatDate(e.target.value);
                          field.onChange(formattedDate);
                        }}
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
            <div className="text-xl font-semibold mb-6">Endereço</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CEP */}
              <FormField
                control={form.control}
                name="endereco.cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00000-000" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => {
                          const formattedCEP = formatCEP(e.target.value);
                          field.onChange(formattedCEP);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Rua */}
              <FormField
                control={form.control}
                name="endereco.rua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Número */}
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
              
              {/* Bairro */}
              <FormField
                control={form.control}
                name="endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Cidade */}
              <FormField
                control={form.control}
                name="endereco.cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Estado - DROPDOWN WITH BRAZILIAN STATES */}
              <FormField
                control={form.control}
                name="endereco.estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estadosBrasileiros.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label} ({estado.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-semibold mb-6">Responsáveis (para menores)</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do pai */}
              <FormField
                control={form.control}
                name="responsaveis.pai.nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Pai</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do pai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Telefone do pai */}
              <FormField
                control={form.control}
                name="responsaveis.pai.telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Pai</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const formattedPhone = formatPhone(e.target.value);
                          field.onChange(formattedPhone);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Nome da mãe */}
              <FormField
                control={form.control}
                name="responsaveis.mae.nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Mãe</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo da mãe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Telefone da mãe */}
              <FormField
                control={form.control}
                name="responsaveis.mae.telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone da Mãe</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const formattedPhone = formatPhone(e.target.value);
                          field.onChange(formattedPhone);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => navigate('/membros')}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Atualizar" : "Cadastrar"} Membro
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberForm;
