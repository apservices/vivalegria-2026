import React from "react";
import SEO from "@/components/SEO";

const FestaInfantil = () => {
  return (
    <>
      <SEO
        title="Festa Infantil | Vivalegria"
        description="Recreação infantil profissional para festas inesquecíveis."
      />

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Festa Infantil com Recreação Profissional
        </h1>

        <p className="text-lg text-muted-foreground max-w-3xl">
          A Vivalegria transforma festas infantis em experiências inesquecíveis,
          com recreadores treinados, atividades seguras e muita diversão para
          todas as idades.
        </p>
      </section>
    </>
  );
};

export default FestaInfantil;
