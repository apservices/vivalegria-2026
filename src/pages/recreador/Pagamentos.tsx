import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DollarSign, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import RecreadorLayout from "@/components/recreador/RecreadorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecreadorPagamentos = () => {
  const { profissionalId } = useAuth();

  // Fetch eventos com dados de pagamento
  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ['meus-pagamentos', profissionalId],
    queryFn: async () => {
      if (!profissionalId) return [];
      
      const { data, error } = await supabase
        .from('evento_casting')
        .select(`
          *,
          reserva:reservas(
            id, nome_completo, data_evento, status
          )
        `)
        .eq('profissional_id', profissionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profissionalId,
  });

  // Métricas
  const totalRecebido = pagamentos?.filter(p => p.pago)
    .reduce((acc, curr) => acc + (curr.cache || 0), 0) || 0;

  const totalPendente = pagamentos?.filter(p => !p.pago)
    .reduce((acc, curr) => acc + (curr.cache || 0), 0) || 0;

  const totalGeral = totalRecebido + totalPendente;

  return (
    <RecreadorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">
            Acompanhe seus ganhos e pagamentos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalGeral.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                Soma de todos os cachês
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Recebido
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                R$ {totalRecebido.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-green-600">
                Pagamentos confirmados
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Pendente
              </CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                R$ {totalPendente.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-yellow-600">
                Aguardando pagamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>
              Detalhamento de todos os seus cachês
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : pagamentos?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum pagamento registrado
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos?.map((pag) => (
                    <TableRow key={pag.id}>
                      <TableCell className="font-medium">
                        {pag.reserva?.nome_completo}
                      </TableCell>
                      <TableCell>
                        {pag.reserva?.data_evento && format(
                          new Date(pag.reserva.data_evento),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </TableCell>
                      <TableCell>{pag.funcao}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {(pag.cache || 0).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pag.pago ? "default" : "secondary"}>
                          {pag.pago ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </RecreadorLayout>
  );
};

export default RecreadorPagamentos;
