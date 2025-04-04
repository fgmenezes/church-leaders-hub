
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the SmallGroup interface
export interface SmallGroup {
  id: string;
  nome: string;
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
    email: string;
  };
  membros: string[]; // Array of member IDs
  diaSemana: string;
  horario: string;
  descricao?: string;
}

// Initial dummy data
const initialSmallGroups: SmallGroup[] = [
  {
    id: '1',
    nome: 'Grupo Esperança',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      cep: '01234-567',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    responsavel: {
      nome: 'João Silva',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@email.com'
    },
    membros: ['1', '2', '5'],
    diaSemana: 'Quarta-feira',
    horario: '19:30',
    descricao: 'Grupo dedicado ao estudo bíblico e oração.'
  },
  {
    id: '2',
    nome: 'Grupo Família',
    endereco: {
      rua: 'Av. Paulista',
      numero: '1000',
      cep: '04567-890',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    responsavel: {
      nome: 'Maria Oliveira',
      telefone: '(11) 91234-5678',
      email: 'maria.oliveira@email.com'
    },
    membros: ['3', '4'],
    diaSemana: 'Sexta-feira',
    horario: '20:00',
    descricao: 'Grupo voltado para famílias e casais.'
  }
];

interface SmallGroupsContextType {
  smallGroups: SmallGroup[];
  getSmallGroup: (id: string) => SmallGroup | null;
  updateSmallGroup: (group: SmallGroup) => void;
  deleteSmallGroup: (id: string) => void;
  addSmallGroup: (group: SmallGroup) => void;
  addMemberToGroup: (groupId: string, memberId: string) => void;
  removeMemberFromGroup: (groupId: string, memberId: string) => void;
}

const SmallGroupsContext = createContext<SmallGroupsContextType | undefined>(undefined);

export const SmallGroupsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>([]);

  // Load small groups from localStorage on initial render
  useEffect(() => {
    const storedSmallGroups = localStorage.getItem('smallGroups');
    if (storedSmallGroups) {
      try {
        setSmallGroups(JSON.parse(storedSmallGroups));
      } catch (error) {
        console.error("Failed to parse stored small groups", error);
        setSmallGroups(initialSmallGroups);
      }
    } else {
      setSmallGroups(initialSmallGroups);
    }
  }, []);

  // Save small groups to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smallGroups', JSON.stringify(smallGroups));
  }, [smallGroups]);

  const getSmallGroup = (id: string): SmallGroup | null => {
    return smallGroups.find(group => group.id === id) || null;
  };

  const updateSmallGroup = (updatedGroup: SmallGroup): void => {
    setSmallGroups(currentGroups => 
      currentGroups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    
    // Show toast notification
    toast({
      title: "Pequeno Grupo atualizado",
      description: `${updatedGroup.nome} foi atualizado com sucesso.`,
    });
  };

  const deleteSmallGroup = (id: string): void => {
    const groupToDelete = getSmallGroup(id);
    setSmallGroups(currentGroups => 
      currentGroups.filter(group => group.id !== id)
    );
    
    // Show toast notification if the group was found
    if (groupToDelete) {
      toast({
        title: "Pequeno Grupo removido",
        description: `${groupToDelete.nome} foi removido com sucesso.`,
      });
    }
  };

  const addSmallGroup = (newGroup: SmallGroup): void => {
    // Ensure new group has a valid ID
    const groupWithId = {
      ...newGroup,
      id: newGroup.id || `${Date.now()}`
    };
    
    setSmallGroups(currentGroups => [...currentGroups, groupWithId]);
    
    // Show toast notification
    toast({
      title: "Pequeno Grupo adicionado",
      description: `${newGroup.nome} foi adicionado com sucesso.`,
    });
  };

  const addMemberToGroup = (groupId: string, memberId: string): void => {
    setSmallGroups(currentGroups => 
      currentGroups.map(group => {
        if (group.id === groupId && !group.membros.includes(memberId)) {
          const updatedMembros = [...group.membros, memberId];
          return { ...group, membros: updatedMembros };
        }
        return group;
      })
    );
    
    // Show toast notification
    toast({
      title: "Membro adicionado ao grupo",
      description: "O membro foi adicionado ao pequeno grupo com sucesso.",
    });
  };

  const removeMemberFromGroup = (groupId: string, memberId: string): void => {
    setSmallGroups(currentGroups => 
      currentGroups.map(group => {
        if (group.id === groupId) {
          const updatedMembros = group.membros.filter(id => id !== memberId);
          return { ...group, membros: updatedMembros };
        }
        return group;
      })
    );
    
    // Show toast notification
    toast({
      title: "Membro removido do grupo",
      description: "O membro foi removido do pequeno grupo com sucesso.",
    });
  };

  return (
    <SmallGroupsContext.Provider value={{
      smallGroups,
      getSmallGroup,
      updateSmallGroup,
      deleteSmallGroup,
      addSmallGroup,
      addMemberToGroup,
      removeMemberFromGroup
    }}>
      {children}
    </SmallGroupsContext.Provider>
  );
};

export const useSmallGroups = (): SmallGroupsContextType => {
  const context = useContext(SmallGroupsContext);
  if (context === undefined) {
    throw new Error('useSmallGroups must be used within a SmallGroupsProvider');
  }
  return context;
};
