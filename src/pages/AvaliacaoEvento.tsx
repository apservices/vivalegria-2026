import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Send, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";

const avaliacaoSchema = z.object({
  reserva_id: z.string().min(1, "Selecione o evento"),
  // Avaliação do Evento
  pontualidade_equipe: z.string().min(1, "Selecione uma opção"),
  organizacao_materiais: z.string().min(1, "Selecione uma opção"),
  engajamento_criancas: z.string().min(1, "Selecione uma opção"),
  comportamento_pais: z.string().min(1, "Selecione uma opção"),
  // Avaliação do Local
  espaco_adequado: z.string().min(1, "Selecione uma opção"),
  condicoes_seguranca: z.string().min(1, "Selecione uma opção"),
  // Avaliação dos Pares
  avaliacao_colegas: z.string().min(1, "Selecione uma opção"),
  avaliacao_coordenacao: z.string().min(1, "Selecione uma opção"),
  // Autoavaliação
  desempenho_pessoal: z.string().min(1, "Selecione uma opção"),
  dificuldades: z.string().optional(),
  // Extras
  atividades_realizadas: z.array(z.string()).optional(),
  observacoes_gerais: z.string().optional(),
  sugestoes_melhoria: z.string().optional(),
});

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

const ratingOptions = [
  { value: "excelente", label: "Excelente" },
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" },
  { value: "ruim", label: "Ruim" },
];

const atividades = [
  "Pintura Facial",
  "Escultura de Balões",
  "Caça ao Tesouro",
  "Jogos em Grupo",
  "Oficina de Slime",
  "Oficina de Cupcake",
  "Oficina de Miçangas",
  "Brincadeiras com Bola",
  "Dança/Baladinha",
  "Área Baby",
  "Outras",
];

