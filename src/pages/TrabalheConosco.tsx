import { Link } from "react-router-dom";
import { Heart, Users, Clock, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const TrabalheConosco = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Ambiente Alegre",
      description: "Trabalhe em um ambiente descontraído e cheio de energia positiva",
    },
    {
      icon: Users,
      title: "Equipe Unida",
      description: "Faça parte de uma equipe colaborativa e apaixonada pelo que faz",
    },
    {
      icon: Clock,
      title: "Flexibilidade",
      description: "Horários flexíveis que se adaptam à sua rotina",
    },
    {
      icon: Star,
      title: "Crescimento",
      description: "Oportunidades de desenvolvimento profissional e treinamentos",
    },
  ];

  return (
    <>
      <SEO
        title="Trabalhe Conosco | Vagas para Recreadores SP | Vivalegria"
        description="Faça parte da equipe Vivalegria em São Paulo. Vagas para recreadores e monitores de eventos infantis. Cadastre-se e trabalhe em festas que emocionam."
        canonical="/trabalhe-conosco"
      />
      <JsonLd
        type="job-posting"
        jobData={{
          title: "Recreador Infantil - São Paulo",
          description:
            "Vagas para recreadores infantis freelancers em São Paulo. Cadastre-se para atuar em festas, eventos corporativos e escolas com a Vivalegria.",
          employmentType: "PART_TIME",
        }}
      />
      <JsonLd
        type="breadcrumb"
        breadcrumbItems={[
          { name: "Início", path: "/" },
          { name: "Trabalhe Conosco", path: "/trabalhe-conosco" },
        ]}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-[#FFD836]/20 via-white to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trabalhe Conosco
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Venha fazer parte da equipe que transforma festas em momentos mágicos!
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Por que trabalhar na Vivalegria?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:-translate-y-1 transition-transform"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#FFD836]/20 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-[#FF731D]" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-[#FFF8E6]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                O que buscamos
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#FF731D]">
                    Perfil desejado
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Paixão por trabalhar com crianças",
                      "Energia e disposição para eventos",
                      "Boa comunicação e simpatia",
                      "Responsabilidade e pontualidade",
                      "Criatividade e proatividade",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF731D] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#FF731D]">
                    Diferenciais
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Experiência com recreação infantil",
                      "Formação em Pedagogia, Educação Física ou áreas afins",
                      "Conhecimento em oficinas criativas",
                      "Disponibilidade para finais de semana",
                      "Veículo próprio",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD836] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA para Cadastro Completo */}
        <section className="py-16 bg-gradient-to-r from-[#FF731D] to-[#FFD836]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para fazer parte da equipe?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Faça seu cadastro profissional completo — é rápido, dividido em etapas
              e nos ajuda a te chamar para os eventos certos.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/cadastro-recreador">
                Fazer Cadastro Completo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default TrabalheConosco;
