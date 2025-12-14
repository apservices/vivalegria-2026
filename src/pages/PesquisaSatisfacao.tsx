import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Send, AlertCircle, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const pesquisaSchema = z.object({
  satisfacao_geral: z.string().min(1, "Selecione sua satisfação geral"),
  nps: z.string().min(1, "Selecione uma nota"),
  pontualidade: z.string().min(1, "Avalie a pontualidade"),
  profissionalismo: z.string().min(1, "Avalie o profissionalismo"),
  criatividade: z.string().min(1, "Avalie a criatividade"),
  interacao_criancas: z.string().min(1, "Avalie a interação"),
  pontos_positivos: z.array(z.string()).optional(),
  pontos_melhorar: z.string().optional(),
  comentarios: z.string().optional(),
  autorizacao_depoimento: z.boolean().optional(),
});

type PesquisaFormData = z.infer<typeof pesquisaSchema>;

const satisfacaoOptions = [
  { value: "muito_satisfeito", label: "Muito Satisfeito", emoji: "😍" },
  { value: "satisfeito", label: "Satisfeito", emoji: "😊" },
  { value: "neutro", label: "Neutro", emoji: "😐" },
  { value: "insatisfeito", label: "Insatisfeito", emoji: "😕" },
  { value: "muito_insatisfeito", label: "Muito Insatisfeito", emoji: "😞" },
];

const avaliacaoOptions = [
  { value: "excelente", label: "Excelente" },
  { value: "muito_bom", label: "Muito Bom" },
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" },
  { value: "ruim", label: "Ruim" },
];

const pontosPositivos = [
  "Pontualidade",
  "Simpatia da equipe",
  "Diversão das crianças",
  "Organização",
  "Criatividade das atividades",
  "Atenção aos detalhes",
  "Comunicação prévia",
  "Limpeza após o evento",
];

