import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateCPF, validateCNPJ, validateEmail, unmask } from "@/utils/inputMasks";
import { ContratacaoFormData } from "./types";
import { StepIdentificacao } from "./StepIdentificacao";
import { StepDadosContratante } from "./StepDadosContratante";
import { StepDadosEvento } from "./StepDadosEvento";
import { ProgressIndicator } from "./ProgressIndicator";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";

const STEP_LABELS = ["Identificação", "Dados Pessoais", "Dados do Evento"];

const initialFormData: ContratacaoFormData = {
  tipoCliente: "novo",
  tipoCadastro: "pf",
  cpfCnpj: "",
  nomeCompleto: "",
  telefone: "",
  email: "",
  emailConfirmacao: "",
  cep: "",
  endereco: "",
  complemento: "",
  cidade: "",
  dataEvento: "",
  horaInicio: "",
  localEvento: "",
};

export const ContratacaoForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContratacaoFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContratacaoFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Âncora: garante que a tela fique sempre no formulário (não volta pro topo da Home)
  const formTopRef = useRef<HTMLDivElement | null>(null);

  // ✅ Evita scroll "desnecessário" quando resetamos após submit
  const skipNextScrollRef = useRef(false);

  useLayoutEffect(() => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }

    const el = formTopRef.current;
    if (!el) return;

    // Header fixo e variável: calcula altura real
    const headerEl = document.querySelector("header");
    const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;

    // margem extra (respiro)
    const offset = headerH + 16;

    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [currentStep]);

  const {
    packageType,
    numChildren,
    selectedWorkshops,
    selectedExtras,
    calculateTotal,
  } = useConfigurator();

  const updateFormData = (data: Partial<ContratacaoFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));

    const updatedKeys = Object.keys(data) as (keyof ContratacaoFormData)[];
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof ContratacaoFormData, string>> = {};

    if (!formData.cpfCnpj) {
      newErrors.cpfCnpj =
        formData.tipoCadastro === "pf"
          ? "CPF é obrigatório"
          : "CNPJ é obrigatório";
    } else if (formData.tipoCadastro === "pf" && !validateCPF(formData.cpfCnpj)) {
      newErrors.cpfCnpj = "CPF inválido";
    } else if (formData.tipoCadastro === "pj" && !validateCNPJ(formData.cpfCnpj)) {
      newErrors.cpfCnpj = "CNPJ inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof ContratacaoFormData, string>> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!formData.telefone || unmask(formData.telefone).length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.emailConfirmacao) {
      newErrors.emailConfirmacao = "Confirmação de e-mail é obrigatória";
    } else if (formData.email !== formData.emailConfirmacao) {
      newErrors.emailConfirmacao = "Os e-mails não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<keyof ContratacaoFormData, string>> = {};

    if (!formData.dataEvento) newErrors.dataEvento = "Data do evento é obrigatória";
    if (!formData.horaInicio) newErrors.horaInicio = "Hora de início é obrigatória";
    if (!formData.localEvento.trim()) newErrors.localEvento = "Local do evento é obrigatório";

    if (!packageType) {
      toast.error("Selecione um pacote antes de continuar");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      // ✅ sem window.scrollTo aqui — o useLayoutEffect cuida
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // ✅ sem window.scrollTo aqui — o useLayoutEffect cuida
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);

    try {
      const total = calculateTotal();

      const reservaData = {
        tipo_cliente: formData.tipoCliente,
        tipo_cadastro: formData.tipoCadastro,
        cpf_cnpj: unmask(formData.cpfCnpj),
        nome_completo: formData.nomeCompleto.trim(),
        telefone: unmask(formData.telefone),
        email: formData.email.trim().toLowerCase(),
        cep: formData.cep ? unmask(formData.cep) : null,
        endereco: formData.endereco || null,
        complemento: formData.complemento || null,
        cidade: formData.cidade || null,
        data_evento: formData.dataEvento,
        hora_inicio: formData.horaInicio,
        local_evento: formData.localEvento.trim(),
        pacote_tipo: packageType ?? "classic",
        numero_criancas: numChildren,
        oficinas_selecionadas: selectedWorkshops,
        extras_selecionados: selectedExtras,
        total_calculado: total,
      };

      const { error } = await supabase.from("reservas").insert(reservaData);
      if (error) throw error;

      toast.success("Reserva enviada com sucesso! Entraremos em contato em breve.");

      setFormData(initialFormData);

      // ✅ Reset sem “forçar” scroll (se quiser que role, remova essas 2 linhas)
      skipNextScrollRef.current = true;
      setCurrentStep(1);
    } catch (error) {
      console.error("Erro ao enviar reserva:", error);
      toast.error("Erro ao enviar reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-viva-yellow/20">
      <CardContent className="p-6 md:p-8">
        {/* ✅ âncora do topo do formulário */}
        <div ref={formTopRef} className="h-1" />

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={3}
          stepLabels={STEP_LABELS}
        />

        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <StepIdentificacao
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepDadosContratante
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <StepDadosEvento
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="gap-2 bg-viva-orange hover:bg-viva-orange/90"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-viva-orange hover:bg-viva-orange/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Reserva
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
