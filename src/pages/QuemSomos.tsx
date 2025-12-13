import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import quemSomosBanner from "@/assets/viva-quem-somos-banner.png";
const QuemSomos = () => {
  return (
    <>
      <SEO
        title="Quem Somos | Vivalegria RecreaÃ§Ã£o"
        description="ConheÃ§a a Vivalegria: referÃªncia em entretenimento infantil, combinando o encanto da infÃ¢ncia com experiÃªncias recreativas educativas e memorÃ¡veis."
        canonical="/quem-somos"
      />
      <div className="min-h-screen pt-20">
        {/* Hero Banner */}
        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <img 
            src={quemSomosBanner} 
            alt="Bem-vindo Ã  Vivalegria" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#FFD836]/80 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
              Bem-vindo Ã  Vivalegria
            </h1>
          </div>
        </section>
        {/* Quem Somos */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FFD836]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Quem Somos</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fundada com o propÃ³sito de enriquecer a vida das crianÃ§as por meio da recreaÃ§Ã£o, a Vivalegria Ã© hoje um referencial em entretenimento infantil. Com uma equipe de especialistas em diversÃ£o, combinamos o encanto da infÃ¢ncia com experiÃªncias recreativas educativas e memorÃ¡veis.
              </p>
            </Card>
          </div>
        </section>
        {/* Nossa MissÃ£o */}
        <section className="py-16 bg-[#FFF8E6]">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FF731D]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Nossa MissÃ£o</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missÃ£o Ã© criar momentos inesquecÃ­veis onde a alegria e o aprendizado se entrelaÃ§am de forma mÃ¡gica. Em cada evento, festa ou encontro, garantimos que cada risada ressoe e cada experiÃªncia seja projetada com carinho e atenÃ§Ã£o aos detalhes. Buscamos ser referÃªncia no setor como a maior e melhor escolha dos nossos clientes, proporcionando experiÃªncias que marcam vidas e criam memÃ³rias duradouras.
              </p>
            </Card>
          </div>
        </section>
        {/* Nossa PaixÃ£o */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#73B6F0]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Nossa PaixÃ£o</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa paixÃ£o Ã© proporcionar a crianÃ§as e famÃ­lias um espaÃ§o onde a imaginaÃ§Ã£o comanda, a criatividade floresce e a diversÃ£o nunca termina. Com respeito pela individualidade de cada pequeno e um olhar sempre atento Ã  seguranÃ§a e ao bem-estar, a Vivalegria Ã© mais do que uma empresa de recreaÃ§Ã£o: Ã© uma aliada da infÃ¢ncia, um berÃ§o de momentos preciosos e uma guardiÃ£ de sorrisos.
              </p>
            </Card>
          </div>
        </section>
        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-[#FF731D] to-[#FF4E17]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Vamos criar momentos mÃ¡gicos juntos?
            </h2>
            <Button 
              asChild 
              size="lg" 
              className="rounded-full text-lg px-10 h-14 bg-white text-[#FF731D] hover:bg-white/90"
            >
              <a 
                href="https://wa.me/5511965982251?text=OlÃ¡ vim pelo site e gostaria de um orÃ§amento" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Fale conosco pelo WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
export default QuemSomos;
