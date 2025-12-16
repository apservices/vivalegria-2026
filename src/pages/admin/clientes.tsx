import { useEffect, useState } from "react";
import { Search, User, Phone, MapPin, Calendar, Mail, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ClienteComDados {
  id: string;
  nome_completo: string;
  cpf_cnpj: string;
  tipo_cadastro: string;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  created_at: string;
  total_eventos: number;
  ticket_medio: number;
  status: 'novo' | 'ativo' | 'recorrente';
}

const AdminClientes = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [clientes, setClientes] = useState<ClienteComDados[]>([]);
  const [filtered, setFiltered] = useState<ClienteComDados[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(12);

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
        .select("cpf_cnpj, total_calculado");

      if (reservasError) throw reservasError;

      // Agrupar reservas por CPF/CNPJ
      const reservasPorCliente = (reservasData || []).reduce((acc, reserva) => {
        if (!acc[reserva.cpf_cnpj]) {
          acc[reserva.cpf_cnpj] = { count: 0, total: 0 };
        }
        acc[reserva.cpf_cnpj].count += 1;
        acc[reserva.cpf_cnpj].total += Number(reserva.total_calculado) || 0;
        return acc;
      }, {} as Record<string, { count: number; total: number }>);

      // Enriquecer clientes com dados calculados
      const clientesEnriquecidos: ClienteComDados[] = (clientesData || []).map(cliente => {
        const stats = reservasPorCliente[cliente.cpf_cnpj] || { count: 0, total: 0 };
        const totalEventos = stats.count;
        const ticketMedio = totalEventos > 0 ? stats.total / totalEventos : 0;
        
        let status: 'novo' | 'ativo' | 'recorrente' = 'novo';
        if (totalEventos >= 2) status = 'recorrente';
        else if (totalEventos === 1) status = 'ativo';

        return {
          id: cliente.id,
          nome_completo: cliente.nome_completo,
          cpf_cnpj: cliente.cpf_cnpj,
          tipo_cadastro: cliente.tipo_cadastro,
          telefone: cliente.telefone,
          email: cliente.email,
          cidade: cliente.cidade,
          created_at: cliente.created_at,
          total_eventos: totalEventos,
          ticket_medio: ticketMedio,
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
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(c => 
        c.nome_completo?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.cpf_cnpj?.includes(search)
      );
    }
    setFiltered(result);
  }, [clientes, search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recorrente':
        return <Badge className="bg-green-500">Recorrente</Badge>;
      case 'ativo':
        return <Badge className="bg-blue-500">Ativo</Badge>;
      default:
        return <Badge variant="secondary">Novo</Badge>;
    }
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
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">{clientes.length} clientes cadastrados</p>
          </div>
          <Input
            placeholder="Buscar por nome, email ou CPF/CNPJ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="text-sm text-muted-foreground">Novos</div>
            <div className="text-2xl font-bold text-gray-600">
              {clientes.filter(c => c.status === 'novo').length}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, displayCount).map((cliente) => (
            <Card key={cliente.id} className="p-6 hover:shadow-lg transition-all">
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
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Desde: {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Eventos: {cliente.total_eventos}
                </div>
                {cliente.ticket_medio > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Ticket médio: R$ {cliente.ticket_medio.toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Histórico
                </Button>
                <Button size="sm" className="flex-1">Editar</Button>
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
            {search ? 'Nenhum cliente encontrado com os critérios de busca.' : 'Nenhum cliente cadastrado ainda.'}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminClientes;
