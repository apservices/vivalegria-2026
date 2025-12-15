import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Users, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function EventosCorporativosInfantis() {
  return (
    <>
      <HeadSEO
        title="Recreação Infantil para Eventos Corporativos | Vivalegria"
        description="Recreação infantil profissional para SIPAT, Family Day, datas comemorativas e eventos corporativos em São Paulo. Entretenimento seguro para filhos de colaboradores."
        canonical="https://www.vivalegria.com.br/eventos-corporativos-infantis"
      />

      <main className="min-h-screen">
        {/* HERO */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-orange-600 mb-6">
              Recreação Infantil para Eventos Corporativos
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Transforme seu evento corporativo em um dia inesquecível para colaboradores e suas famílias. 
              SIPAT, Family Day, datas comemorativas e confraternizações com recreação premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Solicitar orçamento corporativo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Falar com especialista
              </Button>
            </div>

            <div className="flex justify-center gap-8 flex-wrap text-gray-700">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-orange-500" />
                <span className="font-semibold">Empresas e condomínios</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-500" />
                <span className="font-semibold">Equipe dedicada</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
                <span className="font-semibold">Segurança total</span>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS CORPORATIVOS */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-orange-600 mb-12">
              Por que incluir recreação infantil no seu evento corporativo?
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-orange-50 p-8 rounded-xl">
                <Users className="mx-auto h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Engajamento familiar</h3>
                <p className="text-gray-600">Colaboradores trazem a família e se sentem valorizados.</p>
              </div>

              <div className="bg-orange-50 p-8 rounded-xl">
                <Star className="mx-auto h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Clima organizacional</h3>
                <p className="text-gray-600">Fortalece a cultura da empresa e a retenção de talentos.</p>
              </div>

              <div className="bg-orange-50 p-8 rounded-xl">
                <ShieldCheck className="mx-auto h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Tranquilidade total</h3>
                <p className="text-gray-600">Você cuida do evento, nós cuidamos das crianças com segurança.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-orange-500 py-20 px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Leve diversão de qualidade para seu próximo evento corporativo
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Orçamento personalizado em minutos. Atendemos empresas em São Paulo e região.
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-100 text-lg px-10 py-6">
            Solicitar proposta corporativa
          </Button>
        </section>
      </main>
    </>
  );
}