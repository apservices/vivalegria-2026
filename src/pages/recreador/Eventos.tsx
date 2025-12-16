import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import RecreadorLayout from "@/components/recreador/RecreadorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RecreadorEventos = () => {
  const { profissionalId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch eventos do recreador
  const { data: meusEventos, isLoading } = useQuery({
    queryKey: ['meus-eventos-completo', profissionalId],
    queryFn: async () => {
      if (!profissionalId) return [];
      
      const { data, error } = await supabase
        .from('evento_casting')
        .select(`
          *,
          reserva:reservas(
            id, nome_completo, data_evento, hora_inicio, 
            local_evento, pacote_tipo, status, numero_criancas
          )
        `)
        .eq('profissional_id', profissionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profissionalId,
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosFuturos = meusEventos?.filter(
    e => e.reserva && new Date(e.reserva.data_evento) >= hoje
  ) || [];

  const eventosPassados = meusEventos?.filter(
    e => e.reserva && new Date(e.reserva.data_evento) < hoje
  ) || [];

  const filtrarEventos = (eventos: typeof meusEventos) => {
    if (!searchTerm) return eventos;
    return eventos?.filter(e => 
      e.reserva?.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.reserva?.local_evento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const EventoCard = ({ evento }: { evento: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="font-bold text-lg">{evento.reserva?.nome_completo}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {evento.reserva?.data_evento && format(
                new Date(evento.reserva.data_evento),
                "dd 'de' MMMM, yyyy",
                { locale: ptBR }
              )} - {evento.reserva?.hora_inicio}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {evento.reserva?.local_evento}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {evento.reserva?.numero_criancas} crianças • {evento.reserva?.pacote_tipo}
            </div>
          </div>
          <div className="text-right space-y-2">
            <Badge variant={evento.confirmado ? "default" : "secondary"}>
              {evento.confirmado ? "Confirmado" : "Aguardando"}
            </Badge>
            <p className="text-lg font-bold">
              R$ {(evento.cache || 0).toLocaleString('pt-BR')}
            </p>
            <Badge variant={evento.pago ? "default" : "outline"}>
              {evento.pago ? "Pago" : "Pendente"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <RecreadorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meus Eventos</h1>
          <p className="text-muted-foreground">
            Histórico de todos os eventos que participou
          </p>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="futuros">
          <TabsList>
            <TabsTrigger value="futuros">
              Próximos ({eventosFuturos.length})
            </TabsTrigger>
            <TabsTrigger value="passados">
              Realizados ({eventosPassados.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="futuros" className="space-y-4 mt-4">
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : filtrarEventos(eventosFuturos)?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum evento futuro encontrado
                  </p>
                </CardContent>
              </Card>
            ) : (
              filtrarEventos(eventosFuturos)?.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))
            )}
          </TabsContent>

          <TabsContent value="passados" className="space-y-4 mt-4">
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : filtrarEventos(eventosPassados)?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum evento realizado encontrado
                  </p>
                </CardContent>
              </Card>
            ) : (
              filtrarEventos(eventosPassados)?.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RecreadorLayout>
  );
};

export default RecreadorEventos;
