import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Calendar, User, CheckCircle, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CastingComEvento {
  id: string;
  cache: number | null;
  pago: boolean | null;
  pago_em: string | null;
  funcao: string | null;
  profissional_nome_manual: string | null;
  profissional_id: string | null;
  reserva_id: string | null;
  profissional?: {
    nome_completo: string;
    apelido: string | null;
  } | null;
  reserva?: {
    codigo: string | null;
    data_evento: string;
    nome_completo: string;
    status: string;
  } | null;
}

interface EventoAgrupado {
  reserva_id: string;
  codigo: string | null;
  data_evento: string;
  cliente: string;
  status: string;
  totalCache: number;
  totalPago: number;
  castings: CastingComEvento[];
}

interface RecreadorAgrupado {
  profissional_id: string | null;
  nome: string;
  totalEventos: number;
  totalCache: number;
  totalPago: number;
  saldo: number;
}

const Financeiro = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [castings, setCastings] = useState<CastingComEvento[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [periodo, setPeriodo] = useState("mes_atual");

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCastings();
    }
  }, [user, isAdmin]);

  const fetchCastings = async () => {
    try {
      const { data, error } = await supabase
        .from("evento_casting")
        .select(`
          *,
          profissional:profissionais(nome_completo, apelido),
          reserva:reservas(codigo, data_evento, nome_completo, status)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCastings((data as CastingComEvento[]) || []);
    } catch (error) {
      console.error("Error fetching castings:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    switch (periodo) {
      case "mes_atual":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "mes_anterior":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "trimestre":
        return { start: subMonths(now, 3), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const filteredCastings = castings.filter((c) => {
    if (!c.reserva?.data_evento) return false;
    const eventDate = parseISO(c.reserva.data_evento);
    const range = getDateRange();
    return isWithinInterval(eventDate, { start: range.start, end: range.end });
  });

  // Agrupar por evento
  const eventosByReserva = filteredCastings.reduce<Record<string, EventoAgrupado>>((acc, c) => {
    if (!c.reserva_id) return acc;
    if (!acc[c.reserva_id]) {
      acc[c.reserva_id] = {
        reserva_id: c.reserva_id,
        codigo: c.reserva?.codigo || null,
        data_evento: c.reserva?.data_evento || "",
        cliente: c.reserva?.nome_completo || "",
        status: c.reserva?.status || "",
        totalCache: 0,
        totalPago: 0,
        castings: [],
      };
    }
    acc[c.reserva_id].castings.push(c);
    acc[c.reserva_id].totalCache += Number(c.cache) || 0;
    if (c.pago) {
      acc[c.reserva_id].totalPago += Number(c.cache) || 0;
    }
    return acc;
  }, {});

  const eventosAgrupados = Object.values(eventosByReserva).sort(
    (a, b) => new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime()
  );

  // Agrupar por recreador
  const recreadorMap = filteredCastings.reduce<Record<string, RecreadorAgrupado>>((acc, c) => {
    const key = c.profissional_id || c.profissional_nome_manual || "desconhecido";
    const nome = c.profissional?.apelido || c.profissional?.nome_completo || c.profissional_nome_manual || "Não identificado";
    
    if (!acc[key]) {
      acc[key] = {
        profissional_id: c.profissional_id,
        nome,
        totalEventos: 0,
        totalCache: 0,
        totalPago: 0,
        saldo: 0,
      };
    }
    acc[key].totalEventos += 1;
    acc[key].totalCache += Number(c.cache) || 0;
    if (c.pago) {
      acc[key].totalPago += Number(c.cache) || 0;
    }
    acc[key].saldo = acc[key].totalCache - acc[key].totalPago;
    return acc;
  }, {});

  const recreadoresAgrupados = Object.values(recreadorMap).sort((a, b) => b.totalCache - a.totalCache);

  // Totais gerais
  const totalCacheGeral = filteredCastings.reduce((sum, c) => sum + (Number(c.cache) || 0), 0);
  const totalPagoGeral = filteredCastings.filter((c) => c.pago).reduce((sum, c) => sum + (Number(c.cache) || 0), 0);
  const saldoGeral = totalCacheGeral - totalPagoGeral;

  const togglePago = async (castingId: string, currentPago: boolean) => {
    try {
      const newPago = !currentPago;
      const { error } = await supabase
        .from("evento_casting")
        .update({
          pago: newPago,
          pago_em: newPago ? new Date().toISOString() : null,
        })
        .eq("id", castingId);

      if (error) throw error;

      setCastings((prev) =>
        prev.map((c) =>
          c.id === castingId
            ? { ...c, pago: newPago, pago_em: newPago ? new Date().toISOString() : null }
            : c
        )
      );

      toast({
        title: newPago ? "Marcado como pago" : "Marcado como pendente",
        description: "Status de pagamento atualizado.",
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de pagamento.",
        variant: "destructive",
      });
    }
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
            <h1 className="text-3xl font-bold">Financeiro & Cachês</h1>
            <p className="text-muted-foreground">
              Gerencie pagamentos de cachês por evento e recreador
            </p>
          </div>

          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes_atual">Mês Atual</SelectItem>
              <SelectItem value="mes_anterior">Mês Anterior</SelectItem>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cachês (Período)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                R$ {totalCacheGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                R$ {totalPagoGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                R$ {saldoGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="eventos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="eventos" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Por Evento
            </TabsTrigger>
            <TabsTrigger value="recreadores" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Por Recreador
            </TabsTrigger>
          </TabsList>

          {/* Por Evento */}
          <TabsContent value="eventos">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4 text-sm font-medium">Evento</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Data</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Recreadores</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Cachê Total</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Pago</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingData ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                          </td>
                        </tr>
                      ) : eventosAgrupados.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum evento com casting no período
                          </td>
                        </tr>
                      ) : (
                        eventosAgrupados.map((evento) => (
                          <tr key={evento.reserva_id} className="border-b hover:bg-muted/30">
                            <td className="py-3 px-4">
                              <span className="font-medium">{evento.codigo || "—"}</span>
                            </td>
                            <td className="py-3 px-4">
                              {format(parseISO(evento.data_evento), "dd/MM/yyyy", { locale: ptBR })}
                            </td>
                            <td className="py-3 px-4">{evento.cliente}</td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                {evento.castings.map((c) => (
                                  <div key={c.id} className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                      checked={c.pago || false}
                                      onCheckedChange={() => togglePago(c.id, c.pago || false)}
                                    />
                                    <span className={c.pago ? "line-through text-muted-foreground" : ""}>
                                      {c.profissional?.apelido || c.profissional?.nome_completo || c.profissional_nome_manual || "—"}
                                      {" · R$ "}
                                      {Number(c.cache || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </span>
                                    {c.pago && <CheckCircle className="w-3 h-3 text-green-600" />}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              R$ {evento.totalCache.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4 text-right text-green-600">
                              R$ {evento.totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4 text-right text-orange-600 font-medium">
                              R$ {(evento.totalCache - evento.totalPago).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Por Recreador */}
          <TabsContent value="recreadores">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4 text-sm font-medium">Recreador</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Eventos</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Cachê Total</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Pago</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Saldo a Pagar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recreadoresAgrupados.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-muted-foreground">
                            Nenhum recreador com casting no período
                          </td>
                        </tr>
                      ) : (
                        recreadoresAgrupados.map((rec, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{rec.nome}</td>
                            <td className="py-3 px-4 text-right">{rec.totalEventos}</td>
                            <td className="py-3 px-4 text-right">
                              R$ {rec.totalCache.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4 text-right text-green-600">
                              R$ {rec.totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-orange-600">
                              R$ {rec.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Financeiro;
