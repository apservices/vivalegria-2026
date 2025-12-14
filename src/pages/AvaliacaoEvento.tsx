import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Send, Lock, CheckCircle } from "lucide-react";
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

const PASSWORD_GATE = "Viva@2026";

const avaliacaoSchema = z.object({
  profissional_nome: z.string().min(2, "Nome é obrigatório"),
  reserva_id: z.string().optional(),
  // Avaliação do Evento
  pontualidade_equipe: z.string().min(1, "Selecione uma opção"),
  organizacao_materiais: z.string().min(1, "Selecione uma opção"),
  engajamento_criancas: z.string().min(1, "Selecione uma opção"),
  comportamento_pais: z.string().min(1, "Selecione uma opção"),
  // Avaliação do Local
  espaco_adequado: z.string().min(1, "Selecione uma opção"),
  condicoes_seguranca: z.string().min(1, "Selecione uma opção"),
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
  "Outras",
];

const AvaliacaoEvento = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);

  const token = searchParams.get("token");

  const form = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      profissional_nome: "",
      reserva_id: "",
      pontualidade_equipe: "",
      organizacao_materiais: "",
      engajamento_criancas: "",
      comportamento_pais: "",
      espaco_adequado: "",
      condicoes_seguranca: "",
      desempenho_pessoal: "",
      dificuldades: "",
      atividades_realizadas: [],
      observacoes_gerais: "",
      sugestoes_melhoria: "",
    },
  });

  useEffect(() => {
    // Se é admin logado, já está autenticado
    if (!authLoading && user && isAdmin) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, [authLoading, user, isAdmin]);

  const fetchData = async () => {
    try {
      const [reservasRes, profissionaisRes] = await Promise.all([
        supabase.from("reservas").select("id, nome_completo, data_evento").order("data_evento", { ascending: false }).limit(50),
        supabase.from("profissionais").select("id, nome_completo, apelido").order("nome_completo").limit(100),
      ]);
      setReservas(reservasRes.data || []);
      setProfissionais(profissionaisRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD_GATE) {
      setIsAuthenticated(true);
      if (user && isAdmin) {
        fetchData();
      }
      toast({
        title: "Acesso liberado",
        description: "Você pode preencher a avaliação.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true);
    try {
      const { profissional_nome, reserva_id, ...respostas } = data;
      
      const insertData: any = {
        profissional_nome,
        respostas,
      };
      
      if (reserva_id) {
        insertData.reserva_id = reserva_id;
      }

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

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Avaliação Enviada | Vivalegria" />
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Avaliação Enviada!</h1>
          <p className="text-muted-foreground mb-6">
            Obrigado por compartilhar seu feedback. Suas informações são muito importantes para nós.
          </p>
          <Button onClick={() => navigate("/")} className="bg-[#FF731D] hover:bg-[#FF731D]/90">
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Avaliação do Evento | Vivalegria" />
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-[#FF731D] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Área Restrita</h1>
            <p className="text-muted-foreground mt-2">
              Digite a senha para acessar o formulário de avaliação.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Senha de Acesso</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-[#FF731D] hover:bg-[#FF731D]/90">
              Acessar
            </Button>
          </form>
          {!authLoading && !user && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Ou{" "}
              <button
                onClick={() => navigate("/admin/login")}
                className="text-[#FF731D] hover:underline"
              >
                faça login como admin
              </button>
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white py-8 px-4">
      <SEO title="Avaliação do Evento | Vivalegria" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Star className="w-12 h-12 text-[#FFD836] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Avaliação do Evento</h1>
          <p className="text-muted-foreground mt-2">
            Preencha a avaliação após cada evento realizado
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Identificação */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Identificação</h2>
              
              <div>
                <Label htmlFor="profissional_nome">Seu Nome *</Label>
                <Input
                  id="profissional_nome"
                  {...form.register("profissional_nome")}
                  placeholder="Nome completo ou apelido"
                  className="mt-1"
                />
                {form.formState.errors.profissional_nome && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.profissional_nome.message}
                  </p>
                )}
              </div>

              {reservas.length > 0 && (
                <div>
                  <Label>Evento (opcional)</Label>
                  <Select
                    value={form.watch("reserva_id")}
                    onValueChange={(value) => form.setValue("reserva_id", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservas.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.nome_completo} - {new Date(r.data_evento).toLocaleDateString("pt-BR")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              disabled={isSubmitting}
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
      </div>
    </div>
  );
};

export default AvaliacaoEvento;
