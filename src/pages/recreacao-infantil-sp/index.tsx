import HeadSEO from "../../components/HeadSEO";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  MapPin,
} from "lucide-react";

export default function RecreacaoInfantilSP() {
  return (
    <>
      <HeadSEO
        title="Recreação Infantil em São Paulo | Vivalegria"
        description="Recreação infantil profissional em São Paulo para festas, condomínios e eventos. Equipe treinada, segurança e diversão garantida."
        path="/recreacao-infantil-sp"
      />

      <main className="min-h-screen">
        {/* HERO */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-20 px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-orange-600 mb-6">
            Recreação Infantil em São Paulo
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Profissionais especializados em recreação infantil para festas,
            eventos e condomínios em São Paulo. Segurança, alegria e tranquilidade
            para os pais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Simular recreação
            </Button>

            <a
              href="https://wa.me/5511965982251"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-10 mt-12 flex-wrap">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">5.0 (180+ avaliações)</span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" />
              <span className="font-semibold">+500 eventos realizados</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="text-orange-500" />
              <span className="font-semibold">Atendemos toda SP</span>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div>
              <ShieldCheck className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Segurança em Primeiro Lugar
              </h3>
              <p className="text-gray-600">
                Equipe treinada, processos claros e cuidado individual com cada
                criança.
              </p>
            </div>

            <div>
              <Sparkles className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Atividades Criativas
              </h3>
              <p className="text-gray-600">
                Brincadeiras, oficinas e dinâmicas adaptadas à idade das
                crianças.
              </p>
            </div>

            <div>
              <Heart className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Tranquilidade para os Pais
              </h3>
              <p className="text-gray-600">
                Você aproveita o evento enquanto cuidamos da diversão.
              </p>
            </div>
          </div>
        </section>

        {/* PROVA SOCIAL */}
        <section className="bg-orange-50 py-20 px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-orange-600">
            Por que escolher a Vivalegria?
          </h2>

          <p className="max-w-3xl mx-auto text-gray-700 text-lg mb-10">
            Somos referência em recreação infantil em São Paulo, com foco em
            segurança, qualidade e experiências inesquecíveis.
          </p>

          <div className="flex justify-center gap-10 flex-wrap">
            <div className="font-semibold">✔ Profissionais certificados</div>
            <div className="font-semibold">✔ Atendimento humanizado</div>
            <div className="font-semibold">✔ Estrutura completa</div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-orange-500 py-20 px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Precisa de recreação infantil em São Paulo?
          </h2>

          <p className="text-lg mb-8">
            Fale agora com nossa equipe e receba uma proposta personalizada.
          </p>

          <a
            href="https://wa.me/5511965982251"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-100 px-10 py-6 text-lg"
            >
              Falar com a Vivalegria no WhatsApp
            </Button>
          </a>
        </section>
      </main>
    </>
  );
}
