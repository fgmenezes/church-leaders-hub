
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parse } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

// Define the observation interface
export interface Observacao {
  id: string;
  membro_id: string;
  titulo: string;
  texto: string;
  data: string;
  autor: string;
}

// Define the updated Membro interface
export interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  funcao: string;
  status: string;
  dataNascimento?: string;
  dataIngresso?: string;
  localNascimento?: string;
  batizado?: boolean;
  // Information stored in related tables
  endereco?: {
    id?: string;
    rua?: string;
    numero?: string;
    cep?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  responsaveis?: {
    pai?: {
      id?: string;
      nome?: string;
      telefone?: string;
    };
    mae?: {
      id?: string;
      nome?: string;
      telefone?: string;
    };
  };
  habilidades?: string[];
  observacoes?: string;
  listaObservacoes?: Observacao[];
}

interface MembersContextType {
  members: Membro[];
  isLoading: boolean;
  getMember: (id: string) => Promise<Membro | null>;
  updateMember: (member: Membro) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  toggleMemberStatus: (id: string) => Promise<void>;
  addMember: (member: Membro) => Promise<void>;
  addObservacao: (memberId: string, observacao: Omit<Observacao, 'id' | 'membro_id'>) => Promise<void>;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [members, setMembers] = useState<Membro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch members from Supabase when component mounts or user changes
  useEffect(() => {
    if (!user) {
      setMembers([]);
      setIsLoading(false);
      return;
    }
    
    fetchMembers();
  }, [user]);

  // Fetch all members from Supabase
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch members
      const { data: membrosData, error: membrosError } = await supabase
        .from('membros')
        .select('*')
        .order('nome');
        
      if (membrosError) throw membrosError;
      
      // Process members data into our application format
      const processedMembers = await Promise.all(membrosData.map(async (membro) => {
        return processMembroData(membro);
      }));
      
