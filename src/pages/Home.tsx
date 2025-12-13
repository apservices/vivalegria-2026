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
      title: "SeguranÃ§a e Profissionalismo",
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
      description: "Slime, pintura, miÃ§angas e muito mais",
      image: vivaSlime,
    },
    {
      title: "ExperiÃªncias Ãšnicas",
      description: "Transformamos brincadeiras em memÃ³rias eternas",
      image: vivaPintura,
    },
  ];

  const faqs = [
    {
      question: "Quanto custa o Pacote Select para 25 crianÃ§as em SP?",
      answer: "O Pacote SELECT para 25 crianÃ§as custa R$ 1.119,90, incluindo 4 horas de recreaÃ§Ã£o com 2 recreadores profissionais, pintura facial bÃ¡sica, caÃ§a ao tesouro personalizada, escultura de balÃ£o, tatuagem infantil e muito mais!",
    },
    {
      question: "VocÃªs atendem em toda SÃ£o Paulo e regiÃ£o?",
      answer: "Sim! Atendemos toda a Grande SÃ£o Paulo incluindo Vila Mariana, Moema, Brooklin, TatuapÃ©, Zona Sul, Zona Oeste, ABC Paulista (Santo AndrÃ©, SÃ£o Bernardo, SÃ£o Caetano) e regiÃ£o metropolitana.",
    },
    {
      question: "Qual a antecedÃªncia mÃ­nima para contratar?",
      answer: "Recomendamos agendar com pelo menos 15 dias de antecedÃªncia para garantir disponibilidade na data desejada. Para eventos em alta temporada (dezembro e janeiro), sugerimos 30 dias.",
    },
    {
      question: "VocÃªs levam equipamentos e materiais?",
      answer: "Sim! Levamos todos os equipamentos, materiais para oficinas, kit de seguranÃ§a e higiene. VocÃª sÃ³ precisa providenciar o espaÃ§o.",
    },
    {
      question: "Quantas crianÃ§as cada monitor atende?",
      answer: "Mantemos a proporÃ§Ã£o de 1 monitor para cada 15 crianÃ§as para garantir seguranÃ§a e atenÃ§Ã£o individualizada.",
    },
    {
      question: "Posso personalizar o tema do evento?",
      answer: "Com certeza! Trabalhamos com temas personalizados e adaptamos as brincadeiras de acordo com a idade e preferÃªncias das crianÃ§as.",
    },
    {
      question: "Qual a diferenÃ§a entre Pacote Select e ClÃ¡ssico?",
      answer: "O Pacote SELECT inclui 4 horas de recreaÃ§Ã£o com 2 recreadores, pintura facial e mais atividades. O Pacote CLÃSSICO tem 3 horas com 1 recreador. Ambos sÃ£o perfeitos, o Select Ã© ideal para festas maiores!",
    },
    {
      question: "Como faÃ§o para reservar minha data?",
      answer: "Ã‰ simples! Entre em contato pelo WhatsApp (11) 96598-2251, escolha seu pacote e garanta a data com 50% de sinal via PIX. Emitimos contrato digital e nota fiscal.",
    },
  ];

  return (
    <>
      <SEO
        title="RecreaÃ§Ã£o Infantil SP | Pacotes a Partir de R$589 | Vivalegria 2026"
        description="RecreaÃ§Ã£o infantil premium em SÃ£o Paulo. Festas, casamentos e eventos corporativos. Pacotes Select (4h + 2 recreadores) e ClÃ¡ssico. OrÃ§amento grÃ¡tis! â˜Žï¸ (11) 96598-2251"
        keywords="recreaÃ§Ã£o infantil SÃ£o Paulo, festa infantil SP, animaÃ§Ã£o festa infantil preÃ§o, pacote recreaÃ§Ã£o 20 crianÃ§as SP, pintura facial festa infantil, recreaÃ§Ã£o Vila Mariana, recreaÃ§Ã£o Moema, festa infantil ABC"
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
            ðŸŽ‰ Atendemos <strong>festas infantis, casamentos e eventos corporativos</strong> em SÃ£o Paulo e regiÃ£o
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
              <p className="text-xl text-muted-foreground">Tire suas dÃºvidas sobre recreaÃ§Ã£o infantil em SÃ£o Paulo</p>
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
                Pronto para criar memÃ³rias inesquecÃ­veis?
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Entre em contato e vamos planejar juntos o evento perfeito para vocÃª!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="rounded-full text-lg px-10 h-14 bg-background text-primary hover:bg-background/90">
                  <Link to="/contratar">
                    Solicitar orÃ§amento
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