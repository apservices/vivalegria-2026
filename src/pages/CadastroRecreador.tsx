import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Star, 
  Shirt, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { maskPhone, maskCPF } from "@/utils/inputMasks";
import { trackFormSubmit } from "@/utils/tracking";

// Habilidades para avaliação (0-3)
const habilidadesLista = [
  { id: "recreacao_infantil", label: "Recreação infantil" },
  { id: "musicas_dancas", label: "Músicas e Danças (Performance)" },
  { id: "escultura_baloes", label: "Escultura com Balões" },
  { id: "pintura_tela", label: "Pintura Artística em Tela" },
  { id: "pintura_facial", label: "Pintura Facial" },
  { id: "oficina_micanga", label: "Oficina Miçanga" },
  { id: "oficina_slime", label: "Oficina Slime" },
  { id: "noite_pijama", label: "Noite Pijama (Cabana)" },
  { id: "oficina_cupcake", label: "Oficina Cupcake" },
  { id: "confeiteiros", label: "Confeiteiros (Culinária)" },
  { id: "baladinha_kids", label: "Baladinha Kids" },
  { id: "musicalizacao", label: "Musicalização" },
  { id: "area_baby", label: "Área Baby" },
  { id: "camarim_fashion", label: "Camarim Fashion" },
  { id: "jardinagem", label: "Jardinagem infantil" },
  { id: "malabarismo", label: "Malabarismo" },
  { id: "show_magicas", label: "Show de Mágicas" },
  { id: "artes_cenicas", label: "Artes Cênicas" },
];

const nivelHabilidade = [
  { value: "0", label: "0 - Não sei fazer" },
  { value: "1", label: "1 - Básico" },
  { value: "2", label: "2 - Intermediário" },
  { value: "3", label: "3 - Avançado" },
];

const tamanhos = ["P", "M", "G", "GG", "EXG"];

const experienciaTempo = [
  "Menos de 1 ano",
  "1 a 2 anos",
  "3 a 5 anos",
  "Mais de 5 anos"
];

const faixasEtarias = [
  "0 a 3 anos (bebês)",
  "4 a 6 anos",
  "7 a 10 anos",
  "Todas as idades"
];

const frequencias = [
  "1 a 2 eventos por mês",
  "3 a 4 eventos por mês",
  "5 ou mais eventos por mês",
  "Apenas esporadicamente"
];

const formacoes = [
  "Ensino Fundamental",
  "Ensino Médio",
  "Ensino Técnico",
  "Graduação",
  "Pós-graduação"
];

const transportes = [
  "Carro próprio",
  "Moto própria",
  "Transporte público",
  "Aplicativo (Uber/99)",
  "Outro"
];

