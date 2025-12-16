import { useEffect, useState } from "react";
import { Search, User, Phone, MapPin, Calendar, Mail, FileText, TrendingUp, Download, Filter } from "lucide-react";
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
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { exportClientes } from "@/utils/exportCSV";
import ClientDetailModal from "@/components/admin/ClientDetailModal";

interface ClienteComDados {
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

const AdminClientes = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [clientes, setClientes] = useState<ClienteComDados[]>([]);
  const [filtered, setFiltered] = useState<ClienteComDados[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [cidadeFilter, setCidadeFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedCliente, setSelectedCliente] = useState<ClienteComDados | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      fetchClientes();
    }
  }, [user, isAdmin]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      
      // Buscar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (clientesError) throw clientesError;

      // Buscar reservas para calcular estatísticas
      const { data: reservasData, error: reservasError } = await supabase
        .from("reservas")
        .select("cpf_cnpj, total_calculado, data_evento, id");

      if (reservasError) throw reservasError;

      // Buscar pesquisas para NPS
      const { data: pesquisasData } = await supabase
        .from("pesquisas_clientes")
        .select("reserva_id, respostas");

      // Mapear NPS por reserva_id
      const npsByReserva: Record<string, number> = {};
      (pesquisasData || []).forEach(p => {
        const respostas = p.respostas as Record<string, unknown> | null;
        if (p.reserva_id && respostas?.nps) {
          npsByReserva[p.reserva_id] = Number(respostas.nps);
        }
      });

      // Agrupar reservas por CPF/CNPJ
      const reservasPorCliente = (reservasData || []).reduce((acc, reserva) => {
        if (!acc[reserva.cpf_cnpj]) {
          acc[reserva.cpf_cnpj] = { count: 0, total: 0, lastEvent: null as string | null, npsValues: [] as number[] };
        }
        acc[reserva.cpf_cnpj].count += 1;
        acc[reserva.cpf_cnpj].total += Number(reserva.total_calculado) || 0;
        
        // Atualizar último evento
        if (!acc[reserva.cpf_cnpj].lastEvent || reserva.data_evento > acc[reserva.cpf_cnpj].lastEvent!) {
          acc[reserva.cpf_cnpj].lastEvent = reserva.data_evento;
        }

        // Adicionar NPS se existir
        if (npsByReserva[reserva.id]) {
          acc[reserva.cpf_cnpj].npsValues.push(npsByReserva[reserva.id]);
        }

        return acc;
      }, {} as Record<string, { count: number; total: number; lastEvent: string | null; npsValues: number[] }>);

      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      // Enriquecer clientes com dados calculados
      const clientesEnriquecidos: ClienteComDados[] = (clientesData || []).map(cliente => {
        const stats = reservasPorCliente[cliente.cpf_cnpj] || { count: 0, total: 0, lastEvent: null, npsValues: [] };
        const totalEventos = stats.count;
        const ticketMedio = totalEventos > 0 ? stats.total / totalEventos : 0;
        const npsMedio = stats.npsValues.length > 0 
          ? stats.npsValues.reduce((a, b) => a + b, 0) / stats.npsValues.length 
          : null;
        
        let status: 'novo' | 'ativo' | 'recorrente' | 'dormido' = 'novo';
        
        if (totalEventos >= 2) {
          status = 'recorrente';
        } else if (totalEventos === 1) {
          status = 'ativo';
        }

        // Verificar se é dormido (sem eventos nos últimos 6 meses)
        if (stats.lastEvent && new Date(stats.lastEvent) < sixMonthsAgo && totalEventos > 0) {
          status = 'dormido';
        }

        return {
          id: cliente.id,
          nome_completo: cliente.nome_completo,
          cpf_cnpj: cliente.cpf_cnpj,
          tipo_cadastro: cliente.tipo_cadastro,
          telefone: cliente.telefone,
          email: cliente.email,
          cidade: cliente.cidade,
          cep: cliente.cep,
          endereco: cliente.endereco,
          complemento: cliente.complemento,
          created_at: cliente.created_at,
          notas: cliente.notas,
          total_eventos: totalEventos,
          ticket_medio: ticketMedio,
          nps_medio: npsMedio,
          ultimo_evento: stats.lastEvent,
          status
        };
      });

      setClientes(clientesEnriquecidos);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = clientes;
    
    // Filtro de busca
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(c => 
        c.nome_completo?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.telefone?.includes(search) ||
        c.cpf_cnpj?.includes(search)
      );
    }

    // Filtro de status
    if (statusFilter !== "all") {
      result = result.filter(c => c.status === statusFilter);
    }

    // Filtro de período do último evento
    if (periodoFilter !== "all") {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (periodoFilter) {
        case "3m":
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "6m":
          cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case "12m":
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      result = result.filter(c => c.ultimo_evento && new Date(c.ultimo_evento) >= cutoffDate);
    }

    // Filtro de cidade
    if (cidadeFilter !== "all") {
      result = result.filter(c => c.cidade === cidadeFilter);
    }

    setFiltered(result);
  }, [clientes, search, statusFilter, periodoFilter, cidadeFilter]);

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

  // Extrair cidades únicas para o filtro
  const cidadesUnicas = [...new Set(clientes.map(c => c.cidade).filter(Boolean))] as string[];

  const handleExportCSV = () => {
    exportClientes(filtered);
  };

  const openClientModal = (cliente: ClienteComDados) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  if (authLoading) {
    return <AdminLayout><div className="p-6">Carregando...</div></AdminLayout>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return <AdminLayout><div className="p-6">Carregando clientes...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">CRM de Clientes</h1>
            <p className="text-muted-foreground">{clientes.length} clientes cadastrados</p>
          </div>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por nome, email, telefone ou CPF/CNPJ..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="recorrente">Recorrente</SelectItem>
                <SelectItem value="dormido">Dormido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="12m">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cidadesUnicas.map(cidade => (
                  <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{clientes.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Recorrentes</div>
            <div className="text-2xl font-bold text-green-600">
              {clientes.filter(c => c.status === 'recorrente').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Ativos</div>
            <div className="text-2xl font-bold text-blue-600">
              {clientes.filter(c => c.status === 'ativo').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Dormidos</div>
            <div className="text-2xl font-bold text-orange-600">
              {clientes.filter(c => c.status === 'dormido').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Novos</div>
            <div className="text-2xl font-bold text-gray-600">
              {clientes.filter(c => c.status === 'novo').length}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, displayCount).map((cliente) => (
            <Card 
              key={cliente.id} 
              className="p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => openClientModal(cliente)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-lg">{cliente.nome_completo}</div>
                  <div className="text-xs text-muted-foreground">
                    {cliente.tipo_cadastro === 'pj' ? 'CNPJ' : 'CPF'}: {cliente.cpf_cnpj}
                  </div>
                </div>
                {getStatusBadge(cliente.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                {cliente.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{cliente.email}</span>
                  </div>
                )}
                {cliente.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {cliente.telefone}
                  </div>
                )}
                {cliente.cidade && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {cliente.cidade}
                  </div>
                )}
                
                <div className="pt-2 border-t grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {cliente.total_eventos} eventos
                  </div>
                  {cliente.ticket_medio > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      R$ {cliente.ticket_medio.toFixed(0)}
                    </div>
                  )}
                  {cliente.nps_medio !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">NPS:</span>
                      <span className={cliente.nps_medio >= 7 ? 'text-green-600' : 'text-orange-600'}>
                        {cliente.nps_medio.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {cliente.ultimo_evento && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(cliente.ultimo_evento).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length > displayCount && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setDisplayCount(prev => prev + 12)}
            >
              Ver mais ({filtered.length - displayCount} restantes)
            </Button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {search || statusFilter !== "all" || periodoFilter !== "all" || cidadeFilter !== "all" 
              ? 'Nenhum cliente encontrado com os critérios de busca.' 
              : 'Nenhum cliente cadastrado ainda.'}
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      <ClientDetailModal
        cliente={selectedCliente}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={fetchClientes}
      />
    </AdminLayout>
  );
};

export default AdminClientes;
