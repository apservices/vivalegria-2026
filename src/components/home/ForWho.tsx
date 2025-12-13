import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Baby, Heart, Building2, Check } from "lucide-react";

const audiences = [
  {
    icon: Baby,
    title: "Para Pais",
    subtitle: "Festas de Aniversário",
    description:
      "Transforme o aniversário do seu filho em um dia mágico! Pacotes completos com recreação, oficinas criativas e muita diversão.",
    features: [
      "Crianças de 3 a 12 anos",
      "Pacotes a partir de R$589",
      "São Paulo e região",
    ],
    cta: "Ver Pacotes",
    link: "/pacotes",
    gradient: "from-secondary/20 to-primary/10",
    iconBg: "bg-secondary",
  },
  {
    icon: Heart,
    title: "Para Noivos",
    subtitle: "Casamentos e Celebrações",
    description:
      "Seus convidados aproveitam a festa enquanto os pequenos se divertem com segurança. Espaço kids profissional para o seu grande dia!",
    features: [
      "Monitores especializados",
      "Ambiente temático",
      "Atividades para todas as idades",
    ],
    cta: "Saiba Mais",
    link: "/contato",
    gradient: "from-primary/20 to-accent/10",
    iconBg: "bg-primary",
  },
  {
    icon: Building2,
    title: "Para Empresas",
    subtitle: "Eventos Corporativos",
    description:
      "Shoppings, hotéis, escolas e empresas. Recreação profissional para seus eventos com equipe sob demanda.",
    features: [
      "Eventos de qualquer porte",
      "Recreação temática",
      "Orçamento personalizado",
    ],
    cta: "Fale Conosco",
    link: "/corporativo",
    gradient: "from-accent/20 to-secondary/10",
    iconBg: "bg-accent",
  },
];

const ForWho = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Para Quem é a Vivalegria?
          </h2>
          <p className="text-xl text-muted-foreground">
            Atendemos festas infantis, casamentos e eventos corporativos em São
            Paulo e região
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {audiences.map((audience, index) => (
            <Card
              key={index}
              className={`p-8 hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-hover bg-gradient-to-br ${audience.gradient} border-none`}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${audience.iconBg} flex items-center justify-center mb-6 shadow-lg`}
              >
                <audience.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                    {audience.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {audience.subtitle}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {audience.description}
                </p>

                <ul className="space-y-2">
                  {audience.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-secondary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full rounded-full mt-4">
                  <Link to={audience.link}>{audience.cta}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWho;
