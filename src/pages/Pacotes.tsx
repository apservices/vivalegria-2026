import { useEffect } from "react";
import { Check, Star, Sparkles, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import Mascote from "@/components/Mascote";
import { trackLPView, trackContratarClick } from "@/utils/tracking";

type PremiumPackage = {
  name: string;
  badge: string;
  badgeColor: string; // ex: "bg-primary"
  badgeIcon: React.ElementType;
  audience: string;
  description: string;
  startPrice: string; // ex: "R$ 589"
  features: string[];
  note?: string;
};

const premiumPackages: PremiumPackage[] = [
  {
    name: "Classic",
    badge: "Mais escolhido",
    badgeColor: "bg-primary",
    badgeIcon: Star,
    audience: "Na medida certa para diversão",
    description:
      "Brincadeiras guiadas, dinâmica e organização para manter as crianças animadas do começo ao fim.",
    startPrice: "R$ 589",
    features: [
      "Recreação com monitor(es) experiente(s)",
      "Brincadeiras clássicas e gincanas",
      "Organização das atividades por faixa etária",
      "Materiais e itens de apoio para dinâmica",
      "Segurança e condução profissional",
    ],
    note: "⭐ Ideal para quem busca diversão organizada, segurança e alegria do começo ao fim.",
  },
  {
    name: "Select",
    badge: "Premium",
    badgeColor: "bg-viva-orange",
    badgeIcon: Sparkles,
    audience: "Diversão completa para brilhar em seu evento",
    description:
      "Mais tempo, mais equipe e mais experiências para transformar a festa em um momento memorável.",
    startPrice: "R$ 789,90",
    features: [
      "4 horas de recreação",
      "2 recreadores profissionais",
      "Pintura facial básica",
      "Caça ao tesouro personalizada",
      "Escultura de balão e tatuagem infantil",
      "Atividades temáticas conforme perfil do evento",
    ],
    note: "⭐ Recomendado para quem deseja uma experiência mais completa, personalizada e inesquecível.",
  },
  {
    name: "Baby & Kids",
    badge: "0–4 anos",
    badgeColor: "bg-viva-gold",
    badgeIcon: Baby,
    audience: "Para pequenos com rotina e acolhimento",
    description:
      "Atividades adaptadas para os menores, com foco em estímulos e brincadeiras seguras.",
    startPrice: "Sob consulta",
    features: [
      "Brincadeiras sensoriais e lúdicas",
      "Ritmo mais calmo e adaptado",
      "Acompanhamento e cuidado reforçados",
      "Materiais adequados à idade",
    ],
    note: "Indicamos após entender a idade e o perfil do seu evento.",
  },
];

const Pacotes = () => {
  // Track landing page view on mount (respects consent)
  useEffect(() => {
    trackLPView('pacotes');
  }, []);

  const handleContratarClick = (packageName: string) => {
    trackContratarClick(`Contratar ${packageName}`);
  };

  return (
    <>
      <SEO
        title="Pacotes de Recreação Infantil | Vivalegria"
        description="Conheça nossos pacotes premium de recreação infantil para festas inesquecíveis."
        canonical="/pacotes"
      />

      {/* Premium Packages */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Experiências Especiais</h2>
            <p className="text-lg text-muted-foreground">
              Serviços premium para tornar sua festa ainda mais incrível
            </p>
          </div>

          {/* Wrapper relativo com mascote */}
          <div className="relative max-w-5xl mx-auto">
            {/* Mascote decorativo */}
            <Mascote
              pose="banner"
              animation="balanco"
              className="hidden xl:block w-48 xl:w-56 absolute -right-32 top-10 z-10 drop-shadow-2xl"
            />

            {/* Grid dos cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {premiumPackages.map((pkg, index) => (
                <Card
                  key={index}
                  className="p-8 hover-lift border-2 border-dashed border-primary/30"
                >
                  <span
                    className={`${pkg.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-flex items-center gap-1`}
                  >
                    <pkg.badgeIcon className="w-3 h-3" />
                    {pkg.badge}
                  </span>

                  <h2 className="text-3xl font-bold mb-2">{pkg.name}</h2>
                  <p className="text-sm text-primary font-semibold mb-3">{pkg.audience}</p>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>

                  <div className="p-4 bg-background rounded-lg mb-6 border">
                    <p className="text-2xl font-bold text-primary">
                      A partir de {pkg.startPrice}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      O que está incluso:
                    </h3>

                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {pkg.note && (
                    <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg mb-6 italic">
                      💡 {pkg.note}
                    </p>
                  )}

                  <Button asChild className="w-full rounded-full" variant="outline">
                    <a
                      href="https://wa.me/5511965982251"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💬 Consultar no WhatsApp
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pacotes;