const AvaliacaoEvento = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isRecreador, profissionalId, isLoading: authLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meusEventos, setMeusEventos] = useState<any[]>([]);
  const [eventosAvaliados, setEventosAvaliados] = useState<string[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [profissionalNome, setProfissionalNome] = useState("");

  const form = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      reserva_id: "",
      pontualidade_equipe: "",
      organizacao_materiais: "",
      engajamento_criancas: "",
      comportamento_pais: "",
      espaco_adequado: "",
      condicoes_seguranca: "",
      avaliacao_colegas: "",
      avaliacao_coordenacao: "",
      desempenho_pessoal: "",
      dificuldades: "",
      atividades_realizadas: [],
      observacoes_gerais: "",
      sugestoes_melhoria: "",
    },
  });

  useEffect(() => {
    if (!authLoading && user && (isRecreador || isAdmin)) {
      fetchMeusEventos();
    }
  }, [authLoading, user, isRecreador, isAdmin, profissionalId]);

  const fetchMeusEventos = async () => {
    setIsLoadingEventos(true);
    try {
      // Buscar dados do profissional
      if (profissionalId) {
        const { data: profData } = await supabase
          .from("profissionais")
          .select("nome_completo, apelido")
          .eq("id", profissionalId)
          .single();
        
        if (profData) {
          setProfissionalNome(profData.apelido || profData.nome_completo);
        }
      }

      // Buscar eventos que já foram avaliados por este profissional
      const { data: avaliacoesExistentes } = await supabase
        .from("avaliacoes_evento")
        .select("reserva_id")
        .eq("profissional_id", profissionalId);
      
      const idsAvaliados = (avaliacoesExistentes || [])
        .map(a => a.reserva_id)
        .filter(Boolean) as string[];
      setEventosAvaliados(idsAvaliados);

      // Buscar eventos do recreador via evento_casting
      let eventosQuery;
      
      if (isAdmin) {
        // Admin pode ver todos os eventos realizados
        eventosQuery = supabase
          .from("reservas")
          .select("id, codigo, nome_completo, data_evento, local_evento, status")
          .in("status", ["realizado", "aprovado"])
          .order("data_evento", { ascending: false })
          .limit(50);
      } else if (profissionalId) {
        // Recreador vê apenas seus próprios eventos
        const { data: meusCastings } = await supabase
          .from("evento_casting")
          .select("reserva_id")
          .eq("profissional_id", profissionalId);
        
        const reservaIds = (meusCastings || []).map(c => c.reserva_id).filter(Boolean) as string[];
        
        if (reservaIds.length === 0) {
          setMeusEventos([]);
          setIsLoadingEventos(false);
          return;
        }

        eventosQuery = supabase
          .from("reservas")
          .select("id, codigo, nome_completo, data_evento, local_evento, status")
          .in("id", reservaIds)
          .in("status", ["realizado", "aprovado"])
          .order("data_evento", { ascending: false });
      }

      if (eventosQuery) {
        const { data: eventos, error } = await eventosQuery;
        if (error) throw error;
        
        // Filtrar eventos já avaliados
        const eventosPendentes = (eventos || []).filter(
          e => !idsAvaliados.includes(e.id)
        );
        setMeusEventos(eventosPendentes);
      }
    } catch (error) {
      console.error("Error fetching eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEventos(false);
    }
  };

  const onSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true);
    try {
      const { reserva_id, ...respostas } = data;
      
      // Verificar se já existe avaliação para este evento
      const { data: existing } = await supabase
        .from("avaliacoes_evento")
        .select("id")
        .eq("reserva_id", reserva_id)
        .eq("profissional_id", profissionalId)
        .single();

      if (existing) {
        toast({
          title: "Avaliação já existe",
          description: "Você já avaliou este evento.",
          variant: "destructive",
        });
        return;
      }

      const insertData = {
        profissional_nome: profissionalNome,
        profissional_id: profissionalId,
        reserva_id,
        respostas,
      };

      const { error } = await supabase.from("avaliacoes_evento").insert(insertData);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado pelo feedback.",
      });
    } catch (error: any) {
      console.error("Error submitting:", error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAtividades = form.watch("atividades_realizadas") || [];

  const handleAtividadeToggle = (atividade: string) => {
    const current = selectedAtividades;
    const updated = current.includes(atividade)
      ? current.filter((a) => a !== atividade)
      : [...current, atividade];
    form.setValue("atividades_realizadas", updated);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Avaliação do Evento | Vivalegria" noindex />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF731D] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not a recreador/admin
  if (!user || (!isRecreador && !isAdmin)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Acesso Restrito | Vivalegria" noindex />
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="w-16 h-16 text-[#FF731D] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Área Restrita</h1>
          <p className="text-muted-foreground mb-6">
            Esta página é exclusiva para recreadores cadastrados.
          </p>
          <Button 
            onClick={() => navigate("/admin/login")} 
            className="bg-[#FF731D] hover:bg-[#FF731D]/90"
          >
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Avaliação Enviada | Vivalegria" noindex />
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Avaliação Enviada!</h1>
          <p className="text-muted-foreground mb-6">
            Obrigado por compartilhar seu feedback. Suas informações são muito importantes para nós.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => {
                setIsSuccess(false);
                fetchMeusEventos();
                form.reset();
              }} 
              className="bg-[#FF731D] hover:bg-[#FF731D]/90"
            >
              Avaliar Outro Evento
            </Button>
            <Button onClick={() => navigate("/recreador")} variant="outline">
              Voltar ao Portal
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // No events to evaluate
  if (!isLoadingEventos && meusEventos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Avaliação do Evento | Vivalegria" noindex />
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-[#FFD836] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Nenhum Evento Pendente</h1>
          <p className="text-muted-foreground mb-6">
            {eventosAvaliados.length > 0 
              ? "Você já avaliou todos os seus eventos. Obrigado!"
              : "Você ainda não tem eventos realizados para avaliar."}
          </p>
          <Button onClick={() => navigate("/recreador")} variant="outline">
            Voltar ao Portal
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white py-8 px-4">
      <SEO title="Avaliação do Evento | Vivalegria" noindex />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Star className="w-12 h-12 text-[#FFD836] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Avaliação do Evento</h1>
          <p className="text-muted-foreground mt-2">
            Olá, {profissionalNome}! Preencha a avaliação após cada evento realizado.
          </p>
          {meusEventos.length > 0 && (
            <p className="text-sm text-viva-orange mt-1">
              {meusEventos.length} evento(s) pendente(s) de avaliação
            </p>
          )}
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Seleção do Evento */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Selecione o Evento</h2>
              
              {isLoadingEventos ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF731D] mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Carregando eventos...</p>
                </div>
              ) : (
                <div>
                  <Label>Evento *</Label>
                  <Select
                    value={form.watch("reserva_id")}
                    onValueChange={(value) => form.setValue("reserva_id", value)}
                  >
                    <SelectTrigger className={form.formState.errors.reserva_id ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {meusEventos.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.codigo} - {r.nome_completo} ({new Date(r.data_evento).toLocaleDateString("pt-BR")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.reserva_id && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.reserva_id.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Avaliação do Evento */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Avaliação do Evento</h2>
              
              {[
                { name: "pontualidade_equipe", label: "Pontualidade da equipe" },
                { name: "organizacao_materiais", label: "Organização dos materiais" },
                { name: "engajamento_criancas", label: "Engajamento das crianças" },
                { name: "comportamento_pais", label: "Comportamento dos pais/responsáveis" },
              ].map((field) => (
                <div key={field.name}>
                  <Label>{field.label} *</Label>
                  <RadioGroup
                    value={form.watch(field.name as any)}
                    onValueChange={(value) => form.setValue(field.name as any, value)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {ratingOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                        <Label htmlFor={`${field.name}-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {form.formState.errors[field.name as keyof AvaliacaoFormData] && (
                    <p className="text-sm text-destructive mt-1">Selecione uma opção</p>
                  )}
                </div>
              ))}
            </div>

            {/* Avaliação do Local */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Avaliação do Local</h2>
              
              {[
                { name: "espaco_adequado", label: "Espaço adequado para atividades" },
                { name: "condicoes_seguranca", label: "Condições de segurança" },
              ].map((field) => (
                <div key={field.name}>
                  <Label>{field.label} *</Label>
                  <RadioGroup
                    value={form.watch(field.name as any)}
                    onValueChange={(value) => form.setValue(field.name as any, value)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {ratingOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                        <Label htmlFor={`${field.name}-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {form.formState.errors[field.name as keyof AvaliacaoFormData] && (
                    <p className="text-sm text-destructive mt-1">Selecione uma opção</p>
                  )}
                </div>
              ))}
            </div>

            {/* Avaliação dos Pares */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Avaliação da Equipe</h2>
              
              {[
                { name: "avaliacao_colegas", label: "Desempenho dos colegas recreadores" },
                { name: "avaliacao_coordenacao", label: "Suporte da coordenação" },
              ].map((field) => (
                <div key={field.name}>
                  <Label>{field.label} *</Label>
                  <RadioGroup
                    value={form.watch(field.name as any)}
                    onValueChange={(value) => form.setValue(field.name as any, value)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {ratingOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                        <Label htmlFor={`${field.name}-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {form.formState.errors[field.name as keyof AvaliacaoFormData] && (
                    <p className="text-sm text-destructive mt-1">Selecione uma opção</p>
                  )}
                </div>
              ))}
            </div>

            {/* Autoavaliação */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Autoavaliação</h2>
              
              <div>
                <Label>Como você avalia seu desempenho? *</Label>
                <RadioGroup
                  value={form.watch("desempenho_pessoal")}
                  onValueChange={(value) => form.setValue("desempenho_pessoal", value)}
                  className="flex flex-wrap gap-4 mt-2"
                >
                  {ratingOptions.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={`desempenho-${opt.value}`} />
                      <Label htmlFor={`desempenho-${opt.value}`} className="font-normal cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.formState.errors.desempenho_pessoal && (
                  <p className="text-sm text-destructive mt-1">Selecione uma opção</p>
                )}
              </div>

              <div>
                <Label htmlFor="dificuldades">Dificuldades enfrentadas</Label>
                <Textarea
                  id="dificuldades"
                  {...form.register("dificuldades")}
                  placeholder="Descreva qualquer dificuldade..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Atividades Realizadas */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Atividades Realizadas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {atividades.map((atividade) => (
                  <div key={atividade} className="flex items-center space-x-2">
                    <Checkbox
                      id={`atividade-${atividade}`}
                      checked={selectedAtividades.includes(atividade)}
                      onCheckedChange={() => handleAtividadeToggle(atividade)}
                    />
                    <Label htmlFor={`atividade-${atividade}`} className="font-normal cursor-pointer text-sm">
                      {atividade}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Observações Finais</h2>
              
              <div>
                <Label htmlFor="observacoes_gerais">Observações gerais sobre o evento</Label>
                <Textarea
                  id="observacoes_gerais"
                  {...form.register("observacoes_gerais")}
                  placeholder="Comentários adicionais..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sugestoes_melhoria">Sugestões de melhoria</Label>
                <Textarea
                  id="sugestoes_melhoria"
                  {...form.register("sugestoes_melhoria")}
                  placeholder="O que poderia ser melhorado..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoadingEventos}
              className="w-full bg-[#FF731D] hover:bg-[#FF731D]/90"
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Avaliação
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          💛 Obrigado por fazer parte da equipe Vivalegria!
        </p>
      </div>
    </div>
  );
};

export default AvaliacaoEvento;
