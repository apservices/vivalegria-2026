import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import quemSomosBanner from "@/assets/viva-quem-somos-banner.png";

const QuemSomos = () => {
  return (
    <>
      <SEO
        title="Quem Somos | Vivalegria Recreação"
        description="Conheça a Vivalegria: referência em entretenimento infantil, combinando o encanto da infância com experiências recreativas educativas e memoráveis."
        canonical="/quem-somos"
      />
      <div className="min-h-screen pt-20">
        {/* Hero Banner */}
        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <img 
            src={quemSomosBanner} 
            alt="Bem-vindo à Vivalegria" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#FFD836]/80 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
              Bem-vindo à Vivalegria
            </h1>
          </div>
        </section>

        {/* Quem Somos */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FFD836]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Quem Somos</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fundada com o propósito de enriquecer a vida das crianças por meio da recreação, a Vivalegria é hoje um referencial em entretenimento infantil. Com uma equipe de especialistas em diversão, combinamos o encanto da infância com experiências recreativas educativas e memoráveis.
              </p>
            </Card>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="py-16 bg-[#FFF8E6]">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FF731D]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missão é criar momentos inesquecíveis onde a alegria e o aprendizado se entrelaçam de forma mágica. Em cada evento, festa ou encontro, garantimos que cada risada ressoe e cada experiência seja projetada com carinho e atenção aos detalhes. Buscamos ser referência no setor como a maior e melhor escolha dos nossos clientes, proporcionando experiências que marcam vidas e criam memórias duradouras.
              </p>
            </Card>
          </div>
        </section>

        {/* Nossa Paixão */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#73B6F0]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Nossa Paixão</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa paixão é proporcionar a crianças e famílias um espaço onde a imaginação comanda, a criatividade floresce e a diversão nunca termina. Com respeito pela individualidade de cada pequeno e um olhar sempre atento à segurança e ao bem-estar, a Vivalegria é mais do que uma empresa de recreação: é uma aliada da infância, um berço de momentos preciosos e uma guardiã de sorrisos.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-[#FF731D] to-[#FF4E17]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Vamos criar momentos mágicos juntos?
            </h2>
            <Button 
              asChild 
              size="lg" 
              className="rounded-full text-lg px-10 h-14 bg-white text-[#FF731D] hover:bg-white/90"
            >
              <a 
                href="https://wa.me/5511965982251?text=Olá vim pelo site e gostaria de um orçamento" 
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