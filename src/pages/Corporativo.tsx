import { Building2, Hotel, School, Store, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";

const Corporativo = () => {
  const formats = [
    {
      icon: Store,
      name: "Shopping Centers",
      description:
        "Áreas kids temáticas, eventos sazonais e ativações de marca que atraem e encantam famílias",
      features: [
        "Recreação contínua em áreas kids",
        "Eventos temáticos mensais",
        "Ativações de datas comemorativas",
        "Monitoramento e relatórios",
      ],
    },
    {
      icon: Hotel,
      name: "Hotéis e Resorts",
      description:
        "Programação infantil completa para hóspedes, garantindo tranquilidade aos pais e diversão às crianças",
      features: [
        "Kids club com programação diária",
        "Recreação em eventos corporativos",
        "Oficinas criativas temáticas",
        "Personagens e animação",
      ],
    },
    {
      icon: School,
      name: "Escolas",
      description:
        "Eventos escolares, festas juninas, Dia das Crianças e atividades extracurriculares com foco educativo",
      features: [
        "Eventos escolares temáticos",
        "Gincanas e competições",
        "Oficinas educativas",
        "Formatura infantil",
      ],
    },
    {
      icon: Building2,
      name: "Empresas",
      description:
        "Recreação infantil em eventos corporativos, confraternizações e ações de endomarketing",
      features: [
        "Festas de fim de ano",
        "Dia da família na empresa",
        "Eventos de integração",
        "Ações de responsabilidade social",
      ],
    },
  ];

  const benefits = [
    "Equipe treinada e certificada",
    "Seguro de responsabilidade civil",
    "Relatórios de satisfação e presença",
    "Materiais e equipamentos premium",
    "Coordenação e logística completa",
    "Flexibilidade de horários e formatos",
  ];

  return (
    <>
      <SEO
        title="Eventos Corporativos | Vivalegria Recreação"
        description="Recreação corporativa para shoppings, hotéis, escolas e empresas. Profissionalismo e alegria garantidos em cada evento."
        canonical="/corporativo"
      />

      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-secondary/10 via-primary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance">Eventos Corporativos</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Transformamos ambientes corporativos em espaços de encantamento para crianças,
              criando experiências memoráveis em shoppings, hotéis, escolas e empresas.
            </p>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="mb-6">Por que escolher a Vivalegria?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Mais de 10 anos de experiência em recreação corporativa, combinando profissionalismo,
                segurança e criatividade para garantir o sucesso do seu evento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 hover-lift">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Nossos Formatos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Soluções customizadas para cada tipo de estabelecimento
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {formats.map((format, index) => (
                <Card key={index} className="p-8 hover-lift">
                  <div className="flex items-start mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl mr-4">
                      <format.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{format.name}</h3>
                      <p className="text-muted-foreground">{format.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Serviços inclusos:
                    </p>
                    {format.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies / Social Proof */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Quem Confia na Vivalegria</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Parceiros que confiam em nossa excelência
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 text-center hover-lift">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Shopping ABC Plaza</h3>
                <p className="text-sm text-muted-foreground">
                  &quot;Parceria há 3 anos. A Vivalegria é fundamental para a experiência das famílias no nosso shopping.&quot;
                </p>
              </Card>

              <Card className="p-8 text-center hover-lift">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Hotel className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Resort Costa Verde</h3>
                <p className="text-sm text-muted-foreground">
                  &quot;Os hóspedes sempre elogiam a qualidade da recreação. Profissionais impecáveis!&quot;
                </p>
              </Card>

              <Card className="p-8 text-center hover-lift">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">TechCorp Sistemas</h3>
                <p className="text-sm text-muted-foreground">
                  &quot;Transformaram nossa festa de fim de ano. As crianças se divertiram muito e os pais puderam aproveitar.&quot;
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Como Funciona?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Processo simples e profissional do início ao fim
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {[
                { step: "1", title: "Contato", desc: "Entre em contato via WhatsApp ou formulário" },
                { step: "2", title: "Briefing", desc: "Entendemos suas necessidades e objetivos" },
                { step: "3", title: "Proposta", desc: "Enviamos proposta personalizada em 24h" },
                { step: "4", title: "Planejamento", desc: "Alinhamos todos os detalhes da operação" },
                { step: "5", title: "Execução", desc: "Realizamos com excelência e enviamos relatório" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-balance">Vamos criar uma parceria de sucesso</h2>
              <p className="text-xl text-muted-foreground">
                Solicite uma proposta personalizada e descubra como podemos encantar seu público
              </p>

              <Button asChild size="lg" className="rounded-full px-10 text-lg h-14 shadow-premium">
                <a href="https://wa.me/5511992049001" target="_blank" rel="noopener noreferrer">
                  Solicitar proposta corporativa
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Corporativo;
