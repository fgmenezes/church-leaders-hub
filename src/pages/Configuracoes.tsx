
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Lock, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Configuracoes = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso",
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Configurações" 
        description="Personalize as configurações da sua organização"
      />
      
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="geral">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="conta">
            <User className="h-4 w-4 mr-2" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Lock className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="idioma">
            <Globe className="h-4 w-4 mr-2" />
            Idioma e Região
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Ajuste as configurações gerais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Nome da Organização</Label>
                  <Input id="org-name" placeholder="Nome da sua organização" defaultValue="Minha Organização" />
                </div>
                
                <div>
                  <Label htmlFor="org-email">E-mail da Organização</Label>
                  <Input id="org-email" type="email" placeholder="contato@suaorganizacao.com" />
                </div>
                
                <div>
                  <Label htmlFor="org-phone">Telefone da Organização</Label>
                  <Input id="org-phone" placeholder="(00) 00000-0000" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Preferências da Plataforma</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar tema escuro para a plataforma
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Animações</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar animações da interface
                    </p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Preferências de Notificações</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por e-mail
                    </p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notif">Notificações no Navegador</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações no navegador
                    </p>
                  </div>
                  <Switch id="browser-notif" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminder-notif">Lembretes de Eventos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber lembretes de eventos
                    </p>
                  </div>
                  <Switch id="reminder-notif" defaultChecked />
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conta">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-name">Nome</Label>
                  <Input id="user-name" placeholder="Seu nome" defaultValue="Administrador" />
                </div>
                
                <div>
                  <Label htmlFor="user-email">E-mail</Label>
                  <Input id="user-email" type="email" defaultValue="admin@igreja.com" />
                </div>
                
                <div>
                  <Label htmlFor="user-role">Função</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Autenticação de Dois Fatores</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa">Ativar Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="idioma">
          <Card>
            <CardHeader>
              <CardTitle>Idioma e Região</CardTitle>
              <CardDescription>
                Configure suas preferências de idioma e região
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="pt-BR">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="region">Região</Label>
                  <Select defaultValue="BR">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BR">Brasil</SelectItem>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="ES">Espanha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="America/Sao_Paulo">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (GMT-4)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
