import { supabase } from "@/integrations/supabase/client";

export type AdminAction = 
  | 'RESERVA_CRIADA'
  | 'RESERVA_EDITADA'
  | 'STATUS_ATUALIZADO'
  | 'CONTRATO_GERADO'
  | 'EMAIL_ENVIADO'
  | 'CACHE_PAGO'
  | 'PROFISSIONAL_ALOCADO'
  | 'PROFISSIONAL_CONFIRMADO'
  | 'CLIENTE_CRIADO'
  | 'CLIENTE_EDITADO'
  | 'RECREADOR_CRIADO'
  | 'RECREADOR_EDITADO'
  | 'RECREADOR_STATUS_ALTERADO'
  | 'TOKEN_PESQUISA_GERADO'
  | 'RESERVA_EXCLUIDA'
  | 'NOTAS_ATUALIZADAS';

// Mapeamento de ações para descrições legíveis
const actionDescriptions: Record<AdminAction, string> = {
  'RESERVA_CRIADA': 'Reserva criada',
  'RESERVA_EDITADA': 'Dados da reserva alterados',
  'STATUS_ATUALIZADO': 'Status da reserva atualizado',
  'CONTRATO_GERADO': 'Contrato gerado e enviado',
  'EMAIL_ENVIADO': 'E-mail enviado ao cliente',
  'CACHE_PAGO': 'Cachê marcado como pago',
  'PROFISSIONAL_ALOCADO': 'Profissional alocado ao evento',
  'PROFISSIONAL_CONFIRMADO': 'Profissional confirmou presença',
  'CLIENTE_CRIADO': 'Cliente cadastrado',
  'CLIENTE_EDITADO': 'Dados do cliente alterados',
  'RECREADOR_CRIADO': 'Recreador cadastrado',
  'RECREADOR_EDITADO': 'Dados do recreador alterados',
  'RECREADOR_STATUS_ALTERADO': 'Status do recreador alterado',
  'TOKEN_PESQUISA_GERADO': 'Link de pesquisa gerado',
  'RESERVA_EXCLUIDA': 'Reserva excluída',
  'NOTAS_ATUALIZADAS': 'Notas internas atualizadas',
};

export interface LogPayload {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AdminLogEntry {
  id: string;
  created_at: string;
  usuario_admin: string | null;
  reserva_id: string | null;
  acao: string;
  descricao: string | null;
  detalhes: LogPayload;
  payload: LogPayload;
}

export const getActionDescription = (action: AdminAction): string => {
  return actionDescriptions[action] || action;
};

export const formatLogDescription = (
  action: AdminAction, 
  details?: LogPayload
): string => {
  const baseDescription = getActionDescription(action);
  
  if (!details) return baseDescription;
  
  // Adicionar detalhes específicos
  switch (action) {
    case 'STATUS_ATUALIZADO':
      if (details.de && details.para) {
        return `${baseDescription}: ${details.de} → ${details.para}`;
      }
      break;
    case 'RESERVA_EDITADA':
      if (details.campos) {
        return `${baseDescription} (${details.campos})`;
      }
      break;
    case 'CACHE_PAGO':
      if (details.profissional && details.valor) {
        return `${baseDescription}: ${details.profissional} - R$ ${details.valor}`;
      }
      break;
    case 'PROFISSIONAL_ALOCADO':
      if (details.profissional) {
        return `${baseDescription}: ${details.profissional}`;
      }
      break;
  }
  
  return baseDescription;
};

export const logAdminAction = async (
  acao: AdminAction,
  reservaId?: string | null,
  detalhes?: LogPayload
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Tentativa de log sem usuário autenticado');
      return false;
    }

    const descricao = formatLogDescription(acao, detalhes);

    const { error } = await supabase
      .from('admin_logs')
      .insert([{
        usuario_admin: user.id,
        reserva_id: reservaId || null,
        acao,
        descricao,
        detalhes: detalhes || {},
        payload: detalhes || {}
      }]);

    if (error) {
      console.error('Erro ao registrar log:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erro ao registrar log:', err);
    return false;
  }
};

export const fetchLogsByReserva = async (reservaId: string): Promise<AdminLogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .eq('reserva_id', reservaId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AdminLogEntry[];
  } catch (err) {
    console.error('Erro ao buscar logs:', err);
    return [];
  }
};

export const fetchAllLogs = async (
  limit = 100,
  filters?: {
    acao?: AdminAction;
    startDate?: string;
    endDate?: string;
  }
): Promise<AdminLogEntry[]> => {
  try {
    let query = supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filters?.acao) {
      query = query.eq('acao', filters.acao);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as AdminLogEntry[];
  } catch (err) {
    console.error('Erro ao buscar logs:', err);
    return [];
  }
};
