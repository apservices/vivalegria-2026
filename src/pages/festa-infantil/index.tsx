import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Calculator, Heart, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function FestaInfantil() {
  const whatsappLink = "https://wa.me/5511965982251?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20recreação%20para%20festa%20infantil!";

  return (
    <>
      <HeadSEO
        title="Festa Infantil em São Paulo | Recreação Infantil Profissional"
        description="Festa infantil com recreação profissional em São Paulo. Segurança, alegria e diversão para crianças. Fale com a Vivalegria."
        path="/festa-infantil"
      />

      <main className="min-h-screen">
        {/* HERO - CORREÇÃO AQUI: Alterado de py-20 para pt-40 pb-20 */}
        <section className="bg-gradient-to-b from-orange-50 to-white pt-40 pb-20 px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-orange-600 mb-6">
            A festa que seu filho vai lembrar para sempre
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Recreação infantil com profissionais treinados, atividades criativas
            e total segurança para a sua tranquilidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={whatsappLink}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg w-full sm:w-auto"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Simular minha festa
              </Button>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg w-full sm:w-auto"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mt-12 text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">5.0 (180+ avaliações)</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Heart className="text-red-500 fill-red-500" />
              <span className="font-semibold">+500 festas realizadas</span>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div className="p-6 rounded-lg hover:bg-orange-50 transition-colors">
              <ShieldCheck className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Segurança Total
              </h3>
              <p className="text-gray-600">
                Equipe treinada, processos claros e cuidado com cada criança.
              </p>
            </div>

            <div className="p-6 rounded-lg hover:bg-orange-50 transition-colors">
              <Sparkles className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Diversão Garantida
              </h3>
              <p className="text-gray-600">
                Atividades lúdicas, oficinas criativas e muita interação.
              </p>
            </div>

            <div className="p-6 rounded-lg hover:bg-orange-50 transition-colors">
              <Heart className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Tranquilidade para os pais
              </h3>
              <p className="text-gray-600">
                Você aproveita a festa enquanto cuidamos de tudo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-orange-500 py-20 px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para uma festa inesquecível?
          </h2>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-100 px-10 py-6 text-lg font-bold"
            >
              Falar com a Vivalegria no WhatsApp
            </Button>
          </a>
        </section>
      </main>
    </>
  );
}