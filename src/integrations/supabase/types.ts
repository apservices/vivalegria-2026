export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      avaliacoes_evento: {
        Row: {
          created_at: string
          id: string
          observacoes_admin: string | null
          profissional_id: string | null
          profissional_nome: string | null
          reserva_id: string | null
          respostas: Json
        }
        Insert: {
          created_at?: string
          id?: string
          observacoes_admin?: string | null
          profissional_id?: string | null
          profissional_nome?: string | null
          reserva_id?: string | null
          respostas?: Json
        }
        Update: {
          created_at?: string
          id?: string
          observacoes_admin?: string | null
          profissional_id?: string | null
          profissional_nome?: string | null
          reserva_id?: string | null
          respostas?: Json
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_evento_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_evento_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      candidaturas: {
        Row: {
          cidade: string
          created_at: string
          disponibilidade: string[] | null
          email: string
          experiencia: string | null
          id: string
          nome_completo: string
          sobre_voce: string | null
          status: string
          telefone: string
        }
        Insert: {
          cidade: string
          created_at?: string
          disponibilidade?: string[] | null
          email: string
          experiencia?: string | null
          id?: string
          nome_completo: string
          sobre_voce?: string | null
          status?: string
          telefone: string
        }
        Update: {
          cidade?: string
          created_at?: string
          disponibilidade?: string[] | null
          email?: string
          experiencia?: string | null
          id?: string
          nome_completo?: string
          sobre_voce?: string | null
          status?: string
          telefone?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf_cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome_completo: string
          telefone: string | null
          tipo_cadastro: string
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome_completo: string
          telefone?: string | null
          tipo_cadastro: string
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome_completo?: string
          telefone?: string | null
          tipo_cadastro?: string
          updated_at?: string
        }
        Relationships: []
      }
      evento_casting: {
        Row: {
          cache: number | null
          confirmado: boolean | null
          created_at: string | null
          funcao: string | null
          id: string
          observacoes: string | null
          profissional_id: string | null
          profissional_nome_manual: string | null
          reserva_id: string | null
        }
        Insert: {
          cache?: number | null
          confirmado?: boolean | null
          created_at?: string | null
          funcao?: string | null
          id?: string
          observacoes?: string | null
          profissional_id?: string | null
          profissional_nome_manual?: string | null
          reserva_id?: string | null
        }
        Update: {
          cache?: number | null
          confirmado?: boolean | null
          created_at?: string | null
          funcao?: string | null
          id?: string
          observacoes?: string | null
          profissional_id?: string | null
          profissional_nome_manual?: string | null
          reserva_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evento_casting_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_casting_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      pesquisas_clientes: {
        Row: {
          created_at: string
          id: string
          reserva_id: string | null
          respostas: Json
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          reserva_id?: string | null
          respostas?: Json
          token: string
        }
        Update: {
          created_at?: string
          id?: string
          reserva_id?: string | null
          respostas?: Json
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "pesquisas_clientes_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      profissionais: {
        Row: {
          apelido: string | null
          cpf: string | null
          created_at: string | null
          cursos: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          experiencia_tempo: string | null
          faixa_etaria_experiencia: string | null
          formacao: string | null
          frequencia_desejada: string | null
          habilidades: Json | null
          id: string
          interesse_pacotes: boolean | null
          nome_completo: string
          pix_chave: string | null
          registro: string | null
          status: string | null
          telefone: string | null
          tem_cnpj: boolean | null
          transporte: string | null
          uniformes: Json | null
          updated_at: string | null
        }
        Insert: {
          apelido?: string | null
          cpf?: string | null
          created_at?: string | null
          cursos?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          experiencia_tempo?: string | null
          faixa_etaria_experiencia?: string | null
          formacao?: string | null
          frequencia_desejada?: string | null
          habilidades?: Json | null
          id?: string
          interesse_pacotes?: boolean | null
          nome_completo: string
          pix_chave?: string | null
          registro?: string | null
          status?: string | null
          telefone?: string | null
          tem_cnpj?: boolean | null
          transporte?: string | null
          uniformes?: Json | null
          updated_at?: string | null
        }
        Update: {
          apelido?: string | null
          cpf?: string | null
          created_at?: string | null
          cursos?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          experiencia_tempo?: string | null
          faixa_etaria_experiencia?: string | null
          formacao?: string | null
          frequencia_desejada?: string | null
          habilidades?: Json | null
          id?: string
          interesse_pacotes?: boolean | null
          nome_completo?: string
          pix_chave?: string | null
          registro?: string | null
          status?: string | null
          telefone?: string | null
          tem_cnpj?: boolean | null
          transporte?: string | null
          uniformes?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservas: {
        Row: {
          cep: string | null
          cidade: string | null
          cliente_id: string | null
          codigo: string | null
          complemento: string | null
          contrato_gerado_em: string | null
          contrato_url: string | null
          cpf_cnpj: string
          created_at: string
          data_evento: string
          email: string
          email_enviado_em: string | null
          endereco: string | null
          extras_selecionados: string[] | null
          hora_inicio: string
          id: string
          local_evento: string
          nome_completo: string
          numero_criancas: number
          oficinas_selecionadas: string[] | null
          pacote_tipo: string
          status: string
          telefone: string
          tipo_cadastro: Database["public"]["Enums"]["tipo_cadastro"]
          tipo_cliente: Database["public"]["Enums"]["tipo_cliente"]
          total_calculado: number
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cliente_id?: string | null
          codigo?: string | null
          complemento?: string | null
          contrato_gerado_em?: string | null
          contrato_url?: string | null
          cpf_cnpj: string
          created_at?: string
          data_evento: string
          email: string
          email_enviado_em?: string | null
          endereco?: string | null
          extras_selecionados?: string[] | null
          hora_inicio: string
          id?: string
          local_evento: string
          nome_completo: string
          numero_criancas?: number
          oficinas_selecionadas?: string[] | null
          pacote_tipo: string
          status?: string
          telefone: string
          tipo_cadastro: Database["public"]["Enums"]["tipo_cadastro"]
          tipo_cliente: Database["public"]["Enums"]["tipo_cliente"]
          total_calculado: number
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cliente_id?: string | null
          codigo?: string | null
          complemento?: string | null
          contrato_gerado_em?: string | null
          contrato_url?: string | null
          cpf_cnpj?: string
          created_at?: string
          data_evento?: string
          email?: string
          email_enviado_em?: string | null
          endereco?: string | null
          extras_selecionados?: string[] | null
          hora_inicio?: string
          id?: string
          local_evento?: string
          nome_completo?: string
          numero_criancas?: number
          oficinas_selecionadas?: string[] | null
          pacote_tipo?: string
          status?: string
          telefone?: string
          tipo_cadastro?: Database["public"]["Enums"]["tipo_cadastro"]
          tipo_cliente?: Database["public"]["Enums"]["tipo_cliente"]
          total_calculado?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens_pesquisa: {
        Row: {
          created_at: string
          is_active: boolean
          reserva_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          reserva_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          is_active?: boolean
          reserva_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tokens_pesquisa_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_satisfaction_token: {
        Args: { p_reserva_id: string }
        Returns: string
      }
      get_or_create_cliente: {
        Args: {
          p_cep?: string
          p_cidade?: string
          p_complemento?: string
          p_cpf_cnpj: string
          p_email?: string
          p_endereco?: string
          p_nome_completo: string
          p_telefone?: string
          p_tipo_cadastro: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_cliente_by_cpf_cnpj: {
        Args: { p_cpf_cnpj: string }
        Returns: Json
      }
      submit_pesquisa_satisfacao: {
        Args: { p_respostas: Json; p_token: string }
        Returns: Json
      }
      validate_pesquisa_token: { Args: { p_token: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      tipo_cadastro: "pf" | "pj"
      tipo_cliente: "existente" | "novo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      tipo_cadastro: ["pf", "pj"],
      tipo_cliente: ["existente", "novo"],
    },
  },
} as const
