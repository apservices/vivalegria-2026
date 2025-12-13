import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, UserCheck, Archive, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
const AdminCandidaturas = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidaturas, setCandidaturas] = useState<any[]>([]);
  const [filteredCandidaturas, setFilteredCandidaturas] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidatura, setSelectedCandidatura] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);
  useEffect(() => {
    if (user && isAdmin) {
      fetchCandidaturas();
    }
  }, [user, isAdmin]);
  useEffect(() => {
    filterCandidaturas();
  }, [candidaturas, searchTerm, statusFilter]);
  const fetchCandidaturas = async () => {
    try {
      const { data, error } = await supabase
        .from("candidaturas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCandidaturas(data || []);
    } catch (error) {
      console.error("Error fetching candidaturas:", error);
    } finally {
      setLoadingData(false);
    }
  };
  const filterCandidaturas = () => {
    let filtered = [...candidaturas];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nome_completo?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.cidade?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    setFilteredCandidaturas(filtered);
  };
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("candidaturas")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setCandidaturas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast({
        title: "Status atualizado",
        description: `Candidatura marcada como ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "NÃ£o foi possÃ­vel atualizar o status",
        variant: "destructive",
      });
    }
  };
  const deleteCandidatura = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("candidaturas").delete().eq("id", deleteId);
      if (error) throw error;
      setCandidaturas((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      toast({
        title: "Candidatura excluÃ­da",
        description: "A candidatura foi removida com sucesso",
      });
    } catch (error) {
      console.error("Error deleting candidatura:", error);
      toast({
        title: "Erro",
        description: "NÃ£o foi possÃ­vel excluir a candidatura",
        variant: "destructive",
      });
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pendente</span>;
      case "contatado":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Contatado</span>;
      case "arquivado":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Arquivado</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };
  const disponibilidadeLabels: Record<string, string> = {
    fins_semana: "Finais de semana",
    feriados: "Feriados",
    eventos_escolares: "Eventos escolares",
    eventos_corporativos: "Eventos corporativos",
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
        <div>
          <h1 className="text-3xl font-bold">Candidaturas</h1>
          <p className="text-muted-foreground">Gerencie candidaturas para vagas de emprego</p>
        </div>
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="contatado">Contatado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
        {/* Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Candidato</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cidade</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">AÃ§Ãµes</th>
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredCandidaturas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma candidatura encontrada
                    </td>
                  </tr>
                ) : (
                  filteredCandidaturas.map((candidatura) => (
                    <tr key={candidatura.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{candidatura.nome_completo}</p>
                        <p className="text-sm text-muted-foreground">{candidatura.email}</p>
                      </td>
                      <td className="py-3 px-2">{candidatura.cidade}</td>
                      <td className="py-3 px-2">
                        {new Date(candidatura.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 px-2">{getStatusBadge(candidatura.status)}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedCandidatura(candidatura)}
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {candidatura.status === "pendente" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(candidatura.id, "contatado")}
                              title="Marcar como contatado"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {candidatura.status !== "arquivado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(candidatura.id, "arquivado")}
                              title="Arquivar"
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(candidatura.id)}
                            title="Excluir"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      {/* Details Dialog */}
      <Dialog open={!!selectedCandidatura} onOpenChange={() => setSelectedCandidatura(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Candidatura</DialogTitle>
          </DialogHeader>
          {selectedCandidatura && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedCandidatura.nome_completo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedCandidatura.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <a href={`mailto:${selectedCandidatura.email}`} className="font-medium text-primary hover:underline">
                    {selectedCandidatura.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <a href={`https://wa.me/55${selectedCandidatura.telefone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    {selectedCandidatura.telefone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium">{selectedCandidatura.cidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data da candidatura</p>
                  <p className="font-medium">
                    {new Date(selectedCandidatura.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {selectedCandidatura.disponibilidade?.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Disponibilidade</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidatura.disponibilidade.map((d: string) => (
                      <span key={d} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {disponibilidadeLabels[d] || d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedCandidatura.experiencia && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">ExperiÃªncia com crianÃ§as</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedCandidatura.experiencia}</p>
                </div>
              )}
              {selectedCandidatura.sobre_voce && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Sobre o candidato</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedCandidatura.sobre_voce}</p>
                </div>
              )}
              <div className="border-t pt-4 flex gap-2">
                <Button
                  onClick={() => window.open(`https://wa.me/55${selectedCandidatura.telefone.replace(/\D/g, "")}`, "_blank")}
                  className="flex-1"
                >
                  Contatar via WhatsApp
                </Button>
                <Button
                  onClick={() => window.open(`mailto:${selectedCandidatura.email}`, "_blank")}
                  variant="outline"
                  className="flex-1"
                >
                  Enviar e-mail
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusÃ£o</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta candidatura? Esta aÃ§Ã£o nÃ£o pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCandidatura} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};
export default AdminCandidaturas;
