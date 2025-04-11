
import { Json } from '@/integrations/supabase/types';

// Small Group Types
export interface SmallGroupAddress {
  rua: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface SmallGroupResponsible {
  nome: string;
  telefone: string;
  email?: string;
}

export interface Visitor {
  nome: string;
  telefone: string;
  convidadoPor: string;
  id?: string;
}

export interface AttendanceRecord {
  id: string;
  data: string;
  membrosPresentes: string[];
  visitantes: Visitor[];
}

export interface SmallGroup {
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

// DB interface for better Supabase integration
export interface SmallGroupDB {
  id: string;
  nome: string;
  descricao?: string;
  endereco: Json;
  dia_semana?: string;
  horario?: string;
  lider_id?: string;
  lider_auxiliar_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SmallGroupsContextType {
  smallGroups: SmallGroup[];
  isLoading?: boolean;
  addSmallGroup: (group: SmallGroup) => Promise<SmallGroup>;
  updateSmallGroup: (updatedGroup: SmallGroup) => Promise<void>;
  deleteSmallGroup: (id: string) => Promise<void>;
  getSmallGroupById: (id: string) => Promise<SmallGroup | undefined>;
  getSmallGroup: (id: string) => Promise<SmallGroup | undefined>;
  addMemberToGroup: (groupId: string, memberId: string) => Promise<void>;
  removeMemberFromGroup: (groupId: string, memberId: string) => Promise<void>;
  registerAttendance: (groupId: string, attendance: AttendanceRecord) => Promise<void>;
}
