import { useEffect, useState } from "react";
import { Search, MapPin, Star, DollarSign, Award, Phone, Mail, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface RecreadorComDados {
  id: string;
  nome_completo: string;
  apelido: string | null;
  registro: string | null;
  telefone: string | null;
  email: string | null;
  status: string | null;
  habilidades: string[];
  experiencia_tempo: string | null;
  endereco: string | null;
  total_eventos: number;
  cache_medio: number;
  total_caches: number;
}

const AdminRecreadores = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [recreadores, setRecreadores] = useState<RecreadorComDados[]>([]);
  const [filtered, setFiltered] = useState<RecreadorComDados[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    if (user && isAdmin) {
      fetchRecreadores();
    }
  }, [user, isAdmin]);

  const fetchRecreadores = async () => {
    try {
      setLoading(true);
      
      // Buscar profissionais
      const { data: profissionaisData, error: profError } = await supabase
        .from("profissionais")
        .select("*")
        .order("nome_completo", { ascending: true });
      
      if (profError) throw profError;

      // Buscar casting para estatísticas
      const { data: castingData, error: castingError } = await supabase
        .from("evento_casting")
        .select("profissional_id, cache");

      if (castingError) throw castingError;

      // Agrupar casting por profissional
      const castingPorProfissional = (castingData || []).reduce((acc, casting) => {
        if (!casting.profissional_id) return acc;
        if (!acc[casting.profissional_id]) {
          acc[casting.profissional_id] = { count: 0, totalCache: 0 };
        }
        acc[casting.profissional_id].count += 1;
        acc[casting.profissional_id].totalCache += Number(casting.cache) || 0;
        return acc;
      }, {} as Record<string, { count: number; totalCache: number }>);

      // Enriquecer profissionais com dados calculados
      const recreadoresEnriquecidos: RecreadorComDados[] = (profissionaisData || []).map(prof => {
        const stats = castingPorProfissional[prof.id] || { count: 0, totalCache: 0 };
        
        // Extrair habilidades do JSONB
        let habilidades: string[] = [];
        if (prof.habilidades) {
          if (Array.isArray(prof.habilidades)) {
            habilidades = prof.habilidades as string[];
          } else if (typeof prof.habilidades === 'object') {
            habilidades = Object.keys(prof.habilidades).filter(k => (prof.habilidades as Record<string, boolean>)[k]);
          }
        }

        return {
          id: prof.id,
          nome_completo: prof.nome_completo,
          apelido: prof.apelido,
          registro: prof.registro,
          telefone: prof.telefone,
          email: prof.email,
          status: prof.status || 'ativo',
          habilidades,
          experiencia_tempo: prof.experiencia_tempo,
          endereco: prof.endereco,
          total_eventos: stats.count,
          cache_medio: stats.count > 0 ? stats.totalCache / stats.count : 0,
          total_caches: stats.totalCache
        };
      });

      setRecreadores(recreadoresEnriquecidos);
    } catch (error) {
      console.error("Erro ao buscar recreadores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = recreadores;
    
    // Filtro por status
    if (statusFilter !== "todos") {
      result = result.filter(r => r.status === statusFilter);
    }
    
    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(r => 
        r.nome_completo?.toLowerCase().includes(searchLower) ||
        r.apelido?.toLowerCase().includes(searchLower) ||
        r.registro?.toLowerCase().includes(searchLower)
      );
    }
    
    setFiltered(result);
  }, [recreadores, search, statusFilter]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'ferias':
        return <Badge className="bg-yellow-500">Férias</Badge>;
      default:
        return <Badge variant="outline">{status || 'N/I'}</Badge>;
    }
  };

  if (authLoading) {
    return <AdminLayout><div className="p-6">Carregando...</div></AdminLayout>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return <AdminLayout><div className="p-6">Carregando recreadores...</div></AdminLayout>;
  }

  const ativos = recreadores.filter(r => r.status === 'ativo').length;
  const comEventos = recreadores.filter(r => r.total_eventos > 0).length;

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Recreadores</h1>
            <p className="text-muted-foreground">{recreadores.length} profissionais cadastrados</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Buscar nome, apelido ou registro..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{recreadores.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Ativos</div>
            <div className="text-2xl font-bold text-green-600">{ativos}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Com Eventos</div>
            <div className="text-2xl font-bold text-blue-600">{comEventos}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Cache Total</div>
            <div className="text-2xl font-bold text-primary">
              R$ {recreadores.reduce((acc, r) => acc + r.total_caches, 0).toLocaleString('pt-BR')}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, displayCount).map((rec) => (
            <Card key={rec.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-lg">{rec.nome_completo}</div>
                  {rec.apelido && (
                    <div className="text-sm text-muted-foreground">"{rec.apelido}"</div>
                  )}
                  {rec.registro && (
                    <div className="text-xs text-primary font-mono">{rec.registro}</div>
                  )}
                </div>
                {getStatusBadge(rec.status)}
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                {rec.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {rec.telefone}
                  </div>
                )}
                {rec.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{rec.email}</span>
                  </div>
                )}
                {rec.experiencia_tempo && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {rec.experiencia_tempo}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  Eventos: {rec.total_eventos}
                </div>
                {rec.cache_medio > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Cache médio: R$ {rec.cache_medio.toFixed(0)}
                  </div>
                )}
              </div>

              {rec.habilidades.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {rec.habilidades.slice(0, 3).map((hab, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {hab}
                    </Badge>
                  ))}
                  {rec.habilidades.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{rec.habilidades.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Perfil
                </Button>
                <Button size="sm" className="flex-1">Alocar</Button>
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
            {search || statusFilter !== 'todos' 
              ? 'Nenhum recreador encontrado com os critérios de busca.' 
              : 'Nenhum recreador cadastrado ainda.'}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRecreadores;
