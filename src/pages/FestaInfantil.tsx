import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const FestaInfantil = () => {
  return (
    <>
      <SEO
        title="Festa Infantil em SP | Recreação Profissional | Vivalegria"
        description="Festa infantil com recreação profissional em São Paulo. Recreadores treinados, oficinas criativas, pintura facial, caça ao tesouro. Vila Mariana, Moema, Morumbi, ABC."
        keywords="festa infantil SP, festa infantil São Paulo, recreação para festa infantil, animação festa infantil, festa infantil Vila Mariana, festa infantil Moema"
        canonical="/festa-infantil"
      />
      <JsonLd type="local-business" />
      <JsonLd
        type="service"
        serviceData={{
          name: "Festa Infantil com Recreação Profissional",
          description:
            "Recreação profissional para festas infantis em São Paulo: recreadores treinados, oficinas criativas e brincadeiras seguras.",
          price: 589.9,
          areaServed: [
            "São Paulo",
            "Vila Mariana",
            "Moema",
            "Santo Amaro",
            "Morumbi",
            "Pinheiros",
            "Jardins",
            "ABC Paulista",
          ],
        }}
      />
      <JsonLd
        type="breadcrumb"
        breadcrumbItems={[
          { name: "Início", path: "/" },
          { name: "Festa Infantil", path: "/festa-infantil" },
        ]}
      />

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Festa Infantil com Recreação Profissional em São Paulo
        </h1>

        <p className="text-lg text-muted-foreground max-w-3xl">
          A Vivalegria transforma festas infantis em experiências inesquecíveis,
          com recreadores treinados, atividades seguras e muita diversão para
          todas as idades. Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi,
          Pinheiros, Jardins e ABC Paulista.
        </p>
      </section>
    </>
  );
};

export default FestaInfantil;
