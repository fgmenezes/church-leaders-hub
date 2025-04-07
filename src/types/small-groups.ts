
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

export interface SmallGroupsContextType {
  smallGroups: SmallGroup[];
  addSmallGroup: (group: SmallGroup) => SmallGroup;
  updateSmallGroup: (updatedGroup: SmallGroup) => void;
  deleteSmallGroup: (id: string) => void;
  getSmallGroupById: (id: string) => SmallGroup | undefined;
  getSmallGroup: (id: string) => SmallGroup | undefined;
  addMemberToGroup: (groupId: string, memberId: string) => void;
  removeMemberFromGroup: (groupId: string, memberId: string) => void;
  registerAttendance: (groupId: string, attendance: AttendanceRecord) => void;
}