const PesquisaSatisfacao = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  const form = useForm<PesquisaFormData>({
    resolver: zodResolver(pesquisaSchema),
    defaultValues: {
      satisfacao_geral: "",
      nps: "",
      pontualidade: "",
      profissionalismo: "",
      criatividade: "",
      interacao_criancas: "",
      pontos_positivos: [],
      pontos_melhorar: "",
      comentarios: "",
      autorizacao_depoimento: false,
    },
  });

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      setErrorMessage("Link inválido. É necessário um token de acesso.");
      return;
    }
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const { data, error } = await supabase.rpc("validate_pesquisa_token", {
        p_token: token,
      });

      if (error) throw error;

      const result = data as { valid: boolean; error?: string; cliente_nome?: string; data_evento?: string };

      if (!result.valid) {
        setErrorMessage(result.error || "Token inválido");
        setIsValid(false);
      } else {
        setIsValid(true);
        setClienteNome(result.cliente_nome || "");
        setDataEvento(result.data_evento || "");
      }
    } catch (error: any) {
      console.error("Error validating token:", error);
      setErrorMessage("Erro ao validar link. Tente novamente.");
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: PesquisaFormData) => {
    if (!token) return;
    
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.rpc("submit_pesquisa_satisfacao", {
        p_token: token,
        p_respostas: data,
      });

      if (error) throw error;

      const response = result as { success: boolean; error?: string };

      if (!response.success) {
        throw new Error(response.error || "Erro ao enviar pesquisa");
      }

      setIsSuccess(true);
      toast({
        title: "Obrigado!",
        description: "Sua avaliação foi enviada com sucesso.",
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

  const selectedPontos = form.watch("pontos_positivos") || [];

  const handlePontoToggle = (ponto: string) => {
    const current = selectedPontos;
    const updated = current.includes(ponto)
      ? current.filter((p) => p !== ponto)
      : [...current, ponto];
    form.setValue("pontos_positivos", updated);
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Pesquisa de Satisfação | Vivalegria" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF731D] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validando acesso...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Link Inválido | Vivalegria" />
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Link Inválido</h1>
          <p className="text-muted-foreground mb-6">{errorMessage}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white flex items-center justify-center p-4">
        <SEO title="Obrigado! | Vivalegria" />
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Obrigado!</h1>
          <p className="text-muted-foreground mb-6">
            Sua avaliação é muito importante para continuarmos melhorando nossos serviços.
            Obrigado por fazer parte da família Vivalegria! 💛
          </p>
          <Button onClick={() => navigate("/")} className="bg-[#FF731D] hover:bg-[#FF731D]/90">
            Conhecer Mais
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E6] to-white py-8 px-4">
      <SEO title="Pesquisa de Satisfação | Vivalegria" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-[#FF731D] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Pesquisa de Satisfação</h1>
          <p className="text-muted-foreground mt-2">
            Sua opinião é muito importante para nós!
          </p>
          {clienteNome && (
            <p className="text-sm text-muted-foreground mt-1">
              Olá, {clienteNome}! {dataEvento && `Evento em ${new Date(dataEvento).toLocaleDateString("pt-BR")}`}
            </p>
          )}
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Satisfação Geral */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Satisfação Geral</h2>
              
              <div>
                <Label>Como você avalia sua experiência geral? *</Label>
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {satisfacaoOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => form.setValue("satisfacao_geral", opt.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.watch("satisfacao_geral") === opt.value
                          ? "border-[#FF731D] bg-[#FF731D]/10"
                          : "border-border hover:border-[#FF731D]/50"
                      }`}
                    >
                      <span className="text-2xl block">{opt.emoji}</span>
                      <span className="text-xs text-muted-foreground">{opt.label}</span>
                    </button>
                  ))}
                </div>
                {form.formState.errors.satisfacao_geral && (
                  <p className="text-sm text-destructive mt-1">Selecione uma opção</p>
                )}
              </div>
            </div>

            {/* NPS */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Recomendação</h2>
              
              <div>
                <Label>De 0 a 10, qual a probabilidade de nos recomendar a amigos e familiares? *</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[...Array(11)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => form.setValue("nps", i.toString())}
                      className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                        form.watch("nps") === i.toString()
                          ? "border-[#FF731D] bg-[#FF731D] text-white"
                          : "border-border hover:border-[#FF731D]/50"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Pouco provável</span>
                  <span>Muito provável</span>
                </div>
                {form.formState.errors.nps && (
                  <p className="text-sm text-destructive mt-1">Selecione uma nota</p>
                )}
              </div>
            </div>

            {/* Avaliação detalhada */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Avaliação Detalhada</h2>
              
              {[
                { name: "pontualidade", label: "Pontualidade" },
                { name: "profissionalismo", label: "Profissionalismo da equipe" },
                { name: "criatividade", label: "Criatividade das atividades" },
                { name: "interacao_criancas", label: "Interação com as crianças" },
              ].map((field) => (
                <div key={field.name}>
                  <Label>{field.label} *</Label>
                  <RadioGroup
                    value={form.watch(field.name as any)}
                    onValueChange={(value) => form.setValue(field.name as any, value)}
                    className="flex flex-wrap gap-3 mt-2"
                  >
                    {avaliacaoOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                        <Label htmlFor={`${field.name}-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {form.formState.errors[field.name as keyof PesquisaFormData] && (
                    <p className="text-sm text-destructive mt-1">Avalie este item</p>
                  )}
                </div>
              ))}
            </div>

            {/* Pontos Positivos */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Pontos Positivos</h2>
              <Label>O que você mais gostou? (selecione quantos quiser)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {pontosPositivos.map((ponto) => (
                  <div key={ponto} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ponto-${ponto}`}
                      checked={selectedPontos.includes(ponto)}
                      onCheckedChange={() => handlePontoToggle(ponto)}
                    />
                    <Label htmlFor={`ponto-${ponto}`} className="font-normal cursor-pointer text-sm">
                      {ponto}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback aberto */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Feedback Adicional</h2>
              
              <div>
                <Label htmlFor="pontos_melhorar">O que podemos melhorar?</Label>
                <Textarea
                  id="pontos_melhorar"
                  {...form.register("pontos_melhorar")}
                  placeholder="Conte-nos como podemos melhorar..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="comentarios">Comentários ou sugestões adicionais</Label>
                <Textarea
                  id="comentarios"
                  {...form.register("comentarios")}
                  placeholder="Compartilhe sua experiência..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Autorização de depoimento */}
            <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="autorizacao_depoimento"
                checked={form.watch("autorizacao_depoimento")}
                onCheckedChange={(checked) => form.setValue("autorizacao_depoimento", !!checked)}
              />
              <div>
                <Label htmlFor="autorizacao_depoimento" className="cursor-pointer">
                  Autorizo o uso do meu depoimento
                </Label>
                <p className="text-sm text-muted-foreground">
                  Podemos usar seu feedback em nosso site e materiais de divulgação?
                </p>
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          💛 Obrigado por escolher a Vivalegria!
        </p>
      </div>
    </div>
  );
};

export default PesquisaSatisfacao;
