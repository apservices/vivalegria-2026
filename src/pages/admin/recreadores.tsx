import { useEffect, useState } from "react";
import { Search, Phone, Mail, User, MapPin, Calendar, Award, DollarSign, Edit, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { logAdminAction } from "@/utils/adminLogs";

interface RecreadorComDados {
  id: string;
  nome_completo: string;
  apelido: string | null;
  registro: string | null;
  telefone: string | null;
  email: string | null;
  cpf: string | null;
  status: string | null;
  habilidades: string[];
  experiencia_tempo: string | null;
  endereco: string | null;
  data_nascimento: string | null;
  formacao: string | null;
  cursos: string | null;
  transporte: string | null;
  pix_chave: string | null;
  tem_cnpj: boolean | null;
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
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Perfil e edição
  const [selectedRecreador, setSelectedRecreador] = useState<RecreadorComDados | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditStatus, setShowEditStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      fetchRecreadores();
    }
  }, [user, isAdmin]);

  const fetchRecreadores = async () => {
    try {
      setLoading(true);
      
      const { data: profissionaisData, error: profError } = await supabase
        .from("profissionais")
        .select("*")
        .order("nome_completo", { ascending: true });
      
      if (profError) throw profError;

      const { data: castingData, error: castingError } = await supabase
        .from("evento_casting")
        .select("profissional_id, cache");

      if (castingError) throw castingError;

      const castingPorProfissional = (castingData || []).reduce((acc, casting) => {
        if (!casting.profissional_id) return acc;
        if (!acc[casting.profissional_id]) {
          acc[casting.profissional_id] = { count: 0, totalCache: 0 };
        }
        acc[casting.profissional_id].count += 1;
        acc[casting.profissional_id].totalCache += Number(casting.cache) || 0;
        return acc;
      }, {} as Record<string, { count: number; totalCache: number }>);

      const recreadoresEnriquecidos: RecreadorComDados[] = (profissionaisData || []).map(prof => {
        const stats = castingPorProfissional[prof.id] || { count: 0, totalCache: 0 };
        
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
          cpf: prof.cpf,
          status: prof.status || 'ativo',
          habilidades,
          experiencia_tempo: prof.experiencia_tempo,
          endereco: prof.endereco,
          data_nascimento: prof.data_nascimento,
          formacao: prof.formacao,
          cursos: prof.cursos,
          transporte: prof.transporte,
          pix_chave: prof.pix_chave,
          tem_cnpj: prof.tem_cnpj,
          total_eventos: stats.count,
          cache_medio: stats.count > 0 ? stats.totalCache / stats.count : 0,
          total_caches: stats.totalCache
        };
      });

      setRecreadores(recreadoresEnriquecidos);
    } catch (error) {
      console.error("Erro ao buscar recreadores:", error);
      toast.error("Erro ao carregar recreadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = recreadores;
    
    if (statusFilter !== "todos") {
      result = result.filter(r => r.status === statusFilter);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(r => 
        r.nome_completo?.toLowerCase().includes(searchLower) ||
        r.apelido?.toLowerCase().includes(searchLower) ||
        r.registro?.toLowerCase().includes(searchLower) ||
        r.email?.toLowerCase().includes(searchLower)
      );
    }
    
    setFiltered(result);
    setCurrentPage(1);
  }, [recreadores, search, statusFilter]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'ferias':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Férias</Badge>;
      case 'afastado':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Afastado</Badge>;
      default:
        return <Badge variant="outline">{status || 'N/I'}</Badge>;
    }
  };

  const handleViewProfile = (rec: RecreadorComDados) => {
    setSelectedRecreador(rec);
    setShowProfile(true);
  };

  const handleEditStatus = (rec: RecreadorComDados) => {
    setSelectedRecreador(rec);
    setNewStatus(rec.status || 'ativo');
    setShowEditStatus(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedRecreador || !user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profissionais")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", selectedRecreador.id);

      if (error) throw error;

      await logAdminAction(
        'status_recreador_alterado',
        null,
        { 
          profissional_id: selectedRecreador.id,
          nome: selectedRecreador.nome_completo,
          status_anterior: selectedRecreador.status,
          status_novo: newStatus 
        }
      );

      setRecreadores(prev =>
        prev.map(r => r.id === selectedRecreador.id ? { ...r, status: newStatus } : r)
      );

      toast.success("Status atualizado com sucesso");
      setShowEditStatus(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setSaving(false);
    }
  };

  // Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                <SelectItem value="ferias">Férias</SelectItem>
                <SelectItem value="afastado">Afastado</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nome, apelido, registro ou email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* KPIs */}
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

        {/* Tabela */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Registro</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Apelido</TableHead>
                <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                <TableHead className="hidden xl:table-cell">Email</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Eventos</TableHead>
                <TableHead className="text-right hidden md:table-cell">Cache Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-mono text-xs">
                    {rec.registro || '-'}
                  </TableCell>
                  <TableCell className="font-medium">{rec.nome_completo}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {rec.apelido || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {rec.telefone || '-'}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-muted-foreground">
                    <span className="truncate max-w-[200px] block">{rec.email || '-'}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(rec.status)}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {rec.total_eventos}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    R$ {rec.total_caches.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewProfile(rec)}
                        title="Ver perfil"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditStatus(rec)}
                        title="Editar status"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center px-3 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {search || statusFilter !== 'todos' 
              ? 'Nenhum recreador encontrado com os critérios de busca.' 
              : 'Nenhum recreador cadastrado ainda.'}
          </div>
        )}
      </div>

      {/* Sheet - Perfil Completo */}
      <Sheet open={showProfile} onOpenChange={setShowProfile}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Perfil do Recreador</SheetTitle>
            <SheetDescription>
              {selectedRecreador?.registro || 'Sem registro'}
            </SheetDescription>
          </SheetHeader>

          {selectedRecreador && (
            <div className="mt-6 space-y-6">
              {/* Info básica */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedRecreador.nome_completo}</h3>
                  {getStatusBadge(selectedRecreador.status)}
                </div>
                {selectedRecreador.apelido && (
                  <p className="text-muted-foreground">"{selectedRecreador.apelido}"</p>
                )}
              </div>

              {/* Contato */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contato</h4>
                <div className="space-y-2">
                  {selectedRecreador.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRecreador.telefone}</span>
                    </div>
                  )}
                  {selectedRecreador.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="break-all">{selectedRecreador.email}</span>
                    </div>
                  )}
                  {selectedRecreador.endereco && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRecreador.endereco}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dados pessoais */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Dados Pessoais</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">CPF:</span>
                    <p>{selectedRecreador.cpf || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nascimento:</span>
                    <p>{selectedRecreador.data_nascimento ? new Date(selectedRecreador.data_nascimento).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transporte:</span>
                    <p>{selectedRecreador.transporte || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tem CNPJ:</span>
                    <p>{selectedRecreador.tem_cnpj ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
              </div>

              {/* PIX */}
              {selectedRecreador.pix_chave && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pagamento</h4>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Chave PIX:</span>
                    <p className="font-mono break-all">{selectedRecreador.pix_chave}</p>
                  </div>
                </div>
              )}

              {/* Experiência */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Experiência</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tempo:</span>
                    <p>{selectedRecreador.experiencia_tempo || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Formação:</span>
                    <p>{selectedRecreador.formacao || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cursos:</span>
                    <p>{selectedRecreador.cursos || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Habilidades */}
              {selectedRecreador.habilidades.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecreador.habilidades.map((hab, i) => (
                      <Badge key={i} variant="outline">{hab}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Estatísticas */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Estatísticas</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-3 text-center">
                    <div className="text-2xl font-bold">{selectedRecreador.total_eventos}</div>
                    <div className="text-xs text-muted-foreground">Eventos</div>
                  </Card>
                  <Card className="p-3 text-center">
                    <div className="text-2xl font-bold">R$ {selectedRecreador.cache_medio.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">Média</div>
                  </Card>
                  <Card className="p-3 text-center">
                    <div className="text-2xl font-bold">R$ {selectedRecreador.total_caches.toLocaleString('pt-BR')}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </Card>
                </div>
              </div>

              {/* Ações */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => {
                    setShowProfile(false);
                    handleEditStatus(selectedRecreador);
                  }}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Status
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog - Editar Status */}
      <Dialog open={showEditStatus} onOpenChange={setShowEditStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Status</DialogTitle>
          </DialogHeader>

          {selectedRecreador && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Alterando status de <strong>{selectedRecreador.nome_completo}</strong>
              </p>
              
              <div className="space-y-2">
                <Label>Novo Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="ferias">Férias</SelectItem>
                    <SelectItem value="afastado">Afastado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditStatus(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStatus} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminRecreadores;
