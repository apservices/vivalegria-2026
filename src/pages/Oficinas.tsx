import { Clock, Users, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import oficinaSlime from "@/assets/oficina-slime.jpg";
import oficinaMicangas from "@/assets/oficina-micangas.jpg";
import oficinaCupcake from "@/assets/oficina-cupcake.jpg";
import oficinaPintura from "@/assets/oficina-pintura.jpg";
import oficinaJardinagem from "@/assets/oficina-jardinagem.jpg";
const Oficinas = () => {
  const workshops = [
    {
      id: 1,
      title: "Slime",
      image: oficinaSlime,
      description: "CriaÃ§Ã£o de slimes coloridos e divertidos com texturas variadas",
      takeHome: "Slime personalizado em potinho",
      duration: "45-60 min",
      ages: "5-12 anos",
      color: "viva-sun",
    },
    {
      id: 2,
      title: "MiÃ§angas",
      image: oficinaMicangas,
      description: "ConfecÃ§Ã£o de pulseiras, colares e acessÃ³rios criativos",
      takeHome: "Pulseira ou colar de miÃ§angas",
      duration: "60 min",
      ages: "6-14 anos",
      color: "viva-blue",
    },
    {
      id: 3,
      title: "Cupcakes",
      image: oficinaCupcake,
      description: "DecoraÃ§Ã£o de cupcakes com chantilly e confeitos coloridos",
      takeHome: "Cupcake decorado",
      duration: "45 min",
      ages: "4-12 anos",
      color: "viva-orange",
    },
    {
      id: 4,
      title: "Pintura em Tela",
      image: oficinaPintura,
      description: "Arte em tela com tintas acrÃ­licas e criatividade livre",
      takeHome: "Obra de arte em tela",
      duration: "60-75 min",
      ages: "5-14 anos",
      color: "viva-gold",
    },
    {
      id: 5,
      title: "Jardinagem",
      image: oficinaJardinagem,
      description: "Plantio de mudas e aprendizado sobre cuidados com plantas",
      takeHome: "Vasinho com planta",
      duration: "45-60 min",
      ages: "5-12 anos",
      color: "viva-blue",
    }];
  const steps = [
    { number: "1", title: "Escolha", description: "Selecione as oficinas que mais combinam com o seu evento" },
    { number: "2", title: "Agende", description: "Entre em contato e defina data, horÃ¡rio e nÃºmero de crianÃ§as" },
    { number: "3", title: "Preparamos", description: "Nossa equipe leva todos os materiais e organiza o espaÃ§o" },
    { number: "4", title: "DiversÃ£o", description: "As crianÃ§as criam, aprendem e levam suas obras para casa" }];
  return (
    <>
      <SEO
        title="Oficinas Criativas | Vivalegria RecreaÃ§Ã£o"
        description="Oficinas criativas para crianÃ§as: slime, miÃ§angas, cupcakes, pintura em tela e jardinagem. Cada crianÃ§a leva sua criaÃ§Ã£o para casa!"
        canonical="/oficinas"
      />
      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="mb-4 bg-primary shadow-soft" variant="secondary">Aprender Brincando</Badge>
              <h1 className="text-balance">Oficinas Criativas Vivalegria</h1>
              <p className="text-xl text-muted-foreground text-balance">
                ExperiÃªncias educativas e divertidas. Cada crianÃ§a cria, aprende e leva sua obra para casa!
              </p>
              <Button asChild size="lg" className="rounded-full shadow-premium">
                <Link to="/contratar">
                  Planejar minhas oficinas
                </Link>
              </Button>
            </div>
          </div>
        </section>
        {/* Oficinas Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Nossas Oficinas</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Atividades criativas e educativas com monitores especializados
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {workshops.map((workshop, index) => (
                <Card
                  key={workshop.id}
                  className="overflow-hidden hover-lift shadow-card animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={workshop.image}
                      alt={workshop.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{workshop.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {workshop.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gradient-subtle rounded-lg mb-4">
                      <p className="text-sm font-semibold text-primary">A partir de R$ 150</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valor ajustado conforme nÂº de crianÃ§as
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="w-5 h-5 text-primary" />
                      <span className="font-medium">Leva para casa:</span>
                      <span className="text-muted-foreground">{workshop.takeHome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">DuraÃ§Ã£o:</span>
                      <span className="text-muted-foreground">{workshop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium">Faixa etÃ¡ria:</span>
                      <span className="text-muted-foreground">{workshop.ages}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Como Funciona */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Como Funciona</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Processo simples e profissional do inÃ­cio ao fim
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-10 -right-4 text-primary/30 w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Final */}
        <section className="py-24 bg-gradient-warm">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-balance text-white">Pronto para criar memÃ³rias inesquecÃ­veis?</h2>
              <p className="text-xl text-white/90">
                Escolha as oficinas e crie um evento Ãºnico para as crianÃ§as
              </p>
              <Button asChild size="lg" className="rounded-full text-lg px-10 h-14 shadow-premium bg-white text-viva-orange hover:bg-white/90">
                <Link to="/contratar">
                  Planejar minhas oficinas
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default Oficinas;
