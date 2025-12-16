import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Heart, 
  Users, 
  MapPin, 
  MessageCircle, 
  Sparkles,
  Star,
  CheckCircle2
} from "lucide-react";
import { useLPTracking } from "@/hooks/useTracking";
import { trackWhatsAppClick } from "@/utils/tracking";

const WHATSAPP_NUMBER = "5511965982251";
const WHATSAPP_MESSAGE = "Olá, quero recreação infantil em SP!";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const bairros = [
  "Vila Mariana", "Moema", "Santo Amaro", "Morumbi", 
  "Pinheiros", "Jardins", "Itaim Bibi", "ABC Paulista"
];

const beneficios = [
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Equipe treinada com protocolos rigorosos de segurança. Tranquilidade para os pais, diversão para as crianças."
  },
  {
    icon: Heart,
    title: "Diversão Garantida",
    description: "Atividades lúdicas, brincadeiras clássicas e oficinas criativas que encantam crianças de todas as idades."
  },
  {
    icon: Users,
    title: "Equipe Profissional",
    description: "+300 recreadores cadastrados, todos capacitados e apaixonados por entretenimento infantil."
  }
];

const diferenciais = [
  "Recreadores uniformizados e identificados",
  "Materiais de primeira qualidade",
  "Planejamento personalizado por evento",
  "Atendimento em toda Grande SP",
  "Nota fiscal e contrato digital",
  "Suporte via WhatsApp em tempo real"
];

export default function RecreacaoInfantilSP() {
  useLPTracking('recreacao-infantil-sp');

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('landing_page');
  };

  return (
    <>
      <HeadSEO
        title="Recreação Infantil em São Paulo | Profissionais para Festas"
        description="Recreação infantil profissional em São Paulo. Vila Mariana, Moema, Morumbi e toda região. Pacotes a partir de R$590. Fale com a Vivalegria."
        canonical="https://www.vivalegria.com.br/recreacao-infantil-sp"
      />

      <main className="min-h-screen">
        {/* HERO */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-24 md:pt-32 pb-16 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Atendemos toda São Paulo e região</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Recreação Infantil em <span className="text-primary">São Paulo</span> que Faz a Diferença
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Transforme festas e eventos em momentos mágicos! Equipe profissional especializada 
              em entreter crianças com segurança e muita alegria.
            </p>

            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
              Atendemos {bairros.slice(0, 4).join(", ")} e toda região metropolitana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                <Link to="/contratar">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Simular minha festa
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">4.9/5 avaliações</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">+300 profissionais</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">100% seguro</span>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="py-16 md:py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Por que escolher a Vivalegria?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Somos referência em recreação infantil em São Paulo há mais de 10 anos
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {beneficios.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BAIRROS ATENDIDOS */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recreação Infantil em Toda São Paulo
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nossa equipe atende festas e eventos em diversos bairros e cidades da região metropolitana
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {bairros.map((bairro) => (
                <span 
                  key={bairro}
                  className="bg-background border border-border px-4 py-2 rounded-full text-sm font-medium text-foreground"
                >
                  <MapPin className="inline h-4 w-4 mr-1 text-primary" />
                  {bairro}
                </span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              E muito mais! Consulte disponibilidade para sua região.
            </p>
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="py-16 md:py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              O que você recebe com a Vivalegria
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {diferenciais.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-primary py-16 md:py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Pronto para transformar seu evento?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Entre em contato agora e receba um orçamento personalizado em minutos. 
              Atendimento rápido via WhatsApp!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-6 w-full sm:w-auto"
              >
                <Link to="/contratar">
                  Simular minha festa
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6 w-full sm:w-auto"
              >
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>

            <p className="mt-8 text-primary-foreground/80 text-sm flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Profissionais treinados • Evento 100% seguro
            </p>
          </div>
        </section>
      </main>
    </>
  );
}