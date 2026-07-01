import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const OrcamentoLP = () => {
  return (
    <>
      <SEO
        title="Orçamento Recreação Infantil | Grátis e Rápido | Vivalegria"
        description="Peça agora seu orçamento gratuito de recreação infantil em São Paulo. Pacotes a partir de R$589,90. Vila Mariana, Moema, Santo Amaro, ABC Paulista."
        keywords="orçamento recreação infantil, orçamento festa infantil SP, cotação recreação São Paulo"
        canonical="/orcamento"
      />
      <JsonLd type="local-business" />
      <JsonLd
        type="breadcrumb"
        breadcrumbItems={[
          { name: "Início", path: "/" },
          { name: "Orçamento", path: "/orcamento" },
        ]}
      />

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Solicite seu Orçamento de Recreação Infantil
        </h1>

        <p className="text-lg text-muted-foreground max-w-3xl mb-6">
          Preencha os dados abaixo e receba um orçamento personalizado para o
          seu evento infantil em São Paulo. Nossa equipe entrará em contato
          rapidamente pelo WhatsApp.
        </p>

        <div className="rounded-xl border p-6 bg-muted/40">
          <p className="text-sm text-muted-foreground">
            Formulário de orçamento será exibido aqui.
          </p>
        </div>
      </section>
    </>
  );
};

export default OrcamentoLP;
