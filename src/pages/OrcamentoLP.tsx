import React from "react";
import SEO from "@/components/SEO";

const OrcamentoLP = () => {
  return (
    <>
      <SEO
        title="Orçamento de Recreação Infantil | Vivalegria"
        description="Solicite um orçamento personalizado para recreação infantil com a Vivalegria."
      />

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Solicite seu Orçamento
        </h1>

        <p className="text-lg text-muted-foreground max-w-3xl mb-6">
          Preencha os dados abaixo e receba um orçamento personalizado para o
          seu evento infantil. Nossa equipe entrará em contato rapidamente.
        </p>

        {/* Placeholder do formulário */}
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
