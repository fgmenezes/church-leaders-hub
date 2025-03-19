
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

// Esquema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(10, { message: "Telefone inválido" }),
  ministerio: z.string().min(1, { message: "Selecione um ministério" }),
  motivo: z.string().min(30, { message: "Por favor, forneça mais detalhes sobre seu interesse (mínimo 30 caracteres)" }),
  disponibilidade: z.string().min(1, { message: "Selecione sua disponibilidade" })
});

type FormValues = z.infer<typeof formSchema>;

const AutoIndicacao = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      ministerio: "",
      motivo: "",
      disponibilidade: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log("Dados enviados:", data);
    
    // Aqui seria implementada a lógica de envio para um backend
    
    toast({
      title: "Indicação enviada com sucesso!",
      description: "Sua indicação foi recebida e será avaliada pela liderança.",
      action: <CheckCircle className="h-4 w-4" />
    });
    
    // Limpar formulário e redirecionar para dashboard após 1.5 segundos
    form.reset();
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Auto Indicação" 
        description="Candidate-se para servir em um dos nossos ministérios"
      />
      
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-sm border p-6 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="ministerio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ministério de Interesse</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ministério" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="louvor">Louvor</SelectItem>
                      <SelectItem value="infantil">Infantil</SelectItem>
                      <SelectItem value="jovens">Jovens</SelectItem>
                      <SelectItem value="comunicacao">Comunicação</SelectItem>
                      <SelectItem value="acolhimento">Acolhimento</SelectItem>
                      <SelectItem value="intercessao">Intercessão</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escolha o ministério com o qual você mais se identifica
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Por que você quer servir neste ministério?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva suas motivações, dons e experiências relevantes..." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="disponibilidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidade</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua disponibilidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diasuteis">Dias úteis</SelectItem>
                      <SelectItem value="finssemana">Fins de semana</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Quando você estaria disponível para servir
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Enviar Indicação
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AutoIndicacao;
