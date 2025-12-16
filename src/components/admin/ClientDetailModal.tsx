import { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, Calendar, FileText, TrendingUp, Star, Save, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/utils/adminLogs";

interface ClienteDetalhado {
  id: string;
  nome_completo: string;
  cpf_cnpj: string;
  tipo_cadastro: string;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  cep: string | null;
  endereco: string | null;
  complemento: string | null;
  created_at: string;
  notas: string | null;
  total_eventos: number;
  ticket_medio: number;
  nps_medio: number | null;
  ultimo_evento: string | null;
  status: 'novo' | 'ativo' | 'recorrente' | 'dormido';
}

interface ReservaCliente {
  id: string;
  codigo: string | null;
  data_evento: string;
  pacote_tipo: string;
  total_calculado: number;
  status: string;
  nps?: number | null;
}

interface ClientDetailModalProps {
  cliente: ClienteDetalhado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const ClientDetailModal = ({ cliente, open, onOpenChange, onUpdate }: ClientDetailModalProps) => {
  const { toast } = useToast();
  const [reservas, setReservas] = useState<ReservaCliente[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [notas, setNotas] = useState("");
  const [savingNotas, setSavingNotas] = useState(false);

  useEffect(() => {
    if (cliente && open) {
      setNotas(cliente.notas || "");
      fetchReservas();
    }
  }, [cliente, open]);

  const fetchReservas = async () => {
    if (!cliente) return;
    
    setLoadingReservas(true);
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("id, codigo, data_evento, pacote_tipo, total_calculado, status")
        .eq("cpf_cnpj", cliente.cpf_cnpj)
        .order("data_evento", { ascending: false });

      if (error) throw error;

      // Buscar NPS das pesquisas para cada reserva
      const reservasComNPS = await Promise.all(
        (data || []).map(async (reserva) => {
          const { data: pesquisa } = await supabase
            .from("pesquisas_clientes")
            .select("respostas")
            .eq("reserva_id", reserva.id)
            .single();

          const respostas = pesquisa?.respostas as Record<string, unknown> | null;
          return {
            ...reserva,
            nps: respostas?.nps ? Number(respostas.nps) : null,
          };
        })
      );

      setReservas(reservasComNPS);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoadingReservas(false);
    }
  };

  const saveNotas = async () => {
    if (!cliente) return;
    
    setSavingNotas(true);
    try {
      const { error } = await supabase
        .from("clientes")
        .update({ notas })
        .eq("id", cliente.id);

      if (error) throw error;

      await logAdminAction('NOTAS_ATUALIZADAS', null, {
        cliente_id: cliente.id,
        cliente_nome: cliente.nome_completo,
      });

      toast({
        title: "Notas salvas",
        description: "As notas internas foram atualizadas.",
      });

      onUpdate?.();
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as notas.",
        variant: "destructive",
      });
    } finally {
      setSavingNotas(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recorrente':
        return <Badge className="bg-green-500">Recorrente</Badge>;
      case 'ativo':
        return <Badge className="bg-blue-500">Ativo</Badge>;
      case 'dormido':
        return <Badge variant="outline" className="text-orange-600 border-orange-300">Dormido</Badge>;
      default:
        return <Badge variant="secondary">Novo</Badge>;
    }
  };

  const getReservaStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-700">Aprovado</Badge>;
      case 'confirmado':
        return <Badge className="bg-blue-100 text-blue-700">Confirmado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>;
      case 'realizado':
        return <Badge className="bg-purple-100 text-purple-700">Realizado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{cliente.nome_completo}</span>
            {getStatusBadge(cliente.status)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="eventos">Eventos ({reservas.length})</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

          {/* Aba Resumo */}
          <TabsContent value="resumo" className="space-y-4 mt-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Total Eventos</div>
                <div className="text-xl font-bold">{cliente.total_eventos}</div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Ticket Médio</div>
                <div className="text-xl font-bold text-green-600">
                  R$ {cliente.ticket_medio.toFixed(0)}
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">NPS Médio</div>
                <div className="text-xl font-bold">
                  {cliente.nps_medio !== null ? cliente.nps_medio.toFixed(1) : '—'}
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Último Evento</div>
                <div className="text-sm font-medium">
                  {cliente.ultimo_evento 
                    ? new Date(cliente.ultimo_evento).toLocaleDateString('pt-BR')
                    : '—'}
                </div>
              </Card>
            </div>

            {/* Dados pessoais */}
            <Card className="p-4 space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Dados do Cliente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {cliente.tipo_cadastro === 'pj' ? 'CNPJ' : 'CPF'}:
                  </span>
                  <span className="font-medium">{cliente.cpf_cnpj}</span>
                </div>
                {cliente.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.email}</span>
                  </div>
                )}
                {cliente.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.telefone}</span>
                  </div>
                )}
                {cliente.cidade && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.cidade}</span>
                  </div>
                )}
                {cliente.endereco && (
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.endereco}{cliente.complemento ? `, ${cliente.complemento}` : ''}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Cliente desde:</span>
                  <span>{new Date(cliente.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Aba Eventos */}
          <TabsContent value="eventos" className="mt-4">
            {loadingReservas ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : reservas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum evento encontrado
              </div>
            ) : (
              <div className="space-y-2">
                {reservas.map((reserva) => (
                  <Card key={reserva.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {reserva.codigo || reserva.id.slice(0, 8)}
                          </span>
                          {getReservaStatusBadge(reserva.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(reserva.data_evento).toLocaleDateString('pt-BR')} • {reserva.pacote_tipo}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          R$ {Number(reserva.total_calculado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        {reserva.nps !== null && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-3 h-3" />
                            NPS: {reserva.nps}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Aba Notas */}
          <TabsContent value="notas" className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              Notas internas sobre este cliente (visíveis apenas para a equipe)
            </div>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Adicione observações, preferências, histórico de atendimento..."
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={saveNotas} disabled={savingNotas}>
                <Save className="w-4 h-4 mr-2" />
                {savingNotas ? 'Salvando...' : 'Salvar Notas'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
