
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Definição dos tipos
interface SmallGroupAddress {
  rua: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface SmallGroupResponsible {
  nome: string;
  telefone: string;
  email?: string;
}

interface Visitor {
  nome: string;
  telefone: string;
  convidadoPor: string;
  id?: string;
}

interface AttendanceRecord {
  id: string;
  data: string;
  membrosPresentes: string[];
  visitantes: Visitor[];
}

interface SmallGroup {
  id: string;
  nome: string;
  descricao?: string;
  endereco: SmallGroupAddress;
  responsavel: SmallGroupResponsible;
  frequencia: 'diaria' | 'semanal' | 'quinzenal' | 'mensal';
  diaSemana?: 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';
  horario?: string;
  membros: string[];
  chamadas: AttendanceRecord[];
}

interface SmallGroupsContextType {
  smallGroups: SmallGroup[];
  addSmallGroup: (group: SmallGroup) => void;
  updateSmallGroup: (updatedGroup: SmallGroup) => void;
  deleteSmallGroup: (id: string) => void;
  getSmallGroupById: (id: string) => SmallGroup | undefined;
  getSmallGroup: (id: string) => SmallGroup | undefined;
  addMemberToGroup: (groupId: string, memberId: string) => void;
  removeMemberFromGroup: (groupId: string, memberId: string) => void;
  registerAttendance: (groupId: string, attendance: AttendanceRecord) => void;
}

// Criação do contexto
const SmallGroupsContext = createContext<SmallGroupsContextType | undefined>(undefined);

// Provider
export const SmallGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>(() => {
    const saved = localStorage.getItem('smallGroups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar dados de pequenos grupos:', error);
        return [];
      }
    }
    return [];
  });

  // Salvar no localStorage quando o estado mudar
  useEffect(() => {
    localStorage.setItem('smallGroups', JSON.stringify(smallGroups));
  }, [smallGroups]);

  // Adicionar novo grupo
  const addSmallGroup = (group: SmallGroup) => {
    // Ensure the group has a unique ID
    const newGroup = {
      ...group,
      id: group.id || `group_${Date.now()}`
    };
    
    setSmallGroups(prev => [...prev, newGroup]);
    
    toast({
      title: "Grupo criado",
      description: `${newGroup.nome} foi criado com sucesso.`,
    });
    
    return newGroup;
  };

  // Atualizar grupo existente
  const updateSmallGroup = (updatedGroup: SmallGroup) => {
    setSmallGroups(prev => 
      prev.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    
    toast({
      title: "Grupo atualizado",
      description: `${updatedGroup.nome} foi atualizado com sucesso.`,
    });
  };

  // Excluir grupo
  const deleteSmallGroup = (id: string) => {
    const groupToDelete = smallGroups.find(g => g.id === id);
    if (groupToDelete) {
      setSmallGroups(prev => prev.filter(group => group.id !== id));
      toast({
        title: "Grupo excluído",
        description: `${groupToDelete.nome} foi excluído com sucesso.`,
      });
    }
  };

  // Buscar grupo por ID (método duplicado para compatibilidade)
  const getSmallGroupById = (id: string) => {
    return smallGroups.find(group => group.id === id);
  };
  
  // Método alternativo para buscar grupo por ID
  const getSmallGroup = (id: string) => {
    return smallGroups.find(group => group.id === id);
  };

  // Adicionar membro ao grupo
  const addMemberToGroup = (groupId: string, memberId: string) => {
    setSmallGroups(prev => 
      prev.map(group => {
        if (group.id === groupId && !group.membros.includes(memberId)) {
          return { ...group, membros: [...group.membros, memberId] };
        }
        return group;
      })
    );
  };

  // Remover membro do grupo
  const removeMemberFromGroup = (groupId: string, memberId: string) => {
    setSmallGroups(prev => 
      prev.map(group => {
        if (group.id === groupId) {
          return { ...group, membros: group.membros.filter(id => id !== memberId) };
        }
        return group;
      })
    );
  };

  // Registrar presença em um encontro
  const registerAttendance = (groupId: string, attendance: AttendanceRecord) => {
    setSmallGroups(prev => 
      prev.map(group => {
        if (group.id === groupId) {
          return { ...group, chamadas: [...group.chamadas, attendance] };
        }
        return group;
      })
    );
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

// Adicionar tipos globais
declare global {
  interface SmallGroup {
    id: string;
    nome: string;
    descricao?: string;
    endereco: {
      rua: string;
      numero: string;
      cep: string;
      bairro: string;
      cidade: string;
      estado: string;
    };
    responsavel: {
      nome: string;
      telefone: string;
      email?: string;
    };
    frequencia: 'diaria' | 'semanal' | 'quinzenal' | 'mensal';
    diaSemana?: 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';
    horario?: string;
    membros: string[];
    chamadas: {
      id: string;
      data: string;
      membrosPresentes: string[];
      visitantes: {
        id?: string;
        nome: string;
        telefone: string;
        convidadoPor: string;
      }[];
    }[];
  }
}
