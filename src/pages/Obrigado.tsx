import { Link } from "react-router-dom";
import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import Mascote from "@/components/Mascote";
import { ShieldCheck, MessageCircle, CheckCircle2 } from "lucide-react";
import { trackWhatsAppClick, type WhatsAppSource } from "@/utils/tracking";

const WHATSAPP_NUMBER = "5511965982251";
const WHATSAPP_MESSAGE = "Olá, acabei de solicitar um orçamento!";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const Obrigado = () => {
  const handleWhatsAppClick = () => {
    trackWhatsAppClick('obrigado_page');
  };

  return (
    <>
      <HeadSEO
        title="Obrigado | Vivalegria"
        description="Obrigado por escolher a Vivalegria! Entraremos em contato via WhatsApp para confirmar os detalhes do seu evento."
        canonical="https://www.vivalegria.com.br/obrigado"
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
                Obrigado por escolher a Vivalegria!
              </h1>
              
              {/* Confirmação */}
              <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 px-4 rounded-lg">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm md:text-base font-medium">
                  Sua solicitação foi registrada com sucesso!
                </span>
              </div>

              <p className="text-muted-foreground text-base md:text-lg">
                Nosso time entrará em contato via WhatsApp em breve para confirmar todos os detalhes do seu evento.
              </p>

              {/* Seção de Segurança */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6 mt-6">
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
                    href={WHATSAPP_LINK}
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Obrigado;
