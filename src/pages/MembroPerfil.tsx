
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import MemberForm from '@/components/members/MemberForm';
import { useMembers, Membro, Observacao } from '@/contexts/MembersContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MembroPerfil = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { members, getMember, updateMember, addMember, addObservacao } = useMembers();
  const [member, setMember] = useState<Membro | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pageTitle, setPageTitle] = useState('Perfil do Membro');
  const [activeTab, setActiveTab] = useState("perfil");
  const [observacaoTitulo, setObservacaoTitulo] = useState('');
  const [observacaoTexto, setObservacaoTexto] = useState('');

  useEffect(() => {
    // Verificar se estamos na rota de edição ou novo membro
    if (id === 'novo') {
      setPageTitle('Adicionar Novo Membro');
      setIsEditing(false);
      setMember(null);
    } else if (window.location.pathname.includes('/editar/')) {
      const memberToEdit = getMember(id || '');
      if (memberToEdit) {
        setPageTitle('Editar Membro');
        setIsEditing(true);
        setMember(memberToEdit);
      } else {
        navigate('/membros');
      }
    } else {
      // Visualização do perfil
      const memberToView = getMember(id || '');
      if (memberToView) {
        setPageTitle(`Perfil: ${memberToView.nome}`);
        setIsEditing(false);
        setMember(memberToView);
      } else {
        navigate('/membros');
      }
    }
  }, [id, getMember, navigate]);

  const handleFormSubmit = (data: Membro) => {
    if (isEditing || id !== 'novo') {
      updateMember(data);
    } else {
      addMember(data);
    }
    
    // Redirecionar para a lista de membros
    navigate('/membros');
  };

  const handleObservacaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member || !observacaoTitulo.trim() || !observacaoTexto.trim()) return;
    
    const hoje = new Date();
    const dataFormatada = format(hoje, 'dd/MM/yyyy', { locale: ptBR });
    
    // Add the observation
    addObservacao(member.id, {
      titulo: observacaoTitulo,
      texto: observacaoTexto,
      data: dataFormatada,
      autor: "Usuário Atual" // This would be replaced with actual logged in user
    });
    
    // Refresh the member data
    const updatedMember = getMember(member.id);
    if (updatedMember) {
      setMember(updatedMember);
    }
    
    // Clear the form
    setObservacaoTitulo('');
    setObservacaoTexto('');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={pageTitle} 
        description={isEditing ? "Edite as informações do membro" : (id === 'novo' ? "Cadastre um novo membro" : "Visualize as informações do membro")}
      />
      
      {(id === 'novo' || isEditing) ? (
        <div className="mb-10">
          <MemberForm 
            defaultValues={member || undefined}
            isEditing={isEditing || id !== 'novo'}
            onSubmit={handleFormSubmit}
          />
        </div>
      ) : (
        member && (
          <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="mb-4">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="perfil">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6">
                    <Button
                      onClick={() => navigate(`/membros/editar/${member.id}`)}
                      className="w-full sm:w-auto"
                    >
                      Editar Membro
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Dados Pessoais</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Nome:</span> {member.nome}
                          </div>
                          <div>
                            <span className="font-medium">Data de Nascimento:</span> {member.dataNascimento || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Local de Nascimento:</span> {member.localNascimento || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Telefone:</span> {member.telefone}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {member.email || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Função:</span> {member.funcao}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> {member.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </div>
                          <div>
                            <span className="font-medium">Batizado:</span> {member.batizado ? 'Sim' : 'Não'}
                          </div>
                          <div>
                            <span className="font-medium">Data de Ingresso:</span> {member.dataIngresso || 'Não informado'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">CEP:</span> {member.endereco?.cep || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Rua:</span> {member.endereco?.rua || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Número:</span> {member.endereco?.numero || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Bairro:</span> {member.endereco?.bairro || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Cidade:</span> {member.endereco?.cidade || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span> {member.endereco?.estado || 'Não informado'}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mt-6 mb-2">Responsáveis</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Nome do Pai:</span> {member.responsaveis?.pai?.nome || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Telefone do Pai:</span> {member.responsaveis?.pai?.telefone || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Nome da Mãe:</span> {member.responsaveis?.mae?.nome || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Telefone da Mãe:</span> {member.responsaveis?.mae?.telefone || 'Não informado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="observacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                  <CardDescription>
                    Adicione observações e anotações sobre o membro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleObservacaoSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título</Label>
                      <Input 
                        id="titulo" 
                        value={observacaoTitulo} 
                        onChange={(e) => setObservacaoTitulo(e.target.value)} 
                        placeholder="Título da observação"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="texto">Observação</Label>
                      <Textarea 
                        id="texto" 
                        value={observacaoTexto} 
                        onChange={(e) => setObservacaoTexto(e.target.value)} 
                        placeholder="Digite sua observação aqui..."
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit">Adicionar Observação</Button>
                  </form>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Histórico de Observações</h3>
                    {member.listaObservacoes && member.listaObservacoes.length > 0 ? (
                      <div className="space-y-4">
                        {member.listaObservacoes.map((obs: Observacao) => (
                          <Card key={obs.id} className="border border-gray-200">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{obs.titulo}</CardTitle>
                              <CardDescription className="text-xs">
                                {obs.data} - {obs.autor}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm">{obs.texto}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Não há observações registradas.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )
      )}
    </div>
  );
};

export default MembroPerfil;
