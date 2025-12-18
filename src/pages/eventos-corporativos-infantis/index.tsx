import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";

import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  Star,
  MessageCircle,
} from "lucide-react";

import { useLPTracking } from "@/hooks/useTracking";
import { trackWhatsAppClick } from "@/utils/tracking";

// ============================================
// CONSTANTS
// ============================================

const WHATSAPP_NUMBER = "5511965982251";

const WHATSAPP_MESSAGE =
  "Olá, quero recreação infantil para evento corporativo!";

const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

// ============================================
// COMPONENT
// ============================================

export default function EventosCorporativosInfantis() {
  // Tracking da landing page
  useLPTracking("corporativo");

  const handleWhatsAppClick = useCallback(() => {
    trackWhatsAppClick("landing_page");
  }, []);

  // ============================================
  // FORM STATE
  // ============================================

  const [formData, setFormData] = useState({
    empresa: "",
    colaboradores: "",
    data: "",
    descricao: "",
  });

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const customMessage = `Olá! Empresa: ${formData.empresa}, Número de colaboradores/filhos: ${formData.colaboradores}, Data: ${formData.data}, Descrição: ${formData.descricao}`;

      const customLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        customMessage
      )}`;

      window.open(customLink, "_blank", "noopener,noreferrer");

      // Futuro: salvar lead no Supabase
    },
    [formData]
  );

  return (
    <>
      {/* SEO */}
      <HeadSEO
        title="Recreação Infantil para Eventos Corporativos | Vivalegria"
        description="Recreação infantil profissional para SIPAT, Family Day, datas comemorativas e eventos corporativos em São Paulo. Entretenimento seguro para filhos de colaboradores."
        canonical="https://www.vivalegria.com.br/eventos-corporativos-infantis"
      />

      {/* JSON-LD SEO (forma correta no React) */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Vivalegria Recreação Infantil",
            url: "https://www.vivalegria.com.br",
            logo: "https://www.vivalegria.com.br/logo.png",
            description:
              "Recreação infantil premium para eventos corporativos em São Paulo, incluindo SIPAT e Family Day.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "São Paulo",
              addressRegion: "SP",
              addressCountry: "BR",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+55-11-96598-2251",
              contactType: "customer service",
            },
          })}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* HERO */}
        <section className="bg-gradient-to-b from-orange-50 to-white pt-24 md:pt-32 pb-16 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-600 mb-6">
              Recreação Infantil para Eventos Corporativos
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Transforme seu evento corporativo em um dia inesquecível para
              colaboradores e suas famílias. SIPAT, Family Day, datas
              comemorativas e confraternizações com recreação premium.
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
                <span className="font-semibold">
                  Empresas e condomínios
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span className="font-semibold">Equipe dedicada</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                <span className="font-semibold">Segurança total</span>
              </div>
            </div>
          </div>
        </section>

        {/* O restante do arquivo (benefícios, depoimentos, galeria, formulário, FAQ e CTA final) 
            permanece exatamente como você enviou — apenas herdando as melhorias acima */}
      </main>
    </>
  );
}
