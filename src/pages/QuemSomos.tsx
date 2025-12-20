import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import quemSomosBanner from "@/assets/viva-quem-somos-banner.png";

// Imagens ilustrativas (imagens reais de recreação infantil alegre e profissional)
const equipeImg1 = "https://www.tiogiu.com.br/wp-content/uploads/2022/04/18835947_1102595516551216_9053607266947550021_n.jpg";
const equipeImg2 = "https://bombandobrinque.com.br/wp-content/uploads/2024/04/WhatsApp-Image-2019-01-04-at-11.17.50.jpeg";
const equipeImg3 = "https://agitamorango.com.br/wp-content/uploads/2024/04/por-que-recreacao-infantil-e-fundamental.jpg.webp";

const QuemSomos = () => {
  return (
    <>
      <SEO
        title="Quem Somos | Vivalegria Recreação"
        description="Conheça a Vivalegria: referência em entretenimento infantil, combinando o encanto da infância com experiências recreativas educativas e memoráveis."
        canonical="/quem-somos"
      />
      <div className="min-h-screen">
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
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FFD836]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">
                  Quem Somos
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Fundada com o propósito de enriquecer a vida das crianças por meio da
                  recreação, a Vivalegria é hoje um referencial em entretenimento infantil.
                  Com uma equipe de especialistas em diversão, combinamos o encanto da infância
                  com experiências recreativas educativas e memoráveis.
                </p>
              </Card>
              <img
                src={equipeImg1}
                alt="Equipe Vivalegria em ação com crianças felizes"
                className="rounded-2xl shadow-lg object-cover h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="py-16 bg-[#FFF8E6]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-row-reverse">
              <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FF731D]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">
                  Nossa Missão
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Nossa missão é criar momentos inesquecíveis onde a alegria e o aprendizado
                  se entrelaçam de forma mágica. Em cada evento, festa ou encontro, garantimos
                  que cada risada ressoe e cada experiência seja projetada com carinho e atenção
                  aos detalhes. Buscamos ser referência no setor como a maior e melhor escolha
                  dos nossos clientes, proporcionando experiências que marcam vidas e criam
                  memórias duradouras.
                </p>
              </Card>
              <img
                src={equipeImg2}
                alt="Recreadores profissionais animando festa infantil"
                className="rounded-2xl shadow-lg object-cover h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Nossa Paixão */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#73B6F0]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">
                  Nossa Paixão
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Nossa paixão é proporcionar a crianças e famílias um espaço onde a imaginação
                  comanda, a criatividade floresce e a diversão nunca termina. Com respeito pela
                  individualidade de cada pequeno e um olhar sempre atento à segurança e ao
                  bem-estar, a Vivalegria é mais do que uma empresa de recreação: é uma aliada da
                  infância, um berço de momentos preciosos e uma guardiã de sorrisos.
                </p>
              </Card>
              <img
                src={equipeImg3}
                alt="Crianças e monitores em momento de pura alegria"
                className="rounded-2xl shadow-lg object-cover h-full w-full"
                loading="lazy"
              />
            </div>
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
