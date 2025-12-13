import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import Mascote from "@/components/Mascote";

const Obrigado = () => {
  return (
    <>
      <SEO
        title="Obrigado | Vivalegria"
        description="Obrigado por escolher a Vivalegria! Em breve entraremos em contato para confirmar os detalhes do seu evento."
        canonical="/obrigado"
      />
      <section className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-card p-8 md:p-12 text-center overflow-hidden">
            <Mascote
              pose="sucesso"
              animation="pulinho"
              className="w-48 md:w-56 lg:w-64 mx-auto mb-6"
            />
            <div className="space-y-4 max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Obrigado por escolher a Vivalegria! ?? Seu evento vai ser incrÃ­vel!
              </h1>
              <p className="text-muted-foreground text-lg">
                Em breve entraremos em contato para confirmar todos os detalhes.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/">Voltar para Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Obrigado;
