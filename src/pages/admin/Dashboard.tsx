import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Users, FileText, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
interface Stats {
  reservasPendentes: number;
  reservasConfirmadas: number;
  candidaturasPendentes: number;
  totalReservas: number;
}
const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    reservasPendentes: 0,
    reservasConfirmadas: 0,
    candidaturasPendentes: 0,
    totalReservas: 0,
  });
  const [recentReservas, setRecentReservas] = useState<any[]>([]);
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
    }
  }, [user, isAdmin]);
  const fetchStats = async () => {
    try {
      const [reservasResult, candidaturasResult] = await Promise.all([
        supabase.from("reservas").select("status"),
        supabase.from("candidaturas").select("status")]);
      const reservas = reservasResult.data || [];
      const candidaturas = candidaturasResult.data || [];
      setStats({
        reservasPendentes: reservas.filter(r => r.status === "pendente").length,
        reservasConfirmadas: reservas.filter(r => r.status === "confirmado").length,
        candidaturasPendentes: candidaturas.filter(c => c.status === "pendente").length,
        totalReservas: reservas.length,
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
  const statCards = [
    {
      title: "Reservas Pendentes",
      value: stats.reservasPendentes,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Reservas Confirmadas",
      value: stats.reservasConfirmadas,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Candidaturas Novas",
      value: stats.candidaturasPendentes,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Reservas",
      value: stats.totalReservas,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    }];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pendente</span>;
      case "confirmado":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Confirmado</span>;
      case "cancelado":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Cancelado</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">VisÃƒÂ£o geral do sistema</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">
                    {loadingStats ? "..." : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* Recent Reservations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Reservas Recentes</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/reservas">Ver todas</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Data</th>
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
                        {new Date(reserva.data_evento).toLocaleDateString("pt-BR")}
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
        </Card>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FFD836]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#FF731D]" />
              </div>
              <div>
                <h3 className="font-bold">Gerenciar Reservas</h3>
                <p className="text-sm text-muted-foreground">Visualize e gerencie todas as reservas</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/admin/reservas">Acessar Reservas</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#73B6F0]/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#73B6F0]" />
              </div>
              <div>
                <h3 className="font-bold">Candidaturas</h3>
                <p className="text-sm text-muted-foreground">Veja as candidaturas de emprego</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/candidaturas">Ver Candidaturas</Link>
            </Button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminDashboard;
