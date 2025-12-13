import { Shield, Users, HeartHandshake, Award, CheckCircle2 } from "lucide-react";
const securityPoints = [
  {
    icon: Users,
    title: "Equipe Treinada",
    description: "Todos os recreadores passam por treinamento intensivo e possuem experiÃªncia comprovada com crianÃ§as.",
  },
  {
    icon: Shield,
    title: "Protocolos de SeguranÃ§a",
    description: "Seguimos protocolos rigorosos de higiene e seguranÃ§a em todos os eventos.",
  },
  {
    icon: HeartHandshake,
    title: "Acompanhamento PrÃ³ximo",
    description: "ProporÃ§Ã£o de 1 monitor para cada 15 crianÃ§as, garantindo atenÃ§Ã£o individualizada.",
  },
  {
    icon: Award,
    title: "Materiais Premium",
    description: "Utilizamos apenas materiais atÃ³xicos e seguros, adequados para cada faixa etÃ¡ria.",
  }];
const SecuritySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-foreground">SeguranÃ§a em Primeiro Lugar</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Seu filho em boas mÃ£os enquanto vocÃª curte a festa
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Com mais de 500 eventos realizados, a Vivalegria Ã© referÃªncia em recreaÃ§Ã£o infantil segura 
              e profissional em SÃ£o Paulo. Nossa equipe Ã© cuidadosamente selecionada e treinada para 
              garantir a diversÃ£o com total seguranÃ§a.
            </p>
            <div className="space-y-4">
              {securityPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center">
                    <point.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{point.title}</h4>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Stats Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4">
                <p className="text-5xl font-bold mb-2">+500</p>
                <p className="text-sm opacity-90">Eventos Realizados</p>
              </div>
              <div className="text-center p-4">
                <p className="text-5xl font-bold mb-2">+732</p>
                <p className="text-sm opacity-90">Profissionais Cadastrados</p>
              </div>
              <div className="text-center p-4">
                <p className="text-5xl font-bold mb-2">8+</p>
                <p className="text-sm opacity-90">Anos de ExperiÃªncia</p>
              </div>
              <div className="text-center p-4">
                <p className="text-5xl font-bold mb-2">100%</p>
                <p className="text-sm opacity-90">SatisfaÃ§Ã£o Garantida</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-primary-foreground/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm">Contrato digital + Nota fiscal em todos os eventos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SecuritySection;
