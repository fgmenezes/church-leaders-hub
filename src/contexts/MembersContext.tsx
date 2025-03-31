
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the Membro interface
export interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  funcao: string;
  status: string;
  dataNascimento?: string;
  dataIngresso?: string;
  // New fields for address details
  endereco?: {
    rua?: string;
    numero?: string;
    cep?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  // New fields for baptism and responsible parties
  batizado?: boolean;
  localNascimento?: string; // Added birthplace field
  responsaveis?: {
    pai?: {
      nome?: string;
      telefone?: string;
    };
    mae?: {
      nome?: string;
      telefone?: string;
    };
  };
  habilidades?: string[];
  observacoes?: string;
}

// Initial dummy data
const initialMembers: Membro[] = [
  { 
    id: '1', 
    nome: 'Ana Silva', 
    email: 'ana.silva@email.com', 
    telefone: '(11) 98765-4321', 
    funcao: 'Vocal', 
    status: 'ativo',
    dataNascimento: '15/05/1992',
    dataIngresso: '10/01/2020',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      cep: '01234-567',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    batizado: true,
    habilidades: ['Canto', 'Violão', 'Piano'],
    observacoes: 'Participa do ministério aos domingos e quartas-feiras.'
  },
  { 
    id: '2', 
    nome: 'Bruno Santos', 
    email: 'bruno.santos@email.com', 
    telefone: '(11) 91234-5678', 
    funcao: 'Tecladista', 
    status: 'ativo',
    dataNascimento: '22/07/1988',
    dataIngresso: '05/03/2019',
    endereco: {
      rua: 'Av. Paulista',
      numero: '1000',
      cep: '04567-890',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    batizado: true,
    habilidades: ['Teclado', 'Arranjos'],
    observacoes: 'Responsável pelos arranjos do ministério.'
  },
  { 
    id: '3', 
    nome: 'Carla Oliveira', 
    email: 'carla.oliveira@email.com', 
    telefone: '(11) 99876-5432', 
    funcao: 'Baixista', 
    status: 'ativo',
    dataNascimento: '30/10/1995',
    dataIngresso: '15/06/2021',
    endereco: {
      rua: 'Rua Augusta',
      numero: '500',
      cep: '01234-000',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    batizado: false,
    responsaveis: {
      pai: {
        nome: 'Roberto Oliveira',
        telefone: '(11) 99876-1234'
      },
      mae: {
        nome: 'Marta Oliveira',
        telefone: '(11) 99876-5678'
      }
    },
    habilidades: ['Baixo', 'Contrabaixo'],
    observacoes: 'Disponível aos finais de semana.'
  },
  { 
    id: '4', 
    nome: 'Daniel Pereira', 
    email: 'daniel.pereira@email.com', 
    telefone: '(11) 95678-1234', 
    funcao: 'Guitarrista', 
    status: 'inativo',
    dataNascimento: '12/12/1990',
    dataIngresso: '20/07/2018',
    endereco: {
      rua: 'Rua Consolação',
      numero: '750',
      cep: '04321-000',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    batizado: true,
    habilidades: ['Guitarra', 'Violão'],
    observacoes: 'Afastado temporariamente por motivos de saúde.'
  },
  { 
    id: '5', 
    nome: 'Eduardo Costa', 
    email: 'eduardo.costa@email.com', 
    telefone: '(11) 92345-6789', 
    funcao: 'Baterista', 
    status: 'ativo',
    dataNascimento: '05/03/1993',
    dataIngresso: '17/09/2020',
    endereco: {
      rua: 'Alameda Santos',
      numero: '400',
      cep: '05678-000',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    batizado: true,
    habilidades: ['Bateria', 'Percussão'],
    observacoes: 'Também atua como técnico de som.'
  },
];

interface MembersContextType {
  members: Membro[];
  getMember: (id: string) => Membro | null;
  updateMember: (member: Membro) => void;
  deleteMember: (id: string) => void;
  toggleMemberStatus: (id: string) => void;
  addMember: (member: Membro) => void;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [members, setMembers] = useState<Membro[]>([]);

  // Load members from localStorage on initial render
  useEffect(() => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      try {
        setMembers(JSON.parse(storedMembers));
      } catch (error) {
        console.error("Failed to parse stored members", error);
        setMembers(initialMembers);
      }
    } else {
      setMembers(initialMembers);
    }
  }, []);

  // Save members to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  const getMember = (id: string): Membro | null => {
    return members.find(member => member.id === id) || null;
  };

  const updateMember = (updatedMember: Membro): void => {
    setMembers(currentMembers => 
      currentMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    
    // Show toast notification
    toast({
      title: "Membro atualizado",
      description: `${updatedMember.nome} foi atualizado com sucesso.`,
    });
  };

  const deleteMember = (id: string): void => {
    const memberToDelete = getMember(id);
    setMembers(currentMembers => 
      currentMembers.filter(member => member.id !== id)
    );
    
    // Show toast notification if the member was found
    if (memberToDelete) {
      toast({
        title: "Membro removido",
        description: `${memberToDelete.nome} foi removido com sucesso.`,
      });
    }
  };

  const toggleMemberStatus = (id: string): void => {
    const memberToUpdate = getMember(id);
    setMembers(currentMembers => 
      currentMembers.map(member => {
        if (member.id === id) {
          const newStatus = member.status === 'ativo' ? 'inativo' : 'ativo';
          return { ...member, status: newStatus };
        }
        return member;
      })
    );
    
    // Show toast notification if the member was found
    if (memberToUpdate) {
      const newStatus = memberToUpdate.status === 'ativo' ? 'inativo' : 'ativo';
      toast({
        title: newStatus === 'ativo' ? "Membro ativado" : "Membro desativado",
        description: `${memberToUpdate.nome} foi ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
      });
    }
  };

  const addMember = (newMember: Membro): void => {
    // Ensure new member has a valid ID and status is set
    const memberWithId = {
      ...newMember,
      id: newMember.id && newMember.id.startsWith('new-') ? `${Date.now()}` : (newMember.id || `${Date.now()}`),
      status: newMember.status || 'ativo' // Ensure status is set, default to 'ativo'
    };
    
    setMembers(currentMembers => [...currentMembers, memberWithId]);
    
    // Show toast notification
    toast({
      title: "Membro adicionado",
      description: `${newMember.nome} foi adicionado com sucesso.`,
    });
  };

  return (
    <MembersContext.Provider value={{
      members,
      getMember,
      updateMember,
      deleteMember,
      toggleMemberStatus,
      addMember
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
