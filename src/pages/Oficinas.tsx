import { Clock, Users, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";

import oficinaSlime from "@/assets/oficina-slime.jpg";
import oficinaMicangas from "@/assets/oficina-micangas.jpg";
import oficinaCupcake from "@/assets/oficina-cupcake.jpg";
import oficinaPintura from "@/assets/oficina-pintura.jpg";
import oficinaJardinagem from "@/assets/oficina-jardinagem.jpg";

// Mascote Vivalegria
import mascoteSlime from "@/assets/mascote-slime.png";
import oficinasVideo from "../../public/videos/oficinas-bg.mp4.asset.json";

const Oficinas = () => {
  const workshops = [
    {
      id: 1,
      title: "Slime",
      image: oficinaSlime,
      description:
        "Criação de slimes coloridos e divertidos com texturas variadas",
      takeHome: "Slime personalizado em potinho",
      duration: "45–60 min",
      ages: "5–12 anos",
      color: "viva-sun",
    },
    {
      id: 2,
      title: "Miçangas",
      image: oficinaMicangas,
      description:
        "Confecção de pulseiras, colares e acessórios criativos",
      takeHome: "Pulseira ou colar de miçangas",
      duration: "60 min",
      ages: "6–14 anos",
      color: "viva-blue",
    },
    {
      id: 3,
      title: "Cupcakes",
      image: oficinaCupcake,
      description:
        "Decoração de cupcakes com chantilly e confeitos coloridos",
      takeHome: "Cupcake decorado",
      duration: "45 min",
      ages: "4–12 anos",
      color: "viva-orange",
    },
    {
      id: 4,
      title: "Pintura em Tela",
      image: oficinaPintura,
      description:
        "Arte em tela com tintas acrílicas e criatividade livre",
      takeHome: "Obra de arte em tela",
      duration: "60–75 min",
      ages: "5–14 anos",
      color: "viva-gold",
    },
    {
      id: 5,
      title: "Jardinagem",
      image: oficinaJardinagem,
      description:
        "Plantio de mudas e aprendizado sobre cuidados com plantas",
      takeHome: "Vasinho com planta",
      duration: "45–60 min",
      ages: "5–12 anos",
      color: "viva-blue",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Escolha",
      description:
        "Selecione as oficinas que mais combinam com o seu evento",
    },
    {
      number: "2",
      title: "Agende",
      description:
        "Entre em contato e defina data, horário e número de crianças",
    },
    {
      number: "3",
      title: "Preparamos",
      description:
        "Nossa equipe leva todos os materiais e organiza o espaço",
    },
    {
      number: "4",
      title: "Diversão",
      description:
        "As crianças criam, aprendem e levam suas obras para casa",
    },
  ];

  return (
    <>
      <SEO
        title="Oficinas Criativas | Vivalegria Recreação"
        description="Oficinas criativas para crianças: slime, miçangas, cupcakes, pintura em tela e jardinagem. Cada criança leva sua criação para casa!"
        canonical="/oficinas"
      />

      <div className="min-h-screen">
        {/* HERO COM VÍDEO */}
        <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={oficinasVideo.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <div className="text-center px-4 max-w-3xl space-y-6">
              <Badge
                className="mx-auto bg-white/90 text-primary shadow-soft"
                variant="secondary"
              >
                Aprender Brincando
              </Badge>

              <h1 className="text-white text-4xl md:text-5xl font-bold">
                Oficinas Criativas Vivalegria
              </h1>

              <p className="text-white/90 text-xl">
                Experiências educativas e divertidas.
                Cada criança cria, aprende e leva sua obra para casa.
              </p>

              <Button
                asChild
                size="lg"
                className="rounded-full shadow-premium"
              >
                <Link to="/contratar">
                  Planejar minhas oficinas
                  <ArrowRight className="ml-2 w-4 h-4" />
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
                      loading="lazy"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {workshop.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {workshop.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gradient-subtle rounded-lg mb-4">
                      <p className="text-sm font-semibold text-primary">
                        A partir de R$ 150
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valor ajustado conforme nº de crianças
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="w-5 h-5 text-primary" />
                      <span className="font-medium">Leva para casa:</span>
                      <span className="text-muted-foreground">
                        {workshop.takeHome}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">Duração:</span>
                      <span className="text-muted-foreground">
                        {workshop.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium">Faixa etária:</span>
                      <span className="text-muted-foreground">
                        {workshop.ages}
                      </span>
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
                Processo simples e profissional do início ao fim
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>

                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-10 -right-4 text-primary/30 w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL COM FUNDO SUAVE + MASCOTE */}
        <section className="py-24 bg-[#FFF3E6]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <img
                src={mascoteSlime}
                alt="Mascote Vivalegria com slime colorido"
                className="mx-auto w-40"
                loading="lazy"
              />

              <h2 className="text-[#FF731D]">
                Pronto para criar memórias inesquecíveis?
              </h2>

              <p className="text-xl text-[#6B4F3F]">
                Escolha as oficinas e crie um evento único para as crianças
              </p>

              <Button
                asChild
                size="lg"
                className="rounded-full text-lg px-10 h-14 shadow-premium"
              >
                <Link to="/contratar">
                  Planejar minhas oficinas
                  <ArrowRight className="ml-2 w-4 h-4" />
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
