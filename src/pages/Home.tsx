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
// Sections
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
      description:
        "Monitores treinados e certificados com equipamentos premium",
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
      answer:
        "O Pacote SELECT para 25 crianças custa R$ 1.119,90, incluindo 4 horas de recreação com 2 recreadores profissionais.",
    },
    {
      question: "Vocês atendem em toda São Paulo e região?",
      answer:
        "Sim! Atendemos toda a Grande São Paulo e região metropolitana.",
    },
    {
      question: "Qual a antecedência mínima para contratar?",
      answer:
        "Recomendamos pelo menos 15 dias de antecedência.",
    },
    {
      question: "Vocês levam equipamentos e materiais?",
      answer:
        "Sim! Levamos todos os equipamentos e materiais necessários.",
    },
  ];

  return (
    <>
      <SEO
        title="Recreação Infantil SP | Vivalegria"
        description="Recreação infantil premium em São Paulo."
        canonical="/"
      />
      <JsonLd type="organization" />
      <JsonLd type="local-business" />
      <JsonLd type="faq" />
      <div className="flex flex-col">
        {/* ================= HERO ================= */}
        <section className="relative min-h-[calc(100vh-6rem)] flex items-center">
          <VideoHero />
        </section>
        {/* Sub headline */}
        <div className="bg-secondary/30 py-4 text-center">
          <p className="text-lg font-medium">
            🎉 Atendemos{" "}
            <strong>
              festas infantis, casamentos e eventos corporativos
            </strong>{" "}
            em São Paulo e região
          </p>
        </div>
        <HowItWorks />
        <PriceCalculator />
        {/* WHY US */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Por que escolher a Vivalegria?
              </h2>
              <p className="text-xl text-muted-foreground">
                O que nos torna especiais
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 text-center bg-card rounded-2xl shadow-card hover:shadow-hover transition-all"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <ForWho />
        <SecuritySection />
        <Testimonials />
        <InstagramGallery />
        <BlogPreview />
        {/* FAQ */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl px-6"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <MapSection />
        {/* CTA FINAL */}
        <section className="py-20 bg-primary text-primary-foreground text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para criar memórias inesquecíveis?
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/contratar">Solicitar orçamento</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <a
                href="https://wa.me/5511965982251"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
