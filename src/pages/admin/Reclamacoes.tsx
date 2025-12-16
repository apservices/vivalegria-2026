import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  Edit2,
  MessageSquare
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Reclamacao = {
  id: string;
  protocolo: string;
  reserva_id: string;
  categoria: string;
  descricao: string;
  status: string;
  tratativa_interna: string | null;
  responsavel_abertura: string | null;
  nome_cliente: string | null;
  telefone_cliente: string | null;
  codigo_evento_externo: string | null;
  created_at: string;
  updated_at: string;
  reserva?: {
    codigo: string;
    nome_completo: string;
    data_evento: string;
  };
};

type Reserva = {
  id: string;
  codigo: string;
  nome_completo: string;
  data_evento: string;
};

const categorias = [
  "Pontualidade",
  "Comportamento do Recreador",
  "Qualidade do Serviço",
  "Comunicação",
  "Materiais/Equipamentos",
  "Outros"
];

const statusOptions = [
  { value: "aberto", label: "Aberto", color: "bg-red-100 text-red-800" },
  { value: "em_andamento", label: "Em Andamento", color: "bg-yellow-100 text-yellow-800" },
  { value: "resolvido", label: "Resolvido", color: "bg-green-100 text-green-800" }
];

const Reclamacoes = () => {
  const { toast } = useToast();
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterCategoria, setFilterCategoria] = useState<string>("todas");
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReclamacao, setSelectedReclamacao] = useState<Reclamacao | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    reserva_id: "",
    categoria: "",
    descricao: "",
    responsavel_abertura: "",
    nome_cliente: "",
    telefone_cliente: "",
    codigo_evento_externo: ""
  });
  const [editStatus, setEditStatus] = useState("");
  const [editTratativa, setEditTratativa] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReclamacoes();
    fetchReservas();
  }, []);

  const fetchReclamacoes = async () => {
    try {
      const { data, error } = await supabase
        .from("reclamacoes")
        .select(`
          *,
          reserva:reservas(codigo, nome_completo, data_evento)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReclamacoes(data || []);
    } catch (error) {
      console.error("Error fetching reclamacoes:", error);
      toast({
        title: "Erro ao carregar reclamações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReservas = async () => {
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("id, codigo, nome_completo, data_evento")
        .order("data_evento", { ascending: false })
        .limit(100);

      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error("Error fetching reservas:", error);
    }
  };

  const handleCreate = async () => {
    if (!formData.reserva_id || !formData.categoria || !formData.descricao) {
      toast({
        title: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reclamacoes").insert([{
        reserva_id: formData.reserva_id,
        categoria: formData.categoria,
        descricao: formData.descricao,
        responsavel_abertura: formData.responsavel_abertura || null,
        nome_cliente: formData.nome_cliente || null,
        telefone_cliente: formData.telefone_cliente || null,
        codigo_evento_externo: formData.codigo_evento_externo || null,
        status: "aberto",
        protocolo: "TEMP" // Will be overwritten by trigger
      }]);

      if (error) throw error;

      toast({ title: "Reclamação registrada com sucesso!" });
      setIsCreateOpen(false);
      setFormData({
        reserva_id: "",
        categoria: "",
        descricao: "",
        responsavel_abertura: "",
        nome_cliente: "",
        telefone_cliente: "",
        codigo_evento_externo: ""
      });
      fetchReclamacoes();
    } catch (error) {
      console.error("Error creating reclamacao:", error);
      toast({
        title: "Erro ao registrar reclamação",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedReclamacao) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("reclamacoes")
        .update({
          status: editStatus,
          tratativa_interna: editTratativa,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedReclamacao.id);

      if (error) throw error;

      toast({ title: "Reclamação atualizada com sucesso!" });
      setIsEditOpen(false);
      fetchReclamacoes();
    } catch (error) {
      console.error("Error updating reclamacao:", error);
      toast({
        title: "Erro ao atualizar reclamação",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openView = (reclamacao: Reclamacao) => {
    setSelectedReclamacao(reclamacao);
    setIsViewOpen(true);
  };

  const openEdit = (reclamacao: Reclamacao) => {
    setSelectedReclamacao(reclamacao);
    setEditStatus(reclamacao.status);
    setEditTratativa(reclamacao.tratativa_interna || "");
    setIsEditOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(s => s.value === status);
    return option ? (
      <Badge className={option.color}>{option.label}</Badge>
    ) : (
      <Badge>{status}</Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aberto":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "em_andamento":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "resolvido":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredReclamacoes = reclamacoes.filter(r => {
    const matchesSearch = 
      r.protocolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reserva?.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reserva?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || r.status === filterStatus;
    const matchesCategoria = filterCategoria === "todas" || r.categoria === filterCategoria;
    
    return matchesSearch && matchesStatus && matchesCategoria;
  });

  // Stats
  const stats = {
    total: reclamacoes.length,
    aberto: reclamacoes.filter(r => r.status === "aberto").length,
    em_andamento: reclamacoes.filter(r => r.status === "em_andamento").length,
    resolvido: reclamacoes.filter(r => r.status === "resolvido").length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reclamações</h1>
            <p className="text-muted-foreground">
              Gerencie tickets de reclamações de eventos
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Reclamação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nova Reclamação</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Evento *</Label>
                    <Select
                      value={formData.reserva_id}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, reserva_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {reservas.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.codigo} - {r.nome_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, categoria: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Cliente</Label>
                    <Input
                      value={formData.nome_cliente}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome_cliente: e.target.value }))}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone do Cliente</Label>
                    <Input
                      value={formData.telefone_cliente}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone_cliente: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Responsável pela Abertura</Label>
                    <Input
                      value={formData.responsavel_abertura}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsavel_abertura: e.target.value }))}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Código Evento Externo</Label>
                    <Input
                      value={formData.codigo_evento_externo}
                      onChange={(e) => setFormData(prev => ({ ...prev, codigo_evento_externo: e.target.value }))}
                      placeholder="Ex: VV-123"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição da Reclamação *</Label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva detalhadamente a reclamação..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting ? "Salvando..." : "Registrar Reclamação"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Reclamações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Em Aberto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.aberto}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.em_andamento}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Resolvidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolvido}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por protocolo, código ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  {statusOptions.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredReclamacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma reclamação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReclamacoes.map((reclamacao) => (
                    <TableRow key={reclamacao.id}>
                      <TableCell className="font-mono font-medium">
                        {reclamacao.protocolo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reclamacao.reserva?.codigo || reclamacao.codigo_evento_externo || "-"}</div>
                          <div className="text-sm text-muted-foreground">
                            {reclamacao.reserva?.data_evento 
                              ? format(new Date(reclamacao.reserva.data_evento), "dd/MM/yyyy", { locale: ptBR })
                              : "-"
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {reclamacao.nome_cliente || reclamacao.reserva?.nome_completo || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{reclamacao.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(reclamacao.status)}
                          {getStatusBadge(reclamacao.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(reclamacao.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openView(reclamacao)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(reclamacao)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Detalhes da Reclamação
              </DialogTitle>
            </DialogHeader>
            {selectedReclamacao && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Protocolo</Label>
                    <p className="font-mono font-bold text-lg">{selectedReclamacao.protocolo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedReclamacao.status)}
                      {getStatusBadge(selectedReclamacao.status)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Evento</Label>
                    <p className="font-medium">
                      {selectedReclamacao.reserva?.codigo || selectedReclamacao.codigo_evento_externo || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Categoria</Label>
                    <p>{selectedReclamacao.categoria}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Cliente</Label>
                    <p>{selectedReclamacao.nome_cliente || selectedReclamacao.reserva?.nome_completo || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefone</Label>
                    <p>{selectedReclamacao.telefone_cliente || "-"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedReclamacao.descricao}</p>
                </div>
                {selectedReclamacao.tratativa_interna && (
                  <div>
                    <Label className="text-muted-foreground">Tratativa Interna</Label>
                    <p className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      {selectedReclamacao.tratativa_interna}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <Label>Responsável pela Abertura</Label>
                    <p>{selectedReclamacao.responsavel_abertura || "-"}</p>
                  </div>
                  <div>
                    <Label>Data de Abertura</Label>
                    <p>{format(new Date(selectedReclamacao.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                setIsViewOpen(false);
                if (selectedReclamacao) openEdit(selectedReclamacao);
              }}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Atualizar Reclamação</DialogTitle>
            </DialogHeader>
            {selectedReclamacao && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Protocolo</p>
                  <p className="font-mono font-bold">{selectedReclamacao.protocolo}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tratativa Interna (visível apenas para admin)</Label>
                  <Textarea
                    value={editTratativa}
                    onChange={(e) => setEditTratativa(e.target.value)}
                    placeholder="Descreva as ações tomadas para resolver a reclamação..."
                    rows={5}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Reclamacoes;