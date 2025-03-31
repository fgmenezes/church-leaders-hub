
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  endereco?: string;
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
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
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
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
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
    endereco: 'Rua Augusta, 500 - São Paulo/SP',
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
    endereco: 'Rua Consolação, 750 - São Paulo/SP',
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
    endereco: 'Alameda Santos, 400 - São Paulo/SP',
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
  };

  const deleteMember = (id: string): void => {
    setMembers(currentMembers => 
      currentMembers.filter(member => member.id !== id)
    );
  };

  const toggleMemberStatus = (id: string): void => {
    setMembers(currentMembers => 
      currentMembers.map(member => 
        member.id === id 
          ? { ...member, status: member.status === 'ativo' ? 'inativo' : 'ativo' } 
          : member
      )
    );
  };

  const addMember = (newMember: Membro): void => {
    setMembers(currentMembers => [...currentMembers, newMember]);
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
