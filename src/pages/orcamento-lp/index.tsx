import { HeadSEO } from "@/components/HeadSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Phone, Mail, CheckCircle2 } from "lucide-react";

// --- AQUI ESTÁ A CORREÇÃO IMPORTANTE: "export default" ---
export default function OrcamentoLP() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const nome = formData.get("nome");
    
    const text = `Olá! Me chamo ${nome} e gostaria de um orçamento para minha festa.`;
    window.open(`https://wa.me/5511965982251?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <HeadSEO
        title="Solicite seu Orçamento | Vivalegria Recreação"
        description="Receba uma proposta personalizada para a festa do seu filho. Recreação, oficinas e muita diversão."
        path="/orcamento-lp"
      />

      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
                Vamos planejar a festa perfeita?
              </h1>
              <p className="text-lg text-gray-700">
                Preencha o formulário e receba uma proposta personalizada com as melhores opções de recreação.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 h-6 w-6" />
                <span className="text-gray-700 font-medium">Equipe qualificada e uniformizada</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 h-6 w-6" />
                <span className="text-gray-700 font-medium">Materiais lúdicos inclusos</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 h-6 w-6" />
                <span className="text-gray-700 font-medium">Pontualidade e compromisso</span>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-t-4 border-t-orange-500">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-gray-800">Solicitar Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Nome Responsável
                  </label>
                  <Input name="nome" placeholder="Seu nome completo" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> WhatsApp
                    </label>
                    <Input name="whatsapp" placeholder="(11) 99999-9999" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Data do Evento
                    </label>
                    <Input name="data" type="date" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> E-mail (opcional)
                  </label>
                  <Input name="email" type="email" placeholder="seu@email.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Detalhes do Evento</label>
                  <Textarea 
                    name="detalhes" 
                    placeholder="Conte um pouco sobre a festa: idade das crianças, local, quantidade aproximada..." 
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                >
                  Receber Orçamento no WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  );
}