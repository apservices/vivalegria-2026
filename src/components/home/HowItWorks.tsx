import { PhoneCall, Calendar, PartyPopper, Heart } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "1. Fale Conosco",
    description:
      "Entre em contato pelo WhatsApp ou formulário. Vamos entender seu evento e suas necessidades.",
  },
  {
    icon: Calendar,
    title: "2. Reserve a Data",
    description:
      "Escolha o pacote ideal e garanta sua data com 50% de sinal via PIX.",
  },
  {
    icon: PartyPopper,
    title: "3. Curtam a Festa",
    description:
      "Nossa equipe chega 30 minutos antes, preparada com tudo para encantar as crianças!",
  },
  {
    icon: Heart,
    title: "4. Memórias Eternas",
    description:
      "Receba fotos do evento e veja sorrisos que vão durar para sempre.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Como Funciona a Vivalegria na sua Festa
          </h2>
          <p className="text-xl text-muted-foreground">
            4 passos simples para uma festa inesquecível
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-secondary to-transparent" />
              )}

              <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-primary/20 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <step.icon className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-primary">
                {step.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
