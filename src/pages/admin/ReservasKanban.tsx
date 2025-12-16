import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, Package, DollarSign, Star, GripVertical, ChevronRight, LayoutList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { logAdminAction } from "@/utils/adminLogs";

interface ReservaKanban {
  id: string;
  codigo: string | null;
  nome_completo: string;
  data_evento: string;
  hora_inicio: string;
  pacote_tipo: string;
  numero_criancas: number;
  total_calculado: number;
  status: string;
  telefone: string;
}

const KANBAN_COLUMNS = [
  { id: 'pendente', label: 'Pendente', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'confirmado', label: 'Confirmado', color: 'bg-blue-100 border-blue-300' },
  { id: 'aprovado', label: 'Aprovado', color: 'bg-green-100 border-green-300' },
  { id: 'realizado', label: 'Realizado', color: 'bg-purple-100 border-purple-300' },
  { id: 'cancelado', label: 'Cancelado', color: 'bg-red-100 border-red-300' },
];

const ReservasKanban = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reservas, setReservas] = useState<ReservaKanban[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchReservas();
    }
  }, [user, isAdmin]);

  const fetchReservas = async () => {
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("id, codigo, nome_completo, data_evento, hora_inicio, pacote_tipo, numero_criancas, total_calculado, status, telefone")
        .order("data_evento", { ascending: true });

      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error("Error fetching reservas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as reservas.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const moveToStatus = async (reservaId: string, currentStatus: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reservas")
        .update({ status: newStatus })
        .eq("id", reservaId);

      if (error) throw error;

      await logAdminAction('STATUS_ATUALIZADO', reservaId, {
        de: currentStatus,
        para: newStatus,
        via: 'kanban',
      });

      setReservas((prev) =>
        prev.map((r) => (r.id === reservaId ? { ...r, status: newStatus } : r))
      );

      toast({
        title: "Status atualizado",
        description: `Reserva movida para "${KANBAN_COLUMNS.find(c => c.id === newStatus)?.label}"`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const idx = KANBAN_COLUMNS.findIndex((c) => c.id === currentStatus);
    if (idx >= 0 && idx < KANBAN_COLUMNS.length - 2) {
      // Skip "cancelado" as next step
      return KANBAN_COLUMNS[idx + 1].id;
    }
    return null;
  };

  const getReservasByStatus = (status: string) => {
    return reservas.filter((r) => r.status === status);
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
            <h1 className="text-3xl font-bold">Pipeline de Reservas</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie o funil de reservas
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/reservas')}>
            <LayoutList className="w-4 h-4 mr-2" />
            Ver Lista
          </Button>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((column) => (
              <div key={column.id} className="min-w-[280px]">
                <div className={`rounded-t-lg p-3 border-2 ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{column.label}</h3>
                    <Badge variant="secondary">
                      {getReservasByStatus(column.id).length}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-b-lg p-2 min-h-[400px] space-y-2">
                  {getReservasByStatus(column.id).map((reserva) => (
                    <Card
                      key={reserva.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">
                              {reserva.nome_completo}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reserva.codigo || reserva.id.slice(0, 8)}
                            </p>
                          </div>
                          <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(reserva.data_evento).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Package className="w-3 h-3" />
                            {reserva.pacote_tipo}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="w-3 h-3" />
                            {reserva.numero_criancas} crianças
                          </div>
                          <div className="flex items-center gap-1 font-medium text-green-600">
                            <DollarSign className="w-3 h-3" />
                            R$ {Number(reserva.total_calculado || 0).toFixed(0)}
                          </div>
                        </div>

                        {/* Botões de ação */}
                        {column.id !== 'cancelado' && column.id !== 'realizado' && (
                          <div className="pt-2 border-t flex gap-1">
                            {getNextStatus(column.id) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex-1 h-7 text-xs"
                                onClick={() => {
                                  const next = getNextStatus(column.id);
                                  if (next) moveToStatus(reserva.id, column.id, next);
                                }}
                              >
                                <ChevronRight className="w-3 h-3 mr-1" />
                                Avançar
                              </Button>
                            )}
                            {column.id !== 'cancelado' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => moveToStatus(reserva.id, column.id, 'cancelado')}
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {getReservasByStatus(column.id).length === 0 && (
                    <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                      Nenhuma reserva
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReservasKanban;
