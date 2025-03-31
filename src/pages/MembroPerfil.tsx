
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, Mail, Phone, UserRound, Music, CalendarClock, Save, X, Pencil, Map, Home, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMembers, Membro } from '@/contexts/MembersContext';

const MembroPerfil = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [membro, setMembro] = useState<Membro | null>(null);
  const [editedMembro, setEditedMembro] = useState<Membro | null>(null);
  
  const { getMember, updateMember, addMember } = useMembers();
  
  const isEditMode = location.pathname.includes('/editar/');
  const isNewMode = location.pathname.includes('/novo');

  useEffect(() => {
    const buscarMembro = () => {
      setLoading(true);
      
      if (isNewMode) {
        const novoMembro: Membro = {
          id: `new-${Date.now()}`,
          nome: '',
          email: '',
          telefone: '',
          funcao: '',
          status: 'ativo',
          endereco: {
            rua: '',
            numero: '',
            cep: '',
            bairro: '',
            cidade: '',
            estado: ''
          },
          batizado: false,
          responsaveis: {
            pai: { nome: '', telefone: '' },
            mae: { nome: '', telefone: '' }
          }
        };
        setMembro(novoMembro);
        setEditedMembro(novoMembro);
        setLoading(false);
      } else if (id) {
        const membroEncontrado = getMember(id);
        
        setTimeout(() => {
          setMembro(membroEncontrado);
          setEditedMembro(membroEncontrado ? {...membroEncontrado} : null);
          setLoading(false);
        }, 300);
      }
    };
    
    buscarMembro();
  }, [id, isNewMode, getMember]);

  const handleSave = () => {
    if (!editedMembro) return;
    
    if (isNewMode) {
      addMember(editedMembro);
      
      toast({
        title: "Membro cadastrado",
        description: "Novo membro cadastrado com sucesso!",
      });
    } else {
      updateMember(editedMembro);
      
      toast({
        title: "Alterações salvas",
        description: "As alterações foram salvas com sucesso!",
      });
    }
    
    navigate('/membros');
  };
  
  const handleCancel = () => {
    navigate('/membros');
  };
  
  const handleFieldChange = (field: string, value: any) => {
    if (!editedMembro) return;
    
    setEditedMembro(prev => {
      if (!prev) return null;
      
      // Handle nested fields
      if (field.includes('.')) {
        const [parent, child, subChild] = field.split('.');
        if (subChild) {
          // Handle deeply nested fields (e.g., responsaveis.pai.nome)
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent]?.[child],
                [subChild]: value
              }
            }
          };
        } else {
          // Handle simple nested fields (e.g., endereco.rua)
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value
            }
          };
        }
      }
      
      // Handle regular fields
      return {
        ...prev,
        [field]: value
      };
    });
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Carregando..." description="Buscando informações do membro" />
        <Card>
          <CardContent className="p-10 flex justify-center">
            <p>Carregando dados do membro...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!membro && !isNewMode) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Membro não encontrado" description="O membro solicitado não existe" />
        <Card>
          <CardContent className="p-10 flex flex-col items-center justify-center gap-4">
            <p>Não foi possível encontrar o membro com o ID: {id}</p>
            <Button onClick={() => navigate('/membros')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Lista de Membros
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isEditMode || isNewMode) {
    if (!editedMembro) return null;
    
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title={isNewMode ? "Novo Membro" : `Editar: ${membro?.nome}`}
          description={isNewMode ? "Cadastre um novo membro no ministério" : "Edite os dados do membro"}
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </PageHeader>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo*</Label>
                <Input 
                  id="nome" 
                  placeholder="Digite o nome completo"
                  value={editedMembro.nome} 
                  onChange={(e) => handleFieldChange('nome', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input 
                  id="dataNascimento" 
                  placeholder="DD/MM/AAAA"
                  value={editedMembro.dataNascimento || ''} 
                  onChange={(e) => handleFieldChange('dataNascimento', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@exemplo.com"
                  value={editedMembro.email} 
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone*</Label>
                <Input 
                  id="telefone" 
                  placeholder="(00) 00000-0000"
                  value={editedMembro.telefone} 
                  onChange={(e) => handleFieldChange('telefone', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="funcao">Função</Label>
                <Input 
                  id="funcao" 
                  placeholder="Função no ministério"
                  value={editedMembro.funcao} 
                  onChange={(e) => handleFieldChange('funcao', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataIngresso">Data de Ingresso</Label>
                <Input 
                  id="dataIngresso" 
                  placeholder="DD/MM/AAAA"
                  value={editedMembro.dataIngresso || ''} 
                  onChange={(e) => handleFieldChange('dataIngresso', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="batizado" 
                  checked={editedMembro.batizado} 
                  onCheckedChange={(checked) => handleFieldChange('batizado', !!checked)}
                />
                <Label htmlFor="batizado">Membro Batizado</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco.rua">Rua</Label>
                <Input 
                  id="endereco.rua" 
                  placeholder="Nome da rua"
                  value={editedMembro.endereco?.rua || ''} 
                  onChange={(e) => handleFieldChange('endereco.rua', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.numero">Número</Label>
                <Input 
                  id="endereco.numero" 
                  placeholder="Número"
                  value={editedMembro.endereco?.numero || ''} 
                  onChange={(e) => handleFieldChange('endereco.numero', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.cep">CEP</Label>
                <Input 
                  id="endereco.cep" 
                  placeholder="00000-000"
                  value={editedMembro.endereco?.cep || ''} 
                  onChange={(e) => handleFieldChange('endereco.cep', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.bairro">Bairro</Label>
                <Input 
                  id="endereco.bairro" 
                  placeholder="Nome do bairro"
                  value={editedMembro.endereco?.bairro || ''} 
                  onChange={(e) => handleFieldChange('endereco.bairro', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.cidade">Cidade</Label>
                <Input 
                  id="endereco.cidade" 
                  placeholder="Nome da cidade"
                  value={editedMembro.endereco?.cidade || ''} 
                  onChange={(e) => handleFieldChange('endereco.cidade', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.estado">Estado</Label>
                <Input 
                  id="endereco.estado" 
                  placeholder="UF"
                  value={editedMembro.endereco?.estado || ''} 
                  onChange={(e) => handleFieldChange('endereco.estado', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 mb-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Pai</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="responsaveis.pai.nome">Nome</Label>
                    <Input 
                      id="responsaveis.pai.nome" 
                      placeholder="Nome do pai"
                      value={editedMembro.responsaveis?.pai?.nome || ''} 
                      onChange={(e) => handleFieldChange('responsaveis.pai.nome', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsaveis.pai.telefone">Telefone</Label>
                    <Input 
                      id="responsaveis.pai.telefone" 
                      placeholder="(00) 00000-0000"
                      value={editedMembro.responsaveis?.pai?.telefone || ''} 
                      onChange={(e) => handleFieldChange('responsaveis.pai.telefone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Mãe</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="responsaveis.mae.nome">Nome</Label>
                    <Input 
                      id="responsaveis.mae.nome" 
                      placeholder="Nome da mãe"
                      value={editedMembro.responsaveis?.mae?.nome || ''} 
                      onChange={(e) => handleFieldChange('responsaveis.mae.nome', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsaveis.mae.telefone">Telefone</Label>
                    <Input 
                      id="responsaveis.mae.telefone" 
                      placeholder="(00) 00000-0000"
                      value={editedMembro.responsaveis?.mae?.telefone || ''} 
                      onChange={(e) => handleFieldChange('responsaveis.mae.telefone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Informações adicionais sobre o membro"
                value={editedMembro.observacoes || ''} 
                onChange={(e) => handleFieldChange('observacoes', e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={membro?.nome} 
        description={`Perfil do membro - ${membro?.funcao}`}
        subtitle={
          <Badge variant={membro?.status === 'ativo' ? 'default' : 'outline'} className="ml-2">
            {membro?.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </Badge>
        }
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/membros')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={() => navigate(`/membros/editar/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center my-4">
                <UserRound className="h-16 w-16 text-primary" />
              </div>
              
              <h3 className="text-xl font-medium mt-2">{membro?.nome}</h3>
              <p className="text-muted-foreground">{membro?.funcao}</p>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{membro?.email || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{membro?.telefone || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={membro?.batizado ? "default" : "outline"}>
                    {membro?.batizado ? "Batizado" : "Não Batizado"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5">
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="hist">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Data de Nascimento</dt>
                      <dd className="text-sm mt-1">{membro?.dataNascimento || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Data de Ingresso</dt>
                      <dd className="text-sm mt-1">{membro?.dataIngresso || 'Não informado'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Rua</dt>
                      <dd className="text-sm mt-1">{membro?.endereco?.rua || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Número</dt>
                      <dd className="text-sm mt-1">{membro?.endereco?.numero || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Bairro</dt>
                      <dd className="text-sm mt-1">{membro?.endereco?.bairro || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">CEP</dt>
                      <dd className="text-sm mt-1">{membro?.endereco?.cep || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Cidade</dt>
                      <dd className="text-sm mt-1">{membro?.endereco?.cidade || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Estado</dt>
                      <dd className="text-sm mt-1">{membro?.endereco?.estado || 'Não informado'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {membro?.habilidades?.length ? (
                      membro.habilidades.map((habilidade, index) => (
                        <Badge variant="secondary" key={index} className="flex items-center gap-1">
                          <Music className="h-3 w-3" />
                          {habilidade}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma habilidade registrada</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{membro?.observacoes || 'Nenhuma observação registrada'}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Responsáveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(!membro?.responsaveis?.pai?.nome && !membro?.responsaveis?.mae?.nome) ? (
                    <p className="text-sm text-muted-foreground">Nenhum responsável registrado</p>
                  ) : (
                    <div className="space-y-4">
                      {membro?.responsaveis?.pai?.nome && (
                        <div>
                          <h3 className="text-sm font-medium">Pai</h3>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                            <div>
                              <dt className="text-xs text-muted-foreground">Nome</dt>
                              <dd className="text-sm">{membro?.responsaveis?.pai?.nome}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-muted-foreground">Telefone</dt>
                              <dd className="text-sm">{membro?.responsaveis?.pai?.telefone || 'Não informado'}</dd>
                            </div>
                          </dl>
                        </div>
                      )}
                      
                      {membro?.responsaveis?.mae?.nome && (
                        <div>
                          <h3 className="text-sm font-medium">Mãe</h3>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                            <div>
                              <dt className="text-xs text-muted-foreground">Nome</dt>
                              <dd className="text-sm">{membro?.responsaveis?.mae?.nome}</dd>
                            </div>
                            <div>
                              <dt className="text-xs text-muted-foreground">Telefone</dt>
                              <dd className="text-sm">{membro?.responsaveis?.mae?.telefone || 'Não informado'}</dd>
                            </div>
                          </dl>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hist">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Participação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border-l-2 border-primary pl-4 pb-4">
                      <CalendarClock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Participação em Evento</p>
                        <p className="text-xs text-muted-foreground">Culto de Domingo - 15/10/2023</p>
                        <p className="text-sm mt-1">Participou como {membro?.funcao}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 border-l-2 border-primary pl-4 pb-4">
                      <CalendarClock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Participação em Evento</p>
                        <p className="text-xs text-muted-foreground">Culto de Quarta - 11/10/2023</p>
                        <p className="text-sm mt-1">Participou como {membro?.funcao}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                      <CalendarClock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Participação em Evento</p>
                        <p className="text-xs text-muted-foreground">Culto de Domingo - 08/10/2023</p>
                        <p className="text-sm mt-1">Participou como {membro?.funcao}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MembroPerfil;
