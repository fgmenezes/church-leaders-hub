export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendas: {
        Row: {
          created_at: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          id: string
          local: string | null
          recorrencia: Json | null
          responsavel_id: string | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          id?: string
          local?: string | null
          recorrencia?: Json | null
          responsavel_id?: string | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          id?: string
          local?: string | null
          recorrencia?: Json | null
          responsavel_id?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      arquivos_media: {
        Row: {
          categoria: string | null
          created_at: string | null
          descricao: string | null
          formato: string | null
          id: string
          nome: string
          tags: string[] | null
          tamanho: number | null
          tipo: string
          updated_at: string | null
          upload_por: string | null
          url: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          formato?: string | null
          id?: string
          nome: string
          tags?: string[] | null
          tamanho?: number | null
          tipo: string
          updated_at?: string | null
          upload_por?: string | null
          url: string
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          formato?: string | null
          id?: string
          nome?: string
          tags?: string[] | null
          tamanho?: number | null
          tipo?: string
          updated_at?: string | null
          upload_por?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_media_upload_por_fkey"
            columns: ["upload_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_financeiras: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      endereco_membros: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          estado: string | null
          id: string
          membro_id: string | null
          numero: string | null
          rua: string | null
          updated_at: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          membro_id?: string | null
          numero?: string | null
          rua?: string | null
          updated_at?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          membro_id?: string | null
          numero?: string | null
          rua?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "endereco_membros_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          capacidade: number | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          id: string
          imagem_url: string | null
          local: string | null
          responsavel_id: string | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          capacidade?: number | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          local?: string | null
          responsavel_id?: string | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          capacidade?: number | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          local?: string | null
          responsavel_id?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_participantes: {
        Row: {
          created_at: string | null
          data_inscricao: string | null
          evento_id: string | null
          id: string
          membro_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_inscricao?: string | null
          evento_id?: string | null
          id?: string
          membro_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_inscricao?: string | null
          evento_id?: string | null
          id?: string
          membro_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_participantes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_participantes_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_tarefas: {
        Row: {
          created_at: string | null
          descricao: string | null
          evento_id: string | null
          id: string
          prazo: string | null
          responsavel_id: string | null
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          evento_id?: string | null
          id?: string
          prazo?: string | null
          responsavel_id?: string | null
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          evento_id?: string | null
          id?: string
          prazo?: string | null
          responsavel_id?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_tarefas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habilidades_membros: {
        Row: {
          created_at: string | null
          habilidade: string
          id: string
          membro_id: string | null
        }
        Insert: {
          created_at?: string | null
          habilidade: string
          id?: string
          membro_id?: string | null
        }
        Update: {
          created_at?: string | null
          habilidade?: string
          id?: string
          membro_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habilidades_membros_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      membros: {
        Row: {
          batizado: boolean | null
          created_at: string | null
          data_ingresso: string | null
          data_nascimento: string | null
          email: string | null
          funcao: string
          id: string
          local_nascimento: string | null
          nome: string
          status: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          batizado?: boolean | null
          created_at?: string | null
          data_ingresso?: string | null
          data_nascimento?: string | null
          email?: string | null
          funcao: string
          id?: string
          local_nascimento?: string | null
          nome: string
          status?: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          batizado?: boolean | null
          created_at?: string | null
          data_ingresso?: string | null
          data_nascimento?: string | null
          email?: string | null
          funcao?: string
          id?: string
          local_nascimento?: string | null
          nome?: string
          status?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      observacoes: {
        Row: {
          autor: string
          created_at: string | null
          data: string
          id: string
          membro_id: string | null
          texto: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          autor: string
          created_at?: string | null
          data: string
          id?: string
          membro_id?: string | null
          texto: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          autor?: string
          created_at?: string | null
          data?: string
          id?: string
          membro_id?: string | null
          texto?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observacoes_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          ano: number
          categoria_id: string | null
          created_at: string | null
          id: string
          mes: number
          updated_at: string | null
          valor: number
        }
        Insert: {
          ano: number
          categoria_id?: string | null
          created_at?: string | null
          id?: string
          mes: number
          updated_at?: string | null
          valor: number
        }
        Update: {
          ano?: number
          categoria_id?: string | null
          created_at?: string | null
          id?: string
          mes?: number
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
        ]
      }
      pequenos_grupos: {
        Row: {
          created_at: string | null
          descricao: string | null
          dia_semana: string | null
          endereco: Json | null
          horario: string | null
          id: string
          lider_auxiliar_id: string | null
          lider_id: string | null
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          dia_semana?: string | null
          endereco?: Json | null
          horario?: string | null
          id?: string
          lider_auxiliar_id?: string | null
          lider_id?: string | null
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          dia_semana?: string | null
          endereco?: Json | null
          horario?: string | null
          id?: string
          lider_auxiliar_id?: string | null
          lider_id?: string | null
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pequenos_grupos_membros: {
        Row: {
          created_at: string | null
          data_entrada: string | null
          grupo_id: string | null
          id: string
          membro_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_entrada?: string | null
          grupo_id?: string | null
          id?: string
          membro_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_entrada?: string | null
          grupo_id?: string | null
          id?: string
          membro_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pequenos_grupos_membros_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "pequenos_grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pequenos_grupos_membros_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      pequenos_grupos_presenca: {
        Row: {
          created_at: string | null
          data_encontro: string
          grupo_id: string | null
          id: string
          membros_presentes: string[] | null
          updated_at: string | null
          visitantes: Json | null
        }
        Insert: {
          created_at?: string | null
          data_encontro: string
          grupo_id?: string | null
          id?: string
          membros_presentes?: string[] | null
          updated_at?: string | null
          visitantes?: Json | null
        }
        Update: {
          created_at?: string | null
          data_encontro?: string
          grupo_id?: string | null
          id?: string
          membros_presentes?: string[] | null
          updated_at?: string | null
          visitantes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pequenos_grupos_presenca_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "pequenos_grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      planejamentos: {
        Row: {
          created_at: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          id: string
          objetivos: Json | null
          progresso: number | null
          responsavel_id: string | null
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          id?: string
          objetivos?: Json | null
          progresso?: number | null
          responsavel_id?: string | null
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          id?: string
          objetivos?: Json | null
          progresso?: number | null
          responsavel_id?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planejamentos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          cargo: string | null
          created_at: string | null
          data_entrada: string | null
          email: string | null
          foto_url: string | null
          id: string
          nome: string | null
          telefone: string | null
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          cargo?: string | null
          created_at?: string | null
          data_entrada?: string | null
          email?: string | null
          foto_url?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          cargo?: string | null
          created_at?: string | null
          data_entrada?: string | null
          email?: string | null
          foto_url?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      relatorios: {
        Row: {
          created_at: string | null
          criado_por: string | null
          dados: Json | null
          descricao: string | null
          id: string
          periodo_fim: string | null
          periodo_inicio: string | null
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criado_por?: string | null
          dados?: Json | null
          descricao?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criado_por?: string | null
          dados?: Json | null
          descricao?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      responsaveis_membros: {
        Row: {
          created_at: string | null
          id: string
          membro_id: string | null
          nome: string | null
          telefone: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          membro_id?: string | null
          nome?: string | null
          telefone?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          membro_id?: string | null
          nome?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responsaveis_membros_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes_financeiras: {
        Row: {
          categoria_id: string | null
          comprovante_url: string | null
          created_at: string | null
          data: string
          descricao: string
          id: string
          metodo_pagamento: string | null
          observacoes: string | null
          responsavel_id: string | null
          tipo: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data: string
          descricao: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          responsavel_id?: string | null
          tipo: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          categoria_id?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data?: string
          descricao?: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          responsavel_id?: string | null
          tipo?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_financeiras_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_financeiras_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "lider" | "membro" | "visitante"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "lider", "membro", "visitante"],
    },
  },
} as const