const CadastroRecreador = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Etapa 1 - Identificação
    nome_completo: "",
    apelido: "",
    cpf: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    
    // Etapa 2 - Dados Profissionais
    transporte: "",
    pix_chave: "",
    pix_confirmacao: "",
    experiencia_tempo: "",
    faixa_etaria_experiencia: "",
    
    // Etapa 3 - Habilidades (JSONB)
    habilidades: {} as Record<string, string>,
    
    // Etapa 4 - Formação e Experiência
    formacao: "",
    cursos: "",
    por_que_recreacao: "",
    experiencia_sucesso: "",
    referencia_profissional: "",
    
    // Etapa 5 - Uniformes (JSONB)
    uniforme_calca: "",
    uniforme_camiseta: "",
    uniforme_macacao: "",
    
    // Etapa 6 - Disponibilidade
    tem_cnpj: false,
    frequencia_desejada: "",
    interesse_pacotes: false,
    quer_mais_oportunidades: "",
    interesses_curto_longo_prazo: "",
    aceita_regras: false,
  });

  const totalSteps = 6;

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "telefone") {
      setFormData(prev => ({ ...prev, [field]: maskPhone(value as string) }));
      return;
    }
    if (field === "cpf") {
      setFormData(prev => ({ ...prev, [field]: maskCPF(value as string) }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHabilidadeChange = (habilidadeId: string, nivel: string) => {
    setFormData(prev => ({
      ...prev,
      habilidades: {
        ...prev.habilidades,
        [habilidadeId]: nivel
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.nome_completo || !formData.apelido || !formData.cpf || 
            !formData.data_nascimento || !formData.telefone || !formData.email) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha todos os campos obrigatórios da identificação.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.transporte || !formData.pix_chave || !formData.experiencia_tempo) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha todos os campos profissionais obrigatórios.",
            variant: "destructive"
          });
          return false;
        }
        if (formData.pix_chave !== formData.pix_confirmacao) {
          toast({
            title: "Chave PIX não confere",
            description: "A confirmação da chave PIX deve ser igual.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        return true; // Habilidades são opcionais
      case 4:
        if (!formData.por_que_recreacao || !formData.experiencia_sucesso) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha os campos sobre sua motivação e experiência.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 5:
        if (!formData.uniforme_calca || !formData.uniforme_camiseta || !formData.uniforme_macacao) {
          toast({
            title: "Campos obrigatórios",
            description: "Informe todos os tamanhos de uniforme.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 6:
        if (!formData.frequencia_desejada || !formData.aceita_regras) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha a disponibilidade e aceite as regras.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("profissionais").insert({
        nome_completo: formData.nome_completo,
        apelido: formData.apelido,
        cpf: formData.cpf,
        data_nascimento: formData.data_nascimento,
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco,
        transporte: formData.transporte,
        pix_chave: formData.pix_chave,
        experiencia_tempo: formData.experiencia_tempo,
        faixa_etaria_experiencia: formData.faixa_etaria_experiencia,
        habilidades: formData.habilidades,
        formacao: formData.formacao,
        cursos: formData.cursos,
        por_que_recreacao: formData.por_que_recreacao,
        experiencia_sucesso: formData.experiencia_sucesso,
        referencia_profissional: formData.referencia_profissional,
        uniformes: {
          calca: formData.uniforme_calca,
          camiseta: formData.uniforme_camiseta,
          macacao: formData.uniforme_macacao
        },
        tem_cnpj: formData.tem_cnpj,
        frequencia_desejada: formData.frequencia_desejada,
        interesse_pacotes: formData.interesse_pacotes,
        quer_mais_oportunidades: formData.quer_mais_oportunidades,
        interesses_curto_longo_prazo: formData.interesses_curto_longo_prazo,
        status: "pendente"
      });

      if (error) throw error;

      trackFormSubmit('candidatura');

      toast({
        title: "Cadastro enviado com sucesso!",
        description: "Entraremos em contato em breve. Obrigado pelo interesse!"
      });

      navigate("/obrigado?tipo=cadastro");
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Erro ao enviar cadastro",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    { icon: User, title: "Identificação" },
    { icon: Briefcase, title: "Dados Profissionais" },
    { icon: Star, title: "Habilidades" },
    { icon: Mail, title: "Formação e Experiência" },
    { icon: Shirt, title: "Uniformes" },
    { icon: Calendar, title: "Disponibilidade" },
  ];

  return (
    <>
      <SEO
        title="Cadastro de Recreadores | Vivalegria"
        description="Cadastre-se como recreador na Vivalegria. Faça parte da nossa equipe de profissionais de recreação infantil em São Paulo."
        canonical="/cadastro-recreador"
      />

      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-[#FFD836]/10 via-white to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Cadastro de Recreadores
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Preencha o formulário completo para fazer parte da equipe Vivalegria.
              Todas as informações são importantes para montarmos sua ficha profissional.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {stepTitles.map((step, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center ${
                    index + 1 <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index + 1 < currentStep 
                      ? "bg-green-500 text-white" 
                      : index + 1 === currentStep 
                        ? "bg-primary text-white" 
                        : "bg-muted"
                  }`}>
                    {index + 1 < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-muted w-full rounded" />
              <div 
                className="absolute top-0 left-0 h-1 bg-primary rounded transition-all"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const StepIcon = stepTitles[currentStep - 1].icon;
                  return <StepIcon className="w-5 h-5" />;
                })()}
                Etapa {currentStep}: {stepTitles[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1 - Identificação */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome_completo">Nome Completo *</Label>
                      <Input
                        id="nome_completo"
                        value={formData.nome_completo}
                        onChange={(e) => handleInputChange("nome_completo", e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apelido">Apelido na Recreação *</Label>
                      <Input
                        id="apelido"
                        value={formData.apelido}
                        onChange={(e) => handleInputChange("apelido", e.target.value)}
                        placeholder="Ex: Tia Lua, Tio Sol"
                      />
                      <p className="text-xs text-muted-foreground">
                        Como você é conhecido(a) nas festas (Tio/Tia/Tx + nome artístico)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                      <Input
                        id="data_nascimento"
                        type="date"
                        value={formData.data_nascimento}
                        onChange={(e) => handleInputChange("data_nascimento", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone (WhatsApp) *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange("telefone", e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                      placeholder="Rua, número, bairro, cidade - UF, CEP"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 - Dados Profissionais */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Meio de Transporte *</Label>
                    <Select
                      value={formData.transporte}
                      onValueChange={(v) => handleInputChange("transporte", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {transportes.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pix_chave">Chave PIX para pagamento *</Label>
                      <Input
                        id="pix_chave"
                        value={formData.pix_chave}
                        onChange={(e) => handleInputChange("pix_chave", e.target.value)}
                        placeholder="CPF, e-mail, telefone ou chave aleatória"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pix_confirmacao">Confirme a Chave PIX *</Label>
                      <Input
                        id="pix_confirmacao"
                        value={formData.pix_confirmacao}
                        onChange={(e) => handleInputChange("pix_confirmacao", e.target.value)}
                        placeholder="Repita a chave PIX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Tempo de Experiência com Recreação *</Label>
                      <Select
                        value={formData.experiencia_tempo}
                        onValueChange={(v) => handleInputChange("experiencia_tempo", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienciaTempo.map(e => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Faixa Etária de Experiência</Label>
                      <Select
                        value={formData.faixa_etaria_experiencia}
                        onValueChange={(v) => handleInputChange("faixa_etaria_experiencia", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {faixasEtarias.map(f => (
                            <SelectItem key={f} value={f}>{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 - Habilidades */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Avalie seu nível em cada habilidade de 0 a 3. Seja honesto(a) - 
                    isso nos ajuda a alocar você nos eventos certos!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {habilidadesLista.map((hab) => (
                      <div key={hab.id} className="p-4 border rounded-lg">
                        <Label className="font-medium">{hab.label}</Label>
                        <Select
                          value={formData.habilidades[hab.id] || "0"}
                          onValueChange={(v) => handleHabilidadeChange(hab.id, v)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {nivelHabilidade.map(n => (
                              <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 - Formação e Experiência */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Formação Acadêmica</Label>
                      <Select
                        value={formData.formacao}
                        onValueChange={(v) => handleInputChange("formacao", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {formacoes.map(f => (
                            <SelectItem key={f} value={f}>{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cursos">Cursos e Especializações</Label>
                      <Input
                        id="cursos"
                        value={formData.cursos}
                        onChange={(e) => handleInputChange("cursos", e.target.value)}
                        placeholder="Ex: Pedagogia, Teatro, Primeiros Socorros"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="por_que_recreacao">
                      Por que você escolheu trabalhar com Recreação? *
                    </Label>
                    <Textarea
                      id="por_que_recreacao"
                      value={formData.por_que_recreacao}
                      onChange={(e) => handleInputChange("por_que_recreacao", e.target.value)}
                      placeholder="Conte o que te motivou a trabalhar com crianças e eventos..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experiencia_sucesso">
                      Descreva uma experiência de sucesso com recreação *
                    </Label>
                    <Textarea
                      id="experiencia_sucesso"
                      value={formData.experiencia_sucesso}
                      onChange={(e) => handleInputChange("experiencia_sucesso", e.target.value)}
                      placeholder="Conte sobre um evento ou situação onde você fez a diferença..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referencia_profissional">
                      Referência Profissional (Nome, Cargo e Telefone)
                    </Label>
                    <Input
                      id="referencia_profissional"
                      value={formData.referencia_profissional}
                      onChange={(e) => handleInputChange("referencia_profissional", e.target.value)}
                      placeholder="Ex: Maria Silva, Coordenadora, (11) 99999-9999"
                    />
                  </div>
                </div>
              )}

              {/* Step 5 - Uniformes */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Informe os tamanhos para confecção dos uniformes Vivalegria.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Calça/Bermuda *</Label>
                      <Select
                        value={formData.uniforme_calca}
                        onValueChange={(v) => handleInputChange("uniforme_calca", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          {tamanhos.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Camiseta *</Label>
                      <Select
                        value={formData.uniforme_camiseta}
                        onValueChange={(v) => handleInputChange("uniforme_camiseta", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          {tamanhos.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Macacão *</Label>
                      <Select
                        value={formData.uniforme_macacao}
                        onValueChange={(v) => handleInputChange("uniforme_macacao", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          {tamanhos.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 - Disponibilidade */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="tem_cnpj"
                      checked={formData.tem_cnpj}
                      onCheckedChange={(checked) => handleInputChange("tem_cnpj", checked as boolean)}
                    />
                    <Label htmlFor="tem_cnpj" className="cursor-pointer">
                      Possuo CNPJ (MEI ou outro)
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequência de eventos desejada *</Label>
                    <Select
                      value={formData.frequencia_desejada}
                      onValueChange={(v) => handleInputChange("frequencia_desejada", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencias.map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="interesse_pacotes"
                      checked={formData.interesse_pacotes}
                      onCheckedChange={(checked) => handleInputChange("interesse_pacotes", checked as boolean)}
                    />
                    <Label htmlFor="interesse_pacotes" className="cursor-pointer">
                      Tenho interesse em pacotes mensais fixos
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quer_mais_oportunidades">
                      Você quer mais oportunidades?
                    </Label>
                    <Textarea
                      id="quer_mais_oportunidades"
                      value={formData.quer_mais_oportunidades}
                      onChange={(e) => handleInputChange("quer_mais_oportunidades", e.target.value)}
                      placeholder="Conte sobre sua disponibilidade e expectativas..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interesses_curto_longo_prazo">
                      Interesses a curto e longo prazo
                    </Label>
                    <Textarea
                      id="interesses_curto_longo_prazo"
                      value={formData.interesses_curto_longo_prazo}
                      onChange={(e) => handleInputChange("interesses_curto_longo_prazo", e.target.value)}
                      placeholder="O que você espera da sua carreira na recreação?"
                      rows={3}
                    />
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="aceita_regras"
                        checked={formData.aceita_regras}
                        onCheckedChange={(checked) => handleInputChange("aceita_regras", checked as boolean)}
                      />
                      <Label htmlFor="aceita_regras" className="cursor-pointer text-sm">
                        Li e aceito as regras gerais da Vivalegria, incluindo: pontualidade nos eventos,
                        uso correto do uniforme, respeito com crianças e famílias, e compromisso com
                        a qualidade do serviço. *
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Cadastro
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CadastroRecreador;