import React, { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Check,
  Upload,
  Calendar,
  MapPin,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Profissional {
  id: string;
  registro: string | null;
  nome_completo: string;
  apelido: string | null;
  telefone: string | null;
  habilidades: Record<string, number> | null;
  status: string;
  email?: string | null;
}

interface EventoCasting {
  id: string;
  reserva_id: string;
  profissional_id: string | null;
  profissional_nome_manual: string | null;
  cache: number | null;
  funcao: string;
  confirmado: boolean;
  profissional?: Profissional;
}

interface Reserva {
  id: string;
  nome_completo: string;
  data_evento: string;
  hora_inicio: string;
  local_evento: string;
  pacote_tipo: string;
  numero_criancas: number;
  status: string;
  casting?: EventoCasting[];
}

const Casting: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [profissionalSearch, setProfissionalSearch] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Fetch reservas com casting
  const { data: reservas, isLoading: loadingReservas } = useQuery({
    queryKey: ["reservas-casting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .order("data_evento", { ascending: true });
      if (error) throw error;
      return data as Reserva[];
    },
  });

  // Fetch profissionais
  const { data: profissionais } = useQuery({
    queryKey: ["profissionais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profissionais")
        .select("*")
        .eq("status", "ativo")
        .order("nome_completo");
      if (error) throw error;
      return data as Profissional[];
    },
  });

  // Fetch casting
  const { data: allCasting } = useQuery({
    queryKey: ["evento-casting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evento_casting")
        .select(
          `
          *,
          profissional:profissionais(*)
        `
        );
      if (error) throw error;
      return data as EventoCasting[];
    },
  });

  // Add casting
  const addCastingMutation = useMutation({
    mutationFn: async ({
      reservaId,
      profissionalId,
      nomeManual,
      cache,
      funcao,
    }: {
      reservaId: string;
      profissionalId?: string;
      nomeManual?: string;
      cache?: number;
      funcao?: string;
    }) => {
      const { error } = await supabase.from("evento_casting").insert({
        reserva_id: reservaId,
        profissional_id: profissionalId || null,
        profissional_nome_manual: nomeManual || null,
        cache: cache ?? null,
        funcao: funcao || "Recreador",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento-casting"] });
      toast({ title: "Profissional adicionado ao evento!" });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar profissional",
        variant: "destructive",
      });
    },
  });

  // Remove casting
  const removeCastingMutation = useMutation({
    mutationFn: async (castingId: string) => {
      const { error } = await supabase
        .from("evento_casting")
        .delete()
        .eq("id", castingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento-casting"] });
      toast({ title: "Profissional removido do evento" });
    },
  });

  // Toggle confirmação
  const toggleConfirmMutation = useMutation({
    mutationFn: async ({
      id,
      confirmado,
    }: {
      id: string;
      confirmado: boolean;
    }) => {
      const { error } = await supabase
        .from("evento_casting")
        .update({ confirmado })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento-casting"] });
    },
  });

  // Update cachê
  const updateCacheMutation = useMutation({
    mutationFn: async ({ id, cache }: { id: string; cache: number }) => {
      const { error } = await supabase
        .from("evento_casting")
        .update({ cache })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento-casting"] });
    },
  });

  // Import CSV
  const handleImportCSV = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = (e.target?.result || "") as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        const profissionaisToInsert: {
          nome_completo: string;
          apelido: string | null;
          telefone: string | null;
          email: string | null;
          registro: string | null;
        }[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          if (values.length < 5) continue;

          const nomeIndex = headers.findIndex((h) =>
            h.includes("Nome completo")
          );
          const apelidoIndex = headers.findIndex((h) => h.includes("Apelido"));
          const telefoneIndex = headers.findIndex((h) =>
            h.includes("Telefone")
          );
          const emailIndex = headers.findIndex((h) => h.includes("mail"));
          const registroIndex = headers.findIndex((h) =>
            h.includes("Registro")
          );

          if (nomeIndex >= 0 && values[nomeIndex]?.trim()) {
            profissionaisToInsert.push({
              nome_completo: values[nomeIndex]?.trim().replace(/"/g, ""),
              apelido:
                values[apelidoIndex]?.trim().replace(/"/g, "") || null,
              telefone:
                values[telefoneIndex]?.trim().replace(/"/g, "") || null,
              email: values[emailIndex]?.trim().replace(/"/g, "") || null,
              registro:
                values[registroIndex]?.trim().replace(/"/g, "") || null,
            });
          }
        }

        if (profissionaisToInsert.length > 0) {
          const { error } = await supabase
            .from("profissionais")
            .upsert(profissionaisToInsert, {
              onConflict: "registro",
              ignoreDuplicates: true,
            });

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ["profissionais"] });
          toast({
            title: `${profissionaisToInsert.length} profissionais importados!`,
          });
          setIsImportDialogOpen(false);
        }
      } catch (error) {
        console.error("Import error:", error);
        toast({ title: "Erro ao importar CSV", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  // Quantidade necessária de profissionais por pacote
  const getRequiredProfessionals = (pacoteTipo: string) => {
    if (pacoteTipo.toLowerCase().includes("select")) return 2;
    return 1;
  };

  // Filtrar reservas
  const filteredReservas = reservas?.filter((r) => {
    const matchesSearch =
      r.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.local_evento.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const casting = allCasting?.filter((c) => c.reserva_id === r.id) || [];
    const required = getRequiredProfessionals(r.pacote_tipo);
    const isCastingComplete = casting.length >= required;

    if (statusFilter === "complete") return matchesSearch && isCastingComplete;
    if (statusFilter === "incomplete")
      return matchesSearch && !isCastingComplete;

    return matchesSearch;
  });

  // Filtrar profissionais para autocomplete
  const filteredProfissionais =
    profissionais
      ?.filter(
        (p) =>
          p.nome_completo
            .toLowerCase()
            .includes(profissionalSearch.toLowerCase()) ||
          p.apelido?.toLowerCase().includes(profissionalSearch.toLowerCase())
      )
      .slice(0, 10) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header + Import */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Casting</h1>
            <p className="text-muted-foreground">
              Gerencie a alocação de profissionais para cada evento
            </p>
          </div>
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Importar Profissionais
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Profissionais</DialogTitle>
                <DialogDescription>
                  Selecione um arquivo CSV com os dados dos profissionais
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input type="file" accept=".csv" onChange={handleImportCSV} />
                <p className="text-sm text-muted-foreground">
                  O CSV deve conter as colunas: Nome completo, Apelido,
                  Telefone, Email, Registro
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Eventos Pendentes
                </p>
                <p className="text-2xl font-bold">
                  {reservas?.filter((r) => {
                    const casting =
                      allCasting?.filter((c) => c.reserva_id === r.id) || [];
                    return (
                      casting.length <
                      getRequiredProfessionals(r.pacote_tipo)
                    );
                  }).length || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Profissionais Ativos
                </p>
                <p className="text-2xl font-bold">
                  {profissionais?.length || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Cachês (Mês)
                </p>
                <p className="text-2xl font-bold">
                  R{"$ "}
                  {(
                    allCasting?.reduce(
                      (acc, c) => acc + (c.cache || 0),
                      0
                    ) || 0
                  ).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status do Casting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="incomplete">Casting Incompleto</SelectItem>
              <SelectItem value="complete">Casting Completo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          {loadingReservas ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredReservas?.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum evento encontrado</p>
            </Card>
          ) : (
            filteredReservas?.map((reserva) => {
              const eventCasting =
                allCasting?.filter((c) => c.reserva_id === reserva.id) || [];
              const requiredProfessionals = getRequiredProfessionals(
                reserva.pacote_tipo
              );
              const isCastingComplete =
                eventCasting.length >= requiredProfessionals;
              const totalCache = eventCasting.reduce(
                (acc, curr) => acc + (curr.cache || 0),
                0
              );

              return (
                <Card key={reserva.id} className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">
                          {reserva.nome_completo}
                        </h3>
                        <Badge
                          variant={
                            isCastingComplete ? "default" : "secondary"
                          }
                          className={
                            !isCastingComplete
                              ? "bg-yellow-500 text-white"
                              : ""
                          }
                        >
                          {eventCasting.length}/{requiredProfessionals}{" "}
                          Profissionais
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(
                            new Date(reserva.data_evento),
                            "dd 'de' MMMM, yyyy",
                            { locale: ptBR }
                          )}{" "}
                          - {reserva.hora_inicio}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {reserva.local_evento}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {reserva.numero_criancas} crianças (
                          {reserva.pacote_tipo})
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Cachê Total: R{"$ "}
                          {totalCache.toLocaleString("pt-BR")}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {eventCasting.map((casting) => (
                          <div
                            key={casting.id}
                            className="flex items-center justify-between bg-muted/30 p-2 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {casting.profissional?.nome_completo ||
                                  casting.profissional_nome_manual}
                              </span>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {casting.funcao}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">
                                  R{"$"}
                                </span>
                                <Input
                                  className="w-20 h-8 text-right"
                                  type="number"
                                  defaultValue={casting.cache || 0}
                                  onBlur={(e) =>
                                    updateCacheMutation.mutate({
                                      id: casting.id,
                                      cache: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <Button
                                size="icon"
                                variant={
                                  casting.confirmado ? "default" : "outline"
                                }
                                className={
                                  casting.confirmado
                                    ? "bg-green-600 hover:bg-green-700"
                                    : ""
                                }
                                onClick={() =>
                                  toggleConfirmMutation.mutate({
                                    id: casting.id,
                                    confirmado: !casting.confirmado,
                                  })
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive/90"
                                onClick={() =>
                                  removeCastingMutation.mutate(casting.id)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Profissional
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adicionar ao Casting</DialogTitle>
                            <DialogDescription>
                              Selecione um profissional para o evento de{" "}
                              {reserva.nome_completo}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Buscar Profissional
                              </label>
                              <Input
                                placeholder="Digite o nome..."
                                value={profissionalSearch}
                                onChange={(e) =>
                                  setProfissionalSearch(e.target.value)
                                }
                              />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto space-y-2">
                              {filteredProfissionais.map((prof) => (
                                <div
                                  key={prof.id}
                                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer border"
                                  onClick={() => {
                                    addCastingMutation.mutate({
                                      reservaId: reserva.id,
                                      profissionalId: prof.id,
                                      funcao: "Recreador",
                                      cache: 150,
                                    });
                                    setProfissionalSearch("");
                                  }}
                                >
                                  <div>
                                    <p className="font-medium">
                                      {prof.nome_completo}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {prof.apelido}
                                    </p>
                                  </div>
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-4">
                              <p className="text-sm text-muted-foreground mb-2">
                                Ou adicione manualmente:
                              </p>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Nome do profissional externo"
                                  id="manual-name"
                                />
                                <Button
                                  onClick={() => {
                                    const input = document.getElementById(
                                      "manual-name"
                                    ) as HTMLInputElement | null;
                                    if (input && input.value) {
                                      addCastingMutation.mutate({
                                        reservaId: reserva.id,
                                        nomeManual: input.value,
                                        funcao: "Recreador",
                                        cache: 150,
                                      });
                                      input.value = "";
                                    }
                                  }}
                                >
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Casting;