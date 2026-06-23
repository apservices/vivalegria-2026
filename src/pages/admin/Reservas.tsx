import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Check, X, Trash2, FileText, Download, Kanban } from "lucide-react";
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
import ReservationTimeline from "@/components/admin/ReservationTimeline";
import { logAdminAction } from "@/utils/adminLogs";
import { exportReservas } from "@/utils/exportCSV";

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
  const [editReserva, setEditReserva] = useState<any | null>(null);
  const [isSavingReserva, setIsSavingReserva] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  useEffect(() => {
    filterReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast({
        title: "Erro",
        description: "Não foi possível carregar as reservas.",
        variant: "destructive",
      });
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

  const salvarDadosReserva = async () => {
    if (!editReserva) return;

    try {
      setIsSavingReserva(true);

      const { error } = await supabase
        .from("reservas")
        .update({
          nome_completo: editReserva.nome_completo,
          email: editReserva.email,
          telefone: editReserva.telefone,
          data_evento: editReserva.data_evento,
          hora_inicio: editReserva.hora_inicio,
          local_evento: editReserva.local_evento,
          pacote_tipo: editReserva.pacote_tipo,
          numero_criancas: editReserva.numero_criancas,
          observacoes_evento: (editReserva as any).observacoes_evento ?? (editReserva as any).observacoes,
        })
        .eq("id", editReserva.id);

      if (error) throw error;

      await logAdminAction('RESERVA_EDITADA', editReserva.id, {
        campos: 'dados atualizados',
      });

      toast({
        title: "Dados atualizados",
        description: "As informações da reserva foram salvas com sucesso.",
      });

      setSelectedReserva(editReserva);
      await fetchReservas();
    } catch (error) {
      console.error("Error updating reserva:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações da reserva.",
        variant: "destructive",
      });
    } finally {
      setIsSavingReserva(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // Buscar dados da reserva para criar/atualizar cliente
      const reserva = reservas.find(r => r.id === id);
      
      // Se aprovando, criar/vincular cliente antes
      if (newStatus === "aprovado" || newStatus === "confirmado") {
        if (reserva && !reserva.cliente_id) {
          // Chamar função get_or_create_cliente para criar/atualizar cliente
          const { data: clienteResult, error: clienteError } = await supabase
            .rpc('get_or_create_cliente', {
              p_cpf_cnpj: reserva.cpf_cnpj,
              p_tipo_cadastro: reserva.tipo_cadastro,
              p_nome_completo: reserva.nome_completo,
              p_telefone: reserva.telefone || null,
              p_email: reserva.email || null,
              p_cep: reserva.cep || null,
              p_endereco: reserva.endereco || null,
              p_complemento: reserva.complemento || null,
              p_cidade: reserva.cidade || null
            });

          if (clienteError) {
            console.error("Error creating client:", clienteError);
          } else if (clienteResult) {
            const result = clienteResult as { cliente?: { id?: string } };
            if (result.cliente?.id) {
              // Vincular cliente à reserva
              await supabase
                .from("reservas")
                .update({ cliente_id: result.cliente.id })
                .eq("id", id);
            }
          }
        }
      }

      if (newStatus === "aprovado") {
        toast({
          title: "Gerando contrato...",
          description:
            "Aguarde enquanto geramos o contrato e enviamos por e-mail.",
        });

        const { data, error: fnError } = await supabase.functions.invoke(
          "generate-contract",
          {
            body: { reserva_id: id },
          }
        );

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

        const { error: updateError } = await supabase
          .from("reservas")
          .update({ status: "aprovado" })
          .eq("id", id);

        if (updateError) throw updateError;
      } else {
        const { error } = await supabase
          .from("reservas")
          .update({ status: newStatus })
          .eq("id", id);

        if (error) throw error;

        await logAdminAction('STATUS_ATUALIZADO', id, {
          de: reserva?.status || 'desconhecido',
          para: newStatus,
        });

        toast({
          title: "Status atualizado",
          description: `Reserva marcada como ${newStatus}`,
        });
      }

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

  const handleExportCSV = () => {
    exportReservas(filteredReservas);
  };

  const deleteReserva = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("reservas")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setReservas((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);

      toast({
        title: "Reserva excluída",
        description: "A reserva foi removida com sucesso",
      });
    } catch (error) {
      console.error("Error deleting reserva:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a reserva",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            Pendente
          </span>
        );
      case "aprovado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Aprovado (contrato)
          </span>
        );
      case "confirmado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Confirmado
          </span>
        );
      case "cancelado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reservas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as reservas, aprovação e contratos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/reservas-kanban')}>
              <Kanban className="w-4 h-4 mr-2" />
              Ver Pipeline
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="aprovado">Aprovado (contrato)</SelectItem>
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
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Data do Evento
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Pacote
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Crianças
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Ações
                  </th>
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
                    <td
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhuma reserva encontrada
                    </td>
                  </tr>
                ) : (
                  filteredReservas.map((reserva) => (
                    <tr
                      key={reserva.id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="py-3 px-2">
                        <p className="font-medium">{reserva.nome_completo}</p>
                        <p className="text-sm text-muted-foreground">
                          {reserva.telefone}
                        </p>
                      </td>

                      <td className="py-3 px-2">
                        {new Date(reserva.data_evento).toLocaleDateString(
                          "pt-BR"
                        )}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {reserva.hora_inicio}
                        </span>
                      </td>

                      <td className="py-3 px-2 capitalize">
                        {reserva.pacote_tipo}
                      </td>

                      <td className="py-3 px-2">
                        {reserva.numero_criancas}
                      </td>

                      <td className="py-3 px-2">
                        {getStatusBadge(reserva.status)}
                      </td>

                      <td className="py-3 px-2 font-medium">
                        R{"$ "}
                        {Number(
                          reserva.total_calculado || 0
                        ).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex flex-wrap items-center gap-1">
                          {/* Ver/editar dados do cliente */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedReserva(reserva);
                              setEditReserva(reserva);
                            }}
                            title="Ver dados do cliente"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* Confirmar reserva (sem contrato) */}
                          {reserva.status === "pendente" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateStatus(reserva.id, "confirmado")
                              }
                              title="Confirmar reserva"
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Gerar contrato (somente se já confirmada e ainda sem email_enviado_em) */}
                          {(reserva.status === "confirmado" ||
                            reserva.status === "pendente") &&
                            !reserva.email_enviado_em && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  updateStatus(reserva.id, "aprovado")
                                }
                                title="Gerar contrato e enviar e-mail"
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            )}

                          {/* Cancelar */}
                          {reserva.status !== "cancelado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateStatus(reserva.id, "cancelado")
                              }
                              title="Cancelar reserva"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Excluir */}
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

      {/* Details Dialog - ficha completa do cliente/reserva */}
      <Dialog
        open={!!selectedReserva}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedReserva(null);
            setEditReserva(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes da reserva{" "}
              {selectedReserva ? `#${selectedReserva.id.slice(0, 8)}` : ""}
            </DialogTitle>
          </DialogHeader>

          {editReserva && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Nome completo
                  </p>
                  <Input
                    value={editReserva.nome_completo || ""}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        nome_completo: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">E-mail</p>
                  <Input
                    value={editReserva.email || ""}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Telefone
                  </p>
                  <Input
                    value={editReserva.telefone || ""}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        telefone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Número de crianças
                  </p>
                  <Input
                    type="number"
                    value={editReserva.numero_criancas || 0}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        numero_criancas: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Data do evento
                  </p>
                  <Input
                    type="date"
                    value={
                      editReserva.data_evento
                        ? editReserva.data_evento.slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        data_evento: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Hora de início
                  </p>
                  <Input
                    type="time"
                    value={editReserva.hora_inicio || ""}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        hora_inicio: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Local do evento
                  </p>
                  <Input
                    value={editReserva.local_evento || ""}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        local_evento: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pacote</p>
                  <Input
                    value={editReserva.pacote_tipo || ""}
                    onChange={(e) =>
                      setEditReserva({
                        ...editReserva,
                        pacote_tipo: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div>{getStatusBadge(editReserva.status)}</div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Observações
                </p>
                <Input
                  value={editReserva.observacoes || ""}
                  onChange={(e) =>
                    setEditReserva({
                      ...editReserva,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Informações adicionais relevantes para o evento"
                />
              </div>

              {/* Timeline */}
              <div className="border-t pt-4 mt-4">
                <ReservationTimeline reservaId={editReserva.id} />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-muted-foreground">
                  Criada em:{" "}
                  {selectedReserva?.created_at
                    ? new Date(
                        selectedReserva.created_at
                      ).toLocaleString("pt-BR")
                    : "-"}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedReserva(null);
                      setEditReserva(null);
                    }}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={salvarDadosReserva}
                    disabled={isSavingReserva}
                  >
                    {isSavingReserva ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta reserva? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteReserva}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminReservas;