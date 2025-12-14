import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Check, X, Trash2 } from "lucide-react";
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
const AdminReservas = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservas, setReservas] = useState<any[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);
  useEffect(() => {
    if (user && isAdmin) {
      fetchReservas();
    }
  }, [user, isAdmin]);
  useEffect(() => {
    filterReservas();
  }, [reservas, searchTerm, statusFilter]);
  const fetchReservas = async () => {
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error("Error fetching reservas:", error);
    } finally {
      setLoadingData(false);
    }
  };
  const filterReservas = () => {
    let filtered = [...reservas];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.nome_completo?.toLowerCase().includes(term) ||
          r.email?.toLowerCase().includes(term) ||
          r.telefone?.includes(term)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    setFilteredReservas(filtered);
  };
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // Se for aprovação, chamar edge function para gerar contrato
      if (newStatus === "aprovado") {
        toast({
          title: "Gerando contrato...",
          description: "Aguarde enquanto geramos o contrato e enviamos por e-mail",
        });

        const { data, error: fnError } = await supabase.functions.invoke("generate-contract", {
          body: { reserva_id: id },
        });

        if (fnError) {
          console.error("Error generating contract:", fnError);
          toast({
            title: "Erro ao gerar contrato",
            description: "O contrato não pôde ser gerado. Tente novamente.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Contrato enviado!",
          description: `E-mail com contrato enviado para o cliente (${data?.codigo})`,
        });
      } else {
        const { error } = await supabase
          .from("reservas")
          .update({ status: newStatus })
          .eq("id", id);
        if (error) throw error;
        
        toast({
          title: "Status atualizado",
          description: `Reserva marcada como ${newStatus}`,
        });
      }

      // Refresh data
      fetchReservas();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };
  const deleteReserva = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("reservas").delete().eq("id", deleteId);
      if (error) throw error;
      setReservas((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      toast({
        title: "Reserva excluÃƒÂ­da",
        description: "A reserva foi removida com sucesso",
      });
    } catch (error) {
      console.error("Error deleting reserva:", error);
      toast({
        title: "Erro",
        description: "NÃƒÂ£o foi possÃƒÂ­vel excluir a reserva",
        variant: "destructive",
      });
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pendente</span>;
      case "aprovado":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aprovado</span>;
      case "confirmado":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Confirmado</span>;
      case "cancelado":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Cancelado</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
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
          <h1 className="text-3xl font-bold">Reservas</h1>
          <p className="text-muted-foreground">Gerencie todas as reservas de eventos</p>
        </div>
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
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
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
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
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Data Evento</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Pacote</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">CrianÃƒÂ§as</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">AÃƒÂ§ÃƒÂµes</th>
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredReservas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma reserva encontrada
                    </td>
                  </tr>
                ) : (
                  filteredReservas.map((reserva) => (
                    <tr key={reserva.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{reserva.nome_completo}</p>
                        <p className="text-sm text-muted-foreground">{reserva.telefone}</p>
                      </td>
                      <td className="py-3 px-2">
                        {new Date(reserva.data_evento).toLocaleDateString("pt-BR")}
                        <br />
                        <span className="text-sm text-muted-foreground">{reserva.hora_inicio}</span>
                      </td>
                      <td className="py-3 px-2 capitalize">{reserva.pacote_tipo}</td>
                      <td className="py-3 px-2">{reserva.numero_criancas}</td>
                      <td className="py-3 px-2">{getStatusBadge(reserva.status)}</td>
                      <td className="py-3 px-2 font-medium">
                        R$ {Number(reserva.total_calculado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedReserva(reserva)}
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {reserva.status === "pendente" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(reserva.id, "confirmado")}
                              title="Confirmar"
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {reserva.status !== "cancelado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(reserva.id, "cancelado")}
                              title="Cancelar"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(reserva.id)}
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
      <Dialog open={!!selectedReserva} onOpenChange={() => setSelectedReserva(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          {selectedReserva && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedReserva.nome_completo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium capitalize">
                    {selectedReserva.tipo_cliente === "novo" ? "Novo" : "Existente"} - {selectedReserva.tipo_cadastro?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                  <p className="font-medium">{selectedReserva.cpf_cnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{selectedReserva.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedReserva.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedReserva.status)}
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Dados do Evento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {new Date(selectedReserva.data_evento).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HorÃƒÂ¡rio</p>
                    <p className="font-medium">{selectedReserva.hora_inicio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-medium">{selectedReserva.local_evento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NÃ‚Âº CrianÃƒÂ§as</p>
                    <p className="font-medium">{selectedReserva.numero_criancas}</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Pacote e ServiÃƒÂ§os</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Pacote</p>
                    <p className="font-medium capitalize">{selectedReserva.pacote_tipo}</p>
                  </div>
                  {selectedReserva.oficinas_selecionadas?.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Oficinas</p>
                      <p className="font-medium">
                        {selectedReserva.oficinas_selecionadas.join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedReserva.extras_selecionados?.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Extras</p>
                      <p className="font-medium">
                        {selectedReserva.extras_selecionados.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {Number(selectedReserva.total_calculado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              {selectedReserva.endereco && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">EndereÃƒÂ§o</h4>
                  <p className="text-sm">
                    {selectedReserva.endereco}
                    {selectedReserva.complemento && `, ${selectedReserva.complemento}`}
                    <br />
                    {selectedReserva.cidade} - CEP: {selectedReserva.cep}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusÃƒÂ£o</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta reserva? Esta aÃƒÂ§ÃƒÂ£o nÃƒÂ£o pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReserva} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};
export default AdminReservas;
