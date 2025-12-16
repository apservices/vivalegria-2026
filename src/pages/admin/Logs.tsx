import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Filter, Search, FileText, User, Calendar, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchAllLogs, AdminLogEntry, AdminAction } from "@/utils/adminLogs";

const ACTION_LABELS: Record<string, string> = {
  'RESERVA_CRIADA': 'Reserva Criada',
  'RESERVA_EDITADA': 'Reserva Editada',
  'STATUS_ATUALIZADO': 'Status Atualizado',
  'CONTRATO_GERADO': 'Contrato Gerado',
  'EMAIL_ENVIADO': 'E-mail Enviado',
  'CACHE_PAGO': 'Cachê Pago',
  'PROFISSIONAL_ALOCADO': 'Profissional Alocado',
  'PROFISSIONAL_CONFIRMADO': 'Profissional Confirmado',
  'CLIENTE_CRIADO': 'Cliente Criado',
  'CLIENTE_EDITADO': 'Cliente Editado',
  'RECREADOR_CRIADO': 'Recreador Criado',
  'RECREADOR_EDITADO': 'Recreador Editado',
  'RECREADOR_STATUS_ALTERADO': 'Status Recreador',
  'TOKEN_PESQUISA_GERADO': 'Token Pesquisa',
  'RESERVA_EXCLUIDA': 'Reserva Excluída',
  'NOTAS_ATUALIZADAS': 'Notas Atualizadas',
};

const ACTION_COLORS: Record<string, string> = {
  'RESERVA_CRIADA': 'bg-blue-100 text-blue-700',
  'RESERVA_EDITADA': 'bg-yellow-100 text-yellow-700',
  'STATUS_ATUALIZADO': 'bg-green-100 text-green-700',
  'CONTRATO_GERADO': 'bg-purple-100 text-purple-700',
  'EMAIL_ENVIADO': 'bg-indigo-100 text-indigo-700',
  'CACHE_PAGO': 'bg-emerald-100 text-emerald-700',
  'PROFISSIONAL_ALOCADO': 'bg-orange-100 text-orange-700',
  'CLIENTE_CRIADO': 'bg-cyan-100 text-cyan-700',
  'CLIENTE_EDITADO': 'bg-amber-100 text-amber-700',
  'RECREADOR_CRIADO': 'bg-pink-100 text-pink-700',
  'RESERVA_EXCLUIDA': 'bg-red-100 text-red-700',
};

const AdminLogs = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadLogs();
    }
  }, [user, isAdmin, actionFilter, limit]);

  const loadLogs = async () => {
    setLoadingData(true);
    const data = await fetchAllLogs(limit, {
      acao: actionFilter !== 'all' ? actionFilter as AdminAction : undefined,
    });
    setLogs(data);
    setLoadingData(false);
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.descricao?.toLowerCase().includes(term) ||
      log.acao.toLowerCase().includes(term) ||
      JSON.stringify(log.detalhes).toLowerCase().includes(term)
    );
  });

  const getActionBadge = (action: string) => {
    const color = ACTION_COLORS[action] || 'bg-gray-100 text-gray-700';
    const label = ACTION_LABELS[action] || action;
    return <Badge className={`${color} font-normal`}>{label}</Badge>;
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="w-8 h-8" />
              Logs de Auditoria
            </h1>
            <p className="text-muted-foreground">
              Histórico de ações administrativas do sistema
            </p>
          </div>
          <Button variant="outline" onClick={loadLogs} disabled={loadingData}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar em descrição ou detalhes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                {Object.entries(ACTION_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">Últimos 50</SelectItem>
                <SelectItem value="100">Últimos 100</SelectItem>
                <SelectItem value="250">Últimos 250</SelectItem>
                <SelectItem value="500">Últimos 500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Lista de logs */}
        <Card className="overflow-hidden">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum log encontrado
            </div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getActionBadge(log.acao)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {log.descricao || log.acao}
                        </p>
                        {log.detalhes && Object.keys(log.detalhes).length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(log.detalhes).map(([key, value]) => (
                              value && (
                                <span key={key} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {key}: {String(value)}
                                </span>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground md:ml-auto">
                      {log.reserva_id && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {log.reserva_id.slice(0, 8)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground">
          Exibindo {filteredLogs.length} de {logs.length} registros
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;
