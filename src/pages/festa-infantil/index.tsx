import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Calculator, Heart, Sparkles, Star } from "lucide-react";

export default function FestaInfantil() {
  return (
    <>
      <HeadSEO
        title="Festa Infantil Inesquecível em São Paulo | Vivalegria"
        description="Transforme a festa do seu filho em um momento mágico com recreação premium. Monitores qualificados, oficinas criativas e muita alegria. Orçamento grátis!"
        canonical="https://www.vivalegria.com.br/festa-infantil"
      />

      <main className="min-h-screen">
        {/* Hero Emocional */}
        <section className="relative bg-gradient-to-b from-orange-50 to-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-orange-600 mb-6">
              A festa que seu filho vai lembrar para sempre
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Recreação infantil com carinho, segurança e profissionalismo. 
              Mais de 500 famílias felizes em São Paulo e ABC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                <Calculator className="mr-2 h-5 w-5" />
                Simular minha festa agora
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Ver pacotes
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">5.0 (187 avaliações)</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                <span className="font-semibold">+500 festas realizadas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Seções adicionais virão em próximos passos */}
      </main>
    </>
  );
}
