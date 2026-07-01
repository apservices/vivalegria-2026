import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

// Imagens reais Vivalegria (CAMINHOS CORRIGIDOS)
import quemSomosImg from "@/assets/quem-somos-pintura.jpg";
import missaoImg from "@/assets/missao-grupo.jpg";
import paixaoImg from "@/assets/paixao-movimento.jpg";
import mascoteSucesso from "@/assets/mascote-sucesso.png";
import quemSomosVideo from "../../public/videos/quem-somos-bg.mp4.asset.json";

const QuemSomos = () => {
  return (
    <>
      <SEO
        title="Quem Somos | Vivalegria Recreação Infantil em São Paulo"
        description="Conheça a Vivalegria: mais de +300 profissionais, 500+ eventos e paixão por transformar festas infantis em memórias inesquecíveis em São Paulo."
        canonical="/quem-somos"
      />
      <JsonLd type="about-page" />
      <JsonLd
        type="breadcrumb"
        breadcrumbItems={[
          { name: "Início", path: "/" },
          { name: "Quem Somos", path: "/quem-somos" },
        ]}
      />

      <div className="min-h-screen">
        {/* HERO COM VÍDEO DE FUNDO */}
        <section className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
              src={quemSomosVideo.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold">
              Quem Somos
            </h1>
            <p className="text-white/90 mt-4 max-w-2xl text-lg">
              Mais do que recreação infantil, criamos experiências que ficam para sempre.
            </p>
          </div>
        </section>

        {/* QUEM SOMOS */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FFD836]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">
                  Quem Somos
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Vivalegria nasceu do desejo genuíno de valorizar a infância.
                  Acreditamos que brincar é essencial para o desenvolvimento emocional,
                  social e criativo das crianças.
                  <br /><br />
                  Com uma equipe brasileira preparada, acolhedora e apaixonada pelo que faz,
                  transformamos cada encontro em uma experiência segura, divertida
                  e cheia de significado para crianças e famílias.
                </p>
              </Card>

              <img
                src={quemSomosImg}
                alt="Criança participando de atividade artística na Vivalegria"
                className="rounded-2xl shadow-lg object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* NOSSA MISSÃO */}
        <section className="py-20 bg-[#FFF8E6]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <img
                src={missaoImg}
                alt="Crianças e recreadores Vivalegria em atividade coletiva"
                className="rounded-2xl shadow-lg object-cover w-full h-full"
                loading="lazy"
              />

              <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#FF731D]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">
                  Nossa Missão
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Criar experiências inesquecíveis onde alegria, cuidado e segurança
                  caminham juntos.
                  <br /><br />
                  Cada atividade é planejada com atenção aos detalhes, respeitando
                  a individualidade de cada criança e oferecendo tranquilidade
                  para os pais em todos os momentos do evento.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* NOSSA PAIXÃO */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <Card className="p-8 md:p-12 shadow-card border-t-4 border-[#73B6F0]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-6">
                  Nossa Paixão
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Nossa paixão é ver crianças sendo crianças:
                  criando, explorando, rindo e se movimentando livremente.
                  <br /><br />
                  A Vivalegria acredita no brincar como linguagem universal da infância,
                  fortalecendo vínculos, imaginação e memórias afetivas que permanecem
                  para toda a vida.
                </p>
              </Card>

              <img
                src={paixaoImg}
                alt="Criança brincando ao ar livre em atividade da Vivalegria"
                className="rounded-2xl shadow-lg object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* CTA FINAL COM MASCOTE */}
        <section className="py-20 bg-[#FFF3E6]">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <img
              src={mascoteSucesso}
              alt="Mascote Vivalegria"
              className="mx-auto mb-6 w-36"
              loading="lazy"
            />
            <h3 className="text-3xl md:text-4xl font-bold text-[#FF731D] mb-4">
              Vem viver a Vivalegria
            </h3>
            <p className="text-lg text-[#6B4F3F]">
              Um espaço onde a infância é respeitada, cuidada e celebrada.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default QuemSomos;
