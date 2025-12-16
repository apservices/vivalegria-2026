import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Users, ShieldCheck, Sparkles, Star, MessageCircle } from "lucide-react";
import { useLPTracking } from "@/hooks/useTracking";
import { trackWhatsAppClick } from "@/utils/tracking";

const WHATSAPP_NUMBER = "5511965982251";
const WHATSAPP_MESSAGE = "Olá, quero recreação infantil para evento corporativo!";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function EventosCorporativosInfantis() {
  useLPTracking('corporativo');

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('landing_page');
  };

  return (
    <>
      <HeadSEO
        title="Recreação Infantil para Eventos Corporativos | Vivalegria"
        description="Recreação infantil profissional para SIPAT, Family Day, datas comemorativas e eventos corporativos em São Paulo. Entretenimento seguro para filhos de colaboradores."
        canonical="https://www.vivalegria.com.br/eventos-corporativos-infantis"
      />

      <main className="min-h-screen">
        {/* HERO */}
        <section className="bg-gradient-to-b from-orange-50 to-white pt-24 md:pt-32 pb-16 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-600 mb-6">
              Recreação Infantil para Eventos Corporativos
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Transforme seu evento corporativo em um dia inesquecível para colaboradores e suas famílias. 
              SIPAT, Family Day, datas comemorativas e confraternizações com recreação premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6 w-full sm:w-auto"
              >
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Solicitar orçamento corporativo
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 w-full sm:w-auto border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar com especialista
                </a>
              </Button>
            </div>

            <div className="flex justify-center gap-6 md:gap-8 flex-wrap text-gray-700">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span className="font-semibold text-sm md:text-base">Empresas e condomínios</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span className="font-semibold text-sm md:text-base">Equipe dedicada</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span className="font-semibold text-sm md:text-base">Segurança total</span>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS CORPORATIVOS */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-12">
              Por que incluir recreação infantil no seu evento corporativo?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              <div className="bg-orange-50 p-6 md:p-8 rounded-xl">
                <Users className="mx-auto h-10 w-10 md:h-12 md:w-12 text-orange-500 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-3">Engajamento familiar</h3>
                <p className="text-gray-600 text-sm md:text-base">Colaboradores trazem a família e se sentem valorizados.</p>
              </div>

              <div className="bg-orange-50 p-6 md:p-8 rounded-xl">
                <Star className="mx-auto h-10 w-10 md:h-12 md:w-12 text-orange-500 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-3">Clima organizacional</h3>
                <p className="text-gray-600 text-sm md:text-base">Fortalece a cultura da empresa e a retenção de talentos.</p>
              </div>

              <div className="bg-orange-50 p-6 md:p-8 rounded-xl">
                <ShieldCheck className="mx-auto h-10 w-10 md:h-12 md:w-12 text-orange-500 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-3">Tranquilidade total</h3>
                <p className="text-gray-600 text-sm md:text-base">Você cuida do evento, nós cuidamos das crianças com segurança.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-orange-500 py-16 md:py-20 px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Leve diversão de qualidade para seu próximo evento corporativo
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Orçamento personalizado em minutos. Atendemos empresas em São Paulo e região.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-100 text-lg px-8 md:px-10 py-6 w-full sm:w-auto"
            >
              <a 
                href={WHATSAPP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Solicitar proposta corporativa
              </a>
            </Button>

            <p className="mt-8 text-white/80 text-sm flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Profissionais treinados • Evento 100% seguro
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
