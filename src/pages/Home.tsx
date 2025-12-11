import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import VideoHero from "@/components/VideoHero";
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
      title: "+500 Eventos Realizados",
      description: "Experiência comprovada em festas inesquecíveis",
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

  const testimonials = [
    {
      name: "Mariana Silva",
      role: "Mãe do Lucas, 6 anos",
      content: "A Vivalegria transformou o aniversário do meu filho em um dia mágico. Profissionais incríveis e as crianças não pararam de brincar!",
      rating: 5,
    },
    {
      name: "Roberto Costa",
      role: "Gerente de Shopping",
      content: "Contratamos para eventos mensais. Organização impecável e as famílias sempre elogiam muito. Recomendo!",
      rating: 5,
    },
    {
      name: "Ana Paula",
      role: "Coordenadora Pedagógica",
      content: "As oficinas criativas são um sucesso! As crianças aprendem brincando e os pais adoram.",
      rating: 5,
    },
  ];

  const faqs = [
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
      question: "Quais regiões vocês atendem?",
      answer: "Atendemos toda a região do ABC Paulista e Grande São Paulo. Consulte-nos para outras localidades.",
    },
  ];

  return (
    <>
      <SEO
        title="Recreação Infantil SP | Pacotes a Partir de R$589 | Vivalegria"
        description="Recreação infantil para festas em São Paulo. Pacotes Select (4h + 2 recreadores) e Clássico (3h). Pintura facial, caça ao tesouro e muito mais! Orçamento grátis."
        keywords="recreação infantil São Paulo, festa infantil SP, animação festa infantil preço, pacote recreação 20 crianças SP, pintura facial festa infantil"
        canonical="/"
      />
      <JsonLd type="organization" />
      <JsonLd type="local-business" />
      <JsonLd type="faq" />
      
      <div className="min-h-screen">
        {/* Video Hero Section */}
        <VideoHero />

      {/* Values Section - Card Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Por que escolher a Vivalegria?</h2>
            <p className="text-xl text-muted-foreground">O que nos torna especiais</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-hover border-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#FFD836]">
                  <img 
                    src={value.image} 
                    alt={value.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#FF731D]">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview - Colorful Cards */}
      <section className="py-20 bg-[#FFF8E6]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nossos Pacotes</h2>
            <p className="text-xl text-muted-foreground">Escolha o ideal para o seu evento</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Clássico",
                desc: "Diversão garantida com o essencial",
                price: "A partir de R$ 589,90",
                features: ["1 recreador", "3 horas de recreação", "Escultura de balão", "Caça ao tesouro", "Toalha de piquenique + kit desenho"],
                color: "border-[#FFD836]",
              },
              {
                name: "Select",
                desc: "Experiência completa e inesquecível",
                price: "A partir de R$ 789,90",
                features: ["2 recreadores profissionais", "4 horas de recreação", "Pintura facial básica", "Caça ao tesouro personalizada", "Escultura de balão + tatuagem"],
                featured: true,
                color: "border-[#FF731D]",
              },
              {
                name: "Corporativo",
                desc: "Shoppings, hotéis, escolas e empresas",
                price: "Sob consulta",
                features: ["Equipe sob demanda", "Duração customizada", "Recreação temática", "Suporte completo"],
                color: "border-[#73B6F0]",
              },
            ].map((pkg, index) => (
              <Card
                key={index}
                className={`p-8 hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-hover border-t-4 ${pkg.color} ${
                  pkg.featured ? 'ring-2 ring-[#FF731D] scale-105' : ''
                }`}
              >
                {pkg.featured && (
                  <span className="inline-block bg-[#FF731D] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    MAIS POPULAR
                  </span>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-[#FF731D]">{pkg.name}</h3>
                    <p className="text-muted-foreground mb-2">{pkg.desc}</p>
                    <p className="font-bold text-lg text-primary">{pkg.price}</p>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FFD836] mt-1">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className="w-full rounded-full" 
                    variant={pkg.featured ? "default" : "outline"}
                  >
                    <Link to="/pacotes">Ver detalhes</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Card Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">O que dizem nossos clientes</h2>
            <p className="text-xl text-muted-foreground">Depoimentos reais de famílias felizes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-hover" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#FFD836] text-xl">★</span>
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-bold text-[#FF731D]">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Friendly Style */}
      <section className="py-20 bg-[#FFF8E6]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-muted-foreground">Tire suas dúvidas</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-2xl border-2 border-[#FFD836]/30 px-6 shadow-soft">
                  <AccordionTrigger className="text-left hover:no-underline py-6 hover:text-[#FF731D]">
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

      {/* Final CTA - Bold & Inviting */}
      <section className="py-20 bg-gradient-to-br from-[#FF731D] to-[#FF4E17] text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Pronto para criar memórias inesquecíveis?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Entre em contato e vamos planejar juntos o evento perfeito para você!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="rounded-full text-lg px-10 h-14 bg-white text-[#FF731D] hover:bg-white/90">
                <Link to="/contratar">
                  Solicitar orçamento
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full text-lg px-10 h-14 border-2 border-white text-white hover:bg-white hover:text-[#FF731D]">
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
