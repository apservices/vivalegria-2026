import { Building2, Hotel, School, Store, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
const Corporativo = () => {
  const formats = [
    {
      icon: Store,
      name: "Shopping Centers",
      description: "Ãreas kids temÃ¡ticas, eventos sazonais e ativaÃ§Ãµes de marca que atraem e encantam famÃ­lias",
      features: [
        "RecreaÃ§Ã£o contÃ­nua em Ã¡reas kids",
        "Eventos temÃ¡ticos mensais",
        "AtivaÃ§Ãµes de datas comemorativas",
        "Monitoramento e relatÃ³rios"],
    },
    {
      icon: Hotel,
      name: "HotÃ©is e Resorts",
      description: "ProgramaÃ§Ã£o infantil completa para hÃ³spedes, garantindo tranquilidade aos pais e diversÃ£o Ã s crianÃ§as",
      features: [
        "Kids club com programaÃ§Ã£o diÃ¡ria",
        "RecreaÃ§Ã£o em eventos corporativos",
        "Oficinas criativas temÃ¡ticas",
        "Personagens e animaÃ§Ã£o"],
    },
    {
      icon: School,
      name: "Escolas",
      description: "Eventos escolares, festas juninas, dia das crianÃ§as e atividades extracurriculares com foco educativo",
      features: [
        "Eventos escolares temÃ¡ticos",
        "Gincanas e competiÃ§Ãµes",
        "Oficinas educativas",
        "Formatura infantil"],
    },
    {
      icon: Building2,
      name: "Empresas",
      description: "RecreaÃ§Ã£o infantil em eventos corporativos, confraternizaÃ§Ãµes e aÃ§Ãµes de endomarketing",
      features: [
        "Festas de fim de ano",
        "Dia da famÃ­lia na empresa",
        "Eventos de integraÃ§Ã£o",
        "AÃ§Ãµes de responsabilidade social"],
    }];
  const benefits = [
    "Equipe treinada e certificada",
    "Seguro de responsabilidade civil",
    "RelatÃ³rios de satisfaÃ§Ã£o e presenÃ§a",
    "Materiais e equipamentos premium",
    "CoordenaÃ§Ã£o e logÃ­stica completa",
    "Flexibilidade de horÃ¡rios e formatos"];
  return (
    <>
      <SEO
        title="Eventos Corporativos | Vivalegria RecreaÃ§Ã£o"
        description="RecreaÃ§Ã£o corporativa para shoppings, hotÃ©is, escolas e empresas. Profissionalismo e alegria garantidos em cada evento."
        canonical="/corporativo"
      />
      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-secondary/10 via-primary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance">Eventos Corporativos</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Transformamos ambientes corporativos em espaÃ§os de encantamento para crianÃ§as, criando experiÃªncias memorÃ¡veis em shoppings, hotÃ©is, escolas e empresas.
            </p>
          </div>
        </section>
      {/* Value Proposition */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="mb-6">Por que escolher a Vivalegria?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Mais de 10 anos de experiÃªncia em recreaÃ§Ã£o corporativa, combinando profissionalismo, seguranÃ§a e criatividade para garantir o sucesso do seu evento.
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
              SoluÃ§Ãµes customizadas para cada tipo de estabelecimento
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
                    ServiÃ§os inclusos:
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
              Parceiros que confiam em nossa excelÃªncia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center hover-lift">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Shopping ABC Plaza</h3>
              <p className="text-sm text-muted-foreground">
                "Parceria hÃ¡ 3 anos. A Vivalegria Ã© fundamental para a experiÃªncia das famÃ­lias no nosso shopping."
              </p>
            </Card>
            <Card className="p-8 text-center hover-lift">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Hotel className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Resort Costa Verde</h3>
              <p className="text-sm text-muted-foreground">
                "Os hÃ³spedes sempre elogiam a qualidade da recreaÃ§Ã£o. Profissionais impecÃ¡veis!"
              </p>
            </Card>
            <Card className="p-8 text-center hover-lift">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">TechCorp Sistemas</h3>
              <p className="text-sm text-muted-foreground">
                "Transformaram nossa festa de fim de ano. As crianÃ§as se divertiram muito e os pais puderam aproveitar."
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
              Processo simples e profissional do inÃ­cio ao fim
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Contato", desc: "Entre em contato via WhatsApp ou formulÃ¡rio" },
              { step: "2", title: "Briefing", desc: "Entendemos suas necessidades e objetivos" },
              { step: "3", title: "Proposta", desc: "Enviamos proposta personalizada em 24h" },
              { step: "4", title: "Planejamento", desc: "Alinhamos todos os detalhes da operaÃ§Ã£o" },
              { step: "5", title: "ExecuÃ§Ã£o", desc: "Realizamos com excelÃªncia e enviamos relatÃ³rio" }].map((item, index) => (
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
              Solicite uma proposta personalizada e descubra como podemos encantar seu pÃºblico
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
