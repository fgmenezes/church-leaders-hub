
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';

export default function UserProfile() {
  const { user } = useAuth();
  
  // Get initials from user name
  const getInitials = () => {
    if (!user?.name) return "U";
    
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <>
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais"
      />
    
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user?.name || "Usuário"}</CardTitle>
              <CardDescription>{user?.role === 'leader' ? 'Líder de Ministério' : 'Usuário'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{user?.id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>admin@igreja.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Informações pessoais do usuário</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                      <p>{user?.name || "Líder do Ministério"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Função</p>
                      <p>{user?.role === 'leader' ? 'Líder de Ministério' : 'Usuário'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p>(11) 99999-9999</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                      <p>01/01/1980</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gênero</p>
                      <p>Masculino</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estado Civil</p>
                      <p>Casado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="address" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>Informações de endereço</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CEP</p>
                      <p>01234-567</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                      <p>Rua Exemplo, 123</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                      <p>Apto 101</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                      <p>Centro</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                      <p>São Paulo</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estado</p>
                      <p>SP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
