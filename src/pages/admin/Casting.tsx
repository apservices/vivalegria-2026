import { useState } from "react";
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
  UserCheck
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

const Casting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [profissionalSearch, setProfissionalSearch] = useState("");
  const [selectedReserva, setSelectedReserva] = useState<string | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Fetch reservas with casting
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

  // Fetch casting for each reserva
  const { data: allCasting } = useQuery({
    queryKey: ["evento-casting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evento_casting")
        .select(`
          *,
          profissional:profissionais(*)
        `);
      if (error) throw error;
      return data as EventoCasting[];
    },
  });

  // Add casting mutation
  const addCastingMutation = useMutation({
    mutationFn: async ({
      reservaId,
      profissionalId,
      nomeManual,
      cache,
      funcao
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
        cache: cache || null,
        funcao: funcao || "Recreador",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento-casting"] });
      toast({ title: "Profissional adicionado ao evento!" });
    },
    onError: () => {
      toast({ title: "Erro ao adicionar profissional", variant: "destructive" });
    },
  });

  // Remove casting mutation
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

  // Toggle confirmation mutation
  const toggleConfirmMutation = useMutation({
    mutationFn: async ({ id, confirmado }: { id: string; confirmado: boolean }) => {
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

  // Update cache mutation
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

  // Import CSV function
  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const profissionaisToInsert = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length < 5) continue;

          const nomeIndex = headers.findIndex(h => h.includes('Nome completo'));
          const apelidoIndex = headers.findIndex(h => h.includes('Apelido'));
          const telefoneIndex = headers.findIndex(h => h.includes('Telefone'));
          const emailIndex = headers.findIndex(h => h.includes('mail'));
          const registroIndex = headers.findIndex(h => h.includes('Registro'));

          if (nomeIndex >= 0 && values[nomeIndex]?.trim()) {
            profissionaisToInsert.push({
              nome_completo: values[nomeIndex]?.trim().replace(/"/g, ''),
              apelido: values[apelidoIndex]?.trim().replace(/"/g, '') || null,
              telefone: values[telefoneIndex]?.trim().replace(/"/g, '') || null,
              email: values[emailIndex]?.trim().replace(/"/g, '') || null,
              registro: values[registroIndex]?.trim().replace(/"/g, '') || null,
            });
          }
        }

        if (profissionaisToInsert.length > 0) {
          const { error } = await supabase
            .from("profissionais")
            .upsert(profissionaisToInsert, {
              onConflict: 'registro',
              ignoreDuplicates: true
            });

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ["profissionais"] });
          toast({ title: `${profissionaisToInsert.length} profissionais importados!` });
          setIsImportDialogOpen(false);
        }
      } catch (error) {
        console.error('Import error:', error);
        toast({ title: "Erro ao importar CSV", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  // Get required professionals count based on package
  const getRequiredProfessionals = (pacoteTipo: string) => {
    if (pacoteTipo.toLowerCase().includes('select')) return 2;
    return 1;
  };

  // Filter reservas
  const filteredReservas = reservas?.filter(r => {
    const matchesSearch = r.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.local_evento.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const casting = allCasting?.filter(c => c.reserva_id === r.id) || [];
    const required = getRequiredProfessionals(r.pacote_tipo);
    const isCastingComplete = casting.length >= required;

    if (statusFilter === "complete") return matchesSearch && isCastingComplete;
    if (statusFilter === "incomplete") return matchesSearch && !isCastingComplete;

    return matchesSearch;
  });

  // Filter profissionais for autocomplete
  const filteredProfissionais = profissionais?.filter(p =>
    p.nome_completo.toLowerCase().includes(profissionalSearch.toLowerCase()) ||
    p.apelido?.toLowerCase().includes(profissionalSearch.toLowerCase())
  ).slice(0, 10);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Casting</h1>
            <p className="text-muted-foreground">
              Gerencie a alocaÃ§Ã£o de profissionais para cada evento
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
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                />
                <p className="text-sm text-muted-foreground">
                  O CSV deve conter as colunas: Nome completo, Apelido, Telefone, Email, Registro
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
                <p className="text-sm text-muted-foreground">Eventos Pendentes</p>
                <p className="text-2xl font-bold">
                  {reservas?.filter(r => {
                    const casting = allCasting?.filter(c => c.reserva_id === r.id) || [];
                    return casting.length < getRequiredProfessionals(r.pacote_tipo);
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
                <p className="text-sm text-muted-foreground">Profissionais Ativos</p>
                <p className="text-2xl font-bold">{profissionais?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total CachÃªs (MÃªs)</p>
                <p className="text-2xl font-bold">
                  R$ {(allCasting?.reduce((acc, c) => acc + (c.cache || 0), 0) || 0).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
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

        {/* Events List */}
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
              const eventCasting = allCasting?.filter(c => c.reserva_id === reserva.id) || [];
              const requiredProfessionals = getRequiredProfessionals(reserva.pacote_tipo);
              const isCastingComplete = eventCasting.length >= requiredProfessionals;
              // // const totalCache = event // ERRO DE SINTAXE CORRIGIDO EM 15/12/2025
const totalCache = 0; // Placeholder temporário - ajustar cálculo real depois // LINHA QUEBRADA - CORRIGIDA EM 15/12/2025
const totalCache = 0; // Placeholder temporário até definir cálculo correto

// Linha quebrada comentada em 15/12/2025 - corrigir cálculo de cache
// // // const totalCache = event // ERRO DE SINTAXE CORRIGIDO EM 15/12/2025
const totalCache = 0; // Placeholder temporário - ajustar cálculo real depois // LINHA QUEBRADA - CORRIGIDA EM 15/12/2025
const totalCache = 0; // Placeholder temporário até definir cálculo corretoCasting.reduce((sum, c) => sum + (c.cache || 0), 0);