      setMembers(processedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar a lista de membros.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Process member data from database to application format
  const processMembroData = async (membroData: any): Promise<Membro> => {
    // Format dates
    const dataNascimento = membroData.data_nascimento ? 
      format(new Date(membroData.data_nascimento), 'dd/MM/yyyy') : undefined;
    
    const dataIngresso = membroData.data_ingresso ? 
      format(new Date(membroData.data_ingresso), 'dd/MM/yyyy') : undefined;
    
    // Fetch address
    const { data: enderecoData } = await supabase
      .from('endereco_membros')
      .select('*')
      .eq('membro_id', membroData.id)
      .maybeSingle();
    
    // Fetch responsible parties
    const { data: responsaveisData } = await supabase
      .from('responsaveis_membros')
      .select('*')
      .eq('membro_id', membroData.id);
    
    // Fetch skills
    const { data: habilidadesData } = await supabase
      .from('habilidades_membros')
      .select('habilidade')
      .eq('membro_id', membroData.id);
    
    // Fetch observations
    const { data: observacoesData } = await supabase
      .from('observacoes')
      .select('*')
      .eq('membro_id', membroData.id)
      .order('created_at', { ascending: false });
    
    // Process responsible parties
    const responsaveis: any = {};
    
    if (responsaveisData) {
      responsaveisData.forEach(resp => {
        if (resp.tipo === 'pai') {
          responsaveis.pai = {
            id: resp.id,
            nome: resp.nome,
            telefone: resp.telefone
          };
        } else if (resp.tipo === 'mae') {
          responsaveis.mae = {
            id: resp.id,
            nome: resp.nome,
            telefone: resp.telefone
          };
        }
      });
    }
    
    // Format observations
    const listaObservacoes = observacoesData ? observacoesData.map(obs => ({
      id: obs.id,
      membro_id: obs.membro_id,
      titulo: obs.titulo,
      texto: obs.texto,
      data: format(new Date(obs.data), 'dd/MM/yyyy'),
      autor: obs.autor
    })) : [];
    
    // Compile member data
    const membro: Membro = {
      id: membroData.id,
      nome: membroData.nome,
      email: membroData.email || '',
      telefone: membroData.telefone,
      funcao: membroData.funcao,
      status: membroData.status,
      dataNascimento,
      dataIngresso,
      localNascimento: membroData.local_nascimento,
      batizado: membroData.batizado,
      endereco: enderecoData ? {
        id: enderecoData.id,
        rua: enderecoData.rua,
        numero: enderecoData.numero,
        cep: enderecoData.cep,
        bairro: enderecoData.bairro,
        cidade: enderecoData.cidade,
        estado: enderecoData.estado
      } : undefined,
      responsaveis: Object.keys(responsaveis).length ? responsaveis : undefined,
      habilidades: habilidadesData ? habilidadesData.map(h => h.habilidade) : [],
      listaObservacoes
    };
    
    return membro;
  };
  
  // Convert app membro format to database format
  const prepareMembroDatabaseData = (membro: Membro) => {
    // Parse dates
    let dataNascimento = null;
    if (membro.dataNascimento) {
      try {
        dataNascimento = parse(membro.dataNascimento, 'dd/MM/yyyy', new Date()).toISOString();
      } catch (e) {
        console.error('Erro ao converter data de nascimento:', e);
      }
    }
    
    let dataIngresso = null;
    if (membro.dataIngresso) {
      try {
        dataIngresso = parse(membro.dataIngresso, 'dd/MM/yyyy', new Date()).toISOString();
      } catch (e) {
        console.error('Erro ao converter data de ingresso:', e);
      }
    }
    
    // Main membro data
    const membroData = {
      nome: membro.nome,
      email: membro.email,
      telefone: membro.telefone,
      funcao: membro.funcao,
      status: membro.status,
      data_nascimento: dataNascimento,
      data_ingresso: dataIngresso,
      local_nascimento: membro.localNascimento,
      batizado: membro.batizado || false
    };
    
    return membroData;
  };

  // Get a single member by ID
  const getMember = async (id: string): Promise<Membro | null> => {
    if (!id) return null;
    
    try {
      setIsLoading(true);
      
      // Fetch member from database
      const { data: membroData, error: membroError } = await supabase
        .from('membros')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (membroError) throw membroError;
      if (!membroData) return null;
      
      // Process member data
      const membro = await processMembroData(membroData);
      return membro;
    } catch (error) {
      console.error('Erro ao buscar membro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do membro.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new member
  const addMember = async (newMember: Membro): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Prepare member data for db
      const membroData = prepareMembroDatabaseData(newMember);
      
      // Insert member into database
      const { data: insertedMembro, error: membroError } = await supabase
        .from('membros')
        .insert(membroData)
        .select()
        .single();
        
      if (membroError) throw membroError;
      
      // Insert address if provided
      if (newMember.endereco) {
        const { rua, numero, cep, bairro, cidade, estado } = newMember.endereco;
        
        if (rua || numero || cep || bairro || cidade || estado) {
          const { error: enderecoError } = await supabase
            .from('endereco_membros')
            .insert({
              membro_id: insertedMembro.id,
              rua,
              numero,
              cep,
              bairro,
              cidade,
              estado
            });
          
          if (enderecoError) throw enderecoError;
        }
      }
      
      // Insert responsible parties if provided
      if (newMember.responsaveis) {
        if (newMember.responsaveis.pai?.nome || newMember.responsaveis.pai?.telefone) {
          const { error: paiError } = await supabase
            .from('responsaveis_membros')
            .insert({
              membro_id: insertedMembro.id,
              tipo: 'pai',
              nome: newMember.responsaveis.pai.nome,
              telefone: newMember.responsaveis.pai.telefone
            });
          
          if (paiError) throw paiError;
        }
        
        if (newMember.responsaveis.mae?.nome || newMember.responsaveis.mae?.telefone) {
          const { error: maeError } = await supabase
            .from('responsaveis_membros')
            .insert({
              membro_id: insertedMembro.id,
              tipo: 'mae',
              nome: newMember.responsaveis.mae.nome,
              telefone: newMember.responsaveis.mae.telefone
            });
          
          if (maeError) throw maeError;
        }
      }
      
      // Insert skills if provided
      if (newMember.habilidades && newMember.habilidades.length > 0) {
        const habilidadesInsert = newMember.habilidades.map(habilidade => ({
          membro_id: insertedMembro.id,
          habilidade
        }));
        
        const { error: habilidadesError } = await supabase
          .from('habilidades_membros')
          .insert(habilidadesInsert);
        
        if (habilidadesError) throw habilidadesError;
      }
      
      // Refresh members list
      await fetchMembers();
      
      toast({
        title: "Membro adicionado",
        description: `${newMember.nome} foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar membro",
        description: "Não foi possível adicionar o membro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing member
  const updateMember = async (updatedMember: Membro): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Prepare member data for db
      const membroData = prepareMembroDatabaseData(updatedMember);
      
      // Update member in database
      const { error: membroError } = await supabase
        .from('membros')
        .update(membroData)
        .eq('id', updatedMember.id);
        
      if (membroError) throw membroError;
      
      // Update address
      if (updatedMember.endereco) {
        const { id: enderecoId, ...enderecoData } = updatedMember.endereco;
        
        if (enderecoId) {
          // Update existing address
          const { error: enderecoError } = await supabase
            .from('endereco_membros')
            .update(enderecoData)
            .eq('id', enderecoId);
            
          if (enderecoError) throw enderecoError;
        } else {
          // Insert new address
          const { error: enderecoError } = await supabase
            .from('endereco_membros')
            .insert({
              membro_id: updatedMember.id,
              ...enderecoData
            });
            
          if (enderecoError) throw enderecoError;
        }
      }
      
      // Update responsible parties
      if (updatedMember.responsaveis) {
        // Update pai if exists
        if (updatedMember.responsaveis.pai) {
          const { id: paiId, ...paiData } = updatedMember.responsaveis.pai;
          
          if (paiId) {
            // Update existing pai
            const { error: paiError } = await supabase
              .from('responsaveis_membros')
              .update(paiData)
              .eq('id', paiId);
              
            if (paiError) throw paiError;
          } else if (paiData.nome || paiData.telefone) {
            // Insert new pai
            const { error: paiError } = await supabase
              .from('responsaveis_membros')
              .insert({
                membro_id: updatedMember.id,
                tipo: 'pai',
                ...paiData
              });
              
            if (paiError) throw paiError;
          }
        }
        
        // Update mae if exists
        if (updatedMember.responsaveis.mae) {
          const { id: maeId, ...maeData } = updatedMember.responsaveis.mae;
          
          if (maeId) {
            // Update existing mae
            const { error: maeError } = await supabase
              .from('responsaveis_membros')
              .update(maeData)
              .eq('id', maeId);
              
            if (maeError) throw maeError;
          } else if (maeData.nome || maeData.telefone) {
            // Insert new mae
            const { error: maeError } = await supabase
              .from('responsaveis_membros')
              .insert({
                membro_id: updatedMember.id,
                tipo: 'mae',
                ...maeData
              });
              
            if (maeError) throw maeError;
          }
        }
      }
      
      // Update skills - first delete all existing skills, then add new ones
      if (updatedMember.habilidades) {
        // Delete existing skills
        const { error: deleteHabilidadesError } = await supabase
          .from('habilidades_membros')
          .delete()
          .eq('membro_id', updatedMember.id);
          
        if (deleteHabilidadesError) throw deleteHabilidadesError;
        
        // Add new skills
        if (updatedMember.habilidades.length > 0) {
          const habilidadesInsert = updatedMember.habilidades.map(habilidade => ({
            membro_id: updatedMember.id,
            habilidade
          }));
          
          const { error: habilidadesError } = await supabase
            .from('habilidades_membros')
            .insert(habilidadesInsert);
          
          if (habilidadesError) throw habilidadesError;
        }
      }
      
      // Refresh members list
      await fetchMembers();
      
      toast({
        title: "Membro atualizado",
        description: `${updatedMember.nome} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar membro",
        description: "Não foi possível atualizar o membro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a member
  const deleteMember = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get member to delete (for toast message)
      const memberToDelete = members.find(m => m.id === id);
      
      // Delete member (cascades to related tables through foreign keys)
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh members list
      await fetchMembers();
      
      // Show toast notification
      if (memberToDelete) {
        toast({
          title: "Membro removido",
          description: `${memberToDelete.nome} foi removido com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover membro",
        description: "Não foi possível remover o membro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle member status (active/inactive)
  const toggleMemberStatus = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get current member
      const memberToUpdate = members.find(m => m.id === id);
      if (!memberToUpdate) throw new Error('Membro não encontrado');
      
      // New status
      const newStatus = memberToUpdate.status === 'ativo' ? 'inativo' : 'ativo';
      
      // Update member status
      const { error } = await supabase
        .from('membros')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh members list
      await fetchMembers();
      
      // Show toast notification
      toast({
        title: newStatus === 'ativo' ? "Membro ativado" : "Membro desativado",
        description: `${memberToUpdate.nome} foi ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status do membro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do membro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add an observation to a member
  const addObservacao = async (memberId: string, observacao: Omit<Observacao, 'id' | 'membro_id'>): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get current member
      const memberToUpdate = members.find(m => m.id === memberId);
      if (!memberToUpdate) throw new Error('Membro não encontrado');
      
      // Parse observation date
      let dataObservacao;
      try {
        dataObservacao = parse(observacao.data, 'dd/MM/yyyy', new Date()).toISOString();
      } catch (e) {
        console.error('Erro ao converter data da observação:', e);
        dataObservacao = new Date().toISOString(); // Fallback to current date
      }
      
      // Insert observation
      const { error } = await supabase
        .from('observacoes')
        .insert({
          membro_id: memberId,
          titulo: observacao.titulo,
          texto: observacao.texto,
          data: dataObservacao,
          autor: observacao.autor
        });
        
      if (error) throw error;
      
      // Refresh member data
      const updatedMember = await getMember(memberId);
      if (updatedMember) {
        setMembers(currentMembers => 
          currentMembers.map(member => 
            member.id === memberId ? updatedMember : member
          )
        );
      }
      
      // Show toast notification
      toast({
        title: "Observação adicionada",
        description: "A observação foi adicionada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao adicionar observação:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar observação",
        description: "Não foi possível adicionar a observação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MembersContext.Provider value={{
      members,
      isLoading,
      getMember,
      updateMember,
      deleteMember,
      toggleMemberStatus,
      addMember,
      addObservacao
    }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = (): MembersContextType => {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
};
