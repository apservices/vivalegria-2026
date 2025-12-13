import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mariana Silva",
    role: "Mãe do Lucas, 6 anos",
    location: "Vila Mariana, SP",
    content:
      "A Vivalegria transformou o aniversário do meu filho em um dia mágico. Profissionais incríveis e as crianças não pararam de brincar!",
    rating: 5,
  },
  {
    name: "Roberto Costa",
    role: "Gerente de Shopping",
    location: "Moema, SP",
    content:
      "Contratamos para eventos mensais. Organização impecável e as famílias sempre elogiam muito. Recomendo!",
    rating: 5,
  },
  {
    name: "Ana Paula Ferreira",
    role: "Coordenadora Pedagógica",
    location: "Santo André, SP",
    content:
      "As oficinas criativas são um sucesso! As crianças aprendem brincando e os pais adoram.",
    rating: 5,
  },
  {
    name: "Juliana Santos",
    role: "Noiva - Casamento 2024",
    location: "Brooklin, SP",
    content:
      "Contratamos para o nosso casamento e foi perfeito! Os convidados curtiram a festa tranquilos sabendo que as crianças estavam se divertindo muito.",
    rating: 5,
  },
  {
    name: "Carlos Eduardo",
    role: "Pai da Maria, 4 anos",
    location: "Tatuapé, SP",
    content:
      "Já é a terceira festa que fazemos com a Vivalegria. Equipe pontual, organizada e as crianças amam. Não troco por nada!",
    rating: 5,
  },
  {
    name: "Fernanda Lima",
    role: "Organizadora de Eventos",
    location: "Alphaville, SP",
    content:
      "Parceria de anos! Sempre indico a Vivalegria para minhas clientes. Profissionalismo e carinho em cada detalhe.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pais e Noivos que Confiaram na Gente
          </h2>
          <p className="text-xl text-muted-foreground">
            Mais de 500 famílias felizes em São Paulo e região
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-hover relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-secondary/50" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-secondary text-xl">
                    ★
                  </span>
                ))}
              </div>

              <p className="text-foreground/90 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="border-t pt-4">
                <p className="font-bold text-primary">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  📍 {testimonial.location}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
