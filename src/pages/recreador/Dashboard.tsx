import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, DollarSign, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import RecreadorLayout from "@/components/recreador/RecreadorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecreadorDashboard = () => {
  const { profissionalId } = useAuth();

  // Fetch eventos do recreador
  const { data: meusEventos, isLoading } = useQuery({
    queryKey: ['meus-eventos', profissionalId],
    queryFn: async () => {
      if (!profissionalId) return [];
      
      const { data, error } = await supabase
        .from('evento_casting')
        .select(`
          *,
          reserva:reservas(
            id, nome_completo, data_evento, hora_inicio, 
            local_evento, pacote_tipo, status
          )
        `)
        .eq('profissional_id', profissionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profissionalId,
  });

  // Calcular métricas
  const eventosRealizados = meusEventos?.filter(
    e => e.reserva?.status === 'realizado'
  ).length || 0;

  const eventosFuturos = meusEventos?.filter(
    e => e.reserva && new Date(e.reserva.data_evento) >= new Date()
  ).length || 0;

  const totalGanhos = meusEventos?.reduce(
    (acc, curr) => acc + (curr.cache || 0), 0
  ) || 0;

  const ganhosPendentes = meusEventos?.filter(
    e => !e.pago
  ).reduce((acc, curr) => acc + (curr.cache || 0), 0) || 0;

  // Próximos eventos
  const proximosEventos = meusEventos?.filter(
    e => e.reserva && new Date(e.reserva.data_evento) >= new Date()
  ).slice(0, 5) || [];

  return (
    <RecreadorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu portal de recreador
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Eventos Realizados
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventosRealizados}</div>
              <p className="text-xs text-muted-foreground">
                Total de eventos que participou
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Próximos Eventos
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventosFuturos}</div>
              <p className="text-xs text-muted-foreground">
                Eventos agendados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Recebido
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalGanhos.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                Soma de todos os cachês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pendente
              </CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                R$ {ganhosPendentes.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando pagamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Seus eventos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : proximosEventos.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum evento agendado no momento
              </p>
            ) : (
              <div className="space-y-4">
                {proximosEventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{evento.reserva?.nome_completo}</p>
                      <p className="text-sm text-muted-foreground">
                        {evento.reserva?.data_evento && format(
                          new Date(evento.reserva.data_evento),
                          "dd 'de' MMMM, yyyy",
                          { locale: ptBR }
                        )} - {evento.reserva?.hora_inicio}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {evento.reserva?.local_evento}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={evento.confirmado ? "default" : "secondary"}>
                        {evento.confirmado ? "Confirmado" : "Pendente"}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        R$ {(evento.cache || 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RecreadorLayout>
  );
};

export default RecreadorDashboard;
