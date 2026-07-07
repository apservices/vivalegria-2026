import { Link, useSearchParams } from "react-router-dom";
import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Mascote from "@/components/Mascote";
import { ShieldCheck, MessageCircle, CheckCircle2, Copy, Mail, FileText } from "lucide-react";
import { trackWhatsAppClick } from "@/utils/tracking";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "5511965982251";

const Obrigado = () => {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo") || "";
  const nome = searchParams.get("nome") || "";
  const tipo = searchParams.get("tipo") || "reserva";
  const isCadastro = tipo === "cadastro";

  const firstName = nome.split(" ")[0] || (isCadastro ? "Recreador" : "Cliente");

  const whatsappMessage = isCadastro
    ? "Olá! Acabei de enviar meu cadastro para trabalhar na Vivalegria."
    : codigo
    ? `Olá! Acabei de fazer minha reserva. Código: ${codigo}. Gostaria de confirmar os detalhes.`
    : "Olá, acabei de solicitar um orçamento!";

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("obrigado_page");
  };

  const handleCopyCode = () => {
    if (codigo) {
      navigator.clipboard.writeText(codigo);
      toast.success("Código copiado!");
    }
  };

  const headTitle = isCadastro
    ? "Cadastro Enviado | Vivalegria"
    : "Reserva Confirmada | Vivalegria";
  const headDesc = isCadastro
    ? "Seu cadastro foi enviado com sucesso! Nossa equipe vai avaliar seu perfil e entrar em contato pelo WhatsApp."
    : "Sua reserva foi registrada com sucesso! Entraremos em contato via WhatsApp para confirmar os detalhes do seu evento.";

  return (
    <>
      <HeadSEO
        title={headTitle}
        description={headDesc}
        canonical="/obrigado"
        noindex
      />
      <section className="min-h-screen flex items-center justify-center bg-gradient-subtle py-12 px-4">
        <div className="container mx-auto">
          <div className="relative max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-card p-6 md:p-12 text-center overflow-hidden">
            <Mascote
              pose="sucesso"
              animation="pulinho"
              className="w-40 md:w-56 lg:w-64 mx-auto mb-6"
            />

            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Título principal */}
              <h1 className="text-2xl md:text-4xl font-bold text-primary">
                {isCadastro
                  ? `${firstName}, seu cadastro foi enviado!`
                  : `${firstName}, sua reserva foi registrada!`}
              </h1>
              
              {/* Código do Evento */}
              {codigo && (
                <Card className="bg-viva-yellow/20 border-viva-yellow/40 p-4 md:p-6">
                  <p className="text-sm text-muted-foreground mb-2">Código da sua reserva:</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl md:text-3xl font-bold text-viva-orange tracking-wider">
                      {codigo}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyCode}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Guarde este código para acompanhar sua reserva
                  </p>
                </Card>
              )}

              {/* Confirmação */}
              <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 px-4 rounded-lg">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm md:text-base font-medium">
                  Reserva registrada com sucesso!
                </span>
              </div>

              {/* Próximos passos */}
              <div className="bg-muted/30 rounded-xl p-4 md:p-6 text-left space-y-3">
                <h3 className="font-semibold text-foreground text-center mb-4">Próximos Passos:</h3>
                <div className="flex items-start gap-3">
                  <div className="bg-viva-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <p className="text-sm text-muted-foreground">
                    <strong>WhatsApp:</strong> Nossa equipe entrará em contato para confirmar os detalhes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-viva-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Contrato:</strong> Após confirmação, enviaremos o contrato por e-mail.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-viva-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Pagamento:</strong> 50% na reserva, 50% até 7 dias antes do evento.
                  </p>
                </div>
              </div>

              {/* Seção de Segurança */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-semibold">Segurança Garantida</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Profissionais treinados • Protocolos de segurança rigorosos • Evento 100% seguro
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="rounded-full px-6 md:px-8 w-full sm:w-auto"
                >
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Falar no WhatsApp agora
                  </a>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-6 md:px-8 w-full sm:w-auto"
                >
                  <Link to="/">Voltar para Home</Link>
                </Button>
              </div>

              {/* Info adicional */}
              <p className="text-xs text-muted-foreground pt-4">
                Dúvidas? Entre em contato pelo WhatsApp{" "}
                <a href={whatsappLink} className="text-viva-orange hover:underline" target="_blank" rel="noopener noreferrer">
                  (11) 96598-2251
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Obrigado;
