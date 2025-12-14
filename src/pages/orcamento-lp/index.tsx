import { Button } from "@/components/ui/button";

export default function OrcamentoLP() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">
          Orçamento em 2 minutos
        </h1>

        <p className="text-xl text-gray-700 mb-10">
          Clique abaixo e faça seu orçamento personalizado com nossa equipe.
        </p>

        <Button
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-lg px-10 py-6"
          onClick={() => window.location.href = "/contratar"}
        >
          Fazer orçamento agora
        </Button>
      </div>
    </main>
  );
}
