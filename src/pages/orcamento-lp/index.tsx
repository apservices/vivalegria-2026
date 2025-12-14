import { HeadSEO } from "@/components/HeadSEO";
// Importe seu componente de orçamento aqui (ajuste o caminho)
import { ConfiguradorOrcamento } from "@/components/ConfiguradorOrcamento";

export default function OrcamentoLP() {
  return (
    <>
      <HeadSEO
        title="Orçamento Recreação Infantil | Vivalegria SP"
        description="Faça agora seu orçamento personalizado. Pacotes a partir de R$589. Resposta em minutos via WhatsApp."
        canonical="https://www.vivalegria.com.br/orcamento"
      />

      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
              Orçamento em 2 minutos
            </h1>
            <p className="text-xl text-gray-700">
              Preencha os dados e receba valores exatos via WhatsApp
            </p>
          </div>
          <ConfiguradorOrcamento />
        </div>
      </main>
    </>
  );
}
