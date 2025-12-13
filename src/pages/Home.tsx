import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import VideoHero from "@/components/VideoHero";
// New sections
import HowItWorks from "@/components/home/HowItWorks";
import ForWho from "@/components/home/ForWho";
import SecuritySection from "@/components/home/SecuritySection";
import PriceCalculator from "@/components/home/PriceCalculator";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import BlogPreview from "@/components/home/BlogPreview";
import MapSection from "@/components/home/MapSection";
// Assets
import vivaSlime from "@/assets/viva-slime.png";
import vivaRecreacao from "@/assets/viva-recreacao.png";
import vivaPintura from "@/assets/viva-pintura.png";
import vivaEquipe from "@/assets/viva-equipe.png";

const Home = () => {
  const values = [
    {
      title: "Segurança e Profissionalismo",
      description: "Monitores treinados e certificados com equipamentos premium",
      image: vivaEquipe,
    },
    {
      title: "Mais de 300 profissionais cadastrados",
      description: "Equipe experiente e apaixonada pelo que faz",
      image: vivaRecreacao,
    },
    {
      title: "Oficinas Criativas",
      description: "Slime, pintura, miçangas e muito mais",
      image: vivaSlime,
    },
    {
      title: "Experiências Únicas",
      description: "Transformamos brincadeiras em memórias eternas",
      image: vivaPintura,
    },
  ];

  const faqs = [
    {
      question: "Quanto custa o Pacote Select para 25 crianças em SP?",
      answer: "O Pacote SELECT para 25 crianças custa R$ 1.119,90, incluindo 4 horas de recreação com 2 recreadores profissionais, pintura facial básica, caça ao tesouro personalizada, escultura de balão, tatuagem infantil e muito mais!",
    },
    {
      question: "Vocês atendem em toda São Paulo e região?",
      answer: "Sim! Atendemos toda a Grande São Paulo incluindo Vila Mariana, Moema, Brooklin, Tatuapé, Zona Sul, Zona Oeste, ABC Paulista (Santo André, São Bernardo, São Caetano) e região metropolitana.",
    },
    {
      question: "Qual a antecedência mínima para contratar?",
      answer: "Recomendamos agendar com pelo menos 15 dias de antecedência para garantir disponibilidade na data desejada. Para eventos em alta temporada (dezembro e janeiro), sugerimos 30 dias.",
    },
    {
      question: "Vocês levam equipamentos e materiais?",
      answer: "Sim! Levamos todos os equipamentos, materiais para oficinas, kit de segurança e higiene. Você só precisa providenciar o espaço.",
    },
    {
      question: "Quantas crianças cada monitor atende?",
      answer: "Mantemos a proporção de 1 monitor para cada 15 crianças para garantir segurança e atenção individualizada.",
    },
    {
      question: "Posso personalizar o tema do evento?",
      answer: "Com certeza! Trabalhamos com temas personalizados e adaptamos as brincadeiras de acordo com a idade e preferências das crianças.",
    },
    {
      question: "Qual a diferença entre Pacote Select e Clássico?",
      answer: "O Pacote SELECT inclui 4 horas de recreação com 2 recreadores, pintura facial e mais atividades. O Pacote CLÁSSICO tem 3 horas com 1 recreador. Ambos são perfeitos, o Select é ideal para festas maiores!",
    },
    {
      question: "Como faço para reservar minha data?",
      answer: "É simples! Entre em contato pelo WhatsApp (11) 96598-2251, escolha seu pacote e garanta a data com 50% de sinal via PIX. Emitimos contrato digital e nota fiscal.",
    },
  ];

  return (
    <>
      <SEO
        title="Recreação Infantil SP | Pacotes a Partir de R$589 | Vivalegria 2026"
        description="Recreação infantil premium em São Paulo. Festas, casamentos e eventos corporativos. Pacotes Select (4h + 2 recreadores) e Clássico. Orçamento grátis! ☎️ (11) 96598-2251"
        keywords="recreação infantil São Paulo, festa infantil SP, animação festa infantil preço, pacote recreação 20 crianças SP, pintura facial festa infantil, recreação Vila Mariana, recreação Moema, festa infantil ABC"
        canonical="/"
      />
      <JsonLd type="organization" />
      <JsonLd type="local-business" />
      <JsonLd type="faq" />
      <div className="min-h-screen">
        {/* Video Hero Section */}
        <VideoHero />

        {/* Sub-headline after hero */}
        <div className="bg-secondary/30 py-4 text-center">
          <p className="text-lg font-medium">
            🎉 Atendemos <strong>festas infantis, casamentos e eventos corporativos</strong> em São Paulo e região
          </p>
        </div>

        {/* How It Works - NEW */}
        <HowItWorks />

        {/* Price Calculator - NEW */}
        <PriceCalculator />

        {/* Why Choose Us */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Por que escolher a Vivalegria?</h2>
              <p className="text-xl text-muted-foreground">O que nos torna especiais</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 text-center hover:-translate-y-2 transition-all duration-300 bg-card rounded-2xl shadow-card hover:shadow-hover border-2 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-secondary">
                    <img 
                      src={value.image} 
                      alt={value.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Who - NEW */}
        <ForWho />

        {/* Security Section - NEW */}
        <SecuritySection />

        {/* Testimonials - NEW (expanded) */}
        <Testimonials />

        {/* Instagram Gallery - NEW */}
        <InstagramGallery />

        {/* Blog Preview - NEW */}
        <BlogPreview />

        {/* FAQ Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-xl text-muted-foreground">Tire suas dúvidas sobre recreação infantil em São Paulo</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="bg-card rounded-2xl border-2 border-secondary/30 px-6 shadow-soft"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6 hover:text-primary">
                      <span className="font-bold text-lg">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Map Section - NEW */}
        <MapSection />

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Pronto para criar memórias inesquecíveis?
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Entre em contato e vamos planejar juntos o evento perfeito para você!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="rounded-full text-lg px-10 h-14 bg-background text-primary hover:bg-background/90">
                  <Link to="/contratar">
                    Solicitar orçamento
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full text-lg px-10 h-14 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <a href="https://wa.me/5511965982251" target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;