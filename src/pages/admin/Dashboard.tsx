import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  DollarSign,
  AlertTriangle,
  FileText,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  reservasPendentes: number;
  reservasConfirmadas: number;
  reservasAprovadas: number;
  candidaturasPendentes: number;
  totalReservas: number;
  reservasSemana: number;
  reservasMes: number;
  taxaConfirmacao: number;
  eventosSemCasting: number;
  totalCachesMes: number;
}

interface ProximoEvento {
  id: string;
  codigo: string | null;
  data_evento: string;
  hora_inicio: string;
  nome_completo: string;
  pacote_tipo: string;
  total_calculado: number;
  status: string;
  castingCount: number;
}

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState("mes_atual");
  const [stats, setStats] = useState<Stats>({
    reservasPendentes: 0,
    reservasConfirmadas: 0,
    reservasAprovadas: 0,
    candidaturasPendentes: 0,
    totalReservas: 0,
    reservasSemana: 0,
    reservasMes: 0,
    taxaConfirmacao: 0,
    eventosSemCasting: 0,
    totalCachesMes: 0,
  });
  const [recentReservas, setRecentReservas] = useState<any[]>([]);
  const [proximosEventos, setProximosEventos] = useState<ProximoEvento[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
      fetchRecentReservas();
      fetchProximosEventos();
    }
  }, [user, isAdmin, periodo]);

  const getDateRange = () => {
    const now = new Date();
    switch (periodo) {
      case "7dias":
        return { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) };
      case "mes_atual":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "trimestre":
        return { start: subMonths(now, 3), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const fetchStats = async () => {
    try {
      const [reservasResult, candidaturasResult, castingResult] = await Promise.all([
        supabase.from("reservas").select("*"),
        supabase.from("candidaturas").select("status"),
        supabase.from("evento_casting").select("cache, reserva_id, reserva:reservas(data_evento)")
      ]);

      const reservas = reservasResult.data || [];
      const candidaturas = candidaturasResult.data || [];
      const castings = (castingResult.data || []) as any[];
      const range = getDateRange();
      const now = new Date();

      // Reservas no período
      const reservasNoPeriodo = reservas.filter((r) => {
        const eventDate = parseISO(r.data_evento);
        return isWithinInterval(eventDate, { start: range.start, end: range.end });
      });

      // Reservas na semana
      const weekStart = startOfWeek(now, { locale: ptBR });
      const weekEnd = endOfWeek(now, { locale: ptBR });
      const reservasSemana = reservas.filter((r) => {
        const eventDate = parseISO(r.data_evento);
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      }).length;

      // Reservas no mês
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const reservasMes = reservas.filter((r) => {
        const eventDate = parseISO(r.data_evento);
        return isWithinInterval(eventDate, { start: monthStart, end: monthEnd });
      }).length;

      // Taxa de confirmação
      const confirmadas = reservas.filter(r => r.status === "confirmado" || r.status === "aprovado").length;
      const taxaConfirmacao = reservas.length > 0 ? Math.round((confirmadas / reservas.length) * 100) : 0;

      // Eventos futuros sem casting
      const reservasFuturas = reservas.filter(r => isFuture(parseISO(r.data_evento)));
      const reservasComCasting = new Set(castings.map(c => c.reserva_id));
      const eventosSemCasting = reservasFuturas.filter(r => !reservasComCasting.has(r.id)).length;

      // Total de cachês no mês
      const cachesNoMes = castings.filter((c: any) => {
        if (!c.reserva?.data_evento) return false;
        const eventDate = parseISO(c.reserva.data_evento);
        return isWithinInterval(eventDate, { start: monthStart, end: monthEnd });
      });
      const totalCachesMes = cachesNoMes.reduce((sum: number, c: any) => sum + (Number(c.cache) || 0), 0);

      setStats({
        reservasPendentes: reservas.filter(r => r.status === "pendente").length,
        reservasConfirmadas: reservas.filter(r => r.status === "confirmado").length,
        reservasAprovadas: reservas.filter(r => r.status === "aprovado").length,
        candidaturasPendentes: candidaturas.filter(c => c.status === "pendente").length,
        totalReservas: reservas.length,
        reservasSemana,
        reservasMes,
        taxaConfirmacao,
        eventosSemCasting,
        totalCachesMes,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentReservas = async () => {
    try {
      const { data } = await supabase
        .from("reservas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentReservas(data || []);
    } catch (error) {
      console.error("Error fetching recent reservas:", error);
    }
  };

  const fetchProximosEventos = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: reservas } = await supabase
        .from("reservas")
        .select("*")
        .gte("data_evento", today)
        .order("data_evento", { ascending: true })
        .limit(5);

      if (reservas) {
        const { data: castings } = await supabase
          .from("evento_casting")
          .select("reserva_id");

        const castingCountMap = (castings || []).reduce<Record<string, number>>((acc, c) => {
          if (c.reserva_id) {
            acc[c.reserva_id] = (acc[c.reserva_id] || 0) + 1;
          }
          return acc;
        }, {});

        const eventos: ProximoEvento[] = reservas.map(r => ({
          id: r.id,
          codigo: r.codigo,
          data_evento: r.data_evento,
          hora_inicio: r.hora_inicio,
          nome_completo: r.nome_completo,
          pacote_tipo: r.pacote_tipo,
          total_calculado: r.total_calculado,
          status: r.status,
          castingCount: castingCountMap[r.id] || 0,
        }));

        setProximosEventos(eventos);
      }
    } catch (error) {
      console.error("Error fetching proximos eventos:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pendente</span>;
      case "confirmado":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Confirmado</span>;
      case "aprovado":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aprovado</span>;
      case "cancelado":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Cancelado</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão executiva do negócio</p>
          </div>

          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="mes_atual">Mês Atual</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bloco: Visão de Reservas & Conversão */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Reservas & Conversão</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {loadingStats ? "..." : stats.reservasPendentes}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Confirmadas / Aprovadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {loadingStats ? "..." : `${stats.reservasConfirmadas + stats.reservasAprovadas}`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Taxa de Confirmação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {loadingStats ? "..." : `${stats.taxaConfirmacao}%`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Reservas no Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loadingStats ? "..." : stats.reservasMes}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bloco: Operação & Casting */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Operação & Casting</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Eventos sem Casting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {loadingStats ? "..." : stats.eventosSemCasting}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Eventos futuros sem equipe</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Candidaturas Novas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {loadingStats ? "..." : stats.candidaturasPendentes}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cachês no Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  R$ {loadingStats ? "..." : stats.totalCachesMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos Eventos</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/reservas">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Código</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Pacote</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Casting</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {proximosEventos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum evento próximo
                      </td>
                    </tr>
                  ) : (
                    proximosEventos.map((evento) => (
                      <tr key={evento.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{evento.codigo || "—"}</td>
                        <td className="py-3 px-2">
                          {format(parseISO(evento.data_evento), "dd/MM/yyyy", { locale: ptBR })}
                          <br />
                          <span className="text-xs text-muted-foreground">{evento.hora_inicio}</span>
                        </td>
                        <td className="py-3 px-2">{evento.nome_completo}</td>
                        <td className="py-3 px-2 capitalize">{evento.pacote_tipo}</td>
                        <td className="py-3 px-2">{getStatusBadge(evento.status)}</td>
                        <td className="py-3 px-2">
                          {evento.castingCount > 0 ? (
                            <span className="text-green-600 font-medium">{evento.castingCount} rec.</span>
                          ) : (
                            <span className="text-orange-600">Incompleto</span>
                          )}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          R$ {Number(evento.total_calculado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Reservas Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reservas Recentes</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/reservas">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Data Evento</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Pacote</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma reserva encontrada
                      </td>
                    </tr>
                  ) : (
                    recentReservas.map((reserva) => (
                      <tr key={reserva.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <p className="font-medium">{reserva.nome_completo}</p>
                          <p className="text-sm text-muted-foreground">{reserva.email}</p>
                        </td>
                        <td className="py-3 px-2">
                          {format(parseISO(reserva.data_evento), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="py-3 px-2 capitalize">{reserva.pacote_tipo}</td>
                        <td className="py-3 px-2">{getStatusBadge(reserva.status)}</td>
                        <td className="py-3 px-2 font-medium">
                          R$ {Number(reserva.total_calculado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Reservas</h3>
                <p className="text-sm text-muted-foreground">Gerenciar e aprovar</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/admin/reservas">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold">Casting</h3>
                <p className="text-sm text-muted-foreground">Alocar recreadores</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/casting">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold">Financeiro</h3>
                <p className="text-sm text-muted-foreground">Cachês e pagamentos</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/financeiro">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
