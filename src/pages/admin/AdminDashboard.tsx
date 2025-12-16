import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Reserva {
  id: string;
  nome_completo: string;
  email: string;
  data_evento: string | null;
  created_at: string;
  pacote_tipo: string;
  status: string;
  total_calculado: number | null;
}

interface Candidatura {
  id: string;
  status: string;
  created_at: string;
}

interface EventoCasting {
  id: string;
  reserva_id: string;
  cache: number | null;
}

interface Stats {
  reservasPendentes: number;
  reservasConfirmadas: number;
  reservasCanceladas: number;
  candidaturasPendentes: number;
  totalReservas: number;
  eventosCastingIncompleto: number;
  totalCacheMes: number;
  reservasSemana: number;
  reservasMes: number;
  taxaConfirmacao: number; // confirmadas / totais
}

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats>({
    reservasPendentes: 0,
    reservasConfirmadas: 0,
    reservasCanceladas: 0,
    candidaturasPendentes: 0,
    totalReservas: 0,
    eventosCastingIncompleto: 0,
    totalCacheMes: 0,
    reservasSemana: 0,
    reservasMes: 0,
    taxaConfirmacao: 0,
  });

  const [recentReservas, setRecentReservas] = useState<Reserva[]>([]);
  const [proximosEventos, setProximosEventos] = useState<Reserva[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Proteção de rota admin
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Buscar estatísticas e visão executiva
  useEffect(() => {
    if (user && isAdmin) {
      fetchStatsAndData();
    }
  }, [user, isAdmin]);

  const fetchStatsAndData = async () => {
    try {
      const [reservasResult, candidaturasResult, castingResult] =
        await Promise.all([
          supabase
            .from("reservas")
            .select(
              "id, nome_completo, email, status, pacote_tipo, total_calculado, data_evento, created_at"
            ),
          supabase.from("candidaturas").select("id, status, created_at"),
          supabase.from("evento_casting").select("id, reserva_id, cache"),
        ]);

      const reservas = (reservasResult.data || []) as Reserva[];
      const candidaturas = (candidaturasResult.data || []) as Candidatura[];
      const casting = (castingResult.data || []) as EventoCasting[];

      // KPIs básicos
      const reservasPendentes = reservas.filter(
        (r) => r.status === "pendente"
      ).length;
      const reservasConfirmadas = reservas.filter(
        (r) => r.status === "confirmado"
      ).length;
      const reservasCanceladas = reservas.filter(
        (r) => r.status === "cancelado"
      ).length;
      const candidaturasPendentes = candidaturas.filter(
        (c) => c.status === "pendente"
      ).length;
      const totalReservas = reservas.length;

      // Janela temporal
      const agora = new Date();
      const inicioSemana = new Date(agora);
      inicioSemana.setDate(agora.getDate() - 7);
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();

      const reservasSemana = reservas.filter((r) => {
        const d = new Date(r.created_at);
        return d >= inicioSemana && d <= agora;
      }).length;

      const reservasMes = reservas.filter((r) => {
        const d = new Date(r.created_at);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      }).length;

      const taxaConfirmacao =
        totalReservas > 0
          ? Number(((reservasConfirmadas / totalReservas) * 100).toFixed(1))
          : 0;

      // Casting incompleto (mesma lógica da tela de Casting)
      const getRequiredProfessionals = (pacoteTipo: string) => {
        if (!pacoteTipo) return 1;
        if (pacoteTipo.toLowerCase().includes("select")) return 2;
        return 1;
      };

      const eventosCastingIncompleto = reservas.filter((r) => {
        const eventCasting = casting.filter((c) => c.reserva_id === r.id);
        const required = getRequiredProfessionals(r.pacote_tipo);
        return eventCasting.length < required;
      }).length;

      // Total de cachê no mês atual (baseado em data_evento)
      const reservasDoMes = reservas.filter((r) => {
        if (!r.data_evento) return false;
        const d = new Date(r.data_evento);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      });
      const idsReservasMes = new Set(reservasDoMes.map((r) => r.id));

      const totalCacheMes = casting
        .filter((c) => idsReservasMes.has(c.reserva_id))
        .reduce((acc, curr) => acc + (curr.cache || 0), 0);

      // Reservas recentes (últimas criadas)
      const recent = [...reservas]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .slice(0, 5);

      // Próximos eventos por data_evento
      const proximos = reservas
        .filter((r) => r.data_evento)
        .sort(
          (a, b) =>
            new Date(a.data_evento || "").getTime() -
            new Date(b.data_evento || "").getTime()
        )
        .slice(0, 5);

      setStats({
        reservasPendentes,
        reservasConfirmadas,
        reservasCanceladas,
        candidaturasPendentes,
        totalReservas,
        eventosCastingIncompleto,
        totalCacheMes,
        reservasSemana,
        reservasMes,
        taxaConfirmacao,
      });
      setRecentReservas(recent);
      setProximosEventos(proximos);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const funilLegend = useMemo(
    () => [
      { label: "Pendentes", value: stats.reservasPendentes, color: "bg-yellow-400" },
      { label: "Confirmadas", value: stats.reservasConfirmadas, color: "bg-green-500" },
      { label: "Canceladas", value: stats.reservasCanceladas, color: "bg-red-500" },
    ],
    [stats]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            Pendente
          </span>
        );
      case "confirmado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Confirmado
          </span>
        );
      case "cancelado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header executivo */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Dashboard executivo</h1>
          <p className="text-muted-foreground">
            Visão consolidada das reservas, casting, financeiro e candidaturas.
          </p>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Reservas nesta semana
                </p>
                <p className="text-3xl font-bold mt-1">
                  {loadingStats ? "..." : stats.reservasSemana}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Novas reservas criadas nos últimos 7 dias
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Reservas neste mês
                </p>
                <p className="text-3xl font-bold mt-1">
                  {loadingStats ? "..." : stats.reservasMes}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de reservas criadas no mês atual
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Taxa de confirmação
                </p>
                <p className="text-3xl font-bold mt-1">
                  {loadingStats ? "..." : `${stats.taxaConfirmacao}%`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confirmadas vs. total de reservas
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Candidaturas pendentes
                </p>
                <p className="text-3xl font-bold mt-1">
                  {loadingStats ? "..." : stats.candidaturasPendentes}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recreadores aguardando análise
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Funil de reservas + casting + financeiro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funil de reservas */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Funil de reservas</h2>
            </div>
            <div className="space-y-3">
              {funilLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold">
                      {loadingStats ? "..." : item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Use este funil para monitorar gargalos de confirmação e necessidade
              de contato ativo com clientes.
            </p>
          </Card>

          {/* Casting e operação */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Operação & Casting</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Eventos com casting incompleto
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Eventos confirmados que ainda não têm equipe completa.
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">
                  {loadingStats ? "..." : stats.eventosCastingIncompleto}
                </span>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/casting">Ir para escala de casting</Link>
              </Button>
            </div>
          </Card>

          {/* Financeiro de cachês */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Financeiro de cachês</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de cachês previstos neste mês
                </p>
                <p className="text-3xl font-bold mt-1 flex items-center gap-1">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  {loadingStats
                    ? "..."
                    : stats.totalCacheMes.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Soma dos cachês lançados para eventos do mês atual.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Reservas recentes + próximos eventos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservas recentes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Reservas recentes</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/reservas">Ver todas</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Criada em
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Pacote
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhuma reserva encontrada
                      </td>
                    </tr>
                  ) : (
                    recentReservas.map((reserva) => (
                      <tr
                        key={reserva.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-2">
                          <p className="font-medium">
                            {reserva.nome_completo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {reserva.email}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-sm">
                          {new Date(
                            reserva.created_at
                          ).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-2 capitalize">
                          {reserva.pacote_tipo}
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(reserva.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Próximos eventos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Próximos eventos</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/reservas?filter=futuros">Ver agenda</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Data do evento
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Pacote
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proximosEventos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum evento futuro encontrado
                      </td>
                    </tr>
                  ) : (
                    proximosEventos.map((reserva) => (
                      <tr
                        key={reserva.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-2">
                          <p className="font-medium">
                            {reserva.nome_completo}
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          {reserva.data_evento
                            ? new Date(
                                reserva.data_evento
                              ).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 px-2 capitalize">
                          {reserva.pacote_tipo}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          R{"$ "}
                          {Number(
                            reserva.total_calculado || 0
                          ).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Ações rápidas estratégicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FFD836]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#FF731D]" />
              </div>
              <div>
                <h3 className="font-bold">Gerenciar reservas</h3>
                <p className="text-sm text-muted-foreground">
                  Visão detalhada de todas as reservas e filtros avançados.
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/admin/reservas">Acessar reservas</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#73B6F0]/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#73B6F0]" />
              </div>
              <div>
                <h3 className="font-bold">Candidaturas</h3>
                <p className="text-sm text-muted-foreground">
                  Organize o pipeline de recreadores e novas contratações.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/candidaturas">Ver candidaturas</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-bold">Casting & escala</h3>
                <p className="text-sm text-muted-foreground">
                  Confirme equipes por evento e acompanhe cachês individuais.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/casting">Ir para Casting</Link>
            </Button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;