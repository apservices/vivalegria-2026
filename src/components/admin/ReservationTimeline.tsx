import { useEffect, useState } from "react";
import { Clock, FileText, Check, X, User, Mail, DollarSign, Edit, AlertCircle } from "lucide-react";
import { fetchLogsByReserva, AdminLogEntry, AdminAction } from "@/utils/adminLogs";

interface ReservationTimelineProps {
  reservaId: string;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'RESERVA_CRIADA':
      return <FileText className="w-4 h-4" />;
    case 'STATUS_ATUALIZADO':
      return <Check className="w-4 h-4" />;
    case 'CONTRATO_GERADO':
      return <FileText className="w-4 h-4" />;
    case 'EMAIL_ENVIADO':
      return <Mail className="w-4 h-4" />;
    case 'CACHE_PAGO':
      return <DollarSign className="w-4 h-4" />;
    case 'PROFISSIONAL_ALOCADO':
      return <User className="w-4 h-4" />;
    case 'RESERVA_EDITADA':
      return <Edit className="w-4 h-4" />;
    case 'RESERVA_EXCLUIDA':
      return <X className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'RESERVA_CRIADA':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'STATUS_ATUALIZADO':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'CONTRATO_GERADO':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'EMAIL_ENVIADO':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'CACHE_PAGO':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'PROFISSIONAL_ALOCADO':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'RESERVA_EDITADA':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'RESERVA_EXCLUIDA':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const ReservationTimeline = ({ reservaId }: ReservationTimelineProps) => {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      const data = await fetchLogsByReserva(reservaId);
      setLogs(data);
      setLoading(false);
    };
    
    if (reservaId) {
      loadLogs();
    }
  }, [reservaId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-4 text-muted-foreground text-sm">
        <AlertCircle className="w-4 h-4 mr-2" />
        Nenhum histórico registrado ainda
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Linha do Tempo
      </h4>
      
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
        
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div key={log.id} className="relative flex gap-3 pl-0">
              {/* Ícone */}
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${getActionColor(log.acao)}`}>
                {getActionIcon(log.acao)}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm font-medium text-foreground">
                  {log.descricao || log.acao}
                </p>
                
                {/* Detalhes adicionais */}
                {log.detalhes && Object.keys(log.detalhes).length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground space-x-2">
                    {Object.entries(log.detalhes).map(([key, value]) => (
                      value && (
                        <span key={key} className="inline-block bg-muted px-1.5 py-0.5 rounded">
                          {key}: {String(value)}
                        </span>
                      )
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationTimeline;
