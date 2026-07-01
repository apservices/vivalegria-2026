import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Users, ShieldCheck, Sparkles, Star, MessageCircle } from "lucide-react";
import { useLPTracking } from "@/hooks/useTracking";
import { trackWhatsAppClick } from "@/utils/tracking";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const WHATSAPP_NUMBER = "5511965982251";
const WHATSAPP_MESSAGE = "Olá, quero recreação infantil para evento corporativo!";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function EventosCorporativosInfantis() {
  useLPTracking('corporativo');
  const handleWhatsAppClick = () => {
    trackWhatsAppClick('landing_page');
  };

  // Estado para o formulário (adicionado para integração)
  const [formData, setFormData] = useState({
    empresa: '',
    colaboradores: '',
    data: '',
    descricao: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const customMessage = `Olá! Empresa: ${formData.empresa}, Número de colaboradores: ${formData.colaboradores}, Data: ${formData.data}, Descrição: ${formData.descricao}`;
    const customLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customMessage)}`;
    window.open(customLink, '_blank');
    // Aqui poderia integrar com Supabase para salvar lead
  };

  return (
    <>
      <HeadSEO
        title="Recreação Infantil para Eventos Corporativos | Vivalegria"
        description="Recreação infantil profissional para SIPAT, Family Day, datas comemorativas e eventos corporativos em São Paulo. Entretenimento seguro para filhos de colaboradores."
        canonical="/eventos-corporativos-infantis"
      />
      {/* Schema JSON-LD adicionado para SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Vivalegria Recreação Infantil",
          "url": "https://www.vivalegria.com.br",
          "logo": "https://www.vivalegria.com.br/logo.png",
          "description": "Recreação infantil premium para eventos corporativos em São Paulo, incluindo SIPAT e Family Day.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "São Paulo",
            "addressRegion": "SP",
            "addressCountry": "BR"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+55-11-96598-2251",
            "contactType": "customer service"
          }
        })}
      </script>
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
        {/* SEÇÃO TESTIMONIALS ADICIONADA */}
        <section className="py-16 md:py-20 px-4 bg-orange-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-12">
              O que nossos parceiros corporativos dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Star className="mx-auto h-8 w-8 text-orange-500 mb-4" />
                <p className="text-gray-600 mb-4">"A SIPAT ficou incrível com a recreação da Vivalegria! As crianças adoraram as oficinas."</p>
                <p className="font-semibold">- RH da Empresa X</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Star className="mx-auto h-8 w-8 text-orange-500 mb-4" />
                <p className="text-gray-600 mb-4">"Family Day perfeito. Colaboradores elogiaram a segurança e diversão para os filhos."</p>
                <p className="font-semibold">- Gerente Y, Corporativo Z</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Star className="mx-auto h-8 w-8 text-orange-500 mb-4" />
                <p className="text-gray-600 mb-4">"Recomendo para eventos corporativos. Equipe profissional e atividades engajadoras."</p>
                <p className="font-semibold">- Diretor W, Empresa V</p>
              </div>
            </div>
          </div>
        </section>
        {/* SEÇÃO GALERIA ADICIONADA */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-12">
              Veja nossos eventos corporativos em ação
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img src="/images/evento-corp1.jpg" alt="Evento SIPAT com crianças" className="rounded-xl" />
              <img src="/images/evento-corp2.jpg" alt="Family Day com oficinas" className="rounded-xl" />
              <img src="/images/evento-corp3.jpg" alt="Confraternização corporativa" className="rounded-xl" />
              <img src="/images/evento-corp4.jpg" alt="Recreação em empresa" className="rounded-xl" />
              {/* Adicione mais imagens conforme necessário */}
            </div>
          </div>
        </section>
        {/* SEÇÃO FORMULÁRIO ADICIONADO */}
        <section className="py-16 md:py-20 px-4 bg-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-12">
              Solicite um orçamento personalizado
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-xl mx-auto">
              <div className="text-left">
                <Label htmlFor="empresa">Nome da Empresa</Label>
                <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleInputChange} required />
              </div>
              <div className="text-left">
                <Label htmlFor="colaboradores">Número aproximado de colaboradores/filhos</Label>
                <Input id="colaboradores" name="colaboradores" type="number" value={formData.colaboradores} onChange={handleInputChange} required />
              </div>
              <div className="text-left">
                <Label htmlFor="data">Data aproximada do evento</Label>
                <Input id="data" name="data" type="date" value={formData.data} onChange={handleInputChange} required />
              </div>
              <div className="text-left">
                <Label htmlFor="descricao">Descrição do evento</Label>
                <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleInputChange} />
              </div>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                Enviar e falar no WhatsApp
              </Button>
            </form>
          </div>
        </section>
        {/* SEÇÃO FAQ ADICIONADA */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-12">
              Perguntas frequentes sobre eventos corporativos
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="font-semibold mb-2">Qual a duração típica?</h3>
                <p className="text-gray-600">De 2 a 4 horas, personalizável conforme o evento.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quantas crianças atendemos?</h3>
                <p className="text-gray-600">Até 100+ com equipe escalável, mantendo segurança 1:15.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Inclui materiais?</h3>
                <p className="text-gray-600">Sim, todos os itens para oficinas e brincadeiras.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Atendemos fora de SP?</h3>
                <p className="text-gray-600">Foco em SP e ABC, mas consulte para regiões próximas.</p>
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
