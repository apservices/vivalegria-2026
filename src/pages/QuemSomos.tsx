import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import quemSomosBanner from "@/assets/viva-quem-somos-banner.png";

const QuemSomos = () => {
  return (
    <>
      <SEO
        title="Quem Somos | Vivalegria Recreaï¿½ï¿½o"
        description="Conheï¿½a a Vivalegria: referï¿½ncia em entretenimento infantil, combinando o encanto da infï¿½ncia com experiï¿½ncias recreativas educativas e memorï¿½veis."
        canonical="/quem-somos"
      />
      <div className="min-h-screen pt-20">
        {/* Hero Banner */}
        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={quemSomosBanner}
            alt="Bem-vindo ï¿½ Vivalegria"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#FFD836]/80 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
              Bem-vindo ï¿½ Vivalegria
            </h1>
          </div>
        </section>

        {/* Quem Somos */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FFD836]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Quem Somos</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fundada com o propï¿½sito de enriquecer a vida das crianï¿½as por meio da
                recreaï¿½ï¿½o, a Vivalegria ï¿½ hoje um referencial em entretenimento infantil.
                Com uma equipe de especialistas em diversï¿½o, combinamos o encanto da infï¿½ncia
                com experiï¿½ncias recreativas educativas e memorï¿½veis.
              </p>
            </Card>
          </div>
        </section>

        {/* Nossa Missï¿½o */}
        <section className="py-16 bg-[#FFF8E6]">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FF731D]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Nossa Missï¿½o</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missï¿½o ï¿½ criar momentos inesquecï¿½veis onde a alegria e o aprendizado
                se entrelaï¿½am de forma mï¿½gica. Em cada evento, festa ou encontro, garantimos
                que cada risada ressoe e cada experiï¿½ncia seja projetada com carinho e atenï¿½ï¿½o
                aos detalhes. Buscamos ser referï¿½ncia no setor como a maior e melhor escolha
                dos nossos clientes, proporcionando experiï¿½ncias que marcam vidas e criam
                memï¿½rias duradouras.
              </p>
            </Card>
          </div>
        </section>

        {/* Nossa Paixï¿½o */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#73B6F0]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">Nossa Paixï¿½o</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa paixï¿½o ï¿½ proporcionar a crianï¿½as e famï¿½lias um espaï¿½o onde a imaginaï¿½ï¿½o
                comanda, a criatividade floresce e a diversï¿½o nunca termina. Com respeito pela
                individualidade de cada pequeno e um olhar sempre atento ï¿½ seguranï¿½a e ao
                bem-estar, a Vivalegria ï¿½ mais do que uma empresa de recreaï¿½ï¿½o: ï¿½ uma aliada da
                infï¿½ncia, um berï¿½o de momentos preciosos e uma guardiï¿½ de sorrisos.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-[#FF731D] to-[#FF4E17]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Vamos criar momentos mï¿½gicos juntos?
            </h2>
            <Button
              asChild
              size="lg"
              className="rounded-full text-lg px-10 h-14 bg-white text-[#FF731D] hover:bg-white/90"
            >
              <a
                href="https://wa.me/5511965982251?text=Olï¿½ vim pelo site e gostaria de um orï¿½amento"
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

