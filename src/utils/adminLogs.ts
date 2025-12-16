import { supabase } from "@/integrations/supabase/client";

export type AdminAction = 
  | 'reserva_confirmada'
  | 'reserva_aprovada'
  | 'reserva_cancelada'
  | 'contrato_gerado'
  | 'cache_pago'
  | 'profissional_alocado'
  | 'profissional_confirmado'
  | 'dados_alterados';

type LogDetails = Record<string, string | number | boolean | null>;

export const logAdminAction = async (
  acao: AdminAction,
  reservaId?: string | null,
  detalhes?: LogDetails
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Tentativa de log sem usuário autenticado');
      return false;
    }

    const { error } = await supabase
      .from('admin_logs')
      .insert([{
        usuario_admin: user.id,
        reserva_id: reservaId || null,
        acao,
        detalhes: detalhes || {}
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
