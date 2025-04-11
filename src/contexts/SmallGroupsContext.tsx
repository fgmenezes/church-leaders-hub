
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types moved to separate file for better organization
import { 
  SmallGroup, 
  SmallGroupAddress, 
  SmallGroupResponsible, 
  Visitor, 
  AttendanceRecord,
  SmallGroupsContextType,
  SmallGroupDB
} from '@/types/small-groups';

// Provider
const SmallGroupsContext = createContext<SmallGroupsContextType | undefined>(undefined);

export const SmallGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to convert database address format to app format
  const parseAddress = (dbAddress: any): SmallGroupAddress => {
    if (!dbAddress) {
      return { 
        rua: '', 
        numero: '', 
        cep: '', 
        bairro: '', 
        cidade: '', 
        estado: '' 
      };
    }
    
    // Make sure all required fields exist
    return {
      rua: dbAddress.rua || '',
      numero: dbAddress.numero || '',
      cep: dbAddress.cep || '',
      bairro: dbAddress.bairro || '',
      cidade: dbAddress.cidade || '',
      estado: dbAddress.estado || ''
    };
  };

  // Helper function to parse visitors from database
  const parseVisitantes = (dbVisitantes: any): Visitor[] => {
    if (!dbVisitantes || !Array.isArray(dbVisitantes)) {
      return [];
    }
    
    return dbVisitantes.map((v: any) => ({
      nome: v.nome || '',
      telefone: v.telefone || '',
      convidadoPor: v.convidadoPor || '',
      id: v.id || `visitante-${Date.now()}-${Math.random()}`
    }));
  };

  // Carregar dados de pequenos grupos do Supabase
  useEffect(() => {
    const fetchSmallGroups = async () => {
      if (!isAuthenticated) {
        setSmallGroups([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Buscar todos os pequenos grupos
        const { data: gruposData, error: gruposError } = await supabase
          .from('pequenos_grupos')
          .select('*');

        if (gruposError) throw gruposError;

        // Buscar membros de cada grupo
        const { data: membrosData, error: membrosError } = await supabase
          .from('pequenos_grupos_membros')
          .select('grupo_id, membro_id');

        if (membrosError) throw membrosError;

        // Buscar registros de presença
        const { data: presencaData, error: presencaError } = await supabase
          .from('pequenos_grupos_presenca')
          .select('*');

        if (presencaError) throw presencaError;

        // Processar os dados para o formato atual
        const formattedGroups: SmallGroup[] = gruposData.map((grupo: SmallGroupDB) => {
          // Buscar membros deste grupo
          const membros = membrosData
            .filter(m => m.grupo_id === grupo.id)
            .map(m => m.membro_id);

          // Buscar registros de presença deste grupo
          const chamadas: AttendanceRecord[] = presencaData
            .filter(p => p.grupo_id === grupo.id)
            .map(p => ({
              id: p.id,
              data: p.data_encontro,
              membrosPresentes: p.membros_presentes || [],
              visitantes: parseVisitantes(p.visitantes)
            }));

          // Formatar e retornar o grupo
          return {
            id: grupo.id,
            nome: grupo.nome,
            descricao: grupo.descricao || '',
            endereco: parseAddress(grupo.endereco),
            responsavel: {
              nome: 'Responsável', // Será atualizado quando adicionarmos líderes
              telefone: ''
            },
            diaSemana: grupo.dia_semana as any,
            horario: grupo.horario || '',
            membros: membros,
            chamadas: chamadas,
            frequencia: 'semanal'
          };
        });

        setSmallGroups(formattedGroups);
      } catch (error) {
        console.error('Erro ao carregar pequenos grupos:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar grupos",
          description: "Não foi possível carregar os pequenos grupos.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSmallGroups();
  }, [isAuthenticated, toast]);

  // Adicionar novo grupo
  const addSmallGroup = async (group: SmallGroup): Promise<SmallGroup> => {
    try {
      // Preparar dados para inserção
      const newGroupData = {
        nome: group.nome,
        descricao: group.descricao,
        endereco: group.endereco as any,
        dia_semana: group.diaSemana,
        horario: group.horario
      };

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('pequenos_grupos')
        .insert(newGroupData)
        .select()
        .single();

      if (error) throw error;

      // Se tiver membros, adicionar relacionamentos
      if (group.membros && group.membros.length > 0) {
        const membrosData = group.membros.map(membroId => ({
          grupo_id: data.id,
          membro_id: membroId
        }));

        const { error: membrosError } = await supabase
          .from('pequenos_grupos_membros')
          .insert(membrosData);

        if (membrosError) throw membrosError;
      }

      // Construir objeto para retorno
      const newGroup: SmallGroup = {
        ...group,
        id: data.id
      };

      // Atualizar estado
      setSmallGroups(prev => [...prev, newGroup]);

      toast({
        title: "Grupo criado",
        description: `${newGroup.nome} foi criado com sucesso.`,
      });

      return newGroup;
    } catch (error) {
      console.error('Erro ao criar pequeno grupo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar grupo",
        description: "Não foi possível criar o pequeno grupo.",
      });
      throw error;
    }
  };

  // Atualizar grupo existente
  const updateSmallGroup = async (updatedGroup: SmallGroup): Promise<void> => {
    try {
      // Preparar dados para atualização
      const groupData = {
        nome: updatedGroup.nome,
        descricao: updatedGroup.descricao,
        endereco: updatedGroup.endereco as any,
        dia_semana: updatedGroup.diaSemana,
        horario: updatedGroup.horario
      };

      // Atualizar no Supabase
      const { error } = await supabase
        .from('pequenos_grupos')
        .update(groupData)
        .eq('id', updatedGroup.id);

      if (error) throw error;

      // Atualizar membros do grupo
      // Primeiro, remover todos os relacionamentos existentes
      const { error: deleteError } = await supabase
        .from('pequenos_grupos_membros')
        .delete()
        .eq('grupo_id', updatedGroup.id);

      if (deleteError) throw deleteError;

      // Depois, adicionar os relacionamentos atualizados
      if (updatedGroup.membros && updatedGroup.membros.length > 0) {
        const membrosData = updatedGroup.membros.map(membroId => ({
          grupo_id: updatedGroup.id,
          membro_id: membroId
        }));

        const { error: membrosError } = await supabase
          .from('pequenos_grupos_membros')
          .insert(membrosData);

        if (membrosError) throw membrosError;
      }

      // Atualizar estado
      setSmallGroups(prev => 
        prev.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        )
      );

      toast({
        title: "Grupo atualizado",
        description: `${updatedGroup.nome} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar pequeno grupo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar grupo",
        description: "Não foi possível atualizar o pequeno grupo.",
      });
      throw error;
    }
  };

  // Excluir grupo
  const deleteSmallGroup = async (id: string): Promise<void> => {
    try {
      const groupToDelete = smallGroups.find(g => g.id === id);
      if (!groupToDelete) return;

      // Excluir no Supabase - os relacionamentos serão excluídos automaticamente por causa das constraints ON DELETE CASCADE
      const { error } = await supabase
        .from('pequenos_grupos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado
      setSmallGroups(prev => prev.filter(group => group.id !== id));

      toast({
        title: "Grupo excluído",
        description: `${groupToDelete.nome} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao excluir pequeno grupo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir grupo",
        description: "Não foi possível excluir o pequeno grupo.",
      });
      throw error;
    }
  };

  // Buscar grupo por ID
  const getSmallGroupById = async (id: string): Promise<SmallGroup | undefined> => {
    try {
      // Primeiro procura no estado local
      const cachedGroup = smallGroups.find(group => group.id === id);
      if (cachedGroup) return cachedGroup;

      // Se não encontrar, busca do Supabase
      const { data, error } = await supabase
        .from('pequenos_grupos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return undefined;

      // Buscar membros deste grupo
      const { data: membrosData, error: membrosError } = await supabase
        .from('pequenos_grupos_membros')
        .select('membro_id')
        .eq('grupo_id', id);

      if (membrosError) throw membrosError;

      // Buscar registros de presença
      const { data: presencaData, error: presencaError } = await supabase
        .from('pequenos_grupos_presenca')
        .select('*')
        .eq('grupo_id', id);

      if (presencaError) throw presencaError;

      // Formatar e retornar o grupo
      const group: SmallGroup = {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao || '',
        endereco: parseAddress(data.endereco),
        responsavel: {
          nome: 'Responsável', // Será atualizado quando adicionarmos líderes
          telefone: ''
        },
        diaSemana: data.dia_semana as any,
        horario: data.horario || '',
        membros: membrosData.map(m => m.membro_id),
        chamadas: presencaData.map(p => ({
          id: p.id,
          data: p.data_encontro,
          membrosPresentes: p.membros_presentes || [],
          visitantes: parseVisitantes(p.visitantes)
        })),
        frequencia: 'semanal'
      };

      return group;
    } catch (error) {
      console.error('Erro ao buscar pequeno grupo:', error);
      return undefined;
    }
  };
  
  // Método alternativo para buscar grupo por ID (para compatibilidade)
  const getSmallGroup = (id: string): Promise<SmallGroup | undefined> => {
    return getSmallGroupById(id);
  };

  // Adicionar membro ao grupo
  const addMemberToGroup = async (groupId: string, memberId: string): Promise<void> => {
    try {
      // Verificar se já existe
      const { data: existing, error: checkError } = await supabase
        .from('pequenos_grupos_membros')
        .select('*')
        .eq('grupo_id', groupId)
        .eq('membro_id', memberId)
        .maybeSingle();

      if (checkError) throw checkError;
      
      // Se já existe, não precisamos adicionar novamente
      if (existing) return;

      // Adicionar no Supabase
      const { error } = await supabase
        .from('pequenos_grupos_membros')
        .insert({
          grupo_id: groupId,
          membro_id: memberId
        });

      if (error) throw error;

      // Atualizar estado
      setSmallGroups(prev => 
        prev.map(group => {
          if (group.id === groupId && !group.membros.includes(memberId)) {
            return { ...group, membros: [...group.membros, memberId] };
          }
          return group;
        })
      );

      toast({
        title: "Membro adicionado",
        description: "Membro adicionado ao grupo com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao adicionar membro ao grupo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar membro",
        description: "Não foi possível adicionar o membro ao grupo.",
      });
      throw error;
    }
  };

  // Remover membro do grupo
  const removeMemberFromGroup = async (groupId: string, memberId: string): Promise<void> => {
    try {
      // Remover no Supabase
      const { error } = await supabase
        .from('pequenos_grupos_membros')
        .delete()
        .eq('grupo_id', groupId)
        .eq('membro_id', memberId);

      if (error) throw error;

      // Atualizar estado
      setSmallGroups(prev => 
        prev.map(group => {
          if (group.id === groupId) {
            return { ...group, membros: group.membros.filter(id => id !== memberId) };
          }
          return group;
        })
      );

      toast({
        title: "Membro removido",
        description: "Membro removido do grupo com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover membro do grupo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover membro",
        description: "Não foi possível remover o membro do grupo.",
      });
      throw error;
    }
  };

  // Registrar presença em um encontro
  const registerAttendance = async (groupId: string, attendance: AttendanceRecord): Promise<void> => {
    try {
      // Preparar dados para inserção
      const presencaData = {
        grupo_id: groupId,
        data_encontro: attendance.data,
        membros_presentes: attendance.membrosPresentes,
        visitantes: attendance.visitantes as any
      };

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('pequenos_grupos_presenca')
        .insert(presencaData)
        .select()
        .single();

      if (error) throw error;

      // Construir objeto para o estado
      const newAttendance: AttendanceRecord = {
        id: data.id,
        data: data.data_encontro,
        membrosPresentes: data.membros_presentes || [],
        visitantes: parseVisitantes(data.visitantes)
      };

      // Atualizar estado
      setSmallGroups(prev => 
        prev.map(group => {
          if (group.id === groupId) {
            return { ...group, chamadas: [...group.chamadas, newAttendance] };
          }
          return group;
        })
      );

      toast({
        title: "Presença registrada",
        description: "Registro de presença adicionado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar presença",
        description: "Não foi possível registrar a presença no encontro.",
      });
      throw error;
    }
  };

  return (
    <SmallGroupsContext.Provider value={{
      smallGroups,
      addSmallGroup,
      updateSmallGroup,
      deleteSmallGroup,
      getSmallGroupById,
      getSmallGroup,
      addMemberToGroup,
      removeMemberFromGroup,
      registerAttendance,
      isLoading
    }}>
      {children}
    </SmallGroupsContext.Provider>
  );
};

// Hook para usar o contexto
export const useSmallGroups = () => {
  const context = useContext(SmallGroupsContext);
  if (context === undefined) {
    throw new Error('useSmallGroups must be used within a SmallGroupsProvider');
  }
  return context;
};
